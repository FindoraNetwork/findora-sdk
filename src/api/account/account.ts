import { BigNumberValue, create as createBigNumber, fromWei } from '_src/services/bigNumber';
import { addUtxo, AddUtxoItem } from '_src/services/utxoHelper';
import { WalletKeypar } from '_src/api/keypair';
import * as Network from '_src/api/network';
import { getFraAssetCode } from '_src/api/sdkAsset';

export const getAssetBalance = async (
  walletKeypair: WalletKeypar,
  assetCode: string,
  sids: number[],
): Promise<BigNumberValue> => {
  let utxoDataList;

  try {
    utxoDataList = await addUtxo(walletKeypair, sids);
  } catch (error) {
    throw new Error(`Could not get list of addUtxo, Details: "${error.message}"`);
  }

  if (!utxoDataList.length) {
    return createBigNumber(0);
  }

  const filteredUtxoList = utxoDataList.filter(row => row?.body?.asset_type === assetCode);

  if (!filteredUtxoList.length) {
    return createBigNumber(0);
  }

  const currentBalance = filteredUtxoList.reduce((acc: number, currentUtxoItem: AddUtxoItem) => {
    return acc + Number(currentUtxoItem.body?.amount || 0);
  }, 0);

  return createBigNumber(currentBalance);
};

export const getBalance = async (walletKeypair: WalletKeypar, assetCode?: string): Promise<string> => {
  const sidsResult = await Network.getOwnedSids(walletKeypair.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched!');
  }

  const fraAssetCode = await getFraAssetCode();

  const assetCodeToUse = assetCode || fraAssetCode;

  try {
    const balanceInWei = await getAssetBalance(walletKeypair, assetCodeToUse, sids);

    const balance = fromWei(balanceInWei, 6).toFormat(6);
    return balance;
  } catch (err) {
    throw new Error(`Could not fetch balance for "${assetCodeToUse}". Error - ${err.message}`);
  }
};
