// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./library/Catalog.sol";

contract Shop {
    using SafeMath for uint;
    using Counters for Counters.Counter;
    using Catalog for ItemsCatalogArray;

    ItemsCatalogArray private catalog;

    string public name;
    string public description;
    string public location;
    string public phone;
    string public image;
    address payable public owner;
    address payable public governor;
    uint public freeTransactions = 1000;

    Counters.Counter private _itemIds;

    Counters.Counter private affiliateId;
    Affiliate[] public proposedAffArr;
    Affiliate[] public approvedAffArr;
    mapping(address => Affiliate) public proposedAffiliates;
    mapping(address => Affiliate) public affiliates;
    mapping(string => string) private fileLinks;

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

    Counters.Counter private _transIds;
    Counters.Counter public transactionsCount;

    Trans[] public transactions;

    struct Affiliate {
        uint percentage;
        address affAddr;
        uint id;
    }
    event ItemCreated (
        uint itemId,
        string name,
        string description,
        string image,
        uint price
    );

    constructor(
        address _owner,
        string memory _name,
        string memory _description,
        string memory _location,
        string memory _phone,
        string memory _image
    ) {
        owner = payable(address(_owner));
        name = _name;
        description = _description;
        location = _location;
        phone = _phone;
        image = _image;
        governor= payable(address(msg.sender));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "OO0");
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "OG0");
        _;
    }

    function createItem(
        string memory _name,
        string memory _description,
        string memory _image,
        uint _price,
        string memory _filePath,
        bool _isDigital
    ) public onlyOwner payable {
        uint itemId = _itemIds.current();
        catalog.createItem(
            Item({
                itemId: itemId,
                name: _name,
                description: _description,
                image: _image,
                price: _price,
                inStock: true,
                isDeleted: false,
                isDigital: _isDigital
            })
        );
        if (_isDigital) {
            fileLinks[Strings.toString(itemId)] = _filePath;
        }
        _itemIds.increment();

        emit ItemCreated(itemId, _name, _description, _image, _price);
    }

    function fetchItemLink(
        string memory itemId,
        uint transId
    ) public view returns (string memory) {
        require(transactions[transId].client == msg.sender, "Sender must be client");
        return fileLinks[itemId];
    }

    function setInStock(uint _itemId, bool _inStock) public onlyOwner {
        catalog.setInStock(_itemId, _inStock);
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog.fetchCatalogItems();
    }

    function deleteItem(uint _id) public onlyOwner {
        catalog.deleteItem(_id);
    }

    // ================================= // AFFILIATES // ================================= //

    function proposeAffiliate(uint percentage) public {
        require(affiliates[msg.sender].percentage == 0, "PA0");
        require(percentage > 0, "PA1");
        require(percentage < 100, "PA2");
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

    function getProposedAffiliates() public view returns (Affiliate[] memory) {
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
                    approvedAffArr[i] = approvedAffArr[approvedAffArr.length - 1];
                }
                break;
            }
        }
        delete affiliates[affAddr];
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
    
    // ================================= // TRANSACTION // ================================= //

    function makeTransaction(uint[] memory itemIds, uint[] memory itemQty, address affAddr)
        public payable returns (uint transactionId)
    {
        Affiliate memory aff;
        if (affAddr != address(0)) {
            aff = affiliates[affAddr];
            require(aff.affAddr != address(0), "MT0");
        }
        uint total = 0;
        for (uint i = 0; i < itemIds.length; i++) {
            total += catalog.catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "MT1");
        transactionsCount.increment();
        uint shopShare;
        uint affShare;
        if (transactionsCount.current() > freeTransactions) {
            uint govShare = total.div(100);
            if (affAddr != address(0)) {
                affShare = total.div(100).mul(aff.percentage);
                shopShare = total.sub(govShare).sub(affShare);
                payable(address(aff.affAddr)).transfer(affShare);
            } else {
                shopShare = total.sub(govShare);
            }
            payable(address(owner)).transfer(shopShare);
            payable(address(governor)).transfer(govShare);
        } else {
            if (affAddr != address(0)) {
                affShare = total.div(100).mul(aff.percentage);
                shopShare = total.sub(affShare);
                payable(address(owner)).transfer(shopShare);
                payable(address(aff.affAddr)).transfer(affShare);
            } else {
                payable(address(owner)).transfer(total);
            }
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
        require(transactions[transId].client == msg.sender, "GR0");
        transactions[transId].review = stars;
        transactions[transId].isReviewed = true;
    }

    function fetchTransactions() public view returns (Trans[] memory) {
        return transactions;
    }

    function selfDestruct() public onlyGovernor {
        selfdestruct(payable(governor));
    }

    /* this may be deleted if size is too big */
    function setFreeTransactions(uint _freeTransactions) public onlyGovernor {
        freeTransactions = _freeTransactions;
    }
}