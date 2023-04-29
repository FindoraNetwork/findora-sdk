import { DEFAULT_ASSET_RULES } from '../../config/asset';
import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import {
  AssetRules as LedgerAssetRules,
  TransactionBuilder,
  XfrKeyPair,
  XfrPublicKey,
} from '../../services/ledger/types';
import * as FindoraWallet from '../../types/findoraWallet';
import { getAddressByPublicKey, WalletKeypar } from '../keypair';
import * as Network from '../network';
import * as Builder from '../transaction/builder';

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
export const getFraAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.fra_get_asset_code();
  return assetCode;
};

export const getMinimalFee = async (): Promise<BigInt> => {
  const ledger = await getLedger();
  const fee = ledger.fra_get_minimal_fee();
  return fee;
};

export const getFraPublicKey = async (): Promise<XfrPublicKey> => {
  const ledger = await getLedger();
  const key = ledger.fra_get_dest_pubkey();
  return key;
};

export const getAssetCode = async (val: number[]): Promise<string> => {
  const ledger = await getLedger();

  const decryptedAsetType = ledger.asset_type_from_jsvalue(val);
  return decryptedAsetType;
};

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
export const getRandomAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.random_asset_type();
  return assetCode;
};

export const getDerivedAssetCode = async (assetCode: string): Promise<string> => {
  const ledger = await getLedger();
  const derivedAssetCode = ledger.hash_asset_code(assetCode);
  return derivedAssetCode;
};

export const getAssetCodeToSend = async (assetCode: string): Promise<string> => {
  const ledger = await getLedger();

  const fraAssetCode = ledger.fra_get_asset_code();

  const isFraTransfer = assetCode === fraAssetCode;

  if (isFraTransfer) {
    return assetCode;
  }

  const derivedAssetCode = await getDerivedAssetCode(assetCode);
  return derivedAssetCode;
};

export const getDefaultAssetRules = async (): Promise<LedgerAssetRules> => {
  const ledger = await getLedger();

  const defaultTransferable = DEFAULT_ASSET_RULES.transferable;
  const defaultUpdatable = DEFAULT_ASSET_RULES.updatable;
  const defaultDecimals = DEFAULT_ASSET_RULES.decimals;

  const assetRules = ledger.AssetRules.new()
    .set_transferable(defaultTransferable)
    .set_updatable(defaultUpdatable)
    .set_decimals(defaultDecimals);

  return assetRules;
};

export const getAssetRules = async (newAssetRules?: AssetRules): Promise<LedgerAssetRules> => {
  if (!newAssetRules) {
    const defaultAssetRules = await getDefaultAssetRules();

    return defaultAssetRules;
  }

  const ledger = await getLedger();

  const { transferable, updatable, decimals, traceable, maxNumbers } = newAssetRules;

  let assetRules = ledger.AssetRules.new()
    .set_transferable(transferable)
    .set_updatable(updatable)
    .set_decimals(decimals);

  if (maxNumbers && BigInt(maxNumbers) > BigInt(0)) {
    assetRules = assetRules.set_max_units(BigInt(maxNumbers));
  }

  if (traceable) {
    const trackingKey = ledger.AssetTracerKeyPair.new();
    const tracingPolicy = ledger.TracingPolicy.new_with_tracing(trackingKey);

    assetRules = assetRules.add_tracing_policy(tracingPolicy);
  }

  return assetRules;
};

export const getDefineAssetTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  assetName: string,
  assetRules: LedgerAssetRules,
  assetMemo = 'memo',
): Promise<TransactionBuilder> => {
  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  let definitionTransaction = transactionBuilder.add_operation_create_asset(
    walletKeypair,
    assetMemo,
    assetName,
    assetRules,
  );

  try {
    definitionTransaction = definitionTransaction.build();
    definitionTransaction = definitionTransaction.sign(walletKeypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

  return definitionTransaction;
};

export const getIssueAssetTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  assetName: string,
  amountToIssue: string,
  assetBlindRules: AssetBlindRules,
  assetDecimals: number,
): Promise<TransactionBuilder> => {
  const blockCount = await Builder.getBlockHeight();

  const utxoNumbers = BigInt(toWei(amountToIssue, assetDecimals).toString());

  const blindIsAmount = assetBlindRules?.isAmountBlind;

  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  const definitionTransaction = transactionBuilder.add_basic_issue_asset(
    walletKeypair,
    assetName,
    blockCount,
    utxoNumbers,
    !!blindIsAmount,
  );

  return definitionTransaction;
};

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
export const defineAsset = async (
  walletInfo: WalletKeypar,
  assetName: string,
  assetMemo?: string,
  newAssetRules?: AssetRules,
): Promise<TransactionBuilder> => {
  const assetRules = await getAssetRules(newAssetRules);

  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not create transfer operation!, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getDefineAssetTransactionBuilder(
      walletInfo.keypair,
      assetName,
      assetRules,
      assetMemo,
    );
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not get "defineTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

  return transactionBuilder;
};

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
export const issueAsset = async (
  walletInfo: WalletKeypar,
  assetName: string,
  amountToIssue: string,
  assetBlindRules: AssetBlindRules,
  assetDecimals?: number,
): Promise<TransactionBuilder> => {
  const asset = await getAssetDetails(assetName);
  const decimals = assetDecimals || asset.assetRules.decimals;

  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not create transfer operation!!, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getIssueAssetTransactionBuilder(
      walletInfo.keypair,
      assetName,
      amountToIssue,
      assetBlindRules,
      decimals,
    );
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not get "issueAssetTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

  return transactionBuilder;
};

export const getAssetDetails = async (assetCode: string): Promise<FindoraWallet.IAsset> => {
  let result;

  try {
    result = await Network.getAssetToken(assetCode);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not get asset token: "${e.message}"`);
  }

  const { response: assetResult, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not get asset details: "${submitError.message}"`);
  }

  if (!assetResult) {
    throw new Error(`Could not get asset details - asset result is missing`);
  }

  const asset = assetResult.properties;
  const issuerAddress = await getAddressByPublicKey(asset.issuer.key);

  const assetDetails = {
    code: assetCode,
    issuer: asset.issuer.key,
    address: issuerAddress,
    memo: asset.memo,
    assetRules: { ...DEFAULT_ASSET_RULES, ...asset?.asset_rules },
    numbers: BigInt(0),
    name: '',
  };

  return assetDetails;
};
