//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Context.sol";
import "./LeafWalletRegistryActivate.sol";
import {LibDiamond} from "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";
import {SusuwatariStorage,StorageHandler} from "./SusuwatariStorage.sol";
import {LibSusuwatari} from "./LibSusuwatari.sol";


contract SusuwatariLeafWalletFacet is LeafWalletRegistryActivate,Context  {
    
    function registerAndAssignMe(uint8 team) public{
        super.assignActivatableAddressToSender(msg.sender);
        LibSusuwatari.registerMe(susu(), team);
    }


}



    