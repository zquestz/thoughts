+++
title = "GeoClue TZ: Privacy-First Linux Location Service"
date = "2024-11-02"
author = "quest"
authorTwitter = "zquestz"
cover = "posts/geoclue-tz/images/geoclue-tz.webp"
coverCredit = "geoclue-tz"
tags = ["code", "linux", "privacy"]
keywords = ["code", "linux", "privacy"]
summary = "Linux location services provided by GeoClue have been historically unreliable. Whether it's VPN usage causing incorrect locations, rate limits from upstream services, or broken functionality after system upgrades, users often find themselves struggling with basic location-aware features."
+++

Linux location services provided by GeoClue have been historically unreliable. Whether it's VPN usage causing incorrect locations, rate limits from upstream services, or broken functionality after system upgrades, users often find themselves struggling with basic location-aware features.

My own experience with this came after upgrading to iwd for better wireless networking. I discovered my location services were completely broken. RedShift, which I rely on to reduce eye strain, stopped working correctly. This wasn't the first time I'd dealt with location services on Linux - traveling between time zones meant constantly reconfiguring RedShift with new coordinates. There had to be a better way.

Enter [geoclue-tz](https://github.com/zquestz/geoclue-tz), a simple solution I created that provides GeoClue with location data based on your system's time zone. This allows all GeoClue-enabled applications to automatically get the correct location information without relying on network-based geolocation. No more broken functionality after system upgrades, no more manual coordinate updates when traveling, and most importantly, no privacy concerns about sharing your precise location.

## A Simple Approach to Privacy

Traditional location services share your location with external services through your IP address or require GPS coordinates. Every time an application needs your location, these services make network requests, potentially exposing your whereabouts to multiple third parties. This creates both privacy and reliability issues: VPN usage causes incorrect locations, external services impose rate limits, and your precise location is continuously exposed.

I decided to take a different approach. Instead of querying external services, geoclue-tz uses your system's time zone information to update GeoClue directly. No network requests are made, no external services are queried, and no tracking occurs. Your location data never leaves your machine.

This time zone-based approach provides just enough location information for applications to work correctly. Night light features know when to activate, and location-aware applications function properly. For users who need more precision or want to maintain a specific location while using a VPN, custom locations can be configured locally. This puts you in control - use the privacy-preserving time zone approach or configure exact coordinates if desired. Either way, your location data stays on your machine.

## Making Location Work

geoclue-tz solves several common issues I've encountered:

- **iwd Migration**: Many Linux users are upgrading to iwd for better wireless networking, only to find their GeoClue functionality broken. geoclue-tz ensures all your location-aware applications continue working after the upgrade, no additional configuration required.

- **VPN Usage**: Using a VPN shouldn't break your system's location services. You can choose whether to use your actual time zone location or maintain your VPN location through a saved configuration. This flexibility ensures your applications work exactly as you intend, whether you're using a VPN for privacy, accessing geo-restricted content, or connecting to work.

- **Service Reliability**: External geolocation services can fail due to rate limits, service outages, or network issues. By using local time zone data, geoclue-tz eliminates these dependencies. Your location services work consistently, even without network connectivity.

- **Travel**: When traveling, your location-aware applications should update automatically. Instead of manually configuring coordinates for each new location, simply run geoclue-tz in your new time zone. All your applications update instantly with the correct location data.

- **Privacy**: Your location data never leaves your machine. There are no network requests, no third-party services, and no location tracking. You control exactly how precise your location information is, and where it's used.

- **Universal**: All applications using GeoClue automatically receive the correct location data. Whether it's RedShift adjusting your screen, Firefox requesting your location, or any other GeoClue-enabled application, they all work seamlessly with no additional configuration.

The solution is simple: provide GeoClue with time zone-based location data. This approach fixes multiple problems while maintaining privacy and simplicity.

## Installation and Usage

Getting started with geoclue-tz is straightforward:

```bash
# Install via Go
go install github.com/zquestz/geoclue-tz@latest

# Or on Arch Linux (AUR)
yay -S geoclue-tz
```

Basic usage requires root privileges to update `/etc/geolocation`:

```bash
# Update location based on time zone (requires root)
sudo geoclue-tz

# Optional: Update with custom location (requires root)
sudo geoclue-tz -l home

# Preview changes without root access
geoclue-tz -d
```

For custom locations, create `/etc/geoclue-tz.conf`:

```text
locations [
  {
    latitude = 19.520960
    longitude = 155.920517
    name = home
  }
]
```

After updating your location, all applications using GeoClue will immediately begin using the new settings. When traveling to a new time zone, simply run geoclue-tz again to update your location. If you're using a VPN and want to maintain a specific location, just configure that location and use the `-l` flag instead of the default time zone-based behavior.

## Conclusion

For Linux users looking for reliable location services that respect privacy, geoclue-tz offers a refreshing alternative. It just works, stays out of your way, and doesn't compromise your privacy.

The project is open source and welcomes contributions. Visit the [GitHub repository](https://github.com/zquestz/geoclue-tz) to learn more, report issues, or contribute to its development.
