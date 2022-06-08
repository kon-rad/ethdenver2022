// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Shop.sol";
import "./interfaces/IShopMaker.sol";
import "./tokens/ItemToken.sol";

contract ItemTokenFactory is Ownable {

    function createNFTToken() external returns (address nftAddress) {
        address nftAddress = address(new ItemToken(""));
    }
}