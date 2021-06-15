import { TxOperation } from '../types';
export interface Unsupported {
    result: boolean;
    type: string;
    originalOperation: TxOperation;
}
export declare const processUnsupported: (op: TxOperation) => Promise<Unsupported>;
