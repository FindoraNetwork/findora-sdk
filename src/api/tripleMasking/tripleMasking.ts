import { AXfrPubKey } from 'findora-wallet-wasm/web';
import { CACHE_ENTRIES } from '../../config/cache';
import { waitForBlockChange } from '../../evm/testHelpers';
import Sdk from '../../Sdk';
import { create as createBigNumber, fromWei, plus, toWei } from '../../services/bigNumber';
import Cache from '../../services/cacheStore/factory';
import { CacheItem } from '../../services/cacheStore/types';
import { getFeeInputs } from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { generateSeedString, log } from '../../services/utils';
import { addUtxo, AddUtxoItem, getUtxoWithAmount } from '../../services/utxoHelper';
import * as FindoraWallet from '../../types/findoraWallet';
import * as Keypair from '../keypair';
import * as Network from '../network';
import * as Asset from '../sdkAsset';
import * as Transaction from '../transaction';
import * as Builder from '../transaction/builder';

interface BalanceInfo {
  assetType: string;
  amount: string;
}

interface AtxoMapItem {
  amount: string;
  atxoSid: string;
  assetType: string;
  commitment: string;
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
  receiverAxfrPublicKey: string,
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
    receiverAxfrPublicKey,
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

export const getAbarOwnerMemo = async (atxoSid: string) => {
  const ledger = await getLedger();

  const abarOwnerMemoResult = await Network.getAbarOwnerMemo(atxoSid);

  const { response: myMemoData, error: memoError } = abarOwnerMemoResult;

  if (memoError) {
    throw new Error(`Could not fetch abar memo data for sid "${atxoSid}", Error - ${memoError.message}`);
  }

  let abarOwnerMemo;

  try {
    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
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

export const getAnonKeypairFromJson = async (anonKeys: FindoraWallet.FormattedAnonKeys) => {
  let aXfrSpendKeyConverted;
  let axfrViewKeyConverted;
  let axfrPublicKeyConverted;

  const { axfrSpendKey, axfrPublicKey, axfrViewKey } = anonKeys;

  try {
    aXfrSpendKeyConverted = await Keypair.getAXfrPrivateKeyByBase64(axfrSpendKey); // AXfrSpendKey
    axfrViewKeyConverted = await Keypair.getAXfrViewKeyByBase64(axfrViewKey); // axfrViewKey

    axfrPublicKeyConverted = await getAnonPubKeyFromString(axfrPublicKey); // AXfrPubKey
  } catch (error) {
    throw new Error(`Could not convert AnonKeyPair from JSON", Error - ${(error as Error).message}`);
  }

  return {
    aXfrSpendKeyConverted,
    axfrPublicKeyConverted,
    axfrViewKeyConverted,
  };
};

const getAnonPubKeyFromString = async (anonPubKey: string): Promise<AXfrPubKey> => {
  let axfrPublicKeyConverted;
  try {
    axfrPublicKeyConverted = await Keypair.getAXfrPublicKeyByBase64(anonPubKey);
  } catch (error) {
    throw new Error(`Could not convert Anon Public Key from string", Error - ${(error as Error).message}`);
  }

  return axfrPublicKeyConverted;
};

const getAbarTransferInputPayload = async (
  ownedAbarItem: FindoraWallet.OwnedAbarItem,
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
) => {
  // @todo add try catch
  const { abarData } = ownedAbarItem;

  const { atxoSid, ownedAbar } = abarData;

  const myOwnedAbar = await getAbarFromJson(ownedAbar);
  const abarOwnerMemo = await getAbarOwnerMemo(atxoSid);
  const myMTLeafInfo = await getMyMTLeafInfo(atxoSid);

  const maps = await getBalanceMaps([ownedAbarItem], anonKeysSender);

  const { usedAssets } = maps;
  const [assetCode] = usedAssets;

  const asset = await Asset.getAssetDetails(assetCode);
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

export const getAbarToAbarAmountPayload = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonPubKeyReceiver: string,
  amount: string,
  assetCode: string,
  givenCommitmentsList: string[],
) => {
  const asset = await Asset.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const utxoNumbers = BigInt(toWei(amount, decimals).toString());

  const unspentAbars = await getUnspentAbars(anonKeysSender, givenCommitmentsList);
  const balancesMaps = await getBalanceMaps(unspentAbars, anonKeysSender);
  const { atxoMap } = balancesMaps;

  let filteredFraAtxoList: AtxoMapItem[] = [];

  const filteredAssetAtxoList = atxoMap[assetCode] || [];

  if (!filteredAssetAtxoList.length) {
    throw new Error(
      `There is no any abar for asset ${assetCode} available for ${anonKeysSender.axfrPublicKey}`,
    );
  }

  const fraAssetCode = await Asset.getFraAssetCode();

  const isFraTransfer = assetCode === fraAssetCode;

  if (!isFraTransfer) {
    filteredFraAtxoList = atxoMap[fraAssetCode] || [];
  }

  if (!isFraTransfer && !filteredFraAtxoList.length) {
    throw new Error(`There is no any FRA abar to cover the fee for ${anonKeysSender.axfrPublicKey}`);
  }

  const assetCommitments = filteredAssetAtxoList.map(atxoItem => atxoItem.commitment);
  const fraCommitments = filteredFraAtxoList.map(atxoItem => atxoItem.commitment);

  const atxoListToSend = await getSendAtxo(assetCode, utxoNumbers, assetCommitments, anonKeysSender);
  console.log('🚀 ~ file: tripleMasking.ts ~ line 338 ~ atxoListToSend', atxoListToSend);

  if (!atxoListToSend.length) {
    throw new Error(
      `Sender ${anonKeysSender.axfrPublicKey} does not have enough abars to send ${amount} of ${assetCode}`,
    );
  }

  const additionalOwnedAbarItems = [];

  const commitmentsToSend: string[] = [];
  const commitmentsForFee: string[] = [];

  for (let atxoItem of atxoListToSend) {
    const givenCommitment = atxoItem.commitment;
    const ownedAbarsResponseTwo = await getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
    commitmentsToSend.push(givenCommitment);
  }

  let calculatedFee = await getAbarTransferFee(
    anonKeysSender,
    anonPubKeyReceiver,
    amount,
    additionalOwnedAbarItems,
  );

  const totalFeeEstimate = await getTotalAbarTransferFee(
    anonKeysSender,
    anonPubKeyReceiver,
    amount,
    additionalOwnedAbarItems,
  );

  console.log(`🚀 ~ file: tripleMasking.ts ~ line 308 ~ we need ${calculatedFee} more FRA to pay fee`);

  let balanceAfterSendToBN = createBigNumber(calculatedFee);

  let isMoreFeeNeeded = balanceAfterSendToBN.gt(createBigNumber(0));

  if (!isMoreFeeNeeded) {
    return {
      commitmentsToSend,
      commitmentsForFee,
      additionalAmountForFee: totalFeeEstimate,
    };
  }
  let allCommitmentsForFee: string[] = fraCommitments;

  if (isFraTransfer) {
    allCommitmentsForFee = assetCommitments.filter(
      commitment => !atxoListToSend.map(atxoItem => atxoItem.commitment).includes(commitment),
    );
  }

  let idx = 0;

  const feeUtxoNumbers = BigInt(toWei(calculatedFee, 6).toString());
  const feeAtxoListToSend = await getSendAtxo(
    fraAssetCode,
    feeUtxoNumbers,
    allCommitmentsForFee,
    anonKeysSender,
  );

  const allCommitmentsForFeeSorted = feeAtxoListToSend.map(atxoItem => atxoItem.commitment);

  while (isMoreFeeNeeded) {
    const givenCommitment = allCommitmentsForFeeSorted?.[idx];

    if (!givenCommitment) {
      throw new Error(`You still need ${calculatedFee} FRA to cover the fee`);
    }
    const ownedAbarsResponseFee = await getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItemFee] = ownedAbarsResponseFee;

    additionalOwnedAbarItems.push(additionalOwnedAbarItemFee);

    calculatedFee = await getAbarTransferFee(
      anonKeysSender,
      anonPubKeyReceiver,
      amount,
      additionalOwnedAbarItems,
    );

    balanceAfterSendToBN = createBigNumber(calculatedFee);

    isMoreFeeNeeded = balanceAfterSendToBN.gt(createBigNumber(0));
    idx += 1;

    commitmentsForFee.push(givenCommitment);
    console.log('🚀 ~ file: tripleMasking.ts ~ line 397 ~ calculatedFee', calculatedFee);
  }

  console.log('returning calculatedFee', calculatedFee);

  // const expectedFee = await getAmountFromCommitments(fraAssetCode, commitmentsForFee, anonKeysSender);

  // const additionalAmountForFee = fromWei(createBigNumber(expectedFee.toString()), 6).toFormat(6);

  return {
    commitmentsToSend,
    commitmentsForFee,
    additionalAmountForFee: totalFeeEstimate,
  };
};

export const getAbarToBarAmountPayload = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  amount: string,
  assetCode: string,
  givenCommitmentsList: string[],
) => {
  const payload = await getAbarToAbarAmountPayload(
    anonKeysSender,
    anonKeysSender.axfrPublicKey,
    amount,
    assetCode,
    givenCommitmentsList,
  );
  console.log('🚀 ~ file: tripleMasking.ts ~ line 453 ~ payload', payload);

  const { commitmentsToSend, commitmentsForFee, additionalAmountForFee } = payload;

  return {
    commitmentsToSend,
    commitmentsForFee,
    additionalAmountForFee,
  };
};

export const abarToAbarAmount = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonPubKeyReceiver: string,
  amount: string,
  assetCode: string,
  givenCommitmentsList: string[],
) => {
  const payload = await getAbarToAbarAmountPayload(
    anonKeysSender,
    anonPubKeyReceiver,
    amount,
    assetCode,
    givenCommitmentsList,
  );
  console.log('🚀 ~ file: tripleMasking.ts ~ line 453 ~ payload', payload);

  const { commitmentsToSend, commitmentsForFee } = payload;

  const allCommitments = [...commitmentsToSend, ...commitmentsForFee];
  console.log('🚀 ~ file: tripleMasking.ts ~ line 458 ~ allCommitments', allCommitments);

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of allCommitments) {
    const ownedAbarsResponseTwo = await getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const abarToAbarResult = await abarToAbar(
    anonKeysSender,
    anonPubKeyReceiver,
    amount,
    additionalOwnedAbarItems,
  );

  return abarToAbarResult;
};

