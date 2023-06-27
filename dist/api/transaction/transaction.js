"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxnListByPrism = exports.getTxnListByStakingUnDelegation = exports.getTxnListByStaking = exports.getTxnList = exports.sendToPublicKey = exports.sendToAddressV2 = exports.sendToAddress = exports.submitAbarTransaction = exports.submitTransaction = exports.sendToManyV2 = exports.sendToMany = void 0;
const bigNumber_1 = require("../../services/bigNumber");
const Fee = __importStar(require("../../services/fee"));
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const keypair_1 = require("../keypair");
const Network = __importStar(require("../network"));
const AssetApi = __importStar(require("../sdkAsset"));
const Builder = __importStar(require("./builder"));
const helpers = __importStar(require("./helpers"));
const processor_1 = require("./processor");
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
const sendToMany = (walletInfo, recieversList, assetCode, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const asset = yield AssetApi.getAssetDetails(assetCode);
    const decimals = asset.assetRules.decimals;
    const recieversInfo = [];
    recieversList.forEach(reciver => {
        const { reciverWalletInfo: toWalletInfo, amount } = reciver;
        const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
        const utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
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
        const minimalFee = yield AssetApi.getMinimalFee();
        const toPublickey = yield AssetApi.getFraPublicKey();
        const feeRecieverInfoItem = {
            utxoNumbers: minimalFee,
            toPublickey,
        };
        recieversInfo.push(feeRecieverInfoItem);
    }
    const transferOperationBuilder = yield Fee.buildTransferOperation(walletInfo, recieversInfo, assetCode);
    let receivedTransferOperation;
    try {
        receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
    }
    catch (error) {
        const e = error;
        console.log('Full error (main)', error);
        throw new Error(`Could not create transfer operation (main), Error: "${e}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
    }
    if (!isFraTransfer) {
        const transferOperationBuilderFee = yield Fee.buildTransferOperationWithFee(walletInfo);
        let receivedTransferOperationFee;
        try {
            receivedTransferOperationFee = transferOperationBuilderFee
                .create()
                .sign(walletInfo.keypair)
                .transaction();
        }
        catch (error) {
            const e = error;
            throw new Error(`Could not create transfer operation for fee, Error: "${e.message}"`);
        }
        try {
            transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
        }
        catch (err) {
            const e = err;
            throw new Error(`Could not add transfer operation for fee, Error: "${e.message}"`);
        }
    }
    try {
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
    }
    // try {
    //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    // } catch (err) {
    //   const e: Error = err as Error;
    //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
    // }
    return transactionBuilder;
});
exports.sendToMany = sendToMany;
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
const sendToManyV2 = (walletInfo, recieversList, assetCode, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const asset = yield AssetApi.getAssetDetails(assetCode);
    const decimals = asset.assetRules.decimals;
    const minimalFee = yield AssetApi.getMinimalFee();
    const toPublickey = yield AssetApi.getFraPublicKey();
    const fraAssetCode = ledger.fra_get_asset_code();
    const isFraTransfer = assetCode === fraAssetCode;
    const recieversInfo = {};
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
        const utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
        const recieverInfoItem = {
            toPublickey,
            utxoNumbers,
            assetBlindRules,
        };
        recieversInfo[assetCode].push(recieverInfoItem);
    });
    const transferOperationBuilder = yield Fee.buildTransferOperationV2(walletInfo, recieversInfo);
    let receivedTransferOperation = '';
    try {
        receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not create transfer operation (main), Error: "${e.message}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not sign transfer operation, Error: "${e.message}"`);
    }
    // try {
    //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    // } catch (err) {
    //   const e: Error = err as Error;
    //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
    // }
    return transactionBuilder;
});
exports.sendToManyV2 = sendToManyV2;
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
const submitTransaction = (transactionBuilder) => __awaiter(void 0, void 0, void 0, function* () {
    const submitData = transactionBuilder.transaction();
    console.log(submitData);
    let result;
    try {
        result = yield Network.submitTransaction(submitData);
    }
    catch (err) {
        const e = err;
        console.log('network sumbit error', err);
        throw new Error(`Error Could not submit transaction: "${e.message}"`);
    }
    const { response: handle, error: submitError } = result;
    if (submitError) {
        console.log('sumbit tx error', submitError);
        throw new Error(`Could not submit transaction: "${submitError.message}"`);
    }
    if (!handle) {
        throw new Error(`Handle is missing. Could not submit transaction - submit handle is missing`);
    }
    return handle;
});
exports.submitTransaction = submitTransaction;
const submitAbarTransaction = (anonTransferOperationBuilder) => __awaiter(void 0, void 0, void 0, function* () {
    const submitData = anonTransferOperationBuilder.transaction();
    let result;
    try {
        result = yield Network.submitTransaction(submitData);
    }
    catch (err) {
        const e = err;
        throw new Error(`Error Could not submit abar transaction: "${e.message}"`);
    }
    const { response: handle, error: submitError } = result;
    if (submitError) {
        throw new Error(`Could not submit abar transaction: "${submitError.message}"`);
    }
    if (!handle) {
        throw new Error(`Handle is missing. Could not submit abar transaction - submit handle is missing`);
    }
    return handle;
});
exports.submitAbarTransaction = submitAbarTransaction;
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
const sendToAddress = (walletInfo, address, amount, assetCode, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const toWalletInfoLight = yield (0, keypair_1.getAddressPublicAndKey)(address);
    const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];
    return (0, exports.sendToMany)(walletInfo, recieversInfo, assetCode, assetBlindRules);
});
exports.sendToAddress = sendToAddress;
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
const sendToAddressV2 = (walletInfo, address, amount, assetCode, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const toWalletInfoLight = yield (0, keypair_1.getAddressPublicAndKey)(address);
    const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];
    return (0, exports.sendToManyV2)(walletInfo, recieversInfo, assetCode, assetBlindRules);
});
exports.sendToAddressV2 = sendToAddressV2;
const sendToPublicKey = (walletInfo, publicKey, amount, assetCode, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield (0, keypair_1.getAddressByPublicKey)(publicKey);
    return (0, exports.sendToAddress)(walletInfo, address, amount, assetCode, assetBlindRules);
});
exports.sendToPublicKey = sendToPublicKey;
const getTxnList = (address, type, page = 1, per_page = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const dataResult = yield Network.getTxList(address, type, page, per_page);
    if (!dataResult.response) {
        throw new Error('Could not fetch a list of transactions. No response from the server.');
    }
    const txList = helpers.getTxListFromResponse(dataResult);
    if (!txList) {
        throw new Error('Could not get a list of transactions from the server response.');
    }
    const processedTxList = yield (0, processor_1.processeTxInfoList)(txList);
    return {
        page: dataResult.response.data.page,
        total: dataResult.response.data.total,
        page_size: dataResult.response.data.page_size,
        txs: processedTxList,
    };
});
exports.getTxnList = getTxnList;
const getTxnListByStaking = (address, type = 'claim', page = 1, per_page = 10) => __awaiter(void 0, void 0, void 0, function* () {
    if (type == 'delegation') {
        const dataResult = yield Network.getTxListByStakingDelegation(address, page, per_page);
        if (!dataResult.response) {
            throw new Error('Could not fetch a list of transactions. No response from the server.');
        }
        return dataResult.response.data;
    }
    const dataResult = yield Network.getTxListByClaim(address, page, per_page);
    if (!dataResult.response) {
        throw new Error('Could not fetch a list of transactions. No response from the server.');
    }
    return dataResult.response.data;
});
exports.getTxnListByStaking = getTxnListByStaking;
const getTxnListByStakingUnDelegation = (address, page = 1, per_page = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const dataResult = yield Network.getTxListByStakingUnDelegation(address, page, per_page);
    if (!dataResult.response) {
        throw new Error('Could not fetch a list of transactions. No response from the server.');
    }
    return dataResult.response.data;
});
exports.getTxnListByStakingUnDelegation = getTxnListByStakingUnDelegation;
const getTxnListByPrism = (address, type = 'send', page = 1, per_page = 10) => __awaiter(void 0, void 0, void 0, function* () {
    if (type == 'receive') {
        const dataResult = yield Network.getTxListByPrismReceive(address, page, per_page);
        if (!dataResult.response) {
            throw new Error('Could not fetch a list of transactions. No response from the server.');
        }
        const items = dataResult.response.data.items.map(item => {
            return Object.assign(Object.assign({}, item), { data: JSON.parse(atob(item.data)) });
        });
        return dataResult.response.data;
    }
    const dataResult = yield Network.getTxListByPrismSend(address, page, per_page);
    if (!dataResult.response) {
        throw new Error('Could not fetch a list of transactions. No response from the server.');
    }
    return dataResult.response.data;
});
exports.getTxnListByPrism = getTxnListByPrism;
//# sourceMappingURL=transaction.js.map