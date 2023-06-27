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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const NetworkApi = __importStar(require("../api/network/network"));
const UtxoHelper = __importStar(require("./utxoHelper"));
const cache_1 = require("../config/cache");
const Sdk_1 = __importDefault(require("../Sdk"));
const factory_1 = __importDefault(require("./cacheStore/factory"));
const NodeLedger = __importStar(require("./ledger/nodeLedger"));
describe('utxoHelper (unit test)', () => {
    describe('decryptUtxoItem', () => {
        it('successfully decrypts an utxo item', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const ownerMemo = {
                b: 'myOwnerMemo',
                clone: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myAssetType = 'myAssetType';
            const decryptAssetData = {
                asset_type: myAssetType,
                amount: '2',
            };
            const decryptedAsetType = 'myDecryptedAsetType';
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerOwnerMemo = {
                from_json: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                OwnerMemo: LedgerOwnerMemo,
                open_client_asset_record: jest.fn(() => {
                    return decryptAssetData;
                }),
                asset_type_from_jsvalue: jest.fn(() => {
                    return decryptedAsetType;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
            const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
            const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
            const memoDataResult = {
                response: { foofoo: 'barbar' },
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            const result = yield UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData);
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
        }));
        it('returns ownerMemo as undefined if no onwner memo data is fetched', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const ownerMemo = {
                b: 'myOwnerMemo',
                clone: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myAssetType = 'myAssetType';
            const decryptAssetData = {
                asset_type: myAssetType,
                amount: '2',
            };
            const decryptedAsetType = 'myDecryptedAsetType';
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerOwnerMemo = {
                from_json: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                OwnerMemo: LedgerOwnerMemo,
                open_client_asset_record: jest.fn(() => {
                    return decryptAssetData;
                }),
                asset_type_from_jsvalue: jest.fn(() => {
                    return decryptedAsetType;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
            const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
            const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
            const memoDataResult = {
                response: undefined,
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            const result = yield UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData);
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
        }));
        it('throws an error if can not open ledger client record from json', () => __awaiter(void 0, void 0, void 0, function* () {
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            yield expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not get client asset record');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
        }));
        it('throws an error if gets an error while trying to get owner memo', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const memoDataResult = {
                error: new Error('foo'),
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            yield expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Could not fetch memo data for sid');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
            expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
            spyGetOwnerMemo.mockRestore();
        }));
        it('throws an error if can not open ledger owner memo from json', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerOwnerMemo = {
                from_json: jest.fn(() => {
                    throw new Error('bum');
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                OwnerMemo: LedgerOwnerMemo,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
            const memoDataResult = {
                response: { foofoo: 'barbar' },
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            yield expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not decode owner memo');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
            expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
            expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
            spyLedgerOwnerMemoFromJson.mockRestore();
            spyGetOwnerMemo.mockRestore();
        }));
        it('throws an error if can not open ledger open_client_asset_record', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const ownerMemo = {
                b: 'myOwnerMemo',
                clone: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerOwnerMemo = {
                from_json: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                OwnerMemo: LedgerOwnerMemo,
                open_client_asset_record: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
            const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
            const memoDataResult = {
                response: { foofoo: 'barbar' },
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            yield expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not open client asset record to decode');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
            expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
            expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
            expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
            spyLedgerOwnerMemoFromJson.mockRestore();
            spyLedgerOpenClientAssetRecord.mockRestore();
            spyGetOwnerMemo.mockRestore();
        }));
        it('throws an error if can not open ledger open_client_asset_record', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const ownerMemo = {
                b: 'myOwnerMemo',
                clone: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myAssetType = 'myAssetType';
            const decryptAssetData = {
                asset_type: myAssetType,
                amount: '2',
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerOwnerMemo = {
                from_json: jest.fn(() => {
                    return ownerMemo;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                OwnerMemo: LedgerOwnerMemo,
                open_client_asset_record: jest.fn(() => {
                    return decryptAssetData;
                }),
                asset_type_from_jsvalue: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
            const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
            const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
            const memoDataResult = {
                response: { foofoo: 'barbar' },
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const sid = 123;
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const utxoData = {
                utxo: {
                    utxoKey: 'utxoVal',
                },
            };
            const memoData = {
                bar: 'foo',
            };
            yield expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow('Can not decrypt asset type');
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
        }));
    });
    describe('getUtxoItem', () => {
        it('returns an utxo item without cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const sid = 123;
            const utxoData = {
                myKey: 'myValue',
            };
            const utxoDataResult = {
                response: utxoData,
            };
            const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataResult);
            });
            const memoData = { foofoo: 'barbar' };
            const memoDataResult = {
                response: memoData,
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const item = {
                myKeyUtxo: 'myValueUtxo',
            };
            const spyDecryptUtxoItem = jest.spyOn(UtxoHelper, 'decryptUtxoItem').mockImplementation(() => {
                return Promise.resolve(item);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const result = yield UtxoHelper.getUtxoItem(sid, walletInfo);
            expect(spyGetUtxo).toHaveBeenCalledWith(sid);
            expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
            expect(spyDecryptUtxoItem).toHaveBeenCalledWith(sid, walletInfo, utxoData, memoData);
            expect(result).toBe(item);
            spyGetUtxo.mockRestore();
            spyGetOwnerMemo.mockRestore();
            spyDecryptUtxoItem.mockRestore();
        }));
        it('returns a cached utxo item', () => __awaiter(void 0, void 0, void 0, function* () {
            const sid = 123;
            const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo');
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const cachedItem = { foo: 'bar ' };
            const result = yield UtxoHelper.getUtxoItem(sid, walletInfo, cachedItem);
            expect(spyGetUtxo).not.toHaveBeenCalledWith(sid);
            expect(result).toBe(cachedItem);
            spyGetUtxo.mockRestore();
        }));
        it('throws an error if failed to fetch utxo data and got error in the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const sid = 123;
            const utxoDataResult = {
                error: new Error('foo'),
            };
            const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataResult);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            yield expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch utxo data for sid');
            spyGetUtxo.mockRestore();
        }));
        it('throws an error if failed to fetch utxo data and got no response', () => __awaiter(void 0, void 0, void 0, function* () {
            const sid = 123;
            const utxoDataResult = {};
            const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataResult);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            yield expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch utxo data for sid');
            spyGetUtxo.mockRestore();
        }));
        it('throws an error if failed to fetch memo data and got error in the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const sid = 123;
            const utxoData = {
                myKey: 'myValue',
            };
            const utxoDataResult = {
                response: utxoData,
            };
            const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataResult);
            });
            const memoDataResult = {
                error: new Error('foo'),
            };
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve(memoDataResult);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            yield expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow('Could not fetch memo data for sid');
            spyGetUtxo.mockRestore();
            spyGetOwnerMemo.mockRestore();
        }));
    });
    describe('addUtxo', () => {
        it('creates a utxoDataList', () => __awaiter(void 0, void 0, void 0, function* () {
            const utxoDataCache = {
                sid_1: {
                    foo: 'bar',
                },
            };
            const spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(() => {
                return Promise.resolve(utxoDataCache);
            });
            const item = {
                sid: 1,
            };
            const spyGetUtxoItem = jest.spyOn(UtxoHelper, 'getUtxoItem').mockImplementation(() => {
                return Promise.resolve(item);
            });
            const addSids = [1];
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const cacheDataToSave = {
                sid_1: item,
            };
            const spyCacheWrite = jest.spyOn(factory_1.default, 'write').mockImplementation(() => {
                return Promise.resolve(true);
            });
            const fullPathToCacheEntry = `${Sdk_1.default.environment.cachePath}/${cache_1.CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;
            const result = yield UtxoHelper.addUtxo(walletInfo, addSids);
            expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
            expect(spyGetUtxoItem).toBeCalledWith(addSids[0], walletInfo, utxoDataCache.sid_1);
            expect(spyCacheWrite).toBeCalledWith(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider);
            expect(result).toStrictEqual([item]);
            spyCacheRead.mockRestore();
            spyGetUtxoItem.mockRestore();
            spyCacheWrite.mockRestore();
        }));
        it('throws an error when can not read cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(() => {
                throw new Error('aa');
            });
            const addSids = [1];
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const fullPathToCacheEntry = `${Sdk_1.default.environment.cachePath}/${cache_1.CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;
            yield expect(UtxoHelper.addUtxo(walletInfo, addSids)).rejects.toThrow('Error reading the cache');
            expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
            spyCacheRead.mockRestore();
        }));
        it('skips a sid if it can not get its utxo item', () => __awaiter(void 0, void 0, void 0, function* () {
            const utxoDataCache = {
                sid_1: {
                    foo1: 'bar2',
                },
                sid_2: {
                    foo2: 'bar2',
                },
            };
            const spyCacheRead = jest.spyOn(factory_1.default, 'read').mockImplementation(() => {
                return Promise.resolve(utxoDataCache);
            });
            const item = {
                sid: 2,
            };
            const spyGetUtxoItem = jest
                .spyOn(UtxoHelper, 'getUtxoItem')
                .mockImplementationOnce(() => {
                throw new Error('boom');
            })
                .mockImplementationOnce(() => {
                return Promise.resolve(item);
            });
            const addSids = [1, 2];
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const cacheDataToSave = {
                sid_2: item,
            };
            const spyCacheWrite = jest.spyOn(factory_1.default, 'write').mockImplementation(() => {
                return Promise.resolve(true);
            });
            const fullPathToCacheEntry = `${Sdk_1.default.environment.cachePath}/${cache_1.CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;
            const result = yield UtxoHelper.addUtxo(walletInfo, addSids);
            expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
            expect(spyGetUtxoItem).toHaveBeenNthCalledWith(1, addSids[0], walletInfo, utxoDataCache.sid_1);
            expect(spyGetUtxoItem).toHaveBeenNthCalledWith(2, addSids[1], walletInfo, utxoDataCache.sid_2);
            expect(spyCacheWrite).toBeCalledWith(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider);
            expect(result).toStrictEqual([item]);
            expect(result).toHaveLength(1);
            spyCacheRead.mockRestore();
            spyGetUtxoItem.mockRestore();
            spyCacheWrite.mockRestore();
        }));
    });
    describe('getSendUtxo', () => {
        it('returns a single utxo if its amount bigger than requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const myCode = 'code1';
            const amount = BigInt(4);
            const myItem1 = {
                sid: 1,
                body: {
                    asset_type: myCode,
                    amount: 5,
                },
                utxo: { foo1: 'bar1' },
                ownerMemo: { bar1: 'foo1' },
                memoData: 'myMemoData1',
            };
            const myItem2 = {
                sid: 3,
                body: {
                    asset_type: myCode,
                    amount: 4,
                },
                utxo: { foo2: 'bar2' },
                ownerMemo: { bar2: 'foo2' },
                memoData: 'myMemoData1',
            };
            const utxoDataList = [myItem1, myItem2];
            const result = yield UtxoHelper.getSendUtxo(myCode, amount, utxoDataList);
            expect(result).toHaveLength(1);
            expect(result).toStrictEqual([
                {
                    amount,
                    originAmount: BigInt(myItem1.body.amount),
                    sid: myItem1.sid,
                    utxo: myItem1.utxo,
                    ownerMemo: myItem1.ownerMemo,
                    memoData: myItem1.memoData,
                },
            ]);
        }));
        it('returns a single utxo if its amount equals to what was requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const myCode = 'code1';
            const amount = BigInt(4);
            const myItem1 = {
                sid: 1,
                body: {
                    asset_type: myCode,
                    amount: 4,
                },
                utxo: { foo1: 'bar1' },
                ownerMemo: { bar1: 'foo1' },
                memoData: 'myMemoData1',
            };
            const myItem2 = {
                sid: 3,
                body: {
                    asset_type: myCode,
                    amount: 4,
                },
                utxo: { foo2: 'bar2' },
                ownerMemo: { bar2: 'foo2' },
                memoData: 'myMemoData1',
            };
            const utxoDataList = [myItem1, myItem2];
            const result = yield UtxoHelper.getSendUtxo(myCode, amount, utxoDataList);
            expect(result).toHaveLength(1);
            expect(result).toStrictEqual([
                {
                    amount,
                    originAmount: BigInt(myItem1.body.amount),
                    sid: myItem1.sid,
                    utxo: myItem1.utxo,
                    ownerMemo: myItem1.ownerMemo,
                    memoData: myItem1.memoData,
                },
            ]);
        }));
        it('returns a a list of utxo with the amount equals to what was requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const myCode = 'code1';
            const amount = BigInt(4);
            const myItem1 = {
                sid: 1,
                body: {
                    asset_type: myCode,
                    amount: 2,
                },
                utxo: { foo1: 'bar1' },
                ownerMemo: { bar1: 'foo1' },
                memoData: 'myMemoData1',
            };
            const myItem2 = {
                sid: 2,
                body: {
                    asset_type: myCode,
                    amount: 1,
                },
                utxo: { foo2: 'bar2' },
                ownerMemo: { bar2: 'foo2' },
                memoData: 'myMemoData2',
            };
            const myItem3 = {
                sid: 1,
                body: {
                    asset_type: myCode,
                    amount: 5,
                },
                utxo: { foo3: 'bar3' },
                ownerMemo: { bar3: 'foo3' },
                memoData: 'myMemoData3',
            };
            const myItem4 = {
                sid: 4,
                body: {
                    asset_type: myCode,
                    amount: 2,
                },
                utxo: { foo4: 'bar4' },
                ownerMemo: { bar4: 'foo4' },
                memoData: 'myMemoData4',
            };
            const utxoDataList = [myItem1, myItem2, myItem3, myItem4];
            const result = yield UtxoHelper.getSendUtxo(myCode, amount, utxoDataList);
            expect(result).toHaveLength(3);
            const [firstUtxo, secondUtxo, thirdUtxo] = result;
            const totalReturnedAmount = Number(firstUtxo.amount) + Number(secondUtxo.amount) + Number(thirdUtxo.amount);
            expect(amount).toBe(BigInt(totalReturnedAmount));
        }));
        it('skips utxo which do not have requested code', () => __awaiter(void 0, void 0, void 0, function* () {
            const myCode = 'code1';
            const amount = BigInt(4);
            const notMyItem = {
                sid: 2,
                body: {
                    asset_type: 'boo',
                    amount: 2,
                },
                utxo: { foo2: 'bar2' },
                ownerMemo: { bar2: 'foo2' },
                memoData: 'myMemoData2',
            };
            const utxoDataList = [notMyItem];
            const result = yield UtxoHelper.getSendUtxo(myCode, amount, utxoDataList);
            expect(result).toHaveLength(0);
        }));
        it('returns an empty list if requested amount was <= 0', () => __awaiter(void 0, void 0, void 0, function* () {
            const myCode = 'code1';
            const amount = BigInt(0);
            const myItem1 = {
                sid: 1,
                body: {
                    asset_type: myCode,
                    amount: 4,
                },
                utxo: { foo1: 'bar1' },
                ownerMemo: { bar1: 'foo1' },
                memoData: 'myMemoData1',
            };
            const myItem2 = {
                sid: 3,
                body: {
                    asset_type: myCode,
                    amount: 4,
                },
                utxo: { foo2: 'bar2' },
                ownerMemo: { bar2: 'foo2' },
                memoData: 'myMemoData1',
            };
            const utxoDataList = [myItem1, myItem2];
            const result = yield UtxoHelper.getSendUtxo(myCode, amount, utxoDataList);
            expect(result).toHaveLength(0);
        }));
    });
    describe('addUtxoInputs', () => {
        it('returns a list of utxo inputs', () => __awaiter(void 0, void 0, void 0, function* () {
            const amountOne = 4;
            const amountTwo = 3;
            const originAmountOne = 20;
            const originAmountTwo = 5;
            const utxoOutputItemOne = {
                amount: BigInt(amountOne),
                originAmount: BigInt(originAmountOne),
                sid: 1,
                utxo: { foo: 'bar1' },
                ownerMemo: { bar: 'foo1' },
                memoData: 'myMem1o',
            };
            const utxoOutputItemTwo = {
                amount: BigInt(amountTwo),
                originAmount: BigInt(originAmountTwo),
                sid: 2,
                utxo: { foo: 'bar2' },
                ownerMemo: { bar: 'foo2' },
                memoData: 'myMemo2',
            };
            const utxoSids = [utxoOutputItemOne, utxoOutputItemTwo];
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const txoRef = { bar: 'myTxoRef' };
            const LedgerTxoRef = {
                absolute: jest.fn(() => {
                    return txoRef;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                TxoRef: LedgerTxoRef,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            const spyLedgerTxoRef = jest.spyOn(LedgerTxoRef, 'absolute');
            const result = yield UtxoHelper.addUtxoInputs(utxoSids);
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(2, utxoOutputItemTwo.utxo);
            expect(spyLedgerTxoRef).toHaveBeenNthCalledWith(1, BigInt(utxoOutputItemOne.sid));
            expect(spyLedgerTxoRef).toHaveBeenNthCalledWith(2, BigInt(utxoOutputItemTwo.sid));
            const { inputParametersList, inputAmount } = result;
            expect(inputParametersList).toHaveLength(2);
            const [firstInput, secondInput] = inputParametersList;
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
        }));
        it('throws an error if it can not open client record from ledger', () => __awaiter(void 0, void 0, void 0, function* () {
            const amountOne = 4;
            const originAmountOne = 20;
            const utxoOutputItemOne = {
                amount: BigInt(amountOne),
                originAmount: BigInt(originAmountOne),
                sid: 1,
                utxo: { foo: 'bar1' },
                ownerMemo: { bar: 'foo1' },
                memoData: 'myMem1o',
            };
            const utxoSids = [utxoOutputItemOne];
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const txoRef = { bar: 'myTxoRef' };
            const LedgerTxoRef = {
                absolute: jest.fn(() => {
                    return txoRef;
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                TxoRef: LedgerTxoRef,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            yield expect(UtxoHelper.addUtxoInputs(utxoSids)).rejects.toThrow('Can not get client asset record');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
        }));
        it('throws an error if it can not get txo ref from ledger', () => __awaiter(void 0, void 0, void 0, function* () {
            const amountOne = 4;
            const originAmountOne = 20;
            const utxoOutputItemOne = {
                amount: BigInt(amountOne),
                originAmount: BigInt(originAmountOne),
                sid: 1,
                utxo: { foo: 'bar1' },
                ownerMemo: { bar: 'foo1' },
                memoData: 'myMem1o',
            };
            const utxoSids = [utxoOutputItemOne];
            const assetRecord = {
                a: 'myAssetRecord',
            };
            const LedgerClientAssetRecord = {
                from_json: jest.fn(() => {
                    return assetRecord;
                }),
            };
            const LedgerTxoRef = {
                absolute: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const myLedger = {
                foo: 'node',
                ClientAssetRecord: LedgerClientAssetRecord,
                TxoRef: LedgerTxoRef,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
            yield expect(UtxoHelper.addUtxoInputs(utxoSids)).rejects.toThrow('Can not convert given sid id to a BigInt');
            expect(spyLedgerClientAssetRecordFromJson).toHaveBeenNthCalledWith(1, utxoOutputItemOne.utxo);
            spyGetLedger.mockRestore();
            spyLedgerClientAssetRecordFromJson.mockRestore();
        }));
    });
});
//# sourceMappingURL=utxoHelper.spec.js.map