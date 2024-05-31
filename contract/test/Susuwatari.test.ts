import { expect } from "chai";
import { SusuwatariFacet } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {ethers, deployments, getNamedAccounts} from 'hardhat';
const hre = require("hardhat");

describe("Susuwatari contract", function() {
    let SusuwatariContract:SusuwatariFacet;
    let contractAddress:string;
    let owner:SignerWithAddress;
  let address1:SignerWithAddress;
  let address2:SignerWithAddress;

    before(async () => {
 
        [owner,address1,address2] = await ethers.getSigners();
        console.log('owner',owner.address);
        console.log('address1',address1.address);
        console.log('address2',address2.address);
        const deployment = await deployments.fixture(["Susuwatari"]);
        contractAddress=deployment.Susuwatari_DiamondProxy.address;
        SusuwatariContract = await hre.ethers.getContractAt("SusuwatariFacet",contractAddress);
    
      });

  it("Deployment should have empty balance", async function() {
    
    
    const balance = await ethers.provider.getBalance(contractAddress);

    expect(balance).to.equal(0n);
  });

});