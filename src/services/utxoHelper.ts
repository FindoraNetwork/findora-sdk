import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { LedgerUtxo, OwnedMemoResponse, UtxoResponse } from '../api/network/types';
import Cache from './cacheStore/factory';
import { FileCacheProvider as CacheProvider } from './cacheStore/providers';
import { CacheItem } from './cacheStore/types';
import { getLedger } from './ledger/ledgerWrapper';
import {
  ClientAssetRecord as LedgerClientAssetRecord,
  OwnerMemo as LedgerOwnerMemo,
  TxoRef as LedgerTxoRef,
} from './ledger/types';

interface LedgerUtxoItem {
  sid: number;
  utxo: LedgerUtxo;
  ownerMemo: LedgerOwnerMemo | undefined;
}

export interface AddUtxoItem extends LedgerUtxoItem {
  address: string;
  body: any;
}

interface UtxoOutputItem extends LedgerUtxoItem {
  originAmount: BigInt;
  amount: BigInt;
}

export interface UtxoInputParameter {
  txoRef: LedgerTxoRef;
  assetRecord: LedgerClientAssetRecord;
  ownerMemo: LedgerOwnerMemo | undefined;
  amount: BigInt;
}

export interface UtxoInputsInfo {
  inputParametersList: UtxoInputParameter[];
  inputAmount: BigInt;
}

const decryptUtxoItem = async (
  sid: number,
  walletInfo: WalletKeypar,
  utxoData: UtxoResponse,
  memoData?: OwnedMemoResponse,
): Promise<AddUtxoItem> => {
  const ledger = await getLedger();

  const assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);

  const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

  const decryptAssetData = await ledger.open_client_asset_record(
    assetRecord,
    ownerMemo?.clone(),
    walletInfo.keypair,
  );

  decryptAssetData.asset_type = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);

  decryptAssetData.amount = BigInt(decryptAssetData.amount);

  const item = {
    address: walletInfo.address,
    sid,
    body: decryptAssetData || {},
    utxo: { ...utxoData.utxo },
    ownerMemo: ownerMemo?.clone(),
  };

  return item;
};

const getUtxoItem = async (
  sid: number,
  walletInfo: WalletKeypar,
  cachedItem?: AddUtxoItem,
): Promise<AddUtxoItem> => {
  if (cachedItem) {
    return cachedItem;
  }

  console.log(`Fetching sid "${sid}"`);

  const utxoDataResult = await Network.getUtxo(sid);

  const { response: utxoData, error: utxoError } = utxoDataResult;

  if (utxoError || !utxoData) {
    throw new Error(`could not fetch utxo data for sid "${sid}", Error - ${utxoError?.message}`);
  }

  const memoDataResult = await Network.getOwnerMemo(sid);

  const { response: memoData, error: memoError } = memoDataResult;

  if (memoError) {
    throw new Error(`could not fetch utxo data for sid "${sid}", Error - ${memoError.message}`);
  }

  const item = await decryptUtxoItem(sid, walletInfo, utxoData, memoData);

  return item;
};

// creates a list of items with descrypted utxo information
export const addUtxo = async (walletInfo: WalletKeypar, addSids: number[]): Promise<AddUtxoItem[]> => {
  const utxoDataList = [];
  const cacheDataToSave: CacheItem = {};
  let utxoDataCache;

  try {
    utxoDataCache = await Cache.read('utxoDataCache', CacheProvider);
  } catch (error) {
    console.log('error reading the cache', error.message);
  }

  for (let i = 0; i < addSids.length; i++) {
    const sid = addSids[i];

    // console.log(`Processing sid "${sid}" (${i + 1} out of ${addSids.length})`);

    try {
      const item = await getUtxoItem(sid, walletInfo, utxoDataCache?.[`sid_${sid}`]);
      utxoDataList.push(item);
      cacheDataToSave[`sid_${item.sid}`] = item;
    } catch (error) {
      console.log(`could not process addUtxo for sid ${sid}, Details: "${error.message}"`);
      continue;
    }
  }

  try {
    await Cache.write('utxoDataCache', cacheDataToSave, CacheProvider);
  } catch (err) {
    console.log(`could not write cache for utxoData, "${err.message}"`);
  }

  return utxoDataList;
};

// creates a list of utxo like object, which are suitable for the required send operation
export const getSendUtxo = (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]): UtxoOutputItem[] => {
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
        });
      }
    }
  }

  return result;
};

// creates a list of inputs, which would be used by transaction builder in a fee service
export const addUtxoInputs = async (utxoSids: UtxoOutputItem[]): Promise<UtxoInputsInfo> => {
  const ledger = await getLedger();

  let inputAmount = BigInt(0);

  const inputParametersList = [];

  for (let i = 0; i < utxoSids.length; i += 1) {
    const item = utxoSids[i];

    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));

    const assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);

    const txoRef = ledger.TxoRef.absolute(BigInt(item.sid));

    const inputParameters: UtxoInputParameter = {
      txoRef,
      assetRecord,
      ownerMemo: item?.ownerMemo,
      amount: item.amount,
    };

    inputParametersList.push(inputParameters);
  }

  const res = { inputParametersList, inputAmount };

  return res;
};
