import minimist from 'minimist';
import Sdk from '../Sdk';
import { MemoryCacheProvider } from '../services/cacheStore/providers';
import { log } from '../services/utils';
import * as CliCommands from './commands';

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://prod-mainnet.prod.findora.org',
  // hostUrl: 'https://dev-mainnetmock.dev.findora.org',
  hostUrl: 'https://prod-testnet.prod.findora.org', // anvil balance!
  // hostUrl: 'http://127.0.0.1',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const COMMANDS = {
  FUND: 'fund',
  CREATE_WALLET: 'createWallet',
  RESTORE_WALLET: 'restoreWallet',
  BATCH_SEND_ERC20: 'batchSendErc20',
  BATCH_SEND_FRA: 'batchSendFra',
  CREATE_AND_SAVE_WALLETS: 'createAndSaveWallets',
};

const ERROR_MESSAGES = {
  [COMMANDS.FUND]: 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
  [COMMANDS.CREATE_WALLET]: 'please run as "yarn cli createWallet"',
  [COMMANDS.RESTORE_WALLET]: `please run as "yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'"`,
  [COMMANDS.BATCH_SEND_ERC20]: `please run as "yarn cli batchSendErc20 --filePath="./file.csv"`,
  [COMMANDS.BATCH_SEND_FRA]: `please run as "yarn cli batchSendFra --privateKey=XXX --filePath="./fileFra.csv"`,
  [COMMANDS.CREATE_AND_SAVE_WALLETS]: `please run as "yarn cli createAndSaveWallets --numberOfWallets=10`,
};

const showHelp = () => {
  for (const prop in ERROR_MESSAGES) {
    log(ERROR_MESSAGES[prop]);
  }
};

const main = async () => {
  const argv = minimist(process.argv.slice(4));
  const [command] = argv._;
  const { address, amountToFund, mnemonicString, filePath, privateKey, numberOfWallets } = argv;

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

      CliCommands.runFund(address, amountToFund);
      break;
    case COMMANDS.CREATE_WALLET:
      CliCommands.runCreateWallet();
      break;
    case COMMANDS.RESTORE_WALLET:
      if (!mnemonicString) {
        log(ERROR_MESSAGES[COMMANDS.RESTORE_WALLET]);
        break;
      }

      CliCommands.runRestoreWallet(mnemonicString);
      break;

    case COMMANDS.BATCH_SEND_ERC20:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_SEND_ERC20]);
        break;
      }

      CliCommands.runBatchSendERC20(filePath);
      break;
    case COMMANDS.BATCH_SEND_FRA:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_SEND_FRA]);
        break;
      }

      CliCommands.runBatchSendFra(filePath, privateKey, 12);
      break;
    case COMMANDS.CREATE_AND_SAVE_WALLETS:
      if (!numberOfWallets) {
        log(ERROR_MESSAGES[COMMANDS.CREATE_AND_SAVE_WALLETS]);
        break;
      }

      CliCommands.runCreateAndSaveWallets(numberOfWallets);
      break;
    default:
      showHelp();
  }
};

main();
