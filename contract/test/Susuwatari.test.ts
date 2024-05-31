import { expect } from "chai";
import { SusuwatariFacet } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, deployments, getNamedAccounts } from 'hardhat';
const hre = require("hardhat");

describe("Susuwatari contract", function() {
    let SusuwatariContract: SusuwatariFacet;
    let contractAddress: string;
    let owner: SignerWithAddress;
    let address1: SignerWithAddress;
    let address2: SignerWithAddress;

    before(async () => {
        [owner, address1, address2] = await ethers.getSigners();
        console.log('owner', owner.address);
        console.log('address1', address1.address);
        console.log('address2', address2.address);
        const deployment = await deployments.fixture(["Susuwatari"]);
        contractAddress = deployment.Susuwatari_DiamondProxy.address;
        SusuwatariContract = await hre.ethers.getContractAt("SusuwatariFacet", contractAddress);
    });

    it("Deployment should have empty balance", async function() {
        const balance = await ethers.provider.getBalance(contractAddress);
        expect(balance).to.equal(0n);
    });

    it("Should register a new user", async function() {
        await SusuwatariContract.connect(owner).registerMe();
        const maxSlotCount = await SusuwatariContract.maxSlotCount(owner.address);
        expect(maxSlotCount).to.equal(1);
    });

    it("Should aim an initial Susu", async function() {
        const tokenId = 1;
        const location = "Tokyo";
        const destination = "Osaka";
        const message = "Hello Susu";
        await SusuwatariContract.connect(owner).aimInitialSusu(tokenId, location, destination, message);
        const susu = await SusuwatariContract.tokenIdToSusu(tokenId);
        expect(susu.originLocation).to.equal(location);
        expect(susu.destination).to.equal(destination);
        expect(susu.message).to.equal(message);
        expect(susu.carrier).to.equal(owner.address);
    });

    it("Should drop a Susu", async function() {
        const tokenId = 1;
        const location = "Osaka";
        const destination = "Kyoto";
        const message = "Dropped Susu";
        await SusuwatariContract.connect(owner).dropSusu(tokenId, location, destination, message);
        const susu = await SusuwatariContract.tokenIdToSusu(tokenId);
        expect(susu.location).to.equal(location);
        expect(susu.carrier).to.equal(ethers.constants.AddressZero);
    });

    it("Should pick up a Susu", async function() {
        const tokenId = 1;
        const location = "Osaka";
        const destination = "Nara";
        const message = "Picked up Susu";
        await SusuwatariContract.connect(address1).registerMe();
        await SusuwatariContract.connect(address1).tryPickupSusu(tokenId, location, destination, message);
        const susu = await SusuwatariContract.tokenIdToSusu(tokenId);
        expect(susu.carrier).to.equal(address1.address);
    });

    // Negative Tests
    it("Should fail to register an already registered user", async function() {
        await expect(SusuwatariContract.connect(owner).registerMe()).to.be.revertedWith("User already registered");
    });

    it("Should fail when non-owner tries to aim an initial Susu", async function() {
        const tokenId = 1;
        const location = "Kyoto";
        const destination = "Tokyo";
        const message = "Unauthorized attempt";
        await expect(
            SusuwatariContract.connect(address1).aimInitialSusu(tokenId, location, destination, message)
        ).to.be.revertedWith("Caller is not the owner");
    });

    it("Should fail to pick up a Susu that is already picked up", async function() {
        const tokenId = 1;
        const location = "Osaka";
        const destination = "Kyoto";
        const message = "Already picked up";
        await expect(
            SusuwatariContract.connect(address2).tryPickupSusu(tokenId, location, destination, message)
        ).to.be.revertedWith("Susu is already being carried!");
    });

    it("Should fail to drop a Susu that is already dropped", async function() {
        const tokenId = 1;
        const location = "Nara";
        const destination = "Kyoto";
        const message = "Already dropped";
        await SusuwatariContract.connect(address1).dropSusu(tokenId, location, destination, message);
        await expect(
            SusuwatariContract.connect(address1).dropSusu(tokenId, location, destination, message)
        ).to.be.revertedWith("Caller doesn't carry a Susuwatari Token!");
    });

    it("Should fail interactions with non-existent Susus (tokenId 0)", async function() {
        const tokenId = 0;
        const location = "Nowhere";
        const destination = "Nowhere";
        const message = "Non-existent Susu";
        await expect(
            SusuwatariContract.connect(owner).aimInitialSusu(tokenId, location, destination, message)
        ).to.be.revertedWith("The Susuwatari does not exist");
    });

    it("Should fail interactions with non-existent Susus (tokenId higher than total)", async function() {
        const tokenId = 9999;
        const location = "Nowhere";
        const destination = "Nowhere";
        const message = "Non-existent Susu";
        await expect(
            SusuwatariContract.connect(owner).aimInitialSusu(tokenId, location, destination, message)
        ).to.be.revertedWith("The Susuwatari does not exist");
    });
});