export const abarToAbar = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonPubKeyReceiver: string,
  abarAmountToTransfer: string,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  const calculatedFee = await getAbarTransferFee(
    anonKeysSender,
    anonPubKeyReceiver,
    abarAmountToTransfer,
    additionalOwnedAbarItems,
  );

  console.log(`🚀 ~ file: tripleMasking.ts ~ line 308 ~ we need ${calculatedFee} more FRA to pay fee`);

  const balanceAfterSendToBN = createBigNumber(calculatedFee);

  const isMoreFeeNeeded = balanceAfterSendToBN.gt(createBigNumber(0));

  if (isMoreFeeNeeded) {
    const msg = `Could not process abar transfer. More fee are needed. Required amount at least "${calculatedFee} FRA"`;
    throw new Error(msg);
  }

  let anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
    anonKeysSender,
    anonPubKeyReceiver,
    abarAmountToTransfer,
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
    anonPubKeyReceiver,
    commitmentsMap: processedCommitmentsMap,
  };

  return { anonTransferOperationBuilder, abarToAbarData };
};

export const prepareAnonTransferOperationBuilder = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  axfrPublicKeyReceiverString: string,
  abarAmountToTransfer: string,
  // ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  let anonTransferOperationBuilder = await Builder.getAnonTransferOperationBuilder();

  const { aXfrSpendKeyConverted: aXfrSpendKeySender } = await getAnonKeypairFromJson(anonKeysSender);

  const axfrPublicKeyReceiver = await getAnonPubKeyFromString(axfrPublicKeyReceiverString);

  const [ownedAbarToUseAsSource, ...additionalOwnedAbars] = additionalOwnedAbarItems;

  const abarPayloadOne = await getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender);

  try {
    // console.log('prepare anon transfer - adding input ', abarPayloadOne);
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

  const toAmount = BigInt(toWei(abarAmountToTransfer, abarPayloadOne.decimals).toString());

  const addedInputs = [];

  for (const ownedAbarItemOne of additionalOwnedAbars) {
    if (addedInputs.length >= 4) {
      break;
    }

    console.log('🚀 ~ file: tripleMasking.ts ~ line 615 ~ addedInputs.length', addedInputs.length);
    const abarPayloadNext = await getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender);

    console.log('prepare anon transfer - adding additional input ', abarPayloadNext);
    try {
      anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(
        abarPayloadNext.myOwnedAbar,
        abarPayloadNext.abarOwnerMemo,
        aXfrSpendKeySender,
        abarPayloadNext.myMTLeafInfo,
      );
    } catch (error) {
      console.log('eee', error);
      throw new Error(
        `Could not add an additional input for abar transfer operation", Error - ${(error as Error).message}`,
      );
    }
    addedInputs.push(ownedAbarItemOne);
  }

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

    const commitmentAssetType = await Asset.getAssetCode(commitmentNumericAssetType);

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
  anonPubKeyReceiver: string,
  abarAmountToTransfer: string,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  const anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
    anonKeysSender,
    anonPubKeyReceiver,
    abarAmountToTransfer,
    additionalOwnedAbarItems,
  );

  const expectedFee = anonTransferOperationBuilder.get_expected_fee();

  const calculatedFee = fromWei(createBigNumber(expectedFee.toString()), 6).toFormat(6);

  return calculatedFee;
};

