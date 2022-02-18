// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/Counters.sol';

import "hardhat/console.sol";

contract Shop {
    using Counters for Counters.Counter;

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;
    Item[] public catalog;
    address public owner;

    Counters.Counter private _itemIds;
    Counters.Counter private _transIds;

    Trans[] public transactions;

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
        bool isValid;
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
        owner = address(_owner);
        name = _name;
        description = _description;
        location = _location;
        phone = _phone;
        image = _image;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner function");
        _;
    }

    function createItem(string memory name, string memory description, string memory image, uint256 price) public onlyOwner {

        require(_itemIds.current() < 100, "Must be fewer than 100 items");
        uint256 itemId = _itemIds.current();
        Item memory newItem = Item(
            itemId,
            name,
            description,
            image,
            price,
            true
        );
        _itemIds.increment();
        catalog.push(newItem);

        emit ItemCreated(itemId, name, description, image, price);
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog;
    }

    function makeTransaction(uint256[] memory itemIds, uint256[] memory itemQty) public payable returns (uint256 transactionId) {
        uint256 total = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            total += catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        payable(address(owner)).transfer(total);
        uint256 transId = _transIds.current();
        transactions.push(Trans(
            transId,
            itemIds,
            itemQty,
            total,
            true
        ));
        _transIds.increment();

        return transId;
    }

    function fetchTransactions() public view returns (Trans[] memory) {
        return transactions;
    }
}