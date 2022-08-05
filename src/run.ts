import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import sleep from 'sleep-promise';
import { Account, Asset, Evm, Keypair, Network, Staking, Transaction, TripleMasking } from './api';
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
import * as TMI from './tripleMasking/tripleMasking.integration';

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

const password = '123';

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

  const pkey = PKEY_LOCAL_FAUCET;
  // const pkey = PKEY_MINE;
  //  const pkey = PKEY_MINE2;
  // const pkey = PKEY_MINE3;
  // const pkey = ENG_PKEY;

  // const mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING;
  const mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE;
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

  console.log('\n');

  console.log('balance from restored from pkey IS', balance);
  console.log('balance from restored using mnemonic IS', balanceNew);
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

  await sleep(waitingTimeBeforeCheckTxStatus);

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

  const toPkeyMine2 = PKEY_MINE2;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);

  const fraCode = await Asset.getFraAssetCode();

  const assetCode = fraCode;

  const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };

  const transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    toWalletInfo.address,
    '2',
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

// get tx list hash details
const myFunc15 = async () => {
  const h = 'YOUR_TX_HASH';

  const pkey = PKEY_MINE;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const dataResult = await Network.getTxList(walletInfo.address, 'from');

  const { response } = dataResult;

  console.log('response!!!', JSON.stringify(response, null, 2));
};

const myFunc16 = async () => {
  const pkey = PKEY_MINE;

  const password = '123';

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const txList = await Transaction.getTxList(walletInfo.address, 'from');

  console.log('txList', txList);
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

const getAnonKeys = async () => {
  const myAnonKeys = await TripleMasking.genAnonKeys();

  console.log('🚀 ~ file: run.ts ~ line 1149 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
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
    const amount = getRandomNumber(10, 20);
    console.log('🚀 ~ !! file: run.ts ~ line 1199 ~ createTestBars ~ amount', amount);

    const transactionBuilder = await Transaction.sendToAddress(
      walletInfo,
      toWalletInfo.address,
      `${amount}`,
      assetCode,
      assetBlindRules,
    );

    const resultHandle = await Transaction.submitTransaction(transactionBuilder);
    console.log('send fra result handle!!', resultHandle);
    await sleep(waitingTimeBeforeCheckTxStatus);
  }

  return true;
};

export const getSidsForAsset = async (senderOne: string, assetCode: string) => {
  console.log(`//////////////// Get sids for asset ${assetCode} //////////////// `);
  const walletInfo = await Keypair.restoreFromPrivateKey(senderOne, password);
  // const fraCode = await Asset.getFraAssetCode();

  const { response: sids } = await Network.getOwnedSids(walletInfo.publickey);
  const sidsResult = sids;
  if (!sidsResult) {
    console.log('ERROR no sids available');
    return [];
  }

  const utxoDataList = await UtxoHelper.addUtxo(walletInfo, sidsResult);

  const customAssetSids = [];
  for (const utxoItem of utxoDataList) {
    const utxoAsset = utxoItem['body']['asset_type'];

    if (utxoAsset === assetCode) {
      customAssetSids.push(utxoItem['sid']);
    }
  }
  return customAssetSids;
};

const barToAbar = async (sids: number[]) => {
  const password = '1234';

  const pkey = PKEY_MINE;

  // await createTestBars(pkey);

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  // const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  // const { response: sids } = sidsResult;

  // if (!sids) {
  //   throw new Error('no sids!');
  // }
  // console.log('🚀 ~ file: run.ts ~ line 1193 ~ barToAbar ~ sids', sids);

  const sortedSids = sids;
  // const sortedSids = sids.sort((a, b) => b - a);
  // console.log('🚀 ~ 1file: run.ts ~ line 1208 ~ barToAbar ~ sortedSids', sortedSids);

  // const [sidOne, sidTwo, sidThree] = sortedSids;

  const anonKeys = { ...myAbarAnonKeys };

  console.log('🚀 ~file: run.ts ~ line 1202 ~ barToAbar ~ anonKeys receiver', anonKeys);

  const {
    transactionBuilder,
    barToAbarData,
    sids: usedSids,
  } = await TripleMasking.barToAbar(walletInfo, sortedSids, anonKeys.axfrPublicKey);

  console.log(
    '🚀 ~ file: run.ts ~ line 1187 ~ barToAbar barToAbatData',
    JSON.stringify(barToAbarData, null, 2),
  );
  console.log('🚀 ~ file: run.ts ~ line 1188 ~ barToAbar usedSids', usedSids.join(','));

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('send bar to abar result handle!!', resultHandle);

  const givenCommitments = barToAbarData.commitments;

  await sleep(waitingTimeBeforeCheckTxStatus);
  await sleep(waitingTimeBeforeCheckTxStatus);

  // const submitResult = await Network.getTransactionStatus(resultHandle);
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 1265 ~ barToAbar ~ submitResult after waiting',
  //   JSON.stringify(submitResult, null, 2),
  // );

  for (const givenCommitment of givenCommitments) {
    // const ownedAbarsResponse = await TripleMasking.getOwnedAbars(givenCommitment);

    // console.log(
    //   '🚀 ~ file: run.ts ~ line 1216 ~ barToAbar ~ ownedAbarsResponse',
    //   JSON.stringify(ownedAbarsResponse, null, 2),
    // );
    const balances = await TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment]);

    console.log(
      '🚀 ~ file: run.ts ~ line 1291 ~ barToAbar ~ balances for the new commitments',
      JSON.stringify(balances, null, 2),
    );

    // const ownedAbarsSaveResult = await TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbarsResponse);
    // console.log('🚀 ~ file: run.ts ~ line 1223 ~ barToAbar ~ ownedAbarsSaveResult', ownedAbarsSaveResult);
  }

  return givenCommitments;
};

