import {
  Account as AccountApi,
  Asset as AssetApi,
  Keypair as KeypairApi,
  Network as NetworkApi,
  Transaction as TransactionApi,
} from './api';
import { formatFromWei, isNumberChangedBy, waitForBlockChange } from './evm/testHelpers';
import findoraSdk from './Sdk';
import * as bigNumber from './services/bigNumber';
import { MemoryCacheProvider } from './services/cacheStore/providers';
import { getLedger } from './services/ledger/ledgerWrapper';
import { log } from './services/utils';

const envConfigFile = process.env.INTEGRATION_ENV_NAME
  ? `../.env_integration_${process.env.INTEGRATION_ENV_NAME}`
  : `../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { keys: walletKeys, hostUrl: envHostUrl } = envConfig;

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  hostUrl: envHostUrl,
  cacheProvider: MemoryCacheProvider,
  blockScanerUrl: '',
  cachePath: './cache',
};

log('🚀 ~ file: integration.ts ~ line 31 ~ Findora Sdk is configured to use:', sdkEnv);

log(`Connecting to "${sdkEnv.hostUrl}"`);

findoraSdk.init(sdkEnv);

const { mainFaucet, receiverOne } = walletKeys;

const password = 'yourSecretPassword';

const getTxSid = async (operationName: string, txHandle: string, retry = true): Promise<boolean> => {
  log(`🚀 ~ ${operationName} ~ txHandle`, txHandle);

  await waitForBlockChange();

  const transactionStatus = await NetworkApi.getTransactionStatus(txHandle);

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    log(`🚀 ~ ERROR 1 - ${operationName} ~ transactionStatus`, transactionStatus);
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    if (retry) {
      log(
        `🚀  ~ ERROR 2 - ${operationName} ~ sendResponse ${txHandle}. Response was: `,
        sendResponse,
        `- Retrying...`,
      );
      return getTxSid(operationName, txHandle, false);
    } else {
      log(`🚀 ~ ERROR 2 - ${operationName} ~ sendResponse`, sendResponse);
      return false;
    }
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  log(`🚀 ~ ${operationName} ~ txnSID`, txnSID);

  if (!txnSID) {
    if (retry) {
      log(
        `🚀  ~ ERROR 3 - ${operationName} ~ Could not retrieve the transaction with a handle ${txHandle}. Response was: `,
        transactionStatus,
        `- Retrying...`,
      );
      return getTxSid(operationName, txHandle, false);
    } else {
      log(
        `🚀  ~ ERROR 3 - ${operationName} ~ Could not retrieve the transaction with a handle ${txHandle}. Response was: `,
        transactionStatus,
      );
      return false;
    }
  }
  return true;
};

export const defineAssetTransaction = async () => {
  log('////////////////  defineAssetTransaction //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  log('🚀 ~ defineAssetTransaction ~ assetCode', tokenCode);

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
    log('Error!', error);
    return false;
  }
};

export const defineAssetTransactionSubmit = async () => {
  log('////////////////  defineAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  log('🚀 ~ defineAssetTransactionSubmit ~ tokenCode', tokenCode);

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode);

  const handle = await TransactionApi.submitTransaction(assetBuilder);

  const isTxSent = await getTxSid('define asset', handle);

  if (!isTxSent) {
    log(`🚀 ~ defineAssetTransactionSubmit ~ Could not submit define asset`);
    return false;
  }

  return true;
};

export const defineAndIssueAssetTransactionSubmit = async () => {
  log('////////////////  defineAndIssueAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  const derivedTokenCode = await AssetApi.getDerivedAssetCode(tokenCode);

  log('🚀 ~ defineAndIssueAssetTransactionSubmit ~ tokenCode', tokenCode, derivedTokenCode);

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);

  const isTxSent = await getTxSid('define asset', handle);

  if (!isTxSent) {
    log(`🚀 ~ defineAndIssueAssetTransactionSubmit ~ Could not submit define asset`);
    return false;
  }

  const inputNumbers = '5';

  const assetBlindRules = { isAmountBlind: false };

  const issueAssetBuilder = await AssetApi.issueAsset(
    walletInfo,
    derivedTokenCode,
    inputNumbers,
    assetBlindRules,
  );

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);

  const isTxIssued = await getTxSid('issue', handleIssue);

  if (!isTxIssued) {
    log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit asset issue`);
    return false;
  }

  return true;
};

