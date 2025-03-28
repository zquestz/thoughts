+++
title = "Introducing Shinobi Art Engine"
date = "2023-09-29T13:25:39-10:00"
author = "quest"
authorTwitter = "zquestz"
cover = "images/shinobi.webp"
coverCredit = "Shinobi Art Engine"
tags = ["ai", "code"]
keywords = ["ai", "code"]
summary = "Today I am thrilled to introduce the Shinobi Art Engine, the ultimate tool for creating NFT collections. This is an extension of the amazing work done by the HashLips team, known for their pioneering efforts in NFT art generation, and it's the first tool to support both BCH and ETH NFT collections. The CashNinjas team has been working on this project for a while now and we are excited to share it with the world."
+++

Today I am thrilled to introduce the [Shinobi Art Engine](https://github.com/cashninjas/shinobi-art-engine), the ultimate tool for creating NFT collections. This is an extension of the amazing work done by the [HashLips](https://hashlips.io/) team, known for their pioneering efforts in NFT art generation, and it's the first tool to support both BCH and ETH NFT collections. The CashNinjas team has been working on this project for a while now and we are excited to share it with the world.

## About Shinobi Art Engine

Shinobi Art Engine serves as a bridge connecting creativity with blockchain technology. The engine facilitates the seamless creation of NFT collections, and by lowering the entry barrier for NFT creators, we aspire to foster a diverse and vibrant digital art ecosystem.

We added quite a few new features to the original HashLips engine, including:

- Support for BCH [CashTokens](https://cashtokens.org) NFT projects with [Bitcoin Cash Metadata Registries](https://cashtokens.org/docs/bcmr/chip/) (BCMR).
- Icon generation for ETH and BCH projects.
- Updated to use ES module imports instead of `require()` statements.
- New Shinobi example layers!
- OpenAI integration to generate names and descriptions!
- Tons of small code cleanups and optimizations!

## Getting Started

Embarking on your NFT creation journey with Shinobi Art Engine is straightforward. Our [GitHub repository](https://github.com/cashninjas/shinobi-art-engine) provides an extensive `README.md` to guide you, along with sample layers to play around with. Follow the step-by-step walkthrough to build the included Shinobi NFT collection, and unleash your creativity with the array of tools and features at your disposal.

For those that just want a quick breakdown, here is how you would get started:

```zsh
# Clone the repository
git clone https://github.com/cashninjas/shinobi-art-engine.git

# Change directory to the repository
cd shinobi-art-engine

# Install dependencies
yarn install

# Build Shinobi!
npm run build
```

You can now look in the `build` directory for your newly generated Shinobi collection!

Now, if you look at the metadata, your Shinobi's aren't actually that interesting! They don't have unique names, and they all contain the same description!

```json
{
  "name": "Shinobi #1",
  "description": "Elite digital ninja, guardian of BCH.",
  "image": "ipfs://NewUriToReplace/images/1.png",
  "dna": "9b1e5fd771a69adf90a363ea31c04b8785a1171c",
  "edition": 1,
  "date": 1696035479989,
  "imageHash": "558811fb10667a77e3a59051d704f208a0443091010876bc5daf7788fbeb716c",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Dark Forest"
    },
    {
      "trait_type": "Glow",
      "value": "Red"
    },
    {
      "trait_type": "Weapons",
      "value": "Scythe"
    },
    {
      "trait_type": "Body",
      "value": "Shadow"
    },
    {
      "trait_type": "Eyes",
      "value": "White"
    }
  ],
  "icon": "ipfs://NewUriToReplace/icons/1.png",
  "iconHash": "ba789fd47be7a9ce8ec139143ad61d26b3d1cce272d31ae9dfdcd44b7f3ca267"
}
```

Now lets generate new names using OpenAI's GPT-4 API!

First, you will need to [setup an OpenAI API key](https://platform.openai.com/apps). Then make sure the `OPENAI_API_KEY` env var is set or added to your `.env` file.

```zsh
npm run openai
```

The output should look like this:

```
> shinobi_art_engine@1.0.0 openai
> node utils/openai.js

Updating #1
Updating #2
Updating #3
Updating #4
Updating #5
Updating #6
Updating #7
Updating #8
Updating #9
Updating #10
Updating #11
Updated names using OpenAI
Updated descriptions using OpenAI
```

Taking a look at the same JSON file again, shows much better data! We now have a cool unique name, and a description that is based off the NFT traits! Just compare it to the image!

![Harbinger of the Dark Forest](images/harbinger.webp)

```json
{
  "name": "Shinobi #1 - Harbinger of the Dark Forest",
  "description": "Emerging from the mysterious shadows of the Dark Forest, this Shinobi is an elite guardian of the BCH blockchain. Emanating a powerful Red Glow, his presence commands respect and fear in equal measures. Armored in a Stealth Shadow Body, this ninja is almost invisible till he strikes with his terrifying Scythe. His White Eyes, unyielding and resolute, burn brightly in the dark, a testament to his unwavering commitment to maintain the balance and integrity of the decentralized world. Like a phantom of the night, he stands as a powerful avatar of Satoshi's will.",
  "image": "ipfs://NewUriToReplace/images/1.png",
  "dna": "9b1e5fd771a69adf90a363ea31c04b8785a1171c",
  "edition": 1,
  "date": 1696035479989,
  "imageHash": "558811fb10667a77e3a59051d704f208a0443091010876bc5daf7788fbeb716c",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Dark Forest"
    },
    {
      "trait_type": "Glow",
      "value": "Red"
    },
    {
      "trait_type": "Weapons",
      "value": "Scythe"
    },
    {
      "trait_type": "Body",
      "value": "Shadow"
    },
    {
      "trait_type": "Eyes",
      "value": "White"
    }
  ],
  "icon": "ipfs://NewUriToReplace/icons/1.png",
  "iconHash": "ba789fd47be7a9ce8ec139143ad61d26b3d1cce272d31ae9dfdcd44b7f3ca267"
}
```

As you can see, our Shinobi now has a backstory!

> Emerging from the mysterious shadows of the Dark Forest, this Shinobi is an elite guardian of the BCH blockchain. Emanating a powerful Red Glow, his presence commands respect and fear in equal measures. Armored in a Stealth Shadow Body, this ninja is almost invisible till he strikes with his terrifying Scythe. His White Eyes, unyielding and resolute, burn brightly in the dark, a testament to his unwavering commitment to maintain the balance and integrity of the decentralized world. Like a phantom of the night, he stands as a powerful avatar of Satoshi's will.

The new descriptions will be significantly different for every NFT collection and is based off values in the configuration file and the attributes of the NFTs. These are not cookie cutter descriptions!

## Conclusion

Shinobi Art Engine is more than just a tool; it's a canvas where your imagination takes the lead. We invite you to dive into the Shinobi Art Engine today, and start crafting your unique NFT collections. Be sure to also explore the [CashNinjas website](https://ninjas.cash) to stay updated on our latest projects and initiatives. Together, let's redefine the boundaries of digital artistry in the NFT realm.
