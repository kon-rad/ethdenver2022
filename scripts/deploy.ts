// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const Catalog = await ethers.getContractFactory("Catalog");
  const catalog = await Catalog.deploy();

  await catalog.deployed();
  console.log("catalog deployed to:", catalog.address);

  const Shop = await ethers.getContractFactory("Shop", {
    libraries: {
      Catalog: catalog.address,
    },
  });
  const shop = await Shop.deploy();

  await shop.deployed();
  console.log("Shop deployed to:", shop.address);

  const ItemToken = await ethers.getContractFactory("ItemToken");
  const itemToken = await ItemToken.deploy("", "");

  await itemToken.deployed();
  console.log("ItemToken deployed to:", itemToken.address);

  const ShopFactory = await ethers.getContractFactory("ShopFactory");
  const shopFactory = await ShopFactory.deploy(shop.address, itemToken.address);

  await shopFactory.deployed();

  console.log("ShopFactory deployed to:", shopFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
