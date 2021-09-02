import * as Types from '../types';
import { ProcessedDefineAsset } from './defineAsset';
import { ProcessedIssueAsset } from './issueAsset';
import { ProcessedTransferAsset } from './transferAsset';
import { ProcessedUndelegation } from './undelegation';
import { ProcessedDelegation } from './delegation';
import { ProcessedClaim } from './claim';
import { ProcessedConvertAccount } from './converAccount';
import { Unsupported } from './unsupported';
export declare type ProcessedTx = ProcessedDefineAsset | ProcessedTransferAsset | ProcessedIssueAsset | ProcessedUndelegation | ProcessedDelegation | ProcessedClaim | ProcessedConvertAccount | Unsupported;
export declare type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;
export interface TxOperationProcessors {
    [key: string]: ProcessorType;
}
export declare const getOperationProcessor: (operationItem: Types.TxOperation, processors: TxOperationProcessors) => ProcessorType;
export declare const processorsMap: TxOperationProcessors;
