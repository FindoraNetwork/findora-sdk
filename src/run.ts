/* eslint-disable no-console */
import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import sleep from 'sleep-promise';
import { Account, Asset, Evm, Keypair, Network, Staking, Transaction } from './api';
import * as NetworkTypes from './api/network/types';
import { waitForBlockChange } from './evm/testHelpers';
import Sdk from './Sdk';
import { toWei } from './services/bigNumber';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import * as Fee from './services/fee';
import { getFeeInputs } from './services/fee';
import { getLedger } from './services/ledger/ledgerWrapper';
import { getRandomNumber, log } from './services/utils';
import * as UtxoHelper from './services/utxoHelper';
// import * as TMI from './tripleMasking/tripleMasking.integration';

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
  // hostUrl: 'http://54.213.254.47',
  // hostUrl: 'https://dev-qa04.dev.findora.org',
  // hostUrl: 'https://dev-qa01.dev.findora.org',
  // hostUrl: 'https://dev-qa02.dev.findora.org',
  // hostUrl: 'https://prod-forge.prod.findora.org', // forge balance!
  // cacheProvider: FileCacheProvider,
  // hostUrl: 'https://dev-mainnetmock.dev.findora.org', //works but have 0 balance
  // hostUrl: 'https://dev-qa02.dev.findora.org',
  blockScanerUrl: 'https://qa01.backend.findorascan.io',
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

const password = '123';

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
  'CLHHKFVEejbeT4ZyoyabuPeg6ktkZfxoK4VaZ4ewE7T9',
  'DtJx2dVmXXiDaQS7G6xpNeUhEwH7EsuimLUf1Tqd78LH',
  '9kpQwq1UqqonX73HgreJcvXEj9SxN5mh55AhBdsSXnhZ',
];

/**
 * A simple example - how to use SDK to get FRA assset code
 */
const getFraAssetCode = async () => {
  const assetCode = await Asset.getFraAssetCode();

  console.log('FRA assetCode IS', assetCode);
};

/**
 * Get FRA balance
 */
const getFraBalance = async () => {
  const password = '12345';

  const isFra = false;

  console.log('🚀 ~ file: run.ts ~ line 113 ~ getFraBalance ~ isFra', isFra);

  const faucetWalletInfo = await Keypair.restoreFromPrivateKey(PKEY_LOCAL_FAUCET, password);
  // const faucetWalletInfo = await Keypair.restoreFromMnemonic(
  //   PKEY_LOCAL_FAUCET_MNEMONIC_STRING.split(' '),
  //   password,
  // );

  const newWalletMine1 = await Keypair.restoreFromPrivateKey(PKEY_MINE, password);
  // const newWalletMine1 = await Keypair.restoreFromMnemonic(
  //   PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1.split(' '),
  //   password,
  // );

  // const newWalletMine2 = await Keypair.restoreFromPrivateKey(PKEY_MINE2, password);
  const newWalletMine2 = await Keypair.restoreFromMnemonic(
    PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2.split(' '),
    password,
  );

  const balanceFaucet = await Account.getBalance(faucetWalletInfo);
  const balanceNewMine1 = await Account.getBalance(newWalletMine1);
  const balanceNewMine2 = await Account.getBalance(newWalletMine2);

  console.log('\n');

  console.log('Faucet Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING, '\n');
  console.log('faucetWalletInfo.address ', faucetWalletInfo.address);
  console.log('faucetWalletInfo.privateStr', faucetWalletInfo.privateStr);

  console.log('\n');
  console.log('Mine1 Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1, '\n');
  console.log('newWalletMine1.address ', newWalletMine1.address);
  console.log('newWalletMine1.privateStr ', newWalletMine1.privateStr);

  console.log('\n');
  console.log('Mine2 Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2, '\n');
  console.log('newWalletMine2.address', newWalletMine2.address);
  console.log('newWalletMine2.privateStr', newWalletMine2.privateStr);

  console.log('\n');

  console.log('balance from restored faucet IS', balanceFaucet);
  console.log('balance from restored MINE1 IS', balanceNewMine1);
  console.log('balance from restored MINE2 IS', balanceNewMine2);

  console.log('\n');
  console.log('\n');
};

/**
 * Get custom asset balance
 */
const getCustomAssetBalance = async () => {
  const password = '123';
  const pkey = PKEY_MINE;
  const customAssetCode = CustomAssetCode;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const balance = await Account.getBalance(walletInfo, customAssetCode);

  console.log('balance IS', balance);
};

/**
 * Define a custom asset
 */
const defineCustomAssetRandom = async () => {
  const pkey = PKEY_LOCAL_FAUCET;

  const password = '123';

  const assetCode = await Asset.getRandomAssetCode();

  console.log('🚀 ~ file: run.ts ~ line 110 ~ defineCustomAsset ~ assetCode', assetCode);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our new asset created, handle - ! ! ', handle);
};

/**
 * Issue custom asset
 */
const issueCustomAssetGiven = async () => {
  const pkey = PKEY_LOCAL_FAUCET;
  const customAssetCode = CustomAssetCode;

  const password = '123';
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };

  const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, '5', assetBlindRules);

  const handle = await Transaction.submitTransaction(assetBuilder);

  console.log('our issued tx handle IS', handle);
};

/**
 * Get state commitment object (for example if we need to get current block height)
 */
const getStateCommitment = async () => {
  const stateCommitment = await Network.getStateCommitment();

  console.log('stateCommitment', stateCommitment);
};

const getValidatorList = async () => {
  const formattedVlidators = await Staking.getValidatorList();

  console.log('formattedVlidators', formattedVlidators);
};

const getDelegateInfo = async () => {
  const pkey = PKEY_LOCAL_FAUCET;
  const password = '123';
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const delegateInfo = await Staking.getDelegateInfo(walletInfo.address);
  console.log('🚀 ~ file: run.ts ~ line 192 ~ getDelegateInfo ~ delegateInfo', delegateInfo);
};

/**
 * Get transfer operation builder (before sending a tx)
 */
const getTransferBuilderOperation = async () => {
  const ledger = await getLedger();

  const password = '123';
  const pkey = PKEY_MINE;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    return;
  }

  const utxoDataList = await UtxoHelper.addUtxo(walletInfo, sids);

  const fraCode = await Asset.getFraAssetCode();

  const amount = BigInt(3);

  const sendUtxoList = UtxoHelper.getSendUtxo(fraCode, amount, utxoDataList);

  const utxoInputsInfo = await UtxoHelper.addUtxoInputs(sendUtxoList);

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.fra_get_dest_pubkey();

  let transferOperationBuilder = await Fee.getEmptyTransferBuilder();

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
    },
  ];
  const trasferOperation = await Fee.getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    fraCode,
    transferOperationBuilder,
  );

  console.log('trasferOperation!', trasferOperation);
};

