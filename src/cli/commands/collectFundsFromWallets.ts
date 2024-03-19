import { delay, log, readFile } from '../../services/utils';
import { fromWei, create as createBigNumber } from '../../services/bigNumber';
import type { BigNumberValue } from '../../services/bigNumber';

import { Account, Asset, Keypair, Transaction } from '../../api';
type SenderWallet = { index: number; privateKey: string | undefined; address: string };

const password = '1232320';

const processRecord = async (
  index: number,
  privateKey: string,
  receiverWalletInfo: Keypair.WalletKeypar,
  assetCode: string,
  decimals: number,
  minimalFeeInBn: BigNumberValue,
) => {
  const walletInfo = await Keypair.restoreFromPrivateKey(privateKey.trim(), password);

  const balanceInWei = await Account.getBalanceInWei(walletInfo);

  const a = createBigNumber(balanceInWei).minus(minimalFeeInBn);

  const b = fromWei(a.toString(), decimals).toString();
  // console.log('b', b); // 9.99

  if (a.lte(0)) {
    const result = `${index}. can not send from "${walletInfo.address}". amount to send is < 0  is "${b}"`;
    return result;
  }

  const recieversInfo = [{ reciverWalletInfo: receiverWalletInfo, amount: b }];

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  const txResult = `send to the receipient result handle', ${resultHandle}`;

  const result = `${index}. send from "${walletInfo.address}" to "${receiverWalletInfo.address}" is "${txResult}"`;
  return result;
};

export const runCollectFundsFromWallets = async (filePath: string, privateKeyOfReceiver: string) => {
  let data;
  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${filePath}" `);
  }

  const receiverWalletInfo = await Keypair.restoreFromPrivateKey(privateKeyOfReceiver.trim(), password);

  let walletsList: SenderWallet[] = [];

  try {
    walletsList = JSON.parse(data);
  } catch (err) {
    log('can not parse wallets data from the ${filePath}');
    console.log('err', err);
  }

  const assetCode = await Asset.getFraAssetCode();
  const asset = await Asset.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;

  const minimalFee = await Asset.getMinimalFee();
  const minimalFeeInBn = createBigNumber(minimalFee.toString());

  const resultList = [];

  const balanceBeforeCollection = await Account.getBalance(receiverWalletInfo);

  for (let currentWallet of walletsList) {
    const { privateKey = '', address, index } = currentWallet;
    try {
      const processResult = await processRecord(
        index,
        privateKey,
        receiverWalletInfo,
        assetCode,
        decimals,
        minimalFeeInBn,
      );
      resultList.push(processResult);
    } catch (err) {
      resultList.push(`${index}. Error - could not process record for row ${index} address "${address}"`);
    }
  }

  await delay(16000);

  const balanceAfterCollection = await Account.getBalance(receiverWalletInfo);

  log(JSON.stringify(resultList, null, 2));

  log(
    `Balance for the receiver ${receiverWalletInfo.address} are: before "${balanceBeforeCollection}" and after "${balanceAfterCollection}"`,
  );
};
