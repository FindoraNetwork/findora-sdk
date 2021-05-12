import { Account, Asset, Keypair, Network } from './api';
import Sdk from './Sdk';
import * as bigNumber from './services/bigNumber';
import * as Fee from './services/fee';
import * as UtxoHelper from './services/utxoHelper';

const sdkEnv = { hostUrl: 'https://dev-staging.dev.findora.org' };

Sdk.init(sdkEnv);

const myFunc1 = async () => {
  const assetCode = await Asset.getFraAssetCode();

  console.log('FRA assetCode IS', assetCode);
};

// define asset
const myFunc2 = async () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';
  console.log('pass!', password);

  const assetCode = await Asset.getRandomAssetCode();

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const asset = await Asset.defineAsset(walletInfo, assetCode);

  console.log('our new asset IS ', asset);
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
  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

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

  const trasferOperation = await Fee.getTransferOperationWithFee(walletInfo, utxoInputsInfo);

  console.log('trasferOperation!', trasferOperation);
};

// get fra balance
const myFunc5 = async () => {
  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const fraCode = await Asset.getFraAssetCode();

  const sidsResult = await Network.getOwnedSids(address);

  // console.log('sidsResult', sidsResult);

  const { response: sids } = sidsResult;

  console.log('sids', sids);

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

  console.log('balance IS!!!!!', balanceT);
};

// get custom asset balance
const myFunc6 = async () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const customAssetCode = 'aRsWc8P6xFqa88S5DhuWJSYTQfmcDQRuSTsaOxv2GeM=';

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS!!!!! :)', balance);
};

// issue custom asset
const myFunc7 = async () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const customAssetCode = 'aRsWc8P6xFqa88S5DhuWJSYTQfmcDQRuSTsaOxv2GeM=';

  const handle = await Asset.issueAsset(walletInfo, customAssetCode, 2);

  console.log('our issued tx handle IS ', handle);
};

myFunc7();
