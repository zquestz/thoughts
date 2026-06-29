+++
title = "Saturating 10 Gigabit on Linux"
date = "2026-06-28"
author = "quest"
authorTwitter = "zquestz"
cover = "images/10gbe.webp"
coverCredit = "Saturating 10 Gigabit"
tags = ["linux", "hardware", "networking"]
keywords = ["linux", "hardware", "networking"]
summary = "Wringing full speed out of a network used to be a niche pursuit, the stuff of 10G home labs and datacenter transfers. That's changing fast. Multi-gig fiber is landing in homes everywhere, even Hawaiian Telecom is selling 3 Gig out here on the Big Island. A fast link is no longer just the wire between your own machines; it's the wire to the internet too. And Linux still ships network defaults sized for a slower era, so on a fast link, especially a long one, they leave throughput unused. Here's the sysctl set I run, what each knob does and where it actually matters, and the single-stream iperf3 result over 20 feet of in-wall Cat 5e: 9.75 Gbit/s."
+++

Wringing full speed out of a network used to be a niche pursuit, the stuff of 10G home labs and datacenter transfers. That's changing fast. Multi-gig fiber is landing in homes everywhere, even Hawaiian Telecom is selling 3 Gig out here on the Big Island. A fast link is no longer just the wire between your own machines; it's the wire to the internet too. And Linux still ships network defaults sized for a slower era, so on a fast link, especially a long one, they leave throughput unused. Here's the sysctl set I run, what each knob does and where it actually matters, and the single-stream [iperf3](https://github.com/esnet/iperf) result over 20 feet of in-wall Cat 5e: 9.75 Gbit/s.

This started on my own network. I'd built a 10-gigabit link between my laptop and my NAS, and I wanted to know how much of it I was really getting, and whether it'd be ready when my internet connection catches up. That meant a look at the kernel's network defaults, which are more conservative than you'd expect. I'll walk them in groups, and since a local LAN and a long-haul link lean on very different parts of the list, I'll flag which is which as we go.

## Congestion Control: BBR and fq

```ini
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
```

Congestion control is the algorithm that decides how fast a TCP sender pushes data and how it backs off when the network pushes back. The long-time default, CUBIC, treats packet loss as the signal to slow down. On a clean local wire that's fine, but on a path with real distance or the occasional dropped packet, it retreats hard and leaves the pipe half full.

Enter BBR. Rather than waiting for loss, it measures the path directly - the bottleneck bandwidth and the round-trip time - and paces itself to sit right at that limit. On a long or lossy link it holds throughput that CUBIC would surrender, which is exactly where a fat pipe over distance struggles without it.

That pacing is the key, and it wants a qdisc that can space packets out evenly instead of letting them burst. That qdisc is `fq` ("fair queue"), so `default_qdisc = fq` and `bbr` are the standard pairing: BBR sets the pace, `fq` keeps it. Both have been in the mainline kernel for years; on anything current you just switch them on.

Where it helps, honestly: on your LAN, with sub-millisecond latency and no loss, CUBIC already saturates 10G and BBR won't beat it by much. This pair pays off the moment distance enters the path, a transfer to a server across the country, or any link that isn't pristine. It costs nothing locally and rescues the long-haul case, so it stays.

## Socket Buffers

```ini
net.core.rmem_default = 1048576
net.core.rmem_max = 67108864
net.core.wmem_default = 1048576
net.core.wmem_max = 67108864
net.core.optmem_max = 65536
net.ipv4.tcp_rmem = 4096 1048576 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.udp_rmem_min = 8192
net.ipv4.udp_wmem_min = 8192
```

A socket buffer is the memory the kernel holds for data in flight, one buffer for sending and one for receiving. They matter for throughput because of a hard limit in TCP: a sender can have only one window of unacknowledged data on the wire at a time, and that window can't exceed the buffer. If the buffer is too small, the sender fills the window and then stalls, waiting for acknowledgments to come back before it can send any more.

How big does it need to be? At least the bandwidth-delay product (BDP): the link's bandwidth times its round-trip time, which is the amount of data in flight needed to keep the pipe full. At 10 Gbit/s over a 50 ms path that works out to about 60 MiB, which is where the 64 MiB ceiling (`67108864` bytes) comes from. Size the buffer under the BDP and throughput is capped no matter how fast the link.

