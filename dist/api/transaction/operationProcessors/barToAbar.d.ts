import { BarToAbarOperation, TxOperation } from '../types';
export interface ProcessedBarToAbar {
    barToAbarOperation: BarToAbarOperation;
    from: string[];
    to: string[];
    amount?: string[];
    confidentialAmount?: string[];
    assetType?: number[];
    confidentialAssetType?: string;
    type: string;
    originalOperation?: TxOperation;
}
export declare const processBarToAbar: (operationItem: TxOperation) => Promise<ProcessedBarToAbar>;
