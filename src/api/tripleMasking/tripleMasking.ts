import { CACHE_ENTRIES } from '../../config/cache';
import Sdk from '../../Sdk';
import { create as createBigNumber, fromWei, plus, toWei } from '../../services/bigNumber';
import Cache from '../../services/cacheStore/factory';
import { CacheItem } from '../../services/cacheStore/types';
import { getFeeInputs } from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { generateSeedString } from '../../services/utils';
import { addUtxo } from '../../services/utxoHelper';
import * as Keypair from '../keypair';
import * as Network from '../network';
import { getAssetCode, getAssetDetails } from '../sdkAsset';
import { getAnonTransferOperationBuilder, getTransactionBuilder } from '../transaction';

interface BalanceInfo {
  assetType: string;
  amount: string;
}

interface AnonWalletBalanceInfo {
  axfrPublicKey: string;
  balances: BalanceInfo[];
}

export interface CommitmentsResponseMap {
  [key: string]: [string, number[], number];
}

export interface ProcessedCommitmentsMap {
  commitmentKey: string;
  commitmentAxfrPublicKey: string;
  commitmentAssetType: string;
  commitmentAmount: string;
}

export const genAnonKeys = async (): Promise<FindoraWallet.FormattedAnonKeys> => {
  const ledger = await getLedger();

  try {
    const anonKeys = await ledger.gen_anon_keys();

    const axfrPublicKey = anonKeys.pub_key;
    const axfrSpendKey = anonKeys.spend_key;
    const axfrViewKey = anonKeys.view_key;

    const formattedAnonKeys = {
      axfrPublicKey,
      axfrSpendKey,
      axfrViewKey,
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
  commitments: string[],
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
    commitments,
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

const getAbarFromJson = async (ownedAbar: FindoraWallet.OwnedAbar) => {
  const ledger = await getLedger();

  let myOwnedAbar;

  try {
    myOwnedAbar = ledger.abar_from_json(ownedAbar);
  } catch (error) {
    throw new Error(`Could not decode myOwnedAbar data", Error - ${error}`);
  }

  return myOwnedAbar;
};

const getAbarOwnerMemo = async (atxoSid: string) => {
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

  return abarOwnerMemo;
};

const getMyMTLeafInfo = async (atxoSid: string) => {
  const ledger = await getLedger();

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

  return myMTLeafInfo;
};

const getAnonKeypairFromJson = async (anonKeys: FindoraWallet.FormattedAnonKeys) => {
  let aXfrSpendKeyConverted;
  let axfrViewKeyConverted;
  let axfrPublicKeyConverted;

  const { axfrSpendKey, axfrPublicKey, axfrViewKey } = anonKeys;

  try {
    aXfrSpendKeyConverted = await Keypair.getAXfrPrivateKeyByBase64(axfrSpendKey); // AXfrSpendKey
    axfrViewKeyConverted = await Keypair.getAXfrViewKeyByBase64(axfrViewKey); // axfrViewKey

    axfrPublicKeyConverted = await Keypair.getAXfrPublicKeyByBase64(axfrPublicKey); // AXfrPubKey
  } catch (error) {
    throw new Error(`Could not convert AnonKeyPair from JSON", Error - ${(error as Error).message}`);
  }

  return {
    aXfrSpendKeyConverted,
    axfrPublicKeyConverted,
    axfrViewKeyConverted,
  };
};

const getAbarTransferInputPayload = async (
  ownedAbarItem: FindoraWallet.OwnedAbarItem,
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
) => {
  const { abarData } = ownedAbarItem;

  const { atxoSid, ownedAbar } = abarData;

  const myOwnedAbar = await getAbarFromJson(ownedAbar);
  const abarOwnerMemo = await getAbarOwnerMemo(atxoSid);
  const myMTLeafInfo = await getMyMTLeafInfo(atxoSid);

  const maps = await getBalanceMaps([ownedAbarItem], anonKeysSender);

  const { usedAssets } = maps;
  const [assetCode] = usedAssets;

  const asset = await getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;

  const result = {
    myOwnedAbar,
    abarOwnerMemo,
    myMTLeafInfo,
    assetCode,
    decimals,
  };

  return { ...result };
};

export const abarToAbar = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonKeysReceiver: FindoraWallet.FormattedAnonKeys,
  abarAmountToTransfer: string,
  ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  const calculatedFee = await getAbarTransferFee(
    anonKeysSender,
    anonKeysReceiver,
    abarAmountToTransfer,
    ownedAbarToUseAsSource,
    additionalOwnedAbarItems,
  );

  console.log('🚀 ~ file: tripleMasking.ts ~ line 288 ~ calculatedFee', calculatedFee);

  const balanceAfterSendToBN = createBigNumber(calculatedFee);

  const isMoreFeeNeeded = balanceAfterSendToBN.gt(createBigNumber(0));

  if (isMoreFeeNeeded) {
    const msg = `Could not process abar transfer. More fee are needed. Required amount at least "${calculatedFee} FRA"`;
    throw new Error(msg);
  }

  let anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
    anonKeysSender,
    anonKeysReceiver,
    abarAmountToTransfer,
    ownedAbarToUseAsSource,
    additionalOwnedAbarItems,
  );

  try {
    anonTransferOperationBuilder = anonTransferOperationBuilder.build();
  } catch (error) {
    console.log('🚀 ~ file: tripleMasking.ts ~ line 320 ~ error', error);
    console.log('Full Error: ', error);
    throw new Error(`Could not build and sign abar transfer operation", Error - ${error}`);
  }

  let commitmentsMap: CommitmentsResponseMap;

  try {
    commitmentsMap = anonTransferOperationBuilder?.get_commitment_map();
  } catch (err) {
    throw new Error(`Could not get a list of commitments strings "${(err as Error).message}" `);
  }

  const processedCommitmentsMap = await processAbarToAbarCommitmentResponse(commitmentsMap);

  const abarToAbarData: FindoraWallet.AbarToAbarData = {
    anonKeysSender,
    anonKeysReceiver,
    commitmentsMap: processedCommitmentsMap,
  };

  return { anonTransferOperationBuilder, abarToAbarData };
};

export const prepareAnonTransferOperationBuilder = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonKeysReceiver: FindoraWallet.FormattedAnonKeys,
  abarAmountToTransfer: string,
  ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  let anonTransferOperationBuilder = await getAnonTransferOperationBuilder();

  const { aXfrSpendKeyConverted: aXfrSpendKeySender } = await getAnonKeypairFromJson(anonKeysSender);

  const { axfrPublicKeyConverted: axfrPublicKeyReceiver } = await getAnonKeypairFromJson(anonKeysReceiver);

  const abarPayloadOne = await getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender);

  try {
    anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(
      abarPayloadOne.myOwnedAbar,
      abarPayloadOne.abarOwnerMemo,
      aXfrSpendKeySender,
      abarPayloadOne.myMTLeafInfo,
    );
  } catch (error) {
    throw new Error(
      `Could not add an input for abar transfer operation", Error - ${(error as Error).message}`,
    );
  }

  for (const ownedAbarItemOne of additionalOwnedAbarItems) {
    const abarPayloadNext = await getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender);

    try {
      anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(
        abarPayloadNext.myOwnedAbar,
        abarPayloadNext.abarOwnerMemo,
        aXfrSpendKeySender,
        abarPayloadNext.myMTLeafInfo,
      );
    } catch (error) {
      throw new Error(
        `Could not add an additional input for abar transfer operation", Error - ${(error as Error).message}`,
      );
    }
  }

  const toAmount = BigInt(toWei(abarAmountToTransfer, abarPayloadOne.decimals).toString());
  console.log('🚀 ~ file: tripleMasking.ts ~ line 406 ~ toAmount', toAmount);

  try {
    const ledger = await getLedger();

    const amountAssetType = ledger.open_abar(
      abarPayloadOne.myOwnedAbar,
      abarPayloadOne.abarOwnerMemo,
      aXfrSpendKeySender,
    );

    anonTransferOperationBuilder = anonTransferOperationBuilder.add_output(
      toAmount,
      amountAssetType.asset_type,
      axfrPublicKeyReceiver,
    );
  } catch (error) {
    throw new Error(
      `Could not add an output for abar transfer operation", Error - ${(error as Error).message}`,
    );
  }

  return anonTransferOperationBuilder;
};