The three-number values, `tcp_rmem` and `tcp_wmem`, are min, default, and max. The kernel autotunes each connection between min and max, starting at the default and growing the buffer only as the connection demands it. So 64 MiB is a ceiling, not a reservation - a busy long-haul transfer can climb to it while a quiet connection stays small, and you get the headroom without paying for it on every socket. The `rmem_max`/`wmem_max` pair sets that same ceiling for the core, and `optmem_max` covers the small ancillary buffer used for control messages.

The two `udp_*_min` values raise the floor below which UDP buffers won't shrink under memory pressure. UDP doesn't autotune the way TCP does, so the floor keeps it steady, and since the large buffers above apply to UDP sockets too, the same settings quietly help QUIC, which rides on UDP.

Honestly, on your LAN almost none of this is in play. At sub-millisecond latency the BDP is a few hundred kilobytes, so the autotuner never climbs near 64 MiB and the stock defaults would fill the link just fine. The big ceilings are insurance for the high-latency case, pulling 10G from across the country, where without them the window tops out and you'd never see more than a slice of the pipe.

## Queues and Backlogs

```ini
net.core.netdev_max_backlog = 16384
net.ipv4.tcp_max_syn_backlog = 8192
net.core.somaxconn = 8192
```

These three set how many packets or connections can wait in line at points where the network stack hands work off. Leave them too shallow and a burst overflows the queue, which means dropped packets or refused connections.

`netdev_max_backlog` is the one that matters most at 10G. When packets arrive faster than the CPU can lift them into the stack, they pile up in this per-interface queue. The default of 1000 was sized for slower links; a 10-gigabit interface can fill that in a blink during a burst, and anything past the edge gets dropped. Raising it to 16384 gives the stack room to catch up before it starts discarding.

The other two are about accepting connections, and they matter when the box is a busy server rather than a client. `tcp_max_syn_backlog` is the queue of half-open connections still completing their handshake, which also gives some cushion against a SYN flood. `somaxconn` caps the queue of established connections waiting for the application to pick them up. That one is only a ceiling: the program also has to ask for a backlog that large when it calls `listen()`, or it gets whatever it requested instead.

For a single transfer none of the connection queues come into play, but they cost nothing idle and save you the day a service suddenly fields a flood of clients. The backlog bump is the one doing the real work on the 10G receive path.

## Connection Behavior

```ini
net.ipv4.tcp_fastopen = 3
net.ipv4.ip_local_port_range = 32768 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_tw_buckets = 2000000
net.ipv4.tcp_slow_start_after_idle = 0
```

This group is less about raw throughput and more about how connections open, close, and reopen, which matters most when a box churns through a lot of them.

`tcp_slow_start_after_idle = 0` is the one I'd keep regardless. Normally, when a connection sits idle for a moment, the kernel forgets how fast it was going and slow-starts from scratch the next time it sends. Disabling that lets a long-lived connection pick up where it left off, which helps anything bursty: a persistent connection between transfers, a video stream that fills its buffer and pauses. It pairs especially well with BBR, which keeps its own read on the path rather than rebuilding from zero.

The next three fight port and connection exhaustion on a box that opens many short-lived connections. `ip_local_port_range` sets the pool of ephemeral ports for outbound connections; starting it at `32768` keeps it clear of the registered service ports below, so an outbound connection never grabs a port a local service wanted. `tcp_tw_reuse` lets the kernel safely reuse a connection still lingering in `TIME_WAIT` for a new outbound one, using timestamps to be sure it's safe. (This is the modern, safe reuse, not the old `tcp_tw_recycle`, which mangled connections behind NAT and was removed from the kernel years ago.) `tcp_max_tw_buckets` caps how many `TIME_WAIT` sockets the kernel will hold; it's only a ceiling, and with reuse on you'll rarely come near two million, but it keeps the table from growing without bound.

`tcp_fastopen = 3` enables TCP Fast Open for both clients and servers, letting a little data ride along in the SYN to save a round trip at setup. I'll be straight: in 2026 it's mostly inert. Browsers walked away from it, plenty of networks strip the option in transit, and it does nothing for a bulk transfer that's already up and running. It's harmless to leave on, so it stays, but I wouldn't expect much from it.

## Keepalives

```ini
net.ipv4.tcp_keepalive_time = 60
net.ipv4.tcp_keepalive_intvl = 10
net.ipv4.tcp_keepalive_probes = 6
```

