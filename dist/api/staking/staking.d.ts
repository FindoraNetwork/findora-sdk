import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
export declare const unDelegate: (walletInfo: WalletKeypar, amount: string, validator: string, isFullUnstake?: boolean) => Promise<TransactionBuilder>;
export declare const delegate: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, validator: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
export declare const claim: (walletInfo: WalletKeypar, amount: string) => Promise<TransactionBuilder>;
