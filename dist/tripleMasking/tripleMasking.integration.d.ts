import { Keypair } from '../api';
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDerivedAssetCode: (asset1Code: string) => Promise<string>;
export declare const getAnonKeys: () => Promise<FindoraWallet.FormattedAnonKeys>;
export declare const createNewKeypair: () => Promise<Keypair.WalletKeypar>;
export declare const defineCustomAsset: (senderOne: string, assetCode: string) => Promise<void>;
export declare const issueCustomAsset: (senderOne: string, assetCode: string, derivedAssetCode: string, amount: string) => Promise<void>;
export declare const validateSpent: (AnonKeys: FindoraWallet.FormattedAnonKeys, givenCommitments: string[]) => Promise<boolean>;
export declare const getSidsForSingleAsset: (senderOne: string, assetCode: string) => Promise<number[]>;
export declare const createTestBars: (givenSenderOne?: string | undefined, amount?: string, iterations?: number) => Promise<true>;
export declare const barToAbar: (givenSenderOne?: string | undefined, AnonKeys?: FindoraWallet.FormattedAnonKeys | undefined, givenSids?: number[] | undefined, givenBalanceChange?: string | undefined, givenAssetCode?: string | undefined, isBalanceCheck?: boolean) => Promise<string[]>;
export declare const abarToAbar: () => Promise<boolean>;
export declare const abarToAbarMulti: () => Promise<boolean>;
export declare const abarToAbarFraMultipleFraAtxoForFeeSendAmount: () => Promise<boolean>;
export declare const abarToAbarCustomMultipleFraAtxoForFeeSendAmount: () => Promise<boolean>;
export declare const abarToBar: () => Promise<boolean>;
export declare const abarToBarCustomSendAmount: () => Promise<boolean>;
export declare const abarToBarFraSendAmount: () => Promise<boolean>;
export declare const barToAbarAmount: () => Promise<boolean>;
