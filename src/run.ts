import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { Account, Asset, Keypair, Network, Staking, Transaction } from './api';
import Sdk from './Sdk';
import * as bigNumber from './services/bigNumber';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import * as Fee from './services/fee';
import { getLedger } from './services/ledger/ledgerWrapper';
import * as UtxoHelper from './services/utxoHelper';
import { Evm } from './api';
import sleep from 'sleep-promise';

dotenv.config();
const waitingTimeBeforeCheckTxStatus = 18000;

const mainFaucet = 'XXX';

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://dev-staging.dev.findora.org',
  // hostUrl: 'https://dev-evm.dev.findora.org',
  hostUrl: 'http://127.0.0.1',
  // hostUrl: 'https://prod-testnet.prod.findora.org',
  // cacheProvider: FileCacheProvider,
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const CustomAssetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=';

/**
 * A simple example - how to use SDK to get FRA assset code
 */
const getFraAssetCode = async () => {
  const assetCode = await Asset.getFraAssetCode();

  console.log('FRA assetCode IS', assetCode);
};

/**
 * Get FRA balance
 */
const getFraBalance = async () => {
  const pkeyMine = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const pkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const pkeyMine3 = 'KUAxjaf4NWbxM714pEKRdOf5vLD-ECl4PuT1pgH-m0k=';
  const pkeyMine4 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';
  const pkeyLocalFaucet = 'Ew9fMaryTL44ZXnEhcF7hQ-AB-fxgaC8vyCH-hCGtzg=';

  const pkey1 = 'p-9UpNFzuyptVhdMrNj2tyQqFrYaC5lqBvWrEsSKc-g=';
  const pkey2 = 'ZbGRFBqZC_wD4SBfAbxqh17BG-y-jTbkeLNs06FUHJY=';
  const pkey3 = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
  const pkey4 = 'o9xuRVejhJ5iLCTkqfjyWfoCDmJPB4clklfyozCw5Xg=';
  const pkey6 = 'gOGMwUJN8Tq33LwIdWHmkfcbYesg7Us_S58WEgJaRYc=';

  const password = '1234';
  console.log('aaa!');

  const pkey = pkeyLocalFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  // console.log('🚀 ~ file: run.ts ~ line 55 ~ getFraBalance ~ walletInfo', walletInfo);

  const fraCode = await Asset.getFraAssetCode();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    return;
  }

  const balanceInWei = await Account.getAssetBalance(walletInfo, fraCode, sids);

  const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

  console.log('\n');

  console.log('walletInfo.address', walletInfo.address);
  console.log('walletInfo.privateStr', walletInfo.privateStr);

  console.log('balance IS', balance);
  console.log('\n');
  console.log('\n');
};

/**
 * Get custom asset balance
 */
const getCustomAssetBalance = async () => {
  const password = '123';
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const customAssetCode = CustomAssetCode;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS', balance);
};

/**
 * Define a custom asset
 */
const defineCustomAsset = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const password = '123';

  const assetCode = await Asset.getRandomAssetCode();

  console.log('🚀 ~ file: run.ts ~ line 110 ~ defineCustomAsset ~ assetCode', assetCode);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our new asset created, handle - ! ! ', handle);
};

/**
 * Issue custom asset
 */
const issueCustomAsset = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const customAssetCode = CustomAssetCode;

  const password = '123';
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };

  const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, '5', assetBlindRules);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our issued tx handle IS', handle);
};

/**
 * Get state commitment object (for example if we need to get current block height)
 */
const getStateCommitment = async () => {
  const stateCommitment = await Network.getStateCommitment();

  console.log('stateCommitment', stateCommitment);
};

const getValidatorList = async () => {
  // const validatorList = await Network.getValidatorList();

  // console.log('validatorList', validatorList);
  // const { response } = validatorList;

  // if (!response) {
  //   throw new Error('validators are missing!');
  // }

  // const { validators } = response;

  // console.log('validators', validators);

  const formattedVlidators = await Staking.getValidatorList();

  console.log('formattedVlidators', formattedVlidators);
};

