import { TransferAssetOperation, TxOperation } from '../types';
export interface ProcessedTransferAsset {
    transferAsset: TransferAssetOperation;
    from: string[];
    to: string[];
    type: string;
}
export declare const processTransferAsset: (operationItem: TxOperation) => Promise<ProcessedTransferAsset>;