export const defineIssueAndSendAssetTransactionSubmit = async () => {
  log('////////////////  defineIssueAndSendAssetTransactionSubmit //////////////// ');

  const pkey = mainFaucet;
  const toPkey = receiverOne;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await KeypairApi.restoreFromPrivateKey(toPkey, password);

  const tokenCode = await AssetApi.getRandomAssetCode();
  const derivedTokenCode = await AssetApi.getDerivedAssetCode(tokenCode);

  log('🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ tokenCode', tokenCode);

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);

  const isTxDefineSent = await getTxSid('define', handle);

  if (!isTxDefineSent) {
    log(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit define`);
    return false;
  }

  const inputNumbers = 5;

  const assetBlindRules = { isAmountBlind: false };

  const issueAssetBuilder = await AssetApi.issueAsset(
    walletInfo,
    derivedTokenCode,
    `${inputNumbers}`,
    assetBlindRules,
  );

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);

  const isTxIssueSent = await getTxSid('define', handleIssue);

  if (!isTxIssueSent) {
    log(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit issue`);
    return false;
  }

  const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: false };

  const sendTransactionBuilder = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    `${inputNumbers / 2}`,
    derivedTokenCode,
    assetBlindRulesForSend,
  );

  const handleSend = await TransactionApi.submitTransaction(sendTransactionBuilder);

  const isTxTransferSent = await getTxSid('send', handleSend);

  if (!isTxTransferSent) {
    log(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit send`);
    return false;
  }

  return true;
};

export const sendFraTransactionSubmit = async () => {
  log('////////////////  sendFraTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await KeypairApi.createKeypair(password);

  const receiverBalanceBeforeTransfer = await AccountApi.getBalanceInWei(toWalletInfo);

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

  const isTxSend = await getTxSid('send', resultHandle);

  if (!isTxSend) {
    log(`🚀  ~ sendFraTransactionSubmit ~ Could not submit send`);
    return false;
  }

  const receiverBalanceAfterTransfer = await AccountApi.getBalanceInWei(toWalletInfo);

  const isItRight = isNumberChangedBy(receiverBalanceBeforeTransfer, receiverBalanceAfterTransfer, numbers);

  const peterCheckResult = `Peter balance should be 0.100000 and now it is ${formatFromWei(
    receiverBalanceAfterTransfer,
  )}, so this is "${isItRight}" `;

  log('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);

  return isItRight;
};

export const sendFraConfidentialTransactionSubmit = async () => {
  log('////////////////  sendFraConfidentialTransactionSubmit //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await KeypairApi.createKeypair(password);

  const receiverBalanceBeforeTransfer = await AccountApi.getBalanceInWei(toWalletInfo);

  const assetBlindRules = { isTypeBlind: true, isAmountBlind: true };

  const numbers = '0.2';

  const assetCode = await AssetApi.getFraAssetCode();

  const transactionBuilder = await TransactionApi.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbers,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

  const isTxSend = await getTxSid('send', resultHandle);

  if (!isTxSend) {
    log(`🚀  ~ sendFraTransactionSubmit ~ Could not submit send`);
    return false;
  }

  const receiverBalanceAfterTransfer = await AccountApi.getBalanceInWei(toWalletInfo);

  const isItRight = isNumberChangedBy(receiverBalanceBeforeTransfer, receiverBalanceAfterTransfer, numbers);

  const peterCheckResult = `Peter balance should be 0.200000 and now it is ${formatFromWei(
    receiverBalanceAfterTransfer,
  )}, so this is "${isItRight}" `;

  log('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);

  return isItRight;
};

export const sendFraToMultipleReceiversTransactionSubmit = async () => {
  const pkey = mainFaucet;

  log('////////////////  sendFraToMultipleReceiversTransactionSubmit //////////////// ');
  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const aliceWalletInfo = await KeypairApi.createKeypair(password);

  const petereWalletInfo = await KeypairApi.createKeypair(password);

  const aliceBalanceBeforeTransfer = await AccountApi.getBalanceInWei(aliceWalletInfo);

  const peterBalanceBeforeTransfer = await AccountApi.getBalanceInWei(petereWalletInfo);

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

  const isTxSend = await getTxSid('send', resultHandle);

  if (!isTxSend) {
    log(`🚀  ~ sendFraToMultipleReceiversTransactionSubmit ~ Could not submit send`);
    return false;
  }

  const aliceBalanceAfterTransfer = await AccountApi.getBalanceInWei(aliceWalletInfo);
  const peterBalanceAfterTransfer = await AccountApi.getBalanceInWei(petereWalletInfo);

  const isItRightAlice = isNumberChangedBy(
    aliceBalanceBeforeTransfer,
    aliceBalanceAfterTransfer,
    numbersForAlice,
  );

  const isItRightPeter = isNumberChangedBy(
    peterBalanceBeforeTransfer,
    peterBalanceAfterTransfer,
    numbersForPeter,
  );

  const aliceCheckResult = `Alice balance should be 0.100000 and now it is ${formatFromWei(
    aliceBalanceAfterTransfer,
  )}, so this is "${isItRightAlice}" `;
  const peterCheckResult = `Peter balance should be 0.200000 and now it is ${formatFromWei(
    peterBalanceAfterTransfer,
  )}, so this is "${isItRightPeter}" `;

  log(
    '🚀 ~ file: integration.ts ~ line 597 ~ sendFraToMultipleReceiversTransactionSubmit ~ aliceCheckResult',
    aliceCheckResult,
  );

  log(
    '🚀 ~ file: integration.ts ~ line 602 ~ sendFraToMultipleReceiversTransactionSubmit ~ peterCheckResult',
    peterCheckResult,
  );

  return isItRightAlice && isItRightPeter;
};

export const getBalance = async () => {
  log('////////////////  getBalance //////////////// ');

  const pkey = mainFaucet;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

  const balance = await AccountApi.getBalance(walletInfo);
  return parseFloat(balance) > 0;
};

export const issueAndSendConfidentialAsset = async () => {
  log('////////////////  issueAndSendConfidentialAsset //////////////// ');

  const Ledger = await getLedger();

  const pkey = mainFaucet;
  const toPkey = receiverOne;

  const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await KeypairApi.restoreFromPrivateKey(toPkey, password);

  const aliceKeyPair = walletInfo.keypair;
  const bobKeyPair = toWalletInfo.keypair;

  const tokenCode = await AssetApi.getRandomAssetCode();
  const derivedTokenCode = await AssetApi.getDerivedAssetCode(tokenCode);

  log('Defining a custom asset:', tokenCode, derivedTokenCode);

  const assetRules = {
    transferable: false,
    updatable: true,
    decimals: 6,
  };

  const memo = 'this is a test asset';

  const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode, memo, assetRules);

  const handle = await TransactionApi.submitTransaction(assetBuilder);

  const isTxDefine = await getTxSid('defineAsset', handle);

  if (!isTxDefine) {
    log(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit define`);
    return false;
  }

  const inputNumbers = '5';

  const assetBlindRules = { isAmountBlind: true };

  const issueAssetBuilder = await AssetApi.issueAsset(
    walletInfo,
    derivedTokenCode,
    inputNumbers,
    assetBlindRules,
  );

  const handleIssue = await TransactionApi.submitTransaction(issueAssetBuilder);

  const isTxIssue = await getTxSid('issue', handleIssue);

  if (!isTxIssue) {
    log(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit issue`);
    return false;
  }

  log('Issue Asset with secret amount Transaction handle:', handleIssue);

  await waitForBlockChange();

  const issueTransactionStatus = await NetworkApi.getTransactionStatus(handleIssue);

  const { response: issueResponse } = issueTransactionStatus;

  if (!issueResponse) {
    log('ERROR issueTransactionStatus', issueTransactionStatus);

    return false;
  }

  const { Committed: IssueCommitted } = issueResponse;

  if (!Array.isArray(IssueCommitted)) {
    log('ERROR could not get Commited from defineResponse, line 705');
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
    log(
      '🚀 ~ file: integration.ts ~ line 778 ~ issueAndSendConfidentialAsset ~ isNonConfidentialMatches IS FALSE',
      isNonConfidentialMatches,
      nonConfUtxo?.utxo.record.amount.NonConfidential,
    );
    return false;
  }

  const isConfidentiaExists = confUtxo?.utxo.record.amount.Confidential;

  if (!isConfidentiaExists) {
    log(
      '🚀 ~ file: integration.ts ~ line 782 ~ issueAndSendConfidentialAsset ~ isConfidentiaExists IS FALSE , confUtxo?.utxo.record.amount',
      isConfidentiaExists,
      confUtxo?.utxo.record.amount,
    );
    return false;
  }

  const ownerMemoDataResult = await NetworkApi.getOwnerMemo(confSid);

  const { response: ownerMemoJson } = ownerMemoDataResult;

  if (!ownerMemoJson) {
    log(
      '🚀 ~ file: integration.ts ~ line 794 ~ issueAndSendConfidentialAsset ~ there is not ownerMemo for confidential sid!',
    );
    log(
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
    log(
      '🚀 ~ file: integration.ts ~ line 815 ~ issueAndSendConfidentialAsset ~ isDecryptedRecordCorrect IS FALSE!, decryptedRecord',
      isDecryptedRecordCorrect,
      decryptedRecord,
    );
  }

  const transferAmount = decryptedRecord?.amount;
  const numbersForPeter = bigNumber.fromWei(transferAmount, 6).toFormat(6);

  const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };

  const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: numbersForPeter }];

  const sendTransactionBuilder = await TransactionApi.sendToMany(
    walletInfo,
    recieversInfo,
    derivedTokenCode,
    assetBlindRulesForSend,
  );

  const handleSend = await TransactionApi.submitTransaction(sendTransactionBuilder);

  const isTxSend = await getTxSid('send', handleSend);

  if (!isTxSend) {
    log(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit send`);
    return false;
  }

  const bobTxoSidsResult = await NetworkApi.getOwnedSids(toWalletInfo.publickey);

  const { response: bobTxoSids } = bobTxoSidsResult;

  if (!bobTxoSids) {
    log(`Could not retrieve the list of sids of the receiver. Response was: `, bobTxoSidsResult);
    return false;
  }

  const [newSid] = bobTxoSids.sort((a, b) => b - a);

  const bobUtxoDataResult = await NetworkApi.getUtxo(newSid);

  const { response: bobUtxoResponse } = bobUtxoDataResult;

  if (!bobUtxoResponse) {
    log('ERROR could not get bobUtxoResponse', bobUtxoDataResult);
    return false;
  }

  const bobMemoDataResult = await NetworkApi.getOwnerMemo(newSid);

  const { response: bobMemoJson } = bobMemoDataResult;

  if (!bobMemoJson) {
    log('could not get owner memo for the send to Bob transfer!', bobMemoDataResult);
    return false;
  }

  const bobOwnerMemo = Ledger.OwnerMemo.from_json(bobMemoJson);

  const bobAssetRecord = Ledger.ClientAssetRecord.from_json(bobUtxoResponse?.utxo);

  const bobDecryptedRecord = Ledger.open_client_asset_record(bobAssetRecord, bobOwnerMemo, bobKeyPair);

  const isBobDecryptedRecordCorrect = bobDecryptedRecord?.amount === '5000000';

  if (!isBobDecryptedRecordCorrect) {
    log(
      '🚀 ERROR ~ file: integration.ts ~ line 883 ~ issueAndSendConfidentialAsset ~ isBobDecryptedRecordCorrect',
      isBobDecryptedRecordCorrect,
      bobDecryptedRecord,
    );
    return false;
  }

  const isAssetTypeCorrect =
    Ledger.asset_type_from_jsvalue(bobDecryptedRecord.asset_type) == derivedTokenCode;

  if (!isAssetTypeCorrect) {
    log(
      '🚀 ERROR ~ file: integration.ts ~ line 893 ~ issueAndSendConfidentialAsset ~ isAssetTypeCorrect',
      isAssetTypeCorrect,
      bobDecryptedRecord,
    );
    return false;
  }

  return true;
};

