import * as Types from './types';
export declare const apiPost: (url: string, data?: Types.ParsedTransactionData | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiGet: (url: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const getOwnedSids: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnedSidsDataResult>;
export declare const getUtxo: (utxoSid: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.UtxoDataResult>;
export declare const getOwnerMemo: (utxoSid: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.OwnerMemoDataResult>;
export declare const getStateCommitment: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.StateCommitmentDataResult>;
export declare const getSubmitTransactionData: <T extends string>(data?: T | undefined) => Types.DataResult;
export declare const submitTransaction: <T extends string>(data?: T | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.SubmitTransactionDataResult>;
