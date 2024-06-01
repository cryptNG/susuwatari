//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ILeafWalletRegistryBasic.sol";
import "./LeafWalletRegistryCore.sol";

contract LeafWalletRegistryBasic is ILeafWalletRegistryBasic,LeafWalletRegistryCore {
    
    function assignAddressToSender(address assignee) public override{
        _assignAddressToSender(assignee);
    }



}



    