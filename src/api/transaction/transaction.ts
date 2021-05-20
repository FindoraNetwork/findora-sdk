import { BigNumberValue, create as createBigNumber, fromWei, toWei } from '../../services/bigNumber';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { addUtxo, AddUtxoItem } from '../../services/utxoHelper';
import * as UtxoHelper from '../../services/utxoHelper';
import * as Fee from '../../services/fee';
import { createKeypair, WalletKeypar } from '../keypair';
import * as Network from '../network';
import * as AssetApi from '../sdkAsset';

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

export const sendToAddress = async (
  walletInfo: WalletKeypar,
  toWalletInfo: WalletKeypar,
  numbers: number,
  assetBlindRules: AssetApi.AssetBlindRules = { isAmountBlind: false, isTypeBlind: false },
): Promise<string> => {
  const ledger = await getLedger();

  const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);

  const transferOperationBuilder = await Fee.buildTransferOperation(
    walletInfo,
    numbers,
    toPublickey,
    assetBlindRules,
  );

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (error) {
    throw new Error(`Could not create transfer operation, Error: "${error.messaage}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await getTransactionBuilder();
  } catch (error) {
    throw new Error(`Could not get "defineTransactionBuilder", Error: "${error.messaage}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    throw new Error(`Could not add transfer operation, Error: "${err.messaage}"`);
  }

  const submitData = transactionBuilder.transaction();

  console.log('submitData', submitData);
  return submitData;
  // let result;

  // try {
  //   result = await Network.submitTransaction(submitData);
  // } catch (err) {
  //   throw new Error(`Error Could not define asset: "${err.message}"`);
  // }

  // const { response: handle, error: submitError } = result;

  // if (submitError) {
  //   throw new Error(`Could not submit issue asset transaction: "${submitError.message}"`);
  // }

  // if (!handle) {
  //   throw new Error(`Could not issue asset - submit handle is missing`);
  // }

  // return handle;
};
