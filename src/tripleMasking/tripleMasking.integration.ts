import dotenv from 'dotenv';
import { Account, Asset, Keypair, Network, Transaction, TripleMasking } from '../api';
import { waitForBlockChange } from '../evm/testHelpers';
import Sdk from '../Sdk';
import { MemoryCacheProvider } from '../services/cacheStore/providers';
import { log } from '../services/utils';
import { addUtxo } from '../services/utxoHelper';
import * as FindoraWallet from '../types/findoraWallet';

import { create as createBigNumber } from '../services/bigNumber';

dotenv.config();

const envConfigFile = process.env.INTEGRATION_ENV_NAME
  ? `../../.env_tm_integration_${process.env.INTEGRATION_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { keys: walletKeys, hostUrl: envHostUrl } = envConfig;

const sdkEnv = {
  hostUrl: envHostUrl,
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

log('🚀 ~ Findora Sdk is configured to use:', sdkEnv);

log(`Connecting to "${sdkEnv.hostUrl}"`);

Sdk.init(sdkEnv);

const { mainFaucet } = walletKeys;

const password = 'yourSecretPassword';

export const getRandomAssetCode = async () => {
  const asset1Code = await Asset.getRandomAssetCode();
  return asset1Code;
};

export const getDerivedAssetCode = async (asset1Code: string) => {
  const derivedAsset1Code = await Asset.getDerivedAssetCode(asset1Code);
  return derivedAsset1Code;
};

export const getAnonKeys = async () => {
  log('//////////////// Generate Anon Keys //////////////// ');

  const myAnonKeys = await TripleMasking.genAnonKeys();

  log('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
  return myAnonKeys;
};

export const createNewKeypair = async () => {
  const mm = await Keypair.getMnemonic(24);

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  log('new wallet info', walletInfo);

  return walletInfo;
};

export const defineCustomAsset = async (senderOne: string, assetCode: string) => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
  const handle = await Transaction.submitTransaction(assetBuilder);
  log('New asset ', assetCode, ' created, handle', handle);

  await waitForBlockChange();
};

export const issueCustomAsset = async (
  senderOne: string,
  assetCode: string,
  derivedAssetCode: string,
  amount: string,
) => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };
  const assetBuilderIssue = await Asset.issueAsset(walletInfo, derivedAssetCode, amount, assetBlindRules);

  const handleIssue = await Transaction.submitTransaction(assetBuilderIssue);

  log('Asset ', assetCode, ' issued, handle', handleIssue);

  await waitForBlockChange();
};

const barToAbarBalances = async (
  walletInfo: Keypair.WalletKeypar,
  anonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitments: string[],
  balance: string,
  givenBalanceChange: string,
  assetCode: string,
  extraSpent?: string,
) => {
  const fraAssetCode = await Asset.getFraAssetCode();
  const isFraCheck = fraAssetCode === assetCode;

  await waitForBlockChange();

  const balanceNew = await Account.getBalance(walletInfo, assetCode);
  log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ` ${assetCode}`);
  log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ` ${assetCode}`);

  const balanceChangeF = parseFloat(balance.replace(/,/g, '')) - parseFloat(balanceNew.replace(/,/g, ''));
  log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ` ${assetCode}`);

  const realBalanceChange = createBigNumber(createBigNumber(balanceChangeF).toPrecision(7));

  const expectedBalanceChange = createBigNumber(givenBalanceChange);
  let expectedBarBalanceChange = expectedBalanceChange.toPrecision(7);

  if (isFraCheck) {
    const barToBarFeeAmount = createBigNumber('0.02'); // current bar to abar fee
    const extraSpentAmount = createBigNumber(extraSpent || '0');

    expectedBarBalanceChange = expectedBalanceChange
      .plus(barToBarFeeAmount)
      .plus(extraSpentAmount)
      .toPrecision(7);
  }

  if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
    const message = `BAR balance of ${realBalanceChange.toString()} does not match expected value ${expectedBarBalanceChange.toString()}`;
    log(message);
    throw new Error(message);
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeys, givenCommitments);
  const anonBalUnspent = anonBalances.unSpentBalances.balances[0].amount;
  const anonBalanceValue = anonBalUnspent.replace(/,/g, '');
  log('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, ` ${assetCode}`);

  const realAnonBalanceValue = createBigNumber(anonBalanceValue);
  if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
    const message = `ABAR balance does not match expected value, real is ${realAnonBalanceValue.toString()} and expected is ${expectedBalanceChange.toString()}`;
    log(message);
    throw new Error(message);
  }

  return true;
};

export const validateSpent = async (
  AnonKeys: FindoraWallet.FormattedAnonKeys,
  givenCommitments: string[],
) => {
  const anonKeys = { ...AnonKeys };
  const axfrKeyPair = anonKeys.axfrSpendKey;

  for (const givenCommitment of givenCommitments) {
    const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
    const [ownedAbarItem] = ownedAbarsResponse;
    const { abarData } = ownedAbarItem;
    const { atxoSid, ownedAbar } = abarData;

    const hash = await TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrKeyPair);
    const result = await TripleMasking.isNullifierHashSpent(hash);

    if (!result) {
      throw new Error(`hash for commitment ${givenCommitment} is still unspent`);
    }
  }
  return true;
};

export const getSidsForSingleAsset = async (senderOne: string, assetCode: string) => {
  log(`//////////////// Get sids for asset ${assetCode} //////////////// `);
  const walletInfo = await Keypair.restoreFromPrivateKey(senderOne, password);

  const { response: sids } = await Network.getOwnedSids(walletInfo.publickey);
  if (!sids) {
    console.log('ERROR no sids available');
    return [];
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const customAssetSids = [];
  for (const utxoItem of utxoDataList) {
    const utxoAsset = utxoItem['body']['asset_type'];

    if (utxoAsset === assetCode) {
      customAssetSids.push(utxoItem['sid']);
    }
  }
  return customAssetSids.sort((a, b) => a - b);
};

