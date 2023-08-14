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
  System,
  SystemMethodNames,
  SystemEventsContext,
  SystemEvents
>;
export type SystemEvents = 'Initialized' | 'OwnershipTransferred';
export interface SystemEventsContext {
  Initialized(
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
}
export type SystemMethodNames =
  | 'claim'
  | 'config'
  | 'delegate'
  | 'getClaimOnContractAddress'
  | 'getTriggerOnContractAddress'
  | 'getValidator'
  | 'getValidatorsList'
  | 'importDelegators'
  | 'importReward'
  | 'importUndelegations'
  | 'importValidators'
  | 'initialize'
  | 'owner'
  | 'renounceOwnership'
  | 'replaceDelegator'
  | 'setConfig'
  | 'stake'
  | 'systemClaim'
  | 'systemDelegate'
  | 'systemReplaceDelegator'
  | 'systemStake'
  | 'systemUndelegate'
  | 'systemUpdateValidator'
  | 'transferOwnership'
  | 'trigger'
  | 'undelegate'
  | 'updateValidator';
export interface InitializedEventEmittedResponse {
  version: string | number;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface GetValidatorResponse {
  result0: string;
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
  result6: string;
  result7: string;
}
export interface ResResponse {
  publicKey: string;
  ty: string;
  addr: string;
  power: string;
}
export interface ImportDelegatorsRequest {
  validator: string;
  delegator: string;
  delegatorPk: string | number[];
  boundAmount: string;
  unboundAmount: string;
}
export interface ImportRewardRequest {
  delegator: string;
  amount: string;
}
export interface ImportUndelegationsRequest {
  validator: string;
  delegator: string;
  amount: string;
  height: string;
}
export interface ImportValidatorsRequest {
  tdAddr: string;
  publicKey: string | number[];
  ty: string | number;
  memo: string;
  rate: string;
  staker: string;
  stakerPk: string | number[];
  power: string;
  beginBlock: string;
}
export interface System {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   */
  claim(validator: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  config(): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param validator Type: address, Indexed: false
   */
  delegate(validator: string): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getClaimOnContractAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getTriggerOnContractAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param validator Type: address, Indexed: false
   */
  getValidator(validator: string): MethodConstantReturnContext<GetValidatorResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getValidatorsList(): MethodConstantReturnContext<ResResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param dp Type: tuple[], Indexed: false
   */
  importDelegators(dp: ImportDelegatorsRequest[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param rp Type: tuple[], Indexed: false
   */
  importReward(rp: ImportRewardRequest[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param udp Type: tuple[], Indexed: false
   */
  importUndelegations(udp: ImportUndelegationsRequest[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param vp Type: tuple[], Indexed: false
   */
  importValidators(vp: ImportValidatorsRequest[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _config Type: address, Indexed: false
   */
  initialize(_config: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
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
   * @param validators Type: address[], Indexed: false
   * @param newDelegator Type: address, Indexed: false
   */
  replaceDelegator(validators: string[], newDelegator: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newConfig Type: address, Indexed: false
   */
  setConfig(_newConfig: string): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param publicKey Type: bytes, Indexed: false
   * @param memo Type: string, Indexed: false
   * @param rate Type: uint256, Indexed: false
   */
  stake(
    validator: string,
    publicKey: string | number[],
    memo: string,
    rate: string,
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param delegator Type: address, Indexed: false
   */
  systemClaim(validator: string, delegator: string): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param delegator Type: address, Indexed: false
   * @param delegatorPk Type: bytes, Indexed: false
   */
  systemDelegate(
    validator: string,
    delegator: string,
    delegatorPk: string | number[],
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validators Type: address[], Indexed: false
   * @param oldDelegator Type: address, Indexed: false
   * @param newDelegator Type: address, Indexed: false
   * @param delegatorPk Type: bytes, Indexed: false
   */
  systemReplaceDelegator(
    validators: string[],
    oldDelegator: string,
    newDelegator: string,
    delegatorPk: string | number[],
  ): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param publicKey Type: bytes, Indexed: false
   * @param staker Type: address, Indexed: false
   * @param stakerPk Type: bytes, Indexed: false
   * @param memo Type: string, Indexed: false
   * @param rate Type: uint256, Indexed: false
   */
  systemStake(
    validator: string,
    publicKey: string | number[],
    staker: string,
    stakerPk: string | number[],
    memo: string,
    rate: string,
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param delegator Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  systemUndelegate(validator: string, delegator: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param staker Type: address, Indexed: false
   * @param memo Type: string, Indexed: false
   * @param rate Type: uint256, Indexed: false
   */
  systemUpdateValidator(validator: string, staker: string, memo: string, rate: string): MethodReturnContext;
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
   * @param proposer Type: address, Indexed: false
   * @param voted Type: address[], Indexed: false
   * @param unvoted Type: address[], Indexed: false
   * @param byztine Type: address[], Indexed: false
   * @param behavior Type: uint8[], Indexed: false
   * @param preIssueAmount Type: uint256, Indexed: false
   */
  trigger(
    proposer: string,
    voted: string[],
    unvoted: string[],
    byztine: string[],
    behavior: string | number[],
    preIssueAmount: string,
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  undelegate(validator: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param validator Type: address, Indexed: false
   * @param memo Type: string, Indexed: false
   * @param rate Type: uint256, Indexed: false
   */
  updateValidator(validator: string, memo: string, rate: string): MethodReturnContext;
}
