//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ILeafWalletRegistryCore.sol";

interface ILeafWalletRegistryBasic is ILeafWalletRegistryCore {
    function assignAddressToSender(address assignee)  external;
}
