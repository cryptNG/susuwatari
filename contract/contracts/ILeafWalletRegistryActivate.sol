//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ILeafWalletRegistryCore.sol";

interface ILeafWalletRegistryActivate is ILeafWalletRegistryCore{
    function assignActivatableAddressToSender(address assignee)  external;
    function getActivationCodeOfSender() external view returns (uint256);
}