const validateUnspent = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  const givenCommitment = 'ju2DbSDQWKown4so0h4Sijny_jxyHagKliC-zXIyeGY=';

  const axfrSecretKey = anonKeys.axfrSpendKey;
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

  console.log('🚀 ~ file: run.ts ~ line 1279 ~ validateUnspent ~ isNullifierHashSpent', isNullifierHashSpent);
};

const getUnspentAbars = async () => {
  const anonKeys = { ...myAbarAnonKeys };

  // const givenCommitmentsList = myGivenCommitmentsList;
  const givenCommitmentsList = ['ju2DbSDQWKown4so0h4Sijny_jxyHagKliC-zXIyeGY='];

  const unspentAbars = await TripleMasking.getUnspentAbars(anonKeys, givenCommitmentsList);
  console.log('🚀 ~ file: run.ts ~ line 1291 ~ getUnspentAbars ~ unspentAbars', unspentAbars);
};

const getAbarBalance = async () => {
  // const anonKeys = { ...myAbarAnonKeys };

  // Anon Walet 1
  // const anonKeys = {
  //   axfrPublicKey: 'oDosEZB9uq4joxcM6xE993XHdSwBs90z2DEzg7QzSus=',
  //   axfrSecretKey: 'Gsppgb5TA__Lsry9TMe9hBZdn_VOU4FS1oCaHrdLHQCgOiwRkH26riOjFwzrET33dcd1LAGz3TPYMTODtDNK6w==',
  //   decKey: 'oAOZEUWKbgjv8OVtlL5PJYrNnV1KDtW3PCyZc30SW0Y=',
  //   encKey: 'eT39SV2et8ONJsN0kCEPJkNQys89UlFUsdPpY2x5qR8=',
  // };

  // Anon Walet 3
  // const anonKeys = {
  //   axfrPublicKey: '5kJ1D8ZGmaHbyv4Yfn3q94oYAgV8km5dkiBHWPMU2b8=',
  //   axfrSecretKey: 'VDj-QNt0UEilrJsXa69HduAnfsXpZqYabXC_ozqiCwTmQnUPxkaZodvK_hh-fer3ihgCBXySbl2SIEdY8xTZvw==',
  //   decKey: 'KLzfPV-ft7m114DsUBt_ZblsdbCFqhIzkTWd9rZBN3w=',
  //   encKey: 'k9L1_NnjjZu6jpkKZXrmsRi2Vta0LuLGsk2y4Hk0akI=',
  //   name: 'AnonWallet3',
  // };

  // Anon Walet 2
  const anonKeys = {
    axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
    axfrSpendKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
    axfrViewKey: '',
    name: 'AnonWallet2',
  };

  // const anonKeys = {
  //   axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
  //   axfrSecretKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
  //   decKey: '8Fuq0EdUlv9IwULCuU5eao9SzkVGEe8rWPoDIuJiEVw=',
  //   encKey: 'cWQG_4BMhKZ_hmsnfY4JyHDWCT4pF6OMz4sHlkzEzG8=',
  // };

  const givenCommitmentsList = [
    // '2faWWWW8QyXCnpvzX5tADsgSUiRZc55KCPd1ttPfrF7E', // 9.98 spent - a1
    // 'J9GaEtp4wG1nCm2SdDHUju6VZD6JhAmcYa5ae9y6kMT6', // 10.900000 - a1
    // 'NxL2RAScj8vnSpnNFczaK8iu7ZCLRwB8Wq8fzKGMUgp', // 12 spent - a1
    '3cPUB1No27iS1vCXeik53gnxQVwpU6iZPX5mywx68A8G', // 9.98 - a2?
  ];

  // console.log(
  //   '🚀 ~ file: run.ts ~ line 1298 ~ getAbarBalance ~ givenCommitmentsList to check',
  //   givenCommitmentsList,
  // );

  // const spentAbars = await TripleMasking.getSpentAbars(anonKeys, givenCommitmentsList);
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 1319 ~ getAbarBalance ~ spentAbars',
  //   JSON.stringify(spentAbars, null, 2),
  // );

  // const a = await TripleMasking.openAbar(spentAbars[0], anonKeys);
  // console.log('🚀 ~ file: run.ts ~ line 1325 ~ getAbarBalance ~ a', a);

  // const balances = await TripleMasking.getBalance(anonKeys, givenCommitmentsList);
  const balances = await TripleMasking.getAllAbarBalances(anonKeys, givenCommitmentsList);

  console.log('🚀 ~ file: run.ts ~ line 1291 ~ getAbarBalance ~ balances', JSON.stringify(balances, null, 2));
};

