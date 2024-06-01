// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {SusuwatariStorage, Susu, UserState, BaggageSlot} from "./SusuwatariStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";

import "hardhat/console.sol";

library LibSusuwatari {

    struct SusuwatariInfo {
        uint256 tokenId;
        address owner;
    }

    struct BaggedSusuInfo {
        uint256 tokenId;
        address carrier;
    }

    modifier mustExistSusu(SusuwatariStorage storage sus, uint256 tokenId) {
        require(
            tokenId > 0 && tokenId <= sus.susuOwners.length,
            "The Susuwatari does not exist"
        );
        _;
    }

    modifier mustHaveSusu(SusuwatariStorage storage sus) {
        bool hasSusu = false;

        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            if (sus.susuOwners[i] == msg.sender) {
                hasSusu = true;
                break;
            }
        }

        require(hasSusu, "Caller does not own any Susuwatari token");
        _;
    }

    modifier mustCarrySusu(SusuwatariStorage storage sus, uint256 tokenId) {
        Susu storage susuInstance = sus.tokenIdToSusu[tokenId];
        require(
            susuInstance.carrier == msg.sender,
            "Caller doesn't carry a Susuwatari Token!"
        );
        _;
    }

    modifier isUserRegistered(SusuwatariStorage storage sus) {
        require(sus.maxSlotCount[msg.sender] > 0, "User is not registered");
        _;
    }

    modifier mustNotCarrySusu(SusuwatariStorage storage sus) {
        bool isCarrying = false;

        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            if (sus.tokenIdToSusu[i + 1].carrier == msg.sender) {
                isCarrying = true;
                break;
            }
        }
        require(
            isCarrying == false,
            "Caller is already carrying a Susuwatari Token!"
        );
        _;
    }

    modifier isNotBeingCarriedSusu(
        SusuwatariStorage storage sus,
        uint256 tokenId
    ) {
        Susu storage su = sus.tokenIdToSusu[tokenId];
        require(su.carrier == address(0), "Susu is already being carried!");
        _;
    }

    modifier cannotBeOwner(SusuwatariStorage storage sus, uint256 tokenId) {
        require(
            sus.susuOwners[tokenId - 1] != msg.sender,
            "The owner cannot move his own aimed Susuwatari!"
        );
        _;
    }

    modifier mustHaveBagSpace(SusuwatariStorage storage sus) {
        bool isCarrying = false;

        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            if (sus.tokenIdToSusu[i + 1].carrier == msg.sender) {
                isCarrying = true;
                break;
            }
        }
        require(isCarrying == false, "Caller is already overburdened");
        _;
    }

    modifier susuMustNotHaveBeenAimed(
        SusuwatariStorage storage sus,
        uint256 tokenId
    ) {
        require(
            sus.susuOwners[tokenId - 1] == msg.sender &&
                sus.tokenIdToSusu[tokenId].carrier == msg.sender,
            "Caller is not owner"
        );

        _;
    }

    function getCurrentState(
        SusuwatariStorage storage sus
    ) internal view returns (UserState memory) {
        uint256 ownedTokenCount = 0;
        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            if (msg.sender == sus.susuOwners[i]) {
                ownedTokenCount++;
            }
        }

        uint256[] memory ownedTokens = new uint256[](ownedTokenCount); //push geht nicht in memory arrays
        uint256 index = 0;
        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            if (msg.sender == sus.susuOwners[i]) {
                ownedTokens[index] = i + 1;
                index++;
            }
        }

        BaggageSlot memory slot;
        for (uint256 i = 0; i < sus.susuOwners.length; i++) {
            uint256 tokenId = i + 1;

            if (sus.baggedSusus[tokenId] == msg.sender) {
                slot.susuTokenId = tokenId;
                slot.dropCooldownTime = sus
                    .tokenIdToSusu[tokenId]
                    .dropCooldownTime;
                slot.ownerAddress = sus.susuOwners[tokenId - 1];
                break; //one slot per user!
            }
        }

        UserState memory state = UserState({
            ownedTokens: ownedTokens,
            slot: slot,
            team: sus.ownerToTeam[msg.sender]
        });

        return state;
    }

