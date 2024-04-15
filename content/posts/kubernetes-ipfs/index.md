+++
title = "Enhancing IPFS Performance in Kubernetes Environments"
date = "2023-10-26T14:44:55-10:00"
author = "quest"
authorTwitter = "zquestz"
cover = "posts/kubernetes-ipfs/images/kubernetes-ipfs.webp"
coverCredit = "Kubernetes IPFS"
tags = ["code", "kubernetes"]
keywords = ["code", "kubernetes"]
summary = "For over half a decade, I have been deploying IPFS on my Kubernetes cluster, gaining valuable insights into its operation within such an environment. Even though it's just a modest singleton deployment, the experience has led to a deeper understanding of various nuances and potential pitfalls. This article aims to share the learned lessons and offer configuration guidelines to optimize IPFS performance in a Kubernetes setup."
+++

For over half a decade, I have been deploying [IPFS](https://ipfs.io) on my Kubernetes cluster, gaining valuable insights into its operation within such an environment. Even though it's just a modest singleton deployment, the experience has led to a deeper understanding of various nuances and potential pitfalls. This article aims to share the learned lessons and offer configuration guidelines to optimize IPFS performance in a Kubernetes setup.

## Kubernetes Configurations

You can access my most recent [IPFS Kubernetes configurations](https://github.com/zquestz/kube-ipfs) on GitHub. These configurations are tailored for deployment on a [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) cluster, accompanied by [cert-manager](https://github.com/cert-manager/cert-manager). However, the flexibility of Kubernetes means that these configurations also serve as a solid foundation for deployments on bare-metal or other cloud providers.

Staying updated with the latest IPFS releases is crucial to leverage new features and security updates. A noteworthy point is that IPFS does not trigger migrations automatically by default. Therefore, it's essential to include the `--migrate` flag in your deployment configuration. This flag is especially crucial if you opt for the `ipfs/kubo:release` image, as without it, a new release could halt your node from booting up.

If you venture into setting up a public gateway, be aware that it can attract a significant amount of traffic. Publicizing a gateway should only be done if you are well-equipped to manage the potential surge in traffic.

## Delving into IPFS Configuration

Getting IPFS up and running is just the initial step. To ensure it operates correctly, a handful of configuration adjustments are imperative. Otherwise you will only be able to make outgoing connections, and your peer count will be extremely limited.

The first task is to navigate to `/data/ipfs/config` within the pod and amend the `Addresses` configuration to reflect the correct WAN IP and/or DNS. The default setup may not accurately detect these, which in turn would impede ingress connections unless rectified.

In my setup, I have mirrored the configuration for `Announce` and `AppendAnnounce`, to make sure the correct IPs are announced to the network. Within the IPFS codebase, these are deduplicated, but I prefer to be redundant, as this has broken for me in the past.

```json
"Addresses": {
  "API": "/ip4/0.0.0.0/tcp/5001",
  "Announce": [
    "/ip4/35.209.82.27/tcp/4001",
    "/ip4/35.209.82.27/udp/4001/quic-v1",
    "/ip4/35.209.82.27/udp/4001/quic-v1/webtransport",
    "/dns/ipfs-swarm.greyh.at/tcp/4001",
    "/dns/ipfs-swarm.greyh.at/udp/4001/quic-v1",
    "/dns/ipfs-swarm.greyh.at/udp/4001/quic-v1/webtransport"
  ],
  "AppendAnnounce": [
    "/ip4/35.209.82.27/tcp/4001",
    "/ip4/35.209.82.27/udp/4001/quic-v1",
    "/ip4/35.209.82.27/udp/4001/quic-v1/webtransport",
    "/dns/ipfs-swarm.greyh.at/tcp/4001",
    "/dns/ipfs-swarm.greyh.at/udp/4001/quic-v1",
    "/dns/ipfs-swarm.greyh.at/udp/4001/quic-v1/webtransport"
  ],
  "Gateway": "/ip4/0.0.0.0/tcp/8080",
  "NoAnnounce": null,
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4001",
    "/ip4/0.0.0.0/udp/4001/quic-v1",
    "/ip4/0.0.0.0/udp/4001/quic-v1/webtransport"
  ]
},
```

Although these configurations seem comprehensive, there's one more critical setting to adjust, the `RelayClient`. This needs to be disabled, or else none of the preceding configurations, including `AppendAnnounce`, will function!

```json
"RelayClient": { "Enabled": false },
```

Additionally, I have customized the `Access-Control-Allow-Origin` header on my Gateway to ensure the desired level of access control.

```json
"Gateway": {
  "APICommands": [],
  "DeserializedResponses": null,
  "HTTPHeaders": {
    "Access-Control-Allow-Origin": [
      "*"
    ]
  },
  "NoDNSLink": false,
  "NoFetch": false,
  "PathPrefixes": [],
  "PublicGateways": null,
  "RootRedirect": ""
},
```

Lastly, the `StorageMax` parameter should be set in line with your mounted disk size to prevent any storage issues.

Upon fine-tuning all the necessary configurations, a restart of IPFS is required to apply the changes:

```sh
kubectl rollout restart deployment/ipfs
```

With these configurations in place, IPFS should now operate more efficiently within a Kubernetes environment, ensuring better performance and reliability.

## Optimizing Routing Performance

When hosting content on your IPFS setup, enabling the `AcceleratedDHTClient` is a wise choice. Though it increases CPU usage, it significantly enhances the advertisement of your content across the network, ensuring better accessibility and performance.

```json
"Routing": {
  "AcceleratedDHTClient": true
},
```

## Addressing Network Hiccups

Upon close inspection, you might notice an error indicating that the UDP receive buffer size is inadequate during IPFS startup. The error message would look something like this:

```text
failed to sufficiently increase receive buffer size
(was: 208 kiB, wanted: 2048 kiB, got: 416 kiB).
See https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes for details.
```

Resolving this requires tweaking a few `sysctl` settings on our node pool machines to ensure a smooth operation.

A comprehensive guide to adjust system configurations can be found on the [Google Cloud documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/node-system-config). Following this guide, I adjusted the sysctl settings as shown below:

```yaml
kubeletConfig: {}
linuxConfig:
  sysctl:
    net.core.rmem_max: "2500000"
    net.core.wmem_max: "2500000"
```

To apply these configurations, utilize the `gcloud` command-line interface as follows:

```sh
gcloud container node-pools update POOL_NAME \
--cluster CLUSTER_NAME --zone ZONE_NAME \
--project PROJECT_NAME --system-config-from-file sysctl.yaml
```

After executing the above command, allow a few minutes for your node pool machines to reboot with the updated settings. IPFS will be automatically migrated to one of the new machines, and upon startup, the previous error should no longer appear.

## Conclusion

We've journeyed through the technical terrain of tuning IPFS on Kubernetes, addressing configurations, fixing the UDP buffer error, and ramping up routing with `AcceleratedDHTClient`. Now, with a finely-tuned setup, we're all set to delve into the decentralized web, serving content with enhanced efficiency and reliability.