/**
 * Create a wallet info object (a keypair)
 */
const createNewKeypair = async () => {
  const password = '123';

  const mm = await Keypair.getMnemonic(24);

  console.log('🚀 ~ file: run.ts ~ line 232 ~ createNewKeypair ~ new mnemonic', mm.join(' '));

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  console.log('new wallet info', walletInfo);
  return walletInfo;
};

/**
 * Send fra to a single address
 */
const transferFraToSingleAddress = async (amount: string) => {
  const pkey = PKEY_MINE;

  // const toPkeyMine2 = PKEY_MINE2;
  //  const destAddress = 'fra1a3xvplthykqercmpec7d27kl0lj55pax5ua77fztwx9kq58a3hxsxu378y';
  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  // const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const destAddress = walletInfo.address;

  const toWalletInfo = await Keypair.getAddressPublicAndKey(destAddress);

  const balanceOld = await Account.getBalance(walletInfo);
  console.log('🚀 ~ file: run.ts ~ line 287 ~ transferFraToSingleAddress ~ balanceOld', balanceOld);

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids!');
  }

  // const sortedSids = sids.sort((a, b) => b - a);

  // console.log('🚀 ~ file: run.ts ~ line 1208 ~ barToAbar ~ sortedSids', sortedSids);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    amount,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send fra result handle!!', resultHandle);

  await waitForBlockChange();
  await waitForBlockChange();

  const height = 45;
  const blockDetailsResult = await Network.getBlock(height);
  console.log(
    '🚀 ~ file: run.ts ~ line 337 ~ transferFraToSingleAddress ~ blockDetailsResult',
    JSON.stringify(blockDetailsResult, null, 2),
  );

  const h = resultHandle;

  const txStatus = await Network.getTransactionStatus(h);
  console.log(
    '🚀 ~ file: run.ts ~ line 341 ~ transferFraToSingleAddress ~ txStatus',
    JSON.stringify(txStatus, null, 2),
  );
  // await sleep(waitingTimeBeforeCheckTxStatus);

  const dataResult = await Network.getHashSwap(h);
  console.log(
    '🚀 ~ file: run.ts ~ line 345 ~ transferFraToSingleAddress ~ dataResult',
    JSON.stringify(dataResult, null, 2),
  );

  const submitResult = await Network.getTransactionStatus(resultHandle);
  console.log('🚀 ~ file: run.ts ~ line 1265 ~ barToAbar ~ submitResult after waiting', submitResult);

  const sidsResultNew = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sidsNew } = sidsResultNew;

  if (!sidsNew) {
    throw new Error('no sids!');
  }

  const sortedSidsNew = sids.sort((a, b) => b - a);
  console.log('🚀 ~ file: run.ts ~ line 335 ~ transferFraToSingleAddress ~ sortedSidsNew', sortedSidsNew);

  const balanceNew = await Account.getBalance(walletInfo);
  console.log('🚀 ~ file: run.ts ~ line 307 ~ transferFraToSingleAddress ~ balanceNew', balanceNew);
};

