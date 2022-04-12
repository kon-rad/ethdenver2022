// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

interface ShopMakerInterface {
    function createShop(
        address owner,
        string memory name,
        string memory description,
        string memory location,
        string memory phone,
        string memory image
    ) external payable returns (address);
}