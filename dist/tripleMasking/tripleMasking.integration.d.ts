import { Keypair } from '../api';
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDerivedAssetCode: (asset1Code: string) => Promise<string>;
export declare const createNewKeypair: () => Promise<Keypair.WalletKeypar>;
export declare const getAnonKeys: () => Promise<Keypair.WalletKeypar>;
export declare const defineCustomAsset: (senderOne: string, assetCode: string) => Promise<void>;
export declare const issueCustomAsset: (senderOne: string, assetCode: string, derivedAssetCode: string, amount: string) => Promise<void>;
export declare const validateSpent: (AnonKeys: Keypair.WalletKeypar, givenCommitments: string[]) => Promise<boolean>;
export declare const getSidsForSingleAsset: (senderOne: string, assetCode: string) => Promise<number[]>;
export declare const createTestBars: (givenSenderOne?: string, amount?: string, iterations?: number) => Promise<true>;
export declare const barToAbar: (givenSenderOne?: string, AnonKeys?: Keypair.WalletKeypar, givenSids?: number[], givenBalanceChange?: string, givenAssetCode?: string, isBalanceCheck?: boolean) => Promise<string[]>;
export declare const barToAbarAmount: (givenAnonKeysReceiver?: Keypair.WalletKeypar, amountToSend?: string) => Promise<boolean>;
export declare const abarToAbar: (givenAnonKeysReceiver?: Keypair.WalletKeypar) => Promise<boolean>;
export declare const abarToAbarMulti: (givenAnonKeysReceiver?: Keypair.WalletKeypar) => Promise<boolean>;
export declare const abarToAbarFraMultipleFraAtxoForFeeSendAmount: (givenAnonKeysReceiver?: Keypair.WalletKeypar) => Promise<boolean>;
export declare const abarToAbarCustomMultipleFraAtxoForFeeSendAmount: (givenAnonKeysReceiver?: Keypair.WalletKeypar) => Promise<boolean>;
