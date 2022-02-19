import { CACHE_ENTRIES } from '../../config/cache';
import Sdk from '../../Sdk';
import { fromWei, plus } from '../../services/bigNumber';
import Cache from '../../services/cacheStore/factory';
import { CacheItem } from '../../services/cacheStore/types';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { addUtxo } from '../../services/utxoHelper';
import * as Keypair from '../keypair';
import * as Network from '../network';
import { getAssetDetails } from '../sdkAsset';
import { getTransactionBuilder } from '../transaction';

interface BalanceInfo {
  assetType: string;
  amount: string;
}

interface AnonWalletBalanceInfo {
  axfrPublicKey: string;
  balances: BalanceInfo[];
}

export const genAnonKeys = async (): Promise<FindoraWallet.FormattedAnonKeys> => {
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

    try {
      anonKeys.free();
    } catch (error) {
      throw new Error(`could not get release the anonymous keys instance  "${(error as Error).message}" `);
    }

    return formattedAnonKeys;
  } catch (err) {
    throw new Error(`could not get anon keys, "${err}" `);
  }
};

const resolvePathToCacheEntry = (cacheEntryName: string) => {
  let fullPathToCacheEntry = `${Sdk.environment.cachePath}/${cacheEntryName}.json`;

  try {
    if (window && window?.document) {
      fullPathToCacheEntry = cacheEntryName;
    }
  } catch (error) {
    console.log('for browser mode a default fullPathToCacheEntry was used');
  }

  return fullPathToCacheEntry;
};

