import findoraSdk from './Sdk';
import * as bigNumber from './services/bigNumber';

import {
  Account as AccountApi,
  Asset as AssetApi,
  Keypair as KeypairApi,
  Network as NetworkApi,
  Staking as StakingApi,
  Transaction as TransactionApi,
} from './api';

import { getLedger } from './services/ledger/ledgerWrapper';
import sleep from 'sleep-promise';

import { MemoryCacheProvider } from './services/cacheStore/providers';

const envConfigFile = process.env.INTEGRATION_ENV_NAME
  ? `../.env_${process.env.INTEGRATION_ENV_NAME}`
  : `../env_example`;

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

const waitingTimeBeforeCheckTxStatus = 18000;

console.log('🚀 ~ file: integration.ts ~ line 31 ~ Findora Sdk is configured to use:', sdkEnv);

findoraSdk.init(sdkEnv);

const { mainFaucet, senderOne, senderTwo, receiverOne, receiverTwo } = walletKeys;

const password = 'yourSecretPassword';

export const keystoreUsage = async () => {
  return true;
};

export const defineAssetTransaction = async () => {
  console.log('////////////////  defineAssetTransaction //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  console.log('🚀 ~ file: integration.ts ~ line 42 ~ defineAssetTransaction ~ assetCode', tokenCode);

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo);

  const submitData = assetBuilder.transaction();

  try {
    const {
      body: {
        operations: [operation],
      },
    } = JSON.parse(submitData);

    return 'DefineAsset' in operation;
  } catch (error) {
    console.log('Error!', error);
    return false;
  }
};

export const defineAssetTransactionSubmit = async () => {
  console.log('////////////////  defineAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  console.log('🚀 ~ file: integration.ts ~ line 76 ~ defineAssetTransactionSubmit ~ tokenCode', tokenCode);

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode);

  const handle = await TransactionApi.submitTransaction(assetBuilder);
  console.log('🚀 ~ file: integration.ts ~ line 81 ~ defineAssetTransactionSubmit ~ handle', handle);
  console.log(
    '🚀 ~ file: integration.ts ~ line 82 ~ defineAssetTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(handle);
  console.log(
    '🚀 ~ file: integration.ts ~ line 87 ~ defineAssetTransactionSubmit ~ Retrieved transaction status response:',
    transactionStatus,
  );

  const { response: defineTransactionResponse } = transactionStatus;

  if (!defineTransactionResponse) {
    return false;
  }

  const { Committed } = defineTransactionResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
  console.log('🚀 ~ file: integration.ts ~ line 106 ~ defineAssetTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 105 ~ defineAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handle}. Response was:`,
      transactionStatus,
    );

    return false;
  }

  return true;
};

export const defineAndIssueAssetTransactionSubmit = async () => {
  console.log('////////////////  defineAndIssueAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  console.log(
    '🚀 ~ file: integration.ts ~ line 128 ~ defineAndIssueAssetTransactionSubmit ~ tokenCode',
    tokenCode,
  );

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);
  console.log('🚀 ~ file: integration.ts ~ line 145 ~ defineAndIssueAssetTransactionSubmit ~ handle', handle);

  console.log(
    '🚀 ~ file: integration.ts ~ line 147 ~ defineAndIssueAssetTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(handle);
  console.log(
    '🚀 ~ file: integration.ts ~ line 152 ~ defineAndIssueAssetTransactionSubmit ~ transactionStatus',
    transactionStatus,
  );

  const { response: defineTransactionResponse } = transactionStatus;

  if (!defineTransactionResponse) {
    return false;
  }

  const { Committed } = defineTransactionResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: integration.ts ~ line 167 ~ defineAndIssueAssetTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 172 ~ defineAndIssueAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handle}. Response was:`,
      transactionStatus,
    );
    return false;
  }

  const inputNumbers = '5';

  const assetBlindRules = { isAmountBlind: false };

  const issueAssetBuilder = await AssetApi.issueAsset(walletInfo, tokenCode, inputNumbers, assetBlindRules);

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);
  console.log(
    '🚀 ~ file: integration.ts ~ line 192 ~ defineAndIssueAssetTransactionSubmit ~ handleIssue',
    handleIssue,
  );
  console.log(
    '🚀 ~ file: integration.ts ~ line 193 ~ defineAndIssueAssetTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const issueTransactionStatus = await NetworkApi.getTransactionStatus(handleIssue);

  console.log(
    '🚀 ~ file: integration.ts ~ line 200 ~ defineAndIssueAssetTransactionSubmit ~ issueTransactionStatus',
    issueTransactionStatus,
  );

  const { response: issueTransactionResponse } = issueTransactionStatus;

  if (!issueTransactionResponse) {
    return false;
  }

  const { Committed: IssueCommitted } = issueTransactionResponse;

  if (!Array.isArray(IssueCommitted)) {
    return false;
  }

  const issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;

  console.log(
    '🚀 ~ file: integration.ts ~ line 216 ~ defineAndIssueAssetTransactionSubmit ~ issueTxnSID',
    issueTxnSID,
  );

  if (!issueTxnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 222 ~ defineAndIssueAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handleIssue}. Response was:`,
      issueTransactionStatus,
    );
    return false;
  }

  return true;
};