// External Tests
export const createTestBars = async (givenSenderOne?: string, amount = '210', iterations = 4) => {
  log('////////////////  Create Test Bars //////////////// ');

  const pkey = mainFaucet;
  let toPkeyMine = givenSenderOne;

  if (!givenSenderOne) {
    const senderWalletInfo = await createNewKeypair();

    toPkeyMine = senderWalletInfo.privateStr!;
  }

  if (!toPkeyMine) {
    throw new Error('Sender private key is not specified');
  }
  const formattedAmount = createBigNumber(amount);
  const expectedBalance = formattedAmount.multipliedBy(iterations);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = fraCode;
  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  for (let i = 0; i < iterations; i++) {
    const transactionBuilder = await Transaction.sendToAddress(
      walletInfo,
      toWalletInfo.address,
      amount,
      assetCode,
      assetBlindRules,
    );
    const resultHandle = await Transaction.submitTransaction(transactionBuilder);
    log('🚀 ~ createTestBars ~ send fra result handle!!', resultHandle);

    await waitForBlockChange();
  }

  await waitForBlockChange();
  await waitForBlockChange();

  const assetBalance = await Account.getBalance(toWalletInfo, fraCode);

  log(`🚀 ~ createTestBars ~ "${fraCode}" assetBalance `, assetBalance);

  const cleanedBalanceValue = assetBalance.replace(/,/g, '');
  log('🚀 ~ createTestBars ~ cleanedBalanceValue', cleanedBalanceValue);

  const realBalance = createBigNumber(cleanedBalanceValue);

  log('🚀 ~ createTestBars ~ realBalance', realBalance.toString());
  log('🚀 ~ createTestBars ~ expectedBalance', expectedBalance.toString());

  const isFunded = expectedBalance.isEqualTo(realBalance);

  if (!isFunded) {
    const errorMessage = `Expected FRA balance is ${expectedBalance.toString()} but we have ${realBalance.toString()}`;
    throw Error(errorMessage);
  }

  return isFunded;
};

