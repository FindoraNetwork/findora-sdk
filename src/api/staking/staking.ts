import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as Network from '../network';

const getTransactionBuilder = async (): Promise<TransactionBuilder> => {
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

  const stakingTransaction = ledger.TransactionBuilder.new(BigInt(blockCount));
  return stakingTransaction;
};

export const unDelegate = async (
  walletInfo: WalletKeypar,
  amount: bigint,
  validator: string,
): Promise<string> => {
  const transferFeeOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferFeeOperation;

  try {
    receivedTransferFeeOperation = transferFeeOperationBuilder
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
    throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder
      .add_operation_undelegate_partially(walletInfo.keypair, amount, validator)
      .add_transfer_operation(receivedTransferFeeOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not staking unDelegate operation, Error: "${e.message}"`);
  }

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not unDelegate submit transaction: "${e.message}"`);
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

export const claim = async (walletInfo: WalletKeypar, amount: bigint): Promise<string> => {
  const transferFeeOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferFeeOperation;

  try {
    receivedTransferFeeOperation = transferFeeOperationBuilder
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
    throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder
      .add_operation_claim_custom(walletInfo.keypair, amount)
      .add_transfer_operation(receivedTransferFeeOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not staking claim operation, Error: "${e.message}"`);
  }

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not claim submit transaction: "${e.message}"`);
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
