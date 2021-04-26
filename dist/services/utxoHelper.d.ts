import { WalletKeypar } from '../api/keypair';
import { LedgerUtxo } from '../api/network/types';
import { ClientAssetRecord as LedgerClientAssetRecord, OwnerMemo as LedgerOwnerMemo, TxoRef as LedgerTxoRef } from './ledger/types';
interface LedgerUtxoItem {
    sid: number;
    utxo: LedgerUtxo;
    ownerMemo: LedgerOwnerMemo | undefined;
}
export interface AddUtxoItem extends LedgerUtxoItem {
    address: string;
    body: any;
}
interface UtxoOutputItem extends LedgerUtxoItem {
    originAmount: BigInt;
    amount: BigInt;
}
export interface UtxoInputParameter {
    txoRef: LedgerTxoRef;
    assetRecord: LedgerClientAssetRecord;
    ownerMemo: LedgerOwnerMemo | undefined;
    amount: BigInt;
}
export interface UtxoInputsInfo {
    inputParametersList: UtxoInputParameter[];
    inputAmount: BigInt;
}
export declare const addUtxo: (walletInfo: WalletKeypar, addSids: number[]) => Promise<AddUtxoItem[]>;
export declare const getSendUtxo: (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]) => UtxoOutputItem[];
export declare const addUtxoInputs: (utxoSids: UtxoOutputItem[]) => Promise<UtxoInputsInfo>;
export {};
