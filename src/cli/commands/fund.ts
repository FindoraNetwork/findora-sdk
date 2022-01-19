import dotenv from 'dotenv';
import { Asset, Keypair, Transaction } from '../../api';
import { log } from '../../services/utils';

dotenv.config();

const { PKEY_LOCAL_FAUCET = '' } = process.env;

export const runFund = async (address: string, amountToFund: string) => {
  const pkey = PKEY_LOCAL_FAUCET;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetCode = await Asset.getFraAssetCode();

  const transactionBuilder = await Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('send fra result handle', resultHandle);
};
