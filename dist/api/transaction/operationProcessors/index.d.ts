import * as Types from '../types';
import { Unsupported } from './unsupported';
import { ProcessedDefineAsset } from './defineAsset';
export declare type ProcessedTx = ProcessedDefineAsset | Unsupported;
export declare type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;
export interface TxOperationProcessors {
    [key: string]: ProcessorType;
}
export declare const getOperationProcessor: (operationItem: Types.TxOperation, processors: TxOperationProcessors) => ProcessorType;
export declare const processorsMap: TxOperationProcessors;