const testTransferToYourself = async () => {
  // const amounts = ['1', '0.5', '0.4', '0.9'];
  const amounts = ['0.3'];

  for (const amount of amounts) {
    console.log(`Sending amount of ${amount} FRA`);
    await transferFraToSingleAddress(amount);
  }
};

/**
 * Send fra to a single recepient
 */
const transferFraToSingleRecepient = async () => {
  const pkey = PKEY_LOCAL_FAUCET;
  const toPkeyMine2 = PKEY_MINE;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  console.log('🚀 ~ file: run.ts ~ line 396 ~ transferFraToSingleRecepient ~ walletInfo', walletInfo);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  console.log('🚀 ~ file: run.ts ~ line 397 ~ transferFraToSingleRecepient ~ toWalletInfo', toWalletInfo);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '0.03',
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send fra result handle!!', resultHandle);
};

/**
 * Send fra to multiple recepients
 */
const transferFraToMultipleRecepients = async () => {
  const pkey = PKEY_MINE;

  const toPkeyMine2 = PKEY_MINE2;
  const toPkeyMine3 = PKEY_MINE3;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
  ];

  const transactionBuilder = await Transaction.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send to multiple receipient result handle!', resultHandle);
};

/**
 * Send custom asset to a single recepient
 */
const transferCustomAssetToSingleRecepient = async () => {
  const pkey = PKEY_MINE;
  const toPkey = PKEY_MINE2;
  const customAssetCode = CustomAssetCode;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkey, password);

  const assetCode = customAssetCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '0.1',
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send custom result handle', resultHandle);
};

/**
 * Send custom asset to multiple recepients
 */
const transferCustomAssetToMultipleRecepients = async () => {
  const pkey = PKEY_MINE;

  const toPkeyMine2 = PKEY_MINE2;
  const toPkeyMine3 = PKEY_MINE3;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
  const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);

  const assetCode = CustomAssetCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const recieversInfo = [
    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
  ];

  const transactionBuilder = await Transaction.sendToMany(
    walletInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send custom result handle!', resultHandle);
};

/**
 * Get custom asset details
 */
const getCustomAssetDetails = async () => {
  const customAssetCode = CustomAssetCode;

  const result = await Asset.getAssetDetails(customAssetCode);

  console.log('get custom asset details !', result);
};

/**
 * Get transaction status
 */
const getTransactionStatus = async () => {
  const h = 'YOUR_TX_HASH';

  const txStatus = await Network.getTransactionStatus(h);

  console.log('transaction status', JSON.stringify(txStatus, null, 2));
};

/**
 * get block details
 */
const getBlockDetails = async () => {
  const height = 45;

  const blockDetailsResult = await Network.getBlock(height);

  console.log('blockDetails!', JSON.stringify(blockDetailsResult, null, 2));

  const { response } = blockDetailsResult;

  const block = response?.result;
  console.log('block', block?.block.header.height);
};

// get tx hash details
const myFunc14 = async () => {
  const h = 'YOUR_TX_HASH';

  const dataResult = await Network.getHashSwap(h);

  const { response } = dataResult;

  console.log(response?.result.txs);
};

const myFunc17 = async () => {
  const pkey = PKEY_MINE;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assets = await Account.getCreatedAssets(walletInfo.address);
  console.log('🚀 ~ file: run.ts ~ line 453 ~ myFunc17 ~ assets', assets);
};

const myFunc18 = async () => {
  const pkey = PKEY_MINE;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const sids = await Account.getRelatedSids(walletInfo.publickey);

  console.log('sids!!', sids);
};

// s3 cache
const myFuncS3 = async () => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, UTXO_CACHE_BUCKET_NAME, UTXO_CACHE_KEY_NAME } =
    process.env;
  const accessKeyId = AWS_ACCESS_KEY_ID || '';
  const secretAccessKey = AWS_SECRET_ACCESS_KEY || '';
  const cacheBucketName = UTXO_CACHE_BUCKET_NAME || '';
  const cacheItemKey = UTXO_CACHE_KEY_NAME || '';

  const s3Params = {
    accessKeyId,
    secretAccessKey,
  };

  const s3 = new S3(s3Params);

  let readRes;

  try {
    readRes = await s3
      .getObject({
        Bucket: cacheBucketName,
        Key: cacheItemKey,
      })
      .promise();
  } catch (error) {
    const e: Error = error as Error;

    console.log('Error!', e.message);
  }

  console.log('readRes :)', readRes?.Body?.toString());

  const existingContent = readRes?.Body?.toString('utf8');

  let res;

  const myBody = `${existingContent}\nFUNCTION STARTED: ${new Date()}`;

  try {
    res = await s3
      .putObject({
        Bucket: cacheBucketName,
        Key: cacheItemKey,
        Body: myBody,
      })
      .promise();
  } catch (error) {
    const e: Error = error as Error;

    console.log('Error!', e.message);
  }
};

