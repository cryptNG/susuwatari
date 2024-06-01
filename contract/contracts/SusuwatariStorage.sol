//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {LibDiamond} from "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";

bytes32 constant SUSUWATARI_STORAGE_POSITION = keccak256("susuwatari.contract.storage");
bytes32 constant LEAFWALLET_STORAGE_POSITION = keccak256("leafwallet.contract.storage");

struct OwnableStorage {

    address _owner;
}


struct LeafWalletStorage {
    mapping(address => address) _deviceOwner;
    mapping(address => address[]) _ownerDevices;
    mapping(address => uint256) _deviceActivationCodes;
}

    struct UserState {
        uint256[] ownedTokens;
        BaggageSlot slot;
    }


    struct BaggageSlot {
        uint256 susuTokenId;
        uint256 dropCooldownTime;
        address ownerAddress;
    }

    struct Susu {
        uint256 tokenId;
        string originLocation;
        string currentLocation;
        string destination;
        string message;
        address carrier;
        uint256 dropCooldownTime;
    }
    
    //slotstate contains: 1. slot array, an element of slotarray has: [susutokenid, dropCooldownTime] 2. maxSlotCount(int) 3.  list of owned susus (nft)
    struct SusuwatariStorage {
        mapping(address => uint256) maxSlotCount;
        address[] susuOwners;
        mapping(uint256 => Susu) tokenIdToSusu;
        bool isInitialized;
        mapping(uint256 => address) baggedSusus; 
    }




contract StorageHandler {
    
    function susu() internal pure returns (SusuwatariStorage storage cs) {
        bytes32 position = SUSUWATARI_STORAGE_POSITION;
        assembly {
           cs.slot := position
        }
    }

    function os() internal pure returns (OwnableStorage storage cs) {
        bytes32 position = keccak256("ownable.contract.storage");
        assembly {
           cs.slot := position
        }
    }
    
    function ds() internal pure returns (LibDiamond.DiamondStorage storage) {
        return LibDiamond.diamondStorage();
    }

    
    function lw() internal pure returns (LeafWalletStorage storage cs) {
        bytes32 position = keccak256("leafwallet.contract.storage");
        assembly {
           cs.slot := position
        }
    }
}