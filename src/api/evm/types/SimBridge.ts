import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(options: SendOptions, callback: (error: Error, result: any) => void): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(options: EstimateGasOptions, callback: (error: Error, result: any) => void): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(options: CallOptions, callback: (error: Error, result: TCallReturn) => void): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  SimBridge,
  SimBridgeMethodNames,
  SimBridgeEventsContext,
  SimBridgeEvents
>;
export type SimBridgeEvents =
  | 'DepositFRA'
  | 'DepositFRC1155'
  | 'DepositFRC20'
  | 'DepositFRC721'
  | 'OwnershipTransferred'
  | 'WithdrawFRA'
  | 'WithdrawFRC1155'
  | 'WithdrawFRC20'
  | 'WithdrawFRC721';
export interface SimBridgeEventsContext {
  DepositFRA(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  DepositFRC1155(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  DepositFRC20(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  DepositFRC721(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  OwnershipTransferred(
    parameters: {
      filter?: {
        previousOwner?: string | string[];
        newOwner?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  WithdrawFRA(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  WithdrawFRC1155(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  WithdrawFRC20(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  WithdrawFRC721(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
}
export type SimBridgeMethodNames =
  | 'new'
  | '__self'
  | '_consumeMint'
  | '_withdrawAsset'
  | '_withdrawFRA'
  | 'adminSetAsset'
  | 'adminSetLedger'
  | 'asset_contract'
  | 'computeERC20AssetType'
  | 'computeNFTAssetType'
  | 'consumeMint'
  | 'depositFRA'
  | 'depositFRC1155'
  | 'depositFRC20'
  | 'depositFRC721'
  | 'ledger_contract'
  | 'ops'
  | 'owner'
  | 'proxy_contract'
  | 'renounceOwnership'
  | 'transferOwnership'
  | 'withdrawAsset'
  | 'withdrawFRA';
export interface DepositFRAEventEmittedResponse {
  _from: string;
  _to: string | number[];
  _amount: string;
}
export interface DepositFRC1155EventEmittedResponse {
  _addr: string;
  _from: string;
  _to: string | number[];
  _id: string;
  amount: string;
}
export interface DepositFRC20EventEmittedResponse {
  _frc20: string;
  _from: string;
  _to: string | number[];
  _amount: string;
}
export interface DepositFRC721EventEmittedResponse {
  _addr: string;
  _from: string;
  _to: string | number[];
  _id: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface WithdrawFRAEventEmittedResponse {
  _from: string | number[];
  _to: string;
  _amount: string;
}
export interface WithdrawFRC1155EventEmittedResponse {
  _frc20: string;
  _from: string | number[];
  _to: string;
  _id: string;
  _amount: string;
}
export interface WithdrawFRC20EventEmittedResponse {
  _frc20: string;
  _from: string | number[];
  _to: string;
  _amount: string;
}
export interface WithdrawFRC721EventEmittedResponse {
  _frc20: string;
  _from: string | number[];
  _to: string;
  _id: string;
}
export interface MintopResponse {
  asset: string;
  receiver: string;
  amount: string;
  decimal: string;
  max_supply: string;
}
export interface OpsResponse {
  asset: string;
  receiver: string;
  amount: string;
  decimal: string;
  max_supply: string;
}
export interface SimBridge {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _proxy_contract Type: address, Indexed: false
   */
  'new'(_proxy_contract: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  __self(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  _consumeMint(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _asset Type: bytes32, Indexed: false
   * @param _from Type: bytes, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  _withdrawAsset(
    _asset: string | number[],
    _from: string | number[],
    _to: string,
    _value: string,
    _data: string | number[],
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  _withdrawFRA(_to: string, _value: string, _data: string | number[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _asset_contract Type: address, Indexed: false
   */
  adminSetAsset(_asset_contract: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _ledger_contract Type: address, Indexed: false
   */
  adminSetLedger(_ledger_contract: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  asset_contract(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param addr Type: address, Indexed: false
   */
  computeERC20AssetType(addr: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param addr Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  computeNFTAssetType(addr: string, tokenId: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  consumeMint(): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _to Type: bytes, Indexed: false
   */
  depositFRA(_to: string | number[]): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   * @param _to Type: bytes, Indexed: false
   * @param _id Type: uint256, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  depositFRC1155(_addr: string, _to: string | number[], _id: string, _amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _frc20 Type: address, Indexed: false
   * @param _to Type: bytes, Indexed: false
   * @param _value Type: uint256, Indexed: false
   */
  depositFRC20(_frc20: string, _to: string | number[], _value: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _addr Type: address, Indexed: false
   * @param _to Type: bytes, Indexed: false
   * @param _id Type: uint256, Indexed: false
   */
  depositFRC721(_addr: string, _to: string | number[], _id: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ledger_contract(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  ops(parameter0: string): MethodConstantReturnContext<OpsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  proxy_contract(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _asset Type: bytes32, Indexed: false
   * @param _from Type: bytes, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  withdrawAsset(
    _asset: string | number[],
    _from: string | number[],
    _to: string,
    _value: string,
    _data: string | number[],
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _from Type: bytes, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param _value Type: uint256, Indexed: false
   * @param _data Type: bytes, Indexed: false
   */
  withdrawFRA(
    _from: string | number[],
    _to: string,
    _value: string,
    _data: string | number[],
  ): MethodReturnContext;
}
