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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = __importDefault(require("../../services/cacheStore/factory"));
var NodeLedger = __importStar(require("../../services/ledger/nodeLedger"));
var UtxoHelper = __importStar(require("../../services/utxoHelper"));
var KeypairApi = __importStar(require("../keypair/keypair"));
var NetworkApi = __importStar(require("../network/network"));
var TransactionApi = __importStar(require("../transaction/transaction"));
var TripleMasking = __importStar(require("./tripleMasking"));
describe('triple masking (unit test)', function () {
    describe('barToAbar', function () {
        var sid;
        var walletInfo;
        var ownerMemoDataResult;
        var anonKeys;
        var clientAssetRecord;
        var ownerMemo;
        var ledgerOwnerMemo;
        var ledgerClientAssetRecord;
        var nodeLedger;
        var commitments;
        var transactionBuilder;
        var myUtxo;
        var returnAxfrPublicKey;
        var returnEncKey;
        var barToAbarData;
        var spyGetLedger;
        var spyLedgerOwnerMemoFromJson;
        var spyLedgerClientAssetRecordFromJson;
        var spyGetTransactionBuilder;
        var spyAddUtxo;
        var spyGetOwnerMemo;
        var spyGetAXfrPublicKeyByBase64;
        var spyGetXPublicKeyByBase64;
        var spyAddOperationBarToAbar;
        var spyGetCommitments;
        var spySaveBarToAbarToCache;
        beforeEach(function () {
            sid = 1;
            walletInfo = {
                publickey: 'myPublickey',
                keypair: 'myKeypair',
                address: 'myAddress',
            };
            anonKeys = {
                // axfrPublicKey: 'axfrPublicKey',
                // axfrSecretKey: 'axfrSecretKey',
                // decKey: 'decKey',
                // encKey: 'encKey',
                axfrPublicKey: 'pub_key',
                axfrSpendKey: 'spend_key',
                axfrViewKey: 'view_key',
            };
            clientAssetRecord = {
                a: 'clientAssetRecord',
            };
            ownerMemo = {
                b: 'ownerMemo',
                clone: jest.fn(function () { return ownerMemo; }),
            };
            ledgerOwnerMemo = {
                from_json: jest.fn(function () { return ownerMemo; }),
            };
            ledgerClientAssetRecord = {
                from_json: jest.fn(function () { return clientAssetRecord; }),
            };
            nodeLedger = {
                foo: 'node',
                ClientAssetRecord: ledgerClientAssetRecord,
                OwnerMemo: ledgerOwnerMemo,
            };
            ownerMemoDataResult = {
                response: {
                    blind_share: '',
                    lock: {
                        ciphertext: '',
                        ephemeral_public_key: '',
                    },
                },
            };
            commitments = {
                commitments: ['1', '2', '3'],
            };
            transactionBuilder = {
                add_operation_bar_to_abar: jest.fn(function () { return transactionBuilder; }),
                get_commitments: jest.fn(function () { return commitments; }),
            };
            myUtxo = [{ utxo: { record: 'utxo.record' } }];
            returnAxfrPublicKey = {
                free: jest.fn(function () { }),
            };
            returnEncKey = {
                free: jest.fn(function () { }),
            };
            barToAbarData = {};
            spyGetLedger = jest.spyOn(NodeLedger, 'default');
            spyLedgerOwnerMemoFromJson = jest.spyOn(ledgerOwnerMemo, 'from_json');
            spyLedgerClientAssetRecordFromJson = jest.spyOn(ledgerClientAssetRecord, 'from_json');
            spyGetTransactionBuilder = jest.spyOn(TransactionApi, 'getTransactionBuilder');
            spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo');
            spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo');
            spyGetAXfrPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getAXfrPublicKeyByBase64');
            spyGetXPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getXPublicKeyByBase64');
            spyAddOperationBarToAbar = jest.spyOn(transactionBuilder, 'add_operation_bar_to_abar');
            spyGetCommitments = jest.spyOn(transactionBuilder, 'get_commitments');
            spySaveBarToAbarToCache = jest.spyOn(TripleMasking, 'saveBarToAbarToCache');
        });
        it('throw an error if could not fetch utxo for sid. [utxoHelper.addUtxo]', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.reject(new Error('addUtxo error')); });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("could not fetch utxo for sid ".concat(sid))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not fetch memo data for sid. [Network.getOwnerMemo]', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ownerMemoDataResult.error = new Error('getOwnerMemo error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not fetch memo data for sid \"".concat(sid, "\", Error - ").concat(ownerMemoDataResult.error.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not get decode memo data or get assetRecord. [ledger.OwnerMemo.from_json]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fromJsonError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromJsonError = new Error('OwnerMemo.from_json error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () {
                            throw fromJsonError;
                        });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not get decode memo data or get assetRecord\", Error - ".concat(fromJsonError.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not get decode memo data or get assetRecord. [ledger.ClientAssetRecord.from_json]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fromJsonError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromJsonError = new Error('ClientAssetRecord.from_json error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () {
                            throw fromJsonError;
                        });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not get decode memo data or get assetRecord\", Error - ".concat(fromJsonError.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not convert AXfrPublicKey. [Keypair.getAXfrPublicKeyByBase64]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAXfrPublicKeyByBase64Error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getAXfrPublicKeyByBase64Error = new Error('getAXfrPublicKeyByBase64 error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.reject(getAXfrPublicKeyByBase64Error); });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not convert AXfrPublicKey\", Error - ".concat(getAXfrPublicKeyByBase64Error.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not convert AXfrPublicKey. [Keypair.getXPublicKeyByBase64]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getXPublicKeyByBase64Error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getXPublicKeyByBase64Error = new Error('getXPublicKeyByBase64 error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.reject(getXPublicKeyByBase64Error); });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not convert AXfrPublicKey\", Error - ".concat(getXPublicKeyByBase64Error.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not add bar to abar operation. [transactionBuilder.add_operation_bar_to_abar]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addOperationBarToAbarError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addOperationBarToAbarError = new Error('addOperationBarToAbarError error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnEncKey); });
                        spyAddOperationBarToAbar.mockImplementationOnce(function () {
                            throw addOperationBarToAbarError;
                        });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not add bar to abar operation\", Error - ".concat(addOperationBarToAbarError.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not get a list of commitments strings. [transactionBuilder.get_commitments]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getCommitmentsError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getCommitmentsError = new Error('getCommitmentsError error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnEncKey); });
                        spyGetCommitments.mockImplementationOnce(function () {
                            throw getCommitmentsError;
                        });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("could not get a list of commitments strings \"".concat(getCommitmentsError.message, "\""))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if list of commitments strings is empty. [transactionBuilder.get_commitments]', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commitments.commitments = [];
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnEncKey); });
                        spyGetCommitments.mockImplementationOnce(function () { return commitments; });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow('list of commitments strings is empty ')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not save cache for bar to abar. [TripleMasking.saveBarToAbarToCache]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var saveBarToAbarToCacheError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saveBarToAbarToCacheError = new Error('saveBarToAbarToCacheError error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnEncKey); });
                        spyGetCommitments.mockImplementationOnce(function () { return commitments; });
                        spySaveBarToAbarToCache.mockImplementationOnce(function () { return Promise.reject(saveBarToAbarToCacheError); });
                        return [4 /*yield*/, expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)).rejects.toThrow("Could not save cache for bar to abar. Details: ".concat(saveBarToAbarToCacheError.message))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('return builder and barToAbarData successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetTransactionBuilder.mockImplementationOnce(function () {
                            return Promise.resolve(transactionBuilder);
                        });
                        spyAddUtxo.mockImplementationOnce(function () { return Promise.resolve(myUtxo); });
                        spyGetOwnerMemo.mockImplementationOnce(function () {
                            return Promise.resolve(ownerMemoDataResult);
                        });
                        spyLedgerOwnerMemoFromJson.mockImplementationOnce(function () { return ownerMemo; });
                        spyLedgerClientAssetRecordFromJson.mockImplementationOnce(function () { return clientAssetRecord; });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnAxfrPublicKey); });
                        spyGetXPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(returnEncKey); });
                        spyGetCommitments.mockImplementationOnce(function () { return commitments; });
                        spySaveBarToAbarToCache.mockImplementationOnce(function () { return Promise.resolve(barToAbarData); });
                        return [4 /*yield*/, TripleMasking.barToAbar(walletInfo, sid, anonKeys.axfrPublicKey)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalled();
                        expect(spyGetTransactionBuilder).toHaveBeenCalled();
                        expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, [sid]);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(ownerMemoDataResult.response);
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(myUtxo[0].utxo);
                        expect(spyGetAXfrPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.axfrPublicKey);
                        // expect(spyGetXPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.encKey);
                        expect(spyAddOperationBarToAbar).toHaveBeenCalledWith(walletInfo.keypair, returnAxfrPublicKey, BigInt(sid), clientAssetRecord, ownerMemo.clone(), returnEncKey);
                        expect(spyGetCommitments).toHaveBeenCalled();
                        expect(spySaveBarToAbarToCache).toHaveBeenCalledWith(walletInfo, sid, commitments.commitments, anonKeys);
                        expect(result.transactionBuilder).toBe(transactionBuilder);
                        expect(result.barToAbarData).toBe(barToAbarData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getOwnedAbars', function () {
        var nodeLedger;
        var randomizeAxfrPubkey;
        var axfrPublicKey;
        var formattedAxfrPublicKey;
        var givenCommitment;
        var ownedAbars;
        var atxoSid;
        var ownedAbar;
        var abarData;
        var spyGetLedger;
        var spyGetAXfrPublicKeyByBase64;
        var spyRandomizeAxfrPubkey;
        var spyGetOwnedAbars;
        beforeEach(function () {
            formattedAxfrPublicKey = '';
            givenCommitment = '';
            randomizeAxfrPubkey = 'randomize_axfr_pubkey';
            nodeLedger = {
                randomize_axfr_pubkey: jest.fn(function () { }),
            };
            axfrPublicKey = {
                free: jest.fn(function () { }),
            };
            atxoSid = '1';
            ownedAbar = { commitment: 'commitment' };
            abarData = {
                atxoSid: atxoSid,
                ownedAbar: ownedAbar,
            };
            ownedAbars = {
                response: [atxoSid, ownedAbar],
            };
            spyGetLedger = jest.spyOn(NodeLedger, 'default');
            spyGetAXfrPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getAXfrPublicKeyByBase64');
            spyGetOwnedAbars = jest.spyOn(NetworkApi, 'getOwnedAbars');
        });
        it('throw an error if receive error response from get ownedAbars call', function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorMsg;
            return __generator(this, function (_a) {
                errorMsg = 'error';
                ownedAbars.error = new Error(errorMsg);
                spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(axfrPublicKey); });
                spyRandomizeAxfrPubkey.mockImplementationOnce(function () { return randomizeAxfrPubkey; });
                spyGetOwnedAbars.mockImplementationOnce(function () { return Promise.resolve(ownedAbars); });
                expect(TripleMasking.getOwnedAbars(givenCommitment)).rejects.toThrow(ownedAbars.error.message);
                return [2 /*return*/];
            });
        }); });
        it('throw an error if not receive response from get ownedAbars call', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ownedAbars.response = undefined;
                spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(axfrPublicKey); });
                spyRandomizeAxfrPubkey.mockImplementationOnce(function () { return randomizeAxfrPubkey; });
                spyGetOwnedAbars.mockImplementationOnce(function () { return Promise.resolve(ownedAbars); });
                expect(TripleMasking.getOwnedAbars(givenCommitment)).rejects.toThrow('Could not receive response from get ownedAbars call');
                return [2 /*return*/];
            });
        }); });
        it('return atxoSid and ownedAbar successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, abar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGetAXfrPublicKeyByBase64.mockImplementationOnce(function () { return Promise.resolve(axfrPublicKey); });
                        spyRandomizeAxfrPubkey.mockImplementationOnce(function () { return randomizeAxfrPubkey; });
                        spyGetOwnedAbars.mockImplementationOnce(function () { return Promise.resolve(ownedAbars); });
                        return [4 /*yield*/, TripleMasking.getOwnedAbars(givenCommitment)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(1);
                        abar = result[0];
                        expect(abar).toHaveProperty('axfrPublicKey', formattedAxfrPublicKey);
                        expect(abar).toHaveProperty('commitment', givenCommitment);
                        expect(abar).toHaveProperty('abarData', abarData);
                        expect(abar.abarData).toHaveProperty('atxoSid', "".concat(atxoSid));
                        expect(abar.abarData).toHaveProperty('ownedAbar', ownedAbar);
                        expect(spyGetAXfrPublicKeyByBase64).toHaveBeenCalledWith(formattedAxfrPublicKey);
                        expect(spyRandomizeAxfrPubkey).toHaveBeenCalledWith(axfrPublicKey, givenCommitment);
                        expect(spyGetOwnedAbars).toHaveBeenCalledWith(randomizeAxfrPubkey);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('genAnonKeys', function () {
        var nodeLedger;
        var anonKeys;
        var formattedAnonKeys;
        var spyGetLedger;
        var spyGenAnonKeys;
        var spyKeysInstanceFree;
        beforeEach(function () {
            anonKeys = {
                free: jest.fn(function () { }),
                to_json: jest.fn(function () { }),
                pub_key: 'pub_key',
                spend_key: 'spend_key',
                view_key: 'view_key',
                // dec_key: 'dec_key',
                // enc_key: 'enc_key',
            };
            formattedAnonKeys = {
                axfrPublicKey: anonKeys.pub_key,
                axfrSpendKey: anonKeys.spend_key,
                axfrViewKey: anonKeys.view_key,
                // decKey: anonKeys.dec_key,
                // encKey: anonKeys.enc_key,
            };
            nodeLedger = {
                foo: 'node',
                gen_anon_keys: jest.fn(function () { return anonKeys; }),
            };
            spyGetLedger = jest.spyOn(NodeLedger, 'default');
            spyGenAnonKeys = jest.spyOn(nodeLedger, 'gen_anon_keys');
            spyKeysInstanceFree = jest.spyOn(anonKeys, 'free');
        });
        it('throw an error if could not get the anonKeys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var genAnonKeysError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        genAnonKeysError = new Error('genAnonKeys error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGenAnonKeys.mockImplementationOnce(function () { return Promise.reject(genAnonKeysError); });
                        return [4 /*yield*/, expect(TripleMasking.genAnonKeys()).rejects.toThrowError(genAnonKeysError.message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throw an error if could not get release the anonymous keys instance. [anonKeys.free]', function () { return __awaiter(void 0, void 0, void 0, function () {
            var genAnonKeysError, keysInstanceFreeError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        genAnonKeysError = new Error('genAnonKeys error');
                        keysInstanceFreeError = new Error('keysInstanceFreeError error');
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGenAnonKeys.mockImplementationOnce(function () { return Promise.reject(genAnonKeysError); });
                        spyKeysInstanceFree.mockImplementationOnce(function () {
                            throw keysInstanceFreeError;
                        });
                        return [4 /*yield*/, expect(TripleMasking.genAnonKeys()).rejects.toThrowError(genAnonKeysError.message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('creates an instance of a AnonKeys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyGetLedger.mockImplementationOnce(function () { return Promise.resolve(nodeLedger); });
                        spyGenAnonKeys.mockImplementationOnce(function () { return Promise.resolve(anonKeys); });
                        return [4 /*yield*/, TripleMasking.genAnonKeys()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(formattedAnonKeys);
                        expect(spyKeysInstanceFree).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('saveBarToAbarToCache', function () {
        var sid;
        var walletInfo;
        var commitments;
        var anonKeys;
        var spyConsoleLog;
        var spyCacheRead;
        var spyCacheWrite;
        beforeEach(function () {
            sid = 1;
            walletInfo = {
                address: 'test_address',
            };
            commitments = ['1', '2', '3'];
            anonKeys = {
                axfrPublicKey: 'axfrPublicKey',
                axfrSecretKey: 'axfrSecretKey',
                decKey: 'decKey',
                encKey: 'encKey',
            };
            spyConsoleLog = jest.spyOn(console, 'log');
            spyCacheRead = jest.spyOn(factory_1.default, 'read');
            spyCacheWrite = jest.spyOn(factory_1.default, 'write');
        });
        it('return a instance of BarToAbarData and print `for browser mode a default fullPathToCacheEntry was used`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TripleMasking.saveBarToAbarToCache(walletInfo, sid, commitments, anonKeys.axfrPublicKey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject({
                            anonKeysFormatted: anonKeys,
                            commitments: commitments,
                        });
                        expect(spyConsoleLog).toHaveBeenCalledWith('for browser mode a default fullPathToCacheEntry was used');
                        return [2 /*return*/];
                }
            });
        }); });
        it('return a instance of BarToAbarData and print `Error reading the abarDataCache for $address`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cacheReadError, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheReadError = new Error('cacheRead error');
                        spyCacheRead.mockImplementationOnce(function () { return Promise.reject(cacheReadError); });
                        return [4 /*yield*/, TripleMasking.saveBarToAbarToCache(walletInfo, sid, commitments, anonKeys.axfrPublicKey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject({
                            anonKeysFormatted: anonKeys,
                            commitments: commitments,
                        });
                        expect(spyConsoleLog).toHaveBeenCalledWith("Error reading the abarDataCache for ".concat(walletInfo.address, ". Creating an empty object now"));
                        return [2 /*return*/];
                }
            });
        }); });
        it('return a instance of BarToAbarData and print `Could not write cache for abarDataCache`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cacheWriteError, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheWriteError = new Error('cacheWrite error');
                        spyCacheWrite.mockImplementationOnce(function () { return Promise.reject(cacheWriteError); });
                        return [4 /*yield*/, TripleMasking.saveBarToAbarToCache(walletInfo, sid, commitments, anonKeys.axfrPublicKey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject({
                            anonKeysFormatted: anonKeys,
                            commitments: commitments,
                        });
                        expect(spyConsoleLog).toHaveBeenCalledWith("Could not write cache for abarDataCache, \"".concat(cacheWriteError.message, "\""));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('saveOwnedAbarsToCache', function () {
        var walletInfo;
        var spyConsoleLog;
        var spyCacheRead;
        var spyCacheWrite;
        var ownedAbars;
        var atxoSid;
        var ownedAbar;
        var givenCommitment;
        beforeEach(function () {
            walletInfo = {
                address: 'test_address',
            };
            atxoSid = '1';
            ownedAbar = { commitment: 'commitment' };
            ownedAbars = [
                {
                    commitment: givenCommitment,
                    abarData: {
                        atxoSid: atxoSid,
                        ownedAbar: __assign({}, ownedAbar),
                    },
                },
            ];
            spyConsoleLog = jest.spyOn(console, 'log');
            spyCacheRead = jest.spyOn(factory_1.default, 'read');
            spyCacheWrite = jest.spyOn(factory_1.default, 'write');
        });
        it('return true and print `for browser mode a default fullPathToCacheEntry was used`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbars)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(spyConsoleLog).toHaveBeenCalledWith('for browser mode a default fullPathToCacheEntry was used');
                        return [2 /*return*/];
                }
            });
        }); });
        it('return false and print `Could not write cache for ownedAbarsCache`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cacheWriteError, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheWriteError = new Error('cacheWrite error');
                        spyCacheWrite.mockImplementationOnce(function () { return Promise.reject(cacheWriteError); });
                        return [4 /*yield*/, TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbars)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        expect(spyConsoleLog).toHaveBeenCalledWith("Could not write cache for ownedAbarsCache, \"".concat(cacheWriteError.message, "\""));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=tripleMasking.spec.js.map