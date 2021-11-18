import dotenv from 'dotenv';
import { Asset, Keypair, Transaction } from './api';
import Sdk from './Sdk';
import { MemoryCacheProvider } from './services/cacheStore/providers';

import minimist from 'minimist';

dotenv.config();

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://prod-mainnet.prod.findora.org',
  // hostUrl: 'https://dev-staging.dev.findora.org',
  // hostUrl: 'https://dev-evm.dev.findora.org',
  // hostUrl: 'http://127.0.0.1',
  // hostUrl: 'https://dev-mainnetmock.dev.findora.org',
  // hostUrl: 'https://prod-testnet.prod.findora.org',
  hostUrl: 'https://prod-forge.prod.findora.org',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

Sdk.init(sdkEnv);

const { PKEY_LOCAL_FAUCET = '' } = process.env;

const errorMsgFund = 'please run as "yarn fund --address=fraXXX --amountToFund=1 "';

const now = () => new Date().toLocaleString();

const log = (message: string, ...rest: any) => {
  console.log(
    `"${now()}" - ${message}`,
    (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '',
  );
};

const showHelp = () => {
  log(errorMsgFund);
};

const runFund = async (address: string, amountToFund: string) => {
  const pkey = PKEY_LOCAL_FAUCET;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetCode = await Asset.getFraAssetCode();

  const transactionBuilder = await Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send fra result handle', resultHandle);
};

const main = async () => {
  const argv = minimist(process.argv.slice(4));
  const [command] = argv._;
  const { address, amountToFund } = argv;

  // console.log('🚀 ~ file: cli.ts ~ line 44 ~ fundAddress ~ argv', argv);
  // console.log('🚀 ~ file: cli.ts ~ line 47 ~ fundAddress ~ command', command);
  // console.log('🚀 ~ file: fund.ts ~ line 47 ~ fundAddress ~ address', address);

  switch (command) {
    case 'fund':
      if (!address) {
        log(errorMsgFund);
        break;
      }

      runFund(address, amountToFund);
      break;

    default:
      showHelp();
  }
};

main();
