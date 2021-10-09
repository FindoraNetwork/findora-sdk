import { TransferAssetOperation, TxOperation } from '../types';
export interface ProcessedTransferAsset {
    transferAsset: TransferAssetOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processTransferAsset: (operationItem: TxOperation) => Promise<ProcessedTransferAsset>;
