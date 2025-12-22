+++
title = "s 0.7.5 - A Maintenance Release"
date = "2025-12-21"
author = "quest"
authorTwitter = "zquestz"
cover = "images/maintenance.webp"
coverCredit = "Maintenance"
tags = ["code"]
keywords = ["code"]
summary = "Today I released version 0.7.5 of s, a terminal tool that opens web searches in your browser. No flashy new features, just the kind of maintenance work that keeps open source projects alive."
+++

Today I released version 0.7.5 of [s](https://github.com/zquestz/s), a terminal tool that opens web searches in your browser. No flashy new features, just the kind of maintenance work that keeps open source projects alive.

When people think about open source, they imagine developers adding cool new features. What they don't see is the unglamorous work behind the scenes. This release is a perfect example.

## The Only Constant is Change

Dozens of search providers are included with s. The problem? Websites change. Companies shut down. Domains expire. Every so often I need to go through and verify which providers still work.

This means hitting each provider and checking response codes. Does the URL still resolve? Does the search actually return results? It's tedious, but it's the only way to know what's broken.

This time around, 8tracks is gone. lmgtfy is dead. magnetdl disappeared. phind completely changed their URL structure. cppreference and zhihu have different search mechanics now. That's six providers removed, plus a couple others like libgen and overstock that needed URL updates.

Not exciting work, but if I don't do it, users get broken searches and wonder why the tool doesn't work.

## CI Platforms Change Too

Travis CI used to be the go-to for open source projects. It still works, but it costs money now, and GitHub Actions just makes more sense. No need to generate and manage tokens separately, everything's already integrated. Less friction.

This release migrates everything over. New CI workflows, new release automation. Now when I push a version tag, builds automatically get created for 18 different OS/architecture combinations. Actually a nicer setup than what I had before. The [Docker image](https://hub.docker.com/r/zquestz/s-search) still gets built and pushed manually, but that's on the list.

## Security Scanners Never Sleep

GitHub's security scanning is great, but it means you get alerts about things you need to fix. This release addresses a few of those.

The CI workflows now follow least-privilege principles with explicit permission scoping. There was also a potential issue with how URIs were being encoded in the server's JavaScript output, now properly handled with `json.Marshal`. While I was in there, I refactored some overly complex code that the linters were complaining about.

## Dependencies Pile Up

Go modules need updating. Cobra, pflag, the standard library extensions - they all have new versions. This release bumps everything to current, cleans up go.mod, and updates to Go 1.25.5.

Bumping deps isn't hard, but you still have to do it, test everything, and make sure nothing breaks. Easy to put off until suddenly you're major versions behind and the upgrade becomes painful.

## The Boring Reality

None of this is glamorous. No blog post goes viral because you updated your CI platform or removed a dead search provider. But this is what maintenance looks like. Checking that things still work. Keeping up with the ecosystem. Fixing issues before users hit them.

If you use s, grab the update. If you maintain open source software, you already know exactly what I'm talking about.
