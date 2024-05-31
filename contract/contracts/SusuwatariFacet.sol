//SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
//import "hardhat/console.sol";


import {SusuwatariStorage,StorageHandler} from "./SusuwatariStorage.sol";
import {LibSusuwatari} from "./LibSusuwatari.sol";
import {UsingDiamondOwner} from "hardhat-deploy/solc_0.8/diamond/UsingDiamondOwner.sol";


/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract SusuwatariFacet is StorageHandler, UsingDiamondOwner {
    using Address for address;
    using Strings for uint256;


}
