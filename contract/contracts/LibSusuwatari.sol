//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;


import {SusuwatariStorage, Susu} from "./SusuwatariStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";

library LibSusuwatari{

   

    
    modifier mustExistSusu(SusuwatariStorage storage sus, uint256 tokenId) {
        require(tokenId > 0 && tokenId <= sus.susuOwners.length, "The Susuwatari does not exist");
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
    require(susuInstance.carrier == msg.sender, "Caller doesn't carry a Susuwatari Token!");
    _;
}



modifier isUserRegistered(SusuwatariStorage storage sus){
      require(sus.maxSlotCount[msg.sender] > 0, "User is not registered"); 
          _;
}

    modifier mustNotCarrySusu(SusuwatariStorage storage sus, uint256 tokenId) { 

    bool isCarrying = false;
    

    for (uint256 i = 0; i < sus.susuOwners.length; i++) {
        if (sus.tokenIdToSusu[i].carrier == msg.sender) {
            isCarrying = true;
            break;
        }
    }
    require(!isCarrying, "Caller is already carry a Susuwatari Token!");
        _;
    }



 

modifier isNotBeingCarriedSusu(SusuwatariStorage storage sus, uint256 tokenId) {
    Susu storage su = sus.tokenIdToSusu[tokenId];
    require(su.carrier == address(0), "Susu is already being carried!");
    _;
}



        modifier mustHaveBagSpace(SusuwatariStorage storage sus) {

    bool isCarrying = false;
    
    for (uint256 i = 0; i < sus.susuOwners.length; i++) {
        if (sus.tokenIdToSusu[i].carrier == msg.sender) {
            isCarrying = true;
            break;
        }
    }
    require(isCarrying == false, "Caller is already overburdened");
        _;
    }



  modifier susuMustNotHaveBeenAimed(SusuwatariStorage storage sus, uint256 tokenId) {

        
    require(sus.susuOwners[tokenId] == msg.sender && sus.tokenIdToSusu[tokenId].carrier == msg.sender, "Caller is not owner");
    
        _;
    }

    


    struct UserState {
        uint256[] ownedTokens;
        Slot slot;
    }


    struct Slot {
        uint256 susuTokenId;
        uint256 dropCooldownTime;
        address ownerAddress;
    }


function getCurrentState(SusuwatariStorage storage sus) public view returns (UserState memory) {

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
            ownedTokens[index] = i;
            index++;
        }
    }

    Slot memory slot;
    for (uint256 i = 0; i < ownedTokens.length; i++) {
        uint256 tokenId = ownedTokens[i];
        if (sus.tokenIdToSusu[tokenId].carrier == msg.sender) {
            slot.susuTokenId = tokenId;
            slot.dropCooldownTime = sus.tokenIdToSusu[tokenId].dropCooldownTime;
            slot.ownerAddress = sus.susuOwners[tokenId];
            break; //one slot per user!
        }
    }

    UserState memory state = UserState({
        ownedTokens: ownedTokens,
        slot: slot
    });
    
    return state;
}



    function registerMe(SusuwatariStorage storage sus) internal { 
        require(sus.maxSlotCount[msg.sender] == 0, "User already registered");

        Susu memory newSusu = Susu({
            tokenId: sus.susuOwners.length + 1,
            dropCooldownTime: 0,
            originLocation: "",
            currentLocation: "",
            destination: "",
            message: "",
            carrier: msg.sender
        });

        sus.maxSlotCount[msg.sender] = 1;
        sus.susuOwners.push(msg.sender);
        sus.tokenIdToSusu[newSusu.tokenId] = newSusu;
        sus.baggedSusus[newSusu.tokenId] = msg.sender;
    
    }

function aimInitialSusu(SusuwatariStorage storage sus, uint256 tokenId, string memory location, string memory destination, string memory message) internal isUserRegistered(sus) mustExistSusu(sus, tokenId) susuMustNotHaveBeenAimed(sus,tokenId) returns (uint256, string memory, string memory, string memory) {
    
       
    Susu storage susu = sus.tokenIdToSusu[tokenId];
    
   
    susu.dropCooldownTime = 300 + (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 301);
    susu.originLocation = location;
    susu.currentLocation = location;
    susu.destination = destination;
    susu.message = message;
    susu.carrier = msg.sender;
    sus.baggedSusus[tokenId] = msg.sender;
    
}





function dropSusu(SusuwatariStorage storage sus, uint256 tokenId, string memory location, string memory destination, string memory message) internal isUserRegistered(sus) mustExistSusu(sus, tokenId) mustCarrySusu(sus, tokenId) returns (uint256, string memory, string memory, string memory) {
  
    
    Susu storage susu = sus.tokenIdToSusu[tokenId];
    
   
    susu.dropCooldownTime = 300 + (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 301);
    susu.currentLocation = location;
    susu.carrier = address(0);
    sus.baggedSusus[tokenId] = msg.sender;
    
}

 

function tryPickupSusu(SusuwatariStorage storage sus, uint256 tokenId, string memory location, string memory destination, string memory message) internal isUserRegistered(sus) mustExistSusu(sus, tokenId) mustNotCarrySusu(sus, tokenId) isNotBeingCarriedSusu(sus,tokenId) returns (uint256, string memory, string memory, string memory) {
     
    Susu storage susu = sus.tokenIdToSusu[tokenId];
    
     require(
        keccak256(abi.encodePacked(susu.currentLocation)) == keccak256(abi.encodePacked(location)), 
        "Caller is not in the correct location"
    );
   
    susu.dropCooldownTime = 300 + (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 301);
    susu.carrier = msg.sender;
    susu.baggedSusus[tokenId] = msg.sender;
    
}


}