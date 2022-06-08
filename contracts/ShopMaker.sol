// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "./Shop.sol";
import "./interfaces/IShopMaker.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./tokens/ItemToken.sol";
import "./CloneFactory.sol";

contract ShopMaker is IShopMaker {
    
    address internal shopTemplateAddress;
    address owner;

    event ShopCreated(address indexed shopAddress, string indexed name);

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "SM00");
        _;
    }

    function setShopTemplate(address _shopTemplate) external onlyOwner {
        shopTemplateAddress = _shopTemplate;
    }

    function createShop(
        address _owner,
        string memory _name,
        string memory _image,
        uint256 _shopId,
        address _governor,
        address _nftAddress
    ) external override payable returns (address) {
        address nftAddress = address(0);
        Shop shop = Shop(createClone(shopTemplateAddress));
        emit ShopCreated(address(shop), _name);
        return address(shop);
    }
}