export const defineIssueAndSendAssetTransactionSubmit = async () => {
  console.log('////////////////  defineIssueAndSendAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;
  const toPkey = receiverOne;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await KeypairApi.restoreFromPrivateKey(toPkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();

  console.log(
    '🚀 ~ file: integration.ts ~ line 243 ~ defineIssueAndSendAssetTransactionSubmit ~ tokenCode',
    tokenCode,
  );

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);
  console.log(
    '🚀 ~ file: integration.ts ~ line 256 ~ defineIssueAndSendAssetTransactionSubmit ~ handle',
    handle,
  );
  console.log(
    '🚀 ~ file: integration.ts ~ line 257 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(handle);

  console.log(
    '🚀 ~ file: integration.ts ~ line 262 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieved transaction status response',
    transactionStatus,
  );

  const { response: defineResponse } = transactionStatus;

  if (!defineResponse) {
    return false;
  }

  const { Committed } = defineResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
  console.log(
    '🚀 ~ file: integration.ts ~ line 278 ~ defineIssueAndSendAssetTransactionSubmit ~ txnSID',
    txnSID,
  );

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 281 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handle}. Response was: `,
      transactionStatus,
    );

    return false;
  }

  const inputNumbers = 5;

  const assetBlindRules = { isAmountBlind: false };

  const issueAssetBuilder = await AssetApi.issueAsset(
    walletInfo,
    tokenCode,
    `${inputNumbers}`,
    assetBlindRules,
  );

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);
  console.log(
    '🚀 ~ file: integration.ts ~ line 315 ~ defineIssueAndSendAssetTransactionSubmit ~ handleIssue',
    handleIssue,
  );
  console.log(
    '🚀 ~ file: integration.ts ~ line 316 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const issueTransactionStatus = await NetworkApi.getTransactionStatus(handleIssue);
  console.log(
    '🚀 ~ file: integration.ts ~ line 321 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieved transaction status response:',
  );

  const { response: issueResponse } = issueTransactionStatus;

  if (!issueResponse) {
    return false;
  }

  const { Committed: IssueCommitted } = issueResponse;

  if (!Array.isArray(IssueCommitted)) {
    return false;
  }

  const issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;
  console.log(
    '🚀 ~ file: integration.ts ~ line 336 ~ defineIssueAndSendAssetTransactionSubmit ~ issueTxnSID',
    issueTxnSID,
  );

  if (!issueTxnSID) {
    console.log(
      `~ file: integration.ts ~ line 340 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handleIssue}. Response was: `,
      issueTransactionStatus,
    );
    return false;
  }

  const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: false };

  const sendTransactionBuilder = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    `${inputNumbers / 2}`,
    tokenCode,
    assetBlindRulesForSend,
  );

  const handleSend = await TransactionApi.submitTransaction(sendTransactionBuilder);
  console.log(
    '🚀 ~ file: integration.ts ~ line 357 ~ defineIssueAndSendAssetTransactionSubmit ~ handleSend',
    handleSend,
  );
  console.log(
    '🚀 ~ file: integration.ts ~ line 357 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status..',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const sendTransactionStatus = await NetworkApi.getTransactionStatus(handleSend);
  console.log(
    '🚀 ~ file: integration.ts ~ line 363 ~ defineIssueAndSendAssetTransactionSubmit ~ sendTransactionStatus',
    sendTransactionStatus,
  );

  const { response: sendResponse } = sendTransactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed: SendCommitted } = sendResponse;

  if (!Array.isArray(SendCommitted)) {
    return false;
  }

  const sendTxnSID = SendCommitted && Array.isArray(SendCommitted) ? SendCommitted[0] : null;
  console.log(
    '🚀 ~ file: integration.ts ~ line 378 ~ defineIssueAndSendAssetTransactionSubmit ~ sendTxnSID',
    sendTxnSID,
  );

  if (!sendTxnSID) {
    console.log(
      `"🚀 ~ file: integration.ts ~ line 382 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle ${handleSend}. Response was: `,
      sendTransactionStatus,
    );
    return false;
  }

  return true;
};

