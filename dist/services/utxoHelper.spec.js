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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var NetworkApi = __importStar(require("../api/network/network"));
var UtxoHelper = __importStar(require("./utxoHelper"));
var cache_1 = require("../config/cache");
var Sdk_1 = __importDefault(require("../Sdk"));
var factory_1 = __importDefault(require("./cacheStore/factory"));
var NodeLedger = __importStar(require("./ledger/nodeLedger"));
describe('utxoHelper', function () {
    describe('decryptUtxoItem', function () {
        it('successfully decrypts an utxo item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, ownerMemo, myAssetType, decryptAssetData, decryptedAsetType, LedgerClientAssetRecord, LedgerOwnerMemo, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerOwnerMemoFromJson, spyLedgerOpenClientAssetRecord, spyLedgerAssetTypeFromJsvalue, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        ownerMemo = {
                            b: 'myOwnerMemo',
                            clone: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myAssetType = 'myAssetType';
                        decryptAssetData = {
                            asset_type: myAssetType,
                            amount: '2',
                        };
                        decryptedAsetType = 'myDecryptedAsetType';
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerOwnerMemo = {
                            from_json: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            OwnerMemo: LedgerOwnerMemo,
                            open_client_asset_record: jest.fn(function () {
                                return decryptAssetData;
                            }),
                            asset_type_from_jsvalue: jest.fn(function () {
                                return decryptedAsetType;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
                        spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
                        spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
                        memoDataResult = {
                            response: { foofoo: 'barbar' },
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
                        expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
                        expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);
                        expect(result.address).toBe(walletInfo.address);
                        expect(result.sid).toBe(sid);
                        expect(result.body).toBe(decryptAssetData);
                        expect(result.utxo).toStrictEqual(utxoData.utxo);
                        expect(result.ownerMemo).toBe(ownerMemo);
                        expect(result.memoData).toBe(memoData);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerOwnerMemoFromJson.mockRestore();
                        spyLedgerOpenClientAssetRecord.mockRestore();
                        spyLedgerAssetTypeFromJsvalue.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns ownerMemo as undefined if no onwner memo data is fetched', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, ownerMemo, myAssetType, decryptAssetData, decryptedAsetType, LedgerClientAssetRecord, LedgerOwnerMemo, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerOwnerMemoFromJson, spyLedgerOpenClientAssetRecord, spyLedgerAssetTypeFromJsvalue, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        ownerMemo = {
                            b: 'myOwnerMemo',
                            clone: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myAssetType = 'myAssetType';
                        decryptAssetData = {
                            asset_type: myAssetType,
                            amount: '2',
                        };
                        decryptedAsetType = 'myDecryptedAsetType';
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerOwnerMemo = {
                            from_json: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            OwnerMemo: LedgerOwnerMemo,
                            open_client_asset_record: jest.fn(function () {
                                return decryptAssetData;
                            }),
                            asset_type_from_jsvalue: jest.fn(function () {
                                return decryptedAsetType;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
                        spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
                        spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
                        memoDataResult = {
                            response: undefined,
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).not.toHaveBeenCalled();
                        expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, undefined, walletInfo.keypair);
                        expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);
                        expect(result.address).toBe(walletInfo.address);
                        expect(result.sid).toBe(sid);
                        expect(result.body).toBe(decryptAssetData);
                        expect(result.utxo).toStrictEqual(utxoData.utxo);
                        expect(result.ownerMemo).toBe(undefined);
                        expect(result.memoData).toBe(memoData);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerOwnerMemoFromJson.mockRestore();
                        spyLedgerOpenClientAssetRecord.mockRestore();
                        spyLedgerAssetTypeFromJsvalue.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not open ledger client record from json', function () { return __awaiter(void 0, void 0, void 0, function () {
            var LedgerClientAssetRecord, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, sid, walletInfo, utxoData, memoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not get client asset record')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if gets an error while trying to get owner memo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, LedgerClientAssetRecord, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        memoDataResult = {
                            error: new Error('foo'),
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Could not fetch memo data for sid')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not open ledger owner memo from json', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, LedgerClientAssetRecord, LedgerOwnerMemo, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerOwnerMemoFromJson, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerOwnerMemo = {
                            from_json: jest.fn(function () {
                                throw new Error('bum');
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            OwnerMemo: LedgerOwnerMemo,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
                        memoDataResult = {
                            response: { foofoo: 'barbar' },
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not decode owner memo')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerOwnerMemoFromJson.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not open ledger open_client_asset_record', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, ownerMemo, LedgerClientAssetRecord, LedgerOwnerMemo, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerOwnerMemoFromJson, spyLedgerOpenClientAssetRecord, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        ownerMemo = {
                            b: 'myOwnerMemo',
                            clone: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerOwnerMemo = {
                            from_json: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            OwnerMemo: LedgerOwnerMemo,
                            open_client_asset_record: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
                        spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
                        memoDataResult = {
                            response: { foofoo: 'barbar' },
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not open client asset record to decode')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
                        expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerOwnerMemoFromJson.mockRestore();
                        spyLedgerOpenClientAssetRecord.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not open ledger open_client_asset_record', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetRecord, ownerMemo, myAssetType, decryptAssetData, LedgerClientAssetRecord, LedgerOwnerMemo, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerOwnerMemoFromJson, spyLedgerOpenClientAssetRecord, spyLedgerAssetTypeFromJsvalue, memoDataResult, spyGetOwnerMemo, sid, walletInfo, utxoData, memoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        ownerMemo = {
                            b: 'myOwnerMemo',
                            clone: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myAssetType = 'myAssetType';
                        decryptAssetData = {
                            asset_type: myAssetType,
                            amount: '2',
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerOwnerMemo = {
                            from_json: jest.fn(function () {
                                return ownerMemo;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            OwnerMemo: LedgerOwnerMemo,
                            open_client_asset_record: jest.fn(function () {
                                return decryptAssetData;
                            }),
                            asset_type_from_jsvalue: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
                        spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
                        spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
                        memoDataResult = {
                            response: { foofoo: 'barbar' },
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        sid = 123;
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        utxoData = {
                            utxo: {
                                utxoKey: 'utxoVal',
                            },
                        };
                        memoData = {
                            bar: 'foo',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not decrypt asset type')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
                        expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
                        expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerOwnerMemoFromJson.mockRestore();
                        spyLedgerOpenClientAssetRecord.mockRestore();
                        spyLedgerAssetTypeFromJsvalue.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUtxoItem', function () {
        it('returns an utxo item without cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sid, utxoData, utxoDataResult, spyGetUtxo, memoData, memoDataResult, spyGetOwnerMemo, item, spyDecryptUtxoItem, walletInfo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sid = 123;
                        utxoData = {
                            myKey: 'myValue',
                        };
                        utxoDataResult = {
                            response: utxoData,
                        };
                        spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(function () {
                            return Promise.resolve(utxoDataResult);
                        });
                        memoData = { foofoo: 'barbar' };
                        memoDataResult = {
                            response: memoData,
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        item = {
                            myKeyUtxo: 'myValueUtxo',
                        };
                        spyDecryptUtxoItem = jest.spyOn(UtxoHelper, 'decryptUtxoItem').mockImplementation(function () {
                            return Promise.resolve(item);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        return [4 /*yield*/, UtxoHelper.getUtxoItem(sid, walletInfo)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetUtxo).toHaveBeenCalledWith(sid);
                        expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
                        expect(spyDecryptUtxoItem).toHaveBeenCalledWith(sid, walletInfo, utxoData, memoData);
                        expect(result).toBe(item);
                        spyGetUtxo.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        spyDecryptUtxoItem.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns a cached utxo item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sid, spyGetUtxo, walletInfo, cachedItem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sid = 123;
                        spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo');
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        cachedItem = { foo: 'bar ' };
                        return [4 /*yield*/, UtxoHelper.getUtxoItem(sid, walletInfo, cachedItem)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetUtxo).not.toHaveBeenCalledWith(sid);
                        expect(result).toBe(cachedItem);
                        spyGetUtxo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if failed to fetch utxo data and got error in the result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sid, utxoDataResult, spyGetUtxo, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sid = 123;
                        utxoDataResult = {
                            error: new Error('foo'),
                        };
                        spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(function () {
                            return Promise.resolve(utxoDataResult);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch utxo data for sid')];
                    case 1:
                        _a.sent();
                        spyGetUtxo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if failed to fetch utxo data and got no response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sid, utxoDataResult, spyGetUtxo, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sid = 123;
                        utxoDataResult = {};
                        spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(function () {
                            return Promise.resolve(utxoDataResult);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch utxo data for sid')];
                    case 1:
                        _a.sent();
                        spyGetUtxo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if failed to fetch memo data and got error in the result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sid, utxoData, utxoDataResult, spyGetUtxo, memoDataResult, spyGetOwnerMemo, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sid = 123;
                        utxoData = {
                            myKey: 'myValue',
                        };
                        utxoDataResult = {
                            response: utxoData,
                        };
                        spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(function () {
                            return Promise.resolve(utxoDataResult);
                        });
                        memoDataResult = {
                            error: new Error('foo'),
                        };
                        spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(function () {
                            return Promise.resolve(memoDataResult);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        return [4 /*yield*/, expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch memo data for sid')];
                    case 1:
                        _a.sent();
                        spyGetUtxo.mockRestore();
                        spyGetOwnerMemo.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('addUtxo', function () {
        it('creates a utxoDataList', function () { return __awaiter(void 0, void 0, void 0, function () {
            var utxoDataCache, spyCacheRead, item, spyGetUtxoItem, addSids, walletInfo, cacheDataToSave, spyCacheWrite, fullPathToCacheEntry, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxoDataCache = {
                            sid_1: {
                                foo: 'bar',
                            },
                        };
                        spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(function () {
                            return Promise.resolve(utxoDataCache);
                        });
                        item = {
                            sid: 1,
                        };
                        spyGetUtxoItem = jest.spyOn(UtxoHelper, 'getUtxoItem').mockImplementation(function () {
                            return Promise.resolve(item);
                        });
                        addSids = [1];
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        cacheDataToSave = {
                            sid_1: item,
                        };
                        spyCacheWrite = jest.spyOn(factory_1.default, 'write').mockImplementation(function () {
                            return Promise.resolve(true);
                        });
                        fullPathToCacheEntry = Sdk_1.default.environment.cachePath + "/" + cache_1.CACHE_ENTRIES.UTXO_DATA + "_" + walletInfo.address + ".json";
                        return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, addSids)];
                    case 1:
                        result = _a.sent();
                        expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
                        expect(spyGetUtxoItem).toBeCalledWith(addSids[0], walletInfo, utxoDataCache.sid_1);
                        expect(spyCacheWrite).toBeCalledWith(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider);
                        expect(result).toStrictEqual([item]);
                        spyCacheRead.mockRestore();
                        spyGetUtxoItem.mockRestore();
                        spyCacheWrite.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when can not read cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyCacheRead, addSids, walletInfo, fullPathToCacheEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(function () {
                            throw new Error('aa');
                        });
                        addSids = [1];
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        fullPathToCacheEntry = Sdk_1.default.environment.cachePath + "/" + cache_1.CACHE_ENTRIES.UTXO_DATA + "_" + walletInfo.address + ".json";
                        return [4 /*yield*/, expect(UtxoHelper.addUtxo(walletInfo, addSids)).rejects.toThrow('Error reading the cache')];
                    case 1:
                        _a.sent();
                        expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
                        spyCacheRead.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('skips a sid if it can not get its utxo item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var utxoDataCache, spyCacheRead, item, spyGetUtxoItem, addSids, walletInfo, cacheDataToSave, spyCacheWrite, fullPathToCacheEntry, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxoDataCache = {
                            sid_1: {
                                foo1: 'bar2',
                            },
                            sid_2: {
                                foo2: 'bar2',
                            },
                        };
                        spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(function () {
                            return Promise.resolve(utxoDataCache);
                        });
                        item = {
                            sid: 2,
                        };
                        spyGetUtxoItem = jest
                            .spyOn(UtxoHelper, 'getUtxoItem')
                            .mockImplementationOnce(function () {
                            throw new Error('boom');
                        })
                            .mockImplementationOnce(function () {
                            return Promise.resolve(item);
                        });
                        addSids = [1, 2];
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        cacheDataToSave = {
                            sid_2: item,
                        };
                        spyCacheWrite = jest.spyOn(factory_1.default, 'write').mockImplementation(function () {
                            return Promise.resolve(true);
                        });
                        fullPathToCacheEntry = Sdk_1.default.environment.cachePath + "/" + cache_1.CACHE_ENTRIES.UTXO_DATA + "_" + walletInfo.address + ".json";
                        return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, addSids)];
                    case 1:
                        result = _a.sent();
                        expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
                        expect(spyGetUtxoItem).toHaveBeenNthCalledWith(1, addSids[0], walletInfo, utxoDataCache.sid_1);
                        expect(spyGetUtxoItem).toHaveBeenNthCalledWith(2, addSids[1], walletInfo, utxoDataCache.sid_2);
                        expect(spyCacheWrite).toBeCalledWith(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider);
                        expect(result).toStrictEqual([item]);
                        expect(result).toHaveLength(1);
                        spyCacheRead.mockRestore();
                        spyGetUtxoItem.mockRestore();
                        spyCacheWrite.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSendUtxo', function () {
        it('returns a single utxo if its amount bigger than requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myCode, amount, myItem1, myItem2, utxoDataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myCode = 'code1';
                        amount = BigInt(4);
                        myItem1 = {
                            sid: 1,
                            body: {
                                asset_type: myCode,
                                amount: 5,
                            },
                            utxo: { foo1: 'bar1' },
                            ownerMemo: { bar1: 'foo1' },
                            memoData: 'myMemoData1',
                        };
                        myItem2 = {
                            sid: 3,
                            body: {
                                asset_type: myCode,
                                amount: 4,
                            },
                            utxo: { foo2: 'bar2' },
                            ownerMemo: { bar2: 'foo2' },
                            memoData: 'myMemoData1',
                        };
                        utxoDataList = [myItem1, myItem2];
                        return [4 /*yield*/, UtxoHelper.getSendUtxo(myCode, amount, utxoDataList)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(1);
                        expect(result).toStrictEqual([
                            {
                                amount: amount,
                                originAmount: BigInt(myItem1.body.amount),
                                sid: myItem1.sid,
                                utxo: myItem1.utxo,
                                ownerMemo: myItem1.ownerMemo,
                                memoData: myItem1.memoData,
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns a single utxo if its amount equals to what was requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myCode, amount, myItem1, myItem2, utxoDataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myCode = 'code1';
                        amount = BigInt(4);
                        myItem1 = {
                            sid: 1,
                            body: {
                                asset_type: myCode,
                                amount: 4,
                            },
                            utxo: { foo1: 'bar1' },
                            ownerMemo: { bar1: 'foo1' },
                            memoData: 'myMemoData1',
                        };
                        myItem2 = {
                            sid: 3,
                            body: {
                                asset_type: myCode,
                                amount: 4,
                            },
                            utxo: { foo2: 'bar2' },
                            ownerMemo: { bar2: 'foo2' },
                            memoData: 'myMemoData1',
                        };
                        utxoDataList = [myItem1, myItem2];
                        return [4 /*yield*/, UtxoHelper.getSendUtxo(myCode, amount, utxoDataList)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(1);
                        expect(result).toStrictEqual([
                            {
                                amount: amount,
                                originAmount: BigInt(myItem1.body.amount),
                                sid: myItem1.sid,
                                utxo: myItem1.utxo,
                                ownerMemo: myItem1.ownerMemo,
                                memoData: myItem1.memoData,
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns a a list of utxo with the amount equals to what was requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myCode, amount, myItem1, myItem2, myItem3, myItem4, utxoDataList, result, firstUtxo, secondUtxo, thirdUtxo, totalReturnedAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myCode = 'code1';
                        amount = BigInt(4);
                        myItem1 = {
                            sid: 1,
                            body: {
                                asset_type: myCode,
                                amount: 2,
                            },
                            utxo: { foo1: 'bar1' },
                            ownerMemo: { bar1: 'foo1' },
                            memoData: 'myMemoData1',
                        };
                        myItem2 = {
                            sid: 2,
                            body: {
                                asset_type: myCode,
                                amount: 1,
                            },
                            utxo: { foo2: 'bar2' },
                            ownerMemo: { bar2: 'foo2' },
                            memoData: 'myMemoData2',
                        };
                        myItem3 = {
                            sid: 1,
                            body: {
                                asset_type: myCode,
                                amount: 5,
                            },
                            utxo: { foo3: 'bar3' },
                            ownerMemo: { bar3: 'foo3' },
                            memoData: 'myMemoData3',
                        };
                        myItem4 = {
                            sid: 4,
                            body: {
                                asset_type: myCode,
                                amount: 2,
                            },
                            utxo: { foo4: 'bar4' },
                            ownerMemo: { bar4: 'foo4' },
                            memoData: 'myMemoData4',
                        };
                        utxoDataList = [myItem1, myItem2, myItem3, myItem4];
                        return [4 /*yield*/, UtxoHelper.getSendUtxo(myCode, amount, utxoDataList)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(3);
                        firstUtxo = result[0], secondUtxo = result[1], thirdUtxo = result[2];
                        totalReturnedAmount = Number(firstUtxo.amount) + Number(secondUtxo.amount) + Number(thirdUtxo.amount);
                        expect(amount).toBe(BigInt(totalReturnedAmount));
                        return [2 /*return*/];
                }
            });
        }); });
        it('skips utxo which do not have requested code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myCode, amount, notMyItem, utxoDataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myCode = 'code1';
                        amount = BigInt(4);
                        notMyItem = {
                            sid: 2,
                            body: {
                                asset_type: 'boo',
                                amount: 2,
                            },
                            utxo: { foo2: 'bar2' },
                            ownerMemo: { bar2: 'foo2' },
                            memoData: 'myMemoData2',
                        };
                        utxoDataList = [notMyItem];
                        return [4 /*yield*/, UtxoHelper.getSendUtxo(myCode, amount, utxoDataList)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty list if requested amount was <= 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myCode, amount, myItem1, myItem2, utxoDataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myCode = 'code1';
                        amount = BigInt(0);
                        myItem1 = {
                            sid: 1,
                            body: {
                                asset_type: myCode,
                                amount: 4,
                            },
                            utxo: { foo1: 'bar1' },
                            ownerMemo: { bar1: 'foo1' },
                            memoData: 'myMemoData1',
                        };
                        myItem2 = {
                            sid: 3,
                            body: {
                                asset_type: myCode,
                                amount: 4,
                            },
                            utxo: { foo2: 'bar2' },
                            ownerMemo: { bar2: 'foo2' },
                            memoData: 'myMemoData1',
                        };
                        utxoDataList = [myItem1, myItem2];
                        return [4 /*yield*/, UtxoHelper.getSendUtxo(myCode, amount, utxoDataList)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('addUtxoInputs', function () {
        it('returns a list of utxo inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amountOne, amountTwo, originAmountOne, originAmountTwo, utxoOutputItemOne, utxoOutputItemTwo, utxoSids, assetRecord, LedgerClientAssetRecord, txoRef, LedgerTxoRef, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson, spyLedgerTxoRef, result, inputParametersList, inputAmount, firstInput, secondInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountOne = 4;
                        amountTwo = 3;
                        originAmountOne = 20;
                        originAmountTwo = 5;
                        utxoOutputItemOne = {
                            amount: BigInt(amountOne),
                            originAmount: BigInt(originAmountOne),
                            sid: 1,
                            utxo: { foo: 'bar1' },
                            ownerMemo: { bar: 'foo1' },
                            memoData: 'myMem1o',
                        };
                        utxoOutputItemTwo = {
                            amount: BigInt(amountTwo),
                            originAmount: BigInt(originAmountTwo),
                            sid: 2,
                            utxo: { foo: 'bar2' },
                            ownerMemo: { bar: 'foo2' },
                            memoData: 'myMemo2',
                        };
                        utxoSids = [utxoOutputItemOne, utxoOutputItemTwo];
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        txoRef = { bar: 'myTxoRef' };
                        LedgerTxoRef = {
                            absolute: jest.fn(function () {
                                return txoRef;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            TxoRef: LedgerTxoRef,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        spyLedgerTxoRef = jest.spyOn(LedgerTxoRef, 'absolute');
                        return [4 /*yield*/, UtxoHelper.addUtxoInputs(utxoSids)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(2, utxoOutputItemTwo.utxo);
                        expect(spyLedgerTxoRef).toHaveBeenNthCalledWith(1, BigInt(utxoOutputItemOne.sid));
                        expect(spyLedgerTxoRef).toHaveBeenNthCalledWith(2, BigInt(utxoOutputItemTwo.sid));
                        inputParametersList = result.inputParametersList, inputAmount = result.inputAmount;
                        expect(inputParametersList).toHaveLength(2);
                        firstInput = inputParametersList[0], secondInput = inputParametersList[1];
                        expect(firstInput).toHaveProperty('txoRef');
                        expect(firstInput).toHaveProperty('assetRecord');
                        expect(firstInput).toHaveProperty('ownerMemo');
                        expect(firstInput).toHaveProperty('amount');
                        expect(firstInput).toHaveProperty('memoData');
                        expect(firstInput).toHaveProperty('sid');
                        expect(firstInput.txoRef).toBe(txoRef);
                        expect(firstInput.assetRecord).toBe(assetRecord);
                        expect(firstInput.ownerMemo).toBe(utxoOutputItemOne.ownerMemo);
                        expect(firstInput.amount).toBe(utxoOutputItemOne.amount);
                        expect(firstInput.memoData).toBe(utxoOutputItemOne.memoData);
                        expect(firstInput.sid).toBe(utxoOutputItemOne.sid);
                        expect(secondInput.amount).toBe(utxoOutputItemTwo.amount);
                        expect(inputAmount).toBe(BigInt(originAmountOne + originAmountTwo));
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        spyLedgerTxoRef.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not open client record from ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amountOne, originAmountOne, utxoOutputItemOne, utxoSids, LedgerClientAssetRecord, txoRef, LedgerTxoRef, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountOne = 4;
                        originAmountOne = 20;
                        utxoOutputItemOne = {
                            amount: BigInt(amountOne),
                            originAmount: BigInt(originAmountOne),
                            sid: 1,
                            utxo: { foo: 'bar1' },
                            ownerMemo: { bar: 'foo1' },
                            memoData: 'myMem1o',
                        };
                        utxoSids = [utxoOutputItemOne];
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        txoRef = { bar: 'myTxoRef' };
                        LedgerTxoRef = {
                            absolute: jest.fn(function () {
                                return txoRef;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            TxoRef: LedgerTxoRef,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        return [4 /*yield*/, expect(UtxoHelper.addUtxoInputs(utxoSids)).rejects.toThrow('Can not get client asset record')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get txo ref from ledger', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amountOne, originAmountOne, utxoOutputItemOne, utxoSids, assetRecord, LedgerClientAssetRecord, LedgerTxoRef, myLedger, spyGetLedger, spyLedgerClientAssetRecordFromJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountOne = 4;
                        originAmountOne = 20;
                        utxoOutputItemOne = {
                            amount: BigInt(amountOne),
                            originAmount: BigInt(originAmountOne),
                            sid: 1,
                            utxo: { foo: 'bar1' },
                            ownerMemo: { bar: 'foo1' },
                            memoData: 'myMem1o',
                        };
                        utxoSids = [utxoOutputItemOne];
                        assetRecord = {
                            a: 'myAssetRecord',
                        };
                        LedgerClientAssetRecord = {
                            from_json: jest.fn(function () {
                                return assetRecord;
                            }),
                        };
                        LedgerTxoRef = {
                            absolute: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            ClientAssetRecord: LedgerClientAssetRecord,
                            TxoRef: LedgerTxoRef,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
                        return [4 /*yield*/, expect(UtxoHelper.addUtxoInputs(utxoSids)).rejects.toThrow('Can not convert given sid id to a BigInt')];
                    case 1:
                        _a.sent();
                        expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
                        spyGetLedger.mockRestore();
                        spyLedgerClientAssetRecordFromJson.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=utxoHelper.spec.js.map