// import JSONbig from 'json-bigint';

import { DEFAULT_ASSET_RULES } from '../../config/asset';
import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AssetRules as LedgerAssetRules, TransactionBuilder, XfrKeyPair } from '../../services/ledger/types';
import { getAddressByPublicKey, WalletKeypar } from '../keypair';
import * as Network from '../network';

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

export const getFraAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.fra_get_asset_code();
  return assetCode;
};

export const getAssetCode = async (val: number[]): Promise<string> => {
  const ledger = await getLedger();

  const decryptedAsetType = ledger.asset_type_from_jsvalue(val);
  return decryptedAsetType;
};

export const getRandomAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.random_asset_type();
  return assetCode;
};

const getDefaultAssetRules = async (): Promise<LedgerAssetRules> => {
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

const getAssetRules = async (newAssetRules?: AssetRules): Promise<LedgerAssetRules> => {
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

const getDefineAssetTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  assetName: string,
  assetRules: LedgerAssetRules,
  assetMemo = 'memo',
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const { response: stateCommitment, error } = await Network.getStateCommitment();

  if (error) {
    throw new Error(error.message);
  }

  if (!stateCommitment) {
    throw new Error('could not receive response from state commitement call');
  }

  const [_, height] = stateCommitment;
  const blockCount = BigInt(height);

  const definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_operation_create_asset(
    walletKeypair,
    assetMemo,
    assetName,
    assetRules,
  );

  return definitionTransaction;
};

const getIssueAssetTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  assetName: string,
  amountToIssue: number,
  assetBlindRules: AssetBlindRules,
  assetDecimals: number,
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const { response: stateCommitment, error } = await Network.getStateCommitment();

  if (error) {
    throw new Error(error.message);
  }

  if (!stateCommitment) {
    throw new Error('could not receive response from state commitement call');
  }

  const [_, height] = stateCommitment;
  const blockCount = BigInt(height);

  const utxoNumbers = BigInt(toWei(amountToIssue, assetDecimals).toString());

  const blindIsAmount = assetBlindRules?.isAmountBlind;

  const zeiParams = ledger.PublicParams.new();

  const definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_basic_issue_asset(
    walletKeypair,
    assetName,
    BigInt(blockCount),
    utxoNumbers,
    !!blindIsAmount,
    zeiParams,
  );

  return definitionTransaction;
};

export const defineAsset = async (
  walletInfo: WalletKeypar,
  assetName: string,
  assetMemo?: string,
  newAssetRules?: AssetRules,
): Promise<string> => {
  const assetRules = await getAssetRules(newAssetRules);

  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
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

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Error Could not define asset: "${e.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit define asset transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Could not define asset - submit handle is missing`);
  }

  return handle;
};

export const issueAsset = async (
  walletInfo: WalletKeypar,
  assetName: string,
  amountToIssue: number,
  assetBlindRules: AssetBlindRules,
  assetDecimals: number,
): Promise<string> => {
  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getIssueAssetTransactionBuilder(
      walletInfo.keypair,
      assetName,
      amountToIssue,
      assetBlindRules,
      assetDecimals,
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

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not issue asset: "${e.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit issue asset transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Could not issue asset - submit handle is missing`);
  }

  return handle;
};

export const getAssetDetails = async (assetCode: string): Promise<FindoraWallet.IAsset> => {
  let result;

  try {
    result = await Network.getAssetToken(assetCode);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Error Could not define asset: "${e.message}"`);
  }

  const { response: assetResult, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit define asset transaction: "${submitError.message}"`);
  }

  if (!assetResult) {
    throw new Error(`Could not issue asset - submit handle is missing`);
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
