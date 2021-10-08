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
  const pkey2 = 'XXXXX=';

  const pkey = 'XXXXXX=';

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
  const address = 'XXXXX';

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

  const address = 'XXXXX';

  const pkey = 'XXXXX=';
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
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey6, password);

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
  const pkey = 'XXXXXX=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS :)', balance);
};

// issue custom asset
const myFunc7 = async () => {
  const pkey = 'XXXXXX=';
  const customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };

  const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, '5', assetBlindRules);

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
  const pkey = 'XXXXXX=';

  const toPkeyMine2 = 'XXXXX=';
  const toPkeyMine3 = 'XXXXXX=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '4',
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send fra result handle!!', resultHandle);
};

// send custom asset
const myFunc10 = async () => {
  const pkey = 'XXXXXX=';

  const customAssetCode = '1LZBwDm6JM8obbHQonBq8ICMIekDY1gbA1-Sify3t3M=';

  const toPkey = 'XXXXX=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const assetCode = customAssetCode;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const resultHandle = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '0.1',
    assetCode,
    assetBlindRules,
  );

  console.log('send custom result handle!', resultHandle);
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
  const pkey = 'XXXXXX=';

  const toPkeyMine2 = 'XXXXXX=';
  const toPkeyMine3 = 'XXXXX=';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Api.Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: '10' },
    { reciverWalletInfo: toWalletInfoMine3, amount: '20' },
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

  const pkey = 'XXXXX=';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const dataResult = await Network.getTxList(walletInfo.address, 'to');

  const { response } = dataResult;

  console.log('response!!!', response);
};

const myFunc16 = async () => {
  const pkey = 'XXXXX=';
  const toKey = 'XXXXXX';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const txList = await Transaction.getTxList(walletInfo.address, 'from');

  console.log('txList', txList);
};

const myFunc17 = async () => {
  const pkey = 'XXXXX=';
  const toKey = 'XXXXXX';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const a = await Account.getCreatedAssets(walletInfo.address);
};

const myFunc18 = async () => {
  const pkey = 'XXXXX=';
  const toKey = 'XXXXXX';

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

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
  const rickey2 = 'XXXX=';
  const mine = 'XXXXXX=';
  const password = '123';

  const mineWalletInfo = await Keypair.restoreFromPrivateKey(mine, password);
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
