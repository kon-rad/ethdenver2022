// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Shop is Ownable {

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;

    struct Item {
        uint itemId;
        string name;
        string description;
        uint256 price;
        bool inStock;
    }

    event ShopCreated(address indexed shopAddress, string indexed name);

    constructor(address memory _owner, string memory _name, string memory _description, string memory _location, string memory _phone, string memory _image) external returns (address) {
        owner = _owner;
        name = _name;
        description = _description;
        location = _location;
        phone = _phone;
        image = _image;
    }

    function createItem(string memory name, string memory description, string memory image, uint256 memory price) public onlyOwner {
        
    }
}