import { TransactionBuilder } from '../../services/ledger/types';
import { LightWalletKeypair, WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
import { ProcessedTxListResponseResult } from './types';
export interface TransferReciever {
    reciverWalletInfo: WalletKeypar | LightWalletKeypair;
    amount: string;
}
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
export declare const sendToMany: (walletInfo: WalletKeypar, recieversList: TransferReciever[], assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
export declare const submitTransaction: (transactionBuilder: TransactionBuilder) => Promise<string>;
export declare const sendToAddress: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
export declare const sendToPublicKey: (walletInfo: WalletKeypar, publicKey: string, amount: string, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
export declare const getTxList: (address: string, type: 'to' | 'from', page?: number) => Promise<ProcessedTxListResponseResult>;
