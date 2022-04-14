// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "./Shop.sol";
import "./interfaces/ShopMakerInterface.sol";

contract ShopMaker is ShopMakerInterface {

    event ShopCreated(address indexed shopAddress, string indexed name);

    function createShop(
        address owner,
        string memory name,
        string memory description,
        string memory location,
        string memory phone,
        string memory image,
        address governor
    ) external override payable returns (address) {
        Shop shop = new Shop(owner, name, description, location, phone, image, governor);
        emit ShopCreated(address(shop), name);
        return address(shop);
    }
}