export const delegateFraTransactionSubmit = async () => {
  console.log('////////////////  delegateFraTransactionSubmit //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterUnstake = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 605 ~ delegateFraTransactionSubmit ~ balanceAfterUnstake',
    balanceAfterUnstake,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ delegateFraTransactionSubmit ~ transactionBuilder',
    transactionBuilder,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ delegateFraTransactionSubmit ~ resultHandle',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await Network.getTransactionStatus(resultHandle);

  console.log('Retrieved transaction status response:', transactionStatus);

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  return true;
};

export const delegateFraTransactionAndClaimRewards = async () => {
  console.log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const balanceBeforeSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeSend',
    balanceBeforeSend,
  );

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend',
    balanceAfterSend,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilder = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ delegateResultHandle',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatus = await Network.getTransactionStatus(resultHandle);

  console.log('Retrieved transaction status response:', transactionStatus);

  const { response: sendResponse } = transactionStatus;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatus,
    );
    return false;
  }

  const balanceAfterDelegate = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterDelegate',
    balanceAfterDelegate,
  );

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  // claim

  const balanceBefore = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 801 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim',
    balanceBefore,
  );

  const amountToClaim = delegateInfo.rewards;

  const transactionBuilderClaim = await Staking.claim(toWalletInfo, amountToClaim);

  const resultHandleClaim = await Transaction.submitTransaction(transactionBuilderClaim);

  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ resultHandleClaim',
    resultHandle,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusClaim = await Network.getTransactionStatus(resultHandleClaim);

  console.log('Retrieved transaction status response:', transactionStatusClaim);

  const { response: claimResponse } = transactionStatusClaim;

  if (!claimResponse) {
    return false;
  }

  const { Committed: ClaimCommited } = claimResponse;

  if (!Array.isArray(ClaimCommited)) {
    return false;
  }

  const txnSIDClaim = ClaimCommited && Array.isArray(ClaimCommited) ? ClaimCommited[0] : null;

  console.log(
    '🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSIDClaim',
    txnSIDClaim,
  );

  if (!txnSIDClaim) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ${resultHandle}. Response was: `,
      transactionStatusClaim,
    );
    return false;
  }

  const balanceAfter = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 845 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter',
    balanceAfter,
  );

  const isClaimSuccessfull = Number(balanceAfter) > Number(balanceBefore);
  console.log(
    '🚀 ~ file: run.ts ~ line 877 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull',
    isClaimSuccessfull,
  );

  return isClaimSuccessfull;
};

export const unstakeFraTransactionSubmit = async () => {
  console.log('////////////////  unstakeFraTransactionSubmit //////////////// ');

  const password = '123';
  const Ledger = await getLedger();

  const pkey = mainFaucet;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const toWalletInfo = await Keypair.createKeypair(password);

  const fraCode = await Asset.getFraAssetCode();

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const numbersToSend = '1000010';
  const numbersToDelegate = '1000000';

  const transactionBuilderSend = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    numbersToSend,
    fraCode,
    assetBlindRules,
  );

  const resultHandleSend = await Transaction.submitTransaction(transactionBuilderSend);

  console.log('send fra result handle!!', resultHandleSend);

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusSend = await Network.getTransactionStatus(resultHandleSend);

  console.log('Retrieved transaction status response:', transactionStatusSend);

  const { response: sendResponse } = transactionStatusSend;

  if (!sendResponse) {
    return false;
  }

  const { Committed } = sendResponse;

  if (!Array.isArray(Committed)) {
    return false;
  }

  const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSID', txnSID);

  if (!txnSID) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandleSend}. Response was: `,
      transactionStatusSend,
    );

    return false;
  }

  const balanceAfterSend = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend',
    balanceAfterSend,
  );

  // delegate

  const delegationTargetPublicKey = Ledger.get_delegation_target_address();

  const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);

  const formattedVlidators = await Staking.getValidatorList();

  const validatorAddress = formattedVlidators.validators[0].addr;

  const transactionBuilderDelegate = await Staking.delegate(
    toWalletInfo,
    delegationTargetAddress,
    numbersToDelegate,
    fraCode,
    validatorAddress,
    assetBlindRules,
  );

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderDelegate',
    transactionBuilderDelegate,
  );

  const resultHandleDelegate = await Transaction.submitTransaction(transactionBuilderDelegate);
  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate',
    resultHandleDelegate,
  );

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate',
    resultHandleDelegate,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const transactionStatusDelegate = await Network.getTransactionStatus(resultHandleDelegate);

  console.log('Retrieved transaction status response:', transactionStatusDelegate);

  const { response: delegateResponse } = transactionStatusDelegate;

  if (!delegateResponse) {
    return false;
  }

  const { Committed: CommittedDelegate } = delegateResponse;

  if (!Array.isArray(CommittedDelegate)) {
    return false;
  }

  const txnSIDDelegate = CommittedDelegate && Array.isArray(CommittedDelegate) ? CommittedDelegate[0] : null;

  console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSIDDelegate', txnSIDDelegate);

  if (!txnSIDDelegate) {
    console.log(
      `🚀 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ${resultHandleDelegate}. Response was: `,
      transactionStatusDelegate,
    );

    return false;
  }

  console.log('waiting for 5 blocks before checking rewards');
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  console.log('checking rewards now');

  const delegateInfo = await Staking.getDelegateInfo(toWalletInfo.address);

  const isRewardsAdded = Number(delegateInfo.rewards) > 0;

  if (!isRewardsAdded) {
    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
    return false;
  }

  console.log('accumulated rewards ', delegateInfo.rewards);

  // unstake

  const balanceBeforeUnstake = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceBeforeUnstake',
    balanceBeforeUnstake,
  );

  const transactionBuilderUnstake = await Staking.unStake(toWalletInfo, numbersToDelegate, validatorAddress);

  console.log(
    '🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderUnstake',
    transactionBuilderUnstake,
  );

  const resultHandleUnstake = await Transaction.submitTransaction(transactionBuilderUnstake);
  console.log(
    '🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandle',
    resultHandleUnstake,
  );

  console.log(
    '🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleUnstake',
    resultHandleUnstake,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  const balanceAfterUnstake = await Account.getBalance(toWalletInfo);

  console.log(
    '🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceAfterUnstake',
    balanceAfterUnstake,
  );

  const isUnstakeSuccessfull = Number(balanceAfterUnstake) > Number(balanceBeforeUnstake);
  console.log(
    '🚀 ~ file: run.ts ~ line 877 ~ unstakeFraTransactionSubmit ~ isUnstakeSuccessfull',
    isUnstakeSuccessfull,
  );

  return isUnstakeSuccessfull;
};

