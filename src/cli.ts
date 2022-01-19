import dotenv from 'dotenv';
import minimist from 'minimist';
import neatCsv from 'neat-csv';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { Asset, Keypair, Transaction } from './api';
import { getPayloadWithGas, timeLog } from './evm/testHelpers';
import Sdk from './Sdk';
import { MemoryCacheProvider } from './services/cacheStore/providers';
import { log, readFile } from './services/utils';

dotenv.config();

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://dev-qa01.dev.findora.org',
  hostUrl: 'http://127.0.0.1',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const { PKEY_LOCAL_FAUCET = '' } = process.env;

const RPC_ENV_NAME = 'mocknet';

const envConfigFile = `../.env_rpc_${RPC_ENV_NAME}`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

let networkId: number;
let accounts: string[];

const COMMANDS = {
  FUND: 'fund',
  CREATE_WALLET: 'createWallet',
  RESTORE_WALLET: 'restoreWallet',
  BATCH_SEND_ERC20: 'batchSendErc20',
};

const ERROR_MESSAGES = {
  [COMMANDS.FUND]: 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
  [COMMANDS.CREATE_WALLET]: 'please run as "yarn cli createWallet"',
  [COMMANDS.RESTORE_WALLET]: `please run as "yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'"`,
  [COMMANDS.BATCH_SEND_ERC20]: `please run as "yarn cli batchSendErc20 --filePath="./file.csv"`,
};

const showHelp = () => {
  for (const prop in ERROR_MESSAGES) {
    log(ERROR_MESSAGES[prop]);
  }
};

const runFund = async (address: string, amountToFund: string) => {
  const pkey = PKEY_LOCAL_FAUCET;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetCode = await Asset.getFraAssetCode();

  const transactionBuilder = await Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  log('send fra result handle', resultHandle);
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

const runBatchSendERC20 = async (filePath: string) => {
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

    const { tokenAllocated, tokenReceiveAddress } = currentReciever;

    const recieverInfo = {
      address: tokenReceiveAddress,
      numbers: parseFloat(tokenAllocated.replace(',', '')),
    };

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
      const errorMessage = `${
        i + 1
      }: !! ERROR!! - could not send a transaction to ${tokenReceiveAddress}. Error: - ${
        (error as Error).message
      }. Skipping....`;
      errorsInfo.push(errorMessage);
      log(errorMessage);
    }
  }

  log(`Batch Send Log `, JSON.stringify(sendInfo, null, 2));
  log(`Batch Send Errors Log `, JSON.stringify(errorsInfo, null, 2));
};

const runCreateWallet = async () => {
  const password = '123';

  const mm = await Keypair.getMnemonic(24);

  log(`🚀 ~ new mnemonic: "${mm.join(' ')}"`);

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  log('🚀 ~ new wallet info: ', walletInfo);
};

const runRestoreWallet = async (mnemonicString: string) => {
  const password = '123';
  log(`🚀 ~ mnemonic to be used: "${mnemonicString}"`);

  const mm = mnemonicString.split(' ');

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  log('🚀 ~ restored wallet info: ', walletInfo);
};

const main = async () => {
  const argv = minimist(process.argv.slice(4));
  const [command] = argv._;
  const { address, amountToFund, mnemonicString, filePath } = argv;

  if (!command) {
    showHelp();
    return;
  }

  switch (command) {
    case COMMANDS.FUND:
      if (!address || !amountToFund) {
        log(ERROR_MESSAGES[COMMANDS.FUND]);
        break;
      }

      runFund(address, amountToFund);
      break;
    case COMMANDS.CREATE_WALLET:
      runCreateWallet();
      break;
    case COMMANDS.RESTORE_WALLET:
      if (!mnemonicString) {
        log(ERROR_MESSAGES[COMMANDS.RESTORE_WALLET]);
        break;
      }
      runRestoreWallet(mnemonicString);
      break;

    case COMMANDS.BATCH_SEND_ERC20:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_SEND_ERC20]);
        break;
      }
      runBatchSendERC20(filePath);
      break;
    default:
      showHelp();
  }
};

main();
