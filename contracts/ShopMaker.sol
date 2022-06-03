// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "./Shop.sol";
import "./interfaces/ShopMakerInterface.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./tokens/ERC1155Modified.sol";

contract ShopMaker is ShopMakerInterface {

    event ShopCreated(address indexed shopAddress, string indexed name);

    function createShop(
        address owner,
        string memory name,
        string memory description,
        string memory location,
        string memory image,
        uint256 shopId,
        address governor
    ) external override payable returns (address) {
        address nftAddress = new ERC1155Modified();
        Shop shop = new Shop(owner, name, description, location, image, shopId, governor, nftAddress);
        emit ShopCreated(address(shop), name);
        return address(shop);
    }
}