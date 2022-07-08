import dotenv from 'dotenv';
import sleep from 'sleep-promise';
import { Account, Asset, Keypair, Network, Transaction, TripleMasking } from '../api';
import Sdk from '../Sdk';
import { MemoryCacheProvider } from '../services/cacheStore/providers';
import { addUtxo } from '../services/utxoHelper';

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

const { mainFaucet } = walletKeys;

const password = 'yourSecretPassword';

export const createNewKeypair = async () => {
  const mm = await Keypair.getMnemonic(24);

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  console.log('new wallet info', walletInfo);

  return walletInfo;
};

/**
 * Create FRA Test BARs for Single Asset Integration Test
 */
export const createTestBars = async (senderOne: string) => {
  console.log('////////////////  Create Test Bars //////////////// ');

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

/**
 * Generate and return new set of Anon Keys
 */
export const getAnonKeys = async () => {
  console.log('//////////////// Generate Anon Keys //////////////// ');

  const myAnonKeys = await TripleMasking.genAnonKeys();

  console.log('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
  return myAnonKeys;
};

/**
 * Balance check for BAR to ABAR conversion Integration Test
 */
const barToAbarBalances = async (
  walletInfo: Keypair.WalletKeypar,
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitment: string,
  balance: string,
) => {
  const balanceNew = await Account.getBalance(walletInfo);
  console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
  console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
  const balanceChangeF = parseFloat(balance.replace(/,/g, '')) - parseFloat(balanceNew.replace(/,/g, ''));
  const balanceChange = Math.floor(balanceChangeF);
  console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');

  if (balanceChange != 210) {
    console.log('BAR balance does not match expected value');
    return false;
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment]);
  const anonBalUnspent = anonBalances.unSpentBalances.balances[0].amount;
  const anonBalanceValue = parseInt(anonBalUnspent.replace(/,/g, ''), 10);
  console.log('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, ' FRA');

  if (anonBalanceValue != 210 && anonBalanceValue != 209) {
    console.log('ABAR balance does not match expected value');
    return false;
  }

  return true;
};

/**
 * Given a commitment, check if nullifier is spent
 */
export const validateSpent = async (AnonKeys: FindoraWallet.FormattedAnonKeys, givenCommitment: string) => {
  const anonKeys = { ...AnonKeys };
  const axfrSecretKey = anonKeys.axfrSecretKey;
  const decKey = anonKeys.decKey;

  // const unspentAbars = await TripleMasking.getUnspentAbars(anonKeys, givenCommitment);
  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
  const [ownedAbarItem] = ownedAbarsResponse;
  const { abarData } = ownedAbarItem;
  const { atxoSid, ownedAbar } = abarData;

  const hash = await TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrSecretKey, decKey);
  const isNullifierHashSpent = await TripleMasking.isNullifierHashSpent(hash);

  return isNullifierHashSpent;
};

/**
 * BAR to ABAR conversion
 */
export const barToAbar = async (
  senderOne: string,
  AnonKeys: FindoraWallet.FormattedAnonKeys,
  isBalanceCheck: boolean,
  givenSid = 0,
) => {
  console.log('////////////////  BAR To ABAR conversion //////////////// ');

  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const balance = await Account.getBalance(walletInfo);

  let sid = givenSid;
  if (givenSid === 0) {
    const sidsResult = await Network.getOwnedSids(walletInfo.publickey);
    const { response: sids } = sidsResult;
    if (!sids) {
      console.log('ERROR no sids available');
      return false;
    }
    const sortedSids = sids.sort((a, b) => b - a);
    console.log('🚀 ~ barToAbar ~ sortedSids', sortedSids);
    [sid] = sortedSids;
  }

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

/**
 * Single Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
export const abarToAbar = async (
  senderOne: string,
  AnonKeys1: FindoraWallet.FormattedAnonKeys,
  AnonKeys2: FindoraWallet.FormattedAnonKeys,
) => {
  console.log('//////////////// Single Asset Anonymous Transfer (ABAR To ABAR) //////////////// ');

  const anonKeysSender = { ...AnonKeys1 };
  const anonKeysReceiver = { ...AnonKeys2 };

  const givenCommitmentToTransfer = (await barToAbar(senderOne, anonKeysSender, false)) as string;

  console.log('🚀 ~ abarToAbar ~ givenCommitmentToTransfer', givenCommitmentToTransfer);
  const givenCommitmentsListSender = [givenCommitmentToTransfer];

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentToTransfer);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver,
    '50',
    ownedAbarToUseAsSource,
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

  // Check ABAR balances and nullifier spending for sender and receiver
  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  // console.log('🚀 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
  // console.log('🚀 ~ abarToAbar ~ balancesReceiver', balancesReceiver);

  const balSender = balancesSender.balances[0].amount;
  const balanceSender = parseInt(balSender.replace(/,/g, ''), 10);

  const balReceiver = balancesReceiver.balances[0].amount;
  const balanceReceiver = parseInt(balReceiver.replace(/,/g, ''), 10);

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

/**
 * ABAR To BAR conversion Integration Test for FRA
 */
export const abarToBar = async (senderOne: string, AnonKeys: FindoraWallet.FormattedAnonKeys) => {
  console.log('//////////////// ABAR To BAR conversion //////////////// ');

  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const anonKeysSender = { ...AnonKeys };

  const givenCommitment = (await barToAbar(senderOne, anonKeysSender, false)) as string;

  const balance = await Account.getBalance(walletInfo);

  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
  const [ownedAbarToUseAsSource] = ownedAbarsResponse;
  // console.log('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);

  const { transactionBuilder, abarToBarData, receiverWalletInfo } = await TripleMasking.abarToBar(
    anonKeysSender,
    walletInfo,
    ownedAbarToUseAsSource,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('abar to bar result handle!!!', resultHandle);

  // Check BAR and ABAR balances, and nullifier spending
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
  const balanceNew = await Account.getBalance(walletInfo);
  console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
  const balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
  const balanceChange = Math.floor(balanceChangeF);
  console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');

  if (balanceChange != 209 && balanceChange != 210) {
    console.log('BAR balance does not match expected value');
    return false;
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeysSender, [givenCommitment]);
  console.log('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
  if (!anonBalances?.spentBalances?.balances?.length) {
    console.log('No ABAR spent balances available');
    return false;
  }

  const anonBalSpent = anonBalances.spentBalances.balances[0].amount;
  const anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);

  if (anonBalanceValue != 210 && anonBalanceValue != 209) {
    console.log('ABAR balance does not match expected value');
    return false;
  }

  const isNullifierHashSpent = await validateSpent(anonKeysSender, givenCommitment);
  if (!isNullifierHashSpent) {
    console.log('Nullifier hash of sender still unspent');
    return false;
  }

  return true;
};

/**
 * Define and Issue a custom asset
 */
const defineIssueCustomAsset = async (senderOne: string, assetCode: string) => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
  const handle = await Transaction.submitTransaction(assetBuilder);
  console.log('New asset ', assetCode, ' created, handle', handle);

  await sleep(waitingTimeBeforeCheckTxStatus);

  const assetBlindRules = { isAmountBlind: false };
  const assetBuilderIssue = await Asset.issueAsset(walletInfo, assetCode, '1000', assetBlindRules);

  const handleIssue = await Transaction.submitTransaction(assetBuilderIssue);

  console.log('Asset ', assetCode, ' issued, handle', handleIssue);
  await sleep(waitingTimeBeforeCheckTxStatus);
};

/**
 * Get available SIDs for a given custom asset and FRA
 */
const getSidsForAsset = async (senderOne: string, assetCode: string) => {
  const walletInfo = await Keypair.restoreFromPrivateKey(senderOne, password);
  const fraCode = await Asset.getFraAssetCode();

  const { response: sids } = await Network.getOwnedSids(walletInfo.publickey);
  const sidsResult = sids;
  if (!sidsResult) {
    console.log('ERROR no sids available');
    return [[], []];
  }

  const utxoDataList = await addUtxo(walletInfo, sidsResult);

  const fraSids = [];
  const customAssetSids = [];
  for (const utxoItem of utxoDataList) {
    const utxoAsset = utxoItem['body']['asset_type'];
    if (utxoAsset === fraCode) {
      fraSids.push(utxoItem['sid']);
    }

    if (utxoAsset === assetCode) {
      customAssetSids.push(utxoItem['sid']);
    }
  }
  console.log('FRA Sids: ', fraSids, '; Custom Asset Sids: ', customAssetSids);

  return [fraSids, customAssetSids];
};

/**
 * Create FRA Test BARs and Issue Custom Asset for Multi Asset Integration Test
 */
export const createTestBarsMulti = async (senderOne: string, asset1Code: string) => {
  console.log('//////////////// Issue Custom Asset and Create Test Bars //////////////// ');

  const pkey = mainFaucet;
  const toPkeyMine = senderOne;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = fraCode;
  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '210',
    assetCode,
    assetBlindRules,
  );
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  console.log('send fra result handle!!', resultHandle);

  const balance1Old = await Account.getBalance(toWalletInfo, asset1Code);
  await defineIssueCustomAsset(senderOne, asset1Code);

  const balance1New = await Account.getBalance(toWalletInfo, asset1Code);
  const balance1ChangeF =
    parseFloat(balance1New.replace(/,/g, '')) - parseFloat(balance1Old.replace(/,/g, ''));
  const balance1Change = Math.floor(balance1ChangeF);

  console.log(
    'Custom Asset1 Old Balance = ',
    balance1Old,
    '; Custom Asset1 New Balance = ',
    balance1New,
    '; Custom Asset1 Balance Change = ',
    balance1ChangeF,
  );

  if (balance1Change != 1000) {
    console.log('Custom Asset BAR balance does not match expected value');
    return false;
  }

  return true;
};

/**
 * Multi/Custom Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
export const abarToAbarMulti = async (
  senderOne: string,
  AnonKeys1: FindoraWallet.FormattedAnonKeys,
  AnonKeys2: FindoraWallet.FormattedAnonKeys,
  asset1Code: string,
) => {
  console.log('////////////////  Multi Asset Anon Transfer (abarToAbar) //////////////// ');

  const anonKeysSender = { ...AnonKeys1 };
  const anonKeysReceiver = { ...AnonKeys2 };

  const [_fraSids, customAssetSids] = await getSidsForAsset(senderOne, asset1Code);
  const customAssetSid = customAssetSids.sort((a, b) => b - a)[0];
  const givenCommitmentToTransfer = (await barToAbar(
    senderOne,
    anonKeysSender,
    false,
    customAssetSid,
  )) as string;

  const [fraSids, _customAssetSids] = await getSidsForAsset(senderOne, asset1Code);
  const fraSid = fraSids.sort((a, b) => b - a)[0];
  const givenCommitmentsToPayFee = [(await barToAbar(senderOne, anonKeysSender, false, fraSid)) as string];

  console.log('🚀 ~ abarToAbar ~ Given ABAR commitment To Transfer', givenCommitmentToTransfer);
  console.log('🚀 ~ abarToAbar ~ Given FRA ABAR Commitment', givenCommitmentsToPayFee);

  const givenCommitmentsListSender = [givenCommitmentToTransfer, ...givenCommitmentsToPayFee];

  const additionalOwnedAbarItems = [];

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentToTransfer);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;

  for (let givenCommitmentToPayFee of givenCommitmentsToPayFee) {
    const ownedAbarsResponseFee = await TripleMasking.getOwnedAbars(givenCommitmentToPayFee);

    const [additionalOwnedAbarItem] = ownedAbarsResponseFee;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver,
    '1000',
    ownedAbarToUseAsSource,
    additionalOwnedAbarItems,
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

  // Check ABAR balances and nullifier spending for sender and receiver
  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  console.log('🚀 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
  console.log('🚀 ~ abarToAbar ~ balancesReceiver', balancesReceiver);

  const fraBalSend = balancesSender.balances[0].amount;
  const fraBalanceSender = parseInt(fraBalSend.replace(/,/g, ''), 10);

  const customBalReceive = balancesReceiver.balances[0].amount;
  const customBalanceReceiver = parseInt(customBalReceive.replace(/,/g, ''), 10);

  const senderCustomBalances = await TripleMasking.getAllAbarBalances(anonKeysSender, [
    givenCommitmentToTransfer,
  ]);

  console.log('🚀 Custom Asset spent balances for sender after transfer', senderCustomBalances.spentBalances);

  if (!senderCustomBalances?.spentBalances?.balances?.length) {
    console.log('No ABAR spent balances available');
    return false;
  }
  const sendercustomSpent = senderCustomBalances.spentBalances.balances[0].amount;
  const customSpentSender = parseInt(sendercustomSpent.replace(/,/g, ''), 10);

  if (customSpentSender != 1000 || customBalanceReceiver != 1000) {
    console.log('ABAR balances does not match expected value');
    return false;
  }

  if (fraBalanceSender != 209 && fraBalanceSender != 208) {
    console.log('Sender FRA ABAR balance does not match expected value');
    return false;
  }

  const isNullifierHashSpent = await validateSpent(anonKeysSender, givenCommitmentToTransfer);
  if (!isNullifierHashSpent) {
    console.log('Custom Asset Nullifier hash of sender still unspent');
    return false;
  }

  const isFraNullifierHashSpent = await validateSpent(anonKeysSender, givenCommitmentsToPayFee[0]);
  if (!isFraNullifierHashSpent) {
    console.log('FRA Nullifier hash of sender still unspent');
    return false;
  }

  return true;
};

export const getRandomAssetCode = async () => {
  const asset1Code = await Asset.getRandomAssetCode();
  return asset1Code;
};