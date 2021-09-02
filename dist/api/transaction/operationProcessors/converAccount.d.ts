import { ConvertAccountOperation, TxOperation } from '../types';
export interface ProcessedConvertAccount {
    convertAccount: ConvertAccountOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processConvertAccount: (operationItem: TxOperation) => Promise<ProcessedConvertAccount>;
