// import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import sleep from 'sleep-promise';
import { Account, Asset, Keypair, Network, Staking, Transaction } from './api';
import * as NetworkTypes from './api/network/types';
import Sdk from './Sdk';
import { toWei } from './services/bigNumber';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import * as Fee from './services/fee';
import { getFeeInputs } from './services/fee';
import { getLedger } from './services/ledger/ledgerWrapper';
import { getRandomNumber } from './services/utils';
import * as UtxoHelper from './services/utxoHelper';

dotenv.config();

const waitingTimeBeforeCheckTxStatus = 19000;

/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
  // hostUrl: 'https://prod-mainnet.prod.findora.org',
  hostUrl: 'https://prod-testnet.prod.findora.org', // anvil balance!
  // hostUrl: 'https://dev-staging.dev.findora.org',
  // hostUrl: 'https://dev-evm.dev.findora.org',
  // hostUrl: 'http://127.0.0.1',
  // hostUrl: 'https://dev-qa02.dev.findora.org',
  // hostUrl: 'https://prod-forge.prod.findora.org', // forge balance!
  // cacheProvider: FileCacheProvider,
  // hostUrl: 'https://dev-mainnetmock.dev.findora.org', //works but have 0 balance
  // hostUrl: 'https://dev-qa01.dev.findora.org',
  cacheProvider: MemoryCacheProvider,
  blockScanerUrl: '',
  cachePath: './cache',
};

/**
 * This file is a developer "sandbox". You can debug existing methods here, or play with new and so on.
 * It is executed by running `yarn start` - feel free to play with it and change it.
 * Examples here might not always be working, again - that is just a sandbox for convenience.
 */
Sdk.init(sdkEnv);

console.log(`Connecting to "${sdkEnv.hostUrl}"`);

const {
  CUSTOM_ASSET_CODE = '',
  PKEY_MINE = '',
  PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1 = '',
  PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2 = '',
  PKEY_MINE2 = '',
  PKEY_MINE3 = '',
  PKEY_LOCAL_FAUCET = '',
  ENG_PKEY = '',
  PKEY_LOCAL_TRIPLE_MASKING = '',
  PKEY_LOCAL_FAUCET_MNEMONIC_STRING = '',
  M_STRING = '',
  FRA_ADDRESS = '',
  ETH_PRIVATE = '',
  ETH_ADDRESS = '',
} = process.env;

const mainFaucet = PKEY_LOCAL_FAUCET;

const CustomAssetCode = CUSTOM_ASSET_CODE;

const myAbarAnonKeys = {
  axfrPublicKey: 'RFuVMPlD0pVcBlRIDKCwp5WNliqjGF4RG_r-SCzajOw=',
  axfrSecretKey:
    'lgwn_gnSNPEiOmL1Tlb_nSzNcPkZa4yUqiIsR4B_skb4jYJBFjaRQwUlTi22XO3cOyxSbiv7k4l68kj2jzOVCURblTD5Q9KVXAZUSAygsKeVjZYqoxheERv6_kgs2ozs',
};

const myGivenCommitmentsList = [
  // 'FYKxtmrH4SoXvVTf82wNz6PVqWdbo1kJcmYpcgctnvH5', // 6
  // '8Q1eEr4HoWfwqXGDucUvmrZ4UDZHgPFnF7vi9UAVj2GC', // 5
  // '3qZaSoUscNyU5MUJjzHoQWPgUwQ515i2TtGmHFpjYfQy', // 8
  // 'FeKLHRpfREkG5XzLLPKzwPjWTJazJe7b1jhkpbv5NomA',

  'GD1q5AZX7kwgeMM88x5MTYy2Ek2vi1bbt4ep6oSdeg6a',
  'EU6sbUEKBpoMwxdx1D1vE8GDgVh6ccQ6Dv4y1TZ2Nwg3',
  '4zRUTuWqq3RcmXpcPxiM5GYkBnf8g6M6jisenJEJniKr',
];

/**
 * Get FRA balance
 */
const getFraBalance = async () => {
  const password = '12345';

  const pkey = PKEY_LOCAL_FAUCET;
  // const pkey = PKEY_MINE;
  //  const pkey = PKEY_MINE2;
  // const pkey = PKEY_MINE3;
  // const pkey = ENG_PKEY;
  // const mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING;
  const mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2;
  // console.log(`🚀 ~ file: run.ts ~ line 82 ~ getFraBalance ~ mString "${mString}"`);

  const mm = mString.split(' ');

  const newWallet = await Keypair.restoreFromMnemonic(mm, password);

  const faucetWalletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const balance = await Account.getBalance(faucetWalletInfo);
  const balanceNew = await Account.getBalance(newWallet);

  const fraCode = await Asset.getFraAssetCode();
  console.log('🚀 ~ file: run.ts ~ line 95 ~ getFraBalance ~ fraCode', fraCode);

  console.log('\n');

  console.log('faucetWalletInfo.address (from pKey)', faucetWalletInfo.address);
  console.log('faucetWalletInfo.privateStr', faucetWalletInfo.privateStr);

  console.log('\n');

  console.log('newWallet.address (from mnenmonic)', newWallet.address);
  console.log('newWallet.privateStr', newWallet.privateStr);
  console.log('newWallet.publickey', newWallet.publickey);

  console.log('\n');

  console.log('balance from restored from pkey IS', balance);
  console.log('balance from restored using mnemonic IS', balanceNew);
  console.log('\n');
  console.log('\n');
};

getFraBalance();
// getAnonKeys(); // +
// getAbarBalance();
//getAtxoSendList();
// getUnspentAbars();
// validateUnspent();
// testIt();
