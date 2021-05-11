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
require("@testing-library/jest-dom/extend-expect");
var msw_1 = require("msw");
var node_1 = require("msw/node");
var Keypair = __importStar(require("../../api/keypair"));
var bigNumber = __importStar(require("../../services/bigNumber"));
var utxoHelper = __importStar(require("../../services/utxoHelper"));
var Account = __importStar(require("./account"));
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
describe('account', function () {
    var pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
    var password = '123';
    var sids = [454];
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
                amount: 200000,
            },
            ownerMemo: undefined,
            utxo: myUtxo,
        },
        {
            sid: 1,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCodeTwo',
                amount: 10,
            },
            ownerMemo: undefined,
            utxo: myUtxo,
        },
        {
            sid: 2,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCode',
                amount: 1,
            },
            ownerMemo: undefined,
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
            utxo: myUtxo,
        },
    ];
    describe('getAssetBalance', function () {
        it('returns asset balance for first code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, spyAddUtxo, balanceInWei, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
                        return [4 /*yield*/, Account.getAssetBalance(walletInfo, 'myAssetCode', sids)];
                    case 2:
                        balanceInWei = _a.sent();
                        balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                        expect(balance).toEqual('0.200001');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset balance for second code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, spyAddUtxo, balanceInWei, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
                        return [4 /*yield*/, Account.getAssetBalance(walletInfo, 'myAssetCodeTwo', sids)];
                    case 2:
                        balanceInWei = _a.sent();
                        balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                        expect(balance).toEqual('0.000023');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset balance if no sid with the given code exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, spyAddUtxo, balanceInWei, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
                        return [4 /*yield*/, Account.getAssetBalance(walletInfo, 'nonExistingCode', sids)];
                    case 2:
                        balanceInWei = _a.sent();
                        balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                        expect(balance).toEqual('0.000000');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset balance if sids list is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, spyAddUtxo, balanceInWei, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValue(Promise.resolve([]));
                        return [4 /*yield*/, Account.getAssetBalance(walletInfo, 'nonExistingCode', [])];
                    case 2:
                        balanceInWei = _a.sent();
                        balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                        expect(balance).toEqual('0.000000');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not get utxoDataList', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, spyAddUtxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValue(Promise.reject(new Error('foo')));
                        return [4 /*yield*/, expect(Account.getAssetBalance(walletInfo, 'nonExistingCode', [])).rejects.toThrowError('Could not get list of addUtxo')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBalance', function () {
        it('returns asset balance for first code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, url, spyAddUtxo, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        url = "https://dev-staging.dev.findora.org:8667/get_owned_utxos/" + walletInfo.publickey;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(sids));
                        }));
                        spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
                        spyAddUtxo.mockReturnValueOnce(Promise.resolve(myUtxoDataList));
                        return [4 /*yield*/, Account.getBalance(walletInfo, 'myAssetCode')];
                    case 2:
                        balance = _a.sent();
                        expect(balance).toEqual('0.200001');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when no sids were fetched', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        url = "https://dev-staging.dev.findora.org:8667/get_owned_utxos/" + walletInfo.publickey;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError('No sids were fetched')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when getAssetBalance throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo, publickey, url, spyAddUtxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Keypair.restorePrivatekeypair(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        publickey = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=';
                        url = "https://dev-staging.dev.findora.org:8667/get_owned_utxos/" + publickey;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(sids));
                        }));
                        spyAddUtxo = jest.spyOn(Account, 'getAssetBalance');
                        spyAddUtxo.mockImplementation(function () {
                            throw new Error('boo');
                        });
                        return [4 /*yield*/, expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError('Could not fetch balance for')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=account.spec.js.map