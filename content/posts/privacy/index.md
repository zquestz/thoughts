+++
title = "Simple Privacy - A Layered Approach"
date = "2023-05-25"
author = "quest"
authorTwitter = "zquestz"
cover = "posts/privacy/images/privacy-logo.webp"
coverCredit = "Simple Privacy"
tags = ["security", "ECH", "privacy", "DNS"]
keywords = ["security", "ECH", "privacy", "DNS"]
summary = "The internet was never designed with privacy in mind. A majority of the protocols we use today were conceived without any security or privacy considerations. This guide is for those who value their privacy and can spare a few minutes to configure their system. It is not intended to be an exhaustive list of recommendations, but a source of simple privacy-enhancing tips for the average user."
+++

The internet was never designed with privacy in mind. A majority of the protocols we use today were conceived without any security or privacy considerations. This guide is for those who value their privacy and can spare a few minutes to configure their system. It is not intended to be an exhaustive list of recommendations, but a source of simple privacy-enhancing tips for the average user.

## DNS

There's a saying amongst network admins: "it's always DNS". Every time you visit a domain name (e.g., twitter.com), a DNS (Domain Name System) request is made to look up that domain's IP address (e.g., 104.244.42.1). Therefore, if DNS isn't functioning, it appears as though the internet is down. This also means that whoever you use as a DNS provider can see every single domain you visit. By default, this is generally your ISP, and since they control those DNS servers, they can manipulate the DNS results to filter where you can go online.

The first step to better security and privacy is to switch your DNS provider. Choose a provider who supports the latest DNS security features such as DNS over TLS ([DoT](https://en.wikipedia.org/wiki/DNS_over_TLS)), DNS over HTTPS ([DoH](https://en.wikipedia.org/wiki/DNS_over_HTTPS)), [DNSCrypt](https://www.dnscrypt.org/) and [DNSSEC](https://www.cloudflare.com/dns/dnssec/how-dnssec-works/).

There are numerous secure DNS services available. This article is not about endorsing one over the other, but here are a few that are widely used and have reasonable privacy policies:

- [Quad9](https://www.quad9.net/)
- [Cloudflare](https://1.1.1.1/)
- [NextDNS](https://nextdns.io/)

These providers offer multiple DNS services. Most operating systems default to standard insecure DNS on port 53, while browsers have implemented Secure DNS via DNS over HTTPS (DoH). Make sure Secure DNS is enabled in all your browsers. Just go to `Settings` and search for `DNS`. It is pretty easy to find.

Now, while browsing the web, DNS requests will be encrypted and routed to a DNS provider you trust. You might think that your ISP can't see where you are going, but they still can, due to how [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) handshakes work!

## SNI

Server Name Indication ([SNI](https://www.cloudflare.com/learning/ssl/what-is-sni/)) is used in a TLS handshake to determine the correct certificate to use for HTTPS. This allows a web server to host more than one domain and reliably send the correct certificate, regardless of which domain is being served.

Unfortunately, this is done unencrypted, which means your ISP can still see what domains you are visiting! In fact, any device on the route between you and a domain could easily capture that information. Most routes to the websites we visit generally consist of 6 to 15 hops, each of which could have a device logging data about us!

This has been a long-standing issue. We have had HTTPS for decades, and yet default browser installations still have this flaw! Fortunately, the tools to address this are now available.

## ECH

Encrypted Client Hello ([ECH](https://datatracker.ietf.org/doc/draft-ietf-tls-esni/)) fixes this privacy issue. The browser uses public key cryptography to encrypt the domain in the TLS handshake. CloudFlare has really championed the technology, and [written about it extensively](https://blog.cloudflare.com/handshake-encryption-endgame-an-ech-update/). They also provide the best [testing site](https://www.cloudflare.com/ssl/encrypted-sni/) to ensure your browser is configured correctly.

You don't need to understand every detail of how it works to ensure your browser is using the latest technology. That part is much simpler.

### Chromium Setup

For Chromium-based browsers (Brave/Chrome/Edge) you need to ensure Secure DNS is setup, then navigate to `chrome://flags/`.

Search for `DNS`. Ensure the following options are enabled:

- Encrypted ClientHello
- Use DNS https alpn

Once you restart your browser, ECH should be enabled!

### Firefox Setup

For Firefox go to `about:config` and search for `DNS`. Ensure the following are enabled:

- network.dns.echconfig.enabled
- network.dns.http3_echconfig.enabled

Then set `network.trr.mode` to `3`. After restarting Firefox, ECH should be set up!

Unfortunately if you are using Firefox for mobile, only the nightly builds expose `about:config`.

## Testing ECH

There are a couple of places where you can test your new setup to ensure everything is working as expected:

- https://defo.ie/ech-check.php
- https://www.cloudflare.com/ssl/encrypted-sni/

## Privacy Status

Finally, your ISP can't see which domains you're accessing. They can only see the IP address of the server you connect to. When websites use a Content Delivery Network (CDN) that supports ECH, like CloudFlare, your ISP can't determine your browsing destination. This applies to millions of websites!

With no special software to install and just a few minutes of your time, you are browsing the web more securely than most. If you want to take it to the next level, consider a VPN.

## VPN

A VPN, or Virtual Private Network, hides all data from your ISP by encrypting your network communications and sending it to a VPN provider instead. Any data your ISP used to gather is now hidden and can potentially be gathered by the VPN provider. Therefore, it is essential to use Secure DNS and set up ECH, or the same privacy issues will arise when you use a VPN!

However, there are reasons to use a trustworthy VPN:

- You need to access a site that is inaccessible in your country.
- You don't trust your ISP.

While I've generally been satisfied with my home internet providers, I find a VPN very useful for mobile devices. A VPN protects me from potentially malicious networks, be they my mobile provider or a random WiFi network I connect to. Many home routers also offer built-in VPN servers, allowing you to VPN into your own home network!

If you're exploring VPN services, I highly recommend watching this video from Naomi Brockwell.

{{< youtube XLZmmxi_PYE >}}

I would also recommend [AirVPN](https://airvpn.org/) and their excellent VPN client, Eddie.

## Final Thoughts

Security requires a multi-layered approach. The following technologies are designed to provide a more secure and private internet experience and are more effective when used together:

- Secure DNS (DoT/DoH/DNSSEC)
- Encrypted Client Hello (ECH)
- VPN

Remember, this article only scratches the surface of security and privacy. For those seeking even stronger privacy, here are a few links to get you started:

- [Lokinet](https://lokinet.org/)
- [Yggdrasil](https://yggdrasil-network.github.io/)
- [Tor](https://www.torproject.org/index.html)
- [I2P](https://geti2p.net/)

A more private and secure internet benefits everyone. Let's make it a reality!