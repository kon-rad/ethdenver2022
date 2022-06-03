// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract ERC1155Modified is ERC1155URIStorage {

    using Counters for Counters.Counter;
    address public owner;

    constructor() ERC1155URIStorage() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ERC115501");
        _;
    }

    function sellItem(address _to, uint256[] _tokenIds, uint256[] _amounts) public {
        // mint to new owner
        require(_tokenIds.length == _amounts.length, "ERC115500");
        uint len = _tokenIds.length;
        uint i = 0;
        do {
            // mint to new owner
            _mint(_to, _tokenIds[i], _amounts[i], "");
            i++;
        } while(i < len);
    }

    function createItem(uint256 _tokenId, string memory _uri) public onlyOwner {
        // mint to owner
        _mint(address(owner), _tokenId, 1, "");
        _setURI(_tokenId, _uri);
    }
}