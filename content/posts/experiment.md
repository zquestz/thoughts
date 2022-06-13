+++
title = "A Thought Experiment"
date = "2022-06-12"
author = "quest"
+++

For a while now, I have wanted a place to post my long form content. So after literally years of delay, I finally got around to it, and [thoughts.greyh.at](https://thoughts.greyh.at) was born.

To get started, I figured I would document the setup itself, from choosing a solution, through full deployment to my Kubernetes cluster.

You can find the code for this experiment on [GitHub](https://github.com/zquestz/thoughts) and follow along if you are so inclined.

## What Framework?

Since my goal is to just share my ideas with the world, I wanted to focus on writing, and keep things version controlled with git. I also didn't want to manage backend dependencies and ideally wanted to deploy static content.

So, that meant no WordPress, no Drupal, it was time to keep things as simple as possible. So I looked into static site generators. These would give me a lot of useful tooling, and make packaging the site for deployment a breeze.

Since I know both Ruby and Go, I naturally checked out the latest releases of [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/), as they are the most popular static site generators on the market.

While both are quality projects, I chose Hugo. It lets me create all my posts using markdown, is incredibly fast, and offers a bunch of themes to get started. Plus, it had a [theme](https://github.com/panr/hugo-theme-terminal) I really liked, so I figured why not. 

## Configuration

Setup was super simple. First, I created the new site.
```
hugo new site thoughts
cd thoughts
git init
```

Then, I added my theme.
```
git submodule add -f https://github.com/panr/hugo-theme-terminal.git themes/terminal
```

Next, I updated `config.toml`!
{{< code language="toml" title="config.toml" id="1" expand="Show" collapse="Hide" isCollapsed="true" >}}
baseurl = "/"
languageCode = "en-us"
theme = "terminal"
paginate = 5

[params]
  # dir name of your main content (default is `content/posts`).
  # the list of set content will show up on your index page (baseurl).
  contentTypeName = "posts"

  # ["orange", "blue", "red", "green", "pink"]
  themeColor = "green"

  # if you set this to 0, only submenu trigger will be visible
  showMenuItems = 2

  # show selector to switch language
  showLanguageSelector = false

  # set theme to full screen width
  fullWidthTheme = false

  # center theme with default width
  centerTheme = true

  # if your resource directory contains an image called `cover.(jpg|png|webp)`,
  # then the file will be used as a cover automatically.
  # With this option you don't have to put the `cover` param in a front-matter.
  autoCover = true

  # set post to show the last updated
  # If you use git, you can set `enableGitInfo` to `true` and then post will automatically get the last updated
  showLastUpdated = true

  # set a custom favicon (default is a `themeColor` square)
  # favicon = "favicon.ico"

  # Provide a string as a prefix for the last update date. By default, it looks like this: 2020-xx-xx [Updated: 2020-xx-xx] :: Author
  # updatedDatePrefix = "Updated"

  # set all headings to their default size (depending on browser settings)
  # oneHeadingSize = true # default

  # whether to show a page's estimated reading time
  readingTime = true # default was false

  # whether to show a table of contents
  # can be overridden in a page's front-matter
  # Toc = false # default

  # set title for the table of contents
  # can be overridden in a page's front-matter
  # TocTitle = "Table of Contents" # default


[params.twitter]
  # set Twitter handles for Twitter cards
  # see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started#card-and-content-attribution
  # do not include @
  creator = "zquestz"
  site = "zquestz"

[languages]
  [languages.en]
    languageName = "English"
    title = "Terminal Thoughts"
    subtitle = "A small area for quest's thoughts."
    owner = ""
    keywords = ""
    copyright = ""
    menuMore = "Show more"
    readMore = "Read more"
    readOtherPosts = "Read other posts"
    newerPosts = "Newer posts"
    olderPosts = "Older posts"
    missingContentMessage = "Page not found..."
    missingBackButtonLabel = "Back to home page"

    [languages.en.params.logo]
      logoText = "Terminal Thoughts"
      logoHomeLink = "/"

    [languages.en.menu]
      [[languages.en.menu.main]]
        identifier = "thoughts"
        name = "Thoughts"
        url = "/"
      [[languages.en.menu.main]]
        identifier = "intent"
        name = "Intent"
        url = "/intent"
{{< /code >}}

The last piece was adding `intent.md` and `experiment.md` (this post).

# DNS

I already have a load balancer setup in GCE to handle a number of other websites, so all I had to do was add an A record to handle thoughts.greyh.at. I generally use a TTL of 60, just in case I have to move a domain.
```
thoughts.greyh.at.	60	IN	A	35.208.63.54
```

# Deployment

To get the site deployed, I would need to create a Dockerfile and Kubernetes configurations to deploy to my GCE cluster.

To generate static files, it was as simple as running `hugo` and the static files are created in the `public` directory. This made the Dockerfile super simple.
```
FROM alpine:3.7
RUN apk add --update --no-cache curl bash

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
```

Then I generated the image, and pushed it to Docker Hub.
```
docker build -t thoughts .
docker tag thoughts:latest zquestz/thoughts:06-12-2022
docker tag thoughts:latest zquestz/thoughts:latest
docker push zquestz/thoughts:06-12-2022
docker push zquestz/thoughts:latest
```

Now that the image was pushed, I could finally write the [Kubernetes configs](https://github.com/zquestz/thoughts/tree/master/kube) and deploy the app to my cluster.
```
kubectl apply -f kube
```

## Profit!

Once I kicked off the deploy, [cert-manager](https://cert-manager.io/) automatically setup the new https certificate through [Let's Encrypt](https://letsencrypt.org/) and brought the site online!

Overall I am quite happy with the result, and hope this will be the start of a new writing journey!