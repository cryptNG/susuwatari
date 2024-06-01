import { expect } from "chai";
import { SusuwatariFacet } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, deployments } from 'hardhat';
const hre = require("hardhat");
const util = require('util');

describe("Susuwatari contract", function () {
  let SusuwatariContract: SusuwatariFacet;
  let contractAddress: string;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;
  let address3: SignerWithAddress;
  let address4: SignerWithAddress;
  let address5: SignerWithAddress;

  before(async () => {
    [owner, address1, address2, address3, address4, address5] = await ethers.getSigners();
    const deployment = await deployments.fixture(["Susuwatari"]);
    contractAddress = deployment.Susuwatari_DiamondProxy.address;
    SusuwatariContract = await hre.ethers.getContractAt("SusuwatariFacet", contractAddress);
  });

  it("Deployment hello should have empty balance", async function () {
    const balance = await ethers.provider.getBalance(contractAddress);
    expect(balance).to.equal(0n);
  });

  it("Should register a new user", async function () {
    const ad1 = SusuwatariContract.connect(address1);
    await ad1.registerMe();
    const state = await ad1.getCurrentState();
    expect(state.ownedTokens).to.have.length(1);
    expect(state.ownedTokens[0]).to.equal(1);
  });

  const addOneTokenId = 1;
  const addOneLocation = "Location1";
  const addOneDestination = "Destination1";
  const addOneMessage = "Message1";
  it("Should aim an initial Susu", async function () {


    console.log(`Aiming initial Susu with the following details:
        Token ID: ${addOneTokenId}
        Location: ${addOneLocation}
        Destination: ${addOneDestination}
        Message: ${addOneMessage}`);

    const ad1 = SusuwatariContract.connect(address1);
    //console.log(`ADDRESS OBJ: ${util.inspect(ad1, { showHidden: false, depth: 2 })}`);
    await ad1.aimInitialSusu(addOneTokenId, addOneLocation, addOneDestination, addOneMessage);
    console.log("Initial Susu aimed successfully.");

    const state = await SusuwatariContract.connect(address1).getCurrentState();
    console.log(`Current state retrieved:
        Susu Token ID: ${state.slot.susuTokenId}        
        Address: ${address1.address}
        Owner Address: ${state.slot.ownerAddress}`);

    expect(state.slot.susuTokenId).to.equal(0);
  });



  it("Cannot drop a Susu again", async function () {

    const ad1 = SusuwatariContract.connect(address1);

    // Get state before trying to drop the Susu again
    const stateBefore = await ad1.getCurrentState();
    console.log("State before trying to drop the Susu again:");
    console.log(`Susu Token ID: ${stateBefore.slot.susuTokenId}`);
    console.log(`Owner Address: ${stateBefore.slot.ownerAddress}`);
    console.log(`Drop Cooldown Time: ${stateBefore.slot.dropCooldownTime}`);
    let errorOccurred = false;
    try {
      await ad1.dropSusu(addOneTokenId, addOneLocation);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("Caller doesn't carry a Susuwatari Token!");
    }

    //toberevertedwith geht nicht
    expect(errorOccurred).to.be.true;


  });

  const addTwoTokenId = 2;
  const addTwoLocation = "Location2";
  const addTwoDestination = "Desintation2";
  const addTwoMessage = "Message2";


  it("New User should aim into a new location and pick up the aimed Susuwatari", async function () {


    //new user
    const ad2 = SusuwatariContract.connect(address2);
    await ad2.registerMe();
    await ad2.aimInitialSusu(addTwoTokenId, addTwoLocation, addTwoDestination, addTwoMessage); //make space


    // Pick up the Susuwatari
    await ad2.tryPickupSusu(addOneTokenId, addOneLocation);
    const stateAfterPickup = await ad2.getCurrentState();
    expect(stateAfterPickup.slot.susuTokenId).to.equal(addOneTokenId);
  });

  const addThreeTokenId = 3;
  const addThreeLocation = "Location3";
  const addThreeDestination = "Desintation3";
  const addThreeMessage = "Message3";


  it("New User should aim into a new location and cannot pick up the carried Susuwatari from Account 2", async function () {


    //new user
    const ad3 = SusuwatariContract.connect(address3);
    await ad3.registerMe();
    await ad3.aimInitialSusu(addThreeTokenId, addThreeLocation, addThreeDestination, addThreeMessage); //make space


    let errorOccurred;
    try {
      await ad3.tryPickupSusu(addOneTokenId, addOneLocation);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("Susu is already being carried!");
    }

    //toberevertedwith geht nicht
    expect(errorOccurred).to.be.true;

    // Pick up the Susuwatari

    const stateAfterPickup = await ad3.getCurrentState();
    expect(stateAfterPickup.slot.susuTokenId).to.equal(0);


  });


  const addFourTokenId = 4;
  const addFourLocation = "Location4";
  const addFourDestination = "Destination4";
  const addFourMessage = "Message4";

  it("User should aim a Susuwatari and cannot pick up the exact same Susuwatari they aimed", async function () {

    const ad4 = SusuwatariContract.connect(address4);
    await ad4.registerMe();

    await ad4.aimInitialSusu(addFourTokenId, addFourLocation, addFourDestination, addFourMessage);

    let errorOccurred = false;
    try {
      await ad4.tryPickupSusu(addFourTokenId, addFourLocation);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("The owner cannot move his own aimed Susuwatari!");
    }

    expect(errorOccurred).to.be.true;

  });

  it("Should get a new Susu when none is present", async function () {
    const ad1 = SusuwatariContract.connect(address1);


    await ad1.giveSusuwatari();

    let state = await ad1.getCurrentState();
    const length = state.ownedTokens.length;
    let result = length == 2;
    expect(result).to.be.true;
  });


  it("Should not get a new Susu when one is present", async function () {
    const ad1 = SusuwatariContract.connect(address1);


    let errorOccurred = false;
    try {
      await ad1.giveSusuwatari();
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("Caller is already carrying a Susuwatari Token!");
    }

    expect(errorOccurred).to.be.true;
  });


  let lastDropLocation = 'dropLocation1'
  it("Should drop a Susu", async function () {
    const ad2 = SusuwatariContract.connect(address2);

    // Retrieve and log the current state
    const state = await SusuwatariContract.connect(address3).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);

    // Drop the Susu
    await ad2.dropSusu(addOneTokenId, lastDropLocation);

    // Check that the Susu token ID is 0
    expect(state.slot.susuTokenId).to.equal(0);
  });


  it("Should pick up a Susu", async function () {
    const ad3 = SusuwatariContract.connect(address3)

    const state = await SusuwatariContract.connect(address3).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);
    ;


    await ad3.tryPickupSusu(addOneTokenId, lastDropLocation);
    const stateAfterPickup = await ad3.getCurrentState();


    console.log(`New state retrieved:
      Susu Token ID: ${stateAfterPickup.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${stateAfterPickup.slot.ownerAddress}`);
    ;
    expect(stateAfterPickup.slot.susuTokenId).to.equal(addOneTokenId);
  });



  it("Should fail to register an already registered user", async function () {

    let errorOccurred = false;
    try {
      await SusuwatariContract.connect(address1).registerMe();
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("User already registered");
    }

    expect(errorOccurred).to.be.true;

  });

  const addFiveTokenId = 6;
  it("Should fail when non-owner tries to aim an initial Susu", async function () {
    await SusuwatariContract.connect(address5).registerMe();
    let state = await SusuwatariContract.connect(address5).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);
    ;

    let errorOccurred = false;
    try {
      await SusuwatariContract.connect(address1).aimInitialSusu(addFiveTokenId, 'somelocation', 'somedestination', 'somemessage');
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("Caller is not owner");
    }

    state = await SusuwatariContract.connect(address1).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);
    ;


    expect(errorOccurred).to.be.true;

  });

  it("Should fail to pick up a Susu that is already picked up", async function () {

    let state = await SusuwatariContract.connect(address2).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);
    ;
    let errorOccurred = false;
    try {
      await SusuwatariContract.connect(address2).tryPickupSusu(addFiveTokenId, addFourLocation);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("Susu is already being carried!");
    }

    state = await SusuwatariContract.connect(address2).getCurrentState();
    console.log(`Current state retrieved:
      Susu Token ID: ${state.slot.susuTokenId}
      Address: ${address3.address}
      Owner Address: ${state.slot.ownerAddress}`);
    ;

    expect(errorOccurred).to.be.true;
  });

  it("Should fail to drop a Susu that is already dropped", async function() {
      
      let errorOccurred = false;
      try {
        await await SusuwatariContract.connect(address2).dropSusu(addFourTokenId, addFourLocation);
      } catch (error) {
        console.log("Error message:", error.message);
        errorOccurred = error.message.includes("Caller doesn't carry a Susuwatari Token!");
      }
  
      expect(errorOccurred).to.be.true;
    });

  it("Should fail interactions with non-existent Susus (tokenId 0)", async function() {
      const tokenId = 0;
      const location = "Location";
      const destination = "Destination";
      const message = "Message";

      let errorOccurred = false;
      try {
        await await SusuwatariContract.connect(address3).aimInitialSusu(tokenId, location, destination, message);
      } catch (error) {
        console.log("Error message:", error.message);
        errorOccurred = error.message.includes("The Susuwatari does not exist");
      }
  
      expect(errorOccurred).to.be.true;

       errorOccurred = false;
      try {
        await await SusuwatariContract.connect(address2).dropSusu(tokenId, location);
      } catch (error) {
        console.log("Error message:", error.message);
        errorOccurred = error.message.includes("The Susuwatari does not exist");
      }
  
      expect(errorOccurred).to.be.true;

       errorOccurred = false;
      try {
        await await SusuwatariContract.connect(address2).tryPickupSusu(tokenId, location);
      } catch (error) {
        console.log("Error message:", error.message);
        errorOccurred = error.message.includes("The Susuwatari does not exist");
      }
  
      expect(errorOccurred).to.be.true;
  });

  it("Should fail interactions with non-existent Susus (tokenId higher than total)", async function() {
    const tokenId = 999;
    const location = "Location";
    const destination = "Destination";
    const message = "Message";

    let errorOccurred = false;
    try {
      await await SusuwatariContract.connect(address3).aimInitialSusu(tokenId, location, destination, message);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("The Susuwatari does not exist");
    }

    expect(errorOccurred).to.be.true;

     errorOccurred = false;
    try {
      await await SusuwatariContract.connect(address2).dropSusu(tokenId, location);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("The Susuwatari does not exist");
    }

    expect(errorOccurred).to.be.true;

     errorOccurred = false;
    try {
      await await SusuwatariContract.connect(address2).tryPickupSusu(tokenId, location);
    } catch (error) {
      console.log("Error message:", error.message);
      errorOccurred = error.message.includes("The Susuwatari does not exist");
    }

    expect(errorOccurred).to.be.true;
  });
});