const sendEvmToAccount = async () => {
  const fraAddress = FRA_ADDRESS;
  const amount = '1';
  const ethPrivate = ETH_PRIVATE;
  const ethAddress = ETH_ADDRESS;
  // await Evm.sendEvmToAccount(fraAddress, amount, ethPrivate, ethAddress);
};

const ethProtocol = async () => {
  const url = 'http://127.0.0.1:8545';
  // const url = 'https://dev-evm.dev.findora.org:8545';

  const methodName = 'eth_getBlockByHash';
  const existingBlockHashToCheck = '0x1af723767d06ef414e7aa6d7df2745cec9e47c315ed754a68d0a2d5cc2468077';
  const extraParams = [existingBlockHashToCheck, true];

  // const methodName = 'eth_getTransactionByHash';
  // const existingTxHashToCheck = '0xe8cc1b8752779446010a8ab8f8a1dad77db4451f1ebd5e08e1a00f911c8db90e';
  // const extraParams = [existingTxHashToCheck];

  const payload = {
    method: methodName,
    params: extraParams,
  };

  const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(url, payload);

  console.log(`🚀 ~ file: run.ts ~ line 1154 ~ ${methodName} ~ result`, result);
};

const createTestBars = async (senderOne = PKEY_MINE) => {
  console.log('////////////////  Create Test Bars //////////////// ');

  const password = '1234';

  const pkey = mainFaucet;
  const toPkeyMine = senderOne;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = fraCode;
  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  for (let i = 0; i < 5; i++) {
    // const amount = getRandomNumber(10, 20);
    const amount = getRandomNumber(1, 9);
    console.log('🚀 ~ !! file: run.ts ~ line 1199 ~ createTestBars ~ amount', amount);

    const transactionBuilder = await Transaction.sendToAddress(
      walletInfo,
      toWalletInfo.address,
      `1.2${amount}`,
      assetCode,
      assetBlindRules,
    );

    const resultHandle = await Transaction.submitTransaction(transactionBuilder);
    console.log('send fra result handle!!', resultHandle);

    await waitForBlockChange();
  }

  return true;
};

const getFee = async () => {
  const password = '1234';

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  console.log('🚀 ~ file: run.ts ~ line 1299 ~ getFee ~ walletInfo', walletInfo);

  const feeInputsPayload = await getFeeInputs(walletInfo, [11], true);
  console.log('🚀 ~ file: run.ts ~ line 1301 ~ getFee ~ feeInputsPayload', feeInputsPayload);
};

