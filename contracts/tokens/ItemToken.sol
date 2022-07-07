// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "../library/ERC721Modified.sol";

contract ItemToken is ERC721Modified {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;
    address public owner;
    address public shop;
    bool internal initialized = false;
    bool public isPaused = true;
    uint256[] public templateTokenIds;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721Modified(_name, _symbol) {
    }

    modifier whenNotPaused() {
        require(!isPaused, "Mint is paused");
        _;
    }

    function togglePause() external onlyShop {
        isPaused = !isPaused;
    }

    function getTotal() external view returns (uint256) {
        return _tokenId.current();
    }

    function getTemplateTokenIds() public view returns (uint256[] memory) {
        return templateTokenIds;
    }

    function initialize(address _owner, address _shop, string memory name_, string memory symbol_) public {
        require(initialized == false, "ERC721:00");
        isPaused = false;
        initialized = true;
        owner = _owner;
        shop = _shop;
        _name = name_;
        _symbol = symbol_;
    }

    modifier onlyShop() {
        require(msg.sender == shop, "ERC721:01");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ERC721:04");
        _;
    }

    function batchSale(address _to, uint256[] memory _templateTokenIds, uint256[] memory _amounts) external onlyShop {
        // mint to new owner
        require(_templateTokenIds.length == _amounts.length, "ERC721:02");
        uint256 len = _templateTokenIds.length;
        uint256 i;
        for (i = 0; i < len; i++) {
            require(_amounts[i] > 0, "ERC721:03");
            uint256 j = 0;
            for (j; j < _amounts[i]; j++) {
                uint256 currentTokenId = _tokenId.current();
                _safeMint(_to, currentTokenId);
                // get the token URI from the template token
                _setTokenURI(currentTokenId, _tokenURIs[_templateTokenIds[i]]);
                _tokenId.increment();
            }
        }
    }

    function createItem(string memory _uri) public onlyShop {
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        // mint to shop the template Item
        _safeMint(address(shop), currentTokenId);
        templateTokenIds.push(currentTokenId);
        _setTokenURI(currentTokenId, _uri);
        _tokenId.increment();
    }

    function setTokenURI(uint256 tokenId, string memory _uri) external onlyOwner {
        _setTokenURI(tokenId, _uri);
    }

    // todo: create resale transfer options: yes / no / max / min price
    // todo: create royalty
}