// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IItemToken is IERC1155MetadataURI {
    function batchSale(address _to, uint256[] memory _tokenIds, uint256[] memory _amounts) external;
    function createItem(uint256 _tokenId, string memory _uri) external;
}