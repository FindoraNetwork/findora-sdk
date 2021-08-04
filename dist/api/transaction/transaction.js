"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.getTxList = exports.sendToPublicKey = exports.sendToAddress = exports.submitTransaction = exports.sendToMany = exports.getTransactionBuilder = void 0;
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var keypair_1 = require("../keypair");
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
var helpers = __importStar(require("./helpers"));
var processor_1 = require("./processor");
// merge with same in staiking
var getTransactionBuilder = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, _a, stateCommitment, error, _, height, blockCount, transactionBuilder;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Network.getStateCommitment()];
            case 2:
                _a = _b.sent(), stateCommitment = _a.response, error = _a.error;
                if (error) {
                    throw new Error(error.message);
                }
                if (!stateCommitment) {
                    throw new Error('could not receive response from state commitement call');
                }
                _ = stateCommitment[0], height = stateCommitment[1];
                blockCount = BigInt(height);
                transactionBuilder = ledger.TransactionBuilder.new(BigInt(blockCount));
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.getTransactionBuilder = getTransactionBuilder;
var sendToMany = function (walletInfo, recieversList, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, asset, decimals, recieversInfo, fraAssetCode, isFraTransfer, minimalFee, toPublickey, feeRecieverInfoItem, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, error_1, e, e, transferOperationBuilderFee, receivedTransferOperationFee, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
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
                    var utxoNumbers = BigInt(bigNumber_1.toWei(amount, decimals).toString());
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
                    throw new Error("Could not create transfer operation (main), Error: \"" + e.message + "\"");
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, exports.getTransactionBuilder()];
            case 8:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                e = error_1;
                throw new Error("Could not get \"defineTransactionBuilder\", Error: \"" + e.message + "\"");
            case 10:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"" + e.message + "\"");
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
                    throw new Error("Could not create transfer operation for fee, Error: \"" + e.message + "\"");
                }
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"" + e.message + "\"");
                }
                _a.label = 12;
            case 12: return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.sendToMany = sendToMany;
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
                throw new Error("Error Could not submit transaction: \"" + e.message + "\"");
            case 4:
                handle = result.response, submitError = result.error;
                if (submitError) {
                    throw new Error("Could not submit issue asset transaction: \"" + submitError.message + "\"");
                }
                if (!handle) {
                    throw new Error("Could not issue asset - submit handle is missing");
                }
                return [2 /*return*/, handle];
        }
    });
}); };
exports.submitTransaction = submitTransaction;
var sendToAddress = function (walletInfo, address, amount, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var toWalletInfoLight, recieversInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keypair_1.getAddressPublicAndKey(address)];
            case 1:
                toWalletInfoLight = _a.sent();
                recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount: amount }];
                return [2 /*return*/, exports.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules)];
        }
    });
}); };
exports.sendToAddress = sendToAddress;
var sendToPublicKey = function (walletInfo, publicKey, amount, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keypair_1.getAddressByPublicKey(publicKey)];
            case 1:
                address = _a.sent();
                return [2 /*return*/, exports.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules)];
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
                case 0: return [4 /*yield*/, Network.getTxList(address, type, page)];
                case 1:
                    dataResult = _a.sent();
                    if (!dataResult.response) {
                        throw new Error('could not fetch a list of transactions. No response from the server.');
                    }
                    txList = helpers.getTxListFromResponse(dataResult);
                    if (!txList) {
                        throw new Error('could not get a list of transactions from the server response.');
                    }
                    return [4 /*yield*/, processor_1.processeTxInfoList(txList)];
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
//# sourceMappingURL=transaction.js.map