const getFee = async () => {
  const password = '1234';

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
  console.log('🚀 ~ file: run.ts ~ line 1299 ~ getFee ~ walletInfo', walletInfo);

  const feeInputsPayload = await getFeeInputs(walletInfo, [11], true);
  console.log('🚀 ~ file: run.ts ~ line 1301 ~ getFee ~ feeInputsPayload', feeInputsPayload);
};

export const defineCustomAsset = async (senderOne: string, assetCode: string) => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
  const handle = await Transaction.submitTransaction(assetBuilder);
  console.log('New asset ', assetCode, ' created, handle', handle);

  await sleep(waitingTimeBeforeCheckTxStatus);
};

export const issueCustomAsset = async (
  senderOne: string,
  assetCode: string,
  derivedAssetCode: string,
  amount: string,
) => {
  const pkey = senderOne;
  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const assetBlindRules = { isAmountBlind: false };
  const assetBuilderIssue = await Asset.issueAsset(walletInfo, derivedAssetCode, amount, assetBlindRules);

  const handleIssue = await Transaction.submitTransaction(assetBuilderIssue);

  console.log('Asset ', assetCode, ' issued, handle', handleIssue);
  await sleep(waitingTimeBeforeCheckTxStatus);
};

export const createTestBarsMulti = async (
  senderOne: string,
  asset1Code: string,
  derivedAsset1Code: string,
) => {
  console.log('//////////////// Issue Custom Asset //////////////// ');

  const toPkeyMine = senderOne;

  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine, password);

  const balance1Old = await Account.getBalance(toWalletInfo, derivedAsset1Code);
  await defineCustomAsset(senderOne, asset1Code);
  await issueCustomAsset(senderOne, asset1Code, derivedAsset1Code, '10');
  await issueCustomAsset(senderOne, asset1Code, derivedAsset1Code, '5');
  await issueCustomAsset(senderOne, asset1Code, derivedAsset1Code, '20');

  const balance1New = await Account.getBalance(toWalletInfo, derivedAsset1Code);
  const balance1ChangeF =
    parseFloat(balance1New.replace(/,/g, '')) - parseFloat(balance1Old.replace(/,/g, ''));
  const balance1Change = Math.floor(balance1ChangeF);

  console.log(
    'Custom Asset1 Old Balance = ',
    balance1Old,
    '; Custom Asset1 New Balance = ',
    balance1New,
    '; Custom Asset1 Balance Change = ',
    balance1ChangeF,
  );
};

