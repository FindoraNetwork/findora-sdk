import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
export declare const sendToAddress: (walletInfo: WalletKeypar, toWalletInfo: WalletKeypar, numbers: number, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<string>;
