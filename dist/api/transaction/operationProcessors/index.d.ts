import * as Types from '../types';
import { ProcessedClaim } from './claim';
import { ProcessedConvertAccount } from './convertAccount';
import { ProcessedDefineAsset } from './defineAsset';
import { ProcessedDelegation } from './delegation';
import { ProcessedIssueAsset } from './issueAsset';
import { ProcessedTransferAsset } from './transferAsset';
import { ProcessedUndelegation } from './undelegation';
import { Unsupported } from './unsupported';
export type ProcessedTx = ProcessedDefineAsset | ProcessedTransferAsset | ProcessedIssueAsset | ProcessedUndelegation | ProcessedDelegation | ProcessedClaim | ProcessedConvertAccount | Unsupported;
export type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;
export interface TxOperationProcessors {
    [key: string]: ProcessorType;
}
export declare const getOperationProcessor: (operationItem: Types.TxOperation, processors: TxOperationProcessors) => ProcessorType;
export declare const processorsMap: TxOperationProcessors;
