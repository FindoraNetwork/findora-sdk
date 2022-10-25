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
exports.buildTransferOperationV2 = exports.buildTransferOperation = exports.getFeeInputs = exports.buildTransferOperationWithFee = exports.getPayloadForFeeInputs = exports.getTransferOperation = exports.getAssetTracingPolicies = exports.getEmptyTransferBuilder = void 0;
var Network = __importStar(require("../api/network"));
var AssetApi = __importStar(require("../api/sdkAsset"));
var ledgerWrapper_1 = require("./ledger/ledgerWrapper");
var utxoHelper_1 = require("./utxoHelper");
var getEmptyTransferBuilder = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [2 /*return*/, ledger.TransferOperationBuilder.new()];
        }
    });
}); };
exports.getEmptyTransferBuilder = getEmptyTransferBuilder;
var getAssetTracingPolicies = function (asset) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, tracingPolicies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                tracingPolicies = ledger.AssetType.from_json({ properties: asset }).get_tracing_policies();
                return [2 /*return*/, tracingPolicies];
        }
    });
}); };
exports.getAssetTracingPolicies = getAssetTracingPolicies;
var getTransferOperation = function (walletInfo, utxoInputs, recieversInfo, assetCode, transferOp) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, asset, isTraceable, tracingPolicies, e_1, isBlindIsAmount, isBlindIsType, utxoNumbers, inputParametersList, inputAmount, inputPromise, numberToSubmit;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 2:
                asset = _b.sent();
                isTraceable = ((_a = asset.assetRules.tracing_policies) === null || _a === void 0 ? void 0 : _a.length) > 0;
                if (!isTraceable) return [3 /*break*/, 6];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, exports.getAssetTracingPolicies)(asset)];
            case 4:
                tracingPolicies = _b.sent();
                console.log('tracingPolicies:', tracingPolicies);
                return [3 /*break*/, 6];
            case 5:
                e_1 = _b.sent();
                console.log(e_1);
                return [3 /*break*/, 6];
            case 6:
                isBlindIsAmount = recieversInfo.some(function (item) { var _a; return ((_a = item.assetBlindRules) === null || _a === void 0 ? void 0 : _a.isAmountBlind) === true; });
                isBlindIsType = recieversInfo.some(function (item) { var _a; return ((_a = item.assetBlindRules) === null || _a === void 0 ? void 0 : _a.isTypeBlind) === true; });
                utxoNumbers = BigInt(0);
                inputParametersList = utxoInputs.inputParametersList, inputAmount = utxoInputs.inputAmount;
                inputPromise = inputParametersList.map(function (inputParameters) { return __awaiter(void 0, void 0, void 0, function () {
                    var txoRef, assetRecord, amount, sid, memoDataResult, myMemoData, memoError, ownerMemo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                txoRef = inputParameters.txoRef, assetRecord = inputParameters.assetRecord, amount = inputParameters.amount, sid = inputParameters.sid;
                                return [4 /*yield*/, Network.getOwnerMemo(sid)];
                            case 1:
                                memoDataResult = _a.sent();
                                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                                if (memoError) {
                                    throw new Error("Could not fetch memo data for sid \"".concat(sid, "\", Error - ").concat(memoError.message));
                                }
                                utxoNumbers = utxoNumbers + BigInt(amount.toString());
                                ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
                                if (isTraceable) {
                                    transferOp = transferOp.add_input_with_tracing(txoRef, assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), tracingPolicies, walletInfo.keypair, amount);
                                }
                                else {
                                    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair, amount);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(inputPromise)];
            case 7:
                _b.sent();
                recieversInfo.forEach(function (reciverInfo) {
                    var utxoNumbers = reciverInfo.utxoNumbers, toPublickey = reciverInfo.toPublickey, _a = reciverInfo.assetBlindRules, assetBlindRules = _a === void 0 ? {} : _a;
                    var blindIsAmount = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isAmountBlind;
                    var blindIsType = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isTypeBlind;
                    if (isTraceable) {
                        // @ts-ignore
                        transferOp = transferOp.add_output_with_tracing(utxoNumbers, toPublickey, tracingPolicies, assetCode, !!blindIsAmount, !!blindIsType);
                    }
                    else {
                        transferOp = transferOp.add_output_no_tracing(utxoNumbers, toPublickey, assetCode, !!blindIsAmount, !!blindIsType);
                    }
                });
                if (!(inputAmount > utxoNumbers)) return [3 /*break*/, 10];
                numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));
                if (!isTraceable) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, exports.getAssetTracingPolicies)(asset)];
            case 8:
                tracingPolicies = _b.sent();
                transferOp = transferOp.add_output_with_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), tracingPolicies, assetCode, isBlindIsAmount, isBlindIsType);
                return [3 /*break*/, 10];
            case 9:
                transferOp = transferOp.add_output_no_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), assetCode, isBlindIsAmount, isBlindIsType);
                _b.label = 10;
            case 10: return [2 /*return*/, transferOp];
        }
    });
}); };
exports.getTransferOperation = getTransferOperation;
var getPayloadForFeeInputs = function (walletInfo, utxoInputs) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, feeInputsPayload, inputParametersList, inputPromise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                feeInputsPayload = [];
                inputParametersList = utxoInputs.inputParametersList;
                inputPromise = inputParametersList.map(function (inputParameters) { return __awaiter(void 0, void 0, void 0, function () {
                    var txoRef, assetRecord, amount, sid, memoDataResult, myMemoData, memoError, ownerMemo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                txoRef = inputParameters.txoRef, assetRecord = inputParameters.assetRecord, amount = inputParameters.amount, sid = inputParameters.sid;
                                return [4 /*yield*/, Network.getOwnerMemo(sid)];
                            case 1:
                                memoDataResult = _a.sent();
                                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                                if (memoError) {
                                    throw new Error("Could not fetch memo data for sid \"".concat(sid, "\", Error - ").concat(memoError.message));
                                }
                                ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
                                feeInputsPayload.push({
                                    txoRef: txoRef,
                                    assetRecord: assetRecord,
                                    ownerMemo: ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(),
                                    keypair: walletInfo.keypair,
                                    amount: amount,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(inputPromise)];
            case 2:
                _a.sent();
                return [2 /*return*/, feeInputsPayload];
        }
    });
}); };
exports.getPayloadForFeeInputs = getPayloadForFeeInputs;
// creates an istance of a TransferOperationBuilder with a minimal FRA fee
var buildTransferOperationWithFee = function (walletInfo, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var minimalFee, fraAssetCode, toPublickey, recieversInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 1:
                minimalFee = _a.sent();
                return [4 /*yield*/, AssetApi.getFraAssetCode()];
            case 2:
                fraAssetCode = _a.sent();
                return [4 /*yield*/, AssetApi.getFraPublicKey()];
            case 3:
                toPublickey = _a.sent();
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                        assetBlindRules: assetBlindRules,
                    },
                ];
                return [4 /*yield*/, (0, exports.buildTransferOperation)(walletInfo, recieversInfo, fraAssetCode)];
            case 4:
                trasferOperation = _a.sent();
                return [2 /*return*/, trasferOperation];
        }
    });
}); };
exports.buildTransferOperationWithFee = buildTransferOperationWithFee;
// used in triple masking
var getFeeInputs = function (walletInfo, excludeSids, isBarToAbar) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, sidsResult, sids, filteredSids, minimalFee, _a, fraAssetCode, utxoDataList, sendUtxoList, utxoInputsInfo, feeInputsPayload, feeInputs;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
            case 2:
                sidsResult = _b.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('No sids were fetched');
                }
                filteredSids = sids.filter(function (sid) { return !excludeSids.includes(sid); });
                if (!isBarToAbar) return [3 /*break*/, 4];
                return [4 /*yield*/, AssetApi.getBarToAbarMinimalFee()];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, AssetApi.getMinimalFee()];
            case 5:
                _a = _b.sent();
                _b.label = 6;
            case 6:
                minimalFee = _a;
                console.log('🚀 ~ file: fee.ts ~ line 263 ~ abar minimalFee', minimalFee);
                return [4 /*yield*/, AssetApi.getFraAssetCode()];
            case 7:
                fraAssetCode = _b.sent();
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, filteredSids)];
            case 8:
                utxoDataList = _b.sent();
                sendUtxoList = (0, utxoHelper_1.getSendUtxo)(fraAssetCode, minimalFee, utxoDataList);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxoInputs)(sendUtxoList)];
            case 9:
                utxoInputsInfo = _b.sent();
                return [4 /*yield*/, (0, exports.getPayloadForFeeInputs)(walletInfo, utxoInputsInfo)];
            case 10:
                feeInputsPayload = _b.sent();
                feeInputs = ledger.FeeInputs.new();
                feeInputsPayload.forEach(function (payloadItem) {
                    var amount = payloadItem.amount, txoRef = payloadItem.txoRef, assetRecord = payloadItem.assetRecord, ownerMemo = payloadItem.ownerMemo, keypair = payloadItem.keypair;
                    feeInputs = feeInputs.append2(amount, txoRef, assetRecord, ownerMemo, keypair);
                });
                return [2 /*return*/, feeInputs];
        }
    });
}); };
exports.getFeeInputs = getFeeInputs;
// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
var buildTransferOperation = function (walletInfo, recieversInfo, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var sidsResult, sids, totalUtxoNumbers, utxoDataList, sendUtxoList, utxoInputsInfo, transferOperationBuilder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
            case 1:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('No sids were fetched');
                }
                totalUtxoNumbers = recieversInfo.reduce(function (acc, receiver) {
                    return BigInt(Number(receiver.utxoNumbers) + Number(acc));
                }, BigInt(0));
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sids)];
            case 2:
                utxoDataList = _a.sent();
                sendUtxoList = (0, utxoHelper_1.getSendUtxo)(assetCode, totalUtxoNumbers, utxoDataList);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxoInputs)(sendUtxoList)];
            case 3:
                utxoInputsInfo = _a.sent();
                return [4 /*yield*/, (0, exports.getEmptyTransferBuilder)()];
            case 4:
                transferOperationBuilder = _a.sent();
                return [4 /*yield*/, (0, exports.getTransferOperation)(walletInfo, utxoInputsInfo, recieversInfo, assetCode, transferOperationBuilder)];
            case 5:
                transferOperationBuilder = _a.sent();
                return [2 /*return*/, transferOperationBuilder];
        }
    });
}); };
exports.buildTransferOperation = buildTransferOperation;
// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
var buildTransferOperationV2 = function (walletInfo, recieversInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var sidsResult, sids, transferOperationBuilder, _i, _a, assetCodeType, assetCodeItem, totalUtxoNumbers, utxoDataList, sendUtxoList, utxoInputsInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
            case 1:
                sidsResult = _b.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('No sids were fetched');
                }
                return [4 /*yield*/, (0, exports.getEmptyTransferBuilder)()];
            case 2:
                transferOperationBuilder = _b.sent();
                _i = 0, _a = Object.keys(recieversInfo);
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                assetCodeType = _a[_i];
                assetCodeItem = recieversInfo[assetCodeType];
                totalUtxoNumbers = assetCodeItem.reduce(function (acc, receiver) {
                    return BigInt(Number(receiver.utxoNumbers) + Number(acc));
                }, BigInt(0));
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sids)];
            case 4:
                utxoDataList = _b.sent();
                sendUtxoList = (0, utxoHelper_1.getSendUtxo)(assetCodeType, totalUtxoNumbers, utxoDataList);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxoInputs)(sendUtxoList)];
            case 5:
                utxoInputsInfo = _b.sent();
                return [4 /*yield*/, (0, exports.getTransferOperation)(walletInfo, utxoInputsInfo, assetCodeItem, assetCodeType, transferOperationBuilder)];
            case 6:
                transferOperationBuilder = _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8: return [2 /*return*/, transferOperationBuilder];
        }
    });
}); };
exports.buildTransferOperationV2 = buildTransferOperationV2;
//# sourceMappingURL=fee.js.map