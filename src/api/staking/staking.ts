import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder, XfrKeyPair } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as Network from '../network';

export const getFraAssetCode = async (): Promise<string> => {
  const ledger = await getLedger();
  const assetCode = ledger.fra_get_asset_code();
  return assetCode;
};
// merge with same in transactions
export const getTransactionBuilder = async (): Promise<TransactionBuilder> => {
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

  const transactionBuilder = ledger.TransactionBuilder.new(BigInt(blockCount));

  return transactionBuilder;
};

export const unDelegate = async (walletInfo: WalletKeypar): Promise<string> => {
  const transferOperationBuilderFee = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperationFee;

  try {
    receivedTransferOperationFee = transferOperationBuilderFee
      .create()
      .sign(walletInfo.keypair)
      .transaction();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get "transactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add undelegate operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not unDelegate : "${e.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit unDelegate transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Could not unDelegate - submit handle is missing`);
  }

  return handle;
};

const getClaimTransactionBuilder = async (
  walletKeypair: XfrKeyPair,
  rewords: BigInt,
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

  const definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_operation_claim_custom(
    walletKeypair,
    rewords,
  );

  return definitionTransaction;
};

export const claim = async (walletInfo: WalletKeypar, amount: BigInt): Promise<string> => {
  const transferOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getClaimTransactionBuilder(walletInfo.keypair, amount);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get "claimTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not claim : "${e.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit claim transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Could not claim - submit handle is missing`);
  }

  return handle;
};
