+++
title = "Exploring Infinite Zoom"
date = "2023-07-15"
author = "quest"
authorTwitter = "zquestz"
cover = "posts/infinite-zoom/images/infinite-zoom.webp"
coverCredit = "Infinite Zoom"
tags = ["infinite", "zoom", "code"]
keywords = ["infinite", "zoom", "code"]
summary = "Today, my friend Jeremiah brought up infinite zoom effects and started doing some research on how to create them. After a bit of time, he sent me over detailed documentation on creating infinite zoom effects, and asked me to translate the technical pieces. This is how the rabbit hole began. I just had to try it, so this blog will detail my own journey creating an infinite zoom using Midjourney!"
+++

Today, my friend Jeremiah brought up infinite zoom effects and started doing some research on how to create them. Here's a quick example for those of you who haven't seen them before.

{{< youtube Q-iZMkvHnFw >}}

After a bit of time, he sent me over [detailed documentation on creating infinite zoom effects](https://beltoforion.de/en/infinite_zoom/index.php), and asked me to translate the technical pieces. This is how the rabbit hole began.

I just had to try it, so this blog will detail my own journey creating an infinite zoom using [Midjourney](https://www.midjourney.com/)!

## Prompts

First, I needed to start creating prompts. In total I created 21 unique images. Here are the prompts I used:

- Two dragons, Quetzalcoatl and a Chinese Dragon are at the top of mount olympus --s 720 --ar 16:9 --v 5
- Two dragons, Quetzalcoatl and a Chinese Dragon are at the top of mount olympus --s 720 --ar 16:9 --v 5 --zoom 2
- A look through an opening into a mystical land --s 720 --v 5 --ar 16:9 --zoom 2
- A mythical land seen through a rectangular mirror with an ornate frame --s 720 --v 5 --ar 16:9 --zoom 2
- An ornate room hidden inside of a pyramid --s 720 --v 5 --ar 16:9 --zoom 2 (x2)
- The Cosmos creating a vision into a pyramid --s 720 --v 5 --ar 16:9 --zoom 2 (x2)
- Eye shaped portal to another dimension --s 720 --v 5 --ar 16:9 --zoom 2
- Mayan Temple --s 720 --v 5 --ar 16:9 --zoom 2 (x3)
- Amazon rain forest --s 720 --v 5 --ar 16:9 --zoom 2 (x3)
- Disolves into darkness --s 720 --v 5 --ar 16:9 --zoom 2 (x2)
- Papyrus map --s 720 --v 5 --ar 16:9 --zoom 2 (x2)
- Desk with papyrus map on it --s 720 --v 5 --ar 16:9 --zoom 2
- Adventurers and archaeologists office space with bright lights and a desk --s 720 --v 5 --ar 16:9 --zoom 2

The images produced were not exactly what I wanted, but since this was a test run, I used what was generated.

## Video Generation

[AI-Infinite-Zoom-Generator](https://github.com/beltoforion/AI-Infinite-Zoom-Generator) was used to generate the video and stitch all the images together. The install was painless on my Arch Linux box. It just needed a couple dependencies (`python-opencv` and `python-rawpy`) and then it was ready to go.

I put all the generated images in the `story` directory, then ran:

```
python ./infinite_zoom.py -as -i ./story -o story.mp4 
```

This created `story.mp4` which you can see below!

{{< youtube tm45MA63Or8 >}}

## Final Thoughts

Generating these videos is actually quite easy, and a lot of fun. Midjourney doesn't always generate exactly what you want, but with enough patience you can get amazing results.

Now go and create some epic infinite zoom videos!