const abarToAbarFraOneFraAtxoForFee = async () => {
  const anonKeysSender = { ...myAbarAnonKeys };

  const anonKeysReceiver = {
    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
    axfrSpendKey:
      'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
  };

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  await createTestBars(pkey);
  await createTestBarsMulti(pkey, assetCode, derivedAssetCode);

  // const amount = '26';
  // const asset = await Asset.getAssetDetails(derivedAssetCode);
  // const decimals = asset.assetRules.decimals;
  // const amountToSend = BigInt(toWei(amount, decimals).toString());

  const customAssetSids = await getSidsForAsset(pkey, derivedAssetCode);
  console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);

  const [cAssetSidOne, cAssetSidTwo] = customAssetSids;

  const customAssetCommitmentsList = await barToAbar([cAssetSidOne, cAssetSidTwo]);

  const fraAssetSids = await getSidsForAsset(pkey, fraCode);
  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;

  const fraAssetCommitmentsList = await barToAbar([fAssetSidOne]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo, fAssetSidThree]);

  // const atxoSendList = await TripleMasking.getSendAtxo(
  //   assetCode,
  //   amountToSend,
  //   givenCommitmentsList,
  //   anonKeysSender,
  // );
  // console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList); // const givenCommitmentToTransfer = 'ePe-5CbvvSFrddkd3FzN6MPz5QvDOGuw1-THyti4OUE='; // 3.15 TEST1A (sid 11)

  // const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
  const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of givenCommitmentsListSender) {
    const balancesCommitment = await TripleMasking.getBalance(anonKeysSender, [givenCommitment]);
    console.log(
      '🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used',
      balancesCommitment,
    );
    const ownedAbarsResponseTwo = await TripleMasking.getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '0.5',
    additionalOwnedAbarItems,
  );

  console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  console.log('transfer abar result handle!!', resultHandle);

  console.log(
    `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('now checking balances\n\n\n');

  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  console.log(
    '🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver',
    retrivedCommitmentsListReceiver,
  );
  console.log(
    '🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender',
    givenCommitmentsListSender,
  );

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
  console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
};

const abarToAbarFraMultipleFraAtxoForFee = async () => {
  const anonKeysSender = { ...myAbarAnonKeys };

  const anonKeysReceiver = {
    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
    axfrSpendKey:
      'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
  };

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  await createTestBars(pkey);
  await createTestBarsMulti(pkey, assetCode, derivedAssetCode);

  // const amount = '26';
  // const asset = await Asset.getAssetDetails(derivedAssetCode);
  // const decimals = asset.assetRules.decimals;
  // const amountToSend = BigInt(toWei(amount, decimals).toString());

  const customAssetSids = await getSidsForAsset(pkey, derivedAssetCode);
  console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);

  const [cAssetSidOne, cAssetSidTwo] = customAssetSids;

  const customAssetCommitmentsList = await barToAbar([cAssetSidOne, cAssetSidTwo]);

  const fraAssetSids = await getSidsForAsset(pkey, fraCode);
  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;

  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne]);
  const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo, fAssetSidThree]);

  // const atxoSendList = await TripleMasking.getSendAtxo(
  //   assetCode,
  //   amountToSend,
  //   givenCommitmentsList,
  //   anonKeysSender,
  // );
  // console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList); // const givenCommitmentToTransfer = 'ePe-5CbvvSFrddkd3FzN6MPz5QvDOGuw1-THyti4OUE='; // 3.15 TEST1A (sid 11)

  // const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
  const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of givenCommitmentsListSender) {
    const balancesCommitment = await TripleMasking.getBalance(anonKeysSender, [givenCommitment]);
    console.log(
      '🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used',
      balancesCommitment,
    );
    const ownedAbarsResponseTwo = await TripleMasking.getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '0.5',
    additionalOwnedAbarItems,
  );

  console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  console.log('transfer abar result handle!!', resultHandle);

  console.log(
    `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('now checking balances\n\n\n');

  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  console.log(
    '🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver',
    retrivedCommitmentsListReceiver,
  );
  console.log(
    '🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender',
    givenCommitmentsListSender,
  );

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
  console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
};