export const getTotalAbarTransferFee = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  anonPubKeyReceiver: string,
  abarAmountToTransfer: string,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [],
) => {
  const anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
    anonKeysSender,
    anonPubKeyReceiver,
    abarAmountToTransfer,
    additionalOwnedAbarItems,
  );

  const expectedFee = anonTransferOperationBuilder.get_total_fee_estimate();

  console.log('🚀 ~ file: tripleMasking.ts ~ line 719 ~ total expectedFee', expectedFee);

  const calculatedFee = fromWei(createBigNumber(expectedFee.toString()), 6).toFormat(6);

  return calculatedFee;
};

export const barToAbarAmount = async (
  walletInfo: Keypair.WalletKeypar,
  amount: string,
  assetCode: string,
  receiverAxfrPublicKey: string,
): Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>> => {
  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    walletInfo.address,
    amount,
    assetCode,
    assetBlindRules,
  );

  const sendResultHandle = await Transaction.submitTransaction(transactionBuilder);
  console.log('🚀 ~ file: tripleMasking.ts ~ line 501 ~ sendResultHandle', sendResultHandle);

  await waitForBlockChange();

  const asset = await Asset.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const utxoNumbers = BigInt(toWei(amount, decimals).toString());

  const utxoToUse = await getUtxoWithAmount(walletInfo, utxoNumbers, assetCode);
  console.log('🚀 ~ file: tripleMasking.ts ~ line 510 ~ utxoToUse', utxoToUse);

  const barToAbarResult = await barToAbar(walletInfo, [utxoToUse.sid], receiverAxfrPublicKey);
  console.log('🚀 ~ file: tripleMasking.ts ~ line 508 ~ barToAbarResult', barToAbarResult);

  return barToAbarResult;
};

