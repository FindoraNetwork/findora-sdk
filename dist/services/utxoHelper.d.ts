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
    body: any;
    memoData: OwnedMemoResponse | undefined;
}
export interface UtxoOutputItem extends LedgerUtxoItem {
    originAmount: bigint;
    amount: bigint;
    memoData: OwnedMemoResponse | undefined;
}
export interface UtxoInputParameter {
    txoRef: LedgerTxoRef;
    assetRecord: LedgerClientAssetRecord;
    ownerMemo: LedgerOwnerMemo | undefined;
    amount: bigint;
    memoData: OwnedMemoResponse | undefined;
    sid: number;
}
export interface UtxoInputsInfo {
    inputParametersList: UtxoInputParameter[];
    inputAmount: bigint;
}
export declare const decryptUtxoItem: (sid: number, walletInfo: WalletKeypar, utxoData: UtxoResponse, memoData?: OwnedMemoResponse) => Promise<AddUtxoItem>;
export declare const getUtxoItem: (sid: number, walletInfo: WalletKeypar, cachedItem?: AddUtxoItem) => Promise<AddUtxoItem>;
export declare const addUtxo: (walletInfo: WalletKeypar, addSids: number[]) => Promise<AddUtxoItem[]>;
export declare const getSendUtxo: (code: string, amount: bigint, utxoDataList: AddUtxoItem[]) => UtxoOutputItem[];
export declare const addUtxoInputs: (utxoSids: UtxoOutputItem[]) => Promise<UtxoInputsInfo>;
