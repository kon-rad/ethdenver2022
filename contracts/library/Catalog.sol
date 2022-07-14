// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

struct Item {
    uint itemId;
    uint price;
    bool isDeleted;
    address itemAddress;
}

struct ItemsCatalogArray {
    Item[] catalog;
}

library Catalog {
    function createItem(ItemsCatalogArray storage self, Item memory _item) public {
        self.catalog.push(_item);
    }
    function fetchCatalogItems(ItemsCatalogArray storage self) public view returns (Item[] memory) {
        return self.catalog;
    }
    function deleteItem(ItemsCatalogArray storage self, uint _id) public {
        for (uint i = 0; i < self.catalog.length; i++) {
            if (self.catalog[i].itemId == _id) {
                self.catalog[i].isDeleted = true;
                break;
            }
        }
    }
}
