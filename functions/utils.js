const Shop = require("../artifacts/contracts/Shop.sol/Shop.json")

exports.isItemOwner = async (recoveredAddress, shopAddress, itemId, transId) =>{

  const provider = new Web3.providers.HttpProvider(
    'http://localhost:8545'
  )
  const web3 = new Web3(provider)

  const promises = []
  for (let i = 0; i < contractAddressArray.length; i++) {
    promises.push(balanceOf({
      contractAddress: contractAddressArray[i],
      web3,
      Shop.abi,
      holderAddress
    }))
  }

  const balances = await Promise.all(promises)


}