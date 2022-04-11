// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

interface IShopFactory {
    function createShop(string memory name, string memory description, string memory location, string memory phone, string memory image) external payable returns (address);
    function setShopPrice(uint _price) public;
    function fetchAllShops() public view returns (address[] memory);
    function selfDestruct() public;

}