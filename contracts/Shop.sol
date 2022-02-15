// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract Shop is Ownable {
    using Counters for Counters.Counter;

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;
    Item[] public catalog;
    address public shopOwner;

    Counters.Counter private _itemIds;
    Counters.Counter private _transIds;

    mapping(uint256 => Item) private idToItem;
    mapping(uint256 => Trans) private idToTrans;

    struct Item {
        uint itemId;
        string name;
        string description;
        string image;
        uint256 price;
        bool inStock;
    }

    struct Trans {
        uint256 transId;
        uint256[] itemIds;
        uint256[] itemQty;
        uint256 total;
        bool isDone;
    }

    event ItemCreated (
        uint itemId,
        string name,
        string description,
        string image,
        uint256 price
    );
    // event TransCreated (
    //     uint transId,
    //     uint256[] itemIds,
    //     uint256[] itemQty,
    //     uint256 total
    // );

    constructor(address _owner, string memory _name, string memory _description, string memory _location, string memory _phone, string memory _image) {
        shopOwner = address(_owner);
        name = _name;
        description = _description;
        location = _location;
        phone = _phone;
        image = _image;
    }

    function createItem(string memory name, string memory description, string memory image, uint256 price) public onlyOwner {

        require(_itemIds.current() < 100, "Must be fewer than 100 items");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        Item memory newItem = Item(
            itemId,
            name,
            description,
            image,
            price,
            true
        );
        catalog.push(newItem);
        idToItem[itemId] = newItem;

        emit ItemCreated(itemId, name, description, image, price);
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog;
    }

    function initTransaction(uint256[] memory itemIds, uint256[] memory itemQty) public payable returns (uint256 transactionId) {
        uint256 total = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            total += idToItem[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        payable(address(this)).transfer(total);
        _transIds.increment();
        uint256 transId = _transIds.current();
        idToTrans[transId] = Trans(
            transId,
            itemIds,
            itemQty,
            total,
            false
        );

        return transId;
    }

    function fulfillTransaction(uint256 transId) public onlyOwner {
        idToTrans[transId].isDone = true;
    }

    function fetchPendingTransactions() public returns (Trans[] memory) {
        uint256 pendingCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _transIds.current(); i++) {
            if (!idToTrans[i].isDone) {
                pendingCount++;
            }
        }
        Trans[] memory pendingTrans = new Trans[](pendingCount);
        for (uint256 i = 0; i < _transIds.current(); i++) {
            if (!idToTrans[i].isDone) {
                pendingTrans[currentIndex] = idToTrans[i];
                currentIndex++;
            }
        }
        return pendingTrans;
    }
}