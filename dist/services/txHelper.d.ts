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
export interface TxOperation {
    TransferAsset?: TransferAssetOperation;
    IssueAsset?: IssueAssetOperation;
    DefineAsset?: DefineAssetOperation;
}
export interface ParsedTx {
    body: {
        operations: TxOperation[];
    };
}
export declare const getTxList: (address: string, type: 'to' | 'from', page?: number) => Promise<string[]>;
