import * as Types from './types';
export declare const apiPost: (url: string, data?: Types.ParsedTransactionData | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiGet: (url: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const getOwnedSids: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnedSidsDataResult>;
export declare const getRelatedSids: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnedSidsDataResult>;
export declare const getUtxo: (utxoSid: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.UtxoDataResult>;
export declare const getOwnerMemo: (utxoSid: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnerMemoDataResult>;
export declare const getAbarOwnerMemo: (atxoSid: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnerMemoDataResult>;
export declare const getMTLeafInfo: (atxoSid: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.MTLeafInfoDataResult>;
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
export declare const getStateCommitment: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.StateCommitmentDataResult>;
export declare const getSubmitTransactionData: <T extends string>(data?: T | undefined) => Types.DataResult;
export declare const submitTransaction: <T extends string>(data?: T | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.SubmitTransactionDataResult>;
export declare const getAssetToken: (assetCode: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.AssetTokenDataResult>;
export declare const getIssuedRecords: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.IssuedRecordDataResult>;
/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @returns An instace of TransactionStatusDataResult
 */
export declare const getTransactionStatus: (handle: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.TransactionStatusDataResult>;
export declare const getBlock: (height: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.BlockDetailsDataResult>;
export declare const getHashSwap: (hash: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.HashSwapDataResult>;
export declare const getTxList: (address: string, type: 'to' | 'from', page?: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.TxListDataResult>;
export declare const getTransactionDetails: (hash: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.TxDetailsDataResult>;
export declare const getAbciNoce: (data: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.AbciNoceResult>;
export declare const getAbciInfo: (data: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.AbciInfoResult>;
export declare const submitEvmTx: (tx: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.SubmitEvmTxResult>;
export declare const getValidatorList: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.ValidatorListDataResult>;
export declare const getDelegateInfo: (publickey: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.DelegateInfoDataResult>;
export declare const sendRpcCall: <T>(url: string, givenPayload: {
    [key: string]: any;
}, config?: Types.NetworkAxiosConfig | undefined) => Promise<T>;
export declare const getOwnedAbars: (commitment: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnedAbarsDataResult>;
export declare const checkNullifierHashSpent: (hash: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.CheckNullifierHashSpentDataResult>;
