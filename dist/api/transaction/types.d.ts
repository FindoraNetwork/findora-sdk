import { ProcessedTx } from './operationProcessors/index';
export interface TxInput {
    Absolute: number;
}
export interface TxAmount {
    NonConfidential?: string;
    Confidential?: string[];
}
export interface TxAssetType {
    Confidential?: string;
    NonConfidential?: number[];
}
export interface TxRecord {
    amount: TxAmount;
    asset_type: TxAssetType;
    public_key: string;
}
export interface TxOutput {
    id: number | null;
    record: TxRecord;
}
export interface TransferAssetOperation {
    body: {
        inputs: TxInput[];
        outputs: TxOutput[];
        transfer: {
            inputs: TxRecord[];
            outputs: TxRecord[];
        };
        policies: number[];
        transfer_type: string;
    };
}
export interface IssueAssetOperation {
    body: {
        code: {
            val: number[];
        };
        seq_num: number;
        records: [TxOutput[], null | number];
    };
    pubkey: {
        key: string;
    };
    signature: string;
}
export interface DefineAssetOperation {
    body: {
        asset: FindoraWallet.IPureAsset;
    };
    pubkey: {
        key: string;
    };
    signature: string;
}
export interface ClaimOperation {
    body: {
        pu: any;
        nonce: number[];
    };
    pubkey: string;
    signature: string;
}
export interface UnDelegationOperation {
    body: {
        pu: any;
        nonce: number[];
    };
    pubkey: string;
    signature: string;
}
export interface DelegationOperation {
    body: {
        pu: any;
        nonce: number[];
    };
    pubkey: string;
    signature: string;
}
export interface ConvertAccountOperation {
    receiver: {
        Ethereum: string;
    };
    value: string;
    signer: string;
}
export interface TxOperation {
    TransferAsset?: TransferAssetOperation;
    IssueAsset?: IssueAssetOperation;
    DefineAsset?: DefineAssetOperation;
    Claim?: ClaimOperation;
    UnDelegation?: UnDelegationOperation;
    Delegation?: DelegationOperation;
    ConvertAccount?: ConvertAccountOperation;
}
export interface ParsedTx {
    body: {
        operations: TxOperation[];
    };
}
export interface ProcessedTxInfo {
    code: number;
    data: ProcessedTx[];
    hash: string;
    time: string | undefined;
}
export interface ProcessedTxListResponseResult {
    txs: ProcessedTxInfo[];
    total_count: number;
}
