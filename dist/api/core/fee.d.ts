import { ClientAssetRecord as LedgerClientAssetRecord, OwnerMemo as LedgerOwnerMemo, TransferOperationBuilder, TxoRef as LedgerTxoRef } from '../../services/ledger/types';
import { LedgerUtxo } from '../../services/network/types';
import { WalletKeypar } from '../keypair';
interface LedgerUtxoItem {
    sid: number;
    utxo: LedgerUtxo;
    ownerMemo: LedgerOwnerMemo | undefined;
}
interface AddUtxoItem extends LedgerUtxoItem {
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
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string) => Promise<TransferOperationBuilder>;
export {};