export const barToAbar = async (
  givenSenderOne?: string,
  AnonKeys?: FindoraWallet.FormattedAnonKeys,
  givenSids?: number[],
  givenBalanceChange?: string,
  givenAssetCode?: string,
  isBalanceCheck = true,
) => {
  log('////////////////  BAR To ABAR conversion //////////////// ');

  const anonKeys = AnonKeys ? { ...AnonKeys } : { ...(await getAnonKeys()) };

  let senderOne = givenSenderOne;

  if (!givenSenderOne) {
    const senderWalletInfo = await createNewKeypair();

    senderOne = senderWalletInfo.privateStr!;
  }

  if (!senderOne) {
    throw new Error('Sender private key is not specified');
  }

  let sids = givenSids;
  let balanceChange = givenBalanceChange;

  const walletInfo = await Keypair.restoreFromPrivateKey(senderOne, password);

  const weOnlyHaveSid = givenSids && !givenBalanceChange;
  const weOnlyHaveBalanceChange = !givenSids && givenBalanceChange;

  const weHaveUncomplete = weOnlyHaveSid || weOnlyHaveBalanceChange;

  if (weHaveUncomplete) {
    throw new Error('either both SID and BALANCE CHANGE must be provided or none of them');
  }

  let assetCode = givenAssetCode;

  if (!givenAssetCode) {
    assetCode = await Asset.getFraAssetCode();
  }

  if (!assetCode) {
    throw new Error('We dont have asset code and cant check the balance');
  }

  let balance = await Account.getBalance(walletInfo, assetCode);

  if (!givenSids && !givenBalanceChange) {
    await createTestBars(senderOne, '10', 2);
    const fraSids = await getSidsForSingleAsset(senderOne, assetCode);
    log('🚀 ~ all fraAssetSids', fraSids);

    const fraSid = fraSids.sort((a, b) => a - b)[0];
    sids = [fraSid];
    log('🚀 ~ sids to use ', sids);
    balanceChange = '10';
    log('🚀 ~ balanceChange to use', balanceChange);

    balance = await Account.getBalance(walletInfo);
  }

  if (!sids || !balanceChange) {
    throw new Error('no sid or balance change exist. cant perform bar to abar');
  }

  log('🚀 ~ final balanceChange', balanceChange);
  log('🚀 ~ final sids ', sids);

  const {
    transactionBuilder,
    barToAbarData,
    sids: usedSids,
  } = await TripleMasking.barToAbar(walletInfo, sids, anonKeys.axfrPublicKey);

  log('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
  log('🚀 ~ usedSids', usedSids.join(','));

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('send bar to abar result handle!!', resultHandle);

  const givenCommitments = barToAbarData.commitments;

  await waitForBlockChange();

  if (isBalanceCheck) {
    await barToAbarBalances(walletInfo, anonKeys, givenCommitments, balance, balanceChange, assetCode);
  }

  return givenCommitments;
};

export const abarToAbar = async (givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys) => {
  log('//////////////// Single Asset Anonymous Transfer (ABAR To ABAR) //////////////// ');
  const senderWalletInfo = await createNewKeypair();
  const senderOne = senderWalletInfo.privateStr!;

  const anonKeysSender = await getAnonKeys();

  const generatedAnonKeysReceiver = await getAnonKeys();
  const anonKeysReceiver = givenAnonKeysReceiver
    ? { ...givenAnonKeysReceiver }
    : { ...generatedAnonKeysReceiver };

  const fraAssetCode = await Asset.getFraAssetCode();

  await createTestBars(senderOne, '10', 2);
  const fraSids = await getSidsForSingleAsset(senderOne, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraSids);

  const fraSid = fraSids.sort((a, b) => b - a)[0];

  const givenCommitmentsToTransfer = await barToAbar(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode);

  log('🚀 ~ abarToAbar ~ givenCommitmentsToTransfer', givenCommitmentsToTransfer);
  const givenCommitmentsListSender = [...givenCommitmentsToTransfer];

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0]);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '8',
    [ownedAbarToUseAsSource],
  );

  log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  log('transfer abar result handle!!', resultHandle);

  log(`will wait for the next block and then check balances for both sender and receiver commitments`);

  await waitForBlockChange(2);

  log('//////////////// now checking balances ///////////////////\n\n\n');

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

  log('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
  log('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  log('🚀 ~ abarToAbar ~ balancesSender', JSON.stringify(balancesSender, null, 2));

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
  log('🚀 ~ abarToAbar ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));

  const balSender = balancesSender.balances[0].amount;
  console.log('🚀 ~ balSender', balSender);
  const balanceSender = balSender.replace(/,/g, '');

  const balReceiver = balancesReceiver.balances[0].amount;
  console.log('🚀 ~ balReceiver', balReceiver);

  const balanceReceiver = balReceiver.replace(/,/g, '');

  const expectedBalanceSender = createBigNumber('1.2');
  const expectedBalanceReceiver = createBigNumber('8');
  const realBalanceSender = createBigNumber(balanceSender);
  const realBalanceReceiver = createBigNumber(balanceReceiver);

  if (!realBalanceSender.isEqualTo(expectedBalanceSender)) {
    const message = `sender ABAR balance ${expectedBalanceSender.toString()} does not match expected ${realBalanceSender.toString()}`;
    log(message);
    throw new Error(message);
  }

  if (!realBalanceReceiver.isEqualTo(expectedBalanceReceiver)) {
    const message = `receiver ABAR balance ${expectedBalanceReceiver.toString()} does not match expected ${realBalanceReceiver.toString()}`;
    log(message);
    throw new Error(message);
  }

  // it would throw an error if it is unspent
  await validateSpent(anonKeysSender, givenCommitmentsToTransfer);

  return true;
};

export const abarToAbarMulti = async (givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys) => {
  log('////////////////  Multi Asset Anon Transfer (abarToAbar) //////////////// ');
  const anonKeysSender = await getAnonKeys();

  const generatedAnonKeysReceiver = await getAnonKeys();
  const anonKeysReceiver = givenAnonKeysReceiver
    ? { ...givenAnonKeysReceiver }
    : { ...generatedAnonKeysReceiver };

  const asset1Code = await Asset.getRandomAssetCode();

  const senderWalletInfo = await createNewKeypair();

  const fraAssetCode = await Asset.getFraAssetCode();

  const senderOne = senderWalletInfo.privateStr!;
  const derivedAssetCode = await Asset.getDerivedAssetCode(asset1Code);

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(senderOne, '10', 5);

  log('//////////////// defining and issuing custom asset ////////////// ');
  await defineCustomAsset(senderOne, asset1Code);
  await issueCustomAsset(senderOne, asset1Code, derivedAssetCode, '10');
  await issueCustomAsset(senderOne, asset1Code, derivedAssetCode, '5');
  await issueCustomAsset(senderOne, asset1Code, derivedAssetCode, '20');

  const customAssetSids = await getSidsForSingleAsset(senderOne, derivedAssetCode);
  log('🚀 ~ all customAssetSids', customAssetSids);

  const customAssetSid = customAssetSids.sort((a, b) => b - a)[0];

  const givenCommitmentsToTransfer = await barToAbar(
    senderOne,
    anonKeysSender,
    [customAssetSid],
    '20',
    derivedAssetCode,
  );

  await waitForBlockChange();

  const fraSids = await getSidsForSingleAsset(senderOne, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraSids);

  const fraSid = fraSids.sort((a, b) => a - b)[0];

  const givenCommitmentsToPayFee = await barToAbar(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode);

  log('🚀 ~ abarToAbarMulti ~ Given ABAR commitments To Transfer', givenCommitmentsToTransfer);
  log('🚀 ~ abarToAbarMulti ~ Given FRA ABAR Commitment', givenCommitmentsToPayFee);

  const givenCommitmentsListSender = [givenCommitmentsToTransfer[0], ...givenCommitmentsToPayFee];

  const balancesSenderBefore = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  log('🚀 ~ abarToAbarMulti ~ balancesSenderBefore', JSON.stringify(balancesSenderBefore, null, 2));
  const additionalOwnedAbarItems = [];

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0]);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;

  additionalOwnedAbarItems.push(ownedAbarToUseAsSource);

  for (let givenCommitmentToPayFee of givenCommitmentsToPayFee) {
    const ownedAbarsResponseFee = await TripleMasking.getOwnedAbars(givenCommitmentToPayFee);

    const [additionalOwnedAbarItem] = ownedAbarsResponseFee;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '2',
    additionalOwnedAbarItems,
  );

  log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  log('transfer abar result handle!!', resultHandle);

  log(`will wait for the next block and then check balances for both sender and receiver commitments`);

  await waitForBlockChange(2);

  log('////////////////////// now checking balances///////////////////// \n\n\n');

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

  log('🚀 ~ abarToAbarMulti ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
  log('🚀 ~ abarToAbarMulti ~ givenCommitmentsListSender', givenCommitmentsListSender);

  log('////////////////// checking sender balances ///////////////////////');
  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  log('🚀 ~ abarToAbarMulti ~ balancesSender', JSON.stringify(balancesSender, null, 2));

  const fraBalSend = balancesSender.balances[0].amount;
  const fraBalanceSender = fraBalSend.replace(/,/g, '');
  console.log('🚀 ~ abarToAbarMulti ~ fraBalanceSender', fraBalanceSender);

  const fraBalanceSenderConverted = createBigNumber(fraBalanceSender);
  const minimumExpectedSenderFraBalance = createBigNumber('8.8'); // 10 - fee (about 1.2 fra) = 8.8

  if (!fraBalanceSenderConverted.isGreaterThanOrEqualTo(minimumExpectedSenderFraBalance)) {
    const message = 'Sender FRA ABAR balance does not match expected value';
    log(message);
    throw new Error(message);
  }

  const senderCustomBalances = await TripleMasking.getAllAbarBalances(
    anonKeysSender,
    givenCommitmentsToTransfer,
  );
  console.log('🚀 ~ abarToAbarMulti ~ senderCustomBalances', JSON.stringify(senderCustomBalances, null, 2));

  if (!senderCustomBalances?.spentBalances?.balances?.length) {
    const message = 'No ABAR spent balances available';
    log(message);
    throw new Error(message);
  }

  const sendercustomSpent = senderCustomBalances.spentBalances.balances[0].amount;
  console.log('🚀 ~ abarToAbarMulti  ~ sendercustomSpent', sendercustomSpent);
  const customSpentSender = sendercustomSpent.replace(/,/g, '');
  console.log('🚀 ~ abarToAbarMulti ~ customSpentSender', customSpentSender);

  const customBalanceSenderConverted = createBigNumber(customSpentSender);
  const expectedSenderCustomBalance = createBigNumber('20');

  if (!customBalanceSenderConverted.isEqualTo(expectedSenderCustomBalance)) {
    const message = 'ABAR balances does not match expected value';
    log(message);
    throw new Error(message);
  }

  log('////////////////// checking receiver balances ///////////////////////');
  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
  log('🚀 ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));

  const customBalReceive = balancesReceiver.balances[0].amount;
  const customBalanceReceiver = customBalReceive.replace(/,/g, '');

  const customBalanceReceiverConverted = createBigNumber(customBalanceReceiver);
  const expectedReceiverCustomBalance = createBigNumber('2');

  if (!customBalanceReceiverConverted.isEqualTo(expectedReceiverCustomBalance)) {
    const message = 'Receiver custom balance does not match expected value';
    log(message);
    throw new Error(message);
  }

  log('////////////////// checking spent validation ///////////////////////');

  // it would throw an error if it is unspent
  await validateSpent(anonKeysSender, givenCommitmentsToTransfer);

  // it would throw an error if it is unspent
  await validateSpent(anonKeysSender, givenCommitmentsToPayFee);

  return true;
};

export const abarToAbarFraMultipleFraAtxoForFeeSendAmount = async (
  givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys,
) => {
  const generatedAnonKeysReceiver = await getAnonKeys();
  const anonKeysReceiver = givenAnonKeysReceiver
    ? { ...givenAnonKeysReceiver }
    : { ...generatedAnonKeysReceiver };

  const anonKeysSender = await getAnonKeys();
  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const fraAssetCode = await Asset.getFraAssetCode();

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 5);

  log('//////////////// bar to abar fra asset transfer ///////////////// ');

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;

  const fraAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour],
    '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
    fraAssetCode,
  );

  await waitForBlockChange();

  const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  log('////////////////////// bar to abar is done, sending abar to abar //////////////');
  const assetCodeToUse = fraAssetCode;
  const amountToSend = '23.15';

  const payload = await TripleMasking.getAbarToAbarAmountPayload(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  const { additionalAmountForFee: totalExpectedFee } = payload;

  log('totalExpectedFee for abar to abar', totalExpectedFee);

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  log('transfer abar result handle!!', resultHandle);

  await waitForBlockChange(2);

  log('/////////////////// now checking balances //////////// \n\n\n ');
  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  const balancesReceiverAfter = await TripleMasking.getBalance(
    anonKeysReceiver,
    retrivedCommitmentsListReceiver,
  );
  log('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));

  const receiverExpectedFraAbarBalanceTransfer = createBigNumber(amountToSend);

  const fraAbarAmountAfterTransfer = balancesReceiverAfter?.balances.find(
    element => element.assetType === assetCodeToUse,
  )?.amount;

  if (!fraAbarAmountAfterTransfer) {
    throw new Error(
      `Receiver is expected to have ${receiverExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`,
    );
  }

  const realReceiverFraAbarBalance = createBigNumber(fraAbarAmountAfterTransfer);

  const isReceiverHasProperFraBalanceAfter = realReceiverFraAbarBalance.isEqualTo(
    receiverExpectedFraAbarBalanceTransfer,
  );

  if (!isReceiverHasProperFraBalanceAfter) {
    throw new Error(
      `Receiver is expected to have ${receiverExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realReceiverFraAbarBalance.toString()}'`,
    );
  }

  const balancesSenderAfter = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  log('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));

  const senderExpectedFraAbarBalanceTransfer = createBigNumber('15.65'); // 40 - 23.15 = 15.85 - 1.2 total fee = 15.65

  const fraAbarAmountAfterTransferSender = balancesSenderAfter?.balances.find(
    element => element.assetType === assetCodeToUse,
  )?.amount;

  if (!fraAbarAmountAfterTransferSender) {
    throw new Error(
      `Sender is expected to have ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransferSender}'`,
    );
  }

  const realSenderFraAbarBalanceAfter = createBigNumber(fraAbarAmountAfterTransferSender);

  const isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(
    senderExpectedFraAbarBalanceTransfer,
  );

  if (!isSenderHasProperFraBalanceAfter) {
    throw new Error(
      `Sender is expected to have at least ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realSenderFraAbarBalanceAfter.toString()}'`,
    );
  }

  return true;
};

export const abarToAbarCustomMultipleFraAtxoForFeeSendAmount = async (
  givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys,
) => {
  const generatedAnonKeysReceiver = await getAnonKeys();
  const anonKeysReceiver = givenAnonKeysReceiver
    ? { ...givenAnonKeysReceiver }
    : { ...generatedAnonKeysReceiver };

  const anonKeysSender = await getAnonKeys();
  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  const fraAssetCode = await Asset.getFraAssetCode();

  const assetCodeToUse = derivedAssetCode;

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 5);

  log('//////////////// defining and issuing custom asset ////////////// ');
  await defineCustomAsset(pkey, assetCode);
  await issueCustomAsset(pkey, assetCode, assetCodeToUse, '10');
  await issueCustomAsset(pkey, assetCode, assetCodeToUse, '5');
  await issueCustomAsset(pkey, assetCode, assetCodeToUse, '20');

  const expectedSenderBalance = createBigNumber('35');

  const assetBalance = await Account.getBalance(senderWalletInfo, assetCodeToUse);

  log(`sender bar "${assetCodeToUse}" assetBalance before transfer (after issuing the asset)`, assetBalance);

  const realSenderBalance = createBigNumber(assetBalance);
  const isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);

  if (!isSenderFunded) {
    const errorMessage = `Expected bar ${assetCodeToUse} balance is ${expectedSenderBalance.toString()} but it has ${realSenderBalance.toString()}`;
    throw Error(errorMessage);
  }

  log('//////////////// bar to abar custom asset transfer ///////////////// ');

  const customAssetSids = await getSidsForSingleAsset(pkey, assetCodeToUse);
  log('🚀 ~ all customAssetSids', customAssetSids);

  const customAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    [...customAssetSids],
    '35',
    derivedAssetCode,
  );

  log('//////////////// bar to abar fra asset transfer ///////////////// ');

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;

  const expectedFraBalanceAfterBarToAbar = '40';

  const fraAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour],
    expectedFraBalanceAfterBarToAbar,
    fraAssetCode,
  );

  await waitForBlockChange();

  const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];

  log('////////////////////// bar to abar is done, sending abar to abar //////////////');
  const amountToSend = '22.14';

  const payload = await TripleMasking.getAbarToAbarAmountPayload(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  const { additionalAmountForFee: totalExpectedFee } = payload;

  log('totalExpectedFee for abar to abar', totalExpectedFee);

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  log('transfer abar result handle!!', resultHandle);

  await waitForBlockChange(2);

  log('/////////////////// now checking balances //////////// \n\n\n ');
  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  const balancesReceiverAfter = await TripleMasking.getBalance(
    anonKeysReceiver,
    retrivedCommitmentsListReceiver,
  );
  log('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));

  const receiverExpectedCustomAbarBalanceTransfer = createBigNumber(amountToSend);

  const customAbarAmountAfterTransfer = balancesReceiverAfter?.balances.find(
    element => element.assetType === assetCodeToUse,
  )?.amount;

  if (!customAbarAmountAfterTransfer) {
    throw new Error(
      `Receiver is expected to have ${receiverExpectedCustomAbarBalanceTransfer.toString()} ABAR custom but it has '${customAbarAmountAfterTransfer}'`,
    );
  }

  const realReceiverCustomAbarBalance = createBigNumber(customAbarAmountAfterTransfer);

  const isReceiverHasProperCustomBalanceAfter = realReceiverCustomAbarBalance.isEqualTo(
    receiverExpectedCustomAbarBalanceTransfer,
  );

  if (!isReceiverHasProperCustomBalanceAfter) {
    throw new Error(
      `Receiver is expected to have ${receiverExpectedCustomAbarBalanceTransfer.toString()} ABAR custom but it has '${realReceiverCustomAbarBalance.toString()}'`,
    );
  }

  const balancesSenderAfter = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  log('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));

  const senderExpectedFraAbarBalanceTransfer = createBigNumber('38.5'); // 40 - 1.5 total fee = 38.5

  const fraAbarAmountAfterTransferSender = balancesSenderAfter?.balances.find(
    element => element.assetType === fraAssetCode,
  )?.amount;

  if (!fraAbarAmountAfterTransferSender) {
    throw new Error(
      `Sender is expected to have ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransferSender}'`,
    );
  }

  const realSenderFraAbarBalanceAfter = createBigNumber(fraAbarAmountAfterTransferSender);

  const isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(
    senderExpectedFraAbarBalanceTransfer,
  );

  if (!isSenderHasProperFraBalanceAfter) {
    throw new Error(
      `Sender is expected to have at least ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realSenderFraAbarBalanceAfter.toString()}'`,
    );
  }

  const senderExpectedCustomAbarBalanceTransfer = createBigNumber('12.86'); // 35 - 22.14 = 12.86

  const customAbarAmountAfterTransferSender = balancesSenderAfter?.balances.find(
    element => element.assetType === assetCodeToUse,
  )?.amount;

  if (!customAbarAmountAfterTransferSender) {
    throw new Error(
      `Sender is expected to have ${senderExpectedCustomAbarBalanceTransfer.toString()} custom ABAR but it has '${customAbarAmountAfterTransferSender}'`,
    );
  }

  const realSenderCustomAbarBalanceAfter = createBigNumber(customAbarAmountAfterTransferSender);

  const isSenderHasProperCustomBalanceAfter = realSenderCustomAbarBalanceAfter.isEqualTo(
    senderExpectedCustomAbarBalanceTransfer,
  );

  if (!isSenderHasProperCustomBalanceAfter) {
    throw new Error(
      `Sender is expected to have ${senderExpectedCustomAbarBalanceTransfer.toString()} custom ABAR but it has '${realSenderCustomAbarBalanceAfter.toString()}'`,
    );
  }

  return true;
};

export const abarToBar = async () => {
  log('//////////////// ABAR To BAR conversion //////////////// ');
  const anonKeysSender = await getAnonKeys();
  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const fraAssetCode = await Asset.getFraAssetCode();

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  // we create 4 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 4);

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;

  const givenCommitments = await barToAbar(
    pkey,
    anonKeysSender,
    [fAssetSidOne, fAssetSidTwo, fAssetSidThree],
    '30',
    fraAssetCode,
  );
  console.log('🚀 ~ givenCommitments', givenCommitments);

  const [givenCommitment, givenCommitmentOne] = givenCommitments;

  const balance = await Account.getBalance(walletInfo);

  const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);
  const [ownedAbarToUseAsSource] = ownedAbarsResponse;

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentOne);
  const [ownedAbarToUseAsSourceOne] = ownedAbarsResponseOne;

  log('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);
  log('🚀 ~ abarToBar ~ ownedAbarToUseAsSourceOne', ownedAbarToUseAsSourceOne);

  const { transactionBuilder } = await TripleMasking.abarToBar(anonKeysSender, walletInfo.publickey, [
    ownedAbarToUseAsSource,
    ownedAbarToUseAsSourceOne,
  ]);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('abar to bar result handle!!!', resultHandle);

  await waitForBlockChange(2);

  log('/////////////////// now checking balances //////////// \n\n\n ');

  const balanceNew = await Account.getBalance(walletInfo);
  log('Old BAR balance for public key: ', walletInfo.address, ' is ', balance, ' FRA');
  log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');

  const balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
  log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');

  const givenBalanceChange = '20';
  const realBalanceChange = createBigNumber(createBigNumber(balanceChangeF).toPrecision(7));

  const expectedBalanceChange = createBigNumber(givenBalanceChange);
  const expectedBarBalanceChange = expectedBalanceChange;

  if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
    const message = `BAR balance of ${realBalanceChange.toString()} does not match expected value ${expectedBarBalanceChange.toString()}`;
    log(message);
    throw new Error(message);
  }

  const anonBalances = await TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitments);
  log('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
  if (!anonBalances?.spentBalances?.balances?.length) {
    const err = 'ERROR No ABAR spent balances available';
    log(err);
    throw new Error(err);
  }

  const anonBalSpent = anonBalances.spentBalances.balances[0].amount;
  const anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);

  const realAnonBalanceValue = createBigNumber(anonBalanceValue);
  if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
    const message = `ABAR balance does not match expected value, real is ${realAnonBalanceValue.toString()} and expected is ${expectedBalanceChange.toString()}`;
    log(message);
    throw new Error(message);
  }

  // it would throw an error if it is unspent
  await validateSpent(anonKeysSender, [givenCommitment, givenCommitmentOne]);

  return true;
};

