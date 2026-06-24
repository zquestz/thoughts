+++
title = "Demystifying StartupWMClass"
date = "2026-06-23"
author = "quest"
authorTwitter = "zquestz"
cover = "images/startup-wm-class.webp"
coverCredit = "StartupWMClass"
tags = ["code", "linux"]
keywords = ["code", "linux"]
summary = "Eventually, every Linux user opens an app and finds a generic placeholder icon staring back from their dock/panel. It looks like the dock is broken, but it almost never is - the cause is a single line in the app's .desktop file, and it only takes a minute to fix. Here's how to find it and fix it yourself, on any desktop."
+++

Eventually, every Linux user opens an app and finds a generic placeholder icon staring back from their dock/panel. It looks like the dock is broken, but it almost never is - the cause is a single line in the app's `.desktop` file, and it only takes a minute to fix. Here's how to find it and fix it yourself, on any desktop.

## Anatomy of a Desktop File

Every app you launch from a menu, dock, or panel is backed by a `.desktop` file: a small text file telling your system what to run, what to call it, and which icon to show. These live in `/usr/share/applications/` for system-wide apps, and `~/.local/share/applications/` for your own. Let's look at a real one, the file that ships with Tor Browser.

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Tor Browser
Exec=tor-browser %u
Icon=tor-browser
Categories=Network;WebBrowser;Security;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;application/x-xpinstall;application/pdf;application/json;
Comment=Anonymous browsing using Firefox and Tor
StartupWMClass=tor-browser
```

Each line is a `key=value` pair from the freedesktop [Desktop Entry Specification](https://specifications.freedesktop.org/desktop-entry-spec/latest/). The ones worth knowing:

- `[Desktop Entry]`: the header every desktop file starts with.
- `Version`: the version of the Desktop Entry Specification the file follows, not the app's own version (a frequent mix-up).
- `Type`: the kind of entry; `Application` means it launches a program.
- `Name`: the label shown in menus, docks, and panels.
- `Exec`: the command to run; `%u` gets replaced with a URL when you open one.
- `Icon`: the icon to display, either a name looked up in your icon theme or an absolute path to an icon file.
- `Categories`: the menu sections the app shows up under.
- `MimeType`: the file types and link schemes it can open.
- `Comment`: the tooltip text.
- `StartupWMClass`: the field this whole post is about. More on it next.

## What is StartupWMClass?

Open an app and a window appears, but how does your dock know which launcher it belongs to? It needs to pair the two, so the window groups under the right icon instead of showing the generic placeholder from earlier. `StartupWMClass` is one of the hints that makes that pairing work. As the spec puts it, a desktop file with this key is known to "map at least one window with the given string as its WM class or WM name hint." In plain terms: it tells your dock what the app's window will call itself, so the two can be matched.

Here's the important part: `StartupWMClass` is only one of those hints. For example, [Plank Reloaded](https://github.com/zquestz/plank-reloaded) matches windows to launchers using [BAMF](https://launchpad.net/bamf), which also looks at the application identifier and the binary name. If an app's window already lines up with its launcher through either of those, the dock can find the right icon on its own, and `StartupWMClass` isn't needed at all. That's also why a wrong value is worse than none: a bad `StartupWMClass` overrides the signals that would have worked, pointing the dock at a window class that never appears.

This also explains why a broken icon sometimes looks low-quality rather than missing. A matched window uses the crisp icon from the file's `Icon` entry; an unmatched one falls back to the icon the app embedded in its window, often low-resolution. Same cause, subtler symptom.

## Finding the WM_CLASS

To set `StartupWMClass` correctly, or to confirm an existing value is wrong, you need to know what the window actually calls itself. That identity is its `WM_CLASS` (or, on Wayland, its `app_id`). It's case-sensitive and often isn't the name you'd guess, so it's worth reading the real value rather than assuming. How you do that depends on your setup, so here's the approach for X11, Wayland, and KDE.

### X11

On X11, the classic tool is `xprop`. Open the app with the broken icon, run this in a terminal, and your cursor turns into crosshairs:

```sh
xprop WM_CLASS
```

Click the application's window and it prints the value. For Tor Browser:

```text
WM_CLASS(STRING) = "Navigator", "Tor Browser"
```

There are two strings: the instance name first, the class second. Either can serve as a `StartupWMClass`, but the more specific one is the safer choice. Here, `Navigator` is the generic name that Firefox-based browsers share, while `Tor Browser` is unique to this app. Notice that neither string is `tor-browser`, the value the file actually ships with. That mismatch is a bug, and we'll fix it shortly.

### Wayland

Wayland is stricter than X11: for security, applications can't freely inspect each other's windows, so `xprop` only works for apps running through XWayland. Native Wayland apps don't expose a `WM_CLASS` at all. Instead they set an `app_id`, and that's the value your desktop matches against.

On GNOME, the easiest way to read it is the built-in Looking Glass debugger. Press `Alt + F2`, type `lg`, and hit Enter, then switch to the **Windows** tab. Find your app in the list, and the **WMClass** column shows the value you'd use for `StartupWMClass`.

### KDE

KDE Plasma has its own tool that works on both X11 and Wayland, so there's no need for `xprop` or Looking Glass here. In **System Settings**, search for **Window Rules**, click **Add New...**, then click **Detect Window Properties**. Your cursor turns into crosshairs.

Click inside the target window, not its title bar, and KDE shows a summary of that window. The **Window class** value is the one to drop into `StartupWMClass`.

## Fixing the Icon

So `tor-browser.desktop` ships a `StartupWMClass` that matches no real window. Before we change it, one caution: the file lives in `/usr/share/applications/`, and editing it there means your fix gets wiped on the next package update.

The durable approach is to override it. Copy the file into your personal applications directory, which takes precedence over the system copy:

```sh
mkdir -p ~/.local/share/applications
cp /usr/share/applications/tor-browser.desktop ~/.local/share/applications/
```

Edit that copy instead, and the change sticks through every update.

The fix is either of these:

- **Delete the line.** Since the binary (`tor-browser`) and the desktop file (`tor-browser.desktop`) already share a name, your dock can identify the app on its own. The bad hint was the only thing in the way.
- **Correct the line.** Set it to the value you found: `StartupWMClass=Tor Browser`.

Either works. Removing it is the cleaner choice here, since the field was never needed in the first place.

Save the file, and most docks update the icon right away.

## When You Actually Need It

Tor Browser was the easy case: its binary and desktop file already matched, so removing the bad hint was enough. Sometimes it isn't. If you delete `StartupWMClass` and the icon is still broken, it's because the app's window doesn't identify itself in a way your dock can connect to the launcher on its own. A few common culprits:

- **Electron apps.** Many ship a generic or mismatched `WM_CLASS` that lines up with neither the binary nor the desktop file. (More on why in the next section.)
- **Snap and Flatpak.** The app runs inside a sandbox wrapper, so the process your dock sees isn't the application itself, and the names don't line up.
- **Wrapper scripts.** The launcher runs a shell script that execs the real program, so the binary name the dock matches against isn't the one you'd expect.

In all of these, the automatic matching has nothing to grab onto, and `StartupWMClass` is what bridges the gap. Find the real value and set it explicitly. That's exactly what the field is for.

## Why Apps Get This Wrong

If the fix is this simple, why do so many projects ship `StartupWMClass` broken in the first place? Most of the time, it's a guess. A packager assumes the window will identify itself by the binary or the desktop-file name, writes that into the field, and never confirms it with `xprop`. Tor Browser is the textbook example: `tor-browser` is a perfectly reasonable guess, but as we saw, the window calls itself something else.

The bigger offenders are cross-platform frameworks. Electron derives a window's identity from the app's build config, but not consistently: it lowercases the `WM_CLASS` while keeping the original case for the Wayland `app_id`, so the two no longer match. That single inconsistency is why so many Electron apps, Slack and Discord among them, land in your dock as a generic icon. Thunderbird has its own long history of `WM_CLASS` quirks that shift between X11 and Wayland.

The thread running through all of them is the same: the identity an app declares has drifted from the one its window actually reports.

## Final Thoughts

Broken application icons look like a desktop bug, but almost always they trace back to one line in a `.desktop` file. `StartupWMClass` is optional, so the first thing to try is removing it. When an app genuinely needs the hint, reading its real `WM_CLASS` tells you the value to set. Either way, you're a one-line edit and a minute away from a fixed icon.

That's the whole trick. No magic, no dock to blame, just a window and a launcher that need to agree on a name. Stupidly simple, once you know where to look.
