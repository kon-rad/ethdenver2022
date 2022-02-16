  // We get the contract to deploy
  const ethers = require('ethers');

  const deployShop = async () => {
    // function createShop(string memory name, string memory description, string memory location, string memory phone, string memory image) external returns (address) {

    const Shop = await ethers.getContractFactory("Shop");
    const shop = await Shop.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", "Taco Truck", "Best tacos in Denver", "123 W. Main St", "(723) 123-2211", "https://example.com");
  
    await shop.deployed();
  
    console.log("Shop deployed to:", shop.address);

    const ShopFactory = require('../artifacts/contracts/ShopFactory.sol/ShopFactory.json');

    const provider = new ethers.providers.JsonRpcProvider();
    const factoryContract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", ShopFactory.abi, provider);

    //0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

    const deployShop = async() => {
        const factory = await hre.ethers.getContractAt("ShopFactory", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
        const addr = await factory.createShop("Taco Truck", "Best tacos in Denver", "123 W. Main St", "(723) 123-2211", "https://example.com");
        console.log("address: ", addr.toNumber());
    }

    const fetchShops = async () => {
        const factory = await hre.ethers.getContractAt("ShopFactory", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
        const addrs = await factory.fetchAllShops();
        console.log("addresses: ", addrs);
    }
  }