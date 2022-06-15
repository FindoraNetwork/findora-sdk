import { AbarToBarOperation, TxOperation } from '../types';
export interface ProcessedAbarToBar {
    abarToBarOperation: AbarToBarOperation;
    from: string[];
    to: string[];
    amount?: string[];
    confidentialAmount?: string[];
    assetType?: number[];
    confidentialAssetType?: string;
    type: string;
    originalOperation?: TxOperation;
}
export declare const processAbarToBar: (operationItem: TxOperation) => Promise<ProcessedAbarToBar>;
