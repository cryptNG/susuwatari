/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "InitFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.InitFacet__factory>;
    getContractFactory(
      name: "LibPeoplesPlatform",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibPeoplesPlatform__factory>;
    getContractFactory(
      name: "PeoplesPlatformFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PeoplesPlatformFacet__factory>;
    getContractFactory(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondCut__factory>;
    getContractFactory(
      name: "IDiamondLoupe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondLoupe__factory>;
    getContractFactory(
      name: "LibDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibDiamond__factory>;

    getContractAt(
      name: "InitFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.InitFacet>;
    getContractAt(
      name: "LibPeoplesPlatform",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LibPeoplesPlatform>;
    getContractAt(
      name: "PeoplesPlatformFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PeoplesPlatformFacet>;
    getContractAt(
      name: "IDiamondCut",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondCut>;
    getContractAt(
      name: "IDiamondLoupe",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondLoupe>;
    getContractAt(
      name: "LibDiamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LibDiamond>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
