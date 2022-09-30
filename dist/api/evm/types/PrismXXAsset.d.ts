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
export declare type ContractContext = Web3ContractContext<PrismXXAsset, PrismXXAssetMethodNames, PrismXXAssetEventsContext, PrismXXAssetEvents>;
export declare type PrismXXAssetEvents = 'OwnershipTransferred';
export interface PrismXXAssetEventsContext {
    OwnershipTransferred(parameters: {
        filter?: {
            previousOwner?: string | string[];
            newOwner?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export declare type PrismXXAssetMethodNames = 'new' | 'assets' | 'bridge' | 'getERC1155Info' | 'getERC20Info' | 'getERC721Info' | 'getTokenType' | 'isBurn' | 'owner' | 'renounceOwnership' | 'setBurn' | 'setERC1155Info' | 'setERC20Info' | 'setERC721Info' | 'transferOwnership';
export interface OwnershipTransferredEventEmittedResponse {
    previousOwner: string;
    newOwner: string;
}
export interface AssetsResponse {
    addr: string;
    tokenId: string;
    ty: string;
    isBurn: boolean;
    decimal: string;
}
export interface GetERC1155InfoResponse {
    result0: string;
    result1: string;
}
export interface GetERC721InfoResponse {
    result0: string;
    result1: string;
}
export interface PrismXXAsset {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: constructor
     * @param _bridge Type: address, Indexed: false
     */
    'new'(_bridge: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: bytes32, Indexed: false
     */
    assets(parameter0: string | number[]): MethodConstantReturnContext<AssetsResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    bridge(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     */
    getERC1155Info(_asset: string | number[]): MethodConstantReturnContext<GetERC1155InfoResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     */
    getERC20Info(_asset: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     */
    getERC721Info(_asset: string | number[]): MethodConstantReturnContext<GetERC721InfoResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     */
    getTokenType(_asset: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     */
    isBurn(_asset: string | number[]): MethodConstantReturnContext<boolean>;
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
     * @param _asset Type: bytes32, Indexed: false
     */
    setBurn(_asset: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     * @param _addr Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     */
    setERC1155Info(_asset: string | number[], _addr: string, tokenId: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     * @param _addr Type: address, Indexed: false
     */
    setERC20Info(_asset: string | number[], _addr: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _asset Type: bytes32, Indexed: false
     * @param _addr Type: address, Indexed: false
     * @param tokenId Type: uint256, Indexed: false
     */
    setERC721Info(_asset: string | number[], _addr: string, tokenId: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param newOwner Type: address, Indexed: false
     */
    transferOwnership(newOwner: string): MethodReturnContext;
}
