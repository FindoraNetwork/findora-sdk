import { TransactionBuilder } from '../../services/ledger/types';
import { LightWalletKeypair, WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
import { ProcessedTxListResponseResult } from './types';
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
export interface TransferReciever {
    reciverWalletInfo: WalletKeypar | LightWalletKeypair;
    amount: number;
}
export declare const sendToMany: (walletInfo: WalletKeypar, recieversList: TransferReciever[], assetCode: string, decimals: number, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<string>;
export declare const sendToAddress: (walletInfo: WalletKeypar, address: string, numbers: number, assetCode: string, decimals: number, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<string>;
export declare const sendToPublicKey: (walletInfo: WalletKeypar, publicKey: string, numbers: number, assetCode: string, decimals: number, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<string>;
export declare const getTxList: (address: string, type: 'to' | 'from', page?: number) => Promise<ProcessedTxListResponseResult>;
