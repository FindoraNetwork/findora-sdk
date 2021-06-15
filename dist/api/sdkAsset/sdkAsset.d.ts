import { WalletKeypar } from '../keypair';
export interface AssetRules {
    transferable: boolean;
    updatable: boolean;
    decimals: number;
    traceable?: boolean;
    maxNumbers?: number;
}
export interface AssetBlindRules {
    isAmountBlind?: boolean;
    isTypeBlind?: boolean;
}
export declare const getFraAssetCode: () => Promise<string>;
export declare const getAssetCode: (val: number[]) => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<string>;
export declare const issueAsset: (walletInfo: WalletKeypar, assetName: string, amountToIssue: number, assetBlindRules: AssetBlindRules, assetDecimals: number) => Promise<string>;
export declare const getAssetDetails: (assetCode: string) => Promise<FindoraWallet.IAsset>;
