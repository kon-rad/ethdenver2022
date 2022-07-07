// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./interfaces/IItemToken.sol";
import "./library/Catalog.sol";
import "./library/StringUtils.sol";

contract Shop {
    using SafeMath for uint;
    using Counters for Counters.Counter;
    using Catalog for ItemsCatalogArray;
    // using StringUtils for string;

    string public name;
    uint public shopId;
    string public image;
    string public tags;
    address payable public owner;
    address payable public governor;
    address payable public nftAddress;
    uint public freeTransactions = 1000;
    bool private initialized = false;
    ItemsCatalogArray private catalog;
    Counters.Counter private _itemIds;
    Counters.Counter private _affiliateId;
    Counters.Counter private _transIds;
    Counters.Counter public _transactionsCount;
    Affiliate[] public proposedAffArr;
    Affiliate[] public approvedAffArr;
    mapping(address => Affiliate) public proposedAffiliates;
    mapping(address => Affiliate) public affiliates;
    mapping(uint => string) private fileLinks;

    struct Trans {
        uint transId;
        uint[] itemIds;
        uint[] itemQty;
        uint total;
        bool isValid;
        address client;
        uint review;
        bool isReviewed;
    }

    Trans[] public transactions;

    struct Affiliate {
        uint percentage;
        address affAddr;
        uint id;
    }
    event ItemCreated (
        uint itemId,
        uint price
    );
    
    function initialize(
        address _owner,
        string memory _name,
        string memory _image,
        string memory _tags,
        uint _shopId,
        address _governor,
        address _nftAddress
    ) external {
        require(initialized == false, "S:00");
        require(StringUtils.strlen(_tags) < 280, "S:01 Tags must be less than 280 characters");
        initialized = true;
        owner = payable(address(_owner));
        name = _name;
        image = _image;
        tags = _tags;
        shopId = _shopId;
        governor = payable(address(_governor));
        nftAddress = payable(address(_nftAddress));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Shop01");
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "Shop03");
        _;
    }

    function setTags(string memory _tags) external onlyOwner {
        require(StringUtils.strlen(_tags) < 280, "S:01 Tags must be less than 280 characters");
        tags = _tags;
    }

    function createItem(
        uint _price,
        string memory _filePath,
        string memory _tokenURI
    ) public onlyOwner payable {
        uint itemId = _itemIds.current();
        IItemToken(nftAddress).createItem(itemId, _tokenURI);

        catalog.createItem(
            Item({
                itemId: itemId,
                price: _price,
                isDeleted: false
            })
        );
        fileLinks[itemId] = _filePath;
        _itemIds.increment();

        emit ItemCreated(itemId, _price);
    }

    function fetchItemLink(
        uint _itemId
    ) public view returns (string memory) {
        // only for owner of NFT
        require(IItemToken(nftAddress).balanceOf(msg.sender, _itemId) > 0, "Shop03");
        return fileLinks[_itemId];
    }

    function setItemLink(
        uint _itemId,
        string memory _fileLink
    ) public onlyOwner {
        fileLinks[_itemId] = _fileLink;
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
        uint _id = _affiliateId.current();
        Affiliate memory pAff = Affiliate({
            affAddr: msg.sender,
            percentage: percentage,
            id: _id
        });
        proposedAffiliates[msg.sender] = pAff;
        proposedAffArr.push(pAff);
        _affiliateId.increment();
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
        // if an affiliate address is provided make sure it is an approved affiliate
        if (affAddr != address(0)) {
            aff = affiliates[affAddr];
            require(aff.affAddr != address(0), "MT0");
        }
        uint total = 0;
        // get items total
        uint i;
        uint len = itemIds.length;
        for (i = 0; i < len; i++) {
            total += catalog.catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "MT1");

        IItemToken(nftAddress).batchSale(msg.sender, itemIds, itemQty);
        _transactionsCount.increment();
        uint affShare = 0;
        uint govShare = 0;
        if (_transactionsCount.current() > freeTransactions) govShare = total.div(100);
        if (affAddr != address(0)) {
            affShare = total.div(100).mul(aff.percentage);
            payable(address(aff.affAddr)).transfer(affShare);
        }
        payable(address(owner)).transfer(total.sub(govShare).sub(affShare));
        if (govShare > 0) payable(address(governor)).transfer(govShare);

        uint transId = _transIds.current();
        transactions.push(Trans({
            transId: transId,
            itemIds: itemIds,
            itemQty: itemQty,
            total: total,
            isValid: true,
            client: msg.sender,
            review: 0,
            isReviewed: false
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

    function setFreeTransactions(uint _freeTransactions) public onlyGovernor {
        freeTransactions = _freeTransactions;
    }
}