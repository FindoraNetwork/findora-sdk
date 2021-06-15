import { BigNumberValue } from '../../services/bigNumber';
import { WalletKeypar } from '../keypair';
import { IssuedRecord, TxOutput } from '../network/types';
export interface ProcessedIssuedRecord extends TxOutput {
    code: string;
    ownerMemo?: number | null;
}
export declare const getAssetBalance: (walletKeypair: WalletKeypar, assetCode: string, sids: number[]) => Promise<BigNumberValue>;
export declare const getBalance: (walletKeypair: WalletKeypar, assetCode?: string | undefined) => Promise<string>;
export declare const create: (password: string) => Promise<WalletKeypar>;
export declare const processIssuedRecordItem: (issuedRecord: IssuedRecord) => Promise<ProcessedIssuedRecord>;
export declare const processIssuedRecordList: (issuedRecords: IssuedRecord[]) => Promise<ProcessedIssuedRecord[]>;
export declare const getCreatedAssets: (address: string) => Promise<ProcessedIssuedRecord[]>;
export declare const getRelatedSids: (address: string) => Promise<number[]>;
