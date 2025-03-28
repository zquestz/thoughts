+++
title = "A Quick Dive Into WebP"
date = "2022-09-01"
author = "quest"
authorTwitter = "zquestz"
cover = "images/webp-logo.webp"
coverCredit = "WebP Logo"
tags = ["imageproxy", "webp", "code"]
keywords = ["code", "imageproxy", "webp"]
summary = "After ignoring WebP for years, I finally decided to check it out. For a long time I thought PNG, GIF, JPG, and MP4 would be enough. Not anymore."
+++

After ignoring WebP for years, I finally decided to check it out. For a long time I thought PNG, GIF, JPG, and MP4 would be enough. Not anymore.

## A Little History

WebP was developed by Google to create [an image format for the web](https://developers.google.com/speed/webp/). A format that provides better compression, alpha channels (transparency), and even animation.

When Google released WebP to the world on September 30th 2010, browser support was non-existent, and that made it near impossible to evaluate. Projects needed to stick with standard formats (PNG, GIF, JPG). They couldn't risk serving next generation formats and have an asset not load correctly.

In addition, there were thousands of image processing tools on the web, and none of them supported WebP.

## Today is Different

Fast forward to 2022 and WebP is widely supported in [all major browsers](https://www.lambdatest.com/web-technologies/webp), graphics software, and image conversion tools.

For artists, designers and illustrators, they just export as WebP. It doesn't matter if they use Photoshop or [GIMP](https://www.gimp.org/).

Users of older, non-compatible browsers, need to upgrade to a modern browser anyways. Security is a spectrum, and keeping your browser up to date is an important ingredient.

This signals to me, WebP is now an acceptable default format. No more fallbacks, no more hacks. Just smaller, nicer images for everyone.

## The Real World

I like to think I am pragmatic, and recently WebP has enabled me to massively shrink my asset sizes.

Regularly, I deal with images hosted on [IPFS](https://ipfs.io). Many of them are high resolution PNGs, typically thousands of them, and they are being served off of slow IPFS gateways. Luckily, they are also extremely cacheable, as those contents will never change.

I use a caching resizer to generate optimized, cached assets, however it didn't support WebP encoding!

So I decided to [add WebP support](https://github.com/zquestz/imageproxy), and do some testing!

I even included [pngquant](https://pngquant.org/), as it is my favorite PNG compression utility!

[Original](https://clementinesnightmare.mypinata.cloud/ipfs/QmSCpGdCSo5iDXDdGcJRWA9kcB22MdBo1xwnoMpx1nj937/1169.png) - 2500px (6.7MB)

WebP - 500px (80.5kB)
![WebP](images/1169.webp)

PNG - 500px (295kB)
![PNG](images/1169.png)

PNG-pngquant - 500px (99.3kB)
![PNG](images/1169-pngquant.png)

Well, the results are impressive. The WebP output looks amazing and is < 30% of the PNG! Even when optimizing with `pngquant` the WebP file was smaller, was of higher quality, and didn't require post processing.

## WebP for Developers

Most developers will merely use WebP assets, and won't need the lower level libraries. However, if you want to encode/decode WebP files, then look no further.

The main C libraries are open-source and available at: [developers.google.com](https://developers.google.com/speed/webp/download)

One would think that WebP would be fully supported in Go, since it was also developed at Google. However, as of Go 1.19, WebP encoding is not supported in the standard library!

If you are looking for WebP encoding in Go, and don't mind including a C dependency, [github.com/kolesa-team/go-webp](https://github.com/kolesa-team/go-webp) works great.

## Conclusion

Use WebP and serve your assets in [modern formats](https://web.dev/uses-webp-images/). The web will thank you.
