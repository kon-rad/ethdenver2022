// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Shop {
    using SafeMath for uint;
    using Counters for Counters.Counter;

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;
    Item[] public catalog;
    address payable public owner;
    address payable public governor;
    uint public freeTransactions = 1000;

    Counters.Counter private _itemIds;
    Counters.Counter private _transIds;
    Counters.Counter public transactionsCount;

    Trans[] public transactions;

    Counters.Counter private affiliateId;
    Affiliate[] public proposedAffArr;
    Affiliate[] public approvedAffArr;
    mapping(address => Affiliate) proposedAffiliates;
    mapping(address => Affiliate) affiliates;

    struct Item {
        uint itemId;
        string name;
        string description;
        string image;
        uint price;
        bool inStock;
        bool isDeleted;
    }

    struct Affiliate {
        uint percentage;
        address affAddr;
        uint id;
    }

    struct Trans {
        uint transId;
        uint[] itemIds;
        uint[] itemQty;
        uint total;
        bool isValid;
        address client;
        uint review;
        bool isReviewed;
        address affilate;
        uint affPercentage;
    }

    event ItemCreated (
        uint itemId,
        string name,
        string description,
        string image,
        uint price
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

    function createItem(string memory _name, string memory _description, string memory _image, uint _price) public onlyOwner payable {
        require(_itemIds.current() < 100, "Must be fewer than 100 items");
        uint itemId = _itemIds.current();
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

    function setInStock(uint itemId, bool _inStock) public onlyOwner {
        catalog[itemId].inStock = _inStock;
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog;
    }

    function deleteItem(uint itemId) public onlyOwner {
        for (uint i = 0; i < catalog.length; i++) {
            if (catalog[i].itemId == itemId) {
                catalog[i].isDeleted = true;
                break;
            }
        }
    }

    // ================================= // AFFILIATES // ================================= //

    function proposeAffiliate(uint percentage) public {
        uint _id = affiliateId.current();
        Affiliate memory pAff = Affiliate({
            affAddr: msg.sender,
            percentage: percentage,
            id: _id
        });
        proposedAffiliates[msg.sender] = pAff;
        proposedAffArr.push(pAff);
        affiliateId.increment();
    }

    function getProposedAffiliates() public view onlyOwner returns (Affiliate[] memory) {
        return proposedAffArr;
    }

    function getApprovedAffiliates() public view returns (Affiliate[] memory) {
        return approvedAffArr;
    }

    function cancelAffiliate(address affAddr) public onlyOwner {
        for (uint i; i < approvedAffArr.length; i++) {
            if (approvedAffArr[i].affAddr == affAddr) {
                delete approvedAffArr[i];
                if (i != approvedAffArr.length - 1) {
                    approvedAffArr[i] == approvedAffArr[approvedAffArr.length - 1];
                }
                break;
            }
        }
        delete affiliates[affId];
    }

    function approveAffiliate(address affAddr) public onlyOwner {
        affiliates[affAddr] = proposedAffiliates[affAddr];
        uint affId = proposedAffiliates[affAddr].id;
        
        approvedAffArr.push(affiliates[affAddr]);
        delete proposedAffArr[affId];
        if (proposedAffArr.length > 0) {
            proposedAffArr[affId] = proposedAffArr[proposedAffArr.length - 1];
        }
        delete proposedAffiliates[affAddr];
    }

    function makeAffTransaction(uint[] memory itemIds, uint[] memory itemQty, address affAddr)
        public payable returns (uint transactionId)
    {
        Affiliate memory aff = affiliates[affAddr];
        require(aff.id != 0, "Affiliate must be approved");
        uint total = 0;
        for (uint i = 0; i < itemIds.length; i++) {
            total += catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        transactionsCount.increment();
        if (transactionsCount.current() > freeTransactions) {
            uint govShare = total.div(100);
            uint affShare = total.div(100).mul(aff.percentage);
            uint shopShare = total.sub(govShare).sub(affShare);
            payable(address(governor)).transfer(govShare);
            payable(address(owner)).transfer(shopShare);
            payable(address(aff.affAddr)).transfer(affShare);
        } else {
            payable(address(owner)).transfer(total);
        }
        uint transId = _transIds.current();
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

    // ================================= // TRANSACTION // ================================= //

    function makeTransaction(uint[] memory itemIds, uint[] memory itemQty)
        public payable returns (uint transactionId)
    {
        uint total = 0;
        for (uint i = 0; i < itemIds.length; i++) {
            total += catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "Required value not met");
        transactionsCount.increment();
        if (transactionsCount.current() > freeTransactions) {
            uint govShare = total.div(100);
            uint shopShare = total.sub(govShare);
            payable(address(governor)).transfer(govShare);
            payable(address(owner)).transfer(shopShare);
        } else {
            payable(address(owner)).transfer(total);
        }
        uint transId = _transIds.current();
        transactions.push(Trans({
            transId: transId,
            itemIds: itemIds,
            itemQty: itemQty,
            total: total,
            isValid: true,
            client: msg.sender,
            review: 0,
            isReviewed: false,
            affilate: address(0),
            affPercentage: 0
        }));
        _transIds.increment();

        return transId;
    }

    function giveReview(uint stars, uint transId) public {
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

    function setFreeTransactions(uint _freeTransactions) public onlyGovernor {
        freeTransactions = _freeTransactions;
    }
}