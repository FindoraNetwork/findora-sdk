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
  console.log('pass!', password);

  const assetCode = await Asset.getRandomAssetCode();

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const asset = await Asset.defineAsset(walletInfo, assetCode);

  console.log('our new asset IS ! ! ', asset);
};

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

  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const fraCode = await Asset.getFraAssetCode();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  console.log('sidsResult', sidsResult);

  const { response: sids } = sidsResult;

  console.log('sids!', sids);

  if (!sids) {
    return;
  }

  const balanceInWei = await Account.getAssetBalance(walletInfo, fraCode, sids);

  console.log('balance in wei IS!!', balanceInWei);

  const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

  console.log('balance IS!!!!!', balance);

  const balanceInWeiT = await Account.getAssetBalance(walletInfo, fraCode, sids);

  console.log('balanceT in wei IS!!', balanceInWeiT);

  const balanceT = bigNumber.fromWei(balanceInWeiT, 6).toFormat(6);

  console.log('balance IS!!!', balanceT);
};

// get custom asset balance
const myFunc6 = async () => {
  const pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS :)', balance);
};

// issue custom asset
const myFunc7 = async () => {
  // const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  // const customAssetCode = 'aRsWc8P6xFqa88S5DhuWJSYTQfmcDQRuSTsaOxv2GeM=';

  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const customAssetCode = '1LZBwDm6JM8obbHQonBq8ICMIekDY1gbA1-Sify3t3M=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };

  const decimals = 6;

  const handle = await Asset.issueAsset(walletInfo, customAssetCode, 5, assetBlindRules, decimals);

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
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const decimals = 6;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const resultHandle = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    4,
    assetCode,
    assetBlindRules,
  );

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

  const decimals = 6;

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
  const pkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
  const customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';

  const toPkeyMine = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const toPkeyMine2 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine = await Keypair.restoreFromPrivateKey(toPkeyMine, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;
  // const assetCode = customAssetCode;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine, amount: 0.1 },
    { reciverWalletInfo: toWalletInfoMine2, amount: 0.2 },
  ];

  const resultHandle = await Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules);

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
// send fra
// myFunc9();

// myFunc4();

// myFunc12();
// myFunc8();

// define asset
myFunc2();

// issue custom asset
// myFunc7();

// send custom asset
// myFunc10();
