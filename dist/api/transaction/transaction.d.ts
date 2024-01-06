import { TransactionBuilder, TransferOperationBuilder } from '../../services/ledger/types';
import { LightWalletKeypair, WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
import { ProcessedTxListByPrismResponseResult, ProcessedTxListByStakingResponseResult, ProcessedTxListByStakingUnDelagtionResponseResult, ProcessedTxListResponseResult } from './types';
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
export declare const sendToMany: (walletInfo: WalletKeypar, recieversList: TransferReciever[], assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
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
export declare const sendToManyV2: (walletInfo: WalletKeypar, recieversList: TransferReciever[], assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
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
export declare const submitTransaction: (transactionBuilder: TransactionBuilder) => Promise<string>;
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
export declare const sendToAddress: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
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
export declare const sendToAddressV2: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
export declare const sendToPublicKey: (walletInfo: WalletKeypar, publicKey: string, amount: string, assetCode: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
export declare const getTxnList: (address: string, type: 'from' | 'to', page?: number, per_page?: number) => Promise<ProcessedTxListResponseResult>;
export declare const getTxnListByStaking: (address: string, type?: 'claim' | 'delegation' | 'unDelegation', page?: number, per_page?: number) => Promise<ProcessedTxListByStakingResponseResult>;
export declare const getTxnListByStakingUnDelegation: (address: string, page?: number, per_page?: number) => Promise<ProcessedTxListByStakingUnDelagtionResponseResult>;
export declare const getTxnListByPrism: (address: string, type?: 'send' | 'receive', page?: number, per_page?: number) => Promise<ProcessedTxListByPrismResponseResult>;
type OperationType = 'deploy' | 'mint' | 'transfer';
export declare const brc20: (wallet: WalletKeypar, op: OperationType | undefined, tick: string) => Promise<TransactionBuilder>;
export declare const getBrc20DeployBuilder: (wallet: WalletKeypar, tick: string, transferOperationBuilder: TransferOperationBuilder) => Promise<string>;
export declare const getBrc20MintBuilder: (wallet: WalletKeypar, tick: string, amount: string, transferOperationBuilder: TransferOperationBuilder) => Promise<string>;
export declare const getBrc20TransferBuilder: (wallet: WalletKeypar, tick: string, amount: string, transferOperationBuilder: TransferOperationBuilder) => Promise<string>;
export declare const getBrc20TransactionBuilder: (wallet: WalletKeypar, receivedTransferOperation: string) => Promise<TransactionBuilder>;
export declare const brc20Deploy: (wallet: WalletKeypar, tick: string) => Promise<TransactionBuilder>;
export declare const brc20Mint: (wallet: WalletKeypar, tick: string, amount: string) => Promise<TransactionBuilder>;
export declare const brc20Transfer: (wallet: WalletKeypar, tick: string, amount: string) => Promise<TransactionBuilder>;
export {};
