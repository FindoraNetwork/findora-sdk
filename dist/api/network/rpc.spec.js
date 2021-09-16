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
var Network = __importStar(require("./network"));
// const rpcUrl = 'http://127.0.0.1:8545';
var rpcUrl = 'https://dev-evm.dev.findora.org:8545';
// Sender account, it has to have tokens
var ethAccountToCheck = '0xff6246f1011C1F7aD15877fb1232BEda1536b3bC';
// Store contract address - see `eth_getStorageAt`
var ethStoreContractAddress = '0xD5153e5fcBCD1dc50dCFa3debB0bD174F20EA8A4';
// This should be an existing contract address, which you can send tokens to - see `eth_call` and `eth_sendTransaction`
var ethContractAddressToReceive = '0xCC4e53d92f09C385FD9aEece3c1cd263addDbDE3';
// This block number has to be from the block `existingBlockHashToCheck`
var existingBlockNumberToCheck = '0xe';
// This block hash must be from the block `existingBlockNumberToCheck`
var existingBlockHashToCheck = '0x41f02ee22758d62ebc1b71df5ad61fd80acceecce9db57b591ff0f47ba8170a6';
// This tx hash must be from the block `existingBlockNumberToCheck`
var existingTxHashToCheck = '0x647dc5a7fec839541403f931773736d43d1aa8cdcf759f10f3543ac1ebe6763d';
describe('Api Endpoint (rpc test)', function () {
    describe('eth_protocolVersion', function () {
        it('Returns the current ethereum protocol version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 2;
                        payload = {
                            id: msgId,
                            method: 'eth_protocolVersion',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_chainId', function () {
        it('Returns the current chain id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        payload = {
                            id: msgId,
                            method: 'eth_chainId',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_accounts', function () {
        it('Returns a list of addresses owned by client', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        payload = {
                            id: msgId,
                            method: 'eth_accounts',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(Array.isArray(response === null || response === void 0 ? void 0 : response.result)).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getBalance', function () {
        it('Returns the balance of the account of given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [ethAccountToCheck, 'latest'];
                        payload = {
                            id: msgId,
                            method: 'eth_getBalance',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_sendTransaction', function () {
        it('Creates new message call transaction or a contract creation, if the data field contains code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [
                            {
                                from: ethAccountToCheck,
                                to: ethContractAddressToReceive,
                                value: 0,
                            },
                        ];
                        payload = {
                            id: msgId,
                            method: 'eth_sendTransaction',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_call', function () {
        it('Executes a message immediately without creating a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [
                            {
                                from: ethAccountToCheck,
                                to: ethContractAddressToReceive,
                                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                            },
                        ];
                        payload = {
                            id: msgId,
                            method: 'eth_call',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_coinbase', function () {
        it('Returns the client coinbase address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        payload = {
                            id: msgId,
                            method: 'eth_coinbase',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_gasPrice', function () {
        it('Returns the current price per gas in wei', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        payload = {
                            id: msgId,
                            method: 'eth_gasPrice',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_blockNumber', function () {
        it('Returns the number of most recent block', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        payload = {
                            id: msgId,
                            method: 'eth_blockNumber',
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getStorageAt', function () {
        it('Returns the value from a storage position at a given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, expectedValue, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        expectedValue = '0x04d2';
                        extraParams = [ethStoreContractAddress, '0x0', 'latest'];
                        payload = {
                            id: msgId,
                            method: 'eth_getStorageAt',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        expect(response === null || response === void 0 ? void 0 : response.result).toEqual(expectedValue);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getBlockByHash', function () {
        it('Returns information about a block by hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockHashToCheck, true];
                        payload = {
                            id: msgId,
                            method: 'eth_getBlockByHash',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _c.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.parentHash)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getBlockByNumber', function () {
        it('Returns information about a block by block number.', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockNumberToCheck, true];
                        payload = {
                            id: msgId,
                            method: 'eth_getBlockByNumber',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _c.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.parentHash)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getTransactionCount', function () {
        it('Returns the number of transactions SENT from an address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [ethAccountToCheck, 'latest'];
                        payload = {
                            id: msgId,
                            method: 'eth_getTransactionCount',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        expect(response === null || response === void 0 ? void 0 : response.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getBlockTransactionCountByHash', function () {
        it('Returns the number of transactions in a block from a block matching the given block hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockHashToCheck];
                        payload = {
                            id: msgId,
                            method: 'eth_getBlockTransactionCountByHash',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        expect(response === null || response === void 0 ? void 0 : response.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getBlockTransactionCountByNumber', function () {
        it('Returns the number of transactions in a block from a block matching the given block number', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockNumberToCheck];
                        payload = {
                            id: msgId,
                            method: 'eth_getBlockTransactionCountByNumber',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        expect(response === null || response === void 0 ? void 0 : response.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getCode', function () {
        it('Returns code at a given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [ethStoreContractAddress, 'latest'];
                        payload = {
                            id: msgId,
                            method: 'eth_getCode',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.id).toEqual(msgId);
                        expect(typeof (response === null || response === void 0 ? void 0 : response.id)).toEqual('number');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof (response === null || response === void 0 ? void 0 : response.result)).toEqual('string');
                        expect(response === null || response === void 0 ? void 0 : response.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_sendRawTransaction', function () {
        it('Creates new message call transaction or a contract creation for signed transactions (negative case)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, txData, extraParams, payload, result, response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        msgId = 1;
                        txData = '0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d';
                        extraParams = [txData];
                        payload = {
                            id: msgId,
                            method: 'eth_sendRawTransaction',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _c.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect((_a = response === null || response === void 0 ? void 0 : response.error) === null || _a === void 0 ? void 0 : _a.message).toEqual('Invalid Signature');
                        expect((_b = response === null || response === void 0 ? void 0 : response.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(-32000);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_estimateGas', function () {
        it('Generates and returns an estimate of how much gas is necessary to allow the transaction to complete', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [
                            {
                                from: ethAccountToCheck,
                                to: ethContractAddressToReceive,
                                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                            },
                        ];
                        payload = {
                            id: msgId,
                            method: 'eth_estimateGas',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(response === null || response === void 0 ? void 0 : response.result).toEqual('0x52d4');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getTransactionByHash', function () {
        it('Returns the information about a transaction requested by transaction hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingTxHashToCheck];
                        payload = {
                            id: msgId,
                            method: 'eth_getTransactionByHash',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _d.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.blockHash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.blockNumber)).toEqual('string');
                        expect((_c = response === null || response === void 0 ? void 0 : response.result) === null || _c === void 0 ? void 0 : _c.hash).toEqual(existingTxHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getTransactionByBlockHashAndIndex', function () {
        it('Returns information about a transaction by block hash and transaction index position', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockHashToCheck, '0x0'];
                        payload = {
                            id: msgId,
                            method: 'eth_getTransactionByBlockHashAndIndex',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _e.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.blockHash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.blockNumber)).toEqual('string');
                        expect((_c = response === null || response === void 0 ? void 0 : response.result) === null || _c === void 0 ? void 0 : _c.hash).toEqual(existingTxHashToCheck);
                        expect((_d = response === null || response === void 0 ? void 0 : response.result) === null || _d === void 0 ? void 0 : _d.blockHash).toEqual(existingBlockHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getTransactionByBlockNumberAndIndex', function () {
        it('Returns information about a transaction by block number and transaction index position', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingBlockNumberToCheck, '0x0'];
                        payload = {
                            id: msgId,
                            method: 'eth_getTransactionByBlockNumberAndIndex',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _e.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.blockHash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.blockNumber)).toEqual('string');
                        expect((_c = response === null || response === void 0 ? void 0 : response.result) === null || _c === void 0 ? void 0 : _c.hash).toEqual(existingTxHashToCheck);
                        expect((_d = response === null || response === void 0 ? void 0 : response.result) === null || _d === void 0 ? void 0 : _d.blockHash).toEqual(existingBlockHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getTransactionReceipt', function () {
        it('Returns the receipt of a transaction by transaction hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [existingTxHashToCheck];
                        payload = {
                            id: msgId,
                            method: 'eth_getTransactionReceipt',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _e.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.blockHash)).toEqual('string');
                        expect(typeof ((_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.blockNumber)).toEqual('string');
                        expect((_c = response === null || response === void 0 ? void 0 : response.result) === null || _c === void 0 ? void 0 : _c.transactionHash).toEqual(existingTxHashToCheck);
                        expect((_d = response === null || response === void 0 ? void 0 : response.result) === null || _d === void 0 ? void 0 : _d.blockHash).toEqual(existingBlockHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('eth_getLogs', function () {
        it('Returns an array of all logs matching a given filter object', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgId = 1;
                        extraParams = [
                            {
                                address: ethStoreContractAddress,
                            },
                        ];
                        payload = {
                            id: msgId,
                            method: 'eth_getLogs',
                            params: extraParams,
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('response');
                        expect(result).not.toHaveProperty('error');
                        response = result.response;
                        expect(typeof (response === null || response === void 0 ? void 0 : response.jsonrpc)).toEqual('string');
                        expect(Array.isArray(response === null || response === void 0 ? void 0 : response.result)).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=rpc.spec.js.map