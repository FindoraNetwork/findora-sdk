import { ClaimOperation, TxOperation } from '../types';
export interface ProcessedClaim {
    claim: ClaimOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processClaim: (operationItem: TxOperation) => Promise<ProcessedClaim>;
