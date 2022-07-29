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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnonTxList = exports.getTxList = exports.sendToPublicKey = exports.sendToAddressV2 = exports.sendToAddress = exports.submitAbarTransaction = exports.submitTransaction = exports.sendToManyV2 = exports.sendToMany = void 0;
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var keypair_1 = require("../keypair");
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
var Builder = __importStar(require("./builder"));
var helpers = __importStar(require("./helpers"));
var processor_1 = require("./processor");
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
var sendToMany = function (walletInfo, recieversList, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, asset, decimals, recieversInfo, fraAssetCode, isFraTransfer, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, error_1, e, e, transferOperationBuilderFee, receivedTransferOperationFee, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                recieversInfo = [];
                recieversList.forEach(function (reciver) {
                    var toWalletInfo = reciver.reciverWalletInfo, amount = reciver.amount;
                    var toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
                    var utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                    var recieverInfoItem = {
                        toPublickey: toPublickey,
                        utxoNumbers: utxoNumbers,
                        assetBlindRules: assetBlindRules,
                    };
                    recieversInfo.push(recieverInfoItem);
                });
                fraAssetCode = ledger.fra_get_asset_code();
                isFraTransfer = assetCode === fraAssetCode;
                if (!isFraTransfer) return [3 /*break*/, 5];
                return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 3:
                minimalFee = _a.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 4:
                toPublickey = _a.sent();
                feeRecieverInfoItem = {
                    utxoNumbers: minimalFee,
                    toPublickey: toPublickey,
                };
                recieversInfo.push(feeRecieverInfoItem);
                _a.label = 5;
            case 5: return [4 /*yield*/, Fee.buildTransferOperation(walletInfo, recieversInfo, assetCode)];
            case 6:
                transferOperationBuilder = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation (main), Error: \"".concat(e.message, "\""));
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 8:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                e = error_1;
                throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 10:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                }
                if (!!isFraTransfer) return [3 /*break*/, 12];
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo)];
            case 11:
                transferOperationBuilderFee = _a.sent();
                receivedTransferOperationFee = void 0;
                try {
                    receivedTransferOperationFee = transferOperationBuilderFee
                        .create()
                        .sign(walletInfo.keypair)
                        .transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation for fee, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation for fee, Error: \"".concat(e.message, "\""));
                }
                _a.label = 12;
            case 12:
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
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
var sendToManyV2 = function (walletInfo, recieversList, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, asset, decimals, minimalFee, toPublickey, fraAssetCode, isFraTransfer, recieversInfo, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, error_2, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 3:
                minimalFee = _a.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 4:
                toPublickey = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                isFraTransfer = assetCode === fraAssetCode;
                recieversInfo = {};
                if (isFraTransfer) {
                    recieversInfo[fraAssetCode] = [
                        {
                            utxoNumbers: minimalFee,
                            toPublickey: toPublickey,
                        },
                    ];
                }
                else {
                    recieversInfo[assetCode] = [];
                }
                recieversList.forEach(function (reciver) {
                    var toWalletInfo = reciver.reciverWalletInfo, amount = reciver.amount;
                    var toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
                    var utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                    var recieverInfoItem = {
                        toPublickey: toPublickey,
                        utxoNumbers: utxoNumbers,
                        assetBlindRules: assetBlindRules,
                    };
                    recieversInfo[assetCode].push(recieverInfoItem);
                });
                return [4 /*yield*/, Fee.buildTransferOperationV2(walletInfo, recieversInfo)];
            case 5:
                transferOperationBuilder = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation (main), Error: \"".concat(e.message, "\""));
                }
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 7:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                e = error_2;
                throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 9:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
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
var submitTransaction = function (transactionBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var submitData, result, err_1, e, handle, submitError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                submitData = transactionBuilder.transaction();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Network.submitTransaction(submitData)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                e = err_1;
                throw new Error("Error Could not submit transaction: \"".concat(e.message, "\""));
            case 4:
                handle = result.response, submitError = result.error;
                if (submitError) {
                    throw new Error("Could not submit transaction: \"".concat(submitError.message, "\""));
                }
                if (!handle) {
                    throw new Error("Handle is missing. Could not submit transaction - submit handle is missing");
                }
                return [2 /*return*/, handle];
        }
    });
}); };
exports.submitTransaction = submitTransaction;
var submitAbarTransaction = function (anonTransferOperationBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var submitData, result, err_2, e, handle, submitError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                submitData = anonTransferOperationBuilder.transaction();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Network.submitTransaction(submitData)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                e = err_2;
                throw new Error("Error Could not submit abar transaction: \"".concat(e.message, "\""));
            case 4:
                handle = result.response, submitError = result.error;
                if (submitError) {
                    throw new Error("Could not submit abar transaction: \"".concat(submitError.message, "\""));
                }
                if (!handle) {
                    throw new Error("Handle is missing. Could not submit abar transaction - submit handle is missing");
                }
                return [2 /*return*/, handle];
        }
    });
}); };
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
var sendToAddress = function (walletInfo, address, amount, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var toWalletInfoLight, recieversInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, keypair_1.getAddressPublicAndKey)(address)];
            case 1:
                toWalletInfoLight = _a.sent();
                recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount: amount }];
                return [2 /*return*/, (0, exports.sendToMany)(walletInfo, recieversInfo, assetCode, assetBlindRules)];
        }
    });
}); };
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
var sendToAddressV2 = function (walletInfo, address, amount, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var toWalletInfoLight, recieversInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, keypair_1.getAddressPublicAndKey)(address)];
            case 1:
                toWalletInfoLight = _a.sent();
                recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount: amount }];
                return [2 /*return*/, (0, exports.sendToManyV2)(walletInfo, recieversInfo, assetCode, assetBlindRules)];
        }
    });
}); };
exports.sendToAddressV2 = sendToAddressV2;
var sendToPublicKey = function (walletInfo, publicKey, amount, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, keypair_1.getAddressByPublicKey)(publicKey)];
            case 1:
                address = _a.sent();
                return [2 /*return*/, (0, exports.sendToAddress)(walletInfo, address, amount, assetCode, assetBlindRules)];
        }
    });
}); };
exports.sendToPublicKey = sendToPublicKey;
var getTxList = function (address, type, page) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult, txList, processedTxList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Network.getTxList(address, type, page, 'transparent')];
                case 1:
                    dataResult = _a.sent();
                    if (!dataResult.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    txList = helpers.getTxListFromResponse(dataResult);
                    if (!txList) {
                        throw new Error('Could not get a list of transactions from the server response.');
                    }
                    return [4 /*yield*/, (0, processor_1.processeTxInfoList)(txList)];
                case 2:
                    processedTxList = _a.sent();
                    return [2 /*return*/, {
                            total_count: dataResult.response.result.total_count,
                            txs: processedTxList,
                        }];
            }
        });
    });
};
exports.getTxList = getTxList;
var getAnonTxList = function (subjects, type, page) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var promises, results, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = subjects.map(function (subject) { return __awaiter(void 0, void 0, void 0, function () {
                        var dataResult, txList, processedTxList;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Network.getTxList(subject, type, page, 'anonymous')];
                                case 1:
                                    dataResult = _a.sent();
                                    if (!dataResult.response) {
                                        throw new Error('Could not fetch a list of anonymous transactions. No response from the server.');
                                    }
                                    txList = helpers.getTxListFromResponse(dataResult);
                                    if (!txList) {
                                        throw new Error('Could not get a list of anonymous transactions from the server response.');
                                    }
                                    return [4 /*yield*/, (0, processor_1.processeTxInfoList)(txList)];
                                case 2:
                                    processedTxList = _a.sent();
                                    return [2 /*return*/, {
                                            total_count: dataResult.response.result.total_count,
                                            txs: processedTxList,
                                        }];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _a.sent();
                    result = {
                        total_count: 0,
                        txs: [],
                    };
                    results.forEach(function (processed) {
                        var total_count = processed.total_count, txs = processed.txs;
                        result.total_count = result.total_count + parseFloat("".concat(total_count));
                        result.txs = result.txs.concat(txs);
                    });
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getAnonTxList = getAnonTxList;
//# sourceMappingURL=transaction.js.map