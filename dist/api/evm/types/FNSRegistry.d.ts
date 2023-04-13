import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { PromiEvent, TransactionReceipt, Web3ContractContext } from 'ethereum-abi-types-generator';
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
export type ContractContext = Web3ContractContext<FNSRegistry, FNSRegistryMethodNames, FNSRegistryEventsContext, FNSRegistryEvents>;
export type FNSRegistryEvents = undefined;
export interface FNSRegistryEventsContext {
}
export type FNSRegistryMethodNames = 'currentOwner' | 'currentResolver' | 'currentText' | 'delSubnodeOwner' | 'isApprovedForAll' | 'recordExists' | 'setApprovalForAll' | 'setDefaultText' | 'setExpirie' | 'setOwner' | 'setResolver' | 'setSubnodeOwner' | 'setText';
export interface FNSRegistry {
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param node Type: bytes32, Indexed: false
     */
    currentOwner(node: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param node Type: bytes32, Indexed: false
     */
    currentResolver(node: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param node Type: bytes32, Indexed: false
     */
    currentText(node: string | number[]): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     */
    delSubnodeOwner(node: string | number[]): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param operator Type: address, Indexed: false
     */
    isApprovedForAll(node: string | number[], operator: string): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param node Type: bytes32, Indexed: false
     */
    recordExists(node: string | number[]): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param operator Type: address, Indexed: false
     */
    setApprovalForAll(node: string | number[], operator: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param text Type: string, Indexed: false
     */
    setDefaultText(node: string | number[], text: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param expirie Type: uint256, Indexed: false
     */
    setExpirie(node: string | number[], expirie: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param owner Type: address, Indexed: false
     */
    setOwner(node: string | number[], owner: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param resolver Type: address, Indexed: false
     */
    setResolver(node: string | number[], resolver: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param parentNode Type: bytes32, Indexed: false
     * @param labelStr Type: string, Indexed: false
     * @param label Type: bytes32, Indexed: false
     * @param owner Type: address, Indexed: false
     */
    setSubnodeOwner(parentNode: string | number[], labelStr: string, label: string | number[], owner: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param node Type: bytes32, Indexed: false
     * @param text Type: string, Indexed: false
     */
    setText(node: string | number[], text: string): MethodReturnContext;
}