const getDelegateInfo = async () => {
  // const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const pkey = mainFaucet;
  const password = '123';
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  // const lightWalletKeypair = await Keypair.getAddressPublicAndKey(walletInfo.address);

  // const delegateInfoDataResult = await Network.getDelegateInfo(lightWalletKeypair.publickey);

  // const { response: delegateInfoResponse } = delegateInfoDataResult;

  // if (!delegateInfoResponse) {
  //   throw new Error('validators are missing!');
  // }

  // const { validators } = response;

  // console.log('delegateInfoResponse', delegateInfoResponse);

  const delegateInfo = await Staking.getDelegateInfo(walletInfo.address);
  console.log('🚀 ~ file: run.ts ~ line 192 ~ getDelegateInfo ~ delegateInfo', delegateInfo);
};

/**
 * Get transfer operation builder (before sending a tx)
 */
const getTransferBuilderOperation = async () => {
  const ledger = await getLedger();

  const password = '123';
  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    return;
  }

  const utxoDataList = await UtxoHelper.addUtxo(walletInfo, sids);

  const fraCode = await Asset.getFraAssetCode();

  const amount = BigInt(3);

  const sendUtxoList = UtxoHelper.getSendUtxo(fraCode, amount, utxoDataList);

  const utxoInputsInfo = await UtxoHelper.addUtxoInputs(sendUtxoList);

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.fra_get_dest_pubkey();

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
    },
  ];
  const trasferOperation = await Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, fraCode);

  console.log('trasferOperation!', trasferOperation);
};

/**
 * Create a wallet info object (a keypair)
 */
const createNewKeypair = async () => {
  const password = '123';

  const walletInfo = await Keypair.createKeypair(password);
  console.log('new wallet info', walletInfo);
};

/**
 * Send fra to a single recepient
 */
const transferFraToSingleRecepient = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '2',
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send fra result handle!!', resultHandle);
};

/**
 * Send fra to multiple recepients
 */
const transferFraToMultipleRecepients = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toPkeyMine3 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
  ];

  const transactionBuilder = await Transaction.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send to multiple receipient result handle!', resultHandle);
};

/**
 * Send custom asset to a single recepient
 */
const transferCustomAssetToSingleRecepient = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const customAssetCode = CustomAssetCode;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const assetCode = customAssetCode;

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

/**
 * Send custom asset to multiple recepients
 */
const transferCustomAssetToMultipleRecepients = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toPkeyMine3 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const assetCode = CustomAssetCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
  ];

  const transactionBuilder = await Transaction.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send custom result handle!', resultHandle);
};

/**
 * Get custom asset details
 */
const getCustomAssetDetails = async () => {
  const customAssetCode = CustomAssetCode;

  const result = await Asset.getAssetDetails(customAssetCode);

  console.log('get custom asset details !', result);
};

/**
 * Get transaction status
 */
const getTransactionStatus = async () => {
  const h = 'b07040a5d8c9ef6fcb98b95968e6c1f14f77405e851ac8230942e1c305913ea0';

  const txStatus = await Network.getTransactionStatus(h);

  console.log('transaction status', JSON.stringify(txStatus, null, 2));
};

/**
 * get block details
 */
const getBlockDetails = async () => {
  const height = 45;

  const blockDetailsResult = await Network.getBlock(height);

  console.log('blockDetails! :)', JSON.stringify(blockDetailsResult, null, 2));

  const { response } = blockDetailsResult;

  const block = response?.result;
  console.log('block', block?.block.header.height);
};

// get tx hash details
const myFunc14 = async () => {
  const h = 'bfcde17f7e8f0acb746d4efcbd61ed2490ea4e2909922cebec15a6308bab47c2';

  const dataResult = await Network.getHashSwap(h);

  const { response } = dataResult;

  console.log(response?.result.txs);
};

// get tx list hash details
const myFunc15 = async () => {
  const h = 'bfcde17f7e8f0acb746d4efcbd61ed2490ea4e2909922cebec15a6308bab47c2';

  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const dataResult = await Network.getTxList(walletInfo.address, 'to');

  const { response } = dataResult;

  // console.log('response!', JSON.stringify(response, null, 2));

  console.log('response!!!', response);
  // console.log(response?.result.txs?.[0]);
};

