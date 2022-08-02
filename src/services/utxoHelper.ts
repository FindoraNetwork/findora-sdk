import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { LedgerUtxo, OwnedMemoResponse, UtxoResponse } from '../api/network/types';
import { CACHE_ENTRIES } from '../config/cache';
import Sdk from '../Sdk';
import Cache from './cacheStore/factory';
import { CacheItem } from './cacheStore/types';
import { getLedger } from './ledger/ledgerWrapper';
import {
  ClientAssetRecord as LedgerClientAssetRecord,
  OwnerMemo as LedgerOwnerMemo,
  TxoRef as LedgerTxoRef,
} from './ledger/types';

export interface LedgerUtxoItem {
  sid: number;
  utxo: LedgerUtxo;
  ownerMemo: LedgerOwnerMemo | undefined;
}

export interface AddUtxoItem extends LedgerUtxoItem {
  address: string;
  // body: any;
  body: {
    amount: number; //?
    asset_type: string; //?
  };
  memoData: OwnedMemoResponse | undefined;
}

export interface UtxoOutputItem extends LedgerUtxoItem {
  originAmount: BigInt;
  amount: BigInt;
  memoData: OwnedMemoResponse | undefined;
}

export interface UtxoInputParameter {
  txoRef: LedgerTxoRef;
  assetRecord: LedgerClientAssetRecord;
  ownerMemo: LedgerOwnerMemo | undefined;
  amount: BigInt;
  memoData: OwnedMemoResponse | undefined;
  sid: number;
}

export interface UtxoInputsInfo {
  inputParametersList: UtxoInputParameter[];
  inputAmount: BigInt;
}

const mergeUtxoList = (arr1: AddUtxoItem[], arr2: AddUtxoItem[]) => {
  const res = [];

  while (arr1.length && arr2.length) {
    const assetItem1 = arr1[0];
    const assetItem2 = arr2[0];
    const amount1 = BigInt(assetItem1.body.amount);
    const amount2 = BigInt(assetItem2.body.amount);

    if (amount1 < amount2) {
      res.push(arr1.splice(0, 1)[0]);
      continue;
    }
    res.push(arr2.splice(0, 1)[0]);
  }

  return res.concat(arr1, arr2);
};

const mergeSortUtxoList = (arr: AddUtxoItem[]): AddUtxoItem[] => {
  if (arr.length < 2) return arr;
  const middleIdx = Math.floor(arr.length / 2);

  let left = arr.splice(0, middleIdx);
  let right = arr.splice(0);

  return mergeUtxoList(mergeSortUtxoList(left), mergeSortUtxoList(right));
};

export const filterUtxoByCode = (code: string, utxoDataList: AddUtxoItem[]): AddUtxoItem[] => {
  return utxoDataList.filter(assetItem => assetItem?.body?.asset_type === code);
};

// is called only from getUtxoItem
export const decryptUtxoItem = async (
  sid: number,
  walletInfo: WalletKeypar,
  utxoData: UtxoResponse,
  memoData?: OwnedMemoResponse,
): Promise<AddUtxoItem> => {
  const ledger = await getLedger();

  let assetRecord;

  try {
    assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
  } catch (error) {
    const err: Error = error as Error;
    throw new Error(`Can not get client asset record. Details: "${err.message}"`);
  }

  let ownerMemo;

  try {
    ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : undefined;
  } catch (error) {
    const err: Error = error as Error;
    throw new Error(`Can not decode owner memo. Details: "${err.message}"`);
  }

  let decryptAssetData;

  try {
    decryptAssetData = await ledger.open_client_asset_record(
      assetRecord,
      ownerMemo?.clone(),
      walletInfo.keypair,
    );
  } catch (error) {
    const err: Error = error as Error;
    throw new Error(`Can not open client asset record to decode. Details: "${err.message}"`);
  }

  let decryptedAsetType;

  try {
    decryptedAsetType = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);
  } catch (error) {
    const err: Error = error as Error;
    throw new Error(`Can not decrypt asset type. Details: "${err.message}"`);
  }

  decryptAssetData.asset_type = decryptedAsetType;

  decryptAssetData.amount = BigInt(decryptAssetData.amount);

  const item = {
    address: walletInfo.address,
    sid,
    body: decryptAssetData || {},
    utxo: { ...utxoData.utxo },
    ownerMemo: ownerMemo?.clone(),
    memoData,
  };

  return item;
};

