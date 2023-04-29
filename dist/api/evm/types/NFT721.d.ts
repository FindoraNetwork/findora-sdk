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
export type ContractContext = Web3ContractContext<NFT721, NFT721MethodNames, NFT721EventsContext, NFT721Events>;
export type NFT721Events = 'Approval' | 'ApprovalForAll' | 'ConsecutiveTransfer' | 'Transfer';
export interface NFT721EventsContext {
    Approval(parameters: {
        filter?: {
            owner?: string | string[];
            approved?: string | string[];
            tokenId?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    ApprovalForAll(parameters: {
        filter?: {
            owner?: string | string[];
            operator?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    ConsecutiveTransfer(parameters: {
        filter?: {
            fromTokenId?: string | string[];
            from?: string | string[];
            to?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    Transfer(parameters: {
        filter?: {
            from?: string | string[];
            to?: string | string[];
            tokenId?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export type NFT721MethodNames = 'approve' | 'balanceOf' | 'getApproved' | 'isApprovedForAll' | 'name' | 'ownerOf' | 'safeTransferFrom' | 'safeTransferFrom' | 'setApprovalForAll' | 'supportsInterface' | 'symbol' | 'tokenURI' | 'totalSupply' | 'transferFrom';
export interface ApprovalEventEmittedResponse {
    owner: string;
    approved: string;
    tokenId: string;
}
export interface ApprovalForAllEventEmittedResponse {
    owner: string;
    operator: string;
    approved: boolean;
}
export interface ConsecutiveTransferEventEmittedResponse {
    fromTokenId: string;
    toTokenId: string;
    from: string;
    to: string;
}
export interface TransferEventEmittedResponse {
    from: string;
    to: string;
    tokenId: string;
}
export interface NFT721 {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param to Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     */
    approve(to: string, tokenId: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param owner Type: address, Indexed: false
     */
    balanceOf(owner: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param tokenId Type: uint256, Indexed: false
     */
    getApproved(tokenId: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param owner Type: address, Indexed: false
     * @param operator Type: address, Indexed: false
     */
    isApprovedForAll(owner: string, operator: string): MethodConstantReturnContext<boolean>;
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
     * @param tokenId Type: uint256, Indexed: false
     */
    ownerOf(tokenId: string): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param from Type: address, Indexed: false
     * @param to Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     */
    safeTransferFrom(from: string, to: string, tokenId: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param from Type: address, Indexed: false
     * @param to Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     * @param data Type: bytes, Indexed: false
     */
    safeTransferFrom(from: string, to: string, tokenId: string, data: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param operator Type: address, Indexed: false
     * @param _approved Type: bool, Indexed: false
     */
    setApprovalForAll(operator: string, _approved: boolean): MethodReturnContext;
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
     */
    symbol(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param tokenId Type: uint256, Indexed: false
     */
    tokenURI(tokenId: string): MethodConstantReturnContext<string>;
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
     * @param from Type: address, Indexed: false
     * @param to Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     */
    transferFrom(from: string, to: string, tokenId: string): MethodReturnContext;
}
