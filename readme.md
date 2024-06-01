# Susuwatari Game

## Overview

Welcome to Susuwatari, a unique geolocation-based game inspired by Japanese soot sprites. In Susuwatari, players can interact with NFTs (Non-Fungible Tokens) called susuwataris, which are moved around the real world by the players themselves. This README provides all the information you need to understand the game mechanics, deploy the contract locally, and run the app.

## Game Mechanics

### Leaf-Wallet Paradigm

Susuwatari utilizes the innovative leaf-wallet paradigm to create app-specific wallets for players. These wallets are low-security and designed to hold only gaming assets and minimal funds for transaction fees. The leaf-wallet paradigm allows the game to run in an idle state, making it perfect for a progressive web app.

### How to Play

1. **Registration:** Upon opening the app, you are automatically registered for a new leaf-wallet.
2. **Team Selection:** Choose one of two teams to join.
3. **NFT Assignment:** You will be assigned a unique NFT called a susuwatari, with an icon representing your public wallet address.
4. **Dropping Susuwatari:** Walk around in the real world and use the in-game map (powered by Leaflet Maps) to drop your susuwatari at a chosen location. You can also specify a destination and a message for your susuwatari.
5. **Picking Up Susuwatari:** Other players can pick up susuwataris you’ve dropped if they have space in their digital bag. The susuwatari is then carried to its destination or another location chosen by the new player.
6. **Scoring Points:** Move susuwataris closer to their destination to score points. The farther a susuwatari travels, the more points it earns for both the owner and their team. The goal is to collaboratively move susuwataris across the globe.
7. **Leaderboards:** Compete on global leaderboards to see which team and which players are leading in moving susuwataris.

### Game Continuation

Carrying a specific number of susuwataris enables you to receive a new fresh susuwatari NFT, ensuring the game continues.

## Deployment Instructions

### Deploying the Contract Locally

1. Navigate to the contract subdirectory.

## Run the following command to deploy the contract:
yarn deploy test

## Running the App
Host the app using Nginx or any other hosting tool of your choice.

## Live Demo
A live demo of the game is available at: [https://susuwatari.cryptng.app](https://susuwatari.cryptng.app)

## Leaf-Wallet Integration
The game uses the leaf-wallet paradigm as detailed on [leaf-wallet.io](https://leaf-wallet.io). This paradigm allows for the creation of wallets locally without the need to connect external wallets or add custom networks. Wallets are automatically funded in our testnet, ensuring seamless gameplay without dependencies on external apps.

## License
This project is licensed under the MIT License.