When a connection goes quiet, how does either end know the other is still there? TCP keepalive answers that by sending the occasional probe down an idle connection. If enough probes go unanswered, the kernel declares the peer gone and tears the connection down.

The three values shape that timing. `tcp_keepalive_time = 60` is how long a connection sits idle before the first probe goes out, down from a default of 7200 seconds, a full two hours. `tcp_keepalive_intvl = 10` is the gap between probes, and `tcp_keepalive_probes = 6` is how many can go unanswered before the connection is declared dead. Together they spot a dead peer in about two minutes (60 seconds idle, then six probes ten seconds apart) instead of the default two-plus hours.

Faster detection does two useful things: it reaps dead connections quickly instead of leaving them to rot, and it keeps idle connections from being silently dropped by NAT and firewalls, which often expire a mapping after a few minutes of silence. A probe every so often keeps that path warm.

One caveat to be honest about: keepalive only applies to connections that opt in with `SO_KEEPALIVE`, and plenty of applications manage liveness themselves with their own heartbeats. So this won't touch every connection on the box. Where it does apply, the cost is a stray packet now and then, which is nothing.

## Jumbo Frames and MTU Probing

```ini
net.ipv4.tcp_mtu_probing = 1
```

The last knob deals with packet size, and it pairs with a setting that lives outside sysctl entirely: jumbo frames.

By default an Ethernet frame carries up to 1500 bytes. Every frame has fixed overhead, headers and inter-frame gaps, so smaller frames mean a larger share of the wire spent on overhead instead of data. A standard 1500-byte MTU tops a 10G link out around 9.4 Gbit/s of actual throughput for that reason. Jumbo frames raise the MTU to 9000 bytes, six times the payload per frame for the same overhead, which lifts the ceiling closer to the full 10 gigabit. On my LAN it's the single biggest reason a transfer clears 9.4. Jumbo frames aren't a sysctl; you set the MTU on the interface itself, and crucially on every device in the path, since the smallest MTU along the way wins.

That "every device in the path" requirement is where `tcp_mtu_probing` comes in. Normally the kernel learns the largest packet a path can carry through Path MTU Discovery, which leans on ICMP messages from routers. Plenty of firewalls drop those messages, creating a black hole: oversized packets vanish silently and the connection stalls instead of getting told to back off. With probing enabled, TCP figures out the working size on its own by testing, and recovers. Value `1` keeps it conservative, kicking in only when a stall is detected, which is exactly what you want as a safety net behind jumbo frames rather than an always-on cost.

## The Complete Set

That's every knob from the walkthrough. Here it is in one place.

{{< code language="ini" title="/etc/sysctl.d/99-net.conf" id="1" expand="Show" collapse="Hide" isCollapsed="true" >}}
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.core.netdev_max_backlog = 16384
net.ipv4.tcp_max_syn_backlog = 8192
net.core.somaxconn = 8192
net.core.rmem_default = 1048576
net.core.rmem_max = 67108864
net.core.wmem_default = 1048576
net.core.wmem_max = 67108864
net.core.optmem_max = 65536
net.ipv4.tcp_rmem = 4096 1048576 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.udp_rmem_min = 8192
net.ipv4.udp_wmem_min = 8192
net.ipv4.tcp_fastopen = 3
net.ipv4.ip_local_port_range = 32768 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_tw_buckets = 2000000
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_keepalive_time = 60
net.ipv4.tcp_keepalive_intvl = 10
net.ipv4.tcp_keepalive_probes = 6
net.ipv4.tcp_mtu_probing = 1
{{< /code >}}

## Applying the Settings

Applying these is straightforward. Drop the file into `/etc/sysctl.d/99-net.conf`. The `99-` prefix makes it load last, so it wins over anything your distro or a package dropped in earlier. Apply it without a reboot:

```sh
sudo sysctl --system
```

That reloads every file under `/etc/sysctl.d/` and echoes each setting as it applies it. To confirm one took, read it back:

```sh
sysctl net.ipv4.tcp_congestion_control
```

If it comes back `bbr`, you're set!

## Verifying It Worked

