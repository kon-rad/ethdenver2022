// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "../library/ERC721Modified.sol";

contract ItemToken is ERC721Modified {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;
    address public owner;
    address public shop;
    uint256 public price;
    bool internal initialized = false;
    bool public isPaused = true;
    uint256[] public templateTokenIds;

    event BatchSale(address _to, uint256 _amounts);
    event CreateItem(string _uri);
    event SetTokenURI(uint256 _tokenId, string _uri);

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

    function initialize(address _owner, address _shop, string memory name_, string memory symbol_, uint256 _price) public {
        require(initialized == false, "ERC721:00");
        isPaused = false;
        initialized = true;
        owner = _owner;
        shop = _shop;
        _name = name_;
        _symbol = symbol_;
        price = _price;
    }

    modifier onlyShop() {
        require(msg.sender == shop, "ERC721:01");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ERC721:04");
        _;
    }

    function batchSale(address _to, uint256 _amount) external onlyShop whenNotPaused {
        // mint to new owner
        uint256 i;
        for (i = 0; i < _amount; i++) {
            uint256 currentTokenId = _tokenId.current();
            _safeMint(_to, currentTokenId);
            _tokenId.increment();
        }
        emit BatchSale(_to, _amount);
    }

    function createItem(string memory _uri) public onlyShop whenNotPaused {
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        // mint to shop the template Item
        _safeMint(address(owner), currentTokenId);
        _setTokenURI(currentTokenId, _uri);
        _tokenId.increment();
        emit CreateItem(_uri);
    }

    function setTokenURI(uint256 tokenId, string memory _uri) external onlyOwner whenNotPaused {
        _setTokenURI(tokenId, _uri);
        emit SetTokenURI(tokenId, _uri);
    }

    // todo: create resale transfer options: yes / no / max / min price
    // todo: create royalty
}