async function approveToken() {
  // const webLinkedInfo = {
  //   privateStr: '4d05b965f821ea900ddd995dfa1b6caa834eaaa1ebe100a9760baf9331aae567',
  //   rpcUrl: 'https://dev-qa02.dev.findora.org:8545', //'https://prod-forge.prod.findora.org:8545',
  //   chainId: 1111, // 2154,
  //   account: '0x72488bAa718F52B76118C79168E55c209056A2E6',
  // };

  // const result = await Evm.approveToken(
  //   '0xfd66Bd7839Ed3AeC90f5F54ab2E11E7bF2FF4be5', // token
  //   '0xaBA48f89BDa0C2C57c0E68056E445D1984EA8664', // 授权 prism->ledger
  //   '100',
  //   webLinkedInfo,
  // );
  // console.log(result.transactionHash);

  // const result1 = await Evm.frc20ToBar(
  //   '0x7Ed73c1D16590Bc2810F2C510Cd0923e34E3F592', // bridge
  //   'fra1nqkz745gc6rcv2htrvv4yyey2482kw4awrjzsnw4nrkp99lxw64qjsrd6v',
  //   '0xfd66Bd7839Ed3AeC90f5F54ab2E11E7bF2FF4be5', // token
  //   '100',
  //   webLinkedInfo,
  // );
  // console.log(result1.transactionHash);
  // const result1 = await Evm.tokenBalance(
  //   webLinkedInfo,
  //   '0x85f7BEDcaEe6e2ad58E1bD195C5643F3A6A54125',
  //   true,
  //   webLinkedInfo.account,
  // );

  // console.log(result1);

  const addr = await Evm.hashAddressTofraAddress('0xfd66Bd7839Ed3AeC90f5F54ab2E11E7bF2FF4be5');
  console.log(addr);
}

async function testCommitment() {
  const data2 = [
    33,
    {
      point: 'd4koAbY2p-9fu5KOSkcmlRtefgqmwrIlm--3gx0KLjU=',
      ctext: [
        153, 62, 220, 132, 222, 139, 46, 13, 77, 111, 92, 117, 139, 60, 245, 53, 247, 132, 69, 227, 69, 186,
        173, 123, 147, 193, 177, 244, 148, 26, 186, 90, 19, 157, 1, 113, 170, 113, 165, 15, 76, 15, 83, 82,
        138, 161, 98, 95, 34, 54, 118, 251, 30, 232, 104, 241, 101, 249, 228, 103, 153, 149, 249, 145, 174,
        179, 176, 156, 255, 163, 40, 26, 105, 206, 199, 37, 102, 217, 160, 234, 79, 197, 103, 171, 213, 122,
        14, 204,
      ],
    },
  ];

  const [atxoSid, myMemoData] = data2;

  const anonKeysReceiver = {
    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
    axfrSpendKey:
      'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
  };

  // const atxoSidM = '33';
  // const abarOwnerMemo = await TripleMasking.getAbarOwnerMemo(atxoSidM);

  const ledger = await getLedger();

  // const [amount, assetType] = decryptedAbar;

  // http://127.0.0.1:8667/get_abar_commitment/0) <- atxoSid

  const commitmentInBase64 = '-NVMwSq6OciQPxpm1mNAond3c8Euxse4Rt9tTyPk0jo=';

  //  curl http://127.0.0.1:8667/get_abar_commitment/0                                                                                                           [08:18:31pm]
  // "EYSkMoa1SFefat0xPtZsblG5GnMTcgm45eDBcfKw9Uo="⏎

  // HkLkeNetndmwAhPQxBgXV5sQYmLvaC4hpnPaCNTHNBVs

  // {
  //   "commitmentKey": "HkLkeNetndmwAhPQxBgXV5sQYmLvaC4hpnPaCNTHNBVs",
  //   "commitmentAxfrPublicKey": "-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=",
  //   "commitmentAssetType": "j7srJTB5XrQBaRNpdE5SFWcQFUmRipmWUV4X4qkL-jc=",
  //   "commitmentAmount": "23.140000"
  // },

  // to store or continue parse_axfr_memo/decrypt_axfr_memo
}

async function runAbarCreating(iterations = 20) {
  const anonKeys1 = {
    axfrPublicKey: 'vZ91wm2xNKuQDmziOYQruRRg6Pj36k8V6YH2NbyjSnAA',
    axfrSecretKey: 'Ip-rnJqV3kBFhuQATH1mqtXIYUCvoxkbUjYk4bFDc-y9n3XCbbE0q5AObOI5hCu5FGDo-PfqTxXpgfY1vKNKcAA=',
  };

  const anonKeys2 = {
    axfrPublicKey: '-4HK7kShP7wxSeUUb0z3I_goisFx3xywXte1iPSFfauA',
    axfrSecretKey: '01xTmsZbLjkQhJjrQuqnK0bgd0glIJXSTit1WvSLq3T7gcruRKE_vDFJ5RRvTPcj-CiKwXHfHLBe17WI9IV9q4A=',
  };

  const wallets = [anonKeys1, anonKeys2];

  for (let i = 0; i < iterations; i = i + 1) {
    console.log(`-=-=-=-=-=-=-   =-=-=-==-==- ==-==-   ITERARION ${i}`);
    const maxAtxoSidResult = await Network.getMaxAtxoSid();

    const { error: masError, response: masResponse } = maxAtxoSidResult;

    if (masError) {
      log('error!', masError);
      throw new Error('could not get mas');
    }

    console.log(`=======   ========= ======= Current MAS = ${masResponse}`);

    const walletIndex = (i + 1) % 2 === 0 ? 1 : 0;
    const amountToSend = walletIndex ? '10' : '10';

    // console.log('🚀 ~ file: run.ts ~ line 1656 ~ runAbarCreating ~ walletIndex', walletIndex);
    const currentWallet = wallets[walletIndex];
    console.log('🚀 ~ file: run.ts ~ line 1655 ~ runAbarCreating ~ currentWallet', currentWallet);

    // const _transferResult = await TMI.barToAbarAmount(currentWallet, amountToSend);
  }
}

