import { DEFAULT_ASSET_RULES } from '../../config/asset';
import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AssetRules as LedgerAssetRules, TransactionBuilder, XfrKeyPair } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as Network from '../network';

interface AssetRules {
  transferable: boolean;
  updatable: boolean;
  decimals: number;
  traceable?: boolean;
  maxNumbers?: number;
}

export const getFraAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.fra_get_asset_code();
  return assetCode;
};

export const getRandomAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.random_asset_type();
  return assetCode;
};

const getDefaultAssetRules = async (): Promise<LedgerAssetRules> => {
  const ledger = await getLedger();

  const defaultTransferable = DEFAULT_ASSET_RULES.DEFAULT_TRANSFERABLE;
  const defaultUpdatable = DEFAULT_ASSET_RULES.DEFAULT_UPDATABLE;
  const defaultDecimals = DEFAULT_ASSET_RULES.DEFAULT_DECIMALS;

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

  const decimals = DEFAULT_ASSET_RULES.DEFAULT_DECIMALS;

  const utxoNumbers = BigInt(toWei(amountToIssue, decimals).toString());

  const blindIsAmount = false;

  const zeiParams = ledger.PublicParams.new();

  const definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_basic_issue_asset(
    walletKeypair,
    assetName,
    BigInt(blockCount),
    utxoNumbers,
    blindIsAmount,
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

  const fraCode = await getFraAssetCode();

  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo, fraCode);

  const receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();

  let transactionBuilder = await getDefineAssetTransactionBuilder(
    walletInfo.keypair,
    assetName,
    assetRules,
    assetMemo,
  );

  transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);

  const submitData = transactionBuilder.transaction();

  const handle = await Network.submitTransaction(submitData);

  console.log('Transaction handle:', handle);

  return assetName;
};

export const issueAsset = async (
  walletInfo: WalletKeypar,
  assetName: string,
  amountToIssue: number,
): Promise<number> => {
  const fraCode = await getFraAssetCode();

  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo, fraCode);

  const receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();

  let transactionBuilder = await getIssueAssetTransactionBuilder(
    walletInfo.keypair,
    assetName,
    amountToIssue,
  );

  transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);

  const submitData = transactionBuilder.transaction();

  const handle = await Network.submitTransaction(submitData);

  console.log('Transaction handle:', handle);

  return amountToIssue;
};
