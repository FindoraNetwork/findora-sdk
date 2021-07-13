import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';

import { Api } from '.';
import { Account, Asset, Keypair, Network, Staking, Transaction } from './api';
import Sdk from './Sdk';
import * as bigNumber from './services/bigNumber';
import { FileCacheProvider } from './services/cacheStore/providers';
import * as Fee from './services/fee';
import { getLedger } from './services/ledger/ledgerWrapper';
import * as UtxoHelper from './services/utxoHelper';

dotenv.config();

const sdkEnv = {
  // hostUrl: 'https://dev-staging.dev.findora.org',
  hostUrl: 'https://prod-testnet.prod.findora.org',
  cacheProvider: FileCacheProvider,
  // cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const myFunc1 = async () => {
  const assetCode = await Asset.getFraAssetCode();

  console.log('FRA assetCode IS', assetCode);
};

// define asset
const myFunc2 = async () => {
  // const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const pkey2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';

  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const password = '123';

  const assetCode = await Asset.getRandomAssetCode();
  console.log('🚀 ~ file: run.ts ~ line 41 ~ myFunc2 ~ assetCode', assetCode);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our new asset created, handle - ! ! ', handle);
};

// myFunc2();

// get state commitment
const myFunc3 = async () => {
  // const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const sidsResult = await Network.getOwnedSids(address);

  console.log('sidsResult', sidsResult);

  const sid = 519;

  const utxo = await Network.getUtxo(sid);

  console.log('utxo!', utxo);

  const ownerMemo = await Network.getOwnerMemo(sid);

  console.log('owner memo', ownerMemo);

  const stateCommitment = await Network.getStateCommitment();

  console.log('stateCommitment', stateCommitment);
};

// get transfer operation with fee
const myFunc4 = async () => {
  const ledger = await getLedger();

  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const sidsResult = await Network.getOwnedSids(address);

  const { response: sids } = sidsResult;

  console.log('sids', sids);

  if (!sids) {
    return;
  }

  const utxoDataList = await UtxoHelper.addUtxo(walletInfo, sids);

  console.log('utxoDataList', utxoDataList);

  const fraCode = await Asset.getFraAssetCode();

  const amount = BigInt(3);

  const sendUtxoList = UtxoHelper.getSendUtxo(fraCode, amount, utxoDataList);

  console.log('sendUtxoList!', sendUtxoList);

  const utxoInputsInfo = await UtxoHelper.addUtxoInputs(sendUtxoList);

  console.log('utxoInputsInfo!', utxoInputsInfo);

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.fra_get_dest_pubkey();

  console.log('toPublickey', toPublickey);

  const publicKeyInString = ledger.public_key_to_base64(toPublickey);
  console.log('publicKeyInString', publicKeyInString);
  const addressInString = ledger.base64_to_bech32(publicKeyInString);
  console.log('addressInString', addressInString);

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
    },
  ];
  const trasferOperation = await Fee.getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    // minimalFee,
    fraCode,
  );

  console.log('trasferOperation!', trasferOperation);
};

// get fra balance
const myFunc5 = async () => {
  // const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  // const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const pkey1 = 'p-9UpNFzuyptVhdMrNj2tyQqFrYaC5lqBvWrEsSKc-g=';

  const pkey2 = 'ZbGRFBqZC_wD4SBfAbxqh17BG-y-jTbkeLNs06FUHJY=';

  const pkey3 = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';

  const pkey4 = 'o9xuRVejhJ5iLCTkqfjyWfoCDmJPB4clklfyozCw5Xg=';

  const pkey5 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';

  const pkey6 = 'gOGMwUJN8Tq33LwIdWHmkfcbYesg7Us_S58WEgJaRYc=';

  const toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toPkeyMine3 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const password = '123';

  // const walletInfo = await Keypair.restoreFromPrivateKey(pkey1, password);
  // const walletInfo = await Keypair.restoreFromPrivateKey(pkey2, password);
  // const walletInfo = await Keypair.restoreFromPrivateKey(pkey3, password);
  // const walletInfo = await Keypair.restoreFromPrivateKey(pkey4, password);
  // const walletInfo = await Keypair.restoreFromPrivateKey(pkey5, password);
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey6, password);

  // const walletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  // const walletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

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

// get custom asset balance
const myFunc6 = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS :)', balance);
};

// issue custom asset
const myFunc7 = async () => {
  // const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  // const customAssetCode = 'aRsWc8P6xFqa88S5DhuWJSYTQfmcDQRuSTsaOxv2GeM=';

  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };

  // const decimals = 6;

  const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, 5, assetBlindRules);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our issued tx handle IS', handle);
};

// creates a kp
const myFunc8 = async () => {
  const password = '123';

  const walletInfo = await Keypair.createKeypair(password);
  console.log('new wallet info', walletInfo);
};

// send fra
const myFunc9 = async () => {
  const pkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';

  const toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const toPkeyMine3 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  // const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  // const toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  // const decimals = 6;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    4,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  // console.log(resultHandle.transaction());

  console.log('send fra result handle!!', resultHandle);
};

// send custom asset
const myFunc10 = async () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const customAssetCode = '1LZBwDm6JM8obbHQonBq8ICMIekDY1gbA1-Sify3t3M=';

  const toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const assetCode = customAssetCode;

  // const decimals = 6;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const resultHandle = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    0.1,
    assetCode,
    assetBlindRules,
  );

  console.log('send custom result handle!', resultHandle);

  // const resultHandleTwo = await Transaction.sendToPublicKey(
  //   walletInfo,
  //   toWalletInfo.publickey,
  //   0.1,
  //   assetCode,
  //   assetBlindRules,
  // );

  // console.log('send custom result handle 2!', resultHandleTwo);
};

// get custom asset details
const myFunc11 = async () => {
  const customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';

  const result = await Api.Asset.getAssetDetails(customAssetCode);

  console.log('get custom asset details !', result);

  const h = 'b07040a5d8c9ef6fcb98b95968e6c1f14f77405e851ac8230942e1c305913ea0';

  const txStatus = await Network.getTransactionStatus(h);

  console.log('txStatus!', JSON.stringify(txStatus, null, 2));
};

// send custom asset to many
const myFunc12 = async () => {
  // const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  // const fkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';

  const pkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
  // const customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';

  const toPkeyMine2 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const toPkeyMine3 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;
  // const assetCode = customAssetCode;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: 10 },
    { reciverWalletInfo: toWalletInfoMine3, amount: 20 },
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

// get block details
const myFunc13 = async () => {
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

// send custom
// myFunc10();

// fra balance
// myFunc5();
// myFunc12();
// send fra
// myFunc9();

// myFunc4();

// send fra to many
// myFunc12();

// myFunc8();

// define asset
// myFunc2();

// issue custom asset
// myFunc7();

// send custom asset
// myFunc10();
myFunc6();
