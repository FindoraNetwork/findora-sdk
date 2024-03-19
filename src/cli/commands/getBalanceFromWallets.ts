import { log, readFile } from '../../services/utils';

import { Account, Keypair } from '../../api';
type SenderWallet = { index: number; privateKey: string | undefined; address: string };

const password = '1232320';

const processRecord = async (index: number, privateKey: string) => {
  const walletInfo = await Keypair.restoreFromPrivateKey(privateKey.trim(), password);

  const balance = await Account.getBalance(walletInfo);

  const result = `${index}. Balance for "${walletInfo.address}" is ${balance}`;

  return result;
};

export const runGetBalanceFromWallets = async (filePath: string) => {
  let data;

  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${filePath}" `);
  }

  let walletsList: SenderWallet[] = [];

  try {
    walletsList = JSON.parse(data);
  } catch (err) {
    log(`can not parse wallets data from the ${filePath}`);
    console.log('err', err);
  }

  const resultList = [];

  for (let currentWallet of walletsList) {
    const { privateKey = '', address, index } = currentWallet;
    try {
      const balanceResult = await processRecord(index, privateKey);
      resultList.push(balanceResult);
    } catch (err) {
      resultList.push(`${index}. Error - could not process record for row ${index} address "${address}"`);
    }
  }
  log(JSON.stringify(resultList, null, 2));
};
