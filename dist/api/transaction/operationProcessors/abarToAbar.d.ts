import { AbarToAbarOperation, TxOperation } from '../types';
export interface ProcessedAbarToAbar {
    abarToAbarOperation: AbarToAbarOperation;
    from: string[];
    to: string[];
    confidentialAmount?: string[];
    confidentialAssetType?: string;
    type: string;
    originalOperation?: TxOperation;
}
export declare const processAbarToAbar: (operationItem: TxOperation) => Promise<ProcessedAbarToAbar>;
