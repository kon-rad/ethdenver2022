// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract ItemToken is ERC1155URIStorage {

    using Counters for Counters.Counter;
    address public owner;
    address public shop;
    bool internal initialized = false;

    constructor(string memory _baseURI) ERC1155(_baseURI) {}

    function initialize(address _owner, address _shop) public {
        require(initialized == false, "IT:00");
        initialized = true;
        owner = _owner;
        shop = _shop;
    }

    modifier onlyShop() {
        require(msg.sender == shop, "ERC115501");
        _;
    }

    function batchSale(address _to, uint256[] memory _tokenIds, uint256[] memory _amounts) public {
        // mint to new owner
        require(_tokenIds.length == _amounts.length, "ERC115500");
        uint len = _tokenIds.length;
        uint i;
        for (i = 0; i < len; i++) {
            _mint(_to, _tokenIds[i], _amounts[i], "");
        }
    }

    function createItem(uint256 _tokenId, string memory _uri) public onlyShop {
        // mint to owner
        _mint(address(owner), _tokenId, 1, "");
        _setURI(_tokenId, _uri);
    }

    // todo: create resale transfer options: yes / no / max / min price
    // todo: create royalty
}