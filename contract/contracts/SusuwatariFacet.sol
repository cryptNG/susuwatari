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


    event DroppedSusu(
        uint256 originLocation,
        uint256 currentLocation,
        uint256 destination,
        uint256 tokenId,
        uint8 team,
        string message
    );

    
event MintedSusu(uint256 tokenId, string message, address owner, uint8 team);

event PickedUpSusu(uint256 tokenId, uint256 location, string message, address sender, address owner, uint8 team);

    
    function registerMe(uint8 team) external {
        (uint256 tokenId, string memory message, address owner,uint8 setteam) = LibSusuwatari.registerMe(susu(), team);
        
        emit MintedSusu(tokenId, message, owner, setteam);
    }

    
function aimInitialSusu(
    uint256 tokenId,
    uint256 location,
    uint256 destination,
    string memory message
) external {
    
    (
        uint256 rettokenId, 
        uint256 retlocation, 
        uint256 retdestination, 
        string memory retmessage, 
        uint8 team
    ) = LibSusuwatari.aimInitialSusu(
        susu(),
        tokenId,
        location,
        destination,
        message
    );
        
    emit DroppedSusu(retlocation, retlocation, retdestination, rettokenId, team, retmessage);
     
}

  function dropSusu(uint256 tokenId, uint256 location) external {
        (uint256 originLocation, uint256 currentLocation, uint256 destination, uint256 rettokenId, uint8 team, string memory message) = LibSusuwatari.dropSusu(susu(), tokenId, location);
        
        emit DroppedSusu(originLocation, currentLocation, destination, rettokenId, team, message);
    }
    
  
    function tryPickupSusu(uint256 tokenId, uint256 location) external {
        (uint256 rettokenId, uint256 retlocation, string memory message, address sender, address owner, uint8 team) = LibSusuwatari.tryPickupSusu(susu(), tokenId, location);
     
        emit PickedUpSusu(rettokenId, retlocation, message, sender, owner, team);
    }

    function getCurrentState() external view returns (UserState memory) {
        return LibSusuwatari.getCurrentState(susu());
    }

    function giveSusuwatari() external {
        (uint256 tokenId, string memory message, address owner, uint8 team) = LibSusuwatari.giveSusuwatari(susu());
        
        emit MintedSusu(tokenId, message, owner, team);
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
