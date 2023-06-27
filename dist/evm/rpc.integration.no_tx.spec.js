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
const extendedExecutionTimeout = 600000;
const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
const getTestResult = (msgId, method, extraParams) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, testHelpers_1.getRpcPayload)(msgId, method, extraParams);
    (0, testHelpers_1.timeStart)();
    const result = yield Network.sendRpcCall(rpcUrl, payload);
    (0, testHelpers_1.timeLog)(`Send an RPC call for "${method}"`);
    (0, testHelpers_1.assertResultResponse)(result);
    (0, testHelpers_1.assertBasicResult)(result, msgId);
    return result;
});
describe(`Api Endpoint (rpc test no tx) for "${rpcUrl}"`, () => {
    describe('eth_getBlockByNumber', () => {
        it('Returns information about a block by block number and verifies its parent block information', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            (0, testHelpers_1.setCurrentTestName)('Returns information about a block by block number and verifies its parent block information');
            const lastBlockResult = yield getTestResult(1, 'eth_blockNumber');
            const { response: lastBlockResponse } = lastBlockResult;
            if (!lastBlockResponse) {
                console.log('lastBlockResult', lastBlockResult);
                throw new Error('Could not fetch last block data');
            }
            const existingBlockNumberToCheck = parseInt(lastBlockResponse.result, 16);
            const extraParams = [existingBlockNumberToCheck, true];
            const result = yield getTestResult(1312, 'eth_getBlockByNumber', extraParams);
            expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result.number).toEqual(lastBlockResponse.result);
            expect(typeof ((_c = (_b = result === null || result === void 0 ? void 0 : result.response) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.parentHash)).toEqual('string');
            const parentBlockHash = (_e = (_d = result === null || result === void 0 ? void 0 : result.response) === null || _d === void 0 ? void 0 : _d.result) === null || _e === void 0 ? void 0 : _e.parentHash;
            const parentExtraParams = [parentBlockHash, true];
            const parentResult = yield getTestResult(3, 'eth_getBlockByHash', parentExtraParams);
            expect((_f = parentResult === null || parentResult === void 0 ? void 0 : parentResult.response) === null || _f === void 0 ? void 0 : _f.id).toEqual(3);
            expect(parseInt(parentResult.response.result.number, 16)).toEqual(existingBlockNumberToCheck - 1);
            expect((_g = parentResult === null || parentResult === void 0 ? void 0 : parentResult.response) === null || _g === void 0 ? void 0 : _g.result.hash).toEqual(parentBlockHash);
        }), extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.no_tx.spec.js.map