export const saveBarToAbarToCache = async (
  walletInfo: Keypair.WalletKeypar,
  sid: number,
  randomizers: string[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
): Promise<FindoraWallet.BarToAbarData> => {
  const cacheDataToSave: CacheItem = {};

  const cacheEntryName = `${CACHE_ENTRIES.BAR_TO_ABAR}_${walletInfo.address}`;

  const fullPathToCacheEntry = resolvePathToCacheEntry(cacheEntryName);

  let abarDataCache = {};

  try {
    abarDataCache = await Cache.read(fullPathToCacheEntry, Sdk.environment.cacheProvider);
  } catch (error) {
    console.log(`Error reading the abarDataCache for ${walletInfo.address}. Creating an empty object now`);
  }

  const barToAbarData = {
    anonKeysFormatted: anonKeys,
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

export const saveOwnedAbarsToCache = async (
  walletInfo: Keypair.WalletKeypar,
  ownedAbars: FindoraWallet.OwnedAbarItem[],
  savePath?: string,
): Promise<boolean> => {
  const cacheDataToSave: CacheItem = {};

  const cacheEntryName = `${CACHE_ENTRIES.OWNED_ABARS}_${walletInfo.address}`;

  const fullPathToCacheEntry = resolvePathToCacheEntry(cacheEntryName);

  const resolvedFullPathToCacheEntry = savePath || fullPathToCacheEntry;

  const [ownedAbarItem] = ownedAbars;

  const { abarData } = ownedAbarItem;

  const { atxoSid } = abarData;
  cacheDataToSave[`atxoSid_${atxoSid}`] = ownedAbars;

  let abarDataCache = {};

  try {
    abarDataCache = await Cache.read(fullPathToCacheEntry, Sdk.environment.cacheProvider);
  } catch (error) {
    console.log(`Error reading the ownedAbarsCache for ${walletInfo.address}. Creating an empty object now`);
  }

  try {
    await Cache.write(
      resolvedFullPathToCacheEntry,
      { ...abarDataCache, ...cacheDataToSave },
      Sdk.environment.cacheProvider,
    );
  } catch (error) {
    const err: Error = error as Error;
    console.log(`Could not write cache for ownedAbarsCache, "${err.message}"`);
    return false;
  }

  return true;
};

export const barToAbar = async (
  walletInfo: Keypair.WalletKeypar,
  sid: number,
  anonKeys: FindoraWallet.FormattedAnonKeys,
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
    axfrPublicKey = await Keypair.getAXfrPublicKeyByBase64(anonKeys.axfrPublicKey);

    encKey = await Keypair.getXPublicKeyByBase64(anonKeys.encKey);
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

  // try {
  //   transactionBuilder = transactionBuilder.add_fee()
  // } catch (error) {
  //   throw new Error(`Could not add fee for bar to abar operation", Error - ${(error as Error).message}`);
  // }

  let randomizers: { randomizers: string[] };

  try {
    randomizers = transactionBuilder?.get_randomizers();
  } catch (err) {
    throw new Error(`could not get a list of randomizers strings "${(err as Error).message}" `);
  }

  if (!randomizers?.randomizers?.length) {
    throw new Error(`list of randomizers strings is empty `);
  }

  let barToAbarData: FindoraWallet.BarToAbarData;

  try {
    barToAbarData = await saveBarToAbarToCache(walletInfo, sid, randomizers.randomizers, anonKeys);
  } catch (error) {
    throw new Error(`Could not save cache for bar to abar. Details: ${(error as Error).message}`);
  }

  return { transactionBuilder, barToAbarData, sid: `${sid}` };
};

export const isNullifierHashSpent = async (hash: string): Promise<boolean> => {
  const checkSpentResult = await Network.checkNullifierHashSpent(hash);

  const { response: checkSpentResponse, error: checkSpentError } = checkSpentResult;

  if (checkSpentError) {
    throw new Error(`Could not check if hash "${hash} is spent", Error - ${checkSpentError.message}`);
  }

  if (checkSpentResponse === undefined) {
    throw new Error(`Could not check if hash "${hash} is spent", Error - Response is undefined`);
  }

  return checkSpentResponse;
};

export const getUnspentAbars = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenRandomizersList: string[],
) => {
  const { axfrPublicKey, axfrSecretKey, decKey } = anonKeys;

  const unspentAbars: FindoraWallet.OwnedAbarItem[] = [];

  for (let givenRandomizer of givenRandomizersList) {
    const ownedAbarsResponse = await getOwnedAbars(axfrPublicKey, givenRandomizer);
    console.log('🚀 ~ file: tripleMasking.ts ~ line 279 ~ ownedAbarsResponse', ownedAbarsResponse);

    const [ownedAbarItem] = ownedAbarsResponse;

    const { abarData } = ownedAbarItem;

    const { atxoSid, ownedAbar } = abarData;

    const hash = await genNullifierHash(parseInt(atxoSid), ownedAbar, axfrSecretKey, decKey, givenRandomizer);

    const isAbarSpent = await isNullifierHashSpent(hash);

    if (!isAbarSpent) {
      unspentAbars.push({ ...ownedAbarItem });
    }
  }

  return unspentAbars;
};

export const openAbar = async (
  abar: FindoraWallet.OwnedAbarItem,
  anonKeys: FindoraWallet.FormattedAnonKeys,
): Promise<FindoraWallet.OpenedAbarInfo> => {
  const ledger = await getLedger();
  const { axfrSecretKey, decKey } = anonKeys;

  const { abarData } = abar;
  const { atxoSid, ownedAbar } = abarData;

  const abarOwnerMemoResult = await Network.getAbarOwnerMemo(parseInt(atxoSid));

  const { response: myMemoData, error: memoError } = abarOwnerMemoResult;

  if (memoError) {
    throw new Error(`Could not fetch abar memo data for sid "${atxoSid}", Error - ${memoError.message}`);
  }

  let abarOwnerMemo;

  try {
    abarOwnerMemo = ledger.OwnerMemo.from_json(myMemoData);
  } catch (error) {
    throw new Error(`Could not get decode abar memo data", Error - ${(error as Error).message}`);
  }

  const aXfrKeyPair = await Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey);

  const mTLeafInfoResult = await Network.getMTLeafInfo(parseInt(atxoSid));

  const { response: mTLeafInfo, error: mTLeafInfoError } = mTLeafInfoResult;

  if (mTLeafInfoError) {
    throw new Error(
      `Could not fetch mTLeafInfo data for sid "${atxoSid}", Error - ${mTLeafInfoError.message}`,
    );
  }

  if (!mTLeafInfo) {
    throw new Error(`Could not fetch mTLeafInfo data for sid "${atxoSid}", Error - mTLeafInfo is empty`);
  }

  let myMTLeafInfo;

  try {
    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
  } catch (error) {
    throw new Error(`Could not decode myMTLeafInfo data", Error - ${(error as Error).message}`);
  }

  let myOwnedAbar;

  try {
    myOwnedAbar = ledger.abar_from_json(ownedAbar);
  } catch (error) {
    throw new Error(`Could not decode myOwnedAbar data", Error - ${(error as Error).message}`);
  }

  const secretDecKey = ledger.x_secretkey_from_string(decKey);

  const openedAbar: FindoraWallet.OpenedAbar = ledger.get_open_abar(
    myOwnedAbar,
    abarOwnerMemo,
    aXfrKeyPair,
    secretDecKey,
    myMTLeafInfo,
  );

  const { amount, asset_type } = openedAbar;

  const assetCode = ledger.asset_type_from_jsvalue(asset_type);

  const item = {
    amount,
    assetType: assetCode,
    abar: openedAbar,
  };

  return item;
};

export const getBalanceMaps = async (
  unspentAbars: FindoraWallet.OwnedAbarItem[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
) => {
  const assetDetailsMap: { [key: string]: FindoraWallet.IAsset } = {};
  const balancesMap: { [key: string]: string } = {};
  const usedAssets = [];

  for (let abar of unspentAbars) {
    const openedAbarItem = await openAbar(abar, anonKeys);

    const { amount, assetType } = openedAbarItem;

    if (!assetDetailsMap[assetType]) {
      const asset = await getAssetDetails(assetType);
      usedAssets.push(assetType);
      assetDetailsMap[assetType] = asset;
    }

    if (!balancesMap[assetType]) {
      balancesMap[assetType] = '0';
    }

    balancesMap[assetType] = plus(balancesMap[assetType], amount).toString();
  }

  return {
    assetDetailsMap,
    balancesMap,
    usedAssets,
  };
};

export const getBalance = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenRandomizersList: string[],
) => {
  const unspentAbars = await getUnspentAbars(anonKeys, givenRandomizersList);
  const balances = await getAbarBalance(unspentAbars, anonKeys);
  return balances;
};

export const getAbarBalance = async (
  unspentAbars: FindoraWallet.OwnedAbarItem[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
) => {
  const maps = await getBalanceMaps(unspentAbars, anonKeys);
  const { axfrPublicKey } = anonKeys;

  const { assetDetailsMap, balancesMap, usedAssets } = maps;

  const balances: BalanceInfo[] = [];

  for (let assetType of usedAssets) {
    const decimals = assetDetailsMap[assetType].assetRules.decimals;
    const amount = fromWei(balancesMap[assetType], decimals).toFormat(decimals);
    balances.push({ assetType, amount });
  }

  const balanceInfo: AnonWalletBalanceInfo = {
    axfrPublicKey,
    balances,
  };

  return balanceInfo;
};

export const getOwnedAbars = async (
  formattedAxfrPublicKey: string,
  givenRandomizer: string,
): Promise<FindoraWallet.OwnedAbarItem[]> => {
  const ledger = await getLedger();

  const axfrPublicKey = await Keypair.getAXfrPublicKeyByBase64(formattedAxfrPublicKey);
  const randomizedPubKey = ledger.randomize_axfr_pubkey(axfrPublicKey, givenRandomizer);

  const { response: ownedAbarsResponse, error } = await Network.getOwnedAbars(randomizedPubKey);
  console.log('🚀 ~ file: tripleMasking.ts ~ line 456 ~ ownedAbarsResponse', ownedAbarsResponse);

  if (error) {
    throw new Error(error.message);
  }

  if (!ownedAbarsResponse) {
    throw new Error('Could not receive response from get ownedAbars call');
  }

  const result = ownedAbarsResponse.map(ownedAbarItem => {
    const [atxoSid, ownedAbar] = ownedAbarItem;

    const abar = {
      axfrPublicKey: formattedAxfrPublicKey,
      randomizer: givenRandomizer,
      abarData: {
        atxoSid: atxoSid + '',
        ownedAbar: { ...ownedAbar },
      },
    };
    return abar;
  });

  return result;
};

export const genNullifierHash = async (
  atxoSid: number,
  ownedAbar: FindoraWallet.OwnedAbar,
  axfrSecretKey: string,
  decKey: string,
  randomizer: string,
) => {
  const ledger = await getLedger();

  const abarOwnerMemoResult = await Network.getAbarOwnerMemo(atxoSid);

  const { response: myMemoData, error: memoError } = abarOwnerMemoResult;

  if (memoError) {
    throw new Error(`Could not fetch abar memo data for sid "${atxoSid}", Error - ${memoError.message}`);
  }

  let abarOwnerMemo;

  try {
    abarOwnerMemo = ledger.OwnerMemo.from_json(myMemoData);
  } catch (error) {
    throw new Error(`Could not get decode abar memo data", Error - ${(error as Error).message}`);
  }

  const aXfrKeyPairForRandomizing = await Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey);
  const aXfrKeyPair = await Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey);

  const randomizeAxfrKeypairString = await Keypair.getRandomizeAxfrKeypair(
    aXfrKeyPairForRandomizing,
    randomizer,
  );

  const randomizeAxfrKeypair = await Keypair.getAXfrPrivateKeyByBase64(randomizeAxfrKeypairString);

  const mTLeafInfoResult = await Network.getMTLeafInfo(atxoSid);

  const { response: mTLeafInfo, error: mTLeafInfoError } = mTLeafInfoResult;

  if (mTLeafInfoError) {
    throw new Error(
      `Could not fetch mTLeafInfo data for sid "${atxoSid}", Error - ${mTLeafInfoError.message}`,
    );
  }

  if (!mTLeafInfo) {
    throw new Error(`Could not fetch mTLeafInfo data for sid "${atxoSid}", Error - mTLeafInfo is empty`);
  }

  let myMTLeafInfo;

  try {
    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
  } catch (error) {
    throw new Error(`Could not decode myMTLeafInfo data", Error - ${(error as Error).message}`);
  }

  let myOwnedAbar;

  try {
    myOwnedAbar = ledger.abar_from_json(ownedAbar);
  } catch (error) {
    throw new Error(`Could not decode myOwnedAbar data", Error - ${(error as Error).message}`);
  }

  const secretDecKey = ledger.x_secretkey_from_string(decKey);

  try {
    const hash = ledger.gen_nullifier_hash(
      myOwnedAbar,
      abarOwnerMemo,
      aXfrKeyPair,
      randomizeAxfrKeypair,
      secretDecKey,
      myMTLeafInfo,
    );

    return hash;
  } catch (err) {
    throw new Error(`Could not get nullifier hash", Error - ${(err as Error).message}`);
  }
};
