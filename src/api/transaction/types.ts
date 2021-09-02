import { ProcessedTx } from './operationProcessors/index';

export interface TxInput {
  Absolute: number;
}

// merge with network
export interface TxAmount {
  NonConfidential?: string;
  Confidential?: string[];
}

// merge with network
export interface TxAssetType {
  Confidential?: string;
  NonConfidential?: number[];
}

// merge with network
export interface TxRecord {
  amount: TxAmount;
  asset_type: TxAssetType;
  public_key: string;
}

// merge with network
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
  data: {
    address: {
      Ethereum: string;
    };
  };
  public: string;
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
