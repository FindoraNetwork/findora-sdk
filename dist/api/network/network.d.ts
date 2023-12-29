import * as Types from './types';
export declare const getRpcRoute: () => string;
export declare const apiPost: (url: string, data?: Types.ParsedTransactionData, config?: Types.NetworkAxiosConfig) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiGet: (url: string, config?: Types.NetworkAxiosConfig) => Promise<Types.NetworkAxiosDataResult>;
export declare const getOwnedSids: (address: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnedSidsDataResult>;
export declare const getRelatedSids: (address: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnedSidsDataResult>;
export declare const getUtxo: (utxoSid: number, config?: Types.NetworkAxiosConfig) => Promise<Types.UtxoDataResult>;
export declare const getOwnerMemo: (utxoSid: number, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnerMemoDataResult>;
export declare const getAbarOwnerMemo: (atxoSid: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnerMemoDataResult>;
export declare const getMTLeafInfo: (atxoSid: string, config?: Types.NetworkAxiosConfig) => Promise<Types.MTLeafInfoDataResult>;
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
export declare const getParamsForTransparentTxList: (address: string, type: 'to' | 'from', page?: number) => Types.TxListQueryParams;
export declare const getAnonymousTxList: (subject: string, type: 'to' | 'from', page?: number) => Types.TxListQueryParams;
export declare const getTxList: (subject: string, type: 'from' | 'to', page: number | undefined, per_page: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListDataResult>;
export declare const getTxListByClaim: (subject: string, page: number | undefined, page_size: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListByStakingDataResult>;
export declare const getTxListByStakingDelegation: (subject: string, page: number | undefined, page_size: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListByStakingDataResult>;
export declare const getTxListByStakingUnDelegation: (subject: string, page: number | undefined, page_size: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListByStakingUnDelegationDataResponseResult>;
export declare const getTxListByPrismSend: (subject: string, page: number | undefined, page_size: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListByPrismDataResult>;
export declare const getTxListByPrismReceive: (subject: string, page: number | undefined, page_size: number, config?: Types.NetworkAxiosConfig) => Promise<Types.TxListByPrismDataResult>;
export declare const getTransactionDetails: (hash: string, config?: Types.NetworkAxiosConfig) => Promise<Types.TxDetailsDataResult>;
export declare const getAbciNoce: (data: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbciNoceResult>;
export declare const getAbciInfo: (data: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbciInfoResult>;
export declare const submitEvmTx: (tx: string, config?: Types.NetworkAxiosConfig) => Promise<Types.SubmitEvmTxResult>;
export declare const getValidatorList: (config?: Types.NetworkAxiosConfig) => Promise<Types.ValidatorListDataResult>;
export declare const getDelegateInfo: (publickey: string, config?: Types.NetworkAxiosConfig) => Promise<Types.DelegateInfoDataResult>;
export declare const sendRpcCall: <T>(url: string, givenPayload: {
    [key: string]: any;
}, config?: Types.NetworkAxiosConfig) => Promise<T>;
export declare const sendRpcCallV2: <N>(givenPayload: N, config?: Types.NetworkAxiosConfig) => Promise<Types.NetworkAxiosDataResult>;
export declare const getRpcPayload: <T>(msgId: number, method: string, extraParams?: T | undefined) => {
    id: number;
    method: string;
    params: T | undefined;
};
export declare const getLatestBlock: (extraParams?: Types.BlockHeightParams, config?: Types.NetworkAxiosConfig) => Promise<Types.BlockHeightResult>;
export declare const getOwnedAbars: (commitment: string, config?: Types.NetworkAxiosConfig) => Promise<Types.OwnedAbarsDataResult>;
export declare const getAbarMemos: (startSid: string, endSid: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbarMemoDataResult>;
export declare const checkNullifierHashSpent: (hash: string, config?: Types.NetworkAxiosConfig) => Promise<Types.CheckNullifierHashSpentDataResult>;
export declare const getConfig: (config?: Types.NetworkAxiosConfig) => Promise<Types.DisplayCheckpointDataResult>;
export declare const getAbarCommitment: (atxoSid: string, config?: Types.NetworkAxiosConfig) => Promise<Types.AbarCommitmentDataResult>;
export declare const getMaxAtxoSid: (config?: Types.NetworkAxiosConfig) => Promise<Types.MaxAtxoSidDataResult>;
export declare const submitBRC20Tx: (tx: string, config?: Types.NetworkAxiosConfig) => Promise<Types.SubmitEvmTxResult>;
