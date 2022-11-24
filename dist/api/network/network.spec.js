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
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var msw_1 = require("msw");
var node_1 = require("msw/node");
var Sdk_1 = __importDefault(require("../../Sdk"));
var providers_1 = require("../../services/cacheStore/providers");
var network = __importStar(require("./network"));
var myDefaultResult = [
    {
        foo: 'bar',
    },
    {
        barfoo: 'foobar',
    },
];
var defaultUrl = "https://foo.com";
var server = (0, node_1.setupServer)(msw_1.rest.get(defaultUrl, function (_req, res, ctx) {
    return res(ctx.json(myDefaultResult));
}));
beforeAll(function () { return server.listen(); });
afterEach(function () { return server.resetHandlers(); });
afterAll(function () { return server.close(); });
describe('network (unit test)', function () {
    var testConfig = {
        headers: {
            testHeader: 'test-value',
        },
    };
    var hostUrl = 'https://foo.bar';
    var sdkEnv = {
        hostUrl: hostUrl,
        cacheProvider: providers_1.MemoryCacheProvider,
        cachePath: '.',
    };
    Sdk_1.default.init(sdkEnv);
    describe('apiPost', function () {
        var data = { foo: 'bar' };
        var myHandle = 'foobar';
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.json(myHandle));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, data, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toEqual('foobar');
                        return [2 /*return*/];
                }
            });
        }); });
        it('makes a call with no data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.json(myHandle));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, undefined, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        response = dataResult.response;
                        expect(response).toEqual('foobar');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, data, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiGet', function () {
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network.apiGet(defaultUrl, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.apiGet(defaultUrl, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getOwnedSids', function () {
        var address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
        var url = "".concat(hostUrl, ":8667/get_owned_utxos/").concat(address);
        it('returns properly formatted utxo sids data for multiple sids', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = [3, 4, 5];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data for a single sid ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = 3;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data for a single sid in an array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = [3];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data response is undefined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = undefined;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error and does not return response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getOwnedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRelatedSids', function () {
        var address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
        var url = "".concat(hostUrl, ":8667/get_related_txns/").concat(address);
        it('returns properly formatted utxo sids data for multiple sids', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = [3, 4, 5];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data for a single sid ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = 3;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data for a single sid in an array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = [3];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted utxo sids data response is undefined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = undefined;
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error and does not return response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getRelatedSids(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUtxo', function () {
        var sid = 42;
        var url = "".concat(hostUrl, ":8668/utxo_sid/").concat(sid);
        it('returns properly formatted utxo data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myUtxo, myUtxoResponse, dataResult, response, utxo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myUtxo = {
                            id: 1,
                            record: { foo: 'bar' },
                        };
                        myUtxoResponse = {
                            utxo: myUtxo,
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myUtxoResponse));
                        }));
                        return [4 /*yield*/, network.getUtxo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('utxo');
                        utxo = response.utxo;
                        expect(utxo).toHaveProperty('record');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getUtxo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getUtxo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getOwnerMemo', function () {
        var sid = 1234342;
        var url = "".concat(hostUrl, ":8667/get_owner_memo/").concat(sid);
        it('returns properly formatted owner memo data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLock, myResponse, dataResult, response, lock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLock = {
                            ciphertext: 'foo',
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            ephemeral_public_key: 'bar',
                        };
                        myResponse = {
                            lock: myLock,
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.getOwnerMemo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('lock');
                        lock = response.lock;
                        expect(lock).toHaveProperty('ciphertext');
                        expect(lock).toHaveProperty('ephemeral_public_key');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getOwnerMemo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getOwnerMemo(sid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStateCommitment', function () {
        var url = "".concat(hostUrl, ":8668/global_state");
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, dataResult, response, _a, first, height, third;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        myResponse = [[1, 2, 3], 45, 'foobar'];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.getStateCommitment(testConfig)];
                    case 1:
                        dataResult = _b.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        _a = response, first = _a[0], height = _a[1], third = _a[2];
                        expect(Array.isArray(first)).toEqual(true);
                        expect(height).toEqual(45);
                        expect(third).toEqual('foobar');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getStateCommitment(testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getStateCommitment(testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSubmitTransactionData', function () {
        it('return empty tx data with no data given to the input', function () {
            var txData = network.getSubmitTransactionData();
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return empty tx data with empty string given to the input', function () {
            var givenData = '';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return given string parsed as number', function () {
            var givenData = '1234';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: 1234 });
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123,
            };
            var txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            expect(txData).toEqual({ response: givenData });
        });
        it('return properly formatted error', function () {
            var givenData = '124343hh s';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return properly formatted error for mailformed json', function () {
            var givenData = '{f:1}';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123434343434343435343434343434242342342432,
            };
            var txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            var barfoo = txData.response.barfoo;
            expect(barfoo instanceof bignumber_js_1.default).toEqual(true);
        });
    });
    describe('submitTransaction', function () {
        var url = "".concat(hostUrl, ":8669/submit_transaction");
        it('returns properly formatted response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, myData, spy, spyPost, myNewData, dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
                        myData = { foo: myResponse };
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            var foo = _req.body.foo;
                            return res(ctx.json(foo));
                        }));
                        spy = jest.spyOn(network, 'getSubmitTransactionData');
                        spyPost = jest.spyOn(network, 'apiPost');
                        myNewData = JSON.stringify(myData);
                        return [4 /*yield*/, network.submitTransaction(myNewData, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        expect(dataResult.response).toBe(myResponse);
                        expect(spy).toHaveBeenCalledWith(myNewData);
                        expect(spy).toReturnWith({ response: myData });
                        expect(spyPost).toHaveBeenCalledWith(url, myData, testConfig);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted response with no input data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.submitTransaction(undefined, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.submitTransaction('', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.submitTransaction('', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAssetToken', function () {
        var assetCode = 'foo';
        var url = "".concat(hostUrl, ":8668/asset_token/").concat(assetCode);
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetProperties, myResponse, dataResult, response, properties;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetProperties = {
                            code: 1,
                            issuer: 2,
                            asset_rules: [],
                        };
                        myResponse = {
                            properties: assetProperties,
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.getAssetToken(assetCode, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('properties');
                        properties = response.properties;
                        expect(properties).toHaveProperty('code');
                        expect(properties).toHaveProperty('issuer');
                        expect(properties).toHaveProperty('asset_rules');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getAssetToken(assetCode, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getAssetToken(assetCode, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getIssuedRecords', function () {
        var address = 'foo';
        var url = "".concat(hostUrl, ":8667/get_issued_records/").concat(address);
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var issuedRecord, myResponse, dataResult, response, firstRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        issuedRecord = [
                            {
                                id: 1,
                                record: 'foo',
                            },
                            null,
                        ];
                        myResponse = [issuedRecord];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.getIssuedRecords(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toBe(1);
                        firstRecord = response[0];
                        expect(firstRecord.length).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getIssuedRecords(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getIssuedRecords(address, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTransactionStatus', function () {
        var handle = 'foo';
        var url = "".concat(hostUrl, ":8669/txn_status/").concat(handle);
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            Committed: [1, [1, 2, 3]],
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.getTransactionStatus(handle, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('Committed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getTransactionStatus(handle, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getTransactionStatus(handle, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBlock', function () {
        var height = 12;
        var url = "".concat(hostUrl, ":26657/block");
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, spy, dataResult, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            result: {
                                block_id: {
                                    hash: '123',
                                },
                            },
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spy = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getBlock(height, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('result');
                        result = response.result;
                        expect(result).toHaveProperty('block_id');
                        expect(spy).toHaveBeenCalledWith(url, __assign(__assign({}, testConfig), { params: { height: height } }));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getBlock(height, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getBlock(height, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getHashSwap', function () {
        var hash = 'abc123';
        var url = "".concat(hostUrl, ":26657/tx_search");
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, spy, dataResult, response, result, txs, total_count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            result: {
                                txs: [{ foo: 'bar' }],
                                total_count: 1,
                            },
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spy = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getHashSwap(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('result');
                        result = response.result;
                        expect(result).toHaveProperty('total_count');
                        expect(result).toHaveProperty('txs');
                        txs = result.txs, total_count = result.total_count;
                        expect(txs === null || txs === void 0 ? void 0 : txs.length).toBe(1);
                        expect(total_count).toBe(1);
                        expect(spy).toHaveBeenCalledWith(url, __assign(__assign({}, testConfig), { params: { query: "\"tx.prehash='".concat(hash, "'\"") } }));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getHashSwap(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getHashSwap(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTxList', function () {
        var address = 'foo';
        var type = 'to';
        var page = 1;
        var url = "".concat(hostUrl, ":26657/tx_search");
        it('returns properly formatted data with default page equals to 1 and check type = "to"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, spy, dataResult, response, result, txs, total_count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            result: {
                                txs: [{ foo: 'bar' }],
                                total_count: 1,
                            },
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spy = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getTxList(address, type)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('result');
                        result = response.result;
                        expect(result).toHaveProperty('total_count');
                        expect(result).toHaveProperty('txs');
                        txs = result.txs, total_count = result.total_count;
                        expect(txs === null || txs === void 0 ? void 0 : txs.length).toBe(1);
                        expect(total_count).toBe(1);
                        expect(spy).toHaveBeenCalledWith(url, {
                            params: {
                                order_by: '"desc"',
                                page: 1,
                                per_page: 10,
                                query: '"addr.to.foo=\'y\'"',
                            },
                        });
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted data with given page and check type = "from"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, spy, dataResult, response, result, txs, total_count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            result: {
                                txs: [{ foo: 'bar' }],
                                total_count: 1,
                            },
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spy = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getTxList(address, 'from', 2, 'transparent', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('result');
                        result = response.result;
                        expect(result).toHaveProperty('total_count');
                        expect(result).toHaveProperty('txs');
                        txs = result.txs, total_count = result.total_count;
                        expect(txs === null || txs === void 0 ? void 0 : txs.length).toBe(1);
                        expect(total_count).toBe(1);
                        expect(spy).toHaveBeenCalledWith(url, __assign(__assign({}, testConfig), { params: {
                                order_by: '"desc"',
                                page: 2,
                                per_page: 10,
                                query: '"addr.from.foo=\'y\'"',
                            } }));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getTxList(address, type, page, 'transparent', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getTxList(address, type, page, 'transparent', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTransactionDetails', function () {
        var hash = 'abc123';
        var url = "".concat(hostUrl, ":26657/tx");
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, spy, dataResult, response, result, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = {
                            result: {
                                tx: 'assd123abcdf',
                            },
                        };
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spy = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getTransactionDetails(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toHaveProperty('result');
                        result = response.result;
                        expect(result).toHaveProperty('tx');
                        tx = result.tx;
                        expect(tx).toEqual('assd123abcdf');
                        expect(spy).toHaveBeenCalledWith(url, __assign(__assign({}, testConfig), { params: { hash: "0x".concat(hash) } }));
                        spy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.getTransactionDetails(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getTransactionDetails(hash, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getOwnedAbars', function () {
        var randomizedPubKey = 'randomizedPubKey';
        var url = "".concat(hostUrl, ":8667/owned_abars/").concat(randomizedPubKey);
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ownedAbar, myResponse, spyApiGet, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ownedAbar = { amount_type_commitment: 'amount_type_commitment', public_key: 'public_key' };
                        myResponse = [[123, ownedAbar]];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getOwnedAbars(randomizedPubKey, testConfig)];
                    case 1:
                        result = _a.sent();
                        response = result.response;
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        expect(response).toEqual(myResponse);
                        expect(spyApiGet).toHaveBeenCalledWith(url, testConfig);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getOwnedAbars(randomizedPubKey, testConfig)];
                    case 1:
                        result = _a.sent();
                        expect(result).not.toHaveProperty('response');
                        expect(result).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAbarMemos', function () {
        var startSid = '1';
        var endSid = '4';
        var url = "".concat(hostUrl, ":8667/get_abar_memos");
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var abarMemoDataResponse, spyApiGet, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abarMemoDataResponse = [
                            [1, { point: '1', ctext: [1, 2, 3] }],
                            [2, { point: '2', ctext: [4, 5, 6] }],
                            [3, { point: '3', ctext: [7, 8, 9] }],
                            [4, { point: '4', ctext: [10, 11, 12] }],
                        ];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(abarMemoDataResponse));
                        }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        return [4 /*yield*/, network.getAbarMemos(startSid, endSid, testConfig)];
                    case 1:
                        result = _a.sent();
                        response = result.response;
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        expect(response).toEqual(abarMemoDataResponse);
                        expect(spyApiGet).toHaveBeenCalledWith(url, __assign(__assign({}, testConfig), { params: { start: startSid, end: endSid } }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.getAbarMemos(startSid, endSid, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=network.spec.js.map