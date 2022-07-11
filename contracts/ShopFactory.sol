// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Shop.sol";
import "./tokens/ItemToken.sol";
import "./library/StringUtils.sol";

contract ShopFactory is Ownable {
    address[] public allShops;
    uint256 private shopPrice = 0 ether;
    uint256 public shopCount = 0;
    address internal shopTemplate;
    address internal nftTemplate;

    event ShopCreated(address indexed shopAddress, string indexed name);

    constructor(address _shopTemplate, address _nftTemplate) {
        shopTemplate = _shopTemplate;
        nftTemplate = _nftTemplate;
    }

    function createShop(
            string memory _name,
            string memory _metadataUrl
        ) external payable returns (address) {
        require(msg.value >= shopPrice, "CS0");
        require(StringUtils.strlen(_name) < 280, "SF:01 Name must be less than 280 characters");

        Shop shop = Shop(_createClone(shopTemplate));
        shop.initialize(
            msg.sender,
            _name,
            _metadataUrl,
            shopCount,
            address(this),
            nftTemplate
        );

        emit ShopCreated(address(shop), _name);

        allShops.push(address(shop));
        shopCount++;
        return address(shop);
    }
    
    function setShopPrice(uint _price) public onlyOwner {
        shopPrice = _price;
    }

    function fetchAllShops() public view returns (address[] memory) {
        return allShops;
    }

    function selfDestruct() public onlyOwner {
        selfdestruct(payable(address(owner())));
    }

    function deleteShop(address deleteAddr) public onlyOwner {
        Shop shop = Shop(deleteAddr);
        shop.selfDestruct();
        for (uint256 i = 0; i < allShops.length; i++) {
            if (allShops[i] == deleteAddr) {
                removeShopAtIndex(i);
                break;
            }
        }
    }

    function removeShopAtIndex(uint256 index) internal {
        for (uint256 i = index; i < allShops.length - 1; i++) {
            allShops[i] == allShops[i + 1];
        }
        allShops.pop();
    }

    receive() external payable {}

    function withdraw() onlyOwner public {
       payable(address(msg.sender)).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
       return address(this).balance;
    }

    function _createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }
}