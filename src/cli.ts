import dotenv from 'dotenv';
import minimist from 'minimist';
import neatCsv from 'neat-csv';
import { Asset, Keypair, Transaction } from './api';
import Sdk from './Sdk';
import { MemoryCacheProvider } from './services/cacheStore/providers';
import { log, readFile } from './services/utils';

dotenv.config();

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  hostUrl: 'https://dev-qa01.dev.findora.org',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const { PKEY_LOCAL_FAUCET = '', RPC_ENV_NAME } = process.env;

const envConfigFile = RPC_ENV_NAME ? `../../.env_rpc_${RPC_ENV_NAME}` : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

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

  // let recieversInfo = [];
  // const sendInfo = [];

  // log('send fra result handle', resultHandle);
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