export const sendFraTransactionSubmit = async () => {
  console.log('////////////////  sendFraTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await KeypairApi.createKeypair(password);

  const receiverBalanceBeforeTransfer = await AccountApi.getBalance(toWalletInfo);

  const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbers = '0.1';

  const assetCode = await AssetApi.getFraAssetCode();

  const transactionBuilder = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbers,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

  console.log('🚀 ~ file: integration.ts ~ line 446 ~ sendFraTransactionSubmit ~ resultHandle', resultHandle);
  console.log(
    '🚀 ~ file: integration.ts ~ line 446 ~ sendFraTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(resultHandle);

  console.log('Retrieved transaction status response:', transactionStatus);

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
  console.log('🚀 ~ file: integration.ts ~ line 472 ~ sendFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ sendFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  const receiverBalanceAfterTransfer = await AccountApi.getBalance(toWalletInfo);

  const isItRight =
    receiverBalanceBeforeTransfer === '0.000000' && receiverBalanceAfterTransfer === '0.100000';

  const peterCheckResult = `Peter balance should be 0.100000 and now it is ${receiverBalanceAfterTransfer}, so this is "${isItRight}" `;

  console.log(
    '🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult',
    peterCheckResult,
  );

  return isItRight;
};

export const sendFraToMultipleReceiversTransactionSubmit = async () => {
  const pkey = mainFaucet;

  console.log('////////////////  sendFraToMultipleReceiversTransactionSubmit //////////////// ');
  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const aliceWalletInfo = await KeypairApi.createKeypair(password);

  const petereWalletInfo = await KeypairApi.createKeypair(password);

  const aliceBalanceBeforeTransfer = await AccountApi.getBalance(aliceWalletInfo);

  const peterBalanceBeforeTransfer = await AccountApi.getBalance(petereWalletInfo);

  const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersForAlice = '0.1';
  const numbersForPeter = '0.2';

  const assetCode = await AssetApi.getFraAssetCode();

  const recieversInfo = [
    { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
    { reciverWalletInfo: petereWalletInfo, amount: numbersForPeter },
  ];

  const transactionBuilder = await TransactionApi.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
  console.log(
    '🚀 ~ file: integration.ts ~ line 536 ~ sendFraToMultipleReceiversTransactionSubmit ~ resultHandle',
    resultHandle,
  );
  console.log(
    '🚀 ~ file: integration.ts ~ line 540 ~ sendFraToMultipleReceiversTransactionSubmit ~ Retrieving transaction status...',
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(resultHandle);

  console.log('Retrieved transaction status response:', transactionStatus);

  console.log(
    '🚀 ~ file: integration.ts ~ line 549 ~ sendFraToMultipleReceiversTransactionSubmit ~ transactionStatus',
    transactionStatus,
  );

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
  console.log(
    '🚀 ~ file: integration.ts ~ line 568 ~ sendFraToMultipleReceiversTransactionSubmit ~ txnSID',
    txnSID,
  );

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 574 ~ sendFraToMultipleReceiversTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  const aliceBalanceAfterTransfer = await AccountApi.getBalance(aliceWalletInfo);
  const peterBalanceAfterTransfer = await AccountApi.getBalance(petereWalletInfo);

  const isItRightAlice =
    aliceBalanceBeforeTransfer === '0.000000' && aliceBalanceAfterTransfer === '0.100000';
  const isItRightPeter =
    peterBalanceBeforeTransfer === '0.000000' && peterBalanceAfterTransfer === '0.200000';

  const aliceCheckResult = `Alice balance should be 0.100000 and now it is ${aliceBalanceAfterTransfer}, so this is "${isItRightAlice}" `;
  const peterCheckResult = `Peter balance should be 0.200000 and now it is ${peterBalanceAfterTransfer}, so this is "${isItRightPeter}" `;

  console.log(
    '🚀 ~ file: integration.ts ~ line 597 ~ sendFraToMultipleReceiversTransactionSubmit ~ aliceCheckResult',
    aliceCheckResult,
  );

  console.log(
    '🚀 ~ file: integration.ts ~ line 602 ~ sendFraToMultipleReceiversTransactionSubmit ~ peterCheckResult',
    peterCheckResult,
  );

  return isItRightAlice && isItRightPeter;
};

export const getBalance = async () => {
  console.log('////////////////  getBalance //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const balance = await AccountApi.getBalance(walletInfo);
  return parseFloat(balance) > 0;
};

export const issueAndSendConfidentialAsset = async () => {
  console.log('////////////////  issueAndSendConfidentialAsset //////////////// ');

  const Ledger = await getLedger();

  const pkey = mainFaucet;
  const toPkey = senderOne;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await KeypairApi.restoreFromPrivateKey(toPkey, password);

  const aliceKeyPair = walletInfo.keypair;
  const bobKeyPair = toWalletInfo.keypair;

  const tokenCode = await AssetApi.getRandomAssetCode();

  console.log('Defining a custom asset:', tokenCode);

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);

  console.log('Define Asset Transaction handle:', handle);

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(handle);

  const { response: defineResponse } = transactionStatus;

  if (!defineResponse) {
    console.log('ERROR could not get defineResponse, line 657');
    return false;
  }

  const { Committed } = defineResponse;

  if (!Array.isArray(Committed)) {
    console.log('ERROR could not get Commited from defineResponse, line 664');

    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  if (!txnSID) {
    console.log(
      `Could not retrieve the transaction with a handle ${handle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  const inputNumbers = '5';

  const assetBlindRules = { isAmountBlind: true };

  const issueAssetBuilder = await AssetApi.issueAsset(walletInfo, tokenCode, inputNumbers, assetBlindRules);

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);

  console.log('Issue Asset with secret amount Transaction handle:', handleIssue);

  await sleep(waitingTimeBeforeCheckTxStatus);

  const issueTransactionStatus = await NetworkApi.getTransactionStatus(handleIssue);

  const { response: issueResponse } = issueTransactionStatus;

  if (!issueResponse) {
    console.log('ERROR issueTransactionStatus', issueTransactionStatus);

    return false;
  }

  const { Committed: IssueCommitted } = issueResponse;

  if (!Array.isArray(IssueCommitted)) {
    console.log('ERROR could not get Commited from defineResponse, line 705');
    return false;
  }

  const issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;

  if (!issueTxnSID) {
    console.log(
      `Could not retrieve the transaction with a handle ${handleIssue}. Response was: `,
      issueTransactionStatus,
    );
    return false;
  }

  const confSid = await IssueCommitted[1][0];
  const nonConfSid = await IssueCommitted[1][1];

  const confUtxoResponse = await NetworkApi.getUtxo(confSid);
  const nonConfUtxoResponse = await NetworkApi.getUtxo(nonConfSid);

  const { response: confUtxo } = confUtxoResponse;

  const { response: nonConfUtxo } = nonConfUtxoResponse;

  const isNonConfidentialMatches = nonConfUtxo?.utxo.record.amount.NonConfidential === '10000';

  if (!isNonConfidentialMatches) {
    console.log(
      '🚀 ~ file: integration.ts ~ line 778 ~ issueAndSendConfidentialAsset ~ isNonConfidentialMatches IS FALSE',
      isNonConfidentialMatches,
      nonConfUtxo?.utxo.record.amount.NonConfidential,
    );
    return false;
  }

  const isConfidentiaExists = confUtxo?.utxo.record.amount.Confidential;

  if (!isConfidentiaExists) {
    console.log(
      '🚀 ~ file: integration.ts ~ line 782 ~ issueAndSendConfidentialAsset ~ isConfidentiaExists IS FALSE , confUtxo?.utxo.record.amount',
      isConfidentiaExists,
      confUtxo?.utxo.record.amount,
    );
    return false;
  }

  const ownerMemoDataResult = await NetworkApi.getOwnerMemo(confSid);

  const { response: ownerMemoJson } = ownerMemoDataResult;

  if (!ownerMemoJson) {
    console.log(
      '🚀 ~ file: integration.ts ~ line 794 ~ issueAndSendConfidentialAsset ~ there is not ownerMemo for confidential sid!',
    );
    console.log(
      '🚀 ~ file: integration.ts ~ line 797 ~ issueAndSendConfidentialAsset ~ ownerMemoDataResult',
      ownerMemoDataResult,
    );

    return false;
  }

  const ownerMemo = Ledger.OwnerMemo.from_json(ownerMemoJson);

  const assetRecord = Ledger.ClientAssetRecord.from_json(confUtxo?.utxo);

  const decryptedRecord = Ledger.open_client_asset_record(assetRecord, ownerMemo.clone(), aliceKeyPair);

  const isDecryptedRecordCorrect = decryptedRecord?.amount === '5000000';

  if (!isDecryptedRecordCorrect) {
    console.log(
      '🚀 ~ file: integration.ts ~ line 815 ~ issueAndSendConfidentialAsset ~ isDecryptedRecordCorrect IS FALSE!, decryptedRecord',
      isDecryptedRecordCorrect,
      decryptedRecord,
    );
  }

  const transferAmount = decryptedRecord?.amount;
  const numbersForPeter = bigNumber.fromWei(transferAmount, 6).toFormat(6);

  // const utxoNumbersToTransfer = BigInt(transferAmount);

  // console.log(
  //   '🚀 ~ file: integration.ts ~ line 853 ~ issueAndSendConfidentialAsset ~ utxoNumbersToTransfer',
  //   utxoNumbersToTransfer,
  // );

  const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };

  const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: numbersForPeter }];

  const sendTransactionBuilder = await TransactionApi.sendToMany(
    walletInfo,
    recieversInfo,
    tokenCode,
    assetBlindRulesForSend,
  );

  const handleSend = await TransactionApi.submitTransaction(sendTransactionBuilder);

  console.log('Send Transaction handle:', handleSend);

  console.log('Retrieving transaction status...');

  await sleep(waitingTimeBeforeCheckTxStatus);

  const sendTransactionStatus = await NetworkApi.getTransactionStatus(handleSend);

  console.log('Retrieved transaction status response:', sendTransactionStatus);

  const { response: sendResponse } = sendTransactionStatus;

  if (!sendResponse) {
    console.log('ERROR could not get send transaction response', sendTransactionStatus);
    return false;
  }

  const { Committed: SendCommitted } = sendResponse;

  if (!Array.isArray(SendCommitted)) {
    console.log('ERROR could not get Commited from sendResponse, line 828');

    return false;
  }

  const sendTxnSID = SendCommitted && Array.isArray(SendCommitted) ? SendCommitted[0] : null;

  console.log(`TxnSID is: ${sendTxnSID}`);

  if (!sendTxnSID) {
    console.log(
      `Could not retrieve the transaction with a handle ${handleSend}. Response was: `,
      sendTransactionStatus,
    );
    return false;
  }

  await sleep(4000);

  const bobTxoSidsResult = await NetworkApi.getOwnedSids(toWalletInfo.publickey);

  const { response: bobTxoSids } = bobTxoSidsResult;

  if (!bobTxoSids) {
    console.log(`Could not retrieve the list of sids of the receiver. Response was: `, bobTxoSidsResult);
    return false;
  }

  const [newSid] = bobTxoSids.sort((a, b) => b - a);

  const bobUtxoDataResult = await NetworkApi.getUtxo(newSid);

  const { response: bobUtxoResponse } = bobUtxoDataResult;

  if (!bobUtxoResponse) {
    console.log('ERROR could not get bobUtxoResponse', bobUtxoDataResult);
    return false;
  }

  const bobMemoDataResult = await NetworkApi.getOwnerMemo(newSid);

  const { response: bobMemoJson } = bobMemoDataResult;

  if (!bobMemoJson) {
    console.log('could not get owner memo for the send to Bob transfer!', bobMemoDataResult);
    return false;
  }

  const bobOwnerMemo = Ledger.OwnerMemo.from_json(bobMemoJson);

  const bobAssetRecord = Ledger.ClientAssetRecord.from_json(bobUtxoResponse?.utxo);

  const bobDecryptedRecord = Ledger.open_client_asset_record(bobAssetRecord, bobOwnerMemo, bobKeyPair);

  const isBobDecryptedRecordCorrect = bobDecryptedRecord?.amount === '5000000';

  if (!isBobDecryptedRecordCorrect) {
    console.log(
      '🚀 ERROR ~ file: integration.ts ~ line 883 ~ issueAndSendConfidentialAsset ~ isBobDecryptedRecordCorrect',
      isBobDecryptedRecordCorrect,
      bobDecryptedRecord,
    );
    return false;
  }

  const isAssetTypeCorrect = Ledger.asset_type_from_jsvalue(bobDecryptedRecord.asset_type) == tokenCode;

  if (!isAssetTypeCorrect) {
    console.log(
      '🚀 ERROR ~ file: integration.ts ~ line 893 ~ issueAndSendConfidentialAsset ~ isAssetTypeCorrect',
      isAssetTypeCorrect,
      bobDecryptedRecord,
    );
    return false;
  }

  return true;
};

export const delegateFraTransactionSubmit = async () => {
  console.log('////////////////  delegateFraTransactionSubmit //////////////// ');

  // send part
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await KeypairApi.createKeypair(password);

  const fraCode = await AssetApi.getFraAssetCode();

  const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const transactionBuilderSend = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await TransactionApi.submitTransaction(transactionBuilderSend);

  console.log('🚀  ~ delegateFraTransactionSubmit ~ send fra result handle', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);

  // delegate part

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await StakingApi.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await StakingApi.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
  console.log('🚀  ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);

  console.log('🚀  ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);

  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(resultHandle);

  console.log(
    '🚀  ~ delegateFraTransactionSubmit ~ Retrieved transaction status response:',
    transactionStatus,
  );

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ delegateFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀  ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  console.log('🚀  ~ delegateFraTransactionSubmit ~ waiting for 5 blocks before checking rewards');

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('🚀  ~ delegateFraTransactionSubmit ~ checking rewards now');

  const delegateInfo = await StakingApi.getDelegateInfo(walletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('🚀  ~ delegateFraTransactionSubmit ~ There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('🚀  ~ delegateFraTransactionSubmit ~ accumulated rewards ', delegateInfo.rewards);

  return true;
};

export const delegateFraTransactionAndClaimRewards = async () => {
  console.log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await KeypairApi.createKeypair(password);

  const fraCode = await AssetApi.getFraAssetCode();

  const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const balanceBeforeSend = await AccountApi.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeSend',
    balanceBeforeSend,
  );

  const transactionBuilderSend = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await TransactionApi.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterSend = await AccountApi.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend',
    balanceAfterSend,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await StakingApi.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await StakingApi.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ delegateResultHandle',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await NetworkApi.getTransactionStatus(resultHandle);

  console.log('Retrieved transaction status response:', transactionStatus);

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  const balanceAfterDelegate = await AccountApi.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterDelegate',
    balanceAfterDelegate,
  );

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  // claim

  const balanceBefore = await AccountApi.getBalance(toWalletInfo);
  console.log(
    '🚀 ~ file: run.ts ~ line 801 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim',
    balanceBefore,
  );

  const amountToClaim = delegateInfo.rewards;

  const transactionBuilderClaim = await StakingApi.claim(toWalletInfo, amountToClaim);

  const resultHandleClaim = await TransactionApi.submitTransaction(transactionBuilderClaim);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ resultHandleClaim',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusClaim = await NetworkApi.getTransactionStatus(resultHandleClaim);

  console.log('Retrieved transaction status response:', transactionStatusClaim);

  const { response: claimResponse } = transactionStatusClaim;

  if (!claimResponse) {
    return false;
  }

  const { Committed: ClaimCommited } = claimResponse;

  if (!Array.isArray(ClaimCommited)) {
    return false;
  }

  const txnSIDClaim = ClaimCommited && Array.isArray(ClaimCommited) ? ClaimCommited[0] : null;

  console.log(
    '🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSIDClaim',
    txnSIDClaim,
  );

  if (!txnSIDClaim) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatusClaim,
    );
    return false;
  }

  const balanceAfter = await AccountApi.getBalance(toWalletInfo);
  console.log(
    '🚀 ~ file: run.ts ~ line 845 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter',
    balanceAfter,
  );

  const isClaimSuccessfull = Number(balanceAfter) > Number(balanceBefore);
  console.log(
    '🚀 ~ file: run.ts ~ line 877 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull',
    isClaimSuccessfull,
  );

  return isClaimSuccessfull;
};
