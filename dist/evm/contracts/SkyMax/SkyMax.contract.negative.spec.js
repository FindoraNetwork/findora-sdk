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
var assert_1 = __importDefault(require("assert"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var web3_1 = __importDefault(require("web3"));
var testHelpers_1 = require("../../testHelpers");
var compile_1 = require("./compile");
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../../../.env_rpc_".concat(process.env.RPC_ENV_NAME)
    : "../../../../.env_example";
var envConfig = require("".concat(envConfigFile, ".json"));
var rpcParams = envConfig.rpc;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a, mnemonic = rpcParams.mnemonic;
var extendedExecutionTimeout = 600000;
var contract;
var accounts;
var networkId;
(0, testHelpers_1.timeStart)();
var provider = new truffle_hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
var web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
describe("SkyMax Contract (contract test negative) \"".concat(rpcUrl, "\""), function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('');
                    return [4 /*yield*/, web3.eth.net.getId()];
                case 1:
                    networkId = _a.sent();
                    return [4 /*yield*/, web3.eth.getAccounts()];
                case 2:
                    accounts = _a.sent();
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, new web3.eth.Contract(JSON.parse(compile_1.contractInterface))
                            .deploy({ data: compile_1.contractBytecode, arguments: ['Hi there'] })
                            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 3:
                    contract = _a.sent();
                    (0, testHelpers_1.timeLog)('Contract deployment');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract does not crashes and returns an error if method is called with invalid type of a parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract does not crashes and returns an error if method is called with invalid type of a parameter');
                    errorMessage = '';
                    (0, testHelpers_1.timeStart)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: 'aaaaaa' }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
                    errorMessage = err_1.message;
                    return [3 /*break*/, 4];
                case 4:
                    assert_1.default.ok(errorMessage);
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract does not crashes and returns an error if method is called with invalid number of parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract does not crashes and returns an error if method is called with invalid number of parameters');
                    errorMessage = '';
                    (0, testHelpers_1.timeStart)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.methods.setMessage().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
                    errorMessage = err_2.message;
                    return [3 /*break*/, 4];
                case 4:
                    assert_1.default.ok(errorMessage);
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract it does not do any operations which must not be done when transaction is reverted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, err_3, currentMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errorMessage = '';
                    (0, testHelpers_1.setCurrentTestName)('validates that contract it does not do any operations which must not be done when transaction is reverted');
                    (0, testHelpers_1.timeStart)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.methods.setMessage().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
                    errorMessage = err_3.message;
                    return [3 /*break*/, 4];
                case 4:
                    assert_1.default.ok(errorMessage);
                    return [4 /*yield*/, contract.methods.message().call()];
                case 5:
                    currentMessage = _a.sent();
                    expect(currentMessage).toEqual('Hi there');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
});
//# sourceMappingURL=SkyMax.contract.negative.spec.js.map