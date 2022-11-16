import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import sleep from 'sleep-promise';
import { Account, Asset, Keypair, Network, Staking, Transaction, TripleMasking } from './api';
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
  // hostUrl: 'https://prod-testnet.prod.findora.org', // anvil balance!
  // hostUrl: 'https://dev-staging.dev.findora.org',
  // hostUrl: 'https://dev-evm.dev.findora.org',
  hostUrl: 'http://127.0.0.1',
  // hostUrl: 'https://dev-qa02.dev.findora.org',
  // hostUrl: 'https://prod-forge.prod.findora.org', // forge balance!
  // cacheProvider: FileCacheProvider,
  // hostUrl: 'https://dev-mainnetmock.dev.findora.org', //works but have 0 balance
  // hostUrl: 'https://dev-qa01.dev.findora.org',
  cacheProvider: MemoryCacheProvider,
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
  const mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1;
  // console.log(`🚀 ~ file: run.ts ~ line 82 ~ getFraBalance ~ mString "${mString}"`);

  const mm = mString.split(' ');

  const newWallet = await Keypair.restoreFromMnemonic(mm, password, false);

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

  console.log('\n');

  console.log('balance from restored from pkey IS', balance);
  console.log('balance from restored using mnemonic IS', balanceNew);
  console.log('\n');
  console.log('\n');
};

const getUnspentAbars = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  const givenCommitmentsList = myGivenCommitmentsList;

  const unspentAbars = await TripleMasking.getUnspentAbars(anonKeys, givenCommitmentsList);
  console.log(
    '🚀 ~ file: run.ts ~ line 1291 ~ getUnspentAbars ~ unspentAbars',
    JSON.stringify(unspentAbars, null, 2),
  );
};

const validateUnspent = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  // const givenCommitment = 'ju2DbSDQWKown4so0h4Sijny_jxyHagKliC-zXIyeGY=';

  const givenCommitmentsList = myGivenCommitmentsList;

  const spentAbars = await TripleMasking.getSpentAbars(anonKeys, givenCommitmentsList);
  console.log(
    '🚀 ~ file: run.ts ~ line 1319 ~ getAbarBalance ~ spentAbars',
    JSON.stringify(spentAbars, null, 2),
  );

  for (const givenCommitment of givenCommitmentsList) {
    console.log(`processing ${givenCommitment}`);

    // const spentAbars = await TripleMasking.getSpentAbars(anonKeys, givenCommitmentsList);
    // console.log(
    //   '🚀 ~ file: run.ts ~ line 1319 ~ getAbarBalance ~ spentAbars',
    //   JSON.stringify(spentAbars, null, 2),
    // );

    const axfrSecretKey = anonKeys.axfrSecretKey;
    const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);

    console.log(
      '🚀 ~ file: run.ts ~ line 1233 ~ validateUnspent ~ ownedAbarsResponse',
      JSON.stringify(ownedAbarsResponse, null, 2),
    );

    const [ownedAbarItem] = ownedAbarsResponse;

    const { abarData } = ownedAbarItem;

    const { atxoSid, ownedAbar } = abarData;

    const hash = await TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrSecretKey);

    console.log('🚀 ~ file: run.ts ~ line 1249 ~ validateUnspent ~ hash', hash);

    const isNullifierHashSpent = await TripleMasking.isNullifierHashSpent(hash);

    console.log(
      '🚀 ~ file: run.ts ~ line 1279 ~ validateUnspent ~ isNullifierHashSpent',
      isNullifierHashSpent,
    );
  }
};

const getAbarBalance = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  const givenCommitmentsList = myGivenCommitmentsList;

  const balances = await TripleMasking.getAllAbarBalances(anonKeys, givenCommitmentsList);
  console.log('🚀 ~ file: run.ts ~ line 1291 ~ getAbarBalance ~ balances', JSON.stringify(balances, null, 2));
};

const getAtxoSendList = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  const givenCommitmentsList = myGivenCommitmentsList;

  const assetCode = await Asset.getFraAssetCode();

  const amount = '26';
  const asset = await Asset.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;

  const amountToSend = BigInt(toWei(amount, decimals).toString());
  const atxoSendList = await TripleMasking.getSendAtxo(
    assetCode,
    amountToSend,
    givenCommitmentsList,
    anonKeys,
  );
  console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList);
};

const testIt = async () => {
  const txHash = 'dac392d9cd93d85d768f6c6784862d747fdeffd0d52e1295bde2c3dc10242225';

  const result = await Network.getTransactionDetails(txHash);
  console.log('🚀 ~ file: run-balance.ts ~ line 183 ~ getAnonKeys ~ result', result);
};

const getAnonKeys = async () => {
  const myAnonKeys = await TripleMasking.genAnonKeys();

  console.log('🚀 ~ file: run.ts ~ line 1149 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
};

getFraBalance();
// getAnonKeys(); // +
// getAbarBalance();
//getAtxoSendList();
// getUnspentAbars();
// validateUnspent();
// testIt();
