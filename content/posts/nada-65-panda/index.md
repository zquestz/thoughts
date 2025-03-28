+++
title = "The Nada 65 Panda: A QMK Success Story"
date = "2024-12-30"
author = "quest"
authorTwitter = "zquestz"
cover = "images/nada-65-panda.webp"
coverCredit = "Nada 65 Panda"
tags = ["code", "hardware", "keyboards"]
keywords = ["code", "hardware", "keyboards"]
summary = "The Cerakey Nada 65 Panda is the world's first keyboard featuring ceramic keycaps, designed to deliver the smoothest and thockiest typing possible. When I first heard about it, I knew I had to try it - the promise of ceramic keycaps was too intriguing to pass up. The keyboard arrived in beautiful packaging, and the build quality exceeded my expectations."
+++

The [Cerakey Nada 65 Panda](https://www.cerakey.com/products/nada-65-panda-keyboard) is the world's first keyboard featuring ceramic keycaps, designed to deliver the smoothest and thockiest typing possible. When I first heard about it, I knew I had to try it - the promise of ceramic keycaps was too intriguing to pass up. The keyboard arrived in beautiful packaging, and the build quality exceeded my expectations.

However, those initial moments of joy would face some hurdles. Surprisingly, after resolving several firmware issues, the Nada 65 Panda hasn't just recovered - it has become my daily driver, surpassing everything else in my collection.

## Early Issues

My excitement after unboxing quickly faded when I first plugged the keyboard into my Linux system. It would become unresponsive after just a few minutes, with even the RGB lighting patterns freezing in place. After years of using mechanical keyboards, I'd never encountered such issues with a brand-new board - especially not with high-end hardware. I needed to determine whether this was a hardware defect or something fixable through software updates.

## The QMK Journey

After hunting for solutions, I found myself on [Cerakey's download page](https://www.cerakey.com/pages/download-x), which included QMK firmware source code for the keyboard. [QMK](https://qmk.fm/) is an open-source keyboard firmware that powers many custom mechanical keyboards, so finding QMK support was promising. However, my optimism faded when I examined the code.

The firmware needed significant work:

- Documentation referenced the wrong keyboard model
- Compiler showed multiple warning messages
- Basic set-up instructions were missing from the README

Despite these issues, installing the updated firmware fixed all the stability problems. The keyboard no longer crashed or froze - it worked exactly as intended.

## Building a Better Solution

With the keyboard now stable, I turned my attention to cleaning up the firmware. The compiler warnings needed addressing, proper documentation was essential, and the keyboard needed to show up correctly when using Via for configuration (Via enables key remapping and RGB control). Instead of keeping my fixes private, I created an updated version that addresses these shortcomings and includes comprehensive documentation. You can find the code at [github.com/zquestz/nada65panda](https://github.com/zquestz/nada65panda).

If you have a Nada 65 Panda, you have two options:

### Option 1: Pre-compiled Firmware

For the simplest solution, use the pre-compiled files in the repository. These can be flashed directly to your keyboard without setting up a development environment.

### Option 2: Compile Your Own

For those who prefer to compile from source, here's the process:

1. Set up QMK on your system
2. Copy the nada65panda folder to your QMK keyboards directory:

```sh
mkdir -p ~/src/qmk_firmware/keyboards/cerakey
cp -r nada65panda ~/src/qmk_firmware/keyboards/cerakey/
```

3. Build the firmware with Via support:

```sh
make cerakey/nada65panda:via
```

4. Flash the new firmware:

```sh
qmk flash cerakey_nada65panda_via.bin
```

### Entering Bootloader Mode

To flash either version:

1. Disconnect the keyboard
2. Hold the `ESC` key
3. Connect the keyboard while holding `ESC`
4. Release `ESC` when flashing begins
5. Reconnect the keyboard after flashing completes

## The Typing Experience

After resolving the firmware issues, I've used the Nada 65 Panda for over a month without a single hiccup. It replaced my trusty GMMK2, which was already an excellent keyboard, but the ceramic keycaps deliver something extraordinary.

Each keystroke feels remarkably smooth and produces a satisfying thock sound. I've tested countless keyboards over the years, but none have matched this combination of precision and feedback. The feel and sound are simply more enjoyable than anything else I've tried.

These keycaps impressed me so much that I couldn't resist ordering Cerakey's new [Dragon Novelty Set](https://www.cerakey.com/products/dragon-novelty-ceramic-keycap-set). Their mastery of ceramic has brought something truly unique to the keyboard world.

## Conclusion

What began as troubleshooting a firmware issue with the Nada 65 Panda evolved into an opportunity to improve the keyboard for the entire community. For those considering this keyboard - the combination of ceramic keycaps and enhanced firmware make it a compelling choice. Despite the rocky start, I've found something special here. The unique feel and sound of the ceramic keycaps have created a typing experience that keeps me coming back for more.
