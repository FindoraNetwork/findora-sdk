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
export type ContractContext = Web3ContractContext<Staking, StakingMethodNames, StakingEventsContext, StakingEvents>;
export type StakingEvents = 'Delegation' | 'Epoch' | 'Initialized' | 'Jailed' | 'Punish' | 'ReplaceDelegator' | 'RoleAdminChanged' | 'RoleGranted' | 'RoleRevoked' | 'Stake' | 'Undelegation' | 'UpdateValidator';
export interface StakingEventsContext {
    Delegation(parameters: {
        filter?: {
            validator?: string | string[];
            delegator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Epoch(parameters: {
        filter?: {};
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
    Jailed(parameters: {
        filter?: {
            validator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Punish(parameters: {
        filter?: {};
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    ReplaceDelegator(parameters: {
        filter?: {
            validator?: string | string[];
        };
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
    Stake(parameters: {
        filter?: {
            validator?: string | string[];
            staker?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Undelegation(parameters: {
        filter?: {
            validator?: string | string[];
            delegator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    UpdateValidator(parameters: {
        filter?: {
            validator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export type StakingMethodNames = 'DEFAULT_ADMIN_ROLE' | 'REWARD_ROLE' | 'STAKING_ROLE' | 'SYSTEM_ROLE' | 'activeHeap' | 'config' | 'delegatorPkMapping' | 'delegators' | 'delegatorsBoundAmount' | 'getRoleAdmin' | 'getRoleMember' | 'getRoleMemberCount' | 'getValidatorsList' | 'grantRole' | 'hasRole' | 'importDelegators' | 'importUndelegations' | 'importValidators' | 'inactiveHeap' | 'initialize' | 'latestEpoch' | 'maxDelegationAmountBasedOnTotalAmount' | 'punish' | 'releaseFromJail' | 'renounceRole' | 'revokeRole' | 'setConfig' | 'supportsInterface' | 'systemDelegate' | 'systemReplaceDelegator' | 'systemStake' | 'systemUndelegate' | 'systemUpdateValidator' | 'totalDelegationAmount' | 'trigger' | 'undelegations' | 'undelegationsEnd' | 'undelegationsStart' | 'validatorStatus' | 'validators';
export interface DelegationEventEmittedResponse {
    validator: string;
    delegator: string;
    amount: string;
}
export interface EpochEventEmittedResponse {
    epoch: string | number;
}
export interface InitializedEventEmittedResponse {
    version: string | number;
}
export interface JailedEventEmittedResponse {
    validator: string;
    jailed: boolean;
}
export interface PunishEventEmittedResponse {
    voted: string[];
    unvoted: string[];
    byztine: string[];
}
export interface ReplaceDelegatorEventEmittedResponse {
    validator: string;
    oldDelegator: string;
    newDelegator: string;
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
export interface StakeEventEmittedResponse {
    validator: string;
    publicKey: string | number[];
    ty: string | number;
    staker: string;
    amount: string;
    memo: string;
    rate: string;
}
export interface UndelegationEventEmittedResponse {
    index: string;
    validator: string;
    delegator: string;
    unlockTime: string;
    amount: string;
    operationType: string | number;
}
export interface UpdateValidatorEventEmittedResponse {
    validator: string;
    memo: string;
    rate: string;
}
export interface DelegatorsResponse {
    boundAmount: string;
    unboundAmount: string;
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
export interface UndelegationsResponse {
    validator: string;
    delegator: string;
    amount: string;
    unlockTime: string;
}
export interface ValidatorStatusResponse {
    heapIndexOff1: string;
    isActive: boolean;
    jailed: boolean;
    unjailDatetime: string;
    shouldVote: string;
    voted: string;
}
export interface ValidatorsResponse {
    publicKey: string;
    ty: string;
    rate: string;
    staker: string;
    power: string;
    totalUnboundAmount: string;
    punishRate: string;
    beginBlock: string;
}
export interface Staking {
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
     * @param parameter0 Type: uint256, Indexed: false
     */
    activeHeap(parameter0: string): MethodConstantReturnContext<string>;
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
     * @param parameter0 Type: address, Indexed: false
     */
    delegatorPkMapping(parameter0: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     * @param parameter1 Type: address, Indexed: false
     */
    delegators(parameter0: string, parameter1: string): MethodConstantReturnContext<DelegatorsResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param validator Type: address, Indexed: false
     * @param delegator Type: address, Indexed: false
     */
    delegatorsBoundAmount(validator: string, delegator: string): MethodConstantReturnContext<string>;
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
    getValidatorsList(): MethodConstantReturnContext<ResResponse[]>;
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
     * @param dp Type: tuple[], Indexed: false
     */
    importDelegators(dp: ImportDelegatorsRequest[]): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: uint256, Indexed: false
     */
    inactiveHeap(parameter0: string): MethodConstantReturnContext<string>;
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
    latestEpoch(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    maxDelegationAmountBasedOnTotalAmount(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param voted Type: address[], Indexed: false
     * @param unvoted Type: address[], Indexed: false
     * @param byztine Type: address[], Indexed: false
     * @param behavior Type: uint8[], Indexed: false
     */
    punish(voted: string[], unvoted: string[], byztine: string[], behavior: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param validator Type: address, Indexed: false
     */
    releaseFromJail(validator: string): MethodReturnContext;
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
     * @param role Type: bytes32, Indexed: false
     * @param account Type: address, Indexed: false
     */
    revokeRole(role: string | number[], account: string): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param interfaceId Type: bytes4, Indexed: false
     */
    supportsInterface(interfaceId: string | number[]): MethodConstantReturnContext<boolean>;
    /**
     * Payable: true
     * Constant: false
     * StateMutability: payable
     * Type: function
     * @param validator Type: address, Indexed: false
     * @param delegator Type: address, Indexed: false
     * @param delegatorPk Type: bytes, Indexed: false
     */
    systemDelegate(validator: string, delegator: string, delegatorPk: string | number[]): MethodPayableReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param involvedValidators Type: address[], Indexed: false
     * @param oldDelegator Type: address, Indexed: false
     * @param newDelegator Type: address, Indexed: false
     * @param delegatorPk Type: bytes, Indexed: false
     */
    systemReplaceDelegator(involvedValidators: string[], oldDelegator: string, newDelegator: string, delegatorPk: string | number[]): MethodReturnContext;
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
    systemStake(validator: string, publicKey: string | number[], staker: string, stakerPk: string | number[], memo: string, rate: string): MethodPayableReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    totalDelegationAmount(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    trigger(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: uint256, Indexed: false
     */
    undelegations(parameter0: string): MethodConstantReturnContext<UndelegationsResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    undelegationsEnd(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    undelegationsStart(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    validatorStatus(parameter0: string): MethodConstantReturnContext<ValidatorStatusResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    validators(parameter0: string): MethodConstantReturnContext<ValidatorsResponse>;
}
