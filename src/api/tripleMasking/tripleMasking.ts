import { CACHE_ENTRIES } from '../../config/cache';
import Sdk from '../../Sdk';
import Cache from '../../services/cacheStore/factory';
import { CacheItem } from '../../services/cacheStore/types';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import { addUtxo } from '../../services/utxoHelper';
import * as Keypair from '../keypair';
import * as Network from '../network';
import { getTransactionBuilder } from '../transaction';

export const genAnonKeys = async (): Promise<FindoraWallet.AnonKeysResponse<AnonKeys>> => {
  const ledger = await getLedger();

  try {
    const anonKeys = await ledger.gen_anon_keys();

    const axfrPublicKey = anonKeys.axfr_public_key;
    const axfrSecretKey = anonKeys.axfr_secret_key;
    const decKey = anonKeys.dec_key;
    const encKey = anonKeys.enc_key;

    const formattedAnonKeys = {
      axfrPublicKey,
      axfrSecretKey,
      decKey,
      encKey,
    };

    return {
      keysInstance: anonKeys,
      formatted: formattedAnonKeys,
    };
  } catch (err) {
    throw new Error(`could not get anon keys, "${err}" `);
  }
};

export const saveBarToAbarToCache = async (
  walletInfo: Keypair.WalletKeypar,
  sid: number,
  randomizers: string[],
  anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>,
): Promise<FindoraWallet.BarToAbarData> => {
  const cacheEntryName = `${CACHE_ENTRIES.BAR_TO_ABAR}_${walletInfo.address}`;
  const cacheDataToSave: CacheItem = {};

  let fullPathToCacheEntry = `${Sdk.environment.cachePath}/${cacheEntryName}.json`;

  try {
    if (window && window?.document) {
      fullPathToCacheEntry = cacheEntryName;
    }
  } catch (error) {
    console.log('for browser mode a default fullPathToCacheEntry was used');
  }

  let abarDataCache = {};

  try {
    abarDataCache = await Cache.read(fullPathToCacheEntry, Sdk.environment.cacheProvider);
  } catch (error) {
    console.log(`Error reading the abarDataCache for ${walletInfo.address}. Creating an empty object now`);
  }

  const barToAbarData = {
    anonKeysFormatted: anonKeys.formatted,
    randomizers,
  };

  cacheDataToSave[`sid_${sid}`] = barToAbarData;

  try {
    await Cache.write(
      fullPathToCacheEntry,
      { ...abarDataCache, ...cacheDataToSave },
      Sdk.environment.cacheProvider,
    );
  } catch (error) {
    const err: Error = error as Error;
    console.log(`Could not write cache for abarDataCache, "${err.message}"`);
  }

  return barToAbarData;
};

export const barToAbar = async (
  walletInfo: Keypair.WalletKeypar,
  sid: number,
  anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>,
): Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>> => {
  const ledger = await getLedger();
  let transactionBuilder = await getTransactionBuilder();

  let item;

  try {
    const utxoDataList = await addUtxo(walletInfo, [sid]);
    const [utxoItem] = utxoDataList;
    item = utxoItem;
  } catch (error) {
    throw new Error(`could not fetch utxo for sid ${sid}`);
  }

  const memoDataResult = await Network.getOwnerMemo(sid);

  const { response: myMemoData, error: memoError } = memoDataResult;

  if (memoError) {
    throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
  }

  let ownerMemo;
  let assetRecord;

  try {
    ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;

    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
  } catch (error) {
    throw new Error(
      `Could not get decode memo data or get assetRecord", Error - ${(error as Error).message}`,
    );
  }

  let axfrPublicKey;
  let encKey;

  try {
    axfrPublicKey = await Keypair.getAXfrPublicKeyByBase64(anonKeys.formatted.axfrPublicKey);

    encKey = await Keypair.getXPublicKeyByBase64(anonKeys.formatted.encKey);
  } catch (error) {
    throw new Error(`Could not convert AXfrPublicKey", Error - ${(error as Error).message}`);
  }

  try {
    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(
      walletInfo.keypair,
      axfrPublicKey,
      BigInt(sid),
      assetRecord,
      ownerMemo?.clone(),
      encKey,
    );
  } catch (error) {
    throw new Error(`Could not add bar to abar operation", Error - ${(error as Error).message}`);
  }

  let randomizers: { randomizers: string[] };

  try {
    randomizers = transactionBuilder?.get_randomizers();
  } catch (err) {
    throw new Error(`could not get a list of randomizers strings "${(err as Error).message}" `);
  }

  if (!randomizers?.randomizers?.length) {
    throw new Error(`list of randomizers strings is empty `);
  }

  try {
    anonKeys.keysInstance.free();
  } catch (error) {
    throw new Error(`could not get release the anonymous keys instance  "${(error as Error).message}" `);
  }

  let barToAbarData: FindoraWallet.BarToAbarData;

  try {
    barToAbarData = await saveBarToAbarToCache(walletInfo, sid, randomizers.randomizers, anonKeys);
  } catch (error) {
    throw new Error(`Could not save cache for bar to abar. Details: ${(error as Error).message}`);
  }

  return { transactionBuilder, barToAbarData, sid: `${sid}` };
};

export const getOwnedAbars = async (formattedAxfrPublicKey: string, givenRandomizer: string) => {
  const ledger = await getLedger();

  const axfrPublicKey = await Keypair.getAXfrPublicKeyByBase64(formattedAxfrPublicKey);
  const randomizedPubKey = ledger.randomize_axfr_pubkey(axfrPublicKey, givenRandomizer);

  console.log('randomizedPubKey', randomizedPubKey);

  const { response: ownedAbarsResponse, error } = await Network.getOwnedAbars(randomizedPubKey);

  if (error) {
    throw new Error(error.message);
  }

  if (!ownedAbarsResponse) {
    throw new Error('Could not receive response from get ownedAbars call');
  }

  console.log(
    '🚀 ~ file: tripleMasking.ts ~ line 196 ~ getOwnedAbars ~ ownedAbarsResponse',
    ownedAbarsResponse,
  );

  const result = ownedAbarsResponse.map(ownedAbarItem => {
    const [atxoSid, ownedAbar] = ownedAbarItem;

    return {
      atxoSid,
      ownedAbar: { ...ownedAbar },
    };
  });

  // const [firstOwnedAbarItem] = ownedAbarsResponse;

  // const [atxoSid, ownedAbar] = firstOwnedAbarItem;
  // console.log('🚀 ~ file: tripleMasking.ts ~ line 203 ~ getOwnedAbars ~ atxoSid', atxoSid);
  // console.log('🚀 ~ file: tripleMasking.ts ~ line 203 ~ getOwnedAbars ~ ownedAbar', ownedAbar);

  return result;
  // return {
  //   AXFRPubKey ,
  //   Randomiser,
  //   DerPubkey,
  // };
};