// async function testFailure() {
//   const result = await TMI.abarToBarCustomSendAmount();
//   console.log('🚀 ~ file: run.ts ~ line 1647 ~ testFailure ~ result', result);
// }

async function getMas() {
  const maxAtxoSidResult = await Network.getMaxAtxoSid();

  const { error: masError, response: masResponse } = maxAtxoSidResult;

  if (masError) {
    log('error!', masError);
    throw new Error('could not get mas');
  }

  console.log(`Current MAS = ${masResponse}`);

  const result = await Network.getAbarMemos('1', '20');
  console.log('🚀 /////////////// . ~ file: run.ts ~ line 1450 ~ testIt ~ result', result);
}

async function prism() {
  // const { response: displayCheckpointData, error } = await Network.getConfig();

  // if (error) throw error;

  // if (!displayCheckpointData?.prism_bridge_address) throw 'no prism_bridge_address';

  // const web3 = Evm.getWeb3('https://dev-qa04.dev.findora.org:8545');

  // const prismProxyContract = await Evm.getPrismProxyContract(
  //   web3,
  //   displayCheckpointData.prism_bridge_address,
  // );
  // const prismBridgeAddress = await prismProxyContract.methods.prismBridgeAddress().call();

  // const prismContract = await Evm.getSimBridgeContract(web3, prismBridgeAddress);

  // const [ledgerAddress, assetAddress] = await Promise.all([
  //   prismContract.methods.ledger_contract().call(),
  //   prismContract.methods.asset_contract().call(),
  // ]);

  // console.log(ledgerAddress, assetAddress, prismBridgeAddress);

  // const name = await erc20Contract.methods.name().call();

  // console.log('erc20 token name: ', name);

  // const result = await Evm.getPrismConfig();
  // console.log(result);

  // const walletInfo = await Keypair.restoreFromPrivateKey(
  //   'AKPYFxSOX7dVTpM2IbxaYFE1laLJDNQhIodMyXJt_hAE',
  //   password,
  // );

  // try {
  //   Evm.sendAccountToEvm(
  //     walletInfo,
  //     '1',
  //     '0x72488baa718f52b76118c79168e55c209056a2e6',
  //     'eDv3Xau2tpTKZyBD8k_8jMf8QCwIUmhdbmK1FiyASfg=',
  //     '',
  //   );
  // } catch (error) {
  //   console.log(error);
  // }

  const result = Evm.fraAddressToHashAddress(
    'eth1qg9szy8wxgxgn7swrwj7va4whuur65z7xvj3vddh4wkd2nd7u8mpsu8882y',
  );
  console.log(result);
}

async function testWasmFunctions(walletInfo: Keypair.WalletKeypar): Promise<void> {
  const ledger = await getLedger();

  const publickeyFormatEth = ledger.get_pub_key_str(walletInfo.keypair);

  const publickeyAddressFormatEth = ledger.bech32_to_base64(walletInfo.address);

  console.log('============');
  console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
  console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);

  console.log('============');
}

async function testBrokenKeypairOne() {
  const ledger = await getLedger();

  console.log('============');

  const mnemonic =
    'zoo nerve assault talk depend approve mercy surge bicycle ridge dismiss satoshi boring opera next fat cinnamon valley office actor above spray alcohol giant';

  const keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic);

  const publickey = await Keypair.getPublicKeyStr(keypair);

  console.log('publickey (from restored keypair)', publickey);
  const address = await Keypair.getAddress(keypair);
  console.log('address (from restored keypair)', address);

  const publickeyFormatEth = ledger.get_pub_key_str(keypair);

  const publickeyAddressFormatEth = ledger.bech32_to_base64(address);

  console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
  console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);

  console.log('\n');

  console.log('============');
}

async function testBrokenKeypairTwo() {
  const ledger = await getLedger();

  console.log('============');
  const keypair = ledger.new_keypair();

  const publickey = await Keypair.getPublicKeyStr(keypair);

  console.log('publickey (from created keypair)', publickey);
  const address = await Keypair.getAddress(keypair);
  console.log('address (from created keypair)', address);

  const publickeyFormatEth = ledger.get_pub_key_str(keypair);

  const publickeyAddressFormatEth = ledger.bech32_to_base64(address);

  console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
  console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);

  console.log('\n');

  console.log('============');
}

