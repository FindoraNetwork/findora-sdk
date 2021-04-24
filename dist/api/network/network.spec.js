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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
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
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myHandle, dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myHandle = 'foobar';
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
});
//# sourceMappingURL=network.spec.js.map