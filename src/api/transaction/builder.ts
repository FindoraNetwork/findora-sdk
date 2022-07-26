import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AnonTransferOperationBuilder, TransactionBuilder } from '../../services/ledger/types';
import * as Network from '../network';

export const getBlockHeight = async (): Promise<bigint> => {
  const { response: stateCommitment, error } = await Network.getStateCommitment();

  if (error) {
    throw new Error(error.message);
  }

  if (!stateCommitment) {
    throw new Error('Could not receive response from state commitement call');
  }

  const [_, height] = stateCommitment;
  const blockCount = BigInt(height);

  return blockCount;
};

export const getTransactionBuilder = async (): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const blockCount = await getBlockHeight();

  const transactionBuilder = ledger.TransactionBuilder.new(blockCount);

  return transactionBuilder;
};

export const getAnonTransferOperationBuilder = async (): Promise<AnonTransferOperationBuilder> => {
  const ledger = await getLedger();

  const blockCount = await getBlockHeight();

  const anonTransferOperationBuilder = ledger.AnonTransferOperationBuilder.new(blockCount);

  return anonTransferOperationBuilder;
};
