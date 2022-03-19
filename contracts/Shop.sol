// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Shop {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;
    Item[] public catalog;
    address payable public owner;
    address payable public governor;
    uint256 public freeTransactions = 1000;

    Counters.Counter private _itemIds;
    Counters.Counter private _transIds;
    Counters.Counter public transactionsCount;

    Trans[] public transactions;

    Counters.Counter private affiliateId;
    Affiliate[] public proposedAffArr;
    mapping(address => Item) proposedAffiliates;
    mapping(address => Item) affiliates;

    struct Item {
        uint256 itemId;
        string name;
        string description;
        string image;
        uint256 price;
        bool inStock;
        bool isDeleted;
    }

    struct Affiliate {
        uint256 percentage;
        address affiliateAddress;
        uint256 id;
    }

    struct Trans {
        uint256 transId;
        uint256[] itemIds;
        uint256[] itemQty;
        uint256 total;
        bool isValid;
        address client;
        uint256 review;
        bool isReviewed;
    }

    event ItemCreated (
        uint256 itemId,
        string name,
        string description,
        string image,
        uint256 price
    );

    constructor(address _owner, string memory _name, string memory _description, string memory _location, string memory _phone, string memory _image) {
        owner = payable(address(_owner));
        name = _name;
        description = _description;
        location = _location;
        phone = _phone;
        image = _image;
        governor= payable(address(msg.sender));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner function");
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "Only governor function");
        _;
    }

    function createItem(string memory _name, string memory _description, string memory _image, uint256 _price) public onlyOwner payable {
        require(_itemIds.current() < 100, "Must be fewer than 100 items");
        uint256 itemId = _itemIds.current();
        Item memory newItem = Item(
            itemId,
            _name,
            _description,
            _image,
            _price,
            true,
            false
        );
        _itemIds.increment();
        catalog.push(newItem);

        emit ItemCreated(itemId, _name, _description, _image, _price);
    }

    function setInStock(uint256 itemId, bool _inStock) public onlyOwner {
        catalog[itemId].inStock = _inStock;
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog;
    }

    function deleteItem(uint256 itemId) public onlyOwner {
        for (uint256 i = 0; i < catalog.length; i++) {
            if (catalog[i].itemId == itemId) {
                catalog[i].isDeleted = true;
                break;
            }
        }
    }

    function proposeAffilate(uint256 percentage, address affiliate) public {
        affiliateId.increment();
        uint256 _id = affiliateId.current();
        proposedAffiliates[msg.sender] = Affiliate({
            affiliateAddress: msg.sender,
            percentage: percentage,
            id: _id
        });
        proposedAffArr.push(proposedAffiliates[msg.sender]);
    }

    function getProposedAffiliates() public onlyOwner returns (Affiliate[] memory) {
        return proposedAffArr;
    }

    function approveAffiliate(uint256 id, address affAddr) public onlyOwner {
        affiliates[affAddr] = proposedAffiliates[affAddr];
        uint256 affId = proposedAffiliates[affAddr].id;
        
        delete proposedAffArr[affId];
        proposedAffArr[affId] = proposedAffArr[proposedAffArr.length - 1];
        delete proposedAffiliates[affAddr];
    }

    function makeAffTransaction(uint256[] memory itemIds, uint256[] memory itemQty, address affAddr)
        public payable returns (uint256 transactionId)
    {
        Affiliate storage aff = affiliates[affAddr];
        require(aff, "Affiliate must be approved");
        uint256 total = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            total += catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        transactionsCount.increment();
        if (transactionsCount.current() > freeTransactions) {
            uint256 govShare = total.div(100);
            uint256 affShare = total.div(100).mult(aff.percentage);
            uint256 shopShare = total.sub(govShare).sub(affShare);
            payable(address(governor)).transfer(govShare);
            payable(address(owner)).transfer(shopShare);
            payable(address(aff.affilateAddress)).transfer(affShare);
        } else {
            payable(address(owner)).transfer(total);
        }
        uint256 transId = _transIds.current();
        transactions.push(Trans({
            transId: transId,
            itemIds: itemIds,
            itemQty: itemQty,
            total: total,
            isValid: true,
            client: msg.sender,
            review: 0,
            isReviewed: false,
            affilate: affAddr,
            affPercentage: aff.percentage
        }));
        _transIds.increment();

        return transId;
    }

    function makeTransaction(uint256[] memory itemIds, uint256[] memory itemQty)
        public payable returns (uint256 transactionId)
    {
        uint256 total = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            total += catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        transactionsCount.increment();
        if (transactionsCount.current() > freeTransactions) {
            uint256 govShare = total.div(100);
            uint256 shopShare = total.sub(govShare);
            payable(address(governor)).transfer(govShare);
            payable(address(owner)).transfer(shopShare);
        } else {
            payable(address(owner)).transfer(total);
        }
        uint256 transId = _transIds.current();
        transactions.push(Trans({
            transId: transId,
            itemIds: itemIds,
            itemQty: itemQty,
            total: total,
            isValid: true,
            client: msg.sender,
            review: 0,
            isReviewed: false,
            affilate: 0,
            affPercentage: 0
        }));
        _transIds.increment();

        return transId;
    }

    function giveReview(uint256 stars, uint256 transId) public {
        require(transactions[transId].client == msg.sender, "Sender is not client");
        transactions[transId].review = stars;
        transactions[transId].isReviewed = true;
    }

    function fetchTransactions() public view returns (Trans[] memory) {
        return transactions;
    }

    function selfDestruct() public onlyGovernor {
        selfdestruct(payable(governor));
    }

    function setFreeTransactions(uint256 _freeTransactions) public onlyGovernor {
        freeTransactions = _freeTransactions;
    }
}