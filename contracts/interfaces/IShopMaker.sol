// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

interface IShopMaker {

    function setShopTemplate(address _shopTemplate) external;
    function createShop(
        address owner,
        string memory name,
        string memory image,
        uint256 shopId,
        address governor
    ) external payable returns (address);
}