// export const delegateFraTransactionSubmit = async () => {
//   log('////////////////  delegateFraTransactionSubmit //////////////// ');

//   // send part
//   const Ledger = await getLedger();

//   const pkey = mainFaucet;

//   const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
//   const toWalletInfo = await KeypairApi.createKeypair(password);

//   const numbersToDelegate = '1000000';
//   const numbersToSend = '1000010';

//   const fraCode = await AssetApi.getFraAssetCode();
//   const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

//   const isFundSuccesfull = await sendFromFaucetToAccount(walletInfo, toWalletInfo, numbersToSend);

//   if (!isFundSuccesfull) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
//     return false;
//   }

//   // delegate part
//   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
//   const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);

//   const formattedVlidators = await StakingApi.getValidatorList();
//   const validatorAddress = formattedVlidators.validators[0].addr;

//   const transactionBuilder = await StakingApi.delegate(
//     toWalletInfo,
//     delegationTargetAddress,
//     numbersToDelegate,
//     fraCode,
//     validatorAddress,
//     assetBlindRules,
//   );

//   const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

//   const isTxDelegated = await getTxSid('delegate', resultHandle);

//   if (!isTxDelegated) {
//     log(`🚀  ~ delegateFraTransactionSubmit ~ Could not submit delegation`);
//     return false;
//   }