export const abarToBarCustomSendAmount = async () => {
  const anonKeysSender = await getAnonKeys();

  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const toWalletInfo = await createNewKeypair();

  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  const senderOne = pkey;

  const fraAssetCode = await Asset.getFraAssetCode();

  const assetCodeToUse = derivedAssetCode;

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 5);

  log('//////////////// defining and issuing custom asset ////////////// ');
  await defineCustomAsset(senderOne, assetCode);
  await issueCustomAsset(senderOne, assetCode, assetCodeToUse, '10');
  await issueCustomAsset(senderOne, assetCode, assetCodeToUse, '5');
  await issueCustomAsset(senderOne, assetCode, assetCodeToUse, '20');

  const expectedSenderBalance = createBigNumber('35');

  const assetBalance = await Account.getBalance(senderWalletInfo, assetCodeToUse);

  log(`sender bar "${assetCodeToUse}" assetBalance before transfer (after issuing the asset)`, assetBalance);

  const realSenderBalance = createBigNumber(assetBalance);
  const isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);

  if (!isSenderFunded) {
    const errorMessage = `Expected bar ${assetCodeToUse} balance is ${expectedSenderBalance.toString()} but it has ${realSenderBalance.toString()}`;
    throw Error(errorMessage);
  }

  log('//////////////// bar to abar custom asset transfer ///////////////// ');

  const customAssetSids = await getSidsForSingleAsset(pkey, assetCodeToUse);
  log('🚀 ~ all customAssetSids', customAssetSids);

  const customAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    customAssetSids,
    '35',
    derivedAssetCode,
  );

  log('//////////////// bar to abar fra asset transfer ///////////////// ');

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;

  const fraAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour],
    '40',
    fraAssetCode,
  );
  await waitForBlockChange();

  const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];

  log('////////////////////// bar to abar is done, sending abar to bar //////////////');
  const amountToSend = '12.15';

  const assetBalanceBeforeAbarToBar = await Account.getBalance(toWalletInfo, assetCodeToUse);

  const receiverAssetBalanceBeforeTransfer = createBigNumber(assetBalanceBeforeAbarToBar);
  const isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo(
    createBigNumber('0'),
  );
  if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
    throw new Error(
      `Receiver must have 0 balance of the asset but it has ${receiverAssetBalanceBeforeTransfer.toString()}`,
    );
  }

  const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
    anonKeysSender,
    toWalletInfo.publickey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('abar to bar result handle!!', resultHandle);

  await waitForBlockChange(2);

  log('/////////////////// now checking balances //////////// \n\n\n ');

  const balancesSenderAfter = await TripleMasking.getBalance(anonKeysSender, [
    ...givenCommitmentsListSender,
    ...remainderCommitements,
  ]);

  log('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));

  const expectedFraAbarMinimumAmountAfterTransfer = createBigNumber('38'); // assuming 2 FRA was spent for fee, so at least 38 FRA min
  const expectedCustomAbarAmountAfterTransfer = createBigNumber('22.85'); // has to be 35 - 12.15 = 22.85

  const fraAbarAmountAfterTransfer = balancesSenderAfter?.balances.find(
    element => element.assetType === fraAssetCode,
  )?.amount;

  if (!fraAbarAmountAfterTransfer) {
    throw new Error(
      `Sender is expected to have ${expectedFraAbarMinimumAmountAfterTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`,
    );
  }

  const customAbarAmountAfterTransfer = balancesSenderAfter?.balances.find(
    element => element.assetType === assetCodeToUse,
  )?.amount;

  if (!customAbarAmountAfterTransfer) {
    throw new Error(
      `Sender is expected to have ${expectedCustomAbarAmountAfterTransfer.toString()} ABAR custom asset but it has '${customAbarAmountAfterTransfer}'`,
    );
  }

  const senderAssetBalanceAfterTransfer = createBigNumber(customAbarAmountAfterTransfer);

  const isSenderHasProperAssetBalanceAfterTransfer = senderAssetBalanceAfterTransfer.isEqualTo(
    expectedCustomAbarAmountAfterTransfer,
  );

  if (!isSenderHasProperAssetBalanceAfterTransfer) {
    throw new Error(
      `Sender must have 22.5 balance of the asset but it has ${senderAssetBalanceAfterTransfer.toString()}`,
    );
  }

  const senderFraBalanceAfterTransfer = createBigNumber(fraAbarAmountAfterTransfer);

  const isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(
    expectedFraAbarMinimumAmountAfterTransfer,
  );

  if (!isSenderHasProperFraBalanceAfterTransfer) {
    throw new Error(
      `Sender must have at least ${expectedFraAbarMinimumAmountAfterTransfer.toString()} balance but it has ${senderFraBalanceAfterTransfer.toString()}`,
    );
  }

  log('//////////// checking receiver bar balance //////////');
  const assetBalanceAfterAbarToBar = await Account.getBalance(toWalletInfo, assetCodeToUse);
  log('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);

  const receiverAssetBalanceAfterTransfer = createBigNumber(assetBalanceAfterAbarToBar);

  const isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo(
    createBigNumber(amountToSend),
  );

  if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
    throw new Error(
      `Receiver must have ${amountToSend} balance of the asset but it has ${receiverAssetBalanceAfterTransfer.toString()}`,
    );
  }

  log('🚀 ~ spentCommitments', spentCommitments);
  log('🚀 ~ remainderCommitements', remainderCommitements);
  return true;
};

