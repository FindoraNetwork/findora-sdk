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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const Network = __importStar(require("../api/network/network"));
const testHelpers_1 = require("./testHelpers");
const envConfigFile = process.env.RPC_ENV_NAME
    ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
    : `../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;
const extendedExecutionTimeout = 600000;
//moonbeam (polkadot) compatible
const ERROR_INVALID_REQUEST = -32600;
const ERROR_METHOD_NOT_FOUND = -32601;
const ERROR_INVALID_PARAMS = -32602;
(0, testHelpers_1.timeStart)();
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
const getTestResult = (msgId, method, extraParams) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, testHelpers_1.getRpcPayload)(msgId, method, extraParams);
    (0, testHelpers_1.timeStart)();
    const result = yield Network.sendRpcCall(rpcUrl, payload);
    (0, testHelpers_1.timeLog)(`Send an RPC call for "${method}"`);
    (0, testHelpers_1.assertResultResponse)(result);
    return result;
});
describe(`Api Endpoint (rpc test negative) for "${rpcUrl}"`, () => {
    describe('notSupportedMethod', () => {
        it('Returns a proper error code when requested method was not found', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when requested method was not found');
            const result = yield getTestResult(2, 'foobar');
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_METHOD_NOT_FOUND);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBalance', () => {
        it('Returns a proper error code when address in given payload is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when address in given payload is invalid');
            const extraParams = ['wrong_address', 'latest'];
            const result = yield getTestResult(2, 'eth_getBalance', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code when params payload is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when params payload is missing');
            const result = yield getTestResult(2, 'eth_getBalance');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when params payload format is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when params payload format is invalid');
            const extraParams = 'foo';
            const result = yield getTestResult(2, 'eth_getBalance', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_call', () => {
        const extraParams = [
            {
                from: '0xabcd',
                to: '0xbcde',
                data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
            },
        ];
        it('Returns a proper error code for missing required parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for missing required parameter');
            const result = yield getTestResult(2, 'eth_call', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when required parameter is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when required parameter is incorrect');
            const extraExtraParams = [...extraParams, '0x0'];
            const result = yield getTestResult(2, 'eth_call', extraExtraParams);
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'foo';
            const result = yield getTestResult(2, 'eth_call', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockByHash', () => {
        it('Returns a proper error code for invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for invalid parameters');
            const extraParams = ['0x0', true];
            const result = yield getTestResult(3, 'eth_getBlockByHash', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for missing parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for missing parameters');
            const extraParams = ['0x0', true];
            const result = yield getTestResult(4, 'eth_getBlockByHash', extraParams);
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for the missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the missing payload');
            const result = yield getTestResult(1, 'eth_getBlockByHash');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockByNumber', () => {
        it('Returns a proper error code for the wrong parameter in the payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the wrong parameter in the payload');
            const extraParams = ['aaa', true];
            const result = yield getTestResult(1, 'eth_getBlockByNumber', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error for the wrong format of the payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns an error for the wrong format of the payload');
            const extraParams = 'aaaa';
            const result = yield getTestResult(2, 'eth_getBlockByNumber', extraParams);
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for the missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for the missing payload');
            const result = yield getTestResult(2, 'eth_getBlockByNumber');
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionCount', () => {
        it('Returns a proper error code when a wrong address is given', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when a wrong address is given');
            const extraParams = ['0x0', 'latest'];
            const result = yield getTestResult(2, 'eth_getTransactionCount', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code when no payload is given', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code when no payload is given');
            const result = yield getTestResult(2, 'eth_getTransactionCount');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(2, 'eth_getTransactionCount', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByHash', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['0x0'];
            const result = yield getTestResult(3, 'eth_getBlockTransactionCountByHash', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = 'aaaa';
            const result = yield getTestResult(3, 'eth_getBlockTransactionCountByHash', extraParams);
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getBlockTransactionCountByNumber', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(1, 'eth_getBlockTransactionCountByNumber', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(2, 'eth_getBlockTransactionCountByHash');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(1, 'eth_getBlockTransactionCountByNumber', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getCode', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(3, 'eth_getCode', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(2, 'eth_getCode');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(1, 'eth_getCode', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_sendRawTransaction', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(1, 'eth_sendRawTransaction', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(2, 'eth_sendRawTransaction');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaaaa';
            const result = yield getTestResult(1, 'eth_sendRawTransaction', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_estimateGas', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(1, 'eth_estimateGas', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(1, 'eth_estimateGas');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaaa';
            const result = yield getTestResult(1, 'eth_estimateGas', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByHash', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(1, 'eth_getTransactionByHash', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(4, 'eth_getTransactionByHash');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaaa';
            const result = yield getTestResult(2, 'eth_getTransactionByHash', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockHashAndIndex', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(1, 'eth_getTransactionByBlockHashAndIndex', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(3, 'eth_getTransactionByBlockHashAndIndex');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(2, 'eth_getTransactionByBlockHashAndIndex', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionByBlockNumberAndIndex', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(2, 'eth_getTransactionByBlockNumberAndIndex', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(3, 'eth_getTransactionByBlockNumberAndIndex');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(1, 'eth_getTransactionByBlockNumberAndIndex', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getTransactionReceipt', () => {
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = ['aaa'];
            const result = yield getTestResult(3, 'eth_getTransactionReceipt', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a missing payload', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a missing payload');
            const result = yield getTestResult(3, 'eth_getTransactionReceipt');
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(3, 'eth_getTransactionReceipt', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
    describe('eth_getLogs', () => {
        it('Returns a proper error code for a wrong payload format parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload format parameter');
            const extraParams = ['0x0x0'];
            const result = yield getTestResult(1, 'eth_getLogs', extraParams);
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns a proper error code for a wrong payload parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, testHelpers_1.setCurrentTestName)('Returns a proper error code for a wrong payload parameter');
            const extraParams = [
                {
                    address: '0x0',
                },
            ];
            const result = yield getTestResult(4, 'eth_getLogs', extraParams);
            expect((_d = (_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code).toEqual(ERROR_INVALID_PARAMS);
        }), extendedExecutionTimeout);
        it('Returns an error when payload format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            (0, testHelpers_1.setCurrentTestName)('Returns an error when payload format is incorrect');
            const extraParams = 'aaa';
            const result = yield getTestResult(3, 'eth_getLogs', extraParams);
            expect((_f = (_e = result === null || result === void 0 ? void 0 : result.response) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.code).toEqual(ERROR_INVALID_REQUEST);
        }), extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.negative.spec.js.map