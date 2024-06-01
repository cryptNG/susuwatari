//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface ILeafWalletRegistryCore {
    function isSenderRegistered() external view returns (bool);
    function getDeviceOwner() external view returns (address);
    function getRelatedDevices() external view returns (address[] memory);
}