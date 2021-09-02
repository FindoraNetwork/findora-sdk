import { DelegationOperation, TxOperation } from '../types';
export interface ProcessedDelegation {
    delegation: DelegationOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processDelegation: (operationItem: TxOperation) => Promise<ProcessedDelegation>;
