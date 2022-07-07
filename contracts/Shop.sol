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
    uint256 public shopId;
    string public image;
    string public tags;
    address payable public owner;
    address payable public governor;
    address payable public nftAddress;
    uint256 public freeTransactions = 1000;
    bool private initialized = false;
    ItemsCatalogArray private catalog;
    uint256[] public _templateItemIds;
    Counters.Counter private _affiliateId;
    Counters.Counter private _transIds;
    Counters.Counter public _transactionsCount;
    Affiliate[] public proposedAffArr;
    Affiliate[] public approvedAffArr;
    mapping(address => Affiliate) public proposedAffiliates;
    mapping(address => Affiliate) public affiliates;

    struct Trans {
        uint256 transId;
        uint[] itemIds;
        uint[] itemQty;
        uint256 total;
        bool isValid;
        address client;
        uint256 review;
        bool isReviewed;
    }

    Trans[] public transactions;

    struct Affiliate {
        uint256 percentage;
        address affAddr;
        uint256 id;
    }
    event ItemCreated (
        uint256 itemId,
        uint256 price
    );
    
    function initialize(
        address _owner,
        string memory _name,
        string memory _image,
        string memory _tags,
        uint256 _shopId,
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
        require(msg.sender == owner, "S:01");
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "S:03");
        _;
    }

    function setTags(string memory _tags) external onlyOwner {
        require(StringUtils.strlen(_tags) < 280, "S:01 Tags must be less than 280 characters");
        tags = _tags;
    }

    function createItem(
        uint256 _price,
        string memory _tokenURI
    ) public onlyOwner payable {
        uint256 itemId = IItemToken(nftAddress).getTotal() + 1;
        IItemToken(nftAddress).createItem(itemId, _tokenURI);

        catalog.createItem(
            Item({
                itemId: itemId,
                price: _price,
                isDeleted: false
            })
        );
        _templateItemIds.push(itemId);

        emit ItemCreated(itemId, _price);
    }

    function fetchCatalogItems() public view returns (Item[] memory) {
        return catalog.fetchCatalogItems();
    }

    function deleteItem(uint256 _id) public onlyOwner {
        catalog.deleteItem(_id);
    }

    // ================================= // AFFILIATES // ================================= //

    function proposeAffiliate(uint256 percentage) public {
        require(affiliates[msg.sender].percentage == 0, "PA0");
        require(percentage > 0, "PA1");
        require(percentage < 100, "PA2");
        uint256 _id = _affiliateId.current();
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
        for (uint256 i; i < approvedAffArr.length; i++) {
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
        uint256 affId = proposedAffiliates[affAddr].id;
        
        approvedAffArr.push(affiliates[affAddr]);
        delete proposedAffArr[affId];
        if (proposedAffArr.length > 0) {
            proposedAffArr[affId] = proposedAffArr[proposedAffArr.length - 1];
        }
        delete proposedAffiliates[affAddr];
    }
    
    // ================================= // TRANSACTION // ================================= //

    function makeTransaction(uint[] memory itemIds, uint[] memory itemQty, address affAddr)
        public payable returns (uint256 transactionId)
    {
        Affiliate memory aff;
        // if an affiliate address is provided make sure it is an approved affiliate
        if (affAddr != address(0)) {
            aff = affiliates[affAddr];
            require(aff.affAddr != address(0), "MT0");
        }
        uint256 total = 0;
        // get items total
        uint256 i;
        uint256 len = itemIds.length;
        for (i = 0; i < len; i++) {
            total += catalog.catalog[itemIds[i]].price * itemQty[i];
        }
        require(msg.value >= total, "MT1");

        IItemToken(nftAddress).batchSale(msg.sender, itemIds, itemQty);
        _transactionsCount.increment();
        uint256 affShare = 0;
        uint256 govShare = 0;
        if (_transactionsCount.current() > freeTransactions) govShare = total.div(100);
        if (affAddr != address(0)) {
            affShare = total.div(100).mul(aff.percentage);
            payable(address(aff.affAddr)).transfer(affShare);
        }
        payable(address(owner)).transfer(total.sub(govShare).sub(affShare));
        if (govShare > 0) payable(address(governor)).transfer(govShare);

        uint256 transId = _transIds.current();
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

    function giveReview(uint256 stars, uint256 transId) public {
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

    function setFreeTransactions(uint256 _freeTransactions) public onlyGovernor {
        freeTransactions = _freeTransactions;
    }
}