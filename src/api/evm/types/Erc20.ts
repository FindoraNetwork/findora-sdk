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

export type ContractContext = Web3ContractContext<Erc20, Erc20MethodNames, Erc20EventsContext, Erc20Events>;
export type Erc20Events = 'Approval' | 'Transfer' | 'Deposit' | 'Withdrawal';
export interface Erc20EventsContext {
  Approval(
    parameters: {
      filter?: { src?: string | string[]; guy?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  Transfer(
    parameters: {
      filter?: { src?: string | string[]; dst?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  Deposit(
    parameters: {
      filter?: { dst?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
  Withdrawal(
    parameters: {
      filter?: { src?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void,
  ): EventResponse;
}
export type Erc20MethodNames =
  | 'name'
  | 'decimals'
  | 'balanceOf'
  | 'symbol'
  | 'allowance'
  | 'deposit'
  | 'withdraw'
  | 'totalSupply'
  | 'approve'
  | 'transfer'
  | 'transferFrom';
export interface ApprovalEventEmittedResponse {
  src: string;
  guy: string;
  wad: string;
}
export interface TransferEventEmittedResponse {
  src: string;
  dst: string;
  wad: string;
}
export interface DepositEventEmittedResponse {
  dst: string;
  wad: string;
}
export interface WithdrawalEventEmittedResponse {
  src: string;
  wad: string;
}
export interface Erc20 {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  balanceOf(parameter0: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  allowance(parameter0: string, parameter1: string): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   */
  deposit(): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param wad Type: uint256, Indexed: false
   */
  withdraw(wad: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param guy Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  approve(guy: string, wad: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param dst Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  transfer(dst: string, wad: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param src Type: address, Indexed: false
   * @param dst Type: address, Indexed: false
   * @param wad Type: uint256, Indexed: false
   */
  transferFrom(src: string, dst: string, wad: string): MethodReturnContext;
}