export const abarToBarFraSendAmount = async () => {
  const anonKeysSender = await getAnonKeys();

  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const toWalletInfo = await createNewKeypair();

  const fraAssetCode = await Asset.getFraAssetCode();

  const assetCodeToUse = fraAssetCode;

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 5);

  const assetBalance = await Account.getBalance(senderWalletInfo, fraAssetCode);

  log(`sender bar "${assetCodeToUse}" assetBalance before transfer`, assetBalance);

  log('//////////////// bar to abar fra asset transfer ///////////////// ');

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;

  const fraAssetCommitmentsList = await barToAbar(
    pkey,
    anonKeysSender,
    [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour],
    '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
    fraAssetCode,
  );

  await waitForBlockChange();

  const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  log('////////////////////// bar to abar is done, sending abar to bar //////////////');
  const amountToSend = '2.16';

  const assetBalanceBeforeAbarToBar = await Account.getBalance(toWalletInfo, assetCodeToUse);

  const receiverAssetBalanceBeforeTransfer = createBigNumber(assetBalanceBeforeAbarToBar);
  const isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo(
    createBigNumber('0'),
  );
  if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
    throw new Error(
      `Receiver must have 0 balance of the asset but it has ${receiverAssetBalanceBeforeTransfer.toString()}`,
    );
  }

  const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
    anonKeysSender,
    toWalletInfo.publickey,
    amountToSend,
    assetCodeToUse,
    givenCommitmentsListSender,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('abar to bar result handle!!', resultHandle);

  await waitForBlockChange(2);

  console.log('/////////////////// now checking balances //////////// \n\n\n ');

  const balancesSenderAfter = await TripleMasking.getBalance(anonKeysSender, [
    ...givenCommitmentsListSender,
    ...remainderCommitements,
  ]);

  log('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));

  // 40 - 2.16 = 37.84 assuming 1.15 FRA was spent for fee, so at least 36.69 is a min FRA amount it must have
  const expectedFraAbarMinimumAmountAfterTransfer = createBigNumber('36.69');

  const fraAbarAmountAfterTransfer = balancesSenderAfter?.balances.find(
    element => element.assetType === fraAssetCode,
  )?.amount;

  if (!fraAbarAmountAfterTransfer) {
    throw new Error(
      `Sender is expected to have ${expectedFraAbarMinimumAmountAfterTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`,
    );
  }

  const senderFraBalanceAfterTransfer = createBigNumber(fraAbarAmountAfterTransfer);

  const isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(
    expectedFraAbarMinimumAmountAfterTransfer,
  );

  if (!isSenderHasProperFraBalanceAfterTransfer) {
    throw new Error(
      `Sender must have at least ${expectedFraAbarMinimumAmountAfterTransfer.toString()} balance but it has ${senderFraBalanceAfterTransfer.toString()}`,
    );
  }

  log('//////////// checking receiver bar balance //////////');
  const assetBalanceAfterAbarToBar = await Account.getBalance(toWalletInfo, assetCodeToUse);
  log('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);

  const receiverAssetBalanceAfterTransfer = createBigNumber(assetBalanceAfterAbarToBar);

  const isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo(
    createBigNumber(amountToSend),
  );

  if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
    throw new Error(
      `Receiver must have ${amountToSend} balance of the asset but it has ${receiverAssetBalanceAfterTransfer.toString()}`,
    );
  }

  log('🚀 ~ spentCommitments', spentCommitments);
  log('🚀 ~ remainderCommitements', remainderCommitements);

  return true;
};

