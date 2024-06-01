// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {SusuwatariStorage, StorageHandler, UserState, BaggageSlot, Susu} from "./SusuwatariStorage.sol";
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

    function registerMe() external {
        LibSusuwatari.registerMe(susu());
    }

    function aimInitialSusu(
        uint256 tokenId,
        string memory location,
        string memory destination,
        string memory message
    ) external returns (uint256, string memory, string memory, string memory) {
        return
            LibSusuwatari.aimInitialSusu(
                susu(),
                tokenId,
                location,
                destination,
                message
            );
    }

    function dropSusu(
        uint256 tokenId,
        string memory location
    ) external returns (uint256, string memory) {
        return LibSusuwatari.dropSusu(susu(), tokenId, location);
    }

    function tryPickupSusu(
        uint256 tokenId,
        string memory location
    ) external returns (uint256, string memory) {
        return LibSusuwatari.tryPickupSusu(susu(), tokenId, location);
    }

    function getCurrentState() external view returns (UserState memory) {
        return LibSusuwatari.getCurrentState(susu());
    }

    function giveSusuwatari() external {
        LibSusuwatari.giveSusuwatari(susu());
    }

    function getAllSusuwataris()
        external
        view
        returns (LibSusuwatari.SusuwatariInfo[] memory)
    {
        return LibSusuwatari.getAllSusuwataris(susu());
    }

    function getBaggedSusus()
        external
        view
        returns (LibSusuwatari.BaggedSusuInfo[] memory)
    {
        return LibSusuwatari.getBaggedSusus(susu());
    }
}