// is called only by addUtxo
export const getUtxoItem = async (
  sid: number,
  walletInfo: WalletKeypar,
  cachedItem?: AddUtxoItem,
): Promise<AddUtxoItem> => {
  if (cachedItem) {
    return cachedItem;
  }

  // console.log(`Fetching sid "${sid}"`);

  const utxoDataResult = await Network.getUtxo(sid);

  const { response: utxoData, error: utxoError } = utxoDataResult;

  if (utxoError || !utxoData) {
    throw new Error(`Could not fetch utxo data for sid "${sid}", Error - ${utxoError?.message}`);
  }

  const memoDataResult = await Network.getOwnerMemo(sid);

  // console.log('🚀 ~ file: utxoHelper.ts ~ line 1 ~ sid processing 1', sid);

  const { response: memoData, error: memoError } = memoDataResult;

  if (memoError) {
    throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
  }

  // console.log('🚀 ~ file: utxoHelper.ts ~ line 2 ~ sid processing 2', sid);

  // console.log('🚀 ~ file: utxoHelper.ts ~ line 155 ~ sid processing', sid);

  const item = await decryptUtxoItem(sid, walletInfo, utxoData, memoData);
  // console.log('🚀 ~ file: utxoHelper.ts ~ line 155 ~ sid processed', sid);
  // console.log('🚀 ~ file: utxoHelper.ts ~ line 178 ~ item', item);

  return item;
};

// creates a list of items with descrypted utxo information
export const addUtxo = async (walletInfo: WalletKeypar, addSids: number[]): Promise<AddUtxoItem[]> => {
  const utxoDataList = [];
  const cacheDataToSave: CacheItem = {};
  let utxoDataCache;

  const cacheEntryName = `${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}`;

  let fullPathToCacheEntry = `${Sdk.environment.cachePath}/${cacheEntryName}.json`;

  try {
    if (window && window?.document) {
      fullPathToCacheEntry = cacheEntryName;
    }
  } catch (_) {
    // console.log('window instance is not found. running is sdk mode. skipping');
  }

  try {
    utxoDataCache = await Cache.read(fullPathToCacheEntry, Sdk.environment.cacheProvider);
  } catch (error) {
    const err: Error = error as Error;
    throw new Error(`Error reading the cache, "${err.message}"`);
  }

  for (let i = 0; i < addSids.length; i++) {
    const sid = addSids[i];
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 207 ~ addUtxo ~ sid', sid);

    try {
      const item = await getUtxoItem(sid, walletInfo, utxoDataCache?.[`sid_${sid}`]);
      // console.log('🚀 ~ file: utxoHelper.ts ~ line 211 ~ addUtxo ~ item', item);
      utxoDataList.push(item);

      // console.log('sid processed!!', sid);
      cacheDataToSave[`sid_${item.sid}`] = item;
    } catch (error) {
      const err: Error = error as Error;
      console.log(`Could not process addUtxo for sid ${sid}, Details: "${err.message}"`);
      continue;
    }
  }

  // console.log('🚀 ~ file: utxoHelper.ts ~ line 229 ~ addUtxo ~ utxoDataList', utxoDataList);
  try {
    await Cache.write(fullPathToCacheEntry, cacheDataToSave, Sdk.environment.cacheProvider);
  } catch (error) {
    const err: Error = error as Error;
    console.log(`Could not write cache for utxoData, "${err.message}"`);
  }

  return utxoDataList;
};

