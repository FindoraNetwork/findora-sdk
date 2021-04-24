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
  authenticated_txn: string;
  finalized_txn: any;
  txn_inclusion_proof: any;
  state_commitment_data: any;
  state_commitment: string[];
};

export interface UtxoDataResult extends NetworkAxiosDataResult {
  response?: UtxoResponse;
}

export type StateCommitmenResponse = [number[], number, string];

export interface StateCommitmentDataResult extends NetworkAxiosDataResult {
  response?: StateCommitmenResponse;
}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: number;
}
