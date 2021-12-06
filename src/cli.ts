import dotenv from 'dotenv';
import minimist from 'minimist';
import { Asset, Keypair, Transaction } from './api';
import Sdk from './Sdk';
import { MemoryCacheProvider } from './services/cacheStore/providers';

dotenv.config();

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  hostUrl: 'https://dev-qa02.dev.findora.org',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const { PKEY_LOCAL_FAUCET = '' } = process.env;

const COMMANDS = {
  FUND: 'fund',
  CREATE_WALLET: 'createWallet',
  RESTORE_WALLET: 'restoreWallet',
};

const ERROR_MESSAGES = {
  [COMMANDS.FUND]: 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
  [COMMANDS.CREATE_WALLET]: 'please run as "yarn cli createWallet"',
  [COMMANDS.RESTORE_WALLET]: `please run as "yarn cli runRestoreWallet --mnemonicString='XXX ... ... XXX'"`,
};

const now = () => new Date().toLocaleString();

const log = (message: string, ...rest: any) => {
  console.log(
    `"${now()}" - ${message}`,
    (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '',
  );
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
  const { address, amountToFund, mnemonicString } = argv;

  if (!command) {
    showHelp();
    return;
  }

  switch (command) {
    case COMMANDS.FUND:
      if (!address) {
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

    default:
      showHelp();
  }
};

main();
