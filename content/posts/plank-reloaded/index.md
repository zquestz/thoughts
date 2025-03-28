+++
title = "Plank Reloaded: Still Stupidly Simple"
date = "2025-01-19"
author = "quest"
authorTwitter = "zquestz"
cover = "images/plank-reloaded.webp"
coverCredit = "Plank Reloaded"
tags = ["code", "linux"]
keywords = ["code", "linux"]
summary = "When Plank first emerged, it promised to be the simplest dock on the planet. Today, Plank Reloaded carries that torch forward, bringing modern updates and solid Cinnamon desktop support while maintaining that same commitment to simplicity."
+++

When [Plank](https://launchpad.net/plank) first emerged, it promised to be the simplest dock on the planet. Today, [Plank Reloaded](https://github.com/zquestz/plank-reloaded) carries that torch forward, bringing modern updates and solid Cinnamon desktop support while maintaining that same commitment to simplicity.

## Why Plank Reloaded?

The original Plank served Linux users well for years, but [Cinnamon](https://projects.linuxmint.com/cinnamon/) desktop users (the default desktop environment of [Linux Mint](https://www.linuxmint.com/)) often encountered frustrating issues - particularly with docklets that would either malfunction or crash. As newer docks emerged for GNOME and Ubuntu, development of the original project slowed, leaving these issues unresolved. Rather than watch this valuable tool fade away, we decided to give it new life.

## Key Improvements

Plank Reloaded maintains the elegant simplicity of the original while fixing critical issues:

- **Enhanced Cinnamon Compatibility**: All docklets now work reliably with the Cinnamon desktop, no more crashes or unexpected behavior
- **Improved Clock Docklet**: Fixed settings stability and added calendar functionality when clicked
- **Refreshed Themes**: Updated Matte theme and introduced MatteLight based on the Arian theme

Best of all, Plank Reloaded remains API compatible with the original Plank, supporting all existing themes and configurations that have been created over the years.

## Themes

Plank Reloaded ships with four themes:

![Default Theme](images/default.webp)
_The Default theme ensures compatibility with the existing Plank ecosystem_

![Matte Theme](images/matte.webp)
_The Matte theme, based on [Arian's excellent work](https://github.com/arianXdev/arian-plank-theme), offers a modern, clean look_

![Matte Light Theme](images/matte-light.webp)
_The MatteLight theme, also based on [Arian's theme](https://github.com/arianXdev/arian-plank-theme), perfect for lighter desktop setups_

![Transparent Theme](images/transparent.webp)
_The Transparent theme blends seamlessly with any desktop environment_

All existing Plank themes work perfectly with Plank Reloaded, as we've been careful not to modify any default behaviors that themes might depend on.

## Modern Battery Integration

The Battery Docklet received a significant upgrade through the integration of modern [UPower](https://upower.freedesktop.org/) support. This improvement, originally developed by [Amogh Gaur](https://github.com/ammo0110), had been waiting as a [pull request](https://github.com/ricotz/plank/pull/8) since 2019! The new implementation:

- Uses the standardized UPower DBus interface
- Provides more accurate battery status information
- Shows correct battery icons on modern systems
- Updates reliably without manual intervention

The code maintains backwards compatibility, falling back to the original implementation when UPower isn't available. This ensures the Battery Docklet works across a wide range of Linux distributions while providing enhanced functionality on modern systems.

## Installation

Currently, Plank Reloaded is available in the [Arch User Repository](https://aur.archlinux.org/) (AUR) for Arch Linux users:

```bash
yay -S plank-reloaded-git
```

For users of other distributions, you'll need to build from source for now. Support for additional package managers is coming soon.

## Migration

Moving from the original Plank to Plank Reloaded is straightforward. Your existing configuration files and settings will work without modification. Simply:

1. Uninstall the original Plank
2. Install Plank Reloaded
3. Start using your dock

Since the binary is still called "plank", even your startup scripts will continue to work as before.

## Basic Usage

Accessing Plank's preferences is straightforward but not immediately obvious to new users. To open the preferences window:

- Hold down the Ctrl key and right-click anywhere on the dock, or
- Right-click near the edges (left/right) of the dock

From here you can:
- Change themes
- Adjust dock position and alignment
- Configure auto-hide behavior
- Manage docklets
- Set icon size and zoom effects

All preferences are saved automatically and take effect immediately, no restart required.

### Managing Applications

Adding and removing applications is simple:

- To add an application: Drag and drop its icon from your application menu to the dock
- To pin a running application: Right-click its icon and select "Keep in dock"
- To remove an application: Drag its icon off the dock, or right-click and uncheck "Keep in dock"
- To rearrange icons: Drag and drop them to new positions on the dock

You can also add folders by dragging them from your file manager to the dock for quick access.

## Looking Forward

While Plank Reloaded maintains the "stupidly simple" philosophy, we have some clear goals for the future:

- **Cinnamon First**: As the Cinnamon desktop environment evolves, we'll ensure Plank Reloaded stays compatible and reliable
- **Wayland Support**: Though currently focused on X11, we're exploring Wayland compatibility for future releases
- **New Docklets**: We're considering additional docklets while maintaining the balance of functionality and simplicity

## Getting Involved

Plank Reloaded is an open-source project that welcomes contributions of all kinds. Whether you're interested in code, testing, or documentation, here's how you can help:

- **Report Issues**: Found a bug? Let us know on our [GitHub Issues](https://github.com/zquestz/plank-reloaded/issues) page
- **Submit PRs**: Code contributions are welcome, just include a detailed description of what you're fixing or adding
- **Test New Releases**: Help ensure stability by testing new versions on your system
- **Get in Touch**: Feel free to reach out to me on [GitHub](https://github.com/zquestz) with questions

## Conclusion

Plank Reloaded shows that sometimes the simplest things just need a little polish. By focusing on stability and Cinnamon desktop compatibility while maintaining the original project's commitment to simplicity, we're ensuring this valuable tool continues to serve the Linux community.

Whether you're a long-time Plank user or just discovering it now, Plank Reloaded offers the same straightforward dock experience you want, with the reliability you need.
