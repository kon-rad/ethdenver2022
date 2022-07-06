const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits, hexStripZeros } = require("ethers/lib/utils");
const { loadFixture } = require("./_helpers");

const TOKEN_NAME = 'Digital Good Token';
const DUMMY_URI = 'https://someuri.com';

const deployAndInit = async () => {
    const ItemToken = await ethers.getContractFactory("ItemToken");

    const signers = await ethers.getSigners();
    const signer1 = signers[0];

    const itemToken = await ItemToken.deploy('', '');

    const signer1Address = signer1.address;
    const initArgs = [
        signer1Address,
        signer1Address,
        TOKEN_NAME,
        'DGT'
    ];

    await itemToken.initialize(...initArgs);
    return itemToken;
}
describe("ItemToken", async () => {
    it("can initialize a new ItemToken", async () => {
        const itemToken = await deployAndInit();

        const actualName = await itemToken.name();
        console.log('actualName: ', actualName);
        expect(actualName).to.equal(TOKEN_NAME);f
    });

    it('can create a new item', async () => {
        const itemToken = await deployAndInit();

        await itemToken.createItem(DUMMY_URI)

        expect(await itemToken.getTotal()).to.equal(1);
        expect(await itemToken.tokenURI(1)).to.equal(DUMMY_URI);
    })

    it('can perform a sale', async () => {
        const itemToken = await deployAndInit();

        await itemToken.createItem(DUMMY_URI)

        const signers = await ethers.getSigners();
        const signer2 = signers[1];
        await itemToken.batchSale(signer2.address, [1], [1]);

        expect(await itemToken.getTotal()).to.equal(2);
        expect(await itemToken.tokenURI(2)).to.equal(DUMMY_URI);
        expect(await itemToken.ownerOf(2)).to.equal(signer2.address);
    })
})