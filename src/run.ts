import { Asset, Core, Keypair } from './api';
import { network } from './services';

const myAsset = async () => {
  const assetCode = await Asset.getFraAssetCode();

  console.log('FRA assetCode IS ', assetCode);
};

const myAssetN = async () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';
  console.log('pass!', password);

  const assetCode = await Asset.getRandomAssetCode();

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const asset = await Asset.defineAsset(walletInfo, assetCode);

  console.log('asset IS !', asset);
};

const myMain = async () => {
  // const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const sidsResult = await network.getOwnedSids(address);

  console.log('sidsResult', sidsResult);

  const sid = 519;

  const utxo = await network.getUtxo(sid);

  console.log('utxo!', utxo);

  const ownerMemo = await network.getOwnerMemo(sid);

  console.log('owner memo', ownerMemo);

  const stateCommitment = await network.getStateCommitment();

  console.log('stateCommitment', stateCommitment);
};

const myUtxo = async () => {
  const address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';

  const sidsResult = await network.getOwnedSids(address);

  // console.log('sidsResult', sidsResult);

  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

  const { response: sids } = sidsResult;

  console.log('sids', sids);

  if (!sids) {
    return;
  }
  const utxoDataList = await Core.Fee.addUtxo(walletInfo, sids);
  console.log('utxoDataList', utxoDataList);

  const fraCode = await Asset.getFraAssetCode();
  const amount = BigInt(3);

  const sendUtxoList = Core.Fee.getSendUtxo(fraCode, amount, utxoDataList);

  console.log('sendUtxoList!', sendUtxoList);

  const utxoInputsInfo = await Core.Fee.addUtxoInputs(sendUtxoList);

  console.log('utxoInputsInfo!', utxoInputsInfo);

  const trasferOperation = await Core.Fee.getTransferOperationWithFee(walletInfo, utxoInputsInfo);

  console.log('trasferOperation!', trasferOperation);
};

myAssetN();
