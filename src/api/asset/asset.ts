import { network } from '../../services';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AssetRules as LedgerAssetRules, TransactionBuilder, XfrKeyPair } from '../../services/ledger/types';
import { Fee } from '../core';
import * as ApiKeyPair from '../keypair';

export interface AssetRules {
  transferable: boolean;
  updatable: boolean;
  decimal: number;
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

export const getDefaultAssetRules = async (): Promise<LedgerAssetRules> => {
  const ledger = await getLedger();

  const defaultTransferable = true;
  const defaultUpdatable = true;
  const defaultDecimal = 6;

  const assetRules = ledger.AssetRules.new()
    .set_transferable(defaultTransferable)
    .set_updatable(defaultUpdatable)
    .set_decimals(defaultDecimal);

  return assetRules;
};

export const getAssetRules = async (newAssetRules?: AssetRules): Promise<LedgerAssetRules> => {
  if (!newAssetRules) {
    const defaultAssetRules = await getDefaultAssetRules();
    return defaultAssetRules;
  }

  const ledger = await getLedger();

  const { transferable, updatable, decimal } = newAssetRules;

  const assetRules = ledger.AssetRules.new()
    .set_transferable(transferable)
    .set_updatable(updatable)
    .set_decimals(decimal);

  return assetRules;
};

const getDefineAssetTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  assetName: string,
  assetRules: LedgerAssetRules,
  assetMemo = 'memo',
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const { response: stateCommitment, error } = await network.getStateCommitment();

  if (error) {
    throw new Error(error.message);
  }

  if (!stateCommitment) {
    throw new Error('could not receive response from state commitement call');
  }

  const [_, height] = stateCommitment;
  const blockCount = BigInt(height);

  // It is time to create a new transaction
  const definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_operation_create_asset(
    walletKeypair,
    assetMemo,
    assetName,
    assetRules,
  );

  return definitionTransaction;
  // // At this step we are using helper to calcualte a minimal required fee for the transaction
  // // and add that to the instance of the transfer operation
  // const receivedTransferOperation = await getTransferOperationWithFee(walletInfo);

  // // And this operation is now added to the transaction
  // definitionTransaction = definitionTransaction.add_transfer_operation(receivedTransferOperation);

  // // Preparing data that would be submitted to the network.
  // const submitData = definitionTransaction.transaction();
  // console.log('Transaction Data to submit: ', submitData);
};

export const defineAsset = async (
  walletInfo: ApiKeyPair.WalletKeypar,
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

  console.log('Transaction Data to submit: ', submitData);

  // Submitting the transaction, and as a response, we retrieve the transaction handle.
  const handle = await network.submitTransaction(submitData);
  console.log('Transaction handle:', handle);

  return assetName;
};