const myFunc16 = async () => {
  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const txList = await Transaction.getTxList(walletInfo.address, 'from');

  console.log('txList', txList);
};

const myFunc17 = async () => {
  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const a = await Account.getCreatedAssets(walletInfo.address);

  // const dataResult = await Network.getIssuedRecords(walletInfo.publickey);

  // console.log('dataResult!', dataResult);
};

const myFunc18 = async () => {
  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  // const dataResult = await Network.getRelatedSids(walletInfo.publickey);
  const sids = await Account.getRelatedSids(walletInfo.publickey);

  console.log('sids!!', sids);
};

// s3
const myFuncS3 = async () => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, UTXO_CACHE_BUCKET_NAME, UTXO_CACHE_KEY_NAME } =
    process.env;
  const accessKeyId = AWS_ACCESS_KEY_ID || '';
  const secretAccessKey = AWS_SECRET_ACCESS_KEY || '';
  const cacheBucketName = UTXO_CACHE_BUCKET_NAME || '';
  const cacheItemKey = UTXO_CACHE_KEY_NAME || '';

  const s3Params = {
    accessKeyId,
    secretAccessKey,
  };

  const s3 = new S3(s3Params);

  let readRes;

  try {
    readRes = await s3
      .getObject({
        Bucket: cacheBucketName,
        Key: cacheItemKey,
      })
      .promise();
  } catch (error) {
    const e: Error = error as Error;

    console.log('Error!', e.message);
  }

  console.log('readRes :) 5', readRes?.Body?.toString());

  const existingContent = readRes?.Body?.toString('utf8');

  let res;

  const myBody = `${existingContent}\nFUNCTION STARTED: ${new Date()}`;

  try {
    res = await s3
      .putObject({
        Bucket: cacheBucketName,
        Key: cacheItemKey,
        Body: myBody,
      })
      .promise();
  } catch (error) {
    const e: Error = error as Error;

    console.log('Error!', e.message);
  }
};

const myFuncUndelegate = async () => {
  const rickey2 = 'glzudSr1lCGmkLjETDeUDCP_hBNkCmXILnPHPCRuI5Y=';
  const mine = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const password = '123';

  const mineWalletInfo = await Keypair.restoreFromPrivateKey(mine, password);

  // const dataResult = await Network.getRelatedSids(walletInfo.publickey);
  // const unStakeResHandle = await Staking.unStake(mineWalletInfo);

  // console.log('unStakeResHandle!!!', unStakeResHandle);
};

