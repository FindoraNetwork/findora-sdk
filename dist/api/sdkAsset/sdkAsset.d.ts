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
/**
 * Returns the pre-defined FRA asset code
 *
 * @remarks
 * FRA asset code can not be re-defined, as well as it can not be used in the `DefineAset`  or `IssueAsset` operations.
 *
 * This is the main asset code, which is used when user needs to create a transaction, or calculate the fee and so on.
 *
 * @example
 *
 * ```ts *
 * const fraAssetCode = await getFraAssetCode();
 * ```
 * @returns - Findora Asset code
 */
export declare const getFraAssetCode: () => Promise<string>;
export declare const getMinimalFee: () => Promise<BigInt>;
export declare const getBarToAbarMinimalFee: () => Promise<BigInt>;
export declare const getFraPublicKey: () => Promise<XfrPublicKey>;
export declare const getAssetCode: (val: number[]) => Promise<string>;
/**
 * Returns a random asset code
 *
 * @remarks
 * Using {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } it generates and returns a random custom asset code
 *
 * @example
 *
 * ```ts *
 * const assetCode = await getRandomAssetCode();
 * ```
 * @returns - Asset code
 */
export declare const getRandomAssetCode: () => Promise<string>;
export declare const getDerivedAssetCode: (assetCode: string) => Promise<string>;
export declare const getAssetCodeToSend: (assetCode: string) => Promise<string>;
export declare const getDefaultAssetRules: () => Promise<LedgerAssetRules>;
export declare const getAssetRules: (newAssetRules?: AssetRules | undefined) => Promise<LedgerAssetRules>;
export declare const getDefineAssetTransactionBuilder: (walletKeypair: XfrKeyPair, assetName: string, assetRules: LedgerAssetRules, assetMemo?: string) => Promise<TransactionBuilder>;
export declare const getIssueAssetTransactionBuilder: (walletKeypair: XfrKeyPair, assetName: string, amountToIssue: string, assetBlindRules: AssetBlindRules, assetDecimals: number) => Promise<TransactionBuilder>;
/**
 * Defines a custom asset
 *
 * @remarks
 * An asset definition operation registers an asset with the Findora ledger. An asset is a digital resource that can be issued and transferred.
 *
 * An asset has an issuer and a unique code. The ```DefineAsset``` operation must provide an unused token code. The transaction containing the ```DefineAsset```
 * operation will fail if there is already another asset on the ledger with the same code.
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 * // First, we create a transaction builder
 * const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
 *
 * // Then, we submit a transaction
 * const handle = await Transaction.submitTransaction(assetBuilder);
 * ```
 * @param newAssetRules - A set of _rules_ (options) for the new asset
 *
 * @throws `Could not create transfer operation`
 * @throws `Could not get "defineTransactionBuilder"`
 * @throws `Could not add transfer operation`
 *
 * @returns An instance of **TransactionBuilder** from {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger }
 */
export declare const defineAsset: (walletInfo: WalletKeypar, assetName: string, assetMemo?: string | undefined, newAssetRules?: AssetRules | undefined) => Promise<TransactionBuilder>;
/**
 * Issue some anount of a custom asset
 *
 * @remarks
 * Asset issuers can use the ```IssueAsset``` operation to mint units of an asset
 * that they have created. Concretely, the ```IssueAsset``` operation creates asset records that represent ownership by a public key
 * of a certain amount of an asset. These asset records are stored in a structure called a transaction output (TXO).
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 * // Define the new asset parameters (rules)
 * const assetBlindRules = { isAmountBlind: false };
 *
 * // First, we create a transaction builder
 * const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, amountToIssue, assetBlindRules);
 *
 * // Then, we submit a transaction
 * const handle = await Transaction.submitTransaction(assetBuilder);
 * ```
 * @param assetDecimals - This parameter can define how many numbers after the comma would this asset have
 *
 * @throws `Could not create transfer operation`
 * @throws `Could not get "issueAssetTransactionBuilder"`
 * @throws `Could not add transfer operation`
 *
 * @returns An instance of **TransactionBuilder** from {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger }
 */
export declare const issueAsset: (walletInfo: WalletKeypar, assetName: string, amountToIssue: string, assetBlindRules: AssetBlindRules, assetDecimals?: number | undefined) => Promise<TransactionBuilder>;
export declare const getAssetDetails: (assetCode: string) => Promise<FindoraWallet.IAsset>;
