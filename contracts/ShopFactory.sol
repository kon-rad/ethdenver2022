// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Shop.sol";

contract ShopFactory is Ownable {

    address[] public allShops;
    uint256 private shopPrice = 0 ether;

    event ShopCreated(address indexed shopAddress, string indexed name);

    function createShop(string memory name, string memory description, string memory location, string memory phone, string memory image) external payable returns (address) {
        require(msg.value >= shopPrice, "Shop price not met");
        Shop shop = new Shop(msg.sender, name, description, location, phone, image);
        emit ShopCreated(address(shop), name);
        allShops.push(address(shop));
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
}