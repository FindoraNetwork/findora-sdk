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
var KeypairApi = __importStar(require("../api/keypair"));
var Fee = __importStar(require("./fee"));
jest.mock('../api/sdkAsset/sdkAsset', function () { return ({
    getAssetDetails: jest.fn(),
}); });
var sdkAsset_1 = require("../api/sdkAsset/sdkAsset");
var mockGetAssetDetails = sdkAsset_1.getAssetDetails;
var amount = BigInt(3);
jest.mock('../api/network', function () { return ({
    getOwnerMemo: jest.fn(function () { return Promise.resolve({ response: null }); }),
}); });
describe('fee', function () {
    describe('getTransferOperation', function () {
        var pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
        var password = '123';
        var assetCode = 'foo';
        it('verifies that for no-traceble assets only non tracing methods are called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockedAssetNonTracing, fakeOpBuilder, spyGetEmptyTransferBuilder, spyInputNoTracing, spyInputWithTracing, spyOutputNoTracing, spyOutputWithTracing, spyGetAssetTracingPolicies, walletInfo, toPublickey, utxoInputsInfo, assetBlindRules, recieversInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedAssetNonTracing = {
                            address: 'a',
                            code: 'c',
                            issuer: 'i',
                            memo: '',
                            assetRules: {
                                decimals: 6,
                                transferable: true,
                                updatable: true,
                                transfer_multisig_rules: [3, 4],
                                max_units: 6,
                                tracing_policies: [],
                            },
                            numbers: amount,
                            name: 'n',
                            options: {
                                builtIn: false,
                                owned: false,
                            },
                        };
                        fakeOpBuilder = {
                            add_input_with_tracing: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_input_no_tracing: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_output_with_tracing: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_output_no_tracing: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                        };
                        mockGetAssetDetails.mockImplementation(jest.fn(function () { return Promise.resolve(mockedAssetNonTracing); }));
                        spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder');
                        spyGetEmptyTransferBuilder.mockImplementation(function () {
                            return Promise.resolve(fakeOpBuilder);
                        });
                        spyInputNoTracing = jest.spyOn(fakeOpBuilder, 'add_input_no_tracing');
                        spyInputWithTracing = jest.spyOn(fakeOpBuilder, 'add_input_with_tracing');
                        spyOutputNoTracing = jest.spyOn(fakeOpBuilder, 'add_output_no_tracing');
                        spyOutputWithTracing = jest.spyOn(fakeOpBuilder, 'add_output_with_tracing');
                        spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies');
                        spyGetAssetTracingPolicies.mockImplementation(function () {
                            return Promise.resolve(undefined);
                        });
                        return [4 /*yield*/, KeypairApi.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey)];
                    case 2:
                        toPublickey = _a.sent();
                        utxoInputsInfo = {
                            inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
                        };
                        assetBlindRules = { isAmountBlind: false, isTypeBlind: false };
                        recieversInfo = [
                            {
                                utxoNumbers: amount,
                                toPublickey: toPublickey,
                                assetBlindRules: assetBlindRules,
                            },
                        ];
                        return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode)];
                    case 3:
                        _a.sent();
                        expect(spyInputNoTracing).toHaveBeenCalledTimes(1);
                        expect(spyInputWithTracing).not.toBeCalled();
                        expect(spyOutputNoTracing).toHaveBeenCalledTimes(1);
                        expect(spyOutputWithTracing).not.toBeCalled();
                        mockGetAssetDetails.mockRestore();
                        spyGetEmptyTransferBuilder.mockRestore();
                        spyInputNoTracing.mockRestore();
                        spyInputWithTracing.mockRestore();
                        spyOutputNoTracing.mockRestore();
                        spyOutputWithTracing.mockRestore();
                        spyGetAssetTracingPolicies.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('verifies that for traceble assets only tracing methods are called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockedAssetTracing, fakeOpBuilderTwo, spyGetEmptyTransferBuilder, spyInputNoTracing, spyInputWithTracing, spyOutputNoTracing, spyOutputWithTracing, spyGetAssetTracingPolicies, walletInfo, toPublickey, utxoInputsInfo, assetBlindRules, recieversInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedAssetTracing = {
                            address: 'a',
                            code: 'c',
                            issuer: 'i',
                            memo: '',
                            assetRules: {
                                decimals: 6,
                                transferable: true,
                                updatable: true,
                                transfer_multisig_rules: [3, 4],
                                max_units: 6,
                                tracing_policies: [1, 2],
                            },
                            numbers: amount,
                            name: 'n',
                            options: {
                                builtIn: false,
                                owned: false,
                            },
                        };
                        fakeOpBuilderTwo = {
                            add_input_with_tracing: jest.fn(function () {
                                return fakeOpBuilderTwo;
                            }),
                            add_input_no_tracing: jest.fn(function () {
                                return fakeOpBuilderTwo;
                            }),
                            add_output_with_tracing: jest.fn(function () {
                                return fakeOpBuilderTwo;
                            }),
                            add_output_no_tracing: jest.fn(function () {
                                return fakeOpBuilderTwo;
                            }),
                        };
                        mockGetAssetDetails.mockImplementation(jest.fn(function () { return Promise.resolve(mockedAssetTracing); }));
                        spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder');
                        spyGetEmptyTransferBuilder.mockImplementation(function () {
                            return Promise.resolve(fakeOpBuilderTwo);
                        });
                        spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
                        spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
                        spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
                        spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');
                        spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies');
                        spyGetAssetTracingPolicies.mockImplementation(function () {
                            return Promise.resolve([1, 2]);
                        });
                        return [4 /*yield*/, KeypairApi.restoreFromPrivateKey(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        return [4 /*yield*/, KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey)];
                    case 2:
                        toPublickey = _a.sent();
                        utxoInputsInfo = {
                            inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
                        };
                        assetBlindRules = { isAmountBlind: false, isTypeBlind: false };
                        recieversInfo = [
                            {
                                utxoNumbers: amount,
                                toPublickey: toPublickey,
                                assetBlindRules: assetBlindRules,
                            },
                        ];
                        return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode)];
                    case 3:
                        _a.sent();
                        expect(spyInputNoTracing).not.toBeCalled();
                        expect(spyInputWithTracing).toHaveBeenCalledTimes(1);
                        expect(spyOutputNoTracing).not.toBeCalled();
                        expect(spyOutputWithTracing).toHaveBeenCalledTimes(1);
                        mockGetAssetDetails.mockRestore();
                        spyGetEmptyTransferBuilder.mockRestore();
                        spyInputNoTracing.mockRestore();
                        spyInputWithTracing.mockRestore();
                        spyOutputNoTracing.mockRestore();
                        spyOutputWithTracing.mockRestore();
                        spyGetAssetTracingPolicies.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // describe('buildTransferOperationWithFee', () => {});
    // describe('buildTransferOperation', () => {});
});
//# sourceMappingURL=fee.spec.js.map