import { TransactionBuilder, XfrPublicKey } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
export interface AssetRules {
    transferable: boolean;
    updatable: boolean;
    decimals: number;
    traceable?: boolean;
    maxNumbers?: string;
}
export interface AssetBlindRules {
    isAmountBlind?: boolean;
    isTypeBlind?: boolean;
}
export declare const getFraAssetCode: () => Promise<string>;
export declare const getMinimalFee: () => Promise<BigInt>;
/**
 * Add unit test
 */
export declare const getFraPublicKey: () => Promise<XfrPublicKey>;
export declare const getAssetCode: (val: number[]) => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<TransactionBuilder>;
export declare const issueAsset: (walletInfo: WalletKeypar, assetName: string, amountToIssue: string, assetBlindRules: AssetBlindRules, assetDecimals?: number | undefined) => Promise<TransactionBuilder>;
export declare const getAssetDetails: (assetCode: string) => Promise<FindoraWallet.IAsset>;
