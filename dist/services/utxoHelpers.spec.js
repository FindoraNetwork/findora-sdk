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
/* eslint-disable @typescript-eslint/naming-convention */
require("@testing-library/jest-dom/extend-expect");
var msw_1 = require("msw");
var node_1 = require("msw/node");
var api_1 = require("../api");
var cache_1 = require("../config/cache");
var Sdk_1 = __importDefault(require("../Sdk"));
var factory_1 = __importDefault(require("./cacheStore/factory"));
var providers_1 = require("./cacheStore/providers");
var utxoHelper = __importStar(require("./utxoHelper"));
var myDefaultResult = [
    {
        foo: 'bar',
    },
    {
        barfoo: 'foobar',
    },
];
var defaultUrl = "https://foo.com";
var server = node_1.setupServer(msw_1.rest.get(defaultUrl, function (_req, res, ctx) {
    return res(ctx.json(myDefaultResult));
}));
beforeAll(function () { return server.listen(); });
afterEach(function () { return server.resetHandlers(); });
afterAll(function () { return server.close(); });
describe('utxoHelpers', function () {
    var pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
    var password = '123';
    var hostUrl = 'https://foo.bar';
    var sid = 454;
    var sdkEnv = {
        hostUrl: hostUrl,
        cacheProvider: providers_1.MemoryCacheProvider,
        cachePath: '.',
    };
    Sdk_1.default.init(sdkEnv);
    var myMemoResponse = null;
    var memoUrl = hostUrl + ":8667/get_owner_memo/" + sid;
    var utxoUrl = hostUrl + ":8668/utxo_sid/" + sid;
    var nonConfidentialAssetType = {
        NonConfidential: [
            164,
            219,
            150,
            105,
            103,
            223,
            148,
            3,
            154,
            18,
            158,
            146,
            195,
            186,
            148,
            245,
            191,
            206,
            45,
            215,
            251,
            136,
            179,
            245,
            227,
            140,
            98,
            176,
            190,
            60,
            175,
            224,
        ],
    };
    describe('decryptUtxoItem', function () {
        it('returns decrypted utxo with no confidential data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, myUtxoResponse, walletInfo, utxoItem, body, utxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse)];
                    case 2:
                        utxoItem = _a.sent();
                        expect(utxoItem).toHaveProperty('address');
                        expect(utxoItem).toHaveProperty('sid');
                        expect(utxoItem).toHaveProperty('body');
                        expect(utxoItem).toHaveProperty('utxo');
                        expect(utxoItem.address).toBe(walletInfo.address);
                        expect(utxoItem.sid).toBe(sid);
                        body = utxoItem.body, utxo = utxoItem.utxo;
                        expect(body.amount).toBe(BigInt(40000));
                        expect(utxo).toEqual(myUtxo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns decrypted utxo with confidential amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var confidentialAmount, nonConfidentialAssetTypeForConfidentialAmount, myUtxoRecord, myUtxo, myUtxoResponse, walletInfo, myMemoResponse, utxoItem, body, utxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confidentialAmount = {
                            Confidential: [
                                'GrOFu0uL12arzxX0VX_OzWUcD6EVrFylYaMxW655J1Q=',
                                '2qEe9-g-_QU37Zo9ORntvWNMIgStcPwMU4M7xInaMDw=',
                            ],
                        };
                        nonConfidentialAssetTypeForConfidentialAmount = {
                            NonConfidential: [
                                34,
                                181,
                                173,
                                185,
                                119,
                                123,
                                217,
                                243,
                                157,
                                237,
                                25,
                                202,
                                18,
                                58,
                                14,
                                226,
                                238,
                                14,
                                199,
                                207,
                                135,
                                224,
                                166,
                                72,
                                217,
                                192,
                                39,
                                190,
                                208,
                                246,
                                125,
                                30,
                            ],
                        };
                        myUtxoRecord = {
                            amount: confidentialAmount,
                            asset_type: nonConfidentialAssetTypeForConfidentialAmount,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        myMemoResponse = {
                            blind_share: 'RcBYIEfTHDkcN1FyZQcs6njZJDIcg77Z5__n0Akw2rU=',
                            lock: {
                                ciphertext: 'aQ4xI7bTJ9M=',
                                ephemeral_public_key: 'at5YwOCjADbFAKkp2GTTVu_jbOSpEP9yVLREXvjQGi8=',
                            },
                        };
                        return [4 /*yield*/, utxoHelper.decryptUtxoItem(123, walletInfo, myUtxoResponse, myMemoResponse)];
                    case 2:
                        utxoItem = _a.sent();
                        expect(utxoItem).toHaveProperty('address');
                        expect(utxoItem).toHaveProperty('sid');
                        expect(utxoItem).toHaveProperty('body');
                        expect(utxoItem).toHaveProperty('utxo');
                        expect(utxoItem.address).toBe(walletInfo.address);
                        expect(utxoItem.sid).toBe(123);
                        body = utxoItem.body, utxo = utxoItem.utxo;
                        expect(body.amount).toBe(BigInt(5000000)); //
                        expect(body.amount_blinds.length).toBe(2); //
                        expect(utxo).toEqual(myUtxo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if failed to get client asset record', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, myUtxoResponse, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'aa',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, expect(utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse)).rejects.toThrowError('Can not get client asset record')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if failed to decode owner memo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, myUtxoResponse, myMemo, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        myMemo = {
                            blind_share: '2',
                            lock: {
                                ciphertext: 'foo',
                                ephemeral_public_key: 'bar',
                            },
                        };
                        return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, expect(utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse, myMemo)).rejects.toThrowError('Can not decode owner memo')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when cant open client asset record to decode', function () { return __awaiter(void 0, void 0, void 0, function () {
            var confidentialAmount, nonConfidentialAssetTypeForConfidentialAmount, myUtxoRecord, myUtxo, myUtxoResponse, walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confidentialAmount = {
                            Confidential: [
                                'GrOFu0uL12arzxX0VX_OzWUcD6EVrFylYaMxW655J1Q=',
                                '2qEe9-g-_QU37Zo9ORntvWNMIgStcPwMU4M7xInaMDw=',
                            ],
                        };
                        nonConfidentialAssetTypeForConfidentialAmount = {
                            NonConfidential: [
                                34,
                                181,
                                173,
                                185,
                                119,
                                123,
                                217,
                                243,
                                157,
                                237,
                                25,
                                202,
                                18,
                                58,
                                14,
                                226,
                                238,
                                14,
                                199,
                                207,
                                135,
                                224,
                                166,
                                72,
                                217,
                                192,
                                39,
                                190,
                                208,
                                246,
                                125,
                                30,
                            ],
                        };
                        myUtxoRecord = {
                            amount: confidentialAmount,
                            asset_type: nonConfidentialAssetTypeForConfidentialAmount,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, expect(utxoHelper.decryptUtxoItem(123, walletInfo, myUtxoResponse)).rejects.toThrowError('Can not open client asset record to decode')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUtxoItem', function () {
        var myUtxoRecord = {
            amount: { NonConfidential: '40000' },
            asset_type: nonConfidentialAssetType,
            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
        };
        var myUtxo = {
            id: 1,
            record: myUtxoRecord,
        };
        var myUtxoResponse = {
            utxo: myUtxo,
        };
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, utxoItem, body, utxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        server.use(msw_1.rest.get(utxoUrl, function (_req, res, ctx) {
                            return res(ctx.json(myUtxoResponse));
                        }), msw_1.rest.get(memoUrl, function (_req, res, ctx) {
                            return res(ctx.json(myMemoResponse));
                        }));
                        return [4 /*yield*/, utxoHelper.getUtxoItem(sid, walletInfo)];
                    case 2:
                        utxoItem = _a.sent();
                        expect(utxoItem).toHaveProperty('address');
                        expect(utxoItem).toHaveProperty('sid');
                        expect(utxoItem).toHaveProperty('body');
                        expect(utxoItem).toHaveProperty('utxo');
                        expect(utxoItem.address).toBe(walletInfo.address);
                        expect(utxoItem.sid).toBe(sid);
                        body = utxoItem.body, utxo = utxoItem.utxo;
                        expect(body.amount).toBe(BigInt(40000));
                        expect(utxo).toEqual(myUtxo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it cant fech utxo data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        server.use(msw_1.rest.get(utxoUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, expect(utxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrowError("Could not fetch utxo data for sid \"" + sid + "\"")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it cant fech memo data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        server.use(msw_1.rest.get(utxoUrl, function (_req, res, ctx) {
                            return res(ctx.json(myUtxoResponse));
                        }), msw_1.rest.get(memoUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, expect(utxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrowError("Could not fetch memo data for sid \"" + sid + "\"")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('addUtxo', function () {
        var myUtxoRecord = {
            amount: { NonConfidential: '40000' },
            asset_type: nonConfidentialAssetType,
            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
        };
        var myUtxo = {
            id: 1,
            record: myUtxoRecord,
        };
        var myUtxoResponse = {
            utxo: myUtxo,
        };
        server.use(msw_1.rest.get(utxoUrl, function (_req, res, ctx) {
            return res(ctx.json(myUtxoResponse));
        }), msw_1.rest.get(memoUrl, function (_req, res, ctx) {
            return res(ctx.json(myMemoResponse));
        }));
        it('return a list with utxo items', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, utxoDataCache, sids, spyGetUtxoItem, spyCacheProviderRead, utxoDataList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, factory_1.default.read("./test_utxo_fixture_list.json", providers_1.FileCacheProvider)];
                    case 2:
                        utxoDataCache = _a.sent();
                        return [4 /*yield*/, factory_1.default.write("./" + cache_1.CACHE_ENTRIES.UTXO_DATA + "_" + walletInfo.address + ".json", utxoDataCache, providers_1.MemoryCacheProvider)];
                    case 3:
                        _a.sent();
                        sids = [sid, sid];
                        spyGetUtxoItem = jest.spyOn(utxoHelper, 'getUtxoItem');
                        spyCacheProviderRead = jest.spyOn(providers_1.MemoryCacheProvider, 'read');
                        spyCacheProviderRead.mockReturnValue(Promise.resolve({ foo: 'bar', sid_454: { sid: sid } }));
                        return [4 /*yield*/, utxoHelper.addUtxo(walletInfo, sids)];
                    case 4:
                        utxoDataList = _a.sent();
                        expect(spyCacheProviderRead).toHaveBeenCalledTimes(1);
                        expect(spyGetUtxoItem).toHaveBeenCalledTimes(2);
                        expect(utxoDataList.length).toEqual(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if fails to read the cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, sids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        sids = [sid];
                        jest.spyOn(factory_1.default, 'read').mockRejectedValue(new Error('barfoo'));
                        return [4 /*yield*/, expect(utxoHelper.addUtxo(walletInfo, sids)).rejects.toThrowError("Error reading the cache, \"barfoo\"")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('continues iterating through sids if it cant fetch utxo for a giving sid, and skips it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, sids, utxoDataList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        sids = [sid, sid];
                        jest.spyOn(factory_1.default, 'read').mockReturnValue(Promise.resolve({ foo: 'bar', sid_454: { sid: sid } }));
                        jest.spyOn(utxoHelper, 'getUtxoItem').mockRejectedValueOnce(new Error('barfoo'));
                        return [4 /*yield*/, utxoHelper.addUtxo(walletInfo, sids)];
                    case 2:
                        utxoDataList = _a.sent();
                        expect(utxoDataList.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSendUtxo', function () {
        it('returns a list with three items', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 4,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 2,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 1,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 10,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 3,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 13,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(13);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(3);
            var first = sendUtxoList[0], second = sendUtxoList[1], third = sendUtxoList[2];
            expect(first.amount).toEqual(BigInt(2));
            expect(first.sid).toEqual(4);
            expect(second.amount).toEqual(BigInt(10));
            expect(second.sid).toEqual(1);
            expect(third.amount).toEqual(BigInt(1));
            expect(third.sid).toEqual(2);
        });
        it('returns a list with two items', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 1,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 10,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 3,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 13,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 4,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 2,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(13);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(2);
            var first = sendUtxoList[0], second = sendUtxoList[1];
            expect(first.amount).toEqual(BigInt(10));
            expect(first.sid).toEqual(1);
            expect(second.amount).toEqual(BigInt(3));
            expect(second.sid).toEqual(2);
        });
        it('returns an list with one item', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 3,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 13,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 4,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 2,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 1,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 10,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(10);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(1);
            var first = sendUtxoList[0];
            expect(first.amount).toEqual(BigInt(10));
            expect(first.sid).toEqual(2);
        });
        it('returns an empty for an unexisting code', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCodeOne',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 3,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCodeTwo',
                        amount: 13,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(10);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(0);
        });
        it('returns a list with three items skiping other asset codes', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 1,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 10,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 4,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCodeOne',
                        amount: 2,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
                {
                    sid: 3,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 13,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(25);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(3);
            var first = sendUtxoList[0], second = sendUtxoList[1], third = sendUtxoList[2];
            expect(first.amount).toEqual(BigInt(10));
            expect(first.sid).toEqual(1);
            expect(second.amount).toEqual(BigInt(12));
            expect(second.sid).toEqual(2);
            expect(third.amount).toEqual(BigInt(3));
            expect(third.sid).toEqual(3);
        });
        it('returns an empty for a given zero amount', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(0);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(0);
        });
        it('returns a single item list for amount less than sid amount', function () {
            var myUtxoRecord = {
                amount: { NonConfidential: '40000' },
                asset_type: nonConfidentialAssetType,
                public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
            };
            var myUtxo = {
                id: 1,
                record: myUtxoRecord,
            };
            var myUtxoDataList = [
                {
                    sid: 2,
                    public_key: 'foo',
                    address: 'bar',
                    body: {
                        asset_type: 'myAssetCode',
                        amount: 12,
                    },
                    ownerMemo: undefined,
                    memoData: undefined,
                    utxo: myUtxo,
                },
            ];
            var myAmount = BigInt(1);
            var sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);
            expect(sendUtxoList.length).toEqual(1);
            var first = sendUtxoList[0];
            expect(first.amount).toEqual(BigInt(1));
            expect(first.sid).toEqual(2);
        });
    });
    describe('addUtxoInputs', function () {
        it('returns a proper list with utxo inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, mySendUtxoList, utxoInputsInfo, inputAmount, inputParametersList, first, second;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        mySendUtxoList = [
                            {
                                amount: BigInt(1),
                                originAmount: BigInt(100),
                                sid: 1,
                                utxo: myUtxo,
                                ownerMemo: undefined,
                                memoData: undefined,
                            },
                            {
                                amount: BigInt(2),
                                originAmount: BigInt(5),
                                sid: 2,
                                utxo: myUtxo,
                                ownerMemo: undefined,
                                memoData: undefined,
                            },
                        ];
                        return [4 /*yield*/, utxoHelper.addUtxoInputs(mySendUtxoList)];
                    case 1:
                        utxoInputsInfo = _a.sent();
                        expect(utxoInputsInfo).toHaveProperty('inputParametersList');
                        expect(utxoInputsInfo).toHaveProperty('inputAmount');
                        inputAmount = utxoInputsInfo.inputAmount, inputParametersList = utxoInputsInfo.inputParametersList;
                        expect(inputAmount).toEqual(BigInt(105));
                        expect(inputParametersList.length).toEqual(2);
                        first = inputParametersList[0], second = inputParametersList[1];
                        expect(first.amount).toEqual(BigInt(1));
                        expect(second.amount).toEqual(BigInt(2));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an empty list for a given send utxo list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySendUtxoList, utxoInputsInfo, inputAmount, inputParametersList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySendUtxoList = [];
                        return [4 /*yield*/, utxoHelper.addUtxoInputs(mySendUtxoList)];
                    case 1:
                        utxoInputsInfo = _a.sent();
                        expect(utxoInputsInfo).toHaveProperty('inputParametersList');
                        expect(utxoInputsInfo).toHaveProperty('inputAmount');
                        inputAmount = utxoInputsInfo.inputAmount, inputParametersList = utxoInputsInfo.inputParametersList;
                        expect(inputAmount).toEqual(BigInt(0));
                        expect(inputParametersList.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when fails to get txRef', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, myItem, mySendUtxoList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myItem = {
                            amount: BigInt(1),
                            originAmount: BigInt(100),
                            sid: Number('foobar'),
                            utxo: myUtxo,
                            ownerMemo: undefined,
                            memoData: undefined,
                        };
                        mySendUtxoList = [myItem];
                        return [4 /*yield*/, expect(utxoHelper.addUtxoInputs(mySendUtxoList)).rejects.toThrowError('Cannot convert given sid id to a BigInt')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when fails to get txRef', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxoRecord, myUtxo, myItem, mySendUtxoList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxoRecord = {
                            amount: { NonConfidential: '40000' },
                            asset_type: nonConfidentialAssetType,
                            public_key: 'barfoo=',
                        };
                        myUtxo = {
                            id: 1,
                            record: myUtxoRecord,
                        };
                        myItem = {
                            amount: BigInt(1),
                            originAmount: BigInt(100),
                            sid: 1,
                            utxo: myUtxo,
                            ownerMemo: undefined,
                            memoData: undefined,
                        };
                        mySendUtxoList = [myItem];
                        return [4 /*yield*/, expect(utxoHelper.addUtxoInputs(mySendUtxoList)).rejects.toThrowError('Can not get client asset record')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=utxoHelpers.spec.js.map