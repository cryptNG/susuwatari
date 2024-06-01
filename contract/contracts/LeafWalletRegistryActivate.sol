//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ILeafWalletRegistryActivate.sol";
import "./LeafWalletRegistryCore.sol";
import {LeafWalletStorage,StorageHandler} from  "./SusuwatariStorage.sol";

contract LeafWalletRegistryActivate is ILeafWalletRegistryActivate, LeafWalletRegistryCore  {
    event AssignActivatableAddressToSenderReturn(uint256);
    

    function assignActivatableAddressToSender(address assignee) public virtual override{
        LeafWalletStorage storage lw = lw();
        _assignAddressToSender(assignee);


        uint256 activationCode = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 100;
        if(activationCode<10){
            activationCode = activationCode+10;
        }
        lw._deviceActivationCodes[assignee] = activationCode;


        emit AssignActivatableAddressToSenderReturn(activationCode);
    }

    function getActivationCodeOfSender() public view override returns (uint256){
        LeafWalletStorage storage lw = lw();
        require(lw._deviceOwner[msg.sender] != address(0),"Device not yet registered");
        return lw._deviceActivationCodes[msg.sender];
    }


}



    