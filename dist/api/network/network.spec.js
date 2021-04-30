"use strict";
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
var network_1 = require("./network");
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
describe('network', function () {
    var testConfig = {
        headers: {
            testHeader: 'test-value',
        },
    };
    describe('apiGet', function () {
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network_1.apiGet(defaultUrl, testConfig)];
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
                        return [4 /*yield*/, network_1.apiGet(defaultUrl, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
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
                        return [4 /*yield*/, network_1.apiPost(defaultUrl, data, testConfig)];
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
                        return [4 /*yield*/, network_1.apiPost(defaultUrl, undefined, testConfig)];
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
                        return [4 /*yield*/, network_1.apiPost(defaultUrl, data, testConfig)];
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
        var url = "https://dev-staging.dev.findora.org:8667/get_owned_utxos/" + address;
        it('returns properly formatted utxo sids data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mySids, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mySids = [3, 4, 5];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(mySids));
                        }));
                        return [4 /*yield*/, network_1.getOwnedSids(address, testConfig)];
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
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network_1.getOwnedSids(address, testConfig)];
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
                        return [4 /*yield*/, network_1.getOwnedSids(address, testConfig)];
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
        var url = "https://dev-staging.dev.findora.org:8668/utxo_sid/" + sid;
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
                        return [4 /*yield*/, network_1.getUtxo(sid, testConfig)];
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
                        return [4 /*yield*/, network_1.getUtxo(sid, testConfig)];
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
                        return [4 /*yield*/, network_1.getUtxo(sid, testConfig)];
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
        var url = "https://dev-staging.dev.findora.org:8667/get_owner_memo/" + sid;
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
                        return [4 /*yield*/, network_1.getOwnerMemo(sid, testConfig)];
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
                        return [4 /*yield*/, network_1.getOwnerMemo(sid, testConfig)];
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
                        return [4 /*yield*/, network_1.getOwnerMemo(sid, testConfig)];
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
        var url = "https://dev-staging.dev.findora.org:8668/global_state";
        it('returns properly formatted data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, dataResult, response, _a, first, height, third;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        myResponse = [[1, 2, 3], 45, 'foobar'];
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network_1.getStateCommitment(testConfig)];
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
                        return [4 /*yield*/, network_1.getStateCommitment(testConfig)];
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
                        return [4 /*yield*/, network_1.getStateCommitment(testConfig)];
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
            var txData = network_1.getSubmitTransactionData();
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return empty tx data with empty string given to the input', function () {
            var givenData = '';
            var txData = network_1.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return given string parsed as number', function () {
            var givenData = '1234';
            var txData = network_1.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: 1234 });
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123,
            };
            var txData = network_1.getSubmitTransactionData(JSON.stringify(givenData));
            expect(txData).toEqual({ response: givenData });
        });
        it('return properly formatted error', function () {
            var givenData = '124343hh s';
            var txData = network_1.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return properly formatted error for mailformed json', function () {
            var givenData = '{f:1}';
            var txData = network_1.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123434343434343435343434343434242342342432,
            };
            var txData = network_1.getSubmitTransactionData(JSON.stringify(givenData));
            var barfoo = txData.response.barfoo;
            expect(barfoo instanceof bignumber_js_1.default).toEqual(true);
        });
    });
    describe('submitTransaction', function () {
        var url = "https://dev-staging.dev.findora.org:8669/submit_transaction/";
        it('returns properly formatted response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, myData, dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
                        myData = { foo: myResponse };
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            var foo = _req.body.foo;
                            return res(ctx.json(foo));
                        }));
                        return [4 /*yield*/, network_1.submitTransaction(JSON.stringify(myData), testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        expect(dataResult.response).toBe(myResponse);
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
                        return [4 /*yield*/, network_1.submitTransaction(undefined, testConfig)];
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
                        return [4 /*yield*/, network_1.submitTransaction('', testConfig)];
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
                        return [4 /*yield*/, network_1.submitTransaction('', testConfig)];
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