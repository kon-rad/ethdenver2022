// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IItemToken is IERC1155MetadataURI {
    function batchSale(address _to, uint256[] memory _amounts) external;
    function createItem(string memory _uri) external;
    function getTotal() external view returns (uint256);
}