export const delegateFraTransactionSubmit = async () => {
  console.log('////////////////  delegateFraTransactionSubmit //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  // await sleep(waitingTimeBeforeCheckTxStatus);
  // await sleep(waitingTimeBeforeCheckTxStatus);
  const balanceAfterUnstake = await Account.getBalance(toWalletInfo);
  console.log(
    '🚀 ~ file: run.ts ~ line 605 ~ delegateFraTransactionSubmit ~ balanceAfterUnstake',
    balanceAfterUnstake,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ delegateFraTransactionSubmit ~ transactionBuilder',
    transactionBuilder,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ delegateFraTransactionSubmit ~ resultHandle',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  // await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await Network.getTransactionStatus(resultHandle);

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

  console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  return true;
};

export const delegateFraTransactionAndClaimRewards = async () => {
  console.log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const balanceBeforeSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeSend',
    balanceBeforeSend,
  );

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend',
    balanceAfterSend,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ delegateResultHandle',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await Network.getTransactionStatus(resultHandle);

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

  const balanceAfterDelegate = await Account.getBalance(toWalletInfo);

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

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  // claim

  const balanceBefore = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 801 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim',
    balanceBefore,
  );

  const amountToClaim = delegateInfo.rewards;

  const transactionBuilderClaim = await Staking.claim(toWalletInfo, amountToClaim);

  const resultHandleClaim = await Transaction.submitTransaction(transactionBuilderClaim);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ resultHandleClaim',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusClaim = await Network.getTransactionStatus(resultHandleClaim);

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

  const balanceAfter = await Account.getBalance(toWalletInfo);

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

export const unstakeFraTransactionSubmit = async () => {
  console.log('////////////////  unstakeFraTransactionSubmit //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  // const bb = await Account.getBalance(walletInfo);
  // console.log('🚀 ~ file: run.ts ~ line 905 ~ unstakeFraTransactionSubmit ~ bb', bb);

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  // const balanceBeforeSend = await Account.getBalance(toWalletInfo);

  // console.log(
  //   '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeSend',
  //   balanceBeforeSend,
  // );

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusSend = await Network.getTransactionStatus(resultHandleSend);

  // return true;
  console.log('Retrieved transaction status response:', transactionStatusSend);

  const { response: sendResponse } = transactionStatusSend;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandleSend}. Response was: `,
      transactionStatusSend,
    );

    return false;
  }

  const balanceAfterSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend',
    balanceAfterSend,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilderDelegate = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderDelegate',
    transactionBuilderDelegate,
  );

  const resultHandleDelegate = await Transaction.submitTransaction(transactionBuilderDelegate);
  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate',
    resultHandleDelegate,
  );

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate',
    resultHandleDelegate,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusDelegate = await Network.getTransactionStatus(resultHandleDelegate);

  console.log('Retrieved transaction status response:', transactionStatusDelegate);

  const { response: delegateResponse } = transactionStatusDelegate;

  if (!delegateResponse) {
    return false;
  }

  const { Committed: CommittedDelegate } = delegateResponse;

  if (!Array.isArray(CommittedDelegate)) {
    return false;
  }

  const txnSIDDelegate = CommittedDelegate && Array.isArray(CommittedDelegate) ? CommittedDelegate[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSIDDelegate', txnSIDDelegate);

  if (!txnSIDDelegate) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandleDelegate}. Response was: `,
      transactionStatusDelegate,
    );

    return false;
  }

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  // unstake

  const balanceBeforeUnstake = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceBeforeUnstake',
    balanceBeforeUnstake,
  );

  const transactionBuilderUnstake = await Staking.unStake(toWalletInfo, numbersToDelegate, validatorAddress);

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderUnstake',
    transactionBuilderUnstake,
  );

  const resultHandleUnstake = await Transaction.submitTransaction(transactionBuilderUnstake);
  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandle',
    resultHandleUnstake,
  );

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleUnstake',
    resultHandleUnstake,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterUnstake = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceAfterUnstake',
    balanceAfterUnstake,
  );

  const isUnstakeSuccessfull = Number(balanceAfterUnstake) > Number(balanceBeforeUnstake);
  console.log(
    '🚀 ~ file: run.ts ~ line 877 ~ unstakeFraTransactionSubmit ~ isUnstakeSuccessfull',
    isUnstakeSuccessfull,
  );

  return isUnstakeSuccessfull;
};

const sendEvmToAccount = async () => {
  const fraAddress = 'fra1d2yetp5ljdwn0zfhusvshgt4d3nyk4j3e0w2stqzlsnv8ra4whmsfzqfga';
  const amount = '1';
  const ethPrivate = 'fa6a6e57595d7e9c227e769deaf7822fcb6176cac573d73979b2c9ce808e6275';
  const ethAddress = '0xA2892dA49B74F069400694E4930aa9D6Db0e67b3';
  await Evm.sendEvmToAccount(fraAddress, amount, ethPrivate, ethAddress);
};

// New
// getFraAssetCode(); // works

// getFraBalance(); // works
// getCustomAssetBalance(); // works
// defineCustomAsset(); // works
// issueCustomAsset(); // works
// getStateCommitment(); // works
// getValidatorList();
// getDelegateInfo(); // 1
// getTransferBuilderOperation(); // works
// createNewKeypair(); // works
// transferFraToSingleRecepient(); // works
// transferFraToMultipleRecepients(); // works
// transferCustomAssetToSingleRecepient(); // works
// transferCustomAssetToMultipleRecepients();
// getCustomAssetDetails(); // works
// getTransactionStatus(); // works
// getBlockDetails();
delegateFraTransactionSubmit(); // 2
// delegateFraTransactionAndClaimRewards(); //3
// unstakeFraTransactionSubmit(); //4
// sendEvmToAccount();