export const barToAbarAmount = async (givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys) => {
  const generatedAnonKeysReceiver = await getAnonKeys();
  const anonKeysReceiver = givenAnonKeysReceiver
    ? { ...givenAnonKeysReceiver }
    : { ...generatedAnonKeysReceiver };

  const senderWalletInfo = await createNewKeypair();
  const pkey = senderWalletInfo.privateStr!;

  const fraAssetCode = await Asset.getFraAssetCode();

  // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
  await createTestBars(pkey, '10', 5);

  log('//////////////// bar to abar fra asset transfer ///////////////// ');

  const fraAssetSids = await getSidsForSingleAsset(pkey, fraAssetCode);
  log('🚀 ~ all fraAssetSids', fraAssetSids);

  const amount = '35';

  const balance = await Account.getBalance(senderWalletInfo);
  console.log('🚀 ~ balance', balance);

  const {
    transactionBuilder,
    barToAbarData,
    sids: usedSids,
  } = await TripleMasking.barToAbarAmount(
    senderWalletInfo,
    amount,
    fraAssetCode,
    anonKeysReceiver.axfrPublicKey,
  );

  log('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
  log('🚀 ~ usedSids', usedSids.join(','));

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('send bar to abar result handle!!', resultHandle);
  const givenCommitments = barToAbarData.commitments;

  await waitForBlockChange();

  const minimalFeeForBarToBar = '0.01'; // minimal fee for a bar to bar transfer, when we transfer to ourselves to make exact amount

  const extraSpent = minimalFeeForBarToBar;

  await barToAbarBalances(
    senderWalletInfo,
    anonKeysReceiver,
    givenCommitments,
    balance,
    amount,
    fraAssetCode,
    extraSpent,
  );

  return true;
};
