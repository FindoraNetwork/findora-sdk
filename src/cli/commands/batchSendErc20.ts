import neatCsv from 'neat-csv';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { getPayloadWithGas, timeLog } from '../../evm/testHelpers';
import { log, now, readFile, writeFile } from '../../services/utils';

const envConfigFile = `../../../.env_erc_distribution`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

let networkId: number;
let accounts: string[];

interface ReceiverInfo {
  address: string;
  numbers: number;
}

interface SendInfo {
  txHash: string;
  recieverInfo: ReceiverInfo;
  txReceipt: {
    transactionHash?: string | undefined;
  };
}

type ErrorsInfo = string[];

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

const getRecieversList = (parsedListOfRecievers: neatCsv.Row[]) => {
  const receiversList = parsedListOfRecievers.map(currentReciever => {
    const { tokenAllocated, tokenReceiveAddress } = currentReciever;

    return {
      address: tokenReceiveAddress,
      numbers: parseFloat(tokenAllocated.replace(',', '')),
    };
  });

  return receiversList;
};

const writeDistributionLog = async (sendInfo: SendInfo[], errorsInfo: ErrorsInfo) => {
  const dateStamp = now();

  const resultFilePath = `batchSendLog_${dateStamp}.txt`;

  try {
    await writeFile(
      resultFilePath,
      JSON.stringify(
        {
          date: dateStamp,
          distributionType: 'ERC20',
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

const sendTxToAccount = async (
  senderAccount: string,
  receiverAccount: string,
  amountToSend: string,
  web3: Web3,
) => {
  const value = web3.utils.toWei(amountToSend, 'ether');

  const transactionObject = {
    ...getPayloadWithGas(senderAccount, networkId),
    to: receiverAccount,
    value,
  };

  let txReceipt: { transactionHash?: string } = {};
  let txHash = '';

  await web3.eth
    .sendTransaction(transactionObject)
    .on('error', async _error => {
      timeLog('Once error', _error);
    })
    .on('transactionHash', function (_hash: string) {
      txHash = _hash;
    })
    .on('receipt', function (_receipt: any) {
      txReceipt = _receipt;
    })
    .then(function (_receipt) {
      timeLog('Once the receipt is mined');
    });

  return { txHash, txReceipt };
};

export const runBatchSendERC20 = async (filePath: string) => {
  let data;
  let parsedListOfRecievers;

  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error('Could not read file "file.csv" ');
  }

  try {
    parsedListOfRecievers = await neatCsv(data);
  } catch (error) {
    throw Error('Could not parse file "file.csv" ');
  }

  log('parsedListOfRecievers', parsedListOfRecievers);

  const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);
  const web3 = new Web3(provider);

  accounts = await web3.eth.getAccounts();
  networkId = await web3.eth.net.getId();

  const sendInfo = [];
  const errorsInfo = [];

  const senderAccount = accounts[0];

  try {
    isCsvValid(parsedListOfRecievers);
  } catch (err) {
    throw new Error(`ERROR: CSV is not valid. Details: ${(err as Error).message}`);
  }

  const receiversList = getRecieversList(parsedListOfRecievers);

  for (let i = 0; i < receiversList.length; i += 1) {
    const recieverInfo = receiversList[i];

    try {
      const { txHash, txReceipt } = await sendTxToAccount(
        senderAccount,
        recieverInfo.address,
        `${recieverInfo.numbers}`,
        web3,
      );

      sendInfo.push({
        txHash,
        recieverInfo: { ...recieverInfo },
        txReceipt,
      });

      log(`${i + 1}: Tx hash is "${txHash}"`);
    } catch (error) {
      const errorMessage = `${i + 1}: !! ERROR!! - could not send a transaction to ${
        recieverInfo.address
      }. Error: - ${(error as Error).message}. Skipping....`;
      errorsInfo.push(errorMessage);
      log(errorMessage);
    }
  }

  await writeDistributionLog(sendInfo, errorsInfo);

  log(`Batch Send Log `, JSON.stringify(sendInfo, null, 2));
  log(`Batch Send Errors Log `, JSON.stringify(errorsInfo, null, 2));
};
