//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ILeafWalletRegistryCore.sol";
import {LeafWalletStorage,StorageHandler} from  "./SusuwatariStorage.sol";

contract LeafWalletRegistryCore is ILeafWalletRegistryCore,StorageHandler {

    

    function _assignAddressToSender(address assignee) internal{
        LeafWalletStorage storage lw = lw();
        require(lw._deviceOwner[assignee] == address(0) || lw._deviceOwner[assignee] == msg.sender,"Device already registered");
     
        if(lw._deviceOwner[assignee] == address(0)){
            lw._ownerDevices[msg.sender].push(assignee);
            lw._deviceOwner[assignee] = msg.sender;
        }
    }


    function isSenderRegistered() public view override returns (bool) {
        LeafWalletStorage storage lw = lw();
        return lw._deviceOwner[msg.sender] != address(0);
    }

    function getDeviceOwner() public view override returns (address) {
        LeafWalletStorage storage lw = lw();
        return lw._deviceOwner[msg.sender];
    }

    function getRelatedDevices() public view override returns (address[] memory) {
        LeafWalletStorage storage lw = lw();
        return lw._ownerDevices[msg.sender];
    }


    


}



    