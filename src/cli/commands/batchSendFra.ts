import neatCsv from 'neat-csv';
import sleep from 'sleep-promise';
import { Asset, Keypair, Transaction } from '../../api';
import { TransferReciever } from '../../api/transaction';
import { log, now, readFile, writeFile } from '../../services/utils';

interface SendInfo {
  txHash: string;
  tokenReceivers: TokenReceiver[];
}

interface TokenReceiver {
  address: string;
  numbers: string;
}
type ErrorsInfo = string[];

const waitingTimeBeforeCheckTxStatus = 18000;

const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) => arr.slice(i * size, i * size + size));

const isCsvValid = (parsedListOfRecievers: neatCsv.Row[]) => {
  for (let i = 0; i < parsedListOfRecievers.length; i += 1) {
    const currentReciever = parsedListOfRecievers[i];

    const isAddressPresented = Object.keys(currentReciever).includes('tokenReceiveAddress');
    const isAmountPresented = Object.keys(currentReciever).includes('tokenAllocated');

    if (!isAddressPresented || !isAmountPresented) {
      throw Error(
        `ERROR - The data row must have both "tokenReceiveAddress" and "tokenAllocated" fields ${JSON.stringify(
          currentReciever,
        )} `,
      );
    }
  }

  return true;
};

const getRecieversList = (parsedListOfRecievers: neatCsv.Row[]): TokenReceiver[] => {
  const receiversList = parsedListOfRecievers.map(currentReciever => {
    const { tokenAllocated, tokenReceiveAddress } = currentReciever;

    return {
      address: tokenReceiveAddress,
      numbers: tokenAllocated.replace(',', ''),
    };
  });

  return receiversList;
};

const writeDistributionLog = async (sendInfo: SendInfo[], errorsInfo: ErrorsInfo) => {
  const dateStamp = now();

  const resultFilePath = `batchFraSendLog_${dateStamp}.txt`;

  try {
    await writeFile(
      resultFilePath,
      JSON.stringify(
        {
          date: dateStamp,
          distributionType: 'FRA',
          sendInfo,
          errorsInfo,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    throw new Error(`can not write result log for "${resultFilePath}", "${(error as Error).message}"`);
  }
};

const processTransferRecieverItem = async (tokenReceiver: TokenReceiver): Promise<TransferReciever> => {
  const reciverWalletInfo = await Keypair.getAddressPublicAndKey(tokenReceiver.address);
  return { reciverWalletInfo, amount: tokenReceiver.numbers };
};

const processTransferRecievers = async (
  tokenReceiversChunk: TokenReceiver[],
): Promise<TransferReciever[]> => {
  return Promise.all(tokenReceiversChunk.map(tokenReceiver => processTransferRecieverItem(tokenReceiver)));
};

const sendTxToAccounts = async (
  senderWallet: Keypair.WalletKeypar,
  recieversInfo: TransferReciever[],
  assetCode: string,
) => {
  // const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  // const recieversInfo = [
  //   { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
  //   { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
  // ];

  const transactionBuilder = await Transaction.sendToMany(
    senderWallet,
    recieversInfo,
    assetCode,
    // assetBlindRules,
  );

  const txHash = await Transaction.submitTransaction(transactionBuilder);

  console.log('🚀 ~ file: batchSendFra.ts ~ line 132 ~ txHash', txHash);

  await sleep(waitingTimeBeforeCheckTxStatus);

  return { txHash };
};

export const runBatchSendFra = async (filePath: string, fromPk: string, numberOfOutputs: number) => {
  let data;
  let parsedListOfRecievers;

  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error('Could not read file "fileFra.csv" ');
  }

  try {
    parsedListOfRecievers = await neatCsv(data);
  } catch (error) {
    throw Error('Could not parse file "fileFra.csv" ');
  }

  const password = '123';

  const walletFrom = await Keypair.restoreFromPrivateKey(fromPk, password);

  const sendInfo = [];
  const errorsInfo = [];

  try {
    isCsvValid(parsedListOfRecievers);
  } catch (err) {
    throw new Error(`ERROR: CSV is not valid. Details: ${(err as Error).message}`);
  }

  const receiversList = getRecieversList(parsedListOfRecievers);

  const receiversChunks = chunk<TokenReceiver>(receiversList, numberOfOutputs);

  const fraCode = await Asset.getFraAssetCode();

  let i = 0;

  for (let currentChunk of receiversChunks) {
    try {
      const recieversInfo = await processTransferRecievers(currentChunk);
      const { txHash } = await sendTxToAccounts(walletFrom, recieversInfo, fraCode);

      sendInfo.push({
        txHash,
        tokenReceivers: { ...currentChunk },
      });

      log(`${i + 1}: Tx hash is "${txHash}"`);
    } catch (error) {
      const addresses = currentChunk.map(item => item.address).join(',');
      const errorMessage = `${
        i + 1
      }: !! ERROR!! - could not send a transaction to one of those addresses "${addresses}". Error: - ${
        (error as Error).message
      }. Skipping....`;
      errorsInfo.push(errorMessage);
      log(errorMessage);
    }

    i += 1;
  }

  await writeDistributionLog(sendInfo, errorsInfo);

  log(`Batch Send Log `, JSON.stringify(sendInfo, null, 2));
  log(`Batch Send Errors Log `, JSON.stringify(errorsInfo, null, 2));
};