//   log('🚀  ~ delegateFraTransactionSubmit ~ waiting for 10 blocks before checking rewards');

//   // 10 blocks
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   log('🚀  ~ delegateFraTransactionSubmit ~ checking rewards now');

//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);

//   const isRewardsAdded = Number(delegateInfo.rewards) > 0;

//   if (!isRewardsAdded) {
//     log('🚀  ~ delegateFraTransactionSubmit ~ There is no rewards yet! , delegateInfo', delegateInfo);
//     return false;
//   }

//   log('🚀  ~ delegateFraTransactionSubmit ~ accumulated rewards ', delegateInfo.rewards);

//   return true;
// };

// export const delegateFraTransactionAndClaimRewards = async () => {
//   log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');

//   const password = '123';
//   const Ledger = await getLedger();

//   const pkey = mainFaucet;

//   const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
//   const toWalletInfo = await KeypairApi.createKeypair(password);
//   log(
//     '🚀 ~ file: integration.ts ~ line 1096 ~ delegateFraTransactionAndClaimRewards ~ toWalletInfo',
//     toWalletInfo,
//   );

//   const numbersToDelegate = '1000001';
//   const numbersToSend = '1000010';

//   const fraCode = await AssetApi.getFraAssetCode();
//   const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

//   const isFundSuccesfull = await sendFromFaucetToAccount(walletInfo, toWalletInfo, numbersToSend);