export const barToAbar = async (
  walletInfo: Keypair.WalletKeypar,
  sids: number[],
  receiverAxfrPublicKey: string,
): Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>> => {
  const ledger = await getLedger();
  let transactionBuilder = await Builder.getTransactionBuilder();

  let utxoDataList: AddUtxoItem[] = [];

  let axfrPublicKey;

  try {
    axfrPublicKey = await getAnonPubKeyFromString(receiverAxfrPublicKey);
  } catch (error) {
    throw new Error(`Could not convert AXfrPublicKey", Error - ${error as Error}`);
  }

  try {
    utxoDataList = await addUtxo(walletInfo, sids);
  } catch (error) {
    throw new Error(`could not fetch utxo for sids ${sids.join(',')}`);
  }

  for (const utxoItem of utxoDataList) {
    const sid = utxoItem.sid;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError}`);
    }

    let ownerMemo;
    let assetRecord;

    try {
      ownerMemo = myMemoData ? ledger.AxfrOwnerMemo.from_json(myMemoData) : null;

      assetRecord = ledger.ClientAssetRecord.from_json(utxoItem.utxo);
    } catch (error) {
      throw new Error(`Could not get decode memo data or get assetRecord", Error - ${error as Error}`);
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
      throw new Error(`Could not add bar to abar operation", Error - ${error as Error}`);
    }
  }

  let feeInputs;

  try {
    feeInputs = await getFeeInputs(walletInfo, sids, true);
  } catch (error) {
    throw new Error(`Could not get fee inputs for bar to abar operation", Error - ${error as Error}`);
  }
  console.log('🚀 ~ file: tripleMasking.ts ~ line 555 ~ feeInputs', feeInputs);

  try {
    transactionBuilder = transactionBuilder.add_fee_bar_to_abar(feeInputs);
  } catch (error) {
    console.log('Full error', error);
    throw new Error(`Could not add fee for bar to abar operation", Error - ${error as Error}`);
  }

  let commitments: { commitments: string[] };

  try {
    commitments = transactionBuilder?.get_commitments();
    // console.log('🚀 ~ file: tripleMasking.ts ~ line 575 ~ commitments', commitments);
  } catch (err) {
    throw new Error(`could not get a list of commitments strings "${err as Error}" `);
  }

  if (!commitments?.commitments?.length) {
    throw new Error(`list of commitments strings is empty `);
  }

  const barToAbarData: FindoraWallet.BarToAbarData = {
    receiverAxfrPublicKey,
    commitments: commitments.commitments,
  };

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    throw new Error(`could not build and sign txn "${err as Error}"`);
  }

  return { transactionBuilder, barToAbarData, sids };
};