async function testBrokenKeypairs() {
  await testBrokenKeypairOne();
  await testBrokenKeypairTwo();
}

async function getNewBalanace() {
  const isFra = false;

  const pkeyLocalFaucetFra = 'o9gXFI5ft1VOkzYhvFpgUTWVoskM1CEih0zJcm3-EAQ=';

  const pkeyLocalFaucetEth = 'AW1bcpuGIThE5wnspklloHG6s5qGOKbC6Msca0OTpb41';

  const mnemonicLocalFaucet =
    'zoo nerve assault talk depend approve mercy surge bicycle ridge dismiss satoshi boring opera next fat cinnamon valley office actor above spray alcohol giant';

  const faucetWalletInfoPkeyFra = await Keypair.restoreFromPrivateKey(pkeyLocalFaucetFra, password);
  const faucetWalletInfoPkeyEth = await Keypair.restoreFromPrivateKey(pkeyLocalFaucetEth, password);

  const faucetWalletInfoMnemonic = await Keypair.restoreFromMnemonic(
    mnemonicLocalFaucet.split(' '),
    password,
  );

  const balanceFaucetFra = await Account.getBalance(faucetWalletInfoPkeyFra);
  const balanceFaucetEth = await Account.getBalance(faucetWalletInfoPkeyEth);
  const balanceFaucetMnemonic = await Account.getBalance(faucetWalletInfoMnemonic);

  console.log('============--------------=============================');
  console.log('\n');

  console.log('Faucet pkey fra', pkeyLocalFaucetFra, '\n');
  console.log('faucetWalletInfoPkeyFra.address ', faucetWalletInfoPkeyFra.address);
  console.log('faucetWalletInfoPkeyFra.privateStr', faucetWalletInfoPkeyFra.privateStr);
  console.log('faucetWalletInfoPkeyFra.publickey', faucetWalletInfoPkeyFra.publickey);
  console.log('\n');

  try {
    await testWasmFunctions(faucetWalletInfoPkeyFra);
  } catch (error) {
    console.log('we have an error', error);
  }
  console.log('\n');

  console.log('============--------------=============================');
  console.log('\n');
  console.log('Faucet pkey eth', pkeyLocalFaucetEth, '\n');
  console.log('faucetWalletInfoPkeyEth.address ', faucetWalletInfoPkeyEth.address);
  console.log('faucetWalletInfoPkeyEth.privateStr', faucetWalletInfoPkeyEth.privateStr);
  console.log('faucetWalletInfoPkeyEth.publickey', faucetWalletInfoPkeyEth.publickey);
  console.log('\n');

  try {
    await testWasmFunctions(faucetWalletInfoPkeyFra);
  } catch (error) {
    console.log('we have an error', error);
  }
  console.log('\n');

  console.log('============--------------=============================');
  console.log('\n');
  console.log('Faucet Mnemonic', mnemonicLocalFaucet, '\n');
  console.log('faucetWalletInfoMnemonic.address ', faucetWalletInfoMnemonic.address);
  console.log('faucetWalletInfoMnemonic.privateStr', faucetWalletInfoMnemonic.privateStr);
  console.log('faucetWalletInfoMnemonic.publickey', faucetWalletInfoMnemonic.publickey);
  console.log('\n');

  try {
    await testWasmFunctions(faucetWalletInfoMnemonic);
  } catch (error) {
    console.log('we have an error', error);
  }
  console.log('\n');
}

async function getTxnListTest() {
  // native txn list
  // const result = await Transaction.getTxnList(
  //   'fra13dac6nn6yl2t6thfc0hxsjemgqp0ghzyqmjdf55xc9mtw5atz5jsx8lze3',
  //   'from',
  // );
  // console.log(result.txs[0]);
  // staking txn list
  // const result = await Transaction.getTxnListByStaking(
  //   'fra1u0n385m74jz80sasqju7c7t73c8h0wwgenw6hk092w828rcdz6ks54cw4e',
  //   'delegation',
  // );
  // console.log(result);
  // const result = await Transaction.getTxnListByStakingUnDelegation(
  //   'fra1u0n385m74jz80sasqju7c7t73c8h0wwgenw6hk092w828rcdz6ks54cw4e',
  // );
  // console.log(result);
  // prism txn list
  // const result = await Transaction.getTxnListByPrism(
  //   'fra1lelnp9fthp68xy0nqtlu7h2u6ms45rh4lqu466ns4jxqvdjja3qqz5ae6s',
  //   'send',
  // );
  // console.log(result);
}

// prism();

// approveToken();
// testItSync();
getFraBalance();
// testWasmFunctions();
// getAnonKeys();
// runAbarCreating(2);
// getMas();
// getAbarBalance();
// testFailure();

// getNewBalanace();
// testBrokenKeypairs();

// getTxnListTest();
