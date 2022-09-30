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
export declare type ContractContext = Web3ContractContext<NFT1155, NFT1155MethodNames, NFT1155EventsContext, NFT1155Events>;
export declare type NFT1155Events = 'ApprovalForAll' | 'RoleAdminChanged' | 'RoleGranted' | 'RoleRevoked' | 'TransferBatch' | 'TransferSingle' | 'URI';
export interface NFT1155EventsContext {
    ApprovalForAll(parameters: {
        filter?: {
            account?: string | string[];
            operator?: string | string[];
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
    TransferBatch(parameters: {
        filter?: {
            operator?: string | string[];
            from?: string | string[];
            to?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    TransferSingle(parameters: {
        filter?: {
            operator?: string | string[];
            from?: string | string[];
            to?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    URI(parameters: {
        filter?: {
            id?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export declare type NFT1155MethodNames = 'new' | 'CREATOR_ROLE' | 'DEFAULT_ADMIN_ROLE' | 'MINTER_ROLE' | 'balanceOf' | 'balanceOfBatch' | 'creators' | 'customUri' | 'getRoleAdmin' | 'getRoleMember' | 'getRoleMemberCount' | 'grantRole' | 'hasRole' | 'isApprovedForAll' | 'name' | 'renounceRole' | 'revokeRole' | 'safeBatchTransferFrom' | 'safeTransferFrom' | 'setApprovalForAll' | 'symbol' | 'tokenSupply' | 'uri' | 'totalSupply' | 'setURI' | 'setCustomURI' | 'creatorOf' | 'create' | 'mint' | 'batchMint' | 'burn' | 'burnBatch' | 'setCreator' | 'supportsInterface' | 'exists';
export interface ApprovalForAllEventEmittedResponse {
    account: string;
    operator: string;
    approved: boolean;
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
export interface TransferBatchEventEmittedResponse {
    operator: string;
    from: string;
    to: string;
    ids: string[];
    values: string[];
}
export interface TransferSingleEventEmittedResponse {
    operator: string;
    from: string;
    to: string;
    id: string;
    value: string;
}
export interface URIEventEmittedResponse {
    value: string;
    id: string;
}
export interface NFT1155 {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: constructor
     * @param _name Type: string, Indexed: false
     * @param _symbol Type: string, Indexed: false
     * @param _uri Type: string, Indexed: false
     */
    'new'(_name: string, _symbol: string, _uri: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    CREATOR_ROLE(): MethodConstantReturnContext<string>;
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
    MINTER_ROLE(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param account Type: address, Indexed: false
     * @param id Type: uint256, Indexed: false
     */
    balanceOf(account: string, id: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param accounts Type: address[], Indexed: false
     * @param ids Type: uint256[], Indexed: false
     */
    balanceOfBatch(accounts: string[], ids: string[]): MethodConstantReturnContext<string[]>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: uint256, Indexed: false
     */
    creators(parameter0: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: uint256, Indexed: false
     */
    customUri(parameter0: string): MethodConstantReturnContext<string>;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param account Type: address, Indexed: false
     * @param operator Type: address, Indexed: false
     */
    isApprovedForAll(account: string, operator: string): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    name(): MethodConstantReturnContext<string>;
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
     * @param from Type: address, Indexed: false
     * @param to Type: address, Indexed: false
     * @param ids Type: uint256[], Indexed: false
     * @param amounts Type: uint256[], Indexed: false
     * @param data Type: bytes, Indexed: false
     */
    safeBatchTransferFrom(from: string, to: string, ids: string[], amounts: string[], data: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param from Type: address, Indexed: false
     * @param to Type: address, Indexed: false
     * @param id Type: uint256, Indexed: false
     * @param amount Type: uint256, Indexed: false
     * @param data Type: bytes, Indexed: false
     */
    safeTransferFrom(from: string, to: string, id: string, amount: string, data: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param operator Type: address, Indexed: false
     * @param approved Type: bool, Indexed: false
     */
    setApprovalForAll(operator: string, approved: boolean): MethodReturnContext;
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
     * @param parameter0 Type: uint256, Indexed: false
     */
    tokenSupply(parameter0: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: uint256, Indexed: false
     */
    uri(parameter0: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _id Type: uint256, Indexed: false
     */
    totalSupply(_id: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _newURI Type: string, Indexed: false
     */
    setURI(_newURI: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _tokenId Type: uint256, Indexed: false
     * @param _newURI Type: string, Indexed: false
     */
    setCustomURI(_tokenId: string, _newURI: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _id Type: uint256, Indexed: false
     */
    creatorOf(_id: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _initialOwner Type: address, Indexed: false
     * @param _id Type: uint256, Indexed: false
     * @param _initialSupply Type: uint256, Indexed: false
     * @param _uri Type: string, Indexed: false
     */
    create(_initialOwner: string, _id: string, _initialSupply: string, _uri: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _to Type: address, Indexed: false
     * @param _id Type: uint256, Indexed: false
     * @param _quantity Type: uint256, Indexed: false
     * @param _data Type: bytes, Indexed: false
     */
    mint(_to: string, _id: string, _quantity: string, _data: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _to Type: address, Indexed: false
     * @param _ids Type: uint256[], Indexed: false
     * @param _quantities Type: uint256[], Indexed: false
     * @param _data Type: bytes, Indexed: false
     */
    batchMint(_to: string, _ids: string[], _quantities: string[], _data: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _account Type: address, Indexed: false
     * @param _id Type: uint256, Indexed: false
     * @param _quantity Type: uint256, Indexed: false
     */
    burn(_account: string, _id: string, _quantity: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _account Type: address, Indexed: false
     * @param _ids Type: uint256[], Indexed: false
     * @param _quantities Type: uint256[], Indexed: false
     */
    burnBatch(_account: string, _ids: string[], _quantities: string[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _to Type: address, Indexed: false
     * @param _ids Type: uint256[], Indexed: false
     */
    setCreator(_to: string, _ids: string[]): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _id Type: uint256, Indexed: false
     */
    exists(_id: string): MethodConstantReturnContext<boolean>;
}
