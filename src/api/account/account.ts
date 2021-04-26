import { BigNumberValue, create as createBigNumber, fromWei } from '../../services/bigNumber';
import { addUtxo, AddUtxoItem } from '../../services/utxoHelper';
import { getFraAssetCode } from '../asset';
import { WalletKeypar } from '../keypair';
import * as Network from '../network';

export const getAssetBalance = async (
  walletKeypair: WalletKeypar,
  assetCode: string,
  sids: number[],
): Promise<BigNumberValue> => {
  const utxoDataList = await addUtxo(walletKeypair, sids);

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
    throw new Error('no sids were fetched!');
  }

  const assetCodeToUse = assetCode || (await getFraAssetCode());

  try {
    const balanceInWei = await getAssetBalance(walletKeypair, assetCodeToUse, sids);

    const balance = fromWei(balanceInWei, 6).toFormat(6);
    return balance;
  } catch (err) {
    throw new Error(`could not fetch balance for "${assetCodeToUse}". Error - ${err.message}`);
  }
};
