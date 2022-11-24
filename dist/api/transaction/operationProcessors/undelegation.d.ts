import { TxOperation, UnDelegationOperation } from '../types';
export interface ProcessedUndelegation {
    unDelegation: UnDelegationOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processUndelegation: (operationItem: TxOperation) => Promise<ProcessedUndelegation>;
