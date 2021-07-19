import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
export declare const unDelegate: (walletInfo: WalletKeypar, amount: bigint, validator: string, isFullUnstake?: boolean) => Promise<TransactionBuilder>;
export declare const delegate: (walletInfo: WalletKeypar, address: string, numbers: number, assetCode: string, validator: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
export declare const claim: (walletInfo: WalletKeypar, amount: bigint) => Promise<TransactionBuilder>;
