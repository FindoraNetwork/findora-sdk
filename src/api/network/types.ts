/* eslint-disable @typescript-eslint/naming-convention */
import { AssetRules as LedgerAssetRules } from '../../services/ledger/types';

export interface ResultError {
  message: string;
}

export interface DataResult {
  response?: any;
  error?: ResultError;
}

export interface NetworkAxiosDataResult extends DataResult {}

export interface NetworkAxiosResult {
  data: NetworkAxiosDataResult;
}

export interface NetworkAxiosHeaders {
  [key: string]: string | number;
  [index: number]: string;
  testHeader: string;
}

export interface NetworkAxiosConfig {
  headers?: NetworkAxiosHeaders;
  params?: any;
}

export interface OwnedSidsDataResult extends NetworkAxiosDataResult {
  response?: number[];
}

export type OwnedMemoResponse = {
  blind_share: string;
  lock: {
    ciphertext: string;
    ephemeral_public_key: string;
  };
};

export interface OwnerMemoDataResult extends NetworkAxiosDataResult {
  response?: OwnedMemoResponse;
}

export interface LedgerUtxo {
  id?: number | null | undefined;
  record: any;
}

export type UtxoResponse = {
  utxo: LedgerUtxo;
  authenticated_txn?: string;
  finalized_txn?: any;
  txn_inclusion_proof?: any;
  state_commitment_data?: any;
  state_commitment?: string[];
};

export interface UtxoDataResult extends NetworkAxiosDataResult {
  response?: UtxoResponse;
}

export type AssetTokenResponse = {
  properties: {
    code: {
      val: number[];
    };
    issuer: {
      key: string;
    };
    memo: string;
    asset_rules: LedgerAssetRules;
  };
};

export interface AssetTokenDataResult extends NetworkAxiosDataResult {
  response?: AssetTokenResponse;
}

export type BlockDetailsResponse = {
  result: {
    block_id: {
      hash: string;
    };
    block: {
      header: {
        chain_id: string;
        height: string;
        time: string;
      };
      data: {
        txs: null | any[];
      };
    };
  };
};

export interface BlockDetailsDataResult extends NetworkAxiosDataResult {
  response?: BlockDetailsResponse;
}

export interface TxInfo {
  hash: string;
  height: string;
  tx_result: {
    log: string;
    info: string;
    gasWanted: string;
    gasUsed: string;
    tx: string;
  };
}

export type HashSwapResponse = {
  result: {
    txs?: TxInfo[];
    total_count: string;
  };
};

export interface HashSwapDataResult extends NetworkAxiosDataResult {
  response?: HashSwapResponse;
}

export type StateCommitmenResponse = [number[], number, string];

export interface StateCommitmentDataResult extends NetworkAxiosDataResult {
  response?: StateCommitmenResponse;
}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: string;
}

export type TransactionStatusResponse = {
  Commited?: [number, number[]];
  Pending?: any;
};

export interface TransactionStatusDataResult extends NetworkAxiosDataResult {
  response?: TransactionStatusResponse;
}