const abarToAbarCustomOneFraAtxoForFee = async () => {
  const anonKeysSender = { ...myAbarAnonKeys };

  const anonKeysReceiver = {
    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
    axfrSpendKey:
      'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
  };

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  await createTestBars(pkey);
  await createTestBarsMulti(pkey, assetCode, derivedAssetCode);

  // const amount = '26';
  // const asset = await Asset.getAssetDetails(derivedAssetCode);
  // const decimals = asset.assetRules.decimals;
  // const amountToSend = BigInt(toWei(amount, decimals).toString());

  const customAssetSids = await getSidsForAsset(pkey, derivedAssetCode);
  console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);

  const [cAssetSidOne, cAssetSidTwo] = customAssetSids;

  const customAssetCommitmentsList = await barToAbar([cAssetSidOne, cAssetSidTwo]);

  const fraAssetSids = await getSidsForAsset(pkey, fraCode);
  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;

  const fraAssetCommitmentsList = await barToAbar([fAssetSidOne]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo, fAssetSidThree]);

  // const atxoSendList = await TripleMasking.getSendAtxo(
  //   assetCode,
  //   amountToSend,
  //   givenCommitmentsList,
  //   anonKeysSender,
  // );
  // console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList); // const givenCommitmentToTransfer = 'ePe-5CbvvSFrddkd3FzN6MPz5QvDOGuw1-THyti4OUE='; // 3.15 TEST1A (sid 11)

  const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
  // const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of givenCommitmentsListSender) {
    const balancesCommitment = await TripleMasking.getBalance(anonKeysSender, [givenCommitment]);
    console.log(
      '🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used',
      balancesCommitment,
    );
    const ownedAbarsResponseTwo = await TripleMasking.getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '0.5',
    additionalOwnedAbarItems,
  );

  console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  console.log('transfer abar result handle!!', resultHandle);

  console.log(
    `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('now checking balances\n\n\n');

  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  console.log(
    '🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver',
    retrivedCommitmentsListReceiver,
  );
  console.log(
    '🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender',
    givenCommitmentsListSender,
  );

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
  console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
};

const abarToAbarCustomMultipleFraAtxoForFee = async () => {
  const anonKeysSender = { ...myAbarAnonKeys };

  const anonKeysReceiver = {
    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
    axfrSpendKey:
      'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
  };

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const fraCode = await Asset.getFraAssetCode();
  const assetCode = await Asset.getRandomAssetCode();
  const derivedAssetCode = await Asset.getDerivedAssetCode(assetCode);

  await createTestBars(pkey);
  await createTestBarsMulti(pkey, assetCode, derivedAssetCode);

  // const amount = '26';
  // const asset = await Asset.getAssetDetails(derivedAssetCode);
  // const decimals = asset.assetRules.decimals;
  // const amountToSend = BigInt(toWei(amount, decimals).toString());

  const customAssetSids = await getSidsForAsset(pkey, derivedAssetCode);
  console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);

  const [cAssetSidOne, cAssetSidTwo] = customAssetSids;

  const customAssetCommitmentsList = await barToAbar([cAssetSidOne, cAssetSidTwo]);

  const fraAssetSids = await getSidsForAsset(pkey, fraCode);
  const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;

  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne]);
  const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidTwo]);
  // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo, fAssetSidThree]);

  // const atxoSendList = await TripleMasking.getSendAtxo(
  //   assetCode,
  //   amountToSend,
  //   givenCommitmentsList,
  //   anonKeysSender,
  // );
  // console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList); // const givenCommitmentToTransfer = 'ePe-5CbvvSFrddkd3FzN6MPz5QvDOGuw1-THyti4OUE='; // 3.15 TEST1A (sid 11)

  const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
  // const givenCommitmentsListSender = [...fraAssetCommitmentsList];

  const additionalOwnedAbarItems = [];

  for (let givenCommitment of givenCommitmentsListSender) {
    const balancesCommitment = await TripleMasking.getBalance(anonKeysSender, [givenCommitment]);
    console.log(
      '🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used',
      balancesCommitment,
    );
    const ownedAbarsResponseTwo = await TripleMasking.getOwnedAbars(givenCommitment);

    const [additionalOwnedAbarItem] = ownedAbarsResponseTwo;

    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
  }

  const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
    anonKeysSender,
    anonKeysReceiver.axfrPublicKey,
    '0.5',
    additionalOwnedAbarItems,
  );

  console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));

  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);

  console.log('transfer abar result handle!!', resultHandle);

  console.log(
    `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
  );

  await sleep(waitingTimeBeforeCheckTxStatus);

  console.log('now checking balances\n\n\n');

  const { commitmentsMap } = abarToAbarData;

  const retrivedCommitmentsListReceiver = [];

  for (const commitmentsMapEntry of commitmentsMap) {
    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;

    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
      givenCommitmentsListSender.push(commitmentKey);
    }

    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
      retrivedCommitmentsListReceiver.push(commitmentKey);
    }
  }

  console.log(
    '🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver',
    retrivedCommitmentsListReceiver,
  );
  console.log(
    '🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender',
    givenCommitmentsListSender,
  );

  const balancesSender = await TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
  console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);

  const balancesReceiver = await TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
  console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
};