function registerMe(SusuwatariStorage storage sus, uint8 team) internal 
returns (uint256, string memory, address,uint8)
{
    require(sus.maxSlotCount[msg.sender] == 0, "User already registered");

    Susu memory newSusu = Susu({
        tokenId: sus.susuOwners.length + 1,
        dropCooldownTime: 0,
        originLocation: 0,
        currentLocation: 0,
        destination: 0,
        message: "",
        carrier: msg.sender
    });

    sus.maxSlotCount[msg.sender] = 1;
    sus.ownerToTeam[msg.sender] = team;
    sus.susuOwners.push(msg.sender);
    sus.tokenIdToSusu[newSusu.tokenId] = newSusu;
    sus.baggedSusus[newSusu.tokenId] = msg.sender;


        return (newSusu.tokenId, newSusu.message, newSusu.carrier, team);
}
    function giveSusuwatari(
        SusuwatariStorage storage sus
    ) internal isUserRegistered(sus) mustNotCarrySusu(sus) 
    returns (uint256, string memory, address, uint8){
        Susu memory newSusu = Susu({
            tokenId: sus.susuOwners.length + 1,
            dropCooldownTime: 0,
            originLocation: 0,
            currentLocation: 0,
            destination: 0,
            message: "",
            carrier: msg.sender
        });

        sus.susuOwners.push(msg.sender);
        sus.tokenIdToSusu[newSusu.tokenId] = newSusu;
        sus.baggedSusus[newSusu.tokenId] = msg.sender;

    uint8 team = sus.ownerToTeam[msg.sender];
        
        return (newSusu.tokenId, newSusu.message, msg.sender, team);
    }

    function aimInitialSusu(
    SusuwatariStorage storage sus,
    uint256 tokenId,
    uint256 location,
    uint256 destination,
    string memory message
)
    internal
    isUserRegistered(sus)
    mustExistSusu(sus, tokenId)
    susuMustNotHaveBeenAimed(sus, tokenId)
    returns (uint256, uint256, uint256, string memory, uint8)
{
    Susu storage susu = sus.tokenIdToSusu[tokenId];

    susu.dropCooldownTime =
        300 +
        (uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, tokenId)
            )
        ) % 301);
    susu.originLocation = location;
    susu.currentLocation = location;
    susu.destination = destination;
    susu.message = message;
    susu.carrier = address(0);
    sus.baggedSusus[tokenId] = address(0);
    sus.tokenIdToSusu[tokenId] = susu;
    
    uint8 team = sus.ownerToTeam[msg.sender];
    return (tokenId, location, destination, message, team);
}


    function dropSusu(
        SusuwatariStorage storage sus,
        uint256 tokenId,
        uint256 location
    )
        internal
        isUserRegistered(sus)
        mustExistSusu(sus, tokenId)
        mustCarrySusu(sus, tokenId)
        returns (uint256, uint256, uint256, uint256, uint8, string memory)
    {
        Susu storage susu = sus.tokenIdToSusu[tokenId];

        susu.dropCooldownTime = 0;
        susu.currentLocation = location;
        susu.carrier = address(0);
        sus.baggedSusus[tokenId] = address(0);
        sus.tokenIdToSusu[tokenId] = susu;

       


        return (susu.originLocation, susu.currentLocation, susu.destination, tokenId,sus.ownerToTeam[msg.sender], susu.message);
   
    }

function tryPickupSusu(
    SusuwatariStorage storage sus,
    uint256 tokenId, //auto-ermitteln
    uint256 location
)
    internal
    isUserRegistered(sus)
    mustExistSusu(sus, tokenId)
    mustNotCarrySusu(sus)
    isNotBeingCarriedSusu(sus, tokenId)
    cannotBeOwner(sus, tokenId)
    returns (uint256, uint256, string memory, address, address, uint8)
{
    Susu storage susu = sus.tokenIdToSusu[tokenId];

    // require(
    //     susu.currentLocation == location,
    //     "Caller is not in the correct location"
    // );

    susu.dropCooldownTime =
        300 +
        (uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, tokenId)
            )
        ) % 301);
    susu.carrier = msg.sender;
    sus.baggedSusus[tokenId] = msg.sender;
    sus.tokenIdToSusu[tokenId] = susu;

    address susOwner = sus.susuOwners[tokenId-1];
    uint8 team = sus.ownerToTeam[susOwner];


        return (tokenId, location, susu.message, msg.sender, susOwner, team);
   
}

    function getAllSusuwataris(
        SusuwatariStorage storage sus
    ) internal view returns (SusuwatariInfo[] memory) {
        uint256 length = sus.susuOwners.length;
        SusuwatariInfo[] memory susuwataris = new SusuwatariInfo[](length);
        
        for (uint256 i = 0; i < length; i++) {
            susuwataris[i] = SusuwatariInfo({
                tokenId: i + 1,
                owner: sus.susuOwners[i]
            });
        }
        
        return susuwataris;
    }

    function getBaggedSusus(
        SusuwatariStorage storage sus
    ) internal view returns (BaggedSusuInfo[] memory) {
        uint256 length = sus.susuOwners.length;
        uint256 baggedCount = 0;

        for (uint256 i = 0; i < length; i++) {
            if (sus.baggedSusus[i + 1] != address(0)) {
                baggedCount++;
            }
        }

        BaggedSusuInfo[] memory baggedSusus = new BaggedSusuInfo[](baggedCount);
        uint256 index = 0;

        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = i + 1;
            if (sus.baggedSusus[tokenId] != address(0)) {
                baggedSusus[index] = BaggedSusuInfo({
                    tokenId: tokenId,
                    carrier: sus.baggedSusus[tokenId]
                });
                index++;
            }
        }

        return baggedSusus;
    }

}
