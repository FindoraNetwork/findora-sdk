import dotenv from 'dotenv';
import { getFeeInputs } from 'services/fee';
import sleep from 'sleep-promise';
import { Account, Asset, Keypair, Network, Staking, Transaction, TripleMasking } from '../api';
import Sdk from '../Sdk';
import { FileCacheProvider, MemoryCacheProvider } from '../services/cacheStore/providers';

dotenv.config();

const envConfigFile = process.env.INTEGRATION_ENV_NAME
  ? `../../.env_tm_integration_${process.env.INTEGRATION_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { keys: walletKeys, hostUrl: envHostUrl } = envConfig;

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  hostUrl: envHostUrl,
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

const waitingTimeBeforeCheckTxStatus = 19000;

console.log('🚀 ~ Findora Sdk is configured to use:', sdkEnv);

console.log(`Connecting to "${sdkEnv.hostUrl}"`);

Sdk.init(sdkEnv);

const { mainFaucet, senderOne } = walletKeys;

const password = 'yourSecretPassword';

/**
 * Create 4 Test BARs
 */
export const createTestBars = async () => {
  console.log('////////////////  createTestBars //////////////// ');

  const pkey = mainFaucet;
  const toPkeyMine = senderOne;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = fraCode;
  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  for (let i = 0; i < 4; i++) {
    const transactionBuilder = await Transaction.sendToAddress(
      walletInfo,
      toWalletInfo.address,
      '210',
      assetCode,
      assetBlindRules,
    );
    const resultHandle = await Transaction.submitTransaction(transactionBuilder);
    console.log('send fra result handle!!', resultHandle);
    await sleep(waitingTimeBeforeCheckTxStatus);
  }

  return true;
};

export const getAnonKeys = async () => {
  console.log('////////////////  getAnonKeys //////////////// ');

  const myAnonKeys = await TripleMasking.genAnonKeys();

  console.log('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
  return myAnonKeys;
};

export const barToAbar = async (AnonKeys: FindoraWallet.FormattedAnonKeys, isBalanceCheck: boolean) => {
  console.log('////////////////  barToAbar //////////////// ');

  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const balance = await Account.getBalance(walletInfo);
  //const fraCode = await Asset.getFraAssetCode();
  //console.log('BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);
  const { response: sids } = sidsResult;
  if (!sids) {
    console.log('ERROR no sids available');
    return false;
  }
  const sortedSids = sids.sort((a, b) => b - a);
  console.log('🚀 ~ barToAbar ~ sortedSids', sortedSids);
  const [sid] = sortedSids;

  const anonKeys = { ...AnonKeys };

  const {
    transactionBuilder,
    barToAbarData,
    sid: usedSid,
  } = await TripleMasking.barToAbar(walletInfo, sid, anonKeys);

  console.log('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
  console.log('🚀 ~ usedSid', usedSid);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send bar to abar result handle!!', resultHandle);

  const [givenCommitment] = barToAbarData.commitments;

  await sleep(waitingTimeBeforeCheckTxStatus);

  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);

  console.log('🚀 ~ barToAbar ~ ownedAbarsResponse', JSON.stringify(ownedAbarsResponse, null, 2));

  const ownedAbarsSaveResult = await TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbarsResponse);
  console.log('🚀 ~ barToAbar ~ ownedAbarsSaveResult', ownedAbarsSaveResult);

  if (isBalanceCheck) {
    const balanceResult = await barToAbarBalances(walletInfo, anonKeys, givenCommitment, balance);
    if (!balanceResult) {
      return false;
    }
    return true;
  } else {
    return givenCommitment;
  }
};

const barToAbarBalances = async (
  walletInfo: Keypair.WalletKeypar,
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitment: string,
  balance: string,
) => {
  const balanceNew = await Account.getBalance(walletInfo);
  console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
  console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
  const balanceChange = parseInt(balance.replace(/,/g, ''), 10) - parseInt(balanceNew.replace(/,/g, ''), 10);
  console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChange, ' FRA');

  if (balanceChange != 210) {
    console.log('BAR balance does not match expected value');
    return false;
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment]);
  const anonBalanceValue = parseInt(anonBalances.unSpentBalances.balances[0].amount);
  console.log('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, ' FRA');

  if (anonBalanceValue != 210 && anonBalanceValue != 209) {
    console.log('ABAR balance does not match expected value');
    return false;
  }

  return true;
};

export const abarToAbar = async (
  AnonKeys1: FindoraWallet.FormattedAnonKeys,
  AnonKeys2: FindoraWallet.FormattedAnonKeys,
) => {
  console.log('////////////////  AnonTransfer (abarToAbar) //////////////// ');

  const anonKeysSender = { ...AnonKeys1 };
  const anonKeysReceiver = { ...AnonKeys2 };

  const givenCommitmentToTransfer = (await barToAbar(anonKeysSender, false)) as string;

  //const givenCommitmentToTransfer = 'ePe-5CbvvSFrddkd3FzN6MPz5QvDOGuw1-THyti4OUE=';
  console.log('🚀 ~ abarToAbar ~ givenCommitmentToTransfer', givenCommitmentToTransfer);
  const givenCommitmentsListSender = [givenCommitmentToTransfer];
  /* const givenCommitmentsToPayFee = [
    'dWrhD9C5f2jgLkvq-CAndeanSyKml1eBRY9MBG9HqVQ=',
  ];

  const givenCommitmentsListSender = [givenCommitmentToTransfer, ...givenCommitmentsToPayFee];

  const additionalOwnedAbarItems = []; */

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentToTransfer);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;

  /* for (let givenCommitmentToPayFee of givenCommitmentsToPayFee) {
    const ownedAbarsResponseTwo = await TripleMasking.getOwnedAbars(givenCommitmentToPayFee);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }*/

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver,
    '50',
    ownedAbarToUseAsSource,
    //additionalOwnedAbarItems,
  );

  console.log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  console.log('transfer abar result handle!!', resultHandle);

  console.log(
    `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('now checking balances\n\n\n');

  const { commitmentsMap } = abarToAbarData;

  const retrievedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrievedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  console.log('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
  console.log('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  //console.log('🚀 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
  //console.log('🚀 ~ abarToAbar ~ balancesReceiver', balancesReceiver);

  const balanceSender = parseInt(balancesSender.balances[0].amount);
  const balanceReceiver = parseInt(balancesReceiver.balances[0].amount);

  if (balanceSender != 158 || balanceReceiver != 50) {
    console.log('ABAR balances does not match expected value');
    return false;
  }

  const isNullifierHashSpent = await validateSpent(anonKeysSender, givenCommitmentToTransfer);
  if (!isNullifierHashSpent) {
    console.log('Nullifier hash of sender still unspent');
    return false;
  }

  return true;
};

export const abarToBar = async (AnonKeys: FindoraWallet.FormattedAnonKeys) => {
  console.log('//////////////// abarToBar //////////////// ');

  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const anonKeysSender = { ...AnonKeys };

  const givenCommitment = (await barToAbar(anonKeysSender, false)) as string;

  const balance = await Account.getBalance(walletInfo);

  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
  const [ownedAbarToUseAsSource] = ownedAbarsResponse;
  //console.log('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);

  const { transactionBuilder, abarToBarData, receiverWalletInfo } = await TripleMasking.abarToBar(
    anonKeysSender,
    walletInfo,
    ownedAbarToUseAsSource,
  );

  console.log('🚀 ~ abarToBar ~ abarToBarData', abarToBarData);
  console.log('🚀 ~ abarToBar ~ receiverWalletInfo', receiverWalletInfo);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('abar to bar result handle!!!', resultHandle);

  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
  const balanceNew = await Account.getBalance(walletInfo);
  console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
  const balanceChange = parseInt(balanceNew.replace(/,/g, ''), 10) - parseInt(balance.replace(/,/g, ''), 10);
  console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChange, ' FRA');

  if (balanceChange != 210) {
    console.log('BAR balance does not match expected value');
    return false;
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeysSender, [givenCommitment]);
  console.log('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
  const anonBalanceValue = parseInt(anonBalances.spentBalances.balances[0].amount);
  if (anonBalanceValue != 210 && anonBalanceValue != 209) {
    console.log('ABAR balance does not match expected value');
    return false;
  }

  return true;
};

export const validateSpent = async (AnonKeys: FindoraWallet.FormattedAnonKeys, givenCommitment: string) => {
  const anonKeys = { ...AnonKeys };
  const axfrSecretKey = anonKeys.axfrSecretKey;
  const decKey = anonKeys.decKey;

  //const unspentAbars = await TripleMasking.getUnspentAbars(anonKeys, givenCommitment);
  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
  const [ownedAbarItem] = ownedAbarsResponse;
  const { abarData } = ownedAbarItem;
  const { atxoSid, ownedAbar } = abarData;

  const hash = await TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrSecretKey, decKey);
  const isNullifierHashSpent = await TripleMasking.isNullifierHashSpent(hash);

  return isNullifierHashSpent;
};

