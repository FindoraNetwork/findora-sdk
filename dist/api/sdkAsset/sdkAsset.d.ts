import { WalletKeypar } from '../keypair';
interface AssetRules {
    transferable: boolean;
    updatable: boolean;
    decimals: number;
    traceable?: boolean;
    maxNumbers?: number;
}
export declare const getFraAssetCode: () => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<string>;
export declare const issueAsset: (walletInfo: WalletKeypar, assetName: string, amountToIssue: number) => Promise<string>;
export {};