const processAbarToAbarCommitmentResponse = async (
  commitmentsMap: CommitmentsResponseMap,
): Promise<ProcessedCommitmentsMap[]> => {
  const commitmentKeys = Object.keys(commitmentsMap);

  if (!commitmentKeys?.length) {
    throw new Error(`Commitments maps is empty `);
  }

  const responseMap: ProcessedCommitmentsMap[] = [];

  for (const commitmentKey of commitmentKeys) {
    const commitmentEntity = commitmentsMap[commitmentKey];
    const [commitmentAxfrPublicKey, commitmentNumericAssetType, commitmentAmountInWei] = commitmentEntity;

    const commitmentAssetType = await getAssetCode(commitmentNumericAssetType);

    const commitmentAmount = fromWei(createBigNumber(commitmentAmountInWei.toString()), 6).toFormat(6);

    responseMap.push({
      commitmentKey,
      commitmentAxfrPublicKey,
      commitmentAssetType,
      commitmentAmount: `${commitmentAmount}`,
    });
  }

  return responseMap;
};

export const getAbarTransferFee = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonKeysReceiver: FindoraWallet.FormattedAnonKeys,
  abarAmountToTransfer: string,
  ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  const anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
    anonKeysSender,
    anonKeysReceiver,
    abarAmountToTransfer,
    ownedAbarToUseAsSource,
    additionalOwnedAbarItems,
  );

  const expectedFee = anonTransferOperationBuilder.get_expected_fee();

  const calculatedFee = fromWei(createBigNumber(expectedFee.toString()), 6).toFormat(6);

  return calculatedFee;
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
  } catch (error) {
    throw new Error(`Could not convert AXfrPublicKey", Error - ${(error as Error).message}`);
  }

  const seed = generateSeedString();
  console.log('🚀 ~ file: tripleMasking.ts ~ line 537 ~ seed', seed);

  try {
    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(
      seed,
      walletInfo.keypair,
      axfrPublicKey,
      BigInt(sid),
      assetRecord,
      ownerMemo?.clone(),
    );
  } catch (error) {
    throw new Error(`Could not add bar to abar operation", Error - ${(error as Error).message}`);
  }

  let feeInputs;

  try {
    feeInputs = await getFeeInputs(walletInfo, sid, true);
  } catch (error) {
    throw new Error(
      `Could not get fee inputs for bar to abar operation", Error - ${(error as Error).message}`,
    );
  }
  console.log('🚀 ~ file: tripleMasking.ts ~ line 555 ~ feeInputs', feeInputs);

  try {
    transactionBuilder = transactionBuilder.add_fee_bar_to_abar(feeInputs);
  } catch (error) {
    console.log('Full error', error);
    throw new Error(`Could not add fee for bar to abar operation", Error - ${(error as Error).message}`);
  }

  let commitments: { commitments: string[] };

  try {
    commitments = transactionBuilder?.get_commitments();
    console.log('🚀 ~ file: tripleMasking.ts ~ line 575 ~ commitments', commitments);
  } catch (err) {
    throw new Error(`could not get a list of commitments strings "${(err as Error).message}" `);
  }

  if (!commitments?.commitments?.length) {
    throw new Error(`list of commitments strings is empty `);
  }

  const barToAbarData: FindoraWallet.BarToAbarData = {
    anonKeysFormatted: anonKeys,
    commitments: commitments.commitments,
  };

  return { transactionBuilder, barToAbarData, sid: `${sid}` };
};