//   if (!isFundSuccesfull) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
//     return false;
//   }

//   // delegate
//   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
//   const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);

//   const formattedVlidators = await StakingApi.getValidatorList();
//   const validatorAddress = formattedVlidators.validators[0].addr;

//   const transactionBuilder = await StakingApi.delegate(
//     toWalletInfo,
//     delegationTargetAddress,
//     numbersToDelegate,
//     fraCode,
//     validatorAddress,
//     assetBlindRules,
//   );

//   const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

//   // w2
//   const isTxDelegated = await getTxSid('delegate', resultHandle);

//   if (!isTxDelegated) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit delegation`);
//     return false;
//   }

//   log('delegateFraTransactionAndClaimRewards - waiting for 11 blocks before checking rewards');

//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   await sleep(waitingTimeBeforeCheckTxStatus);

//   log('delegateFraTransactionAndClaimRewards - checking rewards now');

//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);

//   const amountToClaim = delegateInfo.rewards;

//   const isRewardsAdded = Number(amountToClaim) > 0;

//   if (!isRewardsAdded) {
//     log(
//       'delegateFraTransactionAndClaimRewards - There is no rewards yet! , delegateInfo',
//       delegateInfo,
//     );
//     return false;
//   }

//   log('delegateFraTransactionAndClaimRewards - accumulated rewards ', amountToClaim);

//   // claim
//   const balanceBefore = await AccountApi.getBalanceInWei(toWalletInfo);

//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim', balanceBefore);

//   const transactionBuilderClaim = await StakingApi.claim(toWalletInfo, amountToClaim);

//   const resultHandleClaim = await TransactionApi.submitTransaction(transactionBuilderClaim);

//   // w 10
//   const isTxClaimed = await getTxSid('clam', resultHandleClaim);

//   if (!isTxClaimed) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit claim`);
//     return false;
//   }

//   log(
//     'delegateFraTransactionAndClaimRewards - waiting for 11 blocks before checking balance of claimed rewards',
//   );

//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);

//   await sleep(waitingTimeBeforeCheckTxStatus);

//   const balanceAfter = await AccountApi.getBalanceInWei(toWalletInfo);

//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter', balanceAfter);

//   const balanceBeforeBN = bigNumber.create(balanceBefore);
//   const balanceAfterBN = bigNumber.create(balanceAfter);

//   const isClaimSuccessfull = balanceAfterBN.gte(balanceBeforeBN);

//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull', isClaimSuccessfull);

//   return isClaimSuccessfull;
// };
