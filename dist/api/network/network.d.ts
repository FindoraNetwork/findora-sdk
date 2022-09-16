import * as Types from './types';
export declare const apiPost: (url: string, data?: Types.ParsedTransactionData, config?: Types.NetworkAxiosConfig) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiGet: (url: string, config?: Types.NetworkAxiosConfig) => Promise<Types.NetworkAxiosDataResult>;
export declare const getOwnedSids: (address: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnedSidsDataResult>;
export declare const getRelatedSids: (address: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnedSidsDataResult>;
export declare const getUtxo: (utxoSid: number, config?: Types.NetworkAxiosConfig) => Promise<Types.UtxoDataResult>;
export declare const getOwnerMemo: (utxoSid: number, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnerMemoDataResult>;
/**
 * Returns state commitment
 *
 * @remarks
 * An important property of a Findora ledger is the ability to authenticate transactions.
 * Users can authenticate transactions against a small tag called the state commitment.
 * The state commitment is a commitment to the current state of the ledger.
 * The state commitment response is a tuple containing the state commitment and the state commitment version.
 *
 *
 * @returns An instace of StateCommitmentDataResult
 */
export declare const getStateCommitment: (config?: Types.NetworkAxiosConfig) => Promise<Types.StateCommitmentDataResult>;
export declare const getSubmitTransactionData: <T extends string>(data?: T | undefined) => Types.DataResult;
export declare const submitTransaction: <T extends string>(data?: T | undefined, config?: Types.NetworkAxiosConfig) => Promise<Types.SubmitTransactionDataResult>;
export declare const getAssetToken: (assetCode: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AssetTokenDataResult>;
export declare const getIssuedRecords: (address: string, config?: Types.NetworkAxiosConfig) => Promise<Types.IssuedRecordDataResult>;
/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @returns An instace of TransactionStatusDataResult
 */
export declare const getTransactionStatus: (handle: string, config?: Types.NetworkAxiosConfig) => Promise<Types.TransactionStatusDataResult>;
export declare const getBlock: (height: number, config?: Types.NetworkAxiosConfig) => Promise<Types.BlockDetailsDataResult>;
export declare const getHashSwap: (hash: string, config?: Types.NetworkAxiosConfig) => Promise<Types.HashSwapDataResult>;
export declare const getTxList: (address: string, type: 'to' | 'from', page?: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListDataResult>;
export declare const getTransactionDetails: (hash: string, config?: Types.NetworkAxiosConfig) => Promise<Types.TxDetailsDataResult>;
export declare const getAbciNoce: (data: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbciNoceResult>;
export declare const getAbciInfo: (data: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbciInfoResult>;
export declare const submitEvmTx: (tx: string, config?: Types.NetworkAxiosConfig) => Promise<Types.SubmitEvmTxResult>;
export declare const getValidatorList: (config?: Types.NetworkAxiosConfig) => Promise<Types.ValidatorListDataResult>;
export declare const getDelegateInfo: (publickey: string, config?: Types.NetworkAxiosConfig) => Promise<Types.DelegateInfoDataResult>;
export declare const sendRpcCall: <T>(url: string, givenPayload: {
    [key: string]: any;
}, config?: Types.NetworkAxiosConfig) => Promise<T>;
