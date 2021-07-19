import * as Transaction from '../../api/transaction';
import * as Fee from '../../services/fee';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';

export const unDelegate = async (
  walletInfo: WalletKeypar,
  amount: bigint,
  validator: string,
  isFullUnstake: false,
): Promise<TransactionBuilder> => {
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
    transactionBuilder = await Transaction.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;
    throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    if (isFullUnstake) {
      transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
    } else {
      transactionBuilder = transactionBuilder.add_operation_undelegate_partially(
        walletInfo.keypair,
        amount,
        validator,
      );
    }
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not staking unDelegate operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferFeeOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not add transfer to unDelegate operation, Error: "${e.message}"`);
  }

  return transactionBuilder;
};

export const delegate = async (
  walletInfo: WalletKeypar,
  address: string,
  numbers: number,
  assetCode: string,
  validator: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  let transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    address,
    numbers,
    assetCode,
    assetBlindRules,
  );

  transactionBuilder = transactionBuilder.add_operation_delegate(walletInfo.keypair, validator);

  return transactionBuilder;
};

export const claim = async (walletInfo: WalletKeypar, amount: bigint): Promise<TransactionBuilder> => {
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
    transactionBuilder = await Transaction.getTransactionBuilder();
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

  return transactionBuilder;
};
