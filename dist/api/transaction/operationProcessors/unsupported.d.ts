import { TxOperation } from '../types';
export interface Unsupported {
    result: boolean;
    type: string;
    originalOperation: TxOperation;
    from: string[];
    to: string[];
}
export declare const processUnsupported: (op: TxOperation) => Promise<Unsupported>;
