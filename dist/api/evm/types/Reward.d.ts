import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { PromiEvent, TransactionReceipt, EventResponse, EventData, Web3ContractContext } from 'ethereum-abi-types-generator';
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
export interface MethodReturnContext extends MethodPayableReturnContext {
}
export type ContractContext = Web3ContractContext<Reward, RewardMethodNames, RewardEventsContext, RewardEvents>;
export type RewardEvents = 'CoinbaseMint' | 'Initialized' | 'Proposer' | 'RoleAdminChanged' | 'RoleGranted' | 'RoleRevoked';
export interface RewardEventsContext {
    CoinbaseMint(parameters: {
        filter?: {
            validator?: string | string[];
            delegator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Initialized(parameters: {
        filter?: {};
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Proposer(parameters: {
        filter?: {};
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    RoleAdminChanged(parameters: {
        filter?: {
            role?: string | number[] | string | number[][];
            previousAdminRole?: string | number[] | string | number[][];
            newAdminRole?: string | number[] | string | number[][];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    RoleGranted(parameters: {
        filter?: {
            role?: string | number[] | string | number[][];
            account?: string | string[];
            sender?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    RoleRevoked(parameters: {
        filter?: {
            role?: string | number[] | string | number[][];
            account?: string | string[];
            sender?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export type RewardMethodNames = 'DEFAULT_ADMIN_ROLE' | 'REWARD_ROLE' | 'STAKING_ROLE' | 'SYSTEM_ROLE' | 'accPerShareInfo' | 'batchClaim' | 'calculateReward' | 'config' | 'getDelegatorReturnRate' | 'getRoleAdmin' | 'getRoleMember' | 'getRoleMemberCount' | 'globalPreIssueAmount' | 'grantRole' | 'hasRole' | 'importReward' | 'initialize' | 'renounceRole' | 'replaceDelegator' | 'revokeRole' | 'reward' | 'rewardDebt' | 'rewards' | 'setConfig' | 'setPreIssueAmount' | 'supportsInterface' | 'systemClaim' | 'unclaimed';
export interface CoinbaseMintEventEmittedResponse {
    validator: string;
    delegator: string;
    publicKey: string | number[];
    amount: string;
}
export interface InitializedEventEmittedResponse {
    version: string | number;
}
export interface ProposerEventEmittedResponse {
    proposer: string;
}
export interface RoleAdminChangedEventEmittedResponse {
    role: string | number[];
    previousAdminRole: string | number[];
    newAdminRole: string | number[];
}
export interface RoleGrantedEventEmittedResponse {
    role: string | number[];
    account: string;
    sender: string;
}
export interface RoleRevokedEventEmittedResponse {
    role: string | number[];
    account: string;
    sender: string;
}
export interface AccPerShareInfoResponse {
    stakerRewardRatio: string;
    delegatorRewardRatio: string;
}
export interface ImportRewardRequest {
    delegator: string;
    amount: string;
}
export interface Reward {
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    DEFAULT_ADMIN_ROLE(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    REWARD_ROLE(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    STAKING_ROLE(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    SYSTEM_ROLE(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    accPerShareInfo(parameter0: string): MethodConstantReturnContext<AccPerShareInfoResponse>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param validators Type: address[], Indexed: false
     * @param delegator Type: address, Indexed: false
     */
    batchClaim(validators: string[], delegator: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param validator Type: address, Indexed: false
     * @param delegator Type: address, Indexed: false
     */
    calculateReward(validator: string, delegator: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    config(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    getDelegatorReturnRate(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param role Type: bytes32, Indexed: false
     */
    getRoleAdmin(role: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param role Type: bytes32, Indexed: false
     * @param index Type: uint256, Indexed: false
     */
    getRoleMember(role: string | number[], index: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param role Type: bytes32, Indexed: false
     */
    getRoleMemberCount(role: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    globalPreIssueAmount(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param role Type: bytes32, Indexed: false
     * @param account Type: address, Indexed: false
     */
    grantRole(role: string | number[], account: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param role Type: bytes32, Indexed: false
     * @param account Type: address, Indexed: false
     */
    hasRole(role: string | number[], account: string): MethodConstantReturnContext<boolean>;
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
     * @param _config Type: address, Indexed: false
     */
    initialize(_config: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param role Type: bytes32, Indexed: false
     * @param account Type: address, Indexed: false
     */
    renounceRole(role: string | number[], account: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param validators Type: address[], Indexed: false
     * @param oldDelegator Type: address, Indexed: false
     * @param newDelegator Type: address, Indexed: false
     */
    replaceDelegator(validators: string[], oldDelegator: string, newDelegator: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param role Type: bytes32, Indexed: false
     * @param account Type: address, Indexed: false
     */
    revokeRole(role: string | number[], account: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param validator Type: address, Indexed: false
     * @param voted Type: address[], Indexed: false
     */
    reward(validator: string, voted: string[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     * @param parameter1 Type: address, Indexed: false
     */
    rewardDebt(parameter0: string, parameter1: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    rewards(parameter0: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _newConfig Type: address, Indexed: false
     */
    setConfig(_newConfig: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param amount Type: uint256, Indexed: false
     */
    setPreIssueAmount(amount: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param interfaceId Type: bytes4, Indexed: false
     */
    supportsInterface(interfaceId: string | number[]): MethodConstantReturnContext<boolean>;
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
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param validators Type: address[], Indexed: false
     * @param delegator Type: address, Indexed: false
     */
    unclaimed(validators: string[], delegator: string): MethodConstantReturnContext<string>;
}
