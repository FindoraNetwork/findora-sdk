import { WalletKeypar } from '../keypair';
interface AssetRules {
    transferable: boolean;
    updatable: boolean;
    decimal: number;
}
export declare const getFraAssetCode: () => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<string>;
export {};
