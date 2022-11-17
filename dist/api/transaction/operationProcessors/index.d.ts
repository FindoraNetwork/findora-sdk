import * as Types from '../types';
import { ProcessedAbarToAbar } from './abarToAbar';
import { ProcessedAbarToBar } from './abarToBar';
import { ProcessedBarToAbar } from './barToAbar';
import { ProcessedClaim } from './claim';
import { ProcessedConvertAccount } from './converAccount';
import { ProcessedDefineAsset } from './defineAsset';
import { ProcessedDelegation } from './delegation';
import { ProcessedIssueAsset } from './issueAsset';
import { ProcessedTransferAsset } from './transferAsset';
import { ProcessedUndelegation } from './undelegation';
import { Unsupported } from './unsupported';
export declare type ProcessedTx = ProcessedDefineAsset | ProcessedTransferAsset | ProcessedIssueAsset | ProcessedUndelegation | ProcessedDelegation | ProcessedClaim | ProcessedConvertAccount | ProcessedBarToAbar | ProcessedAbarToBar | ProcessedAbarToAbar | Unsupported;
export declare type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;
export interface TxOperationProcessors {
    [key: string]: ProcessorType;
}
export declare const getOperationProcessor: (operationItem: Types.TxOperation, processors: TxOperationProcessors) => ProcessorType;
export declare const processorsMap: TxOperationProcessors;
