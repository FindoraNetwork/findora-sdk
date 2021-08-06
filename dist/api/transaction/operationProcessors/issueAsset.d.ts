import { IssueAssetOperation, TxOperation } from '../types';
export interface ProcessedIssueAsset {
    issueAsset: IssueAssetOperation;
    from: string[];
    to: string[];
    type: string;
    originalOperation?: TxOperation;
}
export declare const processIssueAsset: (operationItem: TxOperation) => Promise<ProcessedIssueAsset>;
