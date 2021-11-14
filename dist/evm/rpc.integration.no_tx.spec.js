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
var Network = __importStar(require("../api/network/network"));
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../.env_rpc_" + process.env.RPC_ENV_NAME
    : "../../.env_example";
var envConfig = require(envConfigFile + ".json");
var rpcParams = envConfig.rpc;
var extendedExecutionTimeout = 20000;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);
var existingBlockNumberToCheck = 4;
describe("Api Endpoint (rpc test) for \"" + rpcUrl + "\"", function () {
    describe('eth_getBlockByNumber', function () {
        it('Returns information about a block by block number and verifies its parent block information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, extraParams, payload, result, response, parentBlockHash, payloadForParentBlock, parentResult, parentResponse;
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
                        expect(response === null || response === void 0 ? void 0 : response.result.number).toEqual('0x4');
                        expect(typeof ((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.parentHash)).toEqual('string');
                        parentBlockHash = (_b = response === null || response === void 0 ? void 0 : response.result) === null || _b === void 0 ? void 0 : _b.parentHash;
                        payloadForParentBlock = {
                            id: 2,
                            method: 'eth_getBlockByHash',
                            params: [parentBlockHash, true],
                        };
                        return [4 /*yield*/, Network.sendRpcCall(rpcUrl, payloadForParentBlock)];
                    case 2:
                        parentResult = _c.sent();
                        expect(parentResult).toHaveProperty('response');
                        expect(parentResult).not.toHaveProperty('error');
                        parentResponse = parentResult.response;
                        expect(parentResponse === null || parentResponse === void 0 ? void 0 : parentResponse.id).toEqual(2);
                        expect(parentResponse === null || parentResponse === void 0 ? void 0 : parentResponse.result.number).toEqual('0x3');
                        expect(parentResponse === null || parentResponse === void 0 ? void 0 : parentResponse.result.hash).toEqual(parentBlockHash);
                        return [2 /*return*/];
                }
            });
        }); }, extendedExecutionTimeout);
    });
});
//# sourceMappingURL=rpc.integration.no_tx.spec.js.map