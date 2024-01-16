"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.brc20Transfer = exports.brc20Mint = exports.brc20Deploy = exports.getBrc20TransactionBuilder = exports.getBrc20TransferBuilder = exports.getBrc20MintBuilder = exports.getBrc20DeployBuilder = exports.brc20 = exports.getTxnListByPrism = exports.getTxnListByStakingUnDelegation = exports.getTxnListByStaking = exports.getTxnList = exports.sendToPublicKey = exports.sendToAddressV2 = exports.sendToAddress = exports.submitTransaction = exports.sendToManyV2 = exports.sendToMany = void 0;
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
    var ledger, asset, decimals, recieversInfo, fraAssetCode, isFraTransfer, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, error_1, e, e, transferOperationBuilderFee, receivedTransferOperationFee, e, e, e;
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
                    console.log('Full error (main)', error);
                    throw new Error("Could not create transfer operation (main), Error: \"".concat(e, "\""));
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
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not sign transfer operation, Error: \"".concat(e.message, "\""));
                }
                // try {
                //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
                // } catch (err) {
                //   const e: Error = err as Error;
                //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
                // }
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
    var ledger, asset, decimals, minimalFee, toPublickey, fraAssetCode, isFraTransfer, recieversInfo, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, error_2, e, e, e;
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
                recieversInfo[fraAssetCode] = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                if (!isFraTransfer) {
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
                receivedTransferOperation = '';
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
                try {
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not sign transfer operation, Error: \"".concat(e.message, "\""));
                }
                // try {
                //   transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
                // } catch (err) {
                //   const e: Error = err as Error;
                //   throw new Error(`Could not sign origin transfer operation, Error: "${e.message}"`);
                // }
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
                console.log(submitData);
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
var getTxnList = function (address, type, page, per_page) {
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult, txList, processedTxList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Network.getTxList(address, type, page, per_page)];
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
                            page: dataResult.response.data.page,
                            total: dataResult.response.data.total,
                            page_size: dataResult.response.data.page_size,
                            txs: processedTxList,
                        }];
            }
        });
    });
};
exports.getTxnList = getTxnList;
var getTxnListByStaking = function (address, type, page, per_page) {
    if (type === void 0) { type = 'claim'; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult_1, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(type == 'delegation')) return [3 /*break*/, 2];
                    return [4 /*yield*/, Network.getTxListByStakingDelegation(address, page, per_page)];
                case 1:
                    dataResult_1 = _a.sent();
                    if (!dataResult_1.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    return [2 /*return*/, dataResult_1.response.data];
                case 2: return [4 /*yield*/, Network.getTxListByClaim(address, page, per_page)];
                case 3:
                    dataResult = _a.sent();
                    if (!dataResult.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    return [2 /*return*/, dataResult.response.data];
            }
        });
    });
};
exports.getTxnListByStaking = getTxnListByStaking;
var getTxnListByStakingUnDelegation = function (address, page, per_page) {
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Network.getTxListByStakingUnDelegation(address, page, per_page)];
                case 1:
                    dataResult = _a.sent();
                    if (!dataResult.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    return [2 /*return*/, dataResult.response.data];
            }
        });
    });
};
exports.getTxnListByStakingUnDelegation = getTxnListByStakingUnDelegation;
var getTxnListByPrism = function (address, type, page, per_page) {
    if (type === void 0) { type = 'send'; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult_2, items, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(type == 'receive')) return [3 /*break*/, 2];
                    return [4 /*yield*/, Network.getTxListByPrismReceive(address, page, per_page)];
                case 1:
                    dataResult_2 = _a.sent();
                    if (!dataResult_2.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    items = dataResult_2.response.data.items.map(function (item) {
                        return __assign(__assign({}, item), { data: JSON.parse(atob(item.data)) });
                    });
                    return [2 /*return*/, dataResult_2.response.data];
                case 2: return [4 /*yield*/, Network.getTxListByPrismSend(address, page, per_page)];
                case 3:
                    dataResult = _a.sent();
                    if (!dataResult.response) {
                        throw new Error('Could not fetch a list of transactions. No response from the server.');
                    }
                    return [2 /*return*/, dataResult.response.data];
            }
        });
    });
};
exports.getTxnListByPrism = getTxnListByPrism;
var brc20 = function (wallet, op, tick) {
    if (op === void 0) { op = 'deploy'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, fraAssetCode, recieversInfo, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, brc20Memo, e, transactionBuilder, error_3, e, e, e;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(op);
                    return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    fraAssetCode = ledger.fra_get_asset_code();
                    recieversInfo = [];
                    return [4 /*yield*/, AssetApi.getMinimalFee()];
                case 2:
                    minimalFee = _a.sent();
                    return [4 /*yield*/, AssetApi.getFraPublicKey()];
                case 3:
                    toPublickey = _a.sent();
                    feeRecieverInfoItem = {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    };
                    recieversInfo.push(feeRecieverInfoItem);
                    return [4 /*yield*/, Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode)];
                case 4:
                    transferOperationBuilder = _a.sent();
                    receivedTransferOperation = '';
                    brc20Memo = "{\"p\":\"brc-20\",\"op\":\"deploy\",\"tick\":\"".concat(tick, "\",\"max\":\"21000000\",\"lim\":\"1000\"}");
                    // mint:      '{"p":"brc-20","op":"mint","tick":"ordi","amt":"1000"}'
                    // transfer:  '{"p":"brc-20","op":"transfer","tick":"ordi","amt":"1000"}'
                    try {
                        switch (op) {
                            case 'deploy':
                                receivedTransferOperation = transferOperationBuilder
                                    .add_output_no_tracing(BigInt(0), ledger.public_key_from_base64(wallet.publickey), fraAssetCode, false, false, brc20Memo)
                                    .create()
                                    .sign(wallet.keypair)
                                    .transaction();
                                break;
                        }
                    }
                    catch (error) {
                        e = error;
                        console.log('Full error (main)', error);
                        throw new Error("Could not create transfer operation (main), Error: \"".concat(e, "\""));
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, Builder.getTransactionBuilder()];
                case 6:
                    transactionBuilder = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    e = error_3;
                    throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
                case 8:
                    try {
                        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                    }
                    catch (err) {
                        e = err;
                        throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                    }
                    try {
                        transactionBuilder = transactionBuilder.sign(wallet.keypair);
                    }
                    catch (err) {
                        e = err;
                        throw new Error("Could not sign transfer operation, Error: \"".concat(e.message, "\""));
                    }
                    return [2 /*return*/, transactionBuilder];
            }
        });
    });
};
exports.brc20 = brc20;
/// refactored and code split below
// next 3 methods are very similar , the only difference is the brc20Memo, but i keep those separately
// since we might have the wasm methods / order changed. we might need to refactor those later
var getBrc20DeployBuilder = function (wallet, tick, max, lim, transferOperationBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, brc20Memo, receivedTransferOperation, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                brc20Memo = "{\"p\":\"brc-20\",\"op\":\"deploy\",\"tick\":\"".concat(tick, "\",\"max\":\"").concat(max, "\",\"lim\":\"").concat(lim, "\"}");
                try {
                    receivedTransferOperation = transferOperationBuilder
                        .add_output_no_tracing(BigInt(0), ledger.public_key_from_base64(wallet.publickey), fraAssetCode, false, false, brc20Memo)
                        .create()
                        .sign(wallet.keypair)
                        .transaction();
                    return [2 /*return*/, receivedTransferOperation];
                }
                catch (error) {
                    e = error;
                    console.log('Full error (main)', error);
                    throw new Error("Could not create transfer operation (deploy), Error: \"".concat(e, "\""));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getBrc20DeployBuilder = getBrc20DeployBuilder;
var getBrc20MintBuilder = function (wallet, tick, amount, repeat, transferOperationBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, brc20Memo, op, idx, receivedTransferOperation, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                brc20Memo = "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"".concat(tick, "\",\"amt\":\"").concat(amount, "\"}");
                console.log('brc20Memo mint', brc20Memo);
                try {
                    op = transferOperationBuilder;
                    for (idx = repeat; idx > 0; idx--) {
                        op = op.add_output_no_tracing(BigInt(0), ledger.public_key_from_base64(wallet.publickey), fraAssetCode, false, false, brc20Memo);
                    }
                    receivedTransferOperation = op.create().sign(wallet.keypair).transaction();
                    return [2 /*return*/, receivedTransferOperation];
                }
                catch (error) {
                    e = error;
                    console.log('Full error (main)', error);
                    throw new Error("Could not create transfer operation (mint), Error: \"".concat(e, "\""));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getBrc20MintBuilder = getBrc20MintBuilder;
// move it to helper?
var getTickerDecimal = function (tickerId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, response, decimalToken, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Network.getBrc20TokenDetail(tickerId)];
            case 1:
                result = _a.sent();
                response = result.response;
                if (!response) {
                    throw Error("could not get response from the getBrc20TokenDetail tickerId ".concat(tickerId));
                }
                decimalToken = response.decimal;
                if (!decimalToken) {
                    throw Error("could not get decimal for ticker id ".concat(tickerId, ", token data is incorrect"));
                }
                return [2 /*return*/, decimalToken];
            case 2:
                error_4 = _a.sent();
                console.log('we got an error while trying to get the decimal by the ticker id: ', error_4);
                return [3 /*break*/, 3];
            case 3: throw Error("could not get decimal by the token id for ".concat(tickerId, ", smth is really wrong"));
        }
    });
}); };
// move it to helper?
var getTickerId = function (ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var result, response, data, firstToken, id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Network.getBrc20TokenList(0, 1, 10, ticker)];
            case 1:
                result = _a.sent();
                response = result.response;
                if (!response) {
                    throw Error("could not get response from the getBrc20TokenList tick ".concat(ticker));
                }
                data = response.data;
                if (!data.length) {
                    throw Error("could not get token list from the response from the getBrc20TokenList tick ".concat(ticker, ", data is empty"));
                }
                firstToken = data[0];
                id = firstToken.id;
                if (!id) {
                    throw Error("could not get token id  from the getTickerId for ".concat(ticker, ", token data is incorrect"));
                }
                return [2 /*return*/, id];
            case 2:
                error_5 = _a.sent();
                console.log('we got an error while trying to get the ticker id: ', error_5);
                return [3 /*break*/, 3];
            case 3: throw Error("could not get token id from the getTickerId for ".concat(ticker, ", smth is really wrong"));
        }
    });
}); };
// move it to helper?
var getReminderBalance = function (wallet, ticker, amountToSend) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenId, tokenDecimal, resultBalance, response, ownedAmount, remainderAmount, remainderAmountF, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, getTickerId(ticker)];
            case 1:
                tokenId = _a.sent();
                return [4 /*yield*/, getTickerDecimal(tokenId)];
            case 2:
                tokenDecimal = _a.sent();
                return [4 /*yield*/, Network.getBrc20Balance(ticker, wallet.address)];
            case 3:
                resultBalance = _a.sent();
                response = resultBalance.response;
                if (!response) {
                    throw Error("could not get response from the getBrc20Balance to calculate the remainderAmount for tick ".concat(ticker, " and address ").concat(wallet.address));
                }
                ownedAmount = response.overall_balance;
                if (!ownedAmount) {
                    throw Error("could not get the remainderAmount from the getBrc20Balance for tick ".concat(ticker, " , result is: ").concat(JSON.stringify(resultBalance)));
                }
                remainderAmount = (0, bigNumber_1.toWei)(ownedAmount, tokenDecimal)
                    .minus((0, bigNumber_1.toWei)(amountToSend, tokenDecimal))
                    .toString();
                console.log('remainderAmount', remainderAmount);
                remainderAmountF = (0, bigNumber_1.fromWei)(remainderAmount, tokenDecimal).toString(10);
                console.log('remainderAmountF', remainderAmountF);
                return [2 /*return*/, remainderAmountF];
            case 4:
                error_6 = _a.sent();
                console.log('we got an error while trying to get the remainderAmount: ', error_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, '0'];
        }
    });
}); };
var getBrc20TransferBuilder = function (wallet, receiverAddress, tick, amount, transferOperationBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, remainderAmount, brc20Memo, brc20MemoSender, toWalletInfoLight, receivedTransferOperation, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                return [4 /*yield*/, getReminderBalance(wallet, tick, "".concat(amount))];
            case 2:
                remainderAmount = _a.sent();
                brc20Memo = "{\"p\":\"brc-20\",\"op\":\"transfer\", \"tick\":\"".concat(tick, "\",\"amt\":\"").concat(amount, "\"}");
                brc20MemoSender = "{\"p\":\"brc-20\",\"op\":\"transfer\", \"tick\":\"".concat(tick, "\",\"amt\":\"").concat(remainderAmount, "\"}");
                return [4 /*yield*/, (0, keypair_1.getAddressPublicAndKey)(receiverAddress)];
            case 3:
                toWalletInfoLight = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder
                        .add_output_no_tracing(BigInt(0), ledger.public_key_from_base64(toWalletInfoLight.publickey), fraAssetCode, false, false, brc20Memo)
                        .add_output_no_tracing(BigInt(0), ledger.public_key_from_base64(wallet.publickey), fraAssetCode, false, false, brc20MemoSender)
                        .create()
                        .sign(wallet.keypair)
                        .transaction();
                    return [2 /*return*/, receivedTransferOperation];
                }
                catch (error) {
                    e = error;
                    console.log('Full error (main)', error);
                    throw new Error("Could not create transfer operation (transfer), Error: \"".concat(e, "\""));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getBrc20TransferBuilder = getBrc20TransferBuilder;
var getBrc20TransactionBuilder = function (wallet, receivedTransferOperation) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionBuilder, error_7, e, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 1:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                e = error_7;
                throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 3:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.sign(wallet.keypair);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not sign transfer operation, Error: \"".concat(e.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.getBrc20TransactionBuilder = getBrc20TransactionBuilder;
// next 3 methods will be exposed to the wallet to use
var brc20Deploy = function (wallet, params) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, recieversInfo, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, transactionBuilder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                recieversInfo = [];
                return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 2:
                minimalFee = _a.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 3:
                toPublickey = _a.sent();
                feeRecieverInfoItem = {
                    utxoNumbers: minimalFee,
                    toPublickey: toPublickey,
                };
                recieversInfo.push(feeRecieverInfoItem);
                return [4 /*yield*/, Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode)];
            case 4:
                transferOperationBuilder = _a.sent();
                return [4 /*yield*/, (0, exports.getBrc20DeployBuilder)(wallet, params.tick, params.max, params.lim, transferOperationBuilder)];
            case 5:
                receivedTransferOperation = _a.sent();
                transactionBuilder = (0, exports.getBrc20TransactionBuilder)(wallet, receivedTransferOperation);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.brc20Deploy = brc20Deploy;
var brc20Mint = function (wallet, params) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, recieversInfo, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, transactionBuilder;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                recieversInfo = [];
                return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 2:
                minimalFee = _b.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 3:
                toPublickey = _b.sent();
                feeRecieverInfoItem = {
                    utxoNumbers: minimalFee,
                    toPublickey: toPublickey,
                };
                recieversInfo.push(feeRecieverInfoItem);
                return [4 /*yield*/, Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode)];
            case 4:
                transferOperationBuilder = _b.sent();
                return [4 /*yield*/, (0, exports.getBrc20MintBuilder)(wallet, params.tick, params.amt, (_a = params.repeat) !== null && _a !== void 0 ? _a : 1, transferOperationBuilder)];
            case 5:
                receivedTransferOperation = _b.sent();
                transactionBuilder = (0, exports.getBrc20TransactionBuilder)(wallet, receivedTransferOperation);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.brc20Mint = brc20Mint;
var brc20Transfer = function (wallet, params) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, recieversInfo, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, transactionBuilder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                recieversInfo = [];
                return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 2:
                minimalFee = _a.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 3:
                toPublickey = _a.sent();
                feeRecieverInfoItem = {
                    utxoNumbers: minimalFee,
                    toPublickey: toPublickey,
                };
                recieversInfo.push(feeRecieverInfoItem);
                return [4 /*yield*/, Fee.buildTransferOperation(wallet, recieversInfo, fraAssetCode)];
            case 4:
                transferOperationBuilder = _a.sent();
                return [4 /*yield*/, (0, exports.getBrc20TransferBuilder)(wallet, params.receiverAddress, params.tick, params.amt, transferOperationBuilder)];
            case 5:
                receivedTransferOperation = _a.sent();
                transactionBuilder = (0, exports.getBrc20TransactionBuilder)(wallet, receivedTransferOperation);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.brc20Transfer = brc20Transfer;
//# sourceMappingURL=transaction.js.map