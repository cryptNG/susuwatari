//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Context.sol";
import "./LeafWalletRegistryActivate.sol";
import {LibDiamond} from "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";
import {SusuwatariStorage} from "./SusuwatariStorage.sol";


contract SusuwatariLeafWalletFacet is LeafWalletRegistryActivate, Context  {
    
    function assignActivatableAddressToSender(address assignee) public override{
        super.assignActivatableAddressToSender(assignee);
    }
}



    