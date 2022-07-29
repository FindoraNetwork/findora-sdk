export declare const delegateFraTransactionSubmit: () => Promise<boolean>;
export declare const delegateFraTransactionAndClaimRewards: () => Promise<boolean>;
export declare const unstakeFraTransactionSubmit: () => Promise<boolean>;
export declare const getSidsForAsset: (senderOne: string, assetCode: string) => Promise<number[]>;
export declare const defineCustomAsset: (senderOne: string, assetCode: string) => Promise<void>;
export declare const issueCustomAsset: (senderOne: string, assetCode: string, derivedAssetCode: string, amount: string) => Promise<void>;
export declare const createTestBarsMulti: (senderOne: string, asset1Code: string, derivedAsset1Code: string) => Promise<void>;
