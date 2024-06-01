import { expect } from "chai";
import { SusuwatariFacet } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, deployments } from 'hardhat';
const hre = require("hardhat");
const util = require('util');

describe("Susuwatari contract", function() {
    let SusuwatariContract: SusuwatariFacet;
    let contractAddress: string;
    let owner: SignerWithAddress;
    let address1: SignerWithAddress;
    let address2: SignerWithAddress;

    before(async () => {
        [owner, address1, address2] = await ethers.getSigners();
        const deployment = await deployments.fixture(["Susuwatari"]);
        contractAddress = deployment.Susuwatari_DiamondProxy.address;
        SusuwatariContract = await hre.ethers.getContractAt("SusuwatariFacet", contractAddress);
    });

    it("Deployment hello should have empty balance", async function() {
        const balance = await ethers.provider.getBalance(contractAddress);
        expect(balance).to.equal(0n);
    });

    it("Should register a new user", async function() {
        const ad1 = SusuwatariContract.connect(address1);
        await ad1.registerMe();
        const state = await ad1.getCurrentState();
        expect(state.ownedTokens).to.have.length(1);  
        expect(state.ownedTokens[0]).to.equal(1);
    });


it("Should aim an initial Susu", async function() {
    const tokenId = 1;
    const location = "Location1";
    const destination = "Destination1";
    const message = "Message1";
    
    console.log(`Aiming initial Susu with the following details:
        Token ID: ${tokenId}
        Location: ${location}
        Destination: ${destination}
        Message: ${message}`);
    
    const ad1 = SusuwatariContract.connect(address1);
    //console.log(`ADDRESS OBJ: ${util.inspect(ad1, { showHidden: false, depth: 2 })}`);
    await ad1.aimInitialSusu(tokenId, location, destination, message);
    console.log("Initial Susu aimed successfully.");
    
    const state = await SusuwatariContract.connect(address1).getCurrentState();
    console.log(`Current state retrieved:
        Susu Token ID: ${state.slot.susuTokenId}        
        Address: ${address1.address}
        Owner Address: ${state.slot.ownerAddress}`);
    
    expect(state.slot.susuTokenId).to.equal(tokenId);
    console.log(`Token ID matches expected value: ${tokenId}`);
    
       // Convert addresses to lowercase strings for comparison
       const expectedAddress = address1.address.toLowerCase();
       const actualAddress = state.slot.ownerAddress.toLowerCase();
   
       // Perform plain JavaScript comparison and store result in a variable
       const addressesMatch = (actualAddress === expectedAddress);
       
       console.log(`Addresses match: ${addressesMatch}`);
       
       // Assert with Chai
       expect(addressesMatch).to.be.true;
});

  
    // it("Should drop a Susu", async function() {
    //     const tokenId = 1;
    //     const location = "Location2";
    //     const destination = "Destination1";
    //     const message = "Message1";
    //     await SusuwatariContract.connect(address1).dropSusu(tokenId, location, destination, message);
    //     const state = await SusuwatariContract.connect(address1).getCurrentState();
    //     expect(state.slot.susuTokenId).to.equal(0);
    // });

    // it("Should pick up a Susu", async function() {
    //     const tokenId = 1;
    //     const location = "Location2";
    //     const destination = "Destination1";
    //     const message = "Message1";
    //     await SusuwatariContract.connect(address2).registerMe();
    //     await SusuwatariContract.connect(address2).tryPickupSusu(tokenId, location, destination, message);
    //     const state = await SusuwatariContract.connect(address2).getCurrentState();
    //     expect(state.slot.susuTokenId).to.equal(tokenId);
    //     expect(state.slot.ownerAddress).to.equal(address2.address);
    // });

    // it("Should fail to register an already registered user", async function() {
    //     await expect(SusuwatariContract.connect(address1).registerMe()).to.be.revertedWith("User already registered");
    // });

    // it("Should fail when non-owner tries to aim an initial Susu", async function() {
    //     const tokenId = 1;
    //     const location = "Location3";
    //     const destination = "Destination1";
    //     const message = "Message1";
    //     await expect(SusuwatariContract.connect(address1).aimInitialSusu(tokenId, location, destination, message)).to.be.revertedWith("Caller is not owner");
    // });

    // it("Should fail to pick up a Susu that is already picked up", async function() {
    //     const tokenId = 1;
    //     const location = "Location2";
    //     const destination = "Destination1";
    //     const message = "Message1";
    //     await expect(SusuwatariContract.connect(address1).tryPickupSusu(tokenId, location, destination, message)).to.be.revertedWith("Susu is already being carried!");
    // });

    // it("Should fail to drop a Susu that is already dropped", async function() {
    //     const tokenId = 1;
    //     const location = "Location2";
    //     const destination = "Destination1";
    //     const message = "Message1";
    //     await SusuwatariContract.connect(address2).dropSusu(tokenId, location, destination, message);
    //     await expect(SusuwatariContract.connect(address2).dropSusu(tokenId, location, destination, message)).to.be.revertedWith("Caller doesn't carry a Susuwatari Token!");
    // });

    // it("Should fail interactions with non-existent Susus (tokenId 0)", async function() {
    //     const tokenId = 0;
    //     const location = "Location";
    //     const destination = "Destination";
    //     const message = "Message";
    //     await expect(SusuwatariContract.connect(address1).aimInitialSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    //     await expect(SusuwatariContract.connect(address1).dropSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    //     await expect(SusuwatariContract.connect(address1).tryPickupSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    // });

    // it("Should fail interactions with non-existent Susus (tokenId higher than total)", async function() {
    //     const tokenId = 9999;
    //     const location = "Location";
    //     const destination = "Destination";
    //     const message = "Message";
    //     await expect(SusuwatariContract.connect(address1).aimInitialSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    //     await expect(SusuwatariContract.connect(address1).dropSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    //     await expect(SusuwatariContract.connect(address1).tryPickupSusu(tokenId, location, destination, message)).to.be.revertedWith("The Susuwatari does not exist");
    // });
});
