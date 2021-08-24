import { AssetRules as LedgerAssetRules, TransactionBuilder, XfrKeyPair, XfrPublicKey } from '../../services/ledger/types';
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
export declare const getFraPublicKey: () => Promise<XfrPublicKey>;
export declare const getAssetCode: (val: number[]) => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDefaultAssetRules: () => Promise<LedgerAssetRules>;
export declare const getAssetRules: (newAssetRules?: AssetRules | undefined) => Promise<LedgerAssetRules>;
export declare const getDefineAssetTransactionBuilder: (walletKeypair: XfrKeyPair, assetName: string, assetRules: LedgerAssetRules, assetMemo?: string) => Promise<TransactionBuilder>;
export declare const getIssueAssetTransactionBuilder: (walletKeypair: XfrKeyPair, assetName: string, amountToIssue: string, assetBlindRules: AssetBlindRules, assetDecimals: number) => Promise<TransactionBuilder>;
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<TransactionBuilder>;
export declare const issueAsset: (walletInfo: WalletKeypar, assetName: string, amountToIssue: string, assetBlindRules: AssetBlindRules, assetDecimals?: number | undefined) => Promise<TransactionBuilder>;
export declare const getAssetDetails: (assetCode: string) => Promise<FindoraWallet.IAsset>;