const abarToBar = async () => {
  const password = '1234';

  const pkey = PKEY_MINE;

  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

  const anonKeysSender = {
    axfrPublicKey: 'T_0kQOWEToeg53Q8dS8eej91sJKVBEV2f7rs7Btz5CY=',
    axfrSpendKey: 'HVdrTiyyL6dFBqq7HvPjYgACG1eIF6-pgvc-OomswAhP_SRA5YROh6DndDx1Lx56P3WwkpUERXZ_uuzsG3PkJg==',
    axfrViewKey: '',
  };

  const givenCommitmentOne = 'yUUf9lK7V-7t36rk1_2Omsl11hi_CJe4VNExbcXuiTQ=';

  const ownedAbarsResponseOne = await TripleMasking.getOwnedAbars(givenCommitmentOne);

  const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;
  console.log('🚀 ~ file: run.ts ~ line 1396 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);

  const { transactionBuilder, abarToBarData, receiverWalletInfo } = await TripleMasking.abarToBar(
    anonKeysSender,
    walletInfo,
    [ownedAbarToUseAsSource],
  );

  console.log('🚀 ~ file: run.ts ~ line 1413 ~ abarToBar ~ abarToBarData', abarToBarData);
  console.log('🚀 ~ file: run.ts ~ line 1413 ~ abarToBar ~ receiverWalletInfo', receiverWalletInfo);

  const resultHandle = await Transaction.submitTransaction(transactionBuilder);

  console.log('abar to bar result handle!!!', resultHandle);
};

const getAnonTxList = async () => {
  // anon wallet 1
  const anonKeysSender = {
    axfrPublicKey: 'oDosEZB9uq4joxcM6xE993XHdSwBs90z2DEzg7QzSus=',
    axfrSpendKey: 'Gsppgb5TA__Lsry9TMe9hBZdn_VOU4FS1oCaHrdLHQCgOiwRkH26riOjFwzrET33dcd1LAGz3TPYMTODtDNK6w==',
    axfrViewKey: '',
  };

  // Anon Walet 2
  // const anonKeysSender = {
  //   axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
  //   axfrSecretKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
  //   decKey: '8Fuq0EdUlv9IwULCuU5eao9SzkVGEe8rWPoDIuJiEVw=',
  //   encKey: 'cWQG_4BMhKZ_hmsnfY4JyHDWCT4pF6OMz4sHlkzEzG8=',
  //   name: 'AnonWallet2',
  // };

  const subject = '2faWWWW8QyXCnpvzX5tADsgSUiRZc55KCPd1ttPfrF7E'; // 9.98 spent - a1
  // const subject = '3cPUB1No27iS1vCXeik53gnxQVwpU6iZPX5mywx68A8G'; // 9.98 - a2?

  // '2faWWWW8QyXCnpvzX5tADsgSUiRZc55KCPd1ttPfrF7E', // 9.98 spent - a1
  // const subject = '4P1iTuvWEFiM8Hfethb8CvuBMC6NncwsB7Je7MdziAwr'; // spent commitment
  // const subject = 'BQ9eqeQVJowbtiUs7C3nXgvzytgGq2ZviKuTL7Gqe2zi'; // spent commitment

  // const hashes = [subject];
  // const txList = await Transaction.getAnonTxList(hashes, 'to');

  const hashes = await TripleMasking.getNullifierHashesFromCommitments(anonKeysSender, [subject]);
  const txList = await Transaction.getAnonTxList(hashes, 'from');

  console.log('🚀 ~ file: run.ts ~ line 1516 ~ getAnonTxList ~ hashes', hashes);

  console.log('!anon txList!', JSON.stringify(txList, null, 2));
  // console.log('!anon txList', txList);
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

const testBlockWait = async () => {
  // const result = await waitForBlockChange(2);
  // log('🚀 ~ file: run.ts ~ line 2126 ~ testBlockWait ~ result', result);
  const anonKeys1 = await TMI.getAnonKeys();
  const walletInfo = await TMI.createNewKeypair();
  const senderOne = walletInfo.privateStr!;
  const resultS = await TMI.createTestBars(senderOne);
  const result = await TMI.abarToBar(senderOne, anonKeys1);
  console.log('🚀 ~ file: run.ts ~ line 2133 ~ testBlockWait ~ result', result);
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

// approveToken();

// testIt();
// getFraBalance();
// getAnonKeys(); // +
// createTestBars();
// barToAbar(); // ++
// getUnspentAbars(); // +
// getAbarBalance(); // +
// getFee();
// abarToAbar(); // ++
// abarToBar(); // +
// validateUnspent(); // +
// getCustomAssetBala9r8HN7YmJdg4mcbBRnBAiq5vu1cHaBDE49dnKamGbmbX);
// defineCustomAsset();
// issueCustomAsset();
// getStateCommitment();
// getValidatorList();
// getDelegateInfo();
// getTransferBuilderOperation();
// createNewKeypair();
// transferFraToSingleRecepient();
// transferFraToSingleAddress();
// transferFraToMultipleRecepients();
// transferCustomAssetToSingleRecepient();
// transferCustomAssetToMultipleRecepients();
// getCustomAssetDetails();
// getTransactionStatus();
// getBlockDetails();
// delegateFraTransactionSubmit();
// delegateFraTransactionAiindClaimRewards();
// unstakeFraTransactionSubmit();
// sendEvmToAccount();
// ethProtocol();
// myFunc16(); // tx list
// getAnonTxList();

// testTransferToYourself();

// 1. PASSING: this one is passing
// abarToAbarFraOneFraAtxoForFee();

// 2. PASSING: this one has multiple fra atxo (two) and it is failing
// abarToAbarFraMultipleFraAtxoForFee();

// 3. PASSING: this one is also passing (it has only one fra atxo)
// abarToAbarCustomOneFraAtxoForFee();

// 4. PASSING: this one has multiple fra txo and it is also failing
// abarToAbarCustomMultipleFraAtxoForFee();

testBlockWait();
