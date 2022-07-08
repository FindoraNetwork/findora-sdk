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
export type SimBridgeEvents = 'OwnershipTransferred';
export interface SimBridgeEventsContext {
  OwnershipTransferred(
    parameters: {
      filter?: { previousOwner?: string | string[]; newOwner?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
}
export type SimBridgeMethodNames =
  | 'new'
  | 'adminSetFee'
  | 'adminSetPrismBridgeAddress'
  | 'bar2abarFee'
  | 'convertFee'
  | 'depositFRA'
  | 'depositFRC20'
  | 'owner'
  | 'prismBridgeAddress'
  | 'prismBridgeLedger'
  | 'renounceOwnership'
  | 'transferOwnership';
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface SimBridge {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _prismBridgeAddress Type: address, Indexed: false
   * @param _ledger Type: address, Indexed: false
   */
  'new'(_prismBridgeAddress: string, _ledger: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _bar2abarFee Type: uint256, Indexed: false
   * @param _convertFee Type: uint256, Indexed: false
   */
  adminSetFee(_bar2abarFee: string, _convertFee: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param addr Type: address, Indexed: false
   * @param ledger Type: address, Indexed: false
   */
  adminSetPrismBridgeAddress(addr: string, ledger: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  bar2abarFee(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  convertFee(): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param addr Type: bytes32, Indexed: false
   */
  depositFRA(addr: string | number[]): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _frc20 Type: address, Indexed: false
   * @param _to Type: bytes32, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  depositFRC20(_frc20: string, _to: string | number[], amount: string): MethodPayableReturnContext;
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
  prismBridgeAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  prismBridgeLedger(): MethodConstantReturnContext<string>;
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
}
