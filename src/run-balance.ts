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
  PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE = '',
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
  axfrSpendKey:
    'lgwn_gnSNPEiOmL1Tlb_nSzNcPkZa4yUqiIsR4B_skb4jYJBFjaRQwUlTi22XO3cOyxSbiv7k4l68kj2jzOVCURblTD5Q9KVXAZUSAygsKeVjZYqoxheERv6_kgs2ozs',
  axfrViewKey: '-I2CQRY2kUMFJU4ttlzt3DssUm4r-5OJevJI9o8zlQk=',
};

const myGivenCommitmentsList = [
  'FYKxtmrH4SoXvVTf82wNz6PVqWdbo1kJcmYpcgctnvH5', // 6
  '8Q1eEr4HoWfwqXGDucUvmrZ4UDZHgPFnF7vi9UAVj2GC', // 5
  '3qZaSoUscNyU5MUJjzHoQWPgUwQ515i2TtGmHFpjYfQy', // 8
];

const getUnspentAbars = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  const givenCommitmentsList = myGivenCommitmentsList;

  const unspentAbars = await TripleMasking.getUnspentAbars(anonKeys, givenCommitmentsList);
  console.log(
    '🚀 ~ file: run.ts ~ line 1291 ~ getUnspentAbars ~ unspentAbars',
    JSON.stringify(unspentAbars, null, 2),
  );
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

  const amount = '19';
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
  const findoraWasm = await getLedger();

  function isCoinBase(fraAddress: string) {
    console.log(`we are going to call leger with ${fraAddress}`);
    // return false;

    const addressInBase64 = findoraWasm.bech32_to_base64(fraAddress);

    return false;

    // return [findoraWasm.get_coinbase_principal_address(), findoraWasm.get_coinbase_address()].includes(
    //   addressInBase64,
    // );
  }

  const aaa1 = '3a42pm482SV4wgPk9ibZ5vq7iuoMVSqzqV2x1hvWRcSZ';
  const aaa2 = 'DNnXvLm6eMEuVf7xe48arKug6BhGHTMBQy5rF4W6WHFm';
  const aaa3 = 'fra1ngv43xvre25pwtuynrh4ua4fhxn9mye6nh8kakcjdgc6ghger0cquazydn';

  const result = isCoinBase(aaa1);

  console.log('result', result);
};

const getAnonKeys = async () => {
  const myAnonKeys = await TripleMasking.genAnonKeys();

  console.log('🚀 ~ file: run.ts ~ line 1149 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
};

// getAnonKeys(); // +
//getAbarBalance();
getAtxoSendList();
// getUnspentAbars();