Numbers settle it, so the real test is a throughput run. `iperf3` measures it end to end: run a server on one machine and point a client at it from another. No second machine? A [list of public iperf3 servers](https://iperf3serverlist.net/) lets you test against the internet instead, which is the better gauge of your long-haul tuning anyway.

```sh
iperf3 -s
```

```sh
❯ iperf3 -c 192.168.1.25
Connecting to host 192.168.1.25, port 5201
[  5] local 192.168.1.7 port 34734 connected to 192.168.1.25 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  1.12 GBytes  9.65 Gbits/sec    3    699 KBytes
[  5]   1.00-2.00   sec  1.13 GBytes  9.74 Gbits/sec    8    533 KBytes
[  5]   2.00-3.00   sec  1.14 GBytes  9.76 Gbits/sec    0    516 KBytes
[  5]   3.00-4.00   sec  1.14 GBytes  9.77 Gbits/sec    6    489 KBytes
[  5]   4.00-5.00   sec  1.13 GBytes  9.73 Gbits/sec    3    507 KBytes
[  5]   5.00-6.00   sec  1.14 GBytes  9.79 Gbits/sec    9    551 KBytes
[  5]   6.00-7.00   sec  1.13 GBytes  9.74 Gbits/sec   10    533 KBytes
[  5]   7.00-8.00   sec  1.14 GBytes  9.76 Gbits/sec    1    568 KBytes
[  5]   8.00-9.00   sec  1.14 GBytes  9.80 Gbits/sec    4    568 KBytes
[  5]   9.00-10.00  sec  1.14 GBytes  9.77 Gbits/sec   11    489 KBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  11.4 GBytes  9.75 Gbits/sec   55            sender
[  5]   0.00-10.00  sec  11.4 GBytes  9.75 Gbits/sec                  receiver

iperf Done.
```

A single stream is the demanding case, and it already clears 9.75. Push to eight parallel streams (`iperf3 -P 8`) and it climbs to 9.88 Gbit/s, essentially the wire's ceiling.

One detail in the single-stream output is a nice callback to the buffers section: the congestion window (`Cwnd`) never climbs past roughly 700 KB, nowhere near those 64 MiB ceilings. On a sub-millisecond LAN it doesn't need to. All that buffer just sits unused, waiting for a longer path.

Those numbers came off my own gear, and the path behind them is worth describing because none of it is exotic. The client isn't even a desktop: it's a [Framework Laptop 13](https://frame.work/laptop13), and the 10G arrives from a [CalDigit TS5 Plus](https://www.caldigit.com/thunderbolt-5-dock-ts5-plus/) dock, where the NIC actually lives. The dock is Thunderbolt 5, but the laptop's Thunderbolt 4 port caps the bus at 40 Gbit/s, still far more than a 10G link needs. From there it's an in-wall run of 20 to 25 feet of Cat 5e into a [TP-Link TL-SX105](https://www.tp-link.com/us/business-networking/unmanaged-switch/tl-sx105/v1/) switch at each end, then a Synology DS1621xs+ with a built-in 10G port running the server.

The Cat 5e is the surprising part. It isn't rated for 10GBASE-T; the standard wants Cat 6a, with Cat 6 for shorter reaches. But those limits come from crosstalk and signal loss that build with length, and over a short run Cat 5e carries 10G without complaint. The link negotiated the full rate, no drop to 5G or 2.5G. Don't take this as "Cat 5e is fine for 10G" down a long pull or a packed bundle, where it won't be, but at desk distances you may not need to rewire a thing.

This also wasn't a clean-room benchmark. The NAS on the other end is my everyday one, busy and not idled for the test, and it still hit line rate. Real-world conditions, real-world number.

One honest clarification on what's measured: iperf3 runs memory to memory, so it tests the wire, not the disks. The 9.75 Gbit/s is the network's ceiling, not what a file copy to the array will sustain, which is a separate and slower story. But the wire is what this file set out to fill, and it's full.

## Final Thoughts

A 10-gigabit link is easy to buy and, it turns out, easy to fill, once the kernel stops playing it safe. Most of what's in the file is insurance: buffers and BBR for the day a transfer has to cross real distance, queues and keepalives for a box that gets busy. On a quiet local LAN the win that actually moved the needle was humbler, jumbo frames, and the stock defaults handled more of the rest than I expected.

That's the honest shape of it. Drop the file in, run your own `iperf3`, and read the number against your own path: a short hop to a NAS is one story, a haul across the internet another. None of these settings conjure bandwidth that isn't there. They just make sure that when it is, the kernel actually uses it.

Mine does, even over twenty-odd feet of Cat 5e the spec sheet says shouldn't manage it. The pipe was never the problem. It was just waiting for permission.