/*
// Define and Issue a custom asset
const defineIssueCustomAsset = async () => {
  const pkey = mainFaucet;

  const assetCode = await Asset.getRandomAssetCode();
  //const assetCode = CustomAssetCode;
  console.log('🚀 ~ defineCustomAsset ~ assetCode', assetCode);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('Our new asset created, handle - ! ! ', handle);

  const assetBlindRules = { isAmountBlind: false };
  const assetBuilderIssue = await Asset.issueAsset(walletInfo, assetCode, '5', assetBlindRules);

  const handleIssue = await Transaction.submitTransaction(assetBuilderIssue);

  console.log('Our issued tx handle IS', handleIssue);
};

// Send custom asset to a single recepient
 const transferCustomAssetToSingleRecepient = async () => {
  const pkey = senderOne;
  const toPkey = PKEY_MINE2;
  const customAssetCode = CustomAssetCode;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const assetCode = customAssetCode;

  const assetDetails = await Asset.getAssetDetails(customAssetCode);
  console.log('get custom asset details !', assetDetails);

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '0.1',
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send custom result handle', resultHandle);
};

// Get custom asset balance
const getCustomAssetBalance = async () => {
  const pkey = senderOne;
  const customAssetCode = CustomAssetCode;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS', balance);
};

// Get transaction status
const getTransactionStatus = async () => {
  const h = 'YOUR_TX_HASH';

  const txStatus = await Network.getTransactionStatus(h);

  console.log('transaction status', JSON.stringify(txStatus, null, 2));
};

const getFee = async () => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const feeInputsPayload = await getFeeInputs(walletInfo, 11, true);
  console.log('🚀 ~ getFee ~ feeInputsPayload', feeInputsPayload);
};
*/
