import { Keypair } from '../api';
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDerivedAssetCode: (asset1Code: string) => Promise<string>;
export declare const createNewKeypair: () => Promise<Keypair.WalletKeypar>;
/**
 * Define and Issue a custom asset
 */
export declare const defineIssueCustomAsset: (senderOne: string, assetCode: string, derivedAssetCode: string) => Promise<void>;
/**
 * Create FRA Test BARs for Single Asset Integration Test
 */
export declare const createTestBars: (senderOne: string, amount?: string, iterations?: number) => Promise<void>;
/**
 * Create FRA Test BARs and Issue Custom Asset for Multi Asset Integration Test
 */
export declare const createTestBarsMulti: (senderOne: string, asset1Code: string, derivedAsset1Code: string) => Promise<boolean>;
export declare const defineCustomAsset: (senderOne: string, assetCode: string) => Promise<void>;
export declare const issueCustomAsset: (senderOne: string, assetCode: string, derivedAssetCode: string, amount: string) => Promise<void>;
export declare const createTestBarsMultiNew: (senderOne: string, asset1Code: string, derivedAsset1Code: string) => Promise<void>;
/**
 * Generate and return new set of Anon Keys
 */
export declare const getAnonKeys: () => Promise<FindoraWallet.FormattedAnonKeys>;
/**
 * Given a commitment, check if nullifier is spent
 */
export declare const validateSpent: (AnonKeys: FindoraWallet.FormattedAnonKeys, givenCommitment: string) => Promise<boolean>;
/**
 * BAR to ABAR conversion
 */
export declare const barToAbar: (senderOne: string, AnonKeys: FindoraWallet.FormattedAnonKeys, isBalanceCheck: boolean, givenSid?: number) => Promise<string | boolean>;
/**
 * Single Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
export declare const abarToAbar: (senderOne: string, AnonKeys1: FindoraWallet.FormattedAnonKeys, AnonKeys2: FindoraWallet.FormattedAnonKeys) => Promise<boolean>;
/**
 * ABAR To BAR conversion Integration Test for FRA
 */
export declare const abarToBar: (senderOne: string, AnonKeys: FindoraWallet.FormattedAnonKeys) => Promise<string | true>;
/**
 * Get available SIDs for a given custom asset and FRA
 */
export declare const getSidsForAsset: (senderOne: string, assetCode: string) => Promise<number[][]>;
/**
 * Multi/Custom Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
export declare const abarToAbarMulti: (senderOne: string, AnonKeys1: FindoraWallet.FormattedAnonKeys, AnonKeys2: FindoraWallet.FormattedAnonKeys, asset1Code: string) => Promise<boolean>;
export declare const getSidsForSingleAsset: (senderOne: string, assetCode: string) => Promise<number[]>;
export declare const abarToBarCustomSendAmount: (senderOne: string, AnonKeys1: FindoraWallet.FormattedAnonKeys, asset1Code: string) => Promise<boolean>;
