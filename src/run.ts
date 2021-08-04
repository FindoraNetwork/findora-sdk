import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { Account, Asset, Keypair, Network, Staking, Transaction } from './api';
import Sdk from './Sdk';
import * as bigNumber from './services/bigNumber';
import { FileCacheProvider } from './services/cacheStore/providers';
import * as Fee from './services/fee';
import { getLedger } from './services/ledger/ledgerWrapper';
import * as UtxoHelper from './services/utxoHelper';

dotenv.config();

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://dev-staging.dev.findora.org',
  hostUrl: 'https://prod-testnet.prod.findora.org',
  cacheProvider: FileCacheProvider,
  // cacheProvider: MemoryCacheProvider,
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

  const pkey1 = 'p-9UpNFzuyptVhdMrNj2tyQqFrYaC5lqBvWrEsSKc-g=';
  const pkey2 = 'ZbGRFBqZC_wD4SBfAbxqh17BG-y-jTbkeLNs06FUHJY=';
  const pkey3 = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
  const pkey4 = 'o9xuRVejhJ5iLCTkqfjyWfoCDmJPB4clklfyozCw5Xg=';
  const pkey6 = 'gOGMwUJN8Tq33LwIdWHmkfcbYesg7Us_S58WEgJaRYc=';

  const password = '123';

  const pkey = pkeyMine2;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  console.log('🚀 ~ file: run.ts ~ line 55 ~ getFraBalance ~ walletInfo', walletInfo);

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
  const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    UTXO_CACHE_BUCKET_NAME,
    UTXO_CACHE_KEY_NAME,
  } = process.env;
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
  // const unDelegateResHandle = await Staking.unDelegate(mineWalletInfo);

  // console.log('unDelegateResHandle!!!', unDelegateResHandle);
};

// New
// getFraAssetCode(); // works
// getFraBalance(); // works
// getCustomAssetBalance(); // works
// defineCustomAsset(); // works
// issueCustomAsset(); // works
// getStateCommitment(); // works
// getTransferBuilderOperation(); // works
// createNewKeypair(); // works
// transferFraToSingleRecepient(); // works
// transferFraToMultipleRecepients(); // works
// transferCustomAssetToSingleRecepient(); // works
// transferCustomAssetToMultipleRecepients();
// getCustomAssetDetails(); // works
// getTransactionStatus(); // works
getBlockDetails();
