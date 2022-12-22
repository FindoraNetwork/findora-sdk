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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var Network = __importStar(require("../api/network/network"));
var testHelpers_1 = require("./testHelpers");
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../.env_rpc_".concat(process.env.RPC_ENV_NAME)
    : "../../.env_example";
var envConfig = require("".concat(envConfigFile, ".json"));
var rpcParams = envConfig.rpc;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a;
var extendedExecutionTimeout = 600000;
//moonbeam (polkadot) compatible
var ERROR_INVALID_REQUEST = -32600;
var ERROR_METHOD_NOT_FOUND = -32601;
var ERROR_INVALID_PARAMS = -32602;
(0, testHelpers_1.timeStart)();
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
var getTestResult = function (msgId, method, extraParams) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = (0, testHelpers_1.getRpcPayload)(msgId, method, extraParams);
                (0, testHelpers_1.timeStart)();
                return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
            case 1:
                result = _a.sent();
                (0, testHelpers_1.timeLog)("Send an RPC call for \"".concat(method, "\""));
                (0, testHelpers_1.assertResultResponse)(result);
                return [2 /*return*/, result];
        }
    });
}); };
describe("Api Endpoint (rpc test negative) for \"".concat(rpcUrl, "\""), function () {
    describe('notSupportedMethod', function () {
        it('Returns a proper error code when requested method was not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when requested method was not found');
                        return [4 /*yield*/, getTestResult(2, 'foobar')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_METHOD_NOT_FOUND);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBalance', function () {
        it('Returns a proper error code when address in given payload is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when address in given payload is invalid');
                        extraParams = ['wrong_address', 'latest'];
                        return [4 /*yield*/, getTestResult(2, 'eth_getBalance', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code when params payload is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when params payload is missing');
                        return [4 /*yield*/, getTestResult(2, 'eth_getBalance')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when params payload format is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when params payload format is invalid');
                        extraParams = 'foo';
                        return [4 /*yield*/, getTestResult(2, 'eth_getBalance', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_call', function () {
        var extraParams = [
            {
                from: '0xabcd',
                to: '0xbcde',
                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
            },
        ];
        it('Returns a proper error code for missing required parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for missing required parameter');
                        return [4 /*yield*/, getTestResult(2, 'eth_call', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when required parameter is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraExtraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when required parameter is incorrect');
                        extraExtraParams = __spreadArray(__spreadArray([], extraParams, true), ['0x0'], false);
                        return [4 /*yield*/, getTestResult(2, 'eth_call', extraExtraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'foo';
                        return [4 /*yield*/, getTestResult(2, 'eth_call', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockByHash', function () {
        it('Returns a proper error code for invalid parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for invalid parameters');
                        extraParams = ['0x0', true];
                        return [4 /*yield*/, getTestResult(3, 'eth_getBlockByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for missing parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for missing parameters');
                        extraParams = ['0x0', true];
                        return [4 /*yield*/, getTestResult(4, 'eth_getBlockByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for the missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the missing payload');
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockByHash')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockByNumber', function () {
        it('Returns a proper error code for the wrong parameter in the payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the wrong parameter in the payload');
                        extraParams = ['aaa', true];
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockByNumber', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error for the wrong format of the payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error for the wrong format of the payload');
                        extraParams = 'aaaa';
                        return [4 /*yield*/, getTestResult(2, 'eth_getBlockByNumber', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for the missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the missing payload');
                        return [4 /*yield*/, getTestResult(2, 'eth_getBlockByNumber')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionCount', function () {
        it('Returns a proper error code when a wrong address is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when a wrong address is given');
                        extraParams = ['0x0', 'latest'];
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionCount', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code when no payload is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when no payload is given');
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionCount')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionCount', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByHash', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['0x0'];
                        return [4 /*yield*/, getTestResult(3, 'eth_getBlockTransactionCountByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = 'aaaa';
                        return [4 /*yield*/, getTestResult(3, 'eth_getBlockTransactionCountByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByNumber', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockTransactionCountByNumber', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(2, 'eth_getBlockTransactionCountByHash')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockTransactionCountByNumber', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getCode', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(3, 'eth_getCode', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(2, 'eth_getCode')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(1, 'eth_getCode', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_sendRawTransaction', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(1, 'eth_sendRawTransaction', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(2, 'eth_sendRawTransaction')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaaaa';
                        return [4 /*yield*/, getTestResult(1, 'eth_sendRawTransaction', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_estimateGas', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(1, 'eth_estimateGas', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(1, 'eth_estimateGas')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaaa';
                        return [4 /*yield*/, getTestResult(1, 'eth_estimateGas', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByHash', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(1, 'eth_getTransactionByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(4, 'eth_getTransactionByHash')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaaa';
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionByHash', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockHashAndIndex', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(1, 'eth_getTransactionByBlockHashAndIndex', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionByBlockHashAndIndex')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionByBlockHashAndIndex', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockNumberAndIndex', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(2, 'eth_getTransactionByBlockNumberAndIndex', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionByBlockNumberAndIndex')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(1, 'eth_getTransactionByBlockNumberAndIndex', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionReceipt', function () {
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = ['aaa'];
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionReceipt', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionReceipt')];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionReceipt', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getLogs', function () {
        it('Returns a proper error code for a wrong payload format parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload format parameter');
                        extraParams = ['0x0x0'];
                        return [4 /*yield*/, getTestResult(1, 'eth_getLogs', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns a proper error code for a wrong payload parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
                        extraParams = [
                            {
                                address: '0x0',
                            },
                        ];
                        return [4 /*yield*/, getTestResult(4, 'eth_getLogs', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
                        extraParams = 'aaa';
                        return [4 /*yield*/, getTestResult(3, 'eth_getLogs', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.negative.spec.js.map