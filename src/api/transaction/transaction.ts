import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder, TransferOperationBuilder } from '../../services/ledger/types';
import { LightWalletKeypair, WalletKeypar, getAddressByPublicKey, getAddressPublicAndKey } from '../keypair';
import * as Network from '../network';
import * as AssetApi from '../sdkAsset';
import * as Builder from './builder';
import * as helpers from './helpers';
import { processeTxInfoList } from './processor';
import {
  IPrismData,
  ProcessedTxListByPrismResponseResult,
  ProcessedTxListByStakingResponseResult,
  ProcessedTxListByStakingUnDelagtionResponseResult,
  ProcessedTxListResponseResult,
} from './types';

export interface TransferReciever {
  reciverWalletInfo: WalletKeypar | LightWalletKeypair;
  amount: string;
}

/**
 * Send some asset to multiple receivers
 *
 * @remarks
 * Using this function, user can transfer perform multiple transfers of the same asset to multiple receivers using different amounts
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 * const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
 * const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);
 *
 * const assetCode = await Asset.getFraAssetCode();
 *
 * const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };
 *
 * const recieversInfo = [
 *  { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
 *  { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
 * ];
 *
 * const transactionBuilder = await Transaction.sendToMany(
 *  walletInfo,
 *  recieversInfo,
 *  assetCode,
 *  assetBlindRules,
 * );
 *
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @throws `Could not create transfer operation (main)`
 * @throws `Could not get transactionBuilder from "getTransactionBuilder"`
 * @throws `Could not add transfer operation`
 * @throws `Could not create transfer operation for fee`
 * @throws `Could not add transfer operation for fee`
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const sendToMany = async (
  walletInfo: WalletKeypar,
  recieversList: TransferReciever[],
  assetCode: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;

  const recieversInfo: Fee.ReciverInfo[] = [];

  recieversList.forEach(reciver => {
    const { reciverWalletInfo: toWalletInfo, amount } = reciver;
    const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
    const utxoNumbers = BigInt(toWei(amount, decimals).toString());

    const recieverInfoItem = {
      toPublickey,
      utxoNumbers,
      assetBlindRules,
    };

    recieversInfo.push(recieverInfoItem);
  });

  const fraAssetCode = ledger.fra_get_asset_code();

  const isFraTransfer = assetCode === fraAssetCode;

  if (isFraTransfer) {
    const minimalFee = await AssetApi.getMinimalFee();
    const toPublickey = await AssetApi.getFraPublicKey();

    const feeRecieverInfoItem = {
      utxoNumbers: minimalFee,
      toPublickey,
    };

    recieversInfo.push(feeRecieverInfoItem);
  }

  const transferOperationBuilder = await Fee.buildTransferOperation(walletInfo, recieversInfo, assetCode);

  let receivedTransferOperation;

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (error) {
    const e: Error = error as Error;

    console.log('Full error (main)', error);

    throw new Error(`Could not create transfer operation (main), Error: "${e}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  if (!isFraTransfer) {
    const transferOperationBuilderFee = await Fee.buildTransferOperationWithFee(walletInfo);

    let receivedTransferOperationFee;

    try {
      receivedTransferOperationFee = transferOperationBuilderFee
        .create()
        .sign(walletInfo.keypair)
        .transaction();
    } catch (error) {
      const e: Error = error as Error;

      throw new Error(`Could not create transfer operation for fee, Error: "${e.message}"`);
    }

    try {
      transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
    } catch (err) {
      const e: Error = err as Error;

      throw new Error(`Could not add transfer operation for fee, Error: "${e.message}"`);
    }
  }

  try {
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
  }

  // try {
  //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
  // } catch (err) {
  //   const e: Error = err as Error;

  //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
  // }

  return transactionBuilder;
};

/**
 * Send some asset to multiple receivers
 *
 * @remarks
 * Using this function, user can transfer perform multiple transfers of the same asset to multiple receivers using different amounts
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 * const toWalletInfoMine2 = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
 * const toWalletInfoMine3 = await Keypair.restoreFromPrivateKey(toPkeyMine3, password);
 *
 * const assetCode = await Asset.getFraAssetCode();
 *
 * const assetBlindRules: Asset.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };
 *
 * const recieversInfo = [
 *  { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
 *  { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
 * ];
 *
 * const transactionBuilder = await Transaction.sendToMany(
 *  walletInfo,
 *  recieversInfo,
 *  assetCode,
 *  assetBlindRules,
 * );
 *
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @throws `Could not create transfer operation (main)`
 * @throws `Could not get transactionBuilder from "getTransactionBuilder"`
 * @throws `Could not add transfer operation`
 * @throws `Could not create transfer operation for fee`
 * @throws `Could not add transfer operation for fee`
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const sendToManyV2 = async (
  walletInfo: WalletKeypar,
  recieversList: TransferReciever[],
  assetCode: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;

  const minimalFee = await AssetApi.getMinimalFee();
  const toPublickey = await AssetApi.getFraPublicKey();

  const fraAssetCode = ledger.fra_get_asset_code();
  const isFraTransfer = assetCode === fraAssetCode;

  const recieversInfo: Fee.ReciverInfoV2 = {};

  recieversInfo[fraAssetCode] = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
    },
  ];

  if (!isFraTransfer) {
    recieversInfo[assetCode] = [];
  }

  recieversList.forEach(reciver => {
    const { reciverWalletInfo: toWalletInfo, amount } = reciver;
    const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
    const utxoNumbers = BigInt(toWei(amount, decimals).toString());

    const recieverInfoItem = {
      toPublickey,
      utxoNumbers,
      assetBlindRules,
    };

    recieversInfo[assetCode].push(recieverInfoItem);
  });

  const transferOperationBuilder = await Fee.buildTransferOperationV2(walletInfo, recieversInfo);

  let receivedTransferOperation = '';

  try {
    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not create transfer operation (main), Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
  }

  // try {
  //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
  // } catch (err) {
  //   const e: Error = err as Error;

  //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
  // }

  return transactionBuilder;
};

/**
 * Submits a transaction
 *
 * @remarks
 * The next step after creating a transaction is submitting it to the ledger, and, as a response, we retrieve the transaction handle.
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 * // First, we create a transaction builder
 * const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
 *
 * // Then, we submit a transaction
 * // If succcesful, the response of the submit transaction request will return a handle that can be used the query the status of the transaction.
 * const handle = await Transaction.submitTransaction(assetBuilder);
 * ```
 * @throws `Error Could not submit transaction`
 * @throws `Could not submit transaction`
 * @throws `Handle is missing. Could not submit transaction`
 *
 * @returns Transaction status handle
 */
