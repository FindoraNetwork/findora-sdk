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
  Config,
  ConfigMethodNames,
  ConfigEventsContext,
  ConfigEvents
>;
export type ConfigEvents = 'Initialized' | 'OwnershipTransferred';
export interface ConfigEventsContext {
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
export type ConfigMethodNames =
  | 'AMPLIFY'
  | 'RATE_DECIMALS'
  | 'UTXO_DIFF_DECIMALS'
  | 'delegateMinimum'
  | 'duplicateVotePunishRate'
  | 'epochDuration'
  | 'evmCallerAddr'
  | 'getAboutPunish'
  | 'getAmplify'
  | 'getDelegateMinimum'
  | 'getDuplicateVotePunishRate'
  | 'getEpochDuration'
  | 'getEvmCallerAddr'
  | 'getInflationRate'
  | 'getJailDuraction'
  | 'getJailThreshold'
  | 'getLightClientAttackPunishRate'
  | 'getOffLinePunishRate'
  | 'getPowerRateMaximum'
  | 'getPrismAddr'
  | 'getRateDecimals'
  | 'getRewardAddr'
  | 'getSecondPerBlock'
  | 'getSecuredAddr'
  | 'getStakeMinimum'
  | 'getStakingAddr'
  | 'getSystemAddr'
  | 'getUnknownPunishRate'
  | 'getUtxoDiffDecimals'
  | 'getValidatorsLimit'
  | 'getWaitinPeriod'
  | 'inflationRate'
  | 'initialize'
  | 'jailDuraction'
  | 'jailThreshold'
  | 'lightClientAttackPunishRate'
  | 'offLinePunishRate'
  | 'owner'
  | 'powerRateMaximum'
  | 'prismAddr'
  | 'renounceOwnership'
  | 'rewardAddr'
  | 'secondPerBlock'
  | 'securedAddr'
  | 'setDelegateMinimum'
  | 'setDuplicateVotePunishRate'
  | 'setEpochDuration'
  | 'setEvmCallerAddr'
  | 'setInflationRate'
  | 'setJailDuraction'
  | 'setJailThreshold'
  | 'setLightClientAttackPunishRate'
  | 'setOffLinePunishRate'
  | 'setPowerRateMaximum'
  | 'setPrismAddr'
  | 'setRewardAddr'
  | 'setSecuredAddr'
  | 'setStakeMinimum'
  | 'setStakingAddr'
  | 'setSystemAddr'
  | 'setUnknownPunishRate'
  | 'setValidatorsLimit'
  | 'setWaitinPeriod'
  | 'stakeMinimum'
  | 'stakingAddr'
  | 'systemAddr'
  | 'transferOwnership'
  | 'unknownPunishRate'
  | 'validatorsLimit'
  | 'waitinPeriod';
export interface InitializedEventEmittedResponse {
  version: string | number;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface GetAboutPunishResponse {
  result0: string;
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
}
export interface Config {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  AMPLIFY(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  RATE_DECIMALS(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  UTXO_DIFF_DECIMALS(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  delegateMinimum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  duplicateVotePunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  epochDuration(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  evmCallerAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAboutPunish(): MethodConstantReturnContext<GetAboutPunishResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   */
  getAmplify(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDelegateMinimum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDuplicateVotePunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getEpochDuration(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getEvmCallerAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getInflationRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getJailDuraction(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getJailThreshold(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getLightClientAttackPunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getOffLinePunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPowerRateMaximum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getPrismAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   */
  getRateDecimals(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getRewardAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getSecondPerBlock(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getSecuredAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getStakeMinimum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getStakingAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getSystemAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getUnknownPunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   */
  getUtxoDiffDecimals(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getValidatorsLimit(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getWaitinPeriod(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  inflationRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _prismAddr Type: address, Indexed: false
   * @param _securedAddr Type: address, Indexed: false
   */
  initialize(_prismAddr: string, _securedAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  jailDuraction(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  jailThreshold(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lightClientAttackPunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  offLinePunishRate(): MethodConstantReturnContext<string>;
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
  powerRateMaximum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  prismAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  rewardAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  secondPerBlock(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  securedAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _delegateMinimum Type: uint256, Indexed: false
   */
  setDelegateMinimum(_delegateMinimum: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _duplicateVotePunishRate Type: uint256, Indexed: false
   */
  setDuplicateVotePunishRate(_duplicateVotePunishRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _epochDuration Type: uint256, Indexed: false
   */
  setEpochDuration(_epochDuration: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _evmCallerAddr Type: address, Indexed: false
   */
  setEvmCallerAddr(_evmCallerAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _inflationRate Type: uint256, Indexed: false
   */
  setInflationRate(_inflationRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _jailDuraction Type: uint256, Indexed: false
   */
  setJailDuraction(_jailDuraction: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _jailThreshold Type: uint256, Indexed: false
   */
  setJailThreshold(_jailThreshold: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _lightClientAttackPunishRate Type: uint256, Indexed: false
   */
  setLightClientAttackPunishRate(_lightClientAttackPunishRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _offLinePunishRate Type: uint256, Indexed: false
   */
  setOffLinePunishRate(_offLinePunishRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _powerRateMaximum Type: uint256, Indexed: false
   */
  setPowerRateMaximum(_powerRateMaximum: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _prismAddr Type: address, Indexed: false
   */
  setPrismAddr(_prismAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _rewardAddr Type: address, Indexed: false
   */
  setRewardAddr(_rewardAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param addr Type: address, Indexed: false
   */
  setSecuredAddr(addr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _stakeMinimum Type: uint256, Indexed: false
   */
  setStakeMinimum(_stakeMinimum: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _stakingAddr Type: address, Indexed: false
   */
  setStakingAddr(_stakingAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _systemAddr Type: address, Indexed: false
   */
  setSystemAddr(_systemAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _unknownPunishRate Type: uint256, Indexed: false
   */
  setUnknownPunishRate(_unknownPunishRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _validatorsLimit Type: uint256, Indexed: false
   */
  setValidatorsLimit(_validatorsLimit: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _waitinPeriod Type: uint256, Indexed: false
   */
  setWaitinPeriod(_waitinPeriod: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  stakeMinimum(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  stakingAddr(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  systemAddr(): MethodConstantReturnContext<string>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  unknownPunishRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  validatorsLimit(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  waitinPeriod(): MethodConstantReturnContext<string>;
}
