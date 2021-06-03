import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { getAddressByPublicKey, getAddressPublicAndKey, LightWalletKeypair, WalletKeypar } from '../keypair';
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

export interface TransferReciever {
  reciverWalletInfo: WalletKeypar | LightWalletKeypair;
  amount: number;
}

export const sendToMany = async (
  walletInfo: WalletKeypar,
  recieversList: TransferReciever[],
  assetCode: string,
  decimals: number,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<string> => {
  const ledger = await getLedger();

  const recieversInfo: Fee.ReciverInfo[] = [];

  recieversList.forEach(reciver => {
    const { reciverWalletInfo: toWalletInfo, amount: numbers } = reciver;
    const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
    const utxoNumbers = BigInt(toWei(numbers, decimals).toString());

    const recieverInfoItem = {
      toPublickey,
      utxoNumbers,
    };

    recieversInfo.push(recieverInfoItem);
  });

  const transferOperationBuilder = await Fee.buildTransferOperation(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (error) {
    throw new Error(`Could not create transfer operation, Error: "${error.messaage}"`);
  }

  const transferOperationBuilderFee = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferOperationFee;

  try {
    receivedTransferOperationFee = transferOperationBuilderFee
      .create()
      .sign(walletInfo.keypair)
      .transaction();
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

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
  } catch (err) {
    throw new Error(`Could not add transfer operation, Error: "${err.messaage}"`);
  }

  const submitData = transactionBuilder.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    throw new Error(`Error Could not define asset: "${err.message}"`);
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

export const sendToAddress = async (
  walletInfo: WalletKeypar,
  address: string,
  numbers: number,
  assetCode: string,
  decimals: number,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<string> => {
  const toWalletInfoLight = await getAddressPublicAndKey(address);

  const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount: numbers }];

  return sendToMany(walletInfo, recieversInfo, assetCode, decimals, assetBlindRules);
};

export const sendToPublicKey = async (
  walletInfo: WalletKeypar,
  publicKey: string,
  numbers: number,
  assetCode: string,
  decimals: number,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<string> => {
  const address = await getAddressByPublicKey(publicKey);

  return sendToAddress(walletInfo, address, numbers, assetCode, decimals, assetBlindRules);
};