export const submitTransaction = async (transactionBuilder: TransactionBuilder): Promise<string> => {
  const submitData = transactionBuilder.transaction();
  console.log(submitData);

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Error Could not submit transaction: "${e.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Handle is missing. Could not submit transaction - submit handle is missing`);
  }

  return handle;
};

/**
 * Send some asset to an address
 *
 * @remarks
 * Using this function, user can transfer some amount of given asset to another address
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
 *
 *  const assetCode = await Asset.getFraAssetCode();
 *
 *  const assetBlindRules: Asset.AssetBlindRules = {
 *    isTypeBlind: false,
 *    isAmountBlind: false
 *  };
 *
 *  const transactionBuilder = await Transaction.sendToAddress(
 *    walletInfo,
 *    toWalletInfo.address,
 *    '2',
 *    assetCode,
 *    assetBlindRules,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const sendToAddress = async (
  walletInfo: WalletKeypar,
  address: string,
  amount: string,
  assetCode: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  const toWalletInfoLight = await getAddressPublicAndKey(address);

  const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];

  return sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules);
};

/**
 * Send some asset to an address
 *
 * @remarks
 * Using this function, user can transfer some amount of given asset to another address
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *  const toWalletInfo = await Keypair.restoreFromPrivateKey(toPkeyMine2, password);
 *
 *  const assetCode = await Asset.getFraAssetCode();
 *
 *  const assetBlindRules: Asset.AssetBlindRules = {
 *    isTypeBlind: false,
 *    isAmountBlind: false
 *  };
 *
 *  const transactionBuilder = await Transaction.sendToAddress(
 *    walletInfo,
 *    toWalletInfo.address,
 *    '2',
 *    assetCode,
 *    assetBlindRules,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const sendToAddressV2 = async (
  walletInfo: WalletKeypar,
  address: string,
  amount: string,
  assetCode: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  const toWalletInfoLight = await getAddressPublicAndKey(address);

  const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];

  return sendToManyV2(walletInfo, recieversInfo, assetCode, assetBlindRules);
};

export const sendToPublicKey = async (
  walletInfo: WalletKeypar,
  publicKey: string,
  amount: string,
  assetCode: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  const address = await getAddressByPublicKey(publicKey);

  return sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules);
};

export const getTxnList = async (
  address: string,
  type: 'from' | 'to',
  page = 1,
  per_page = 10,
): Promise<ProcessedTxListResponseResult> => {
  const dataResult = await Network.getTxList(address, type, page, per_page);

  if (!dataResult.response) {
    throw new Error('Could not fetch a list of transactions. No response from the server.');
  }

  const txList = helpers.getTxListFromResponse(dataResult);

  if (!txList) {
    throw new Error('Could not get a list of transactions from the server response.');
  }

  const processedTxList = await processeTxInfoList(txList);

  return {
    page: dataResult.response.data.page,
    total: dataResult.response.data.total,
    page_size: dataResult.response.data.page_size,
    txs: processedTxList,
  };
};

export const getTxnListByStaking = async (
  address: string,
  type: 'claim' | 'delegation' | 'unDelegation' = 'claim',
  page = 1,
  per_page = 10,
): Promise<ProcessedTxListByStakingResponseResult> => {
  if (type == 'delegation') {
    const dataResult = await Network.getTxListByStakingDelegation(address, page, per_page);

    if (!dataResult.response) {
      throw new Error('Could not fetch a list of transactions. No response from the server.');
    }

    return dataResult.response.data;
  }
  const dataResult = await Network.getTxListByClaim(address, page, per_page);

  if (!dataResult.response) {
    throw new Error('Could not fetch a list of transactions. No response from the server.');
  }

  return dataResult.response.data;
};

export const getTxnListByStakingUnDelegation = async (
  address: string,
  page = 1,
  per_page = 10,
): Promise<ProcessedTxListByStakingUnDelagtionResponseResult> => {
  const dataResult = await Network.getTxListByStakingUnDelegation(address, page, per_page);

  if (!dataResult.response) {
    throw new Error('Could not fetch a list of transactions. No response from the server.');
  }

  return dataResult.response.data;
};

export const getTxnListByPrism = async (
  address: string,
  type: 'send' | 'receive' = 'send',
  page = 1,
  per_page = 10,
): Promise<ProcessedTxListByPrismResponseResult> => {
  if (type == 'receive') {
    const dataResult = await Network.getTxListByPrismReceive(address, page, per_page);

    if (!dataResult.response) {
      throw new Error('Could not fetch a list of transactions. No response from the server.');
    }

    const items = dataResult.response.data.items.map(item => {
      return { ...item, data: JSON.parse(atob(item.data)) as IPrismData };
    });

    return dataResult.response.data;
  }

  const dataResult = await Network.getTxListByPrismSend(address, page, per_page);

  if (!dataResult.response) {
    throw new Error('Could not fetch a list of transactions. No response from the server.');
  }

  return dataResult.response.data;
};

type OperationType = 'deploy' | 'mint' | 'transfer';

export const brc20 = async (wallet: WalletKeypar, op: OperationType = 'deploy', tick: string) => {
  console.log(op);
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();
  const recieversInfo: Fee.ReciverInfo[] = [];

  const minimalFee = await AssetApi.getMinimalFee();
  const toPublickey = await AssetApi.getFraPublicKey();

  const feeRecieverInfoItem = {
    utxoNumbers: minimalFee,
    toPublickey,
  };
  recieversInfo.push(feeRecieverInfoItem);

  const transferOperationBuilder = await Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode);
  let receivedTransferOperation = '';

  // deploy
  const brc20Memo = `{"p":"brc-20","op":"deploy","tick":"${tick}","max":"21000000","lim":"1000"}`;
  // mint:      '{"p":"brc-20","op":"mint","tick":"ordi","amt":"1000"}'
  // transfer:  '{"p":"brc-20","op":"transfer","tick":"ordi","amt":"1000"}'

  try {
    switch (op) {
      case 'deploy':
        receivedTransferOperation = transferOperationBuilder
          .add_output_no_tracing(
            BigInt(0),
            ledger.public_key_from_base64(wallet.publickey),
            fraAssetCode,
            false,
            false,
            brc20Memo,
          )
          .create()
          .sign(wallet.keypair)
          .transaction();
        break;
    }
  } catch (error) {
    const e: Error = error as Error;

    console.log('Full error (main)', error);

    throw new Error(`Could not create transfer operation (main), Error: "${e}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.sign(wallet.keypair);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
  }

  return transactionBuilder;
};

/// refactored and code split below

// next 3 methods are very similar , the only difference is the brc20Memo, but i keep those separately
// since we might have the wasm methods / order changed. we might need to refactor those later
export const getBrc20DeployBuilder = async (
  wallet: WalletKeypar,
  tick: string,
  max: number,
  lim: number,
  transferOperationBuilder: TransferOperationBuilder,
) => {
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();

  // deploy
  const brc20Memo = `{"p":"brc-20","op":"deploy","tick":"${tick}","max":"${max}","lim":"${lim}"}`;

  try {
    const receivedTransferOperation = transferOperationBuilder
      .add_output_no_tracing(
        BigInt(0),
        ledger.public_key_from_base64(wallet.publickey),
        fraAssetCode,
        false,
        false,
        brc20Memo,
      )
      .create()
      .sign(wallet.keypair)
      .transaction();

    return receivedTransferOperation;
  } catch (error) {
    const e: Error = error as Error;

    console.log('Full error (main)', error);

    throw new Error(`Could not create transfer operation (deploy), Error: "${e}"`);
  }
};

export const getBrc20MintBuilder = async (
  wallet: WalletKeypar,
  tick: string,
  amount: string,
  transferOperationBuilder: TransferOperationBuilder,
) => {
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();

  // mint:      '{"p":"brc-20","op":"mint","tick":"ordi","amt":"1000"}'
  const brc20Memo = `{"p":"brc-20","op":"mint","tick":"${tick}","amt":"${amount}"}`;

  try {
    const receivedTransferOperation = transferOperationBuilder
      .add_output_no_tracing(
        BigInt(0),
        ledger.public_key_from_base64(wallet.publickey),
        fraAssetCode,
        false,
        false,
        brc20Memo,
      )
      .create()
      .sign(wallet.keypair)
      .transaction();

    return receivedTransferOperation;
  } catch (error) {
    const e: Error = error as Error;

    console.log('Full error (main)', error);

    throw new Error(`Could not create transfer operation (mint), Error: "${e}"`);
  }
};

export const getBrc20TransferBuilder = async (
  wallet: WalletKeypar,
  tick: string,
  amount: string,
  transferOperationBuilder: TransferOperationBuilder,
) => {
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();

  // transfer:  '{"p":"brc-20","op":"transfer","tick":"ordi","amt":"1000"}'
  const brc20Memo = `{"p":"brc-20","op":"transfer","${tick}":"ordi","amt":"${amount}"}`;

  try {
    const receivedTransferOperation = transferOperationBuilder
      .add_output_no_tracing(
        BigInt(0),
        ledger.public_key_from_base64(wallet.publickey),
        fraAssetCode,
        false,
        false,
        brc20Memo,
      )
      .create()
      .sign(wallet.keypair)
      .transaction();

    return receivedTransferOperation;
  } catch (error) {
    const e: Error = error as Error;

    console.log('Full error (main)', error);

    throw new Error(`Could not create transfer operation (transfer), Error: "${e}"`);
  }
};

export const getBrc20TransactionBuilder = async (wallet: WalletKeypar, receivedTransferOperation: string) => {
  let transactionBuilder;

  try {
    transactionBuilder = await Builder.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.sign(wallet.keypair);
  } catch (err) {
    const e: Error = err as Error;

    throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
  }

  return transactionBuilder;
};

type DeployParams = {
  tick: string;
  max: number;
  lim: number;
};

// next 3 methods will be exposed to the wallet to use
export const brc20Deploy = async (wallet: WalletKeypar, params: DeployParams) => {
  // we might need to revisit the highlighted part as the fee is identical for all 3 methods,
  // (at leeast for now) and extract it into the helper function
  // --- begin
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();
  const recieversInfo: Fee.ReciverInfo[] = [];

  const minimalFee = await AssetApi.getMinimalFee();
  const toPublickey = await AssetApi.getFraPublicKey();

  const feeRecieverInfoItem = {
    utxoNumbers: minimalFee,
    toPublickey,
  };

  recieversInfo.push(feeRecieverInfoItem);
  // --- end

  const transferOperationBuilder = await Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode);

  const receivedTransferOperation = await getBrc20DeployBuilder(
    wallet,
    params.tick,
    params.max,
    params.lim,
    transferOperationBuilder,
  );

  const transactionBuilder = getBrc20TransactionBuilder(wallet, receivedTransferOperation);

  return transactionBuilder;
};

export const brc20Mint = async (wallet: WalletKeypar, tick: string, amount: string) => {
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();
  const recieversInfo: Fee.ReciverInfo[] = [];

  const minimalFee = await AssetApi.getMinimalFee();
  const toPublickey = await AssetApi.getFraPublicKey();

  const feeRecieverInfoItem = {
    utxoNumbers: minimalFee,
    toPublickey,
  };

  recieversInfo.push(feeRecieverInfoItem);

  const transferOperationBuilder = await Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode);

  const receivedTransferOperation = await getBrc20MintBuilder(wallet, tick, amount, transferOperationBuilder);

  const transactionBuilder = getBrc20TransactionBuilder(wallet, receivedTransferOperation);

  return transactionBuilder;
};

export const brc20Transfer = async (wallet: WalletKeypar, tick: string, amount: string) => {
  const ledger = await getLedger();
  const fraAssetCode = ledger.fra_get_asset_code();
  const recieversInfo: Fee.ReciverInfo[] = [];

  const minimalFee = await AssetApi.getMinimalFee();
  const toPublickey = await AssetApi.getFraPublicKey();

  const feeRecieverInfoItem = {
    utxoNumbers: minimalFee,
    toPublickey,
  };

  recieversInfo.push(feeRecieverInfoItem);

  const transferOperationBuilder = await Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode);

  const receivedTransferOperation = await getBrc20TransferBuilder(
    wallet,
    tick,
    amount,
    transferOperationBuilder,
  );

  const transactionBuilder = getBrc20TransactionBuilder(wallet, receivedTransferOperation);

  return transactionBuilder;
};
