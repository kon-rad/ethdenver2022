// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Transactions {

    Counters.Counter private _transIds;
    Counters.Counter public transactionsCount;

    Trans[] public transactions;

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

    constructor () {

    }
}