export const abarToBarAmount = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  receiverXfrPublicKey: string,
  amount: string,
  assetCode: string,
  givenCommitmentsList: string[],
) => {
  const payload = await getAbarToBarAmountPayload(anonKeysSender, amount, assetCode, givenCommitmentsList);

  const { commitmentsToSend, commitmentsForFee } = payload;

  const givenCommitmentsListSender = [...commitmentsToSend, ...commitmentsForFee];

  const { anonTransferOperationBuilder, abarToAbarData } = await abarToAbarAmount(
    anonKeysSender,
    anonKeysSender.axfrPublicKey,
    amount,
    assetCode,
    givenCommitmentsListSender,
  );

  const asset = await Asset.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const amountToSendInWei = BigInt(toWei(amount, decimals).toString());

  const _resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
  await waitForBlockChange();

  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  const remainderCommitements = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAmount, commitmentAssetType } = commitmentsMapEntry;
    console.log('🚀 ~ file: tripleMasking.ts ~ line 863 ~ commitmentsMapEntry', commitmentsMapEntry);
    const commitmentAmountInWei = BigInt(toWei(commitmentAmount, decimals).toString());
    const isSameAssetType = commitmentAssetType === assetCode;
    const isSameAmount = commitmentAmountInWei === amountToSendInWei;

    if (isSameAssetType && isSameAmount) {
      console.log('🚀 ~ file: tripleMasking.ts ~ line 904 ~ commitmentAmountInWei', commitmentAmountInWei);
      console.log('🚀 ~ file: tripleMasking.ts ~ line 906 ~ amountToSendInWei!!!', amountToSendInWei);

      retrivedCommitmentsListReceiver.push(commitmentKey);
      continue;
    }
    remainderCommitements.push(commitmentKey);
  }

  const allCommitments = [...retrivedCommitmentsListReceiver];

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of allCommitments) {
    const ownedAbarsResponseTwo = await getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const abarToBarResult = await abarToBar(anonKeysSender, receiverXfrPublicKey, additionalOwnedAbarItems);

  return { ...abarToBarResult, remainderCommitements, spentCommitments: givenCommitmentsListSender };
};

