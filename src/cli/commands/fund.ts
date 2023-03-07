import dotenv from 'dotenv';
import { Asset, Keypair, Transaction } from '../../api';
import { log } from '../../services/utils';

dotenv.config();

const { PKEY_LOCAL_FAUCET = '', ENG_PKEY = '' } = process.env;

export const runFund = async (address: string, amountToFund: string) => {
  const pkey = PKEY_LOCAL_FAUCET;
  // const pkey = ENG_PKEY;

  const password = '123';
  console.log('runFund pkey to use is ', pkey);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetCode = await Asset.getFraAssetCode();

  const transactionBuilder = await Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('send fra result handle', resultHandle);
};
