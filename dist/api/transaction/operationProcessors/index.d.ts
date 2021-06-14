import * as Types from '../types';
import { Unsupported } from './unsupported';
import { ProcessedDefineAsset } from './defineAsset';
import { ProcessedTransferAsset } from './transferAsset';
import { ProcessedIssueAsset } from './issueAsset';
export declare type ProcessedTx = ProcessedDefineAsset | ProcessedTransferAsset | ProcessedIssueAsset | Unsupported;
export declare type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;
export interface TxOperationProcessors {
    [key: string]: ProcessorType;
}
export declare const getOperationProcessor: (operationItem: Types.TxOperation, processors: TxOperationProcessors) => ProcessorType;
export declare const processorsMap: TxOperationProcessors;
