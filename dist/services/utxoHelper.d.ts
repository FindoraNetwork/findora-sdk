import { WalletKeypar } from '../api/keypair';
import { LedgerUtxo, OwnedMemoResponse, UtxoResponse } from '../api/network/types';
import { ClientAssetRecord as LedgerClientAssetRecord, OwnerMemo as LedgerOwnerMemo, TxoRef as LedgerTxoRef } from './ledger/types';
export interface LedgerUtxoItem {
    sid: number;
    utxo: LedgerUtxo;
    ownerMemo: LedgerOwnerMemo | undefined;
}
export interface AddUtxoItem extends LedgerUtxoItem {
    address: string;
    body: {
        amount: number;
        asset_type: string;
    };
    memoData: OwnedMemoResponse | undefined;
}
export interface UtxoOutputItem extends LedgerUtxoItem {
    originAmount: BigInt;
    amount: BigInt;
    memoData: OwnedMemoResponse | undefined;
}
export interface UtxoInputParameter {
    txoRef: LedgerTxoRef;
    assetRecord: LedgerClientAssetRecord;
    ownerMemo: LedgerOwnerMemo | undefined;
    amount: BigInt;
    memoData: OwnedMemoResponse | undefined;
    sid: number;
}
export interface UtxoInputsInfo {
    inputParametersList: UtxoInputParameter[];
    inputAmount: BigInt;
}
export declare const filterUtxoByCode: (code: string, utxoDataList: AddUtxoItem[]) => AddUtxoItem[];
export declare const decryptUtxoItem: (sid: number, walletInfo: WalletKeypar, utxoData: UtxoResponse, memoData?: OwnedMemoResponse | undefined) => Promise<AddUtxoItem>;
export declare const getUtxoItem: (sid: number, walletInfo: WalletKeypar, cachedItem?: AddUtxoItem | undefined) => Promise<AddUtxoItem>;
export declare const addUtxo: (walletInfo: WalletKeypar, addSids: number[]) => Promise<AddUtxoItem[]>;
/**
 * @depricated
 */
export declare const getSendUtxoLegacy: (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]) => UtxoOutputItem[];
export declare const getSendUtxoForAmount: (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]) => UtxoOutputItem[];
export declare const getSendUtxo: (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]) => UtxoOutputItem[];
export declare const addUtxoInputs: (utxoSids: UtxoOutputItem[]) => Promise<UtxoInputsInfo>;
export declare const getUtxoWithAmount: (walletInfo: WalletKeypar, utxoNumbers: BigInt, assetCode: string) => Promise<UtxoOutputItem>;
