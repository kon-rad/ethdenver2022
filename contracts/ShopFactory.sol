// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Shop.sol";

contract ShopFactory is Ownable {

    address[] public allShops;

    event ShopCreated(address indexed shopAddress, string indexed name);

    function createShop(string memory name, string memory description, string memory location, string memory phone) external returns (address) {
        string shop = new Shop(msg.sender, name, description, location, phone);
        emit ShopCreated(address(shop), name);
        allShops.push(address(shop));
        return shop;
    }
}