// creates a list of utxo like object, which are suitable for the required send operation
// is only used in fee
/**
 * @depricated
 */
export const getSendUtxoLegacy = (
  code: string,
  amount: BigInt,
  utxoDataList: AddUtxoItem[],
): UtxoOutputItem[] => {
  let balance = amount;

  const result = [];

  for (let i = 0; i < utxoDataList.length; i++) {
    const assetItem = utxoDataList[i];

    if (assetItem.body.asset_type === code) {
      const _amount = BigInt(assetItem.body.amount);

      if (balance <= BigInt(0)) {
        break;
      } else if (BigInt(_amount) >= balance) {
        result.push({
          amount: balance,
          originAmount: _amount,
          sid: assetItem.sid,
          utxo: { ...assetItem.utxo },
          ownerMemo: assetItem.ownerMemo,
          memoData: assetItem.memoData,
        });
        break;
      } else {
        balance = BigInt(Number(balance) - Number(_amount));

        result.push({
          amount: _amount,
          originAmount: _amount,
          sid: assetItem.sid,
          utxo: { ...assetItem.utxo },
          ownerMemo: assetItem.ownerMemo,
          memoData: assetItem.memoData,
        });
      }
    }
  }

  return result;
};

export const getSendUtxo = (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]): UtxoOutputItem[] => {
  const result = [];

  const filteredUtxoList = filterUtxoByCode(code, utxoDataList);
  // console.log('🚀 ~ file: utxoHelper.ts ~ line 298 ~ filteredUtxoList', filteredUtxoList);
  const sortedUtxoList = mergeSortUtxoList(filteredUtxoList);
  // console.log('🚀 ~ file: utxoHelper.ts ~ line 299 ~ sortedUtxoList', sortedUtxoList);

  let sum = BigInt(0);

  for (const assetItem of sortedUtxoList) {
    // for (const assetItem of filteredUtxoList) {
    const _amount = BigInt(assetItem.body.amount);

    // if (assetItem.sid in [8, 11, 14]) {
    //   console.log('we got broken? sid');
    //   continue;
    // }

    // console.log(JSON.stringify(assetItem.utxo));
    sum = sum + _amount;
    const credit = BigInt(Number(sum) - Number(amount));
    const remainedDebt = _amount - credit;
    const amountToUse = credit > 0 ? remainedDebt : _amount;

    result.push({
      amount: amountToUse,
      originAmount: _amount,
      sid: assetItem.sid,
      utxo: { ...assetItem.utxo },
      ownerMemo: assetItem.ownerMemo,
      memoData: assetItem.memoData,
    });

    if (credit >= 0) {
      break;
    }
  }

  return result;
};

// creates a list of inputs, which would be used by transaction builder in a fee service
// used in fee.buildTransferOperation , fee.getFeeInputs
export const addUtxoInputs = async (utxoSids: UtxoOutputItem[]): Promise<UtxoInputsInfo> => {
  const ledger = await getLedger();

  let inputAmount = BigInt(0);

  const inputParametersList = [];

  for (let i = 0; i < utxoSids.length; i += 1) {
    const item = utxoSids[i];

    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));

    let assetRecord;

    try {
      assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
    } catch (error) {
      const err: Error = error as Error;
      throw new Error(`Can not get client asset record. Details: "${err.message}"`);
    }

    let txoRef;

    try {
      txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
    } catch (error) {
      const err: Error = error as Error;
      throw new Error(`Can not convert given sid id to a BigInt, "${item.sid}", Details - "${err.message}"`);
    }

    const inputParameters: UtxoInputParameter = {
      txoRef,
      assetRecord,
      ownerMemo: item?.ownerMemo,
      amount: item.amount,
      memoData: item.memoData,
      sid: item.sid,
    };

    inputParametersList.push(inputParameters);
  }

  const res = { inputParametersList, inputAmount };

  return res;
};
