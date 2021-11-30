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
require("@testing-library/jest-dom/extend-expect");
var Network = __importStar(require("../api/network/network"));
var web3_1 = __importDefault(require("web3"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var testHelpers_1 = require("./testHelpers");
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../.env_rpc_" + process.env.RPC_ENV_NAME
    : "../../.env_example";
var envConfig = require(envConfigFile + ".json");
var rpcParams = envConfig.rpc;
// This would be initialized with the data from the setup process
var existingBlockNumberToCheck = 1;
// This would be initialized with the data from the setup process
var existingBlockHashToCheck = '';
// This would be initialized with the data from the setup process
var existingTxHashToCheck = '';
var existingTransactionIndex = 0;
var extendedExecutionTimeout = 180000;
var 
// RPC endpoint url
_a = rpcParams.rpcUrl, 
// RPC endpoint url
rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a, 
//Sender mnemonic (to be used in web3)
mnemonic = rpcParams.mnemonic;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);
var provider = new truffle_hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
var web3 = new web3_1.default(provider);
var networkId;
var accounts;
var getTestResult = function (msgId, method, extraParams) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = (0, testHelpers_1.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payload)];
            case 1:
                result = _a.sent();
                (0, testHelpers_1.assertResultResponse)(result);
                (0, testHelpers_1.assertBasicResult)(result, msgId);
                return [2 /*return*/, result];
        }
    });
}); };
beforeAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3.eth.getAccounts()];
            case 1:
                accounts = _a.sent();
                return [4 /*yield*/, web3.eth.net.getId()];
            case 2:
                networkId = _a.sent();
                console.log('🚀 ~ file: rpc.integration.spec.ts ~ line 63 ~ beforeAll ~ networkId', networkId);
                transactionObject = __assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { to: accounts[1], value: web3.utils.toWei('0.1', 'ether') });
                web3.eth
                    .sendTransaction(transactionObject)
                    .once('sending', function (_payload) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('🚀 ~ IT IS SENDING file: rpc.spec.ts ~ line 37 ~ payload', _payload);
                        return [2 /*return*/];
                    });
                }); })
                    .once('sent', function (_payload) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('🚀 ~ IT IS SENT file: rpc.spec.ts ~ line 40 ~ payload', _payload);
                        return [2 /*return*/];
                    });
                }); })
                    .once('transactionHash', function (_hash) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('🚀 ~ file: rpc.spec.ts ~ line 44 ~ hash', _hash);
                        return [2 /*return*/];
                    });
                }); })
                    .once('receipt', function (_receipt) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('🚀 ~ file: rpc.spec.ts ~ line 45 ~ receipt', _receipt);
                        return [2 /*return*/];
                    });
                }); })
                    .on('error', function (_error) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('🚀 ~ ERROR file: rpc.spec.ts ~ line 51 ~ error', _error);
                        return [2 /*return*/];
                    });
                }); })
                    .then(function (receipt) {
                    // will be fired once the receipt is mined
                    var transactionHash = receipt.transactionHash, blockHash = receipt.blockHash, blockNumber = receipt.blockNumber, transactionIndex = receipt.transactionIndex;
                    // This block number has to be from the block `existingBlockHashToCheck`
                    existingBlockNumberToCheck = blockNumber;
                    // This block hash must be from the block `existingBlockNumberToCheck`
                    existingBlockHashToCheck = blockHash;
                    // This tx hash must be from the block `existingBlockNumberToCheck`
                    existingTxHashToCheck = transactionHash;
                    existingTransactionIndex = transactionIndex;
                    done();
                });
                return [2 /*return*/];
        }
    });
}); }, extendedExecutionTimeout);
describe("Api Endpoint (rpc test) for \"" + rpcUrl + "\"", function () {
    describe('eth_protocolVersion', function () {
        it('Returns the current ethereum protocol version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTestResult(2, 'eth_protocolVersion')];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'number');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_chainId', function () {
        it('Returns the current chain id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTestResult(1, 'eth_chainId')];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_accounts', function () {
        it('Returns a list of addresses owned by client', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getTestResult(1, 'eth_accounts')];
                    case 1:
                        result = _b.sent();
                        expect(Array.isArray((_a = result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBalance', function () {
        it('Returns the balance of the account of given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extraParams = [accounts[0], 'latest'];
                        return [4 /*yield*/, getTestResult(2, 'eth_getBalance', extraParams)];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_sendTransaction', function () {
        it('Creates new message call transaction or a contract creation, if the data field contains code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extraParams = [
                            {
                                from: accounts[0],
                                to: accounts[1],
                                value: 0,
                            },
                        ];
                        return [4 /*yield*/, getTestResult(1, 'eth_sendTransaction', extraParams)];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'undefined');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_call', function () {
        it('Executes a message immediately without creating a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extraParams = [
                            {
                                from: accounts[0],
                                to: accounts[1],
                                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                            },
                        ];
                        return [4 /*yield*/, getTestResult(3, 'eth_call', extraParams)];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_coinbase', function () {
        it('Returns the client coinbase address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTestResult(1, 'eth_coinbase')];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_gasPrice', function () {
        it('Returns the current price per gas in wei', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTestResult(1, 'eth_gasPrice')];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_blockNumber', function () {
        it('Returns the number of most recent block', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTestResult(1, 'eth_blockNumber')];
                    case 1:
                        result = _a.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockByHash', function () {
        it('Returns information about a block by hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        extraParams = [existingBlockHashToCheck, true];
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockByHash', extraParams)];
                    case 1:
                        result = _e.sent();
                        console.log('🚀 ~ file: rpc.integration.spec.ts ~ line 240 ~  eth_getBlockByHash result', result);
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.hash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.parentHash)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockByNumber', function () {
        it('Returns information about a block by block number.', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        extraParams = [existingBlockNumberToCheck, true];
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockByNumber', extraParams)];
                    case 1:
                        result = _e.sent();
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.hash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.parentHash)).toEqual('string');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionCount', function () {
        it('Returns the number of transactions SENT from an address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [accounts[0], 'latest'];
                        return [4 /*yield*/, getTestResult(1, 'eth_getTransactionCount', extraParams)];
                    case 1:
                        result = _b.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByHash', function () {
        it('Returns the number of transactions in a block from a block matching the given block hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [existingBlockHashToCheck];
                        return [4 /*yield*/, getTestResult(1, 'eth_getBlockTransactionCountByHash', extraParams)];
                    case 1:
                        result = _b.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByNumber', function () {
        it('Returns the number of transactions in a block from a block matching the given block number', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [existingBlockNumberToCheck];
                        return [4 /*yield*/, getTestResult(2, 'eth_getBlockTransactionCountByNumber', extraParams)];
                    case 1:
                        result = _b.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getCode', function () {
        it('Returns code at a given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [accounts[1], 'latest'];
                        return [4 /*yield*/, getTestResult(2, 'eth_getCode', extraParams)];
                    case 1:
                        result = _b.sent();
                        (0, testHelpers_1.assertResultType)(result, 'string');
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_sendRawTransaction', function () {
        it('Creates new message call transaction or a contract creation for signed transactions (negative case)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        extraParams = ['0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d'];
                        return [4 /*yield*/, getTestResult(2, 'eth_sendRawTransaction', extraParams)];
                    case 1:
                        result = _c.sent();
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code)).toEqual('number');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_estimateGas', function () {
        it('Generates and returns an estimate of how much gas is necessary to allow the transaction to complete', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [
                            {
                                from: accounts[0],
                                to: accounts[1],
                                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                            },
                        ];
                        return [4 /*yield*/, getTestResult(3, 'eth_estimateGas', extraParams)];
                    case 1:
                        result = _b.sent();
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).toEqual('0x52d4');
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByHash', function () {
        it('Returns the information about a transaction requested by transaction hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        extraParams = [existingTxHashToCheck];
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionByHash', extraParams)];
                    case 1:
                        result = _g.sent();
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
                        expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockHashAndIndex', function () {
        it('Returns information about a transaction by block hash and transaction index position', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        extraParams = [existingBlockHashToCheck, existingTransactionIndex];
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionByBlockHashAndIndex', extraParams)];
                    case 1:
                        result = _g.sent();
                        console.log('🚀 ~ file: rpc.integration.spec.ts ~ line 401 ~ eth_getTransactionByBlockHashAndIndex result', result);
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
                        expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockNumberAndIndex', function () {
        it('Returns information about a transaction by block number and transaction index position', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        extraParams = [existingBlockNumberToCheck, existingTransactionIndex];
                        return [4 /*yield*/, getTestResult(3, 'eth_getTransactionByBlockNumberAndIndex', extraParams)];
                    case 1:
                        result = _g.sent();
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
                        expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getTransactionReceipt', function () {
        it('Returns the receipt of a transaction by transaction hash', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        extraParams = [existingTxHashToCheck];
                        return [4 /*yield*/, getTestResult(1, 'eth_getTransactionReceipt', extraParams)];
                    case 1:
                        result = _g.sent();
                        expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
                        expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
                        expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.transactionHash).toEqual(existingTxHashToCheck);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
    describe('eth_getLogs', function () {
        it('Returns an array of all logs matching a given filter object', function () { return __awaiter(void 0, void 0, void 0, function () {
            var extraParams, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extraParams = [
                            {
                                address: accounts[0],
                            },
                        ];
                        return [4 /*yield*/, getTestResult(1, 'eth_getLogs', extraParams)];
                    case 1:
                        result = _b.sent();
                        expect(Array.isArray((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.spec.js.map