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
var Network = __importStar(require("../api/network/network"));
var testHelpers_1 = require("./testHelpers");
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../.env_rpc_".concat(process.env.RPC_ENV_NAME)
    : "../../.env_example";
var envConfig = require("".concat(envConfigFile, ".json"));
var rpcParams = envConfig.rpc;
var extendedExecutionTimeout = 600000;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a;
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
                (0, testHelpers_1.assertBasicResult)(result, msgId);
                return [2 /*return*/, result];
        }
    });
}); };
describe("Api Endpoint (rpc test no tx) for \"".concat(rpcUrl, "\""), function () {
    describe('eth_getBlockByNumber', function () {
        it('Returns information about a block by block number and verifies its parent block information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastBlockResult, lastBlockResponse, existingBlockNumberToCheck, extraParams, result, parentBlockHash, parentExtraParams, parentResult;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        (0, testHelpers_1.setCurrentTestName)('Returns information about a block by block number and verifies its parent block information');
                        return [4 /*yield*/, getTestResult(1, 'eth_blockNumber')];
                    case 1:
                        lastBlockResult = _h.sent();
                        lastBlockResponse = lastBlockResult.response;
                        if (!lastBlockResponse) {
                            console.log('lastBlockResult', lastBlockResult);
                            throw new Error('Could not fetch last block data');
                        }
                        existingBlockNumberToCheck = parseInt(lastBlockResponse.result, 16);
                        extraParams = [existingBlockNumberToCheck, true];
                        return [4 /*yield*/, getTestResult(1312, 'eth_getBlockByNumber', extraParams)];
                    case 2:
                        result = _h.sent();
                        expect((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result.number).toEqual(lastBlockResponse.result);
                        expect(typeof ((_c = (_b = result === null || result === void 0 ? void 0 : result.response) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.parentHash)).toEqual('string');
                        parentBlockHash = (_e = (_d = result === null || result === void 0 ? void 0 : result.response) === null || _d === void 0 ? void 0 : _d.result) === null || _e === void 0 ? void 0 : _e.parentHash;
                        parentExtraParams = [parentBlockHash, true];
                        return [4 /*yield*/, getTestResult(3, 'eth_getBlockByHash', parentExtraParams)];
                    case 3:
                        parentResult = _h.sent();
                        expect((_f = parentResult === null || parentResult === void 0 ? void 0 : parentResult.response) === null || _f === void 0 ? void 0 : _f.id).toEqual(3);
                        expect(parseInt(parentResult.response.result.number, 16)).toEqual(existingBlockNumberToCheck - 1);
                        expect((_g = parentResult === null || parentResult === void 0 ? void 0 : parentResult.response) === null || _g === void 0 ? void 0 : _g.result.hash).toEqual(parentBlockHash);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.no_tx.spec.js.map