export const abarToBar = async (
  anonKeysSender: FindoraWallet.FormattedAnonKeys,
  receiverXfrPublicKey: string,
  additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[],
) => {
  let transactionBuilder = await Builder.getTransactionBuilder();

  const receiverXfrPublicKeyConverted = await Keypair.getXfrPublicKeyByBase64(receiverXfrPublicKey);

  const { aXfrSpendKeyConverted: aXfrSpendKeySender } = await getAnonKeypairFromJson(anonKeysSender);

  const [ownedAbarToUseAsSource, ...additionalOwnedAbars] = additionalOwnedAbarItems;

  const abarPayloadSource = await getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender);

  try {
    transactionBuilder = transactionBuilder.add_operation_abar_to_bar(
      abarPayloadSource.myOwnedAbar,
      abarPayloadSource.abarOwnerMemo,
      abarPayloadSource.myMTLeafInfo,
      aXfrSpendKeySender,
      receiverXfrPublicKeyConverted,
      false,
      false,
    );
  } catch (error) {
    console.log('Error adding Abar to bar', error);
    throw new Error(`Could not add abar to bar operation", Error - ${error as Error}`);
  }

  for (const ownedAbarItemOne of additionalOwnedAbars) {
    const abarPayloadNext = await getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender);

    try {
      transactionBuilder = transactionBuilder.add_operation_abar_to_bar(
        abarPayloadNext.myOwnedAbar,
        abarPayloadNext.abarOwnerMemo,
        abarPayloadNext.myMTLeafInfo,
        aXfrSpendKeySender,
        receiverXfrPublicKeyConverted,
        false,
        false,
      );
    } catch (error) {
      console.log('Error from the backend:', error);
      throw new Error(
        `Could not add an additional input for abar to bar transfer operation", Error - ${
          (error as Error).message
        }`,
      );
    }
  }

  try {
    transactionBuilder = transactionBuilder.build();
  } catch (err) {
    throw new Error(`could not build txn "${err as Error}"`);
  }

  const abarToBarData: FindoraWallet.AbarToBarData = {
    anonKeysSender,
  };

  return { transactionBuilder, abarToBarData, receiverXfrPublicKey };
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

  const atxoMap: { [key: string]: AtxoMapItem[] } = {};
  const usedAssets = [];

  for (const abar of unspentAbars) {
    const {
      abarData: {
        atxoSid,
        ownedAbar: { commitment },
      },
    } = abar;

    const openedAbarItem = await openAbar(abar, anonKeys);

    const { amount, assetType } = openedAbarItem;

    if (!assetDetailsMap[assetType]) {
      const asset = await Asset.getAssetDetails(assetType);
      usedAssets.push(assetType);
      assetDetailsMap[assetType] = asset;
    }

    if (!balancesMap[assetType]) {
      balancesMap[assetType] = '0';
    }
    if (!atxoMap[assetType]) {
      atxoMap[assetType] = [];
    }

    balancesMap[assetType] = plus(balancesMap[assetType], amount).toString();
    atxoMap[assetType].push({ amount: amount.toString(), assetType, atxoSid, commitment });
  }

  return {
    assetDetailsMap,
    balancesMap,
    usedAssets,
    atxoMap,
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
    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
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

const mergeAtxoList = (arr1: AtxoMapItem[], arr2: AtxoMapItem[]) => {
  const res = [];

  while (arr1.length && arr2.length) {
    const assetItem1 = arr1[0];
    const assetItem2 = arr2[0];
    const amount1 = BigInt(assetItem1.amount);
    const amount2 = BigInt(assetItem2.amount);

    if (amount1 < amount2) {
      res.push(arr1.splice(0, 1)[0]);
      continue;
    }
    res.push(arr2.splice(0, 1)[0]);
  }

  return res.concat(arr1, arr2);
};

const mergeSortAtxoList = (arr: AtxoMapItem[]): AtxoMapItem[] => {
  if (arr.length < 2) return arr;
  const middleIdx = Math.floor(arr.length / 2);

  let left = arr.splice(0, middleIdx);
  let right = arr.splice(0);

  return mergeAtxoList(mergeSortAtxoList(left), mergeSortAtxoList(right));
};

export const getSendAtxo = async (
  code: string,
  amount: BigInt,
  commitments: string[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
) => {
  const result = [];

  const unspentAbars = await getUnspentAbars(anonKeys, commitments);
  const balancesMaps = await getBalanceMaps(unspentAbars, anonKeys);
  const { atxoMap } = balancesMaps;

  const filteredUtxoList = atxoMap[code];
  // console.log('🚀 ~ file: tripleMasking.ts ~ line 1059 ~ amount', amount);

  if (!filteredUtxoList) {
    return [];
  }

  const sortedUtxoList = mergeSortAtxoList(filteredUtxoList);

  let sum = BigInt(0);

  for (let assetItem of sortedUtxoList) {
    const _amount = BigInt(assetItem.amount);

    sum = sum + _amount;

    const credit = BigInt(Number(sum) - Number(amount));

    result.push({
      amount: _amount,
      sid: assetItem.atxoSid,
      commitment: assetItem.commitment,
    });

    if (credit >= 0) {
      break;
    }
  }

  return sum >= amount ? result : [];
};

export const getAmountFromCommitments = async (
  code: string,
  commitments: string[],
  anonKeys: FindoraWallet.FormattedAnonKeys,
) => {
  const unspentAbars = await getUnspentAbars(anonKeys, commitments);
  const balancesMaps = await getBalanceMaps(unspentAbars, anonKeys);
  const { atxoMap } = balancesMaps;

  const filteredUtxoList = atxoMap[code];

  if (!filteredUtxoList) {
    return [];
  }

  const sortedUtxoList = mergeSortAtxoList(filteredUtxoList);

  let sum = BigInt(0);

  for (let assetItem of sortedUtxoList) {
    const _amount = BigInt(assetItem.amount);

    sum = sum + _amount;
  }

  return sum;
};

export const decryptAbarMemo = async (
  abarMemoItem: FindoraWallet.AbarMemoItem,
  anonKeys: FindoraWallet.FormattedAnonKeys,
): Promise<FindoraWallet.DecryptedAbarMemoData | false> => {
  const ledger = await getLedger();

  const [atxoSid, myMemoData] = abarMemoItem;

  const aXfrKeyPair = await Keypair.getAXfrPrivateKeyByBase64(anonKeys.axfrSpendKey);

  const abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);

  let decryptedAbar: Uint8Array;

  try {
    decryptedAbar = ledger.try_decrypt_axfr_memo(abarOwnerMemo, aXfrKeyPair);
  } catch (error) {
    return false;
  }
  const result = {
    atxoSid,
    decryptedAbar,
    owner: anonKeys,
  };

  return result;
};

export const getCommitmentByAtxoSid = async (atxoSid: string): Promise<FindoraWallet.AtxoCommitmentItem> => {
  const ledger = await getLedger();

  const commitementResult = await Network.getAbarCommitment(`${atxoSid}`);
  console.log(
    '🚀 ~ file: tripleMasking.ts ~ line 1519 ~ getCommitmentByAtxoSid ~ commitementResult',
    commitementResult,
  );

  const { error, response } = commitementResult;

  if (error) {
    log('error', error);
    throw new Error(`could not get commitment by atxo sid. details: ${(error as Error).message}`);
  }
  if (!response) {
    throw new Error(`could not get commitment by atxo sid. no response retrieved`);
  }

  const commitmentInBase58 = ledger.base64_to_base58(response);

  // console.log(
  //   '🚀 ~ file: tripleMasking.ts ~ line 1531 ~ getCommitmentByAtxoSid ~ commitmentInBase58',
  //   commitmentInBase58,
  // );

  return {
    atxoSid,
    commitment: commitmentInBase58,
  };
};
