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
  // hostUrl: 'https://dev-qa02.dev.findora.org',
  // hostUrl: 'http://127.0.0.1',
  cacheProvider: MemoryCacheProvider,
  blockScanerUrl: 'https://foo.bar',
  cachePath: './cache',
  brc20url: 'https://api-testnet.brc20.findora.org',
};

Sdk.init(sdkEnv);

const COMMANDS = {
  FUND: 'fund',
  CREATE_WALLET: 'createWallet',
  RESTORE_WALLET: 'restoreWallet',
  BATCH_SEND_ERC20: 'batchSendErc20',
  BATCH_SEND_FRA: 'batchSendFra',
  CREATE_AND_SAVE_WALLETS: 'createAndSaveWallets',
  CREATE_BUY_FILE_FROM_WALLETS: 'createBuyFileFromWallets',
  CREATE_FUND_FILE_FROM_WALLETS: 'createFundFileFromWallets',
  COLLECT_FUNDS_FROM_WALLETS: 'collectFundsFromWallets',
  GET_BALANCE_FROM_WALLETS: 'getBalanceFromWallets',
  BATCH_DEPLOY_TICKET: 'batchDeployTicket',
  BATCH_MINT_TICKET: 'batchMintTicket',
  BATCH_ADD_LIST: 'batchAddList',
  BATCH_BUY_TICKET: 'batchBuyTicket',
};

const ERROR_MESSAGES = {
  [COMMANDS.FUND]: 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
  [COMMANDS.CREATE_WALLET]: 'please run as "yarn cli createWallet"',
  [COMMANDS.RESTORE_WALLET]: `please run as "yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'"`,
  [COMMANDS.BATCH_SEND_ERC20]: `please run as "yarn cli batchSendErc20 --filePath="./file.csv"`,
  [COMMANDS.BATCH_SEND_FRA]: `please run as "yarn cli batchSendFra --privateKey=XXX --filePath="./fileFra.csv"`,
  [COMMANDS.CREATE_AND_SAVE_WALLETS]: `please run as "yarn cli createAndSaveWallets --numberOfWallets=10 [--generateFundFile=true] [--amountToFund=5] --filePath="./yourWalletsFile.json"`,
  [COMMANDS.CREATE_BUY_FILE_FROM_WALLETS]: `please run as "yarn cli createBuyFileFromWallets --tick=ole6 --totalFraToSpend=1000 --maxAmtToBuy=100 --filePath="./yourWalletsFile.json"`,
  [COMMANDS.CREATE_FUND_FILE_FROM_WALLETS]: `please run as "yarn cli createFundFileFromWallets --amountToFund=100 --filePath="./yourWalletsFile.json"`,
  [COMMANDS.COLLECT_FUNDS_FROM_WALLETS]: `please run as "yarn cli collectFundsFromWallets --privateKey=XXX --filePath="./yourWalletsFile.json"`,
  [COMMANDS.GET_BALANCE_FROM_WALLETS]: `please run as "yarn cli getBalanceFromWallets --filePath="./yourWalletsFile.json"`,
  [COMMANDS.BATCH_DEPLOY_TICKET]: `please run as "yarn cli batchDeployTicket --privateKey=XXX --filePath="./fileDeployTicket.csv"`,
  [COMMANDS.BATCH_MINT_TICKET]: `please run as "yarn cli batchMintTicket --privateKey=XXX --filePath="./fileMintTicket.csv"`,
  [COMMANDS.BATCH_ADD_LIST]: `please run as "yarn cli batchAddList --repeatTimes=XXX --waitBetweenRepeatMinutes=X --filePath="./fileAddList.csv"`,
  [COMMANDS.BATCH_BUY_TICKET]: `please run as "yarn cli batchBuyTicket --repeatTimes=XXX --waitBetweenRepeatMinutes=X --filePath="./fileBuyTicket.csv"`,
};

const showHelp = () => {
  for (const prop in ERROR_MESSAGES) {
    log(ERROR_MESSAGES[prop]);
  }
};

const main = async () => {
  const argv = minimist(process.argv.slice(4));
  const [command] = argv._;
  const {
    address,
    amountToFund,
    mnemonicString,
    filePath,
    privateKey,
    numberOfWallets,
    repeatTimes,
    waitBetweenRepeatMinutes,
    generateFundFile,
    tick,
    totalFraToSpend,
    maxAmtToBuy,
  } = argv;

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
      if (!numberOfWallets || !filePath) {
        log(ERROR_MESSAGES[COMMANDS.CREATE_AND_SAVE_WALLETS]);
        break;
      }

      CliCommands.runCreateAndSaveWallets(filePath, numberOfWallets, generateFundFile, amountToFund);
      break;
    case COMMANDS.BATCH_DEPLOY_TICKET:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_DEPLOY_TICKET]);
        break;
      }

      CliCommands.runBatchDeployTicket(filePath, privateKey);
      break;
    case COMMANDS.BATCH_MINT_TICKET:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_MINT_TICKET]);
        break;
      }

      CliCommands.runBatchMintTicket(filePath, privateKey);
      break;
    case COMMANDS.BATCH_ADD_LIST:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_ADD_LIST]);
        break;
      }

      CliCommands.runBatchAddList(filePath, +`${repeatTimes}`, +waitBetweenRepeatMinutes);
      break;
    case COMMANDS.BATCH_BUY_TICKET:
      if (!filePath || !waitBetweenRepeatMinutes || !repeatTimes) {
        log(ERROR_MESSAGES[COMMANDS.BATCH_BUY_TICKET]);
        break;
      }

      CliCommands.runBatchBuyTicket(filePath, +`${repeatTimes}`, +waitBetweenRepeatMinutes);
      break;
    case COMMANDS.CREATE_BUY_FILE_FROM_WALLETS:
      if (!filePath || !tick || !totalFraToSpend || !maxAmtToBuy) {
        log(ERROR_MESSAGES[COMMANDS.CREATE_BUY_FILE_FROM_WALLETS]);
        break;
      }

      CliCommands.runCreateBuyFileFromeWallets(
        filePath,
        tick.trim(),
        +`${totalFraToSpend}`,
        +`${maxAmtToBuy}`,
      );
      break;
    case COMMANDS.CREATE_FUND_FILE_FROM_WALLETS:
      if (!filePath || !amountToFund) {
        log(ERROR_MESSAGES[COMMANDS.CREATE_FUND_FILE_FROM_WALLETS]);
        break;
      }

      CliCommands.runCreateFundFileFromeWallets(filePath, +`${amountToFund}`);
      break;
    case COMMANDS.COLLECT_FUNDS_FROM_WALLETS:
      if (!filePath || !privateKey) {
        log(ERROR_MESSAGES[COMMANDS.COLLECT_FUNDS_FROM_WALLETS]);
        break;
      }

      CliCommands.runCollectFundsFromWallets(filePath, privateKey.trim());
      break;

    case COMMANDS.GET_BALANCE_FROM_WALLETS:
      if (!filePath) {
        log(ERROR_MESSAGES[COMMANDS.GET_BALANCE_FROM_WALLETS]);
        break;
      }

      CliCommands.runGetBalanceFromWallets(filePath);
      break;
    default:
      log(`\n\nIt seems you have provided an unsupported command \n "${command}" \n`);
      showHelp();
  }
};

main();
