/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ItemTokenInterface extends utils.Interface {
  contractName: "ItemToken";
  functions: {
    "balanceOf(address,uint256)": FunctionFragment;
    "balanceOfBatch(address[],uint256[])": FunctionFragment;
    "batchSale(address,uint256[],uint256[])": FunctionFragment;
    "createItem(uint256,string)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "shop()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "uri(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfBatch",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchSale",
    values: [string, BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "createItem",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "safeBatchTransferFrom",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "shop", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "uri", values: [BigNumberish]): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "batchSale", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createItem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "safeBatchTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "shop", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  { account: string; operator: string; approved: boolean }
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export type TransferBatchEvent = TypedEvent<
  [string, string, string, BigNumber[], BigNumber[]],
  {
    operator: string;
    from: string;
    to: string;
    ids: BigNumber[];
    values: BigNumber[];
  }
>;

export type TransferBatchEventFilter = TypedEventFilter<TransferBatchEvent>;

export type TransferSingleEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  {
    operator: string;
    from: string;
    to: string;
    id: BigNumber;
    value: BigNumber;
  }
>;

export type TransferSingleEventFilter = TypedEventFilter<TransferSingleEvent>;

export type URIEvent = TypedEvent<
  [string, BigNumber],
  { value: string; id: BigNumber }
>;

export type URIEventFilter = TypedEventFilter<URIEvent>;

export interface ItemToken extends BaseContract {
  contractName: "ItemToken";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ItemTokenInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    batchSale(
      _to: string,
      _tokenIds: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createItem(
      _tokenId: BigNumberish,
      _uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _owner: string,
      _shop: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    shop(overrides?: CallOverrides): Promise<[string]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    uri(tokenId: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
  };

  balanceOf(
    account: string,
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  batchSale(
    _to: string,
    _tokenIds: BigNumberish[],
    _amounts: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createItem(
    _tokenId: BigNumberish,
    _uri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _owner: string,
    _shop: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  shop(overrides?: CallOverrides): Promise<string>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  uri(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    batchSale(
      _to: string,
      _tokenIds: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    createItem(
      _tokenId: BigNumberish,
      _uri: string,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      _owner: string,
      _shop: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    shop(overrides?: CallOverrides): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    uri(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ApprovalForAll(address,address,bool)"(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "TransferBatch(address,address,address,uint256[],uint256[])"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;
    TransferBatch(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;

    "TransferSingle(address,address,address,uint256,uint256)"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;
    TransferSingle(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;

    "URI(string,uint256)"(
      value?: null,
      id?: BigNumberish | null
    ): URIEventFilter;
    URI(value?: null, id?: BigNumberish | null): URIEventFilter;
  };

  estimateGas: {
    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchSale(
      _to: string,
      _tokenIds: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createItem(
      _tokenId: BigNumberish,
      _uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _owner: string,
      _shop: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    shop(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    uri(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchSale(
      _to: string,
      _tokenIds: BigNumberish[],
      _amounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createItem(
      _tokenId: BigNumberish,
      _uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _owner: string,
      _shop: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    shop(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    uri(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}