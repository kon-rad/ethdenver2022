/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ShopFactory, ShopFactoryInterface } from "../ShopFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_shopTemplate",
        type: "address",
      },
      {
        internalType: "address",
        name: "_nftTemplate",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "shopAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "ShopCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allShops",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_metadataUrl",
        type: "string",
      },
    ],
    name: "createShop",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "deleteAddr",
        type: "address",
      },
    ],
    name: "deleteShop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fetchAllShops",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "selfDestruct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setShopPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shopCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x6080604052600060025560006003553480156200001b57600080fd5b5060405162001a1c38038062001a1c8339818101604052810190620000419190620001ce565b6200006162000055620000eb60201b60201c565b620000f360201b60201c565b81600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050506200025d565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600081519050620001c88162000243565b92915050565b60008060408385031215620001e257600080fd5b6000620001f285828601620001b7565b92505060206200020585828601620001b7565b9150509250929050565b60006200021c8262000223565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6200024e816200020f565b81146200025a57600080fd5b50565b6117af806200026d6000396000f3fe6080604052600436106100ab5760003560e01c806396195dca1161006457806396195dca146101915780639cb8a26a146101ce578063abc47baa146101e5578063b4abc3811461020e578063e7bfea501461023e578063f2fde38b14610267576100b2565b80630a747ed5146100b757806312065fe0146100e25780633ccfd60b1461010d5780636f0571e114610124578063715018a61461014f5780638da5cb5b14610166576100b2565b366100b257005b600080fd5b3480156100c357600080fd5b506100cc610290565b6040516100d99190611399565b60405180910390f35b3480156100ee57600080fd5b506100f7610296565b6040516101049190611399565b60405180910390f35b34801561011957600080fd5b5061012261029e565b005b34801561013057600080fd5b50610139610363565b60405161014691906112f7565b60405180910390f35b34801561015b57600080fd5b506101646103f1565b005b34801561017257600080fd5b5061017b610479565b604051610188919061126d565b60405180910390f35b34801561019d57600080fd5b506101b860048036038101906101b39190611094565b6104a2565b6040516101c5919061126d565b60405180910390f35b3480156101da57600080fd5b506101e36104e1565b005b3480156101f157600080fd5b5061020c60048036038101906102079190611094565b61057d565b005b61022860048036038101906102239190611028565b610603565b604051610235919061126d565b60405180910390f35b34801561024a57600080fd5b5061026560048036038101906102609190610fff565b61083c565b005b34801561027357600080fd5b5061028e60048036038101906102899190610fff565b6109eb565b005b60035481565b600047905090565b6102a6610ae3565b73ffffffffffffffffffffffffffffffffffffffff166102c4610479565b73ffffffffffffffffffffffffffffffffffffffff161461031a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031190611359565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015610360573d6000803e3d6000fd5b50565b606060018054806020026020016040519081016040528092919081815260200182805480156103e757602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161039d575b5050505050905090565b6103f9610ae3565b73ffffffffffffffffffffffffffffffffffffffff16610417610479565b73ffffffffffffffffffffffffffffffffffffffff161461046d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046490611359565b60405180910390fd5b6104776000610aeb565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600181815481106104b257600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6104e9610ae3565b73ffffffffffffffffffffffffffffffffffffffff16610507610479565b73ffffffffffffffffffffffffffffffffffffffff161461055d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055490611359565b60405180910390fd5b610565610479565b73ffffffffffffffffffffffffffffffffffffffff16ff5b610585610ae3565b73ffffffffffffffffffffffffffffffffffffffff166105a3610479565b73ffffffffffffffffffffffffffffffffffffffff16146105f9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105f090611359565b60405180910390fd5b8060028190555050565b600060025434101561064a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064190611379565b60405180910390fd5b61011861065684610baf565b10610696576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068d90611339565b60405180910390fd5b60006106c3600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610d8a565b90508073ffffffffffffffffffffffffffffffffffffffff166347b70db033868660035430600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518763ffffffff1660e01b815260040161072c96959493929190611288565b600060405180830381600087803b15801561074657600080fd5b505af115801561075a573d6000803e3d6000fd5b505050508360405161076c9190611256565b60405180910390208173ffffffffffffffffffffffffffffffffffffffff167f45277a23a38027df0b3b8ce31022d3988d3a5b8b8d753608ab96b7d20b40bab360405160405180910390a36001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506003600081548092919061082d906115a3565b91905055508091505092915050565b610844610ae3565b73ffffffffffffffffffffffffffffffffffffffff16610862610479565b73ffffffffffffffffffffffffffffffffffffffff16146108b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108af90611359565b60405180910390fd5b60008190508073ffffffffffffffffffffffffffffffffffffffff16639cb8a26a6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561090557600080fd5b505af1158015610919573d6000803e3d6000fd5b5050505060005b6001805490508110156109e6578273ffffffffffffffffffffffffffffffffffffffff166001828154811061097e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156109d3576109ce81610df4565b6109e6565b80806109de906115a3565b915050610920565b505050565b6109f3610ae3565b73ffffffffffffffffffffffffffffffffffffffff16610a11610479565b73ffffffffffffffffffffffffffffffffffffffff1614610a67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5e90611359565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610ad7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ace90611319565b60405180910390fd5b610ae081610aeb565b50565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008060008084519050600092505b80821015610d7f576000858381518110610c01577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602001015160f81c60f81b9050608060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015610c5057600183610c49919061146a565b9250610d6b565b60e060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015610c9257600283610c8b919061146a565b9250610d6a565b60f060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015610cd457600383610ccd919061146a565b9250610d69565b60f8801b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015610d1557600483610d0e919061146a565b9250610d68565b60fc60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015610d5757600583610d50919061146a565b9250610d67565b600683610d64919061146a565b92505b5b5b5b5b508280610d77906115a3565b935050610bbe565b829350505050919050565b6000808260601b90506040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528160148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f092505050919050565b60008190505b60018080549050610e0b91906114c0565b811015610efc5760018082610e20919061146a565b81548110610e57577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660018281548110610ed2577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a905050508080610ef4906115a3565b915050610dfa565b506001805480610f35577f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6001900381819060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055905550565b6000610f80610f7b846113d9565b6113b4565b905082815260208101848484011115610f9857600080fd5b610fa3848285611530565b509392505050565b600081359050610fba8161174b565b92915050565b600082601f830112610fd157600080fd5b8135610fe1848260208601610f6d565b91505092915050565b600081359050610ff981611762565b92915050565b60006020828403121561101157600080fd5b600061101f84828501610fab565b91505092915050565b6000806040838503121561103b57600080fd5b600083013567ffffffffffffffff81111561105557600080fd5b61106185828601610fc0565b925050602083013567ffffffffffffffff81111561107e57600080fd5b61108a85828601610fc0565b9150509250929050565b6000602082840312156110a657600080fd5b60006110b484828501610fea565b91505092915050565b60006110c983836110d5565b60208301905092915050565b6110de816114f4565b82525050565b6110ed816114f4565b82525050565b60006110fe8261141a565b611108818561143d565b93506111138361140a565b8060005b8381101561114457815161112b88826110bd565b975061113683611430565b925050600181019050611117565b5085935050505092915050565b600061115c82611425565b611166818561144e565b935061117681856020860161153f565b61117f8161164a565b840191505092915050565b600061119582611425565b61119f818561145f565b93506111af81856020860161153f565b80840191505092915050565b60006111c860268361144e565b91506111d38261165b565b604082019050919050565b60006111eb602b8361144e565b91506111f6826116aa565b604082019050919050565b600061120e60208361144e565b9150611219826116f9565b602082019050919050565b600061123160038361144e565b915061123c82611722565b602082019050919050565b61125081611526565b82525050565b6000611262828461118a565b915081905092915050565b600060208201905061128260008301846110e4565b92915050565b600060c08201905061129d60008301896110e4565b81810360208301526112af8188611151565b905081810360408301526112c38187611151565b90506112d26060830186611247565b6112df60808301856110e4565b6112ec60a08301846110e4565b979650505050505050565b6000602082019050818103600083015261131181846110f3565b905092915050565b60006020820190508181036000830152611332816111bb565b9050919050565b60006020820190508181036000830152611352816111de565b9050919050565b6000602082019050818103600083015261137281611201565b9050919050565b6000602082019050818103600083015261139281611224565b9050919050565b60006020820190506113ae6000830184611247565b92915050565b60006113be6113cf565b90506113ca8282611572565b919050565b6000604051905090565b600067ffffffffffffffff8211156113f4576113f361161b565b5b6113fd8261164a565b9050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600061147582611526565b915061148083611526565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156114b5576114b46115ec565b5b828201905092915050565b60006114cb82611526565b91506114d683611526565b9250828210156114e9576114e86115ec565b5b828203905092915050565b60006114ff82611506565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b8381101561155d578082015181840152602081019050611542565b8381111561156c576000848401525b50505050565b61157b8261164a565b810181811067ffffffffffffffff8211171561159a5761159961161b565b5b80604052505050565b60006115ae82611526565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156115e1576115e06115ec565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f53463a3031204e616d65206d757374206265206c657373207468616e2032383060008201527f2063686172616374657273000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4353300000000000000000000000000000000000000000000000000000000000600082015250565b611754816114f4565b811461175f57600080fd5b50565b61176b81611526565b811461177657600080fd5b5056fea2646970667358221220691f538447143c74a13368908e70dc0eb0f5a8fa58f07672e41dece400bc63e564736f6c63430008040033";

type ShopFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ShopFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ShopFactory__factory extends ContractFactory {
  constructor(...args: ShopFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ShopFactory";
  }

  deploy(
    _shopTemplate: string,
    _nftTemplate: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ShopFactory> {
    return super.deploy(
      _shopTemplate,
      _nftTemplate,
      overrides || {}
    ) as Promise<ShopFactory>;
  }
  getDeployTransaction(
    _shopTemplate: string,
    _nftTemplate: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _shopTemplate,
      _nftTemplate,
      overrides || {}
    );
  }
  attach(address: string): ShopFactory {
    return super.attach(address) as ShopFactory;
  }
  connect(signer: Signer): ShopFactory__factory {
    return super.connect(signer) as ShopFactory__factory;
  }
  static readonly contractName: "ShopFactory";
  public readonly contractName: "ShopFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ShopFactoryInterface {
    return new utils.Interface(_abi) as ShopFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ShopFactory {
    return new Contract(address, _abi, signerOrProvider) as ShopFactory;
  }
}