export const abarToBar = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  receiverWalletInfo: Keypair.WalletKeypar,
  ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
) => {
  let transactionBuilder = await getTransactionBuilder();

  const receiverXfrPublicKey = await Keypair.getXfrPublicKeyByBase64(receiverWalletInfo.publickey);

  const { aXfrSpendKeyConverted: aXfrSpendKeySender } = await getAnonKeypairFromJson(anonKeysSender);

  const abarPayloadSource = await getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender);

  try {
    transactionBuilder = transactionBuilder.add_operation_abar_to_bar(
      abarPayloadSource.myOwnedAbar,
      abarPayloadSource.abarOwnerMemo,
      abarPayloadSource.myMTLeafInfo,
      aXfrSpendKeySender,
      receiverXfrPublicKey,
      false,
      false,
    );
  } catch (error) {
    throw new Error(`Could not add abar to bar operation", Error - ${(error as Error).message}`);
  }

  const abarToBarData: FindoraWallet.AbarToBarData = {
    anonKeysSender,
  };

  return { transactionBuilder, abarToBarData, receiverWalletInfo };
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

export const getNullifierHashesFromCommitments = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitmentsList: string[],
) => {
  const { axfrSpendKey, axfrPublicKey } = anonKeys;

  const nullifierHashes: string[] = [];

  for (const givenCommitment of givenCommitmentsList) {
    let ownedAbarsResponse: FindoraWallet.OwnedAbarItem[] = [];

    try {
      ownedAbarsResponse = await getOwnedAbars(givenCommitment);
    } catch (error) {
      console.log(
        `getOwnedAbars for '${axfrPublicKey}'->'${givenCommitment}' returned an error. ${
          (error as Error).message
        }`,
        console.log('Full Error', error),
      );
      continue;
    }

    const [ownedAbarItem] = ownedAbarsResponse;

    if (!ownedAbarItem) {
      continue;
    }

    const { abarData } = ownedAbarItem;

    const { atxoSid, ownedAbar } = abarData;

    const hash = await genNullifierHash(atxoSid, ownedAbar, axfrSpendKey);

    nullifierHashes.push(hash);
  }

  return nullifierHashes;
};

