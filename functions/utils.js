// // const Shop = require("../artifacts/contracts/Shop.sol/Shop.json")
// const abi = [
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "_owner",
//           "type": "address"
//         },
//         {
//           "internalType": "string",
//           "name": "_name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_description",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_location",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_phone",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_image",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "itemId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "description",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "image",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         }
//       ],
//       "name": "ItemCreated",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "affAddr",
//           "type": "address"
//         }
//       ],
//       "name": "approveAffiliate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "approvedAffArr",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "percentage",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "affAddr",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "affAddr",
//           "type": "address"
//         }
//       ],
//       "name": "cancelAffiliate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "catalog",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "itemId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "description",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "image",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "inStock",
//           "type": "bool"
//         },
//         {
//           "internalType": "bool",
//           "name": "isDeleted",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_description",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_image",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_price",
//           "type": "uint256"
//         }
//       ],
//       "name": "createItem",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "itemId",
//           "type": "uint256"
//         }
//       ],
//       "name": "deleteItem",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "description",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "fetchCatalogItems",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "itemId",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string",
//               "name": "name",
//               "type": "string"
//             },
//             {
//               "internalType": "string",
//               "name": "description",
//               "type": "string"
//             },
//             {
//               "internalType": "string",
//               "name": "image",
//               "type": "string"
//             },
//             {
//               "internalType": "uint256",
//               "name": "price",
//               "type": "uint256"
//             },
//             {
//               "internalType": "bool",
//               "name": "inStock",
//               "type": "bool"
//             },
//             {
//               "internalType": "bool",
//               "name": "isDeleted",
//               "type": "bool"
//             }
//           ],
//           "internalType": "struct Shop.Item[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "fetchTransactions",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "transId",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256[]",
//               "name": "itemIds",
//               "type": "uint256[]"
//             },
//             {
//               "internalType": "uint256[]",
//               "name": "itemQty",
//               "type": "uint256[]"
//             },
//             {
//               "internalType": "uint256",
//               "name": "total",
//               "type": "uint256"
//             },
//             {
//               "internalType": "bool",
//               "name": "isValid",
//               "type": "bool"
//             },
//             {
//               "internalType": "address",
//               "name": "client",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "review",
//               "type": "uint256"
//             },
//             {
//               "internalType": "bool",
//               "name": "isReviewed",
//               "type": "bool"
//             },
//             {
//               "internalType": "address",
//               "name": "affilate",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "affPercentage",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct Shop.Trans[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "freeTransactions",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getApprovedAffiliates",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "percentage",
//               "type": "uint256"
//             },
//             {
//               "internalType": "address",
//               "name": "affAddr",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "id",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct Shop.Affiliate[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getProposedAffiliates",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "percentage",
//               "type": "uint256"
//             },
//             {
//               "internalType": "address",
//               "name": "affAddr",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "id",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct Shop.Affiliate[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "stars",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "transId",
//           "type": "uint256"
//         }
//       ],
//       "name": "giveReview",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "governor",
//       "outputs": [
//         {
//           "internalType": "address payable",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "image",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "location",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256[]",
//           "name": "itemIds",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "itemQty",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "address",
//           "name": "affAddr",
//           "type": "address"
//         }
//       ],
//       "name": "makeTransaction",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "transactionId",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address payable",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "phone",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "percentage",
//           "type": "uint256"
//         }
//       ],
//       "name": "proposeAffiliate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "proposedAffArr",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "percentage",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "affAddr",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "selfDestruct",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_freeTransactions",
//           "type": "uint256"
//         }
//       ],
//       "name": "setFreeTransactions",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "itemId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "_inStock",
//           "type": "bool"
//         }
//       ],
//       "name": "setInStock",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "transactions",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "transId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "total",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "isValid",
//           "type": "bool"
//         },
//         {
//           "internalType": "address",
//           "name": "client",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "review",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "isReviewed",
//           "type": "bool"
//         },
//         {
//           "internalType": "address",
//           "name": "affilate",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "affPercentage",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "transactionsCount",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "_value",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];
// // import Shop from "../../artifacts/contracts/Shop.sol/Shop.json";

// exports.isItemOwner = async (recoveredAddress, shopAddress, itemId, transId) =>{

//   const provider = new Web3.providers.HttpProvider(
//     'https://rpc-mumbai.maticvigil.com'
//   )
//   const web3 = new Web3(provider)

//   const promises = []
//   for (let i = 0; i < contractAddressArray.length; i++) {
//     promises.push(balanceOf({
//       contractAddress: contractAddressArray[i],
//       web3,
//       abi,
//       holderAddress
//     }))
//   }

//   const balances = await Promise.all(promises)


// }