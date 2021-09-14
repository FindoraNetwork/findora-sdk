import { BigNumberValue, create as createBigNumber, fromWei } from '../../services/bigNumber';
import { addUtxo, AddUtxoItem } from '../../services/utxoHelper';
import { createKeypair, getAddressPublicAndKey, WalletKeypar } from '../keypair';
import * as Network from '../network';
import { IssuedRecord, TxOutput } from '../network/types';
import { getAssetCode, getFraAssetCode } from '../sdkAsset';

export interface ProcessedIssuedRecord extends TxOutput {
  code: string;
  ownerMemo?: number | null;
}

export const getAssetBalance = async (
  walletKeypair: WalletKeypar,
  assetCode: string,
  sids: number[],
): Promise<BigNumberValue> => {
  let utxoDataList;

  try {
    utxoDataList = await addUtxo(walletKeypair, sids);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not get list of addUtxo, Details: "${e.message}"`);
  }

  if (!utxoDataList.length) {
    return createBigNumber(0);
  }

  const filteredUtxoList = utxoDataList.filter(row => row?.body?.asset_type === assetCode);

  if (!filteredUtxoList.length) {
    return createBigNumber(0);
  }

  const currentBalance = filteredUtxoList.reduce((acc: number, currentUtxoItem: AddUtxoItem) => {
    return acc + Number(currentUtxoItem.body?.amount || 0);
  }, 0);

  return createBigNumber(currentBalance);
};

/**
 * @todo Add unit test
 * @param walletKeypair
 * @param assetCode
 * @returns
 */
export const getBalanceInWei = async (
  walletKeypair: WalletKeypar,
  assetCode?: string,
): Promise<BigNumberValue> => {
  const sidsResult = await Network.getOwnedSids(walletKeypair.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched!');
  }

  const fraAssetCode = await getFraAssetCode();

  const assetCodeToUse = assetCode || fraAssetCode;

  try {
    const balanceInWei = await getAssetBalance(walletKeypair, assetCodeToUse, sids);

    // const balance = fromWei(balanceInWei, 6).toFormat(6);
    return balanceInWei;
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not fetch balance in wei for "${assetCodeToUse}". Error - ${e.message}`);
  }
};

/**
 * Get the balance of the specific asset for the given user
 *
 * @remarks
 * Using this function user can retrieve the balance for the specific asset code, which could be either custom asset or an FRA asset
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  const balance = await Account.getBalance(walletInfo, customAssetCode);
 * ```
 *
 * @throws `No sids were fetched`
 * @throws `Could not fetch balance`
 *
 * @returns Result of transaction submission to the network
 */
export const getBalance = async (walletKeypair: WalletKeypar, assetCode?: string): Promise<string> => {
  // const sidsResult = await Network.getOwnedSids(walletKeypair.publickey);

  // const { response: sids } = sidsResult;

  // if (!sids) {
  //   throw new Error('No sids were fetched!');
  // }

  const fraAssetCode = await getFraAssetCode();

  const assetCodeToUse = assetCode || fraAssetCode;

  try {
    // const balanceInWei = await getAssetBalance(walletKeypair, assetCodeToUse, sids);
    const balanceInWei = await getBalanceInWei(walletKeypair, assetCodeToUse);

    const balance = fromWei(balanceInWei, 6).toFormat(6);
    return balance;
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not fetch balance for "${assetCodeToUse}". Error - ${e.message}`);
  }
};

export const create = async (password: string): Promise<WalletKeypar> => {
  let walletKeyPair;

  try {
    walletKeyPair = await createKeypair(password);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not create a new account. "${e.message}"`);
  }
  return walletKeyPair;
};

export const processIssuedRecordItem = async (issuedRecord: IssuedRecord): Promise<ProcessedIssuedRecord> => {
  const [txRecord, ownerMemo] = issuedRecord;
  const assetCode = await getAssetCode(txRecord.record.asset_type.NonConfidential!);
  return {
    ...txRecord,
    code: assetCode,
    ownerMemo,
  };
};

export const processIssuedRecordList = async (
  issuedRecords: IssuedRecord[],
): Promise<ProcessedIssuedRecord[]> => {
  return Promise.all(issuedRecords.map(issuedRecord => processIssuedRecordItem(issuedRecord)));
};

export const getCreatedAssets = async (address: string): Promise<ProcessedIssuedRecord[]> => {
  const { publickey } = await getAddressPublicAndKey(address);

  const result = await Network.getIssuedRecords(publickey);

  const { response: recordsResponse } = result;

  if (!recordsResponse) {
    throw new Error('No issued records were fetched!');
  }

  const processedIssuedRecordsList = await processIssuedRecordList(recordsResponse);

  return processedIssuedRecordsList;
};

export const getRelatedSids = async (address: string): Promise<number[]> => {
  const result = await Network.getRelatedSids(address);

  const { response: relatedSids } = result;

  if (!relatedSids) {
    throw new Error('No related sids were fetched!');
  }

  return relatedSids;
};