export const getUnspentAbars = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitmentsList: string[],
) => {
  const { axfrSpendKey, axfrPublicKey } = anonKeys;

  const unspentAbars: FindoraWallet.OwnedAbarItem[] = [];

  for (const givenCommitment of givenCommitmentsList) {
    let ownedAbarsResponse: FindoraWallet.OwnedAbarItem[] = [];

    try {
      ownedAbarsResponse = await getOwnedAbars(givenCommitment);
    } catch (error) {
      console.log(
        `getOwnedAbars for '${axfrPublicKey}'->'${givenCommitment}' returned an error. ${
          (error as Error).message
        }`,
        console.log('Full Error', error),
      );
      continue;
    }

    const [ownedAbarItem] = ownedAbarsResponse;

    if (!ownedAbarItem) {
      continue;
    }
    const { abarData } = ownedAbarItem;

    const { atxoSid, ownedAbar } = abarData;

    const hash = await genNullifierHash(atxoSid, ownedAbar, axfrSpendKey);

    const isAbarSpent = await isNullifierHashSpent(hash);

    if (!isAbarSpent) {
      unspentAbars.push({ ...ownedAbarItem });
    }
  }

  return unspentAbars;
};

export const getSpentAbars = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitmentsList: string[],
) => {
  const { axfrSpendKey, axfrPublicKey } = anonKeys;

  const spentAbars: FindoraWallet.OwnedAbarItem[] = [];

  for (const givenCommitment of givenCommitmentsList) {
    let ownedAbarsResponse: FindoraWallet.OwnedAbarItem[] = [];

    try {
      ownedAbarsResponse = await getOwnedAbars(givenCommitment);
    } catch (error) {
      console.log(
        `getOwnedAbars for '${axfrPublicKey}'->'${givenCommitment}' returned an error. ${
          (error as Error).message
        }`,
        console.log('Full Error', error),
      );
      continue;
    }

    const [ownedAbarItem] = ownedAbarsResponse;

    if (!ownedAbarItem) {
      continue;
    }
    const { abarData } = ownedAbarItem;

    const { atxoSid, ownedAbar } = abarData;

    const hash = await genNullifierHash(atxoSid, ownedAbar, axfrSpendKey);

    const isAbarSpent = await isNullifierHashSpent(hash);

    if (isAbarSpent) {
      spentAbars.push({ ...ownedAbarItem });
    }
  }

  return spentAbars;
};

