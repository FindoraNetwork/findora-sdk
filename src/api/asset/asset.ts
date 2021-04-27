import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AssetRules as LedgerAssetRules, TransactionBuilder, XfrKeyPair } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as Network from '../network';

interface AssetRules {
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

const getDefaultAssetRules = async (): Promise<LedgerAssetRules> => {
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

const getAssetRules = async (newAssetRules?: AssetRules): Promise<LedgerAssetRules> => {
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
