/* eslint-disable @typescript-eslint/naming-convention */
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
  properties: FindoraWallet.IPureAsset;
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
        time: string | undefined;
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

export interface TxResult {
  code: number;
  hash: string;
  time: string | undefined;
  data: null | any[];
  log?: string;
  info?: string;
  gasWanted?: string;
  gasUsed?: string;
}

export interface AbciNoce {
  code: number;
  log: string;
  info: string;
  index: string;
  key: any;
  value: string;
  proof: any;
  height: string;
  codespace: string;
}

export interface SubmitEvmTx {
  height: string;
  hash: string;
  deliver_tx: { log: string; data: string; code: string };
  check_tx: {
    log: string;
    data: string;
    code: string;
  };
}

export interface TxInfo {
  code: number;
  data: null | any[];
  hash: string;
  time: string | undefined;
  height: number;
  index: number;
  tx_result: TxResult;
  tx: string;
}
export interface TxListResponseResult {
  txs: null | TxInfo[];
  total_count: number;
}

export type TxListResponse = {
  result: TxListResponseResult;
};

export interface TxListDataResult extends NetworkAxiosDataResult {
  response?: TxListResponse;
}

export type TxDetailsResponse = {
  result: {
    tx: string;
  };
};

export interface TxDetailsDataResult extends NetworkAxiosDataResult {
  response?: TxDetailsResponse;
}

export type HashSwapResponse = {
  result: TxListResponseResult;
};

export interface ValidatorItem {
  addr: string;
  power: string;
  commission_rate: number[];
  accept_delegation: boolean;
  rank: number;
  extra: {
    name: string;
    desc: string;
    website: string;
    logo: string;
  };
}

export interface ValidatorListResponse {
  threshold: number[];
  validator_cnt: number;
  cur_height: number;
  validators: ValidatorItem[];
}

export type DelegationBondEntry = [string, string];

export interface DelegateInfoResponse {
  bond: string;
  bond_entries: DelegationBondEntry;
  unbond: string;
  rewards: string;
  return_rate: number[];
  global_delegation: string;
  global_staking: string;
  start_height: number;
  end_height: number;
  current_height: number;
  delegation_rwd_cnt: string;
  proposer_rwd_cnt: string;
}

export interface HashSwapDataResult extends NetworkAxiosDataResult {
  response?: HashSwapResponse;
}

export type StateCommitmenResponse = [number[], number, string];

export interface StateCommitmentDataResult extends NetworkAxiosDataResult {
  response?: StateCommitmenResponse;
}

export interface ValidatorListDataResult extends NetworkAxiosDataResult {
  response?: ValidatorListResponse;
}

export interface DelegateInfoDataResult extends NetworkAxiosDataResult {
  response?: DelegateInfoResponse;
}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: string;
}

export type TransactionStatusResponse = {
  Committed?: [number, number[]];
  Pending?: any;
};

export interface TransactionStatusDataResult extends NetworkAxiosDataResult {
  response?: TransactionStatusResponse;
}

export type IssuedRecord = [TxOutput, null | number];

export type IssuedRecordResponse = IssuedRecord[];

export interface IssuedRecordDataResult extends NetworkAxiosDataResult {
  response?: IssuedRecordResponse;
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

export type AbciNoceResponse = {
  result: { response: AbciNoce };
};

export interface AbciNoceResult extends NetworkAxiosDataResult {
  response?: AbciNoceResponse;
}

export interface AbciInfoResult extends NetworkAxiosDataResult {
  response?: AbciNoceResponse;
}

export type SubmitEvmTxResponse = {
  result: {
    code: number;
    data: string;
    log: string;
    codespace: string;
    hash: string;
  };
};

export interface SubmitEvmTxResult extends NetworkAxiosDataResult {
  response?: SubmitEvmTxResponse;
}