export const openAbar = async (
  abar: FindoraWallet.OwnedAbarItem,
  anonKeys: FindoraWallet.FormattedAnonKeys,
): Promise<FindoraWallet.OpenedAbarInfo> => {
  const ledger = await getLedger();

  const { abarData } = abar;
  const { atxoSid, ownedAbar } = abarData;

  const myOwnedAbar = await getAbarFromJson(ownedAbar);

  const abarOwnerMemo = await getAbarOwnerMemo(atxoSid);

  const myMTLeafInfo = await getMyMTLeafInfo(atxoSid);

  const { aXfrSpendKeyConverted: axfrSpendKey } = await getAnonKeypairFromJson(anonKeys);

  const openedAbar: FindoraWallet.OpenedAbar = ledger.get_open_abar(
    myOwnedAbar,
    abarOwnerMemo,
    axfrSpendKey,
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

  for (const abar of unspentAbars) {
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
  givenCommitmentsList: string[],
) => {
  const unspentAbars = await getUnspentAbars(anonKeys, givenCommitmentsList);
  const balances = await getAbarBalance(unspentAbars, anonKeys);
  return balances;
};

export const getSpentBalance = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitmentsList: string[],
) => {
  const unspentAbars = await getSpentAbars(anonKeys, givenCommitmentsList);
  const balances = await getAbarBalance(unspentAbars, anonKeys);
  return balances;
};

export const getAllAbarBalances = async (
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitmentsList: string[],
) => {
  const spentBalances = await getSpentBalance(anonKeys, givenCommitmentsList);
  const unSpentBalances = await getBalance(anonKeys, givenCommitmentsList);
  return {
    spentBalances,
    unSpentBalances,
    givenCommitmentsList,
  };
};

export const getAbarBalance = async (
  unspentAbars: FindoraWallet.OwnedAbarItem[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
) => {
  const maps = await getBalanceMaps(unspentAbars, anonKeys);
  const { axfrPublicKey } = anonKeys;

  const { assetDetailsMap, balancesMap, usedAssets } = maps;

  const balances: BalanceInfo[] = [];

  for (const assetType of usedAssets) {
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

export const getOwnedAbars = async (givenCommitment: string): Promise<FindoraWallet.OwnedAbarItem[]> => {
  const getOwnedAbarsResponse = await Network.getOwnedAbars(givenCommitment);
  const { response: ownedAbarsResponse, error } = getOwnedAbarsResponse;

  if (error) {
    throw new Error(error.message);
  }

  if (ownedAbarsResponse === undefined) {
    throw new Error('Could not receive response from get ownedAbars call');
  }

  if (!ownedAbarsResponse) {
    return [];
  }

  const [atxoSid, ownedAbar] = ownedAbarsResponse;

  const abar = {
    commitment: givenCommitment,
    abarData: {
      atxoSid,
      ownedAbar: { ...ownedAbar },
    },
  };
  // console.log('🚀 ~ file: tripleMasking.ts ~ line 840 ~ getOwnedAbars ~ abar', abar);

  return [abar];
};

export const genNullifierHash = async (
  atxoSid: string,
  ownedAbar: FindoraWallet.OwnedAbar,
  axfrSpendKey: string,
) => {
  const ledger = await getLedger();

  const abarOwnerMemoResult = await Network.getAbarOwnerMemo(atxoSid);

  const { response: myMemoData, error: memoError } = abarOwnerMemoResult;

  if (memoError) {
    throw new Error(
      `Could not fetch abar memo data for sid (genNullifierHash) "${atxoSid}", Error - ${memoError.message}`,
    );
  }

  let abarOwnerMemo;

  try {
    abarOwnerMemo = ledger.OwnerMemo.from_json(myMemoData);
  } catch (error) {
    console.log('error!', error);

    throw new Error(`Could not get decode abar memo data 1", Error - ${(error as Error).message}`);
  }

  const aXfrKeyPair = await Keypair.getAXfrPrivateKeyByBase64(axfrSpendKey);

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
    throw new Error(`Could not decode myOwnedAbar data", Error - ${error}`);
  }

  try {
    const hash = ledger.gen_nullifier_hash(myOwnedAbar, abarOwnerMemo, aXfrKeyPair, myMTLeafInfo);

    return hash;
  } catch (err) {
    throw new Error(`Could not get nullifier hash", Error - ${(err as Error).message}`);
  }
};
