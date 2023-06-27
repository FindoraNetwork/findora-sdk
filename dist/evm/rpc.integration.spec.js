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
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const Network = __importStar(require("../api/network/network"));
const testHelpers_1 = require("./testHelpers");
const envConfigFile = process.env.RPC_ENV_NAME
    ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
    : `../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;
const extendedExecutionTimeout = 600000;
let existingBlockNumberToCheck = 1;
let existingBlockHashToCheck = '';
let existingTxHashToCheck = '';
let existingTransactionIndex = 0;
let networkId;
let accounts;
(0, testHelpers_1.timeStart)();
const provider = new hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, testHelpers_1.setCurrentTestName)('');
    accounts = yield web3.eth.getAccounts();
    networkId = yield web3.eth.net.getId();
    const transactionObject = Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { to: accounts[1], value: web3.utils.toWei('0.1', 'ether') });
    (0, testHelpers_1.timeStart)();
    web3.eth
        .sendTransaction(transactionObject)
        .once('sending', (_payload) => __awaiter(void 0, void 0, void 0, function* () {
        // timeLog('Once sending', _payload);
    }))
        .once('sent', (_payload) => __awaiter(void 0, void 0, void 0, function* () {
        // timeLog('Once sent', _payload);
    }))
        .once('transactionHash', (_hash) => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.timeLog)('Once transactionHash', _hash);
    }))
        .once('receipt', (_receipt) => __awaiter(void 0, void 0, void 0, function* () {
        // timeLog('Once receipt', _receipt);
    }))
        .on('error', (_error) => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.timeLog)('Once error', _error);
    }))
        .then(function (receipt) {
        (0, testHelpers_1.timeLog)('Once the receipt is mined', receipt);
        // will be fired once the receipt is mined
        const { transactionHash, blockHash, blockNumber, transactionIndex } = receipt;
        // This block number has to be from the block `existingBlockHashToCheck`
        existingBlockNumberToCheck = blockNumber;
        // This block hash must be from the block `existingBlockNumberToCheck`
        existingBlockHashToCheck = blockHash;
        // This tx hash must be from the block `existingBlockNumberToCheck`
        existingTxHashToCheck = transactionHash;
        existingTransactionIndex = transactionIndex;
        done();
        // timeLog('Send an initial transaction');
    });
}), extendedExecutionTimeout);
const getTestResult = (msgId, method, extraParams) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, testHelpers_1.getRpcPayload)(msgId, method, extraParams);
    (0, testHelpers_1.timeStart)();
    const result = yield Network.sendRpcCall(rpcUrl, payload);
    (0, testHelpers_1.timeLog)(`RPC Network call to "${method}"`);
    (0, testHelpers_1.assertResultResponse)(result);
    (0, testHelpers_1.assertBasicResult)(result, msgId);
    return result;
});
describe(`Api Endpoint (rpc test) for "${rpcUrl}"`, () => {
    describe('eth_protocolVersion', () => {
        it('Returns the current ethereum protocol version', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_protocolVersion');
            const result = yield getTestResult(2, 'eth_protocolVersion');
            (0, testHelpers_1.assertResultType)(result, 'number');
        }), extendedExecutionTimeout);
    });
    describe('eth_chainId', () => {
        it('Returns the current chain id', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_chainId');
            const result = yield getTestResult(1, 'eth_chainId');
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_accounts', () => {
        it('Returns a list of addresses owned by client', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_accounts');
            const result = yield getTestResult(1, 'eth_accounts');
            expect(Array.isArray((_a = result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(true);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBalance', () => {
        it('Returns the balance of the account of given address', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_getBalance');
            const extraParams = [accounts[0], 'latest'];
            const result = yield getTestResult(2, 'eth_getBalance', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_sendTransaction', () => {
        it('Creates new message call transaction or a contract creation, if the data field contains code', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_sendTransaction');
            const extraParams = [
                {
                    from: accounts[0],
                    to: accounts[1],
                    value: 0,
                },
            ];
            const result = yield getTestResult(1, 'eth_sendTransaction', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'undefined');
        }), extendedExecutionTimeout);
    });
    describe('eth_call', () => {
        it('Executes a message immediately without creating a transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_call');
            const extraParams = [
                {
                    from: accounts[0],
                    to: accounts[1],
                    data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                },
            ];
            const result = yield getTestResult(3, 'eth_call', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_coinbase', () => {
        it('Returns the client coinbase address', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_coinbase');
            const result = yield getTestResult(1, 'eth_coinbase');
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_gasPrice', () => {
        it('Returns the current price per gas in wei', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_gasPrice');
            const result = yield getTestResult(1, 'eth_gasPrice');
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_blockNumber', () => {
        it('Returns the number of most recent block', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, testHelpers_1.setCurrentTestName)('eth_blockNumber');
            const result = yield getTestResult(1, 'eth_blockNumber');
            (0, testHelpers_1.assertResultType)(result, 'string');
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockByHash', () => {
        it('Returns information about a block by hash', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            (0, testHelpers_1.setCurrentTestName)('eth_getBlockByHash');
            const extraParams = [existingBlockHashToCheck, true];
            const result = yield getTestResult(1, 'eth_getBlockByHash', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.hash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.parentHash)).toEqual('string');
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockByNumber', () => {
        it('Returns information about a block by block number.', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            (0, testHelpers_1.setCurrentTestName)('eth_getBlockByNumber');
            const extraParams = [existingBlockNumberToCheck, true];
            const result = yield getTestResult(1, 'eth_getBlockByNumber', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.hash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.parentHash)).toEqual('string');
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionCount', () => {
        it('Returns the number of transactions SENT from an address', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_getTransactionCount');
            const extraParams = [accounts[0], 'latest'];
            const result = yield getTestResult(1, 'eth_getTransactionCount', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByHash', () => {
        it('Returns the number of transactions in a block from a block matching the given block hash', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_getBlockTransactionCountByHash');
            const extraParams = [existingBlockHashToCheck];
            const result = yield getTestResult(1, 'eth_getBlockTransactionCountByHash', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByNumber', () => {
        it('Returns the number of transactions in a block from a block matching the given block number', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_getBlockTransactionCountByNumber');
            const extraParams = [existingBlockNumberToCheck];
            const result = yield getTestResult(2, 'eth_getBlockTransactionCountByNumber', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
        }), extendedExecutionTimeout);
    });
    describe('eth_getCode', () => {
        it('Returns code at a given address', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_getCode');
            const extraParams = [accounts[1], 'latest'];
            const result = yield getTestResult(2, 'eth_getCode', extraParams);
            (0, testHelpers_1.assertResultType)(result, 'string');
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).not.toEqual('0x0');
        }), extendedExecutionTimeout);
    });
    describe('eth_sendRawTransaction', () => {
        it('Creates new message call transaction or a contract creation for signed transactions (negative case)', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('eth_sendRawTransaction');
            const extraParams = ['0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d'];
            const result = yield getTestResult(2, 'eth_sendRawTransaction', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code)).toEqual('number');
        }), extendedExecutionTimeout);
    });
    describe('eth_estimateGas', () => {
        it('Generates and returns an estimate of how much gas is necessary to allow the transaction to complete', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_estimateGas');
            const extraParams = [
                {
                    from: accounts[0],
                    to: accounts[1],
                    data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
                },
            ];
            const result = yield getTestResult(3, 'eth_estimateGas', extraParams);
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result).toEqual('0x573b');
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByHash', () => {
        it('Returns the information about a transaction requested by transaction hash', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (0, testHelpers_1.setCurrentTestName)('eth_getTransactionByHash');
            const extraParams = [existingTxHashToCheck];
            const result = yield getTestResult(3, 'eth_getTransactionByHash', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockHashAndIndex', () => {
        it('Returns information about a transaction by block hash and transaction index position', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (0, testHelpers_1.setCurrentTestName)('eth_getTransactionByBlockHashAndIndex');
            const extraParams = [existingBlockHashToCheck, existingTransactionIndex];
            const result = yield getTestResult(3, 'eth_getTransactionByBlockHashAndIndex', extraParams);
            // timeLog('eth_getTransactionByBlockHashAndIndex result', result);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockNumberAndIndex', () => {
        it('Returns information about a transaction by block number and transaction index position', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (0, testHelpers_1.setCurrentTestName)('eth_getTransactionByBlockNumberAndIndex');
            const extraParams = [existingBlockNumberToCheck, existingTransactionIndex];
            const result = yield getTestResult(3, 'eth_getTransactionByBlockNumberAndIndex', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.hash).toEqual(existingTxHashToCheck);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionReceipt', () => {
        it('Returns the receipt of a transaction by transaction hash', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            (0, testHelpers_1.setCurrentTestName)('eth_getTransactionReceipt');
            const extraParams = [existingTxHashToCheck];
            const result = yield getTestResult(1, 'eth_getTransactionReceipt', extraParams);
            expect(typeof ((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.blockHash)).toEqual('string');
            expect(typeof ((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.blockNumber)).toEqual('string');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.transactionHash).toEqual(existingTxHashToCheck);
        }), extendedExecutionTimeout);
    });
    describe('eth_getLogs', () => {
        it('Returns an array of all logs matching a given filter object', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (0, testHelpers_1.setCurrentTestName)('eth_getLogs');
            const extraParams = [
                {
                    address: accounts[0],
                },
            ];
            const result = yield getTestResult(1, 'eth_getLogs', extraParams);
            expect(Array.isArray((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(true);
        }), extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.spec.js.map