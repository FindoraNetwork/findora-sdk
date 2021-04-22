import { AssetRules as LedgerAssetRules } from '../../services/ledger/types';
import * as ApiKeyPair from '../keypair';
export interface AssetRules {
    transferable: boolean;
    updatable: boolean;
    decimal: number;
}
export declare const getFraAssetCode: () => Promise<string>;
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDefaultAssetRules: () => Promise<LedgerAssetRules>;
export declare const getAssetRules: (newAssetRules?: AssetRules | undefined) => Promise<LedgerAssetRules>;
export declare const defineAsset: (walletInfo: ApiKeyPair.WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<string>;
