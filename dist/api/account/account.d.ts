import { BigNumberValue } from '../../services/bigNumber';
import { WalletKeypar } from '../keypair';
import { IssuedRecord, TxOutput } from '../network/types';
export interface ProcessedIssuedRecord extends TxOutput {
    code: string;
    ownerMemo?: number | null;
}
export declare const getAssetBalance: (walletKeypair: WalletKeypar, assetCode: string, sids: number[]) => Promise<BigNumberValue>;
/**
 * @todo Add unit test
 * @param walletKeypair
 * @param assetCode
 * @returns
 */
export declare const getBalanceInWei: (walletKeypair: WalletKeypar, assetCode?: string) => Promise<BigNumberValue>;
/**
 * Get the balance of the specific asset for the given user
 *
 * @remarks
 * Using this function user can retrieve the balance for the specific asset code, which could be either custom asset or an FRA asset
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  const balance = await Account.getBalance(walletInfo, customAssetCode);
 * ```
 *
 * @throws `No sids were fetched`
 * @throws `Could not fetch balance`
 *
 * @returns Result of transaction submission to the network
 */
export declare const getBalance: (walletKeypair: WalletKeypar, assetCode?: string) => Promise<string>;
export declare const create: (password: string) => Promise<WalletKeypar>;
export declare const processIssuedRecordItem: (issuedRecord: IssuedRecord) => Promise<ProcessedIssuedRecord>;
export declare const processIssuedRecordList: (issuedRecords: IssuedRecord[]) => Promise<ProcessedIssuedRecord[]>;
export declare const getCreatedAssets: (address: string) => Promise<ProcessedIssuedRecord[]>;
export declare const getRelatedSids: (address: string) => Promise<number[]>;
