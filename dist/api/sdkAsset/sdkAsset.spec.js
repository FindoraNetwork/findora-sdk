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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var asset_1 = require("../../config/asset");
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var NodeLedger = __importStar(require("../../services/ledger/nodeLedger"));
var KeypairApi = __importStar(require("../keypair/keypair"));
var NetworkApi = __importStar(require("../network/network"));
var SdkAsset = __importStar(require("./sdkAsset"));
describe('sdkAsset (unit test)', function () {
    describe('getFraAssetCode', function () {
        it('returns an fra asset code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fraAssetCode, myLedger, spyGetLedger, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fraAssetCode = 'AA';
                        myLedger = {
                            foo: 'node',
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        return [4 /*yield*/, SdkAsset.getFraAssetCode()];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalled();
                        expect(result).toBe(fraAssetCode);
                        spyGetLedger.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getMinimalFee', function () {
        it('returns an fra minimal fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fraMinimalFee, myLedger, spyGetLedger, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fraMinimalFee = BigInt(2);
                        myLedger = {
                            foo: 'node',
                            fra_get_minimal_fee: jest.fn(function () {
                                return fraMinimalFee;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        return [4 /*yield*/, SdkAsset.getMinimalFee()];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalled();
                        expect(result).toBe(fraMinimalFee);
                        spyGetLedger.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getFraPublicKey', function () {
        it('returns an fra public key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fraPublicKey, myLedger, spyGetLedger, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fraPublicKey = 'myPub';
                        myLedger = {
                            foo: 'node',
                            fra_get_dest_pubkey: jest.fn(function () {
                                return fraPublicKey;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        return [4 /*yield*/, SdkAsset.getFraPublicKey()];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalled();
                        expect(result).toBe(fraPublicKey);
                        spyGetLedger.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAssetCode', function () {
        it('returns a required asset code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var decryptedAsetType, val, myLedger, spyGetLedger, spyLedgerAssetTypeFromJsvalue, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decryptedAsetType = 'myPub';
                        val = [1, 2];
                        myLedger = {
                            foo: 'node',
                            asset_type_from_jsvalue: jest.fn(function () {
                                return decryptedAsetType;
                            }),
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
                        return [4 /*yield*/, SdkAsset.getAssetCode(val)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalledWith();
                        expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(val);
                        expect(result).toBe(decryptedAsetType);
                        spyGetLedger.mockRestore();
                        spyLedgerAssetTypeFromJsvalue.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getDefaultAssetRules', function () {
        it('returns default asset rules', function () { return __awaiter(void 0, void 0, void 0, function () {
            var defaultTransferable, defaultUpdatable, defaultDecimals, fakeLedgerAssetRules, myLedger, spyGetLedger, spyLedgerAssetRulesNew, spyLedgerAssetRulesSetTransferable, spyLedgerAssetRulesSetUpdatable, spyLedgerAssetRulesSetDecimals, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultTransferable = asset_1.DEFAULT_ASSET_RULES.transferable;
                        defaultUpdatable = asset_1.DEFAULT_ASSET_RULES.updatable;
                        defaultDecimals = asset_1.DEFAULT_ASSET_RULES.decimals;
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            AssetRules: fakeLedgerAssetRules,
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetRulesNew = jest.spyOn(fakeLedgerAssetRules, 'new');
                        spyLedgerAssetRulesSetTransferable = jest.spyOn(fakeLedgerAssetRules, 'set_transferable');
                        spyLedgerAssetRulesSetUpdatable = jest.spyOn(fakeLedgerAssetRules, 'set_updatable');
                        spyLedgerAssetRulesSetDecimals = jest.spyOn(fakeLedgerAssetRules, 'set_decimals');
                        return [4 /*yield*/, SdkAsset.getDefaultAssetRules()];
                    case 1:
                        result = _a.sent();
                        expect(spyGetLedger).toHaveBeenCalled();
                        expect(spyLedgerAssetRulesNew).toHaveBeenCalled();
                        expect(spyLedgerAssetRulesSetTransferable).toHaveBeenCalledWith(defaultTransferable);
                        expect(spyLedgerAssetRulesSetUpdatable).toHaveBeenCalledWith(defaultUpdatable);
                        expect(spyLedgerAssetRulesSetDecimals).toHaveBeenCalledWith(defaultDecimals);
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetLedger.mockRestore();
                        spyLedgerAssetRulesNew.mockRestore();
                        spyLedgerAssetRulesSetTransferable.mockRestore();
                        spyLedgerAssetRulesSetUpdatable.mockRestore();
                        spyLedgerAssetRulesSetDecimals.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAssetRules', function () {
        it('returns default asset rules if no new asset rules are given', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeLedgerAssetRules, spyGetDefaultAssetRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        return [4 /*yield*/, SdkAsset.getAssetRules()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetDefaultAssetRules.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset rules with max units set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeLedgerAssetRules, fakeLedgerAssetTracerKeyPair, fakeLedgerTracingPolicy, myLedger, maxNumbers, newAssetRules, spyGetDefaultAssetRules, spyGetLedger, spyLedgerAssetRulesSetMaxUnits, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_max_units: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            add_tracing_policy: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        fakeLedgerAssetTracerKeyPair = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetTracerKeyPair;
                            }),
                        };
                        fakeLedgerTracingPolicy = {
                            new_with_tracing: jest.fn(function () {
                                return fakeLedgerTracingPolicy;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            AssetRules: fakeLedgerAssetRules,
                            AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                            TracingPolicy: fakeLedgerTracingPolicy,
                        };
                        maxNumbers = '10000000';
                        newAssetRules = {
                            transferable: true,
                            updatable: false,
                            decimals: 6,
                            traceable: true,
                            maxNumbers: maxNumbers,
                        };
                        spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');
                        return [4 /*yield*/, SdkAsset.getAssetRules(newAssetRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerAssetRulesSetMaxUnits).toHaveBeenCalledWith(BigInt(maxNumbers));
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetDefaultAssetRules.mockRestore();
                        spyGetLedger.mockRestore();
                        spyLedgerAssetRulesSetMaxUnits.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset rules without max units set and setter is not called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeLedgerAssetRules, fakeLedgerAssetTracerKeyPair, fakeLedgerTracingPolicy, myLedger, newAssetRules, spyGetDefaultAssetRules, spyGetLedger, spyLedgerAssetRulesSetMaxUnits, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_max_units: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            add_tracing_policy: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        fakeLedgerAssetTracerKeyPair = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetTracerKeyPair;
                            }),
                        };
                        fakeLedgerTracingPolicy = {
                            new_with_tracing: jest.fn(function () {
                                return fakeLedgerTracingPolicy;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            AssetRules: fakeLedgerAssetRules,
                            AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                            TracingPolicy: fakeLedgerTracingPolicy,
                        };
                        newAssetRules = {
                            transferable: true,
                            updatable: false,
                            decimals: 6,
                            traceable: true,
                        };
                        spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');
                        return [4 /*yield*/, SdkAsset.getAssetRules(newAssetRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerAssetRulesSetMaxUnits).not.toHaveBeenCalled();
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetDefaultAssetRules.mockRestore();
                        spyGetLedger.mockRestore();
                        spyLedgerAssetRulesSetMaxUnits.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset rules with tracing policy', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeLedgerAssetRules, trackingKey, fakeLedgerAssetTracerKeyPair, tracingPolicy, fakeLedgerTracingPolicy, myLedger, newAssetRules, spyGetDefaultAssetRules, spyGetLedger, spyLedgerAssetTracerKeyPairNew, spyLedgerTracingPolicyNewWithTracing, spyLedgerAssetRulesAddTracingPolicy, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_max_units: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            add_tracing_policy: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        trackingKey = 'myTrackingKey';
                        fakeLedgerAssetTracerKeyPair = {
                            new: jest.fn(function () {
                                return trackingKey;
                            }),
                        };
                        tracingPolicy = 'myTracingPolicy';
                        fakeLedgerTracingPolicy = {
                            new_with_tracing: jest.fn(function () {
                                return tracingPolicy;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            AssetRules: fakeLedgerAssetRules,
                            AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                            TracingPolicy: fakeLedgerTracingPolicy,
                        };
                        newAssetRules = {
                            transferable: true,
                            updatable: false,
                            decimals: 6,
                            traceable: true,
                        };
                        spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
                        spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');
                        spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');
                        return [4 /*yield*/, SdkAsset.getAssetRules(newAssetRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerAssetTracerKeyPairNew).toHaveBeenCalled();
                        expect(spyLedgerTracingPolicyNewWithTracing).toHaveBeenCalledWith(trackingKey);
                        expect(spyLedgerAssetRulesAddTracingPolicy).toHaveBeenCalledWith(tracingPolicy);
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetDefaultAssetRules.mockRestore();
                        spyGetLedger.mockRestore();
                        spyLedgerAssetTracerKeyPairNew.mockRestore();
                        spyLedgerTracingPolicyNewWithTracing.mockRestore();
                        spyLedgerAssetRulesAddTracingPolicy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns asset rules without tracing policy and tracing method was not called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeLedgerAssetRules, trackingKey, fakeLedgerAssetTracerKeyPair, tracingPolicy, fakeLedgerTracingPolicy, myLedger, newAssetRules, spyGetDefaultAssetRules, spyGetLedger, spyLedgerAssetTracerKeyPairNew, spyLedgerTracingPolicyNewWithTracing, spyLedgerAssetRulesAddTracingPolicy, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_transferable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_updatable: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_decimals: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            set_max_units: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                            add_tracing_policy: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        trackingKey = 'myTrackingKey';
                        fakeLedgerAssetTracerKeyPair = {
                            new: jest.fn(function () {
                                return trackingKey;
                            }),
                        };
                        tracingPolicy = 'myTracingPolicy';
                        fakeLedgerTracingPolicy = {
                            new_with_tracing: jest.fn(function () {
                                return tracingPolicy;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            AssetRules: fakeLedgerAssetRules,
                            AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                            TracingPolicy: fakeLedgerTracingPolicy,
                        };
                        newAssetRules = {
                            transferable: true,
                            updatable: false,
                            decimals: 6,
                            traceable: false,
                        };
                        spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
                        spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');
                        spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');
                        return [4 /*yield*/, SdkAsset.getAssetRules(newAssetRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyLedgerAssetTracerKeyPairNew).not.toHaveBeenCalled();
                        expect(spyLedgerTracingPolicyNewWithTracing).not.toHaveBeenCalledWith();
                        expect(spyLedgerAssetRulesAddTracingPolicy).not.toHaveBeenCalledWith();
                        expect(result).toBe(fakeLedgerAssetRules);
                        spyGetDefaultAssetRules.mockRestore();
                        spyGetLedger.mockRestore();
                        spyLedgerAssetTracerKeyPairNew.mockRestore();
                        spyLedgerTracingPolicyNewWithTracing.mockRestore();
                        spyLedgerAssetRulesAddTracingPolicy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getDefineAssetTransactionBuilder', function () {
        it('returns transaction builder instance', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeOpBuilder, myLedger, height, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, spyNew, spyAddOperationCreateAsset, walletInfo, walletKeypair, assetName, assetRules, assetMemo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeOpBuilder = {
                            new: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_operation_create_asset: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeOpBuilder,
                        };
                        height = 15;
                        myStateCommitementResult = {
                            response: ['foo', height],
                        };
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyNew = jest.spyOn(fakeOpBuilder, 'new');
                        spyAddOperationCreateAsset = jest.spyOn(fakeOpBuilder, 'add_operation_create_asset');
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        assetRules = { foo: 'bar' };
                        assetMemo = 'memo';
                        return [4 /*yield*/, SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeOpBuilder);
                        expect(spyGetLedger).toBeCalled();
                        expect(spyNew).toHaveBeenCalledWith(BigInt(height));
                        expect(spyAddOperationCreateAsset).toHaveBeenCalledWith(walletKeypair, assetMemo, assetName, assetRules);
                        spyGetLedger.mockRestore();
                        spyNew.mockReset();
                        spyAddOperationCreateAsset.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result contains an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, walletInfo, walletKeypair, assetName, assetRules, assetMemo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLedger = {
                            foo: 'node',
                        };
                        myStateCommitementResult = {
                            error: new Error('myStateCommitementResult error'),
                        };
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        assetRules = { foo: 'bar' };
                        assetMemo = 'memo';
                        return [4 /*yield*/, expect(SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo)).rejects.toThrowError('myStateCommitementResult error')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result does not contain a response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, walletInfo, walletKeypair, assetName, assetRules, assetMemo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLedger = {
                            foo: 'node',
                        };
                        myStateCommitementResult = {};
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        assetRules = { foo: 'bar' };
                        assetMemo = 'memo';
                        return [4 /*yield*/, expect(SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo)).rejects.toThrowError('Could not receive response from state commitement call')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getIssueAssetTransactionBuilder', function () {
        it('returns transaction builder instance', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeOpBuilder, fakePubParams, myLedger, height, myStateCommitementResult, blockCount, spyGetStateCommitment, spyGetLedger, spyNew, spyAddBasicIssueAsset, walletInfo, walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals, result, utxoNumbers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeOpBuilder = {
                            new: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_operation_create_asset: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                            add_basic_issue_asset: jest.fn(function () {
                                return fakeOpBuilder;
                            }),
                        };
                        fakePubParams = {
                            new: jest.fn(function () {
                                return 'myParams';
                            }),
                        };
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeOpBuilder,
                            PublicParams: fakePubParams,
                        };
                        height = 15;
                        myStateCommitementResult = {
                            response: ['foo', height],
                        };
                        blockCount = BigInt(height);
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyNew = jest.spyOn(fakeOpBuilder, 'new');
                        spyAddBasicIssueAsset = jest.spyOn(fakeOpBuilder, 'add_basic_issue_asset');
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        amountToIssue = '11';
                        assetBlindRules = { foo: 'barbar' };
                        assetDecimals = 6;
                        return [4 /*yield*/, SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeOpBuilder);
                        expect(spyGetLedger).toBeCalled();
                        expect(spyNew).toHaveBeenCalledWith(BigInt(height));
                        utxoNumbers = BigInt((0, bigNumber_1.toWei)(amountToIssue, assetDecimals).toString());
                        expect(spyAddBasicIssueAsset).toHaveBeenCalledWith(walletKeypair, assetName, BigInt(blockCount), utxoNumbers, false, 'myParams');
                        spyGetStateCommitment.mockReset();
                        spyGetLedger.mockRestore();
                        spyNew.mockReset();
                        spyAddBasicIssueAsset.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result contains an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, walletInfo, walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLedger = {
                            foo: 'node',
                        };
                        myStateCommitementResult = {
                            error: new Error('myStateCommitementResult error'),
                        };
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        amountToIssue = '11';
                        assetBlindRules = { foo: 'barbar' };
                        assetDecimals = 6;
                        return [4 /*yield*/, expect(SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals)).rejects.toThrowError('myStateCommitementResult error')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result does not contain a response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, walletInfo, walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLedger = {
                            foo: 'node',
                        };
                        myStateCommitementResult = {};
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        walletKeypair = walletInfo.keypair;
                        assetName = 'abc';
                        amountToIssue = '11';
                        assetBlindRules = { foo: 'barbar' };
                        assetDecimals = 6;
                        return [4 /*yield*/, expect(SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals)).rejects.toThrowError('Could not receive response from state commitement call')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('defineAsset', function () {
        it('defines an asset', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, fakeLedgerAssetRules, fakeTransactionBuilder, spyGetAssetRules, spyBuildTransferOperationWithFee, spyGetDefineAssetTransactionBuilder, spyAddTransferOperation, walletInfo, assetName, assetMemo, newAssetRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetDefineAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        assetMemo = 'memo';
                        newAssetRules = {
                            transferable: true,
                            updatable: false,
                            decimals: 6,
                            traceable: true,
                        };
                        return [4 /*yield*/, SdkAsset.defineAsset(walletInfo, assetName, assetMemo, newAssetRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAssetRules).toHaveBeenCalledWith(newAssetRules);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyGetDefineAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, fakeLedgerAssetRules, assetMemo);
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyGetAssetRules.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetDefineAssetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transfer operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransferOperationBuilderFee, fakeLedgerAssetRules, spyGetAssetRules, spyBuildTransferOperationWithFee, walletInfo, assetName, assetMemo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        assetMemo = 'memo';
                        return [4 /*yield*/, expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not create transfer operation')];
                    case 1:
                        _a.sent();
                        spyGetAssetRules.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transaction builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, fakeLedgerAssetRules, spyGetAssetRules, spyBuildTransferOperationWithFee, spyGetDefineAssetTransactionBuilder, walletInfo, assetName, assetMemo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetDefineAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                            .mockImplementation(function () {
                            throw new Error('boom');
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        assetMemo = 'memo';
                        return [4 /*yield*/, expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not get "defineTransactionBuilder')];
                    case 1:
                        _a.sent();
                        spyGetAssetRules.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetDefineAssetTransactionBuilder.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not add a transfer operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, fakeLedgerAssetRules, fakeTransactionBuilder, spyGetAssetRules, spyBuildTransferOperationWithFee, spyGetDefineAssetTransactionBuilder, spyAddTransferOperation, walletInfo, assetName, assetMemo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeLedgerAssetRules = {
                            new: jest.fn(function () {
                                return fakeLedgerAssetRules;
                            }),
                        };
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetRules);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetDefineAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            throw new Error('boom');
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        assetMemo = 'memo';
                        return [4 /*yield*/, expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not add transfer operation')];
                    case 1:
                        _a.sent();
                        spyGetAssetRules.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetDefineAssetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('issueAsset', function () {
        it('issues an asset with default decimal, coming from asset details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, decimals, fakeLedgerAssetDetails, fakeTransactionBuilder, spyGetAssetDetails, spyBuildTransferOperationWithFee, spyGetIssueAssetTransactionBuilder, spyAddTransferOperation, walletInfo, assetName, amountToIssue, assetBlindRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetIssueAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        amountToIssue = '123';
                        assetBlindRules = {
                            isAmountBlind: false,
                            isTypeBlind: false,
                        };
                        return [4 /*yield*/, SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, decimals)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, decimals);
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyGetAssetDetails.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetIssueAssetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('issues an asset with a given decimal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, decimals, fakeLedgerAssetDetails, fakeTransactionBuilder, spyGetAssetDetails, spyBuildTransferOperationWithFee, spyGetIssueAssetTransactionBuilder, spyAddTransferOperation, walletInfo, assetName, amountToIssue, assetBlindRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetIssueAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        amountToIssue = '123';
                        assetBlindRules = {
                            isAmountBlind: false,
                            isTypeBlind: false,
                        };
                        return [4 /*yield*/, SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, 7);
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyGetAssetDetails.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetIssueAssetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transfer operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransferOperationBuilderFee, decimals, fakeLedgerAssetDetails, spyGetAssetDetails, spyBuildTransferOperationWithFee, walletInfo, assetName, amountToIssue, assetBlindRules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        amountToIssue = '123';
                        assetBlindRules = {
                            isAmountBlind: false,
                            isTypeBlind: false,
                        };
                        return [4 /*yield*/, expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not create transfer operation')];
                    case 1:
                        _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        spyGetAssetDetails.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transaction builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, decimals, fakeLedgerAssetDetails, spyGetAssetDetails, spyBuildTransferOperationWithFee, spyGetIssueAssetTransactionBuilder, walletInfo, assetName, amountToIssue, assetBlindRules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetIssueAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                            .mockImplementation(function () {
                            throw new Error('bdnd');
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        amountToIssue = '123';
                        assetBlindRules = {
                            isAmountBlind: false,
                            isTypeBlind: false,
                        };
                        return [4 /*yield*/, expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not get "issueAssetTransactionBuilder"')];
                    case 1:
                        _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        spyGetAssetDetails.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetIssueAssetTransactionBuilder.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transaction builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, decimals, fakeLedgerAssetDetails, fakeTransactionBuilder, spyGetAssetDetails, spyBuildTransferOperationWithFee, spyGetIssueAssetTransactionBuilder, spyAddTransferOperation, walletInfo, assetName, amountToIssue, assetBlindRules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetIssueAssetTransactionBuilder = jest
                            .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            throw new Error('bad');
                        });
                        walletInfo = {
                            publickey: 'senderPub',
                            keypair: 'senderKeypair',
                            address: 'myAddress',
                        };
                        assetName = 'acb';
                        amountToIssue = '123';
                        assetBlindRules = {
                            isAmountBlind: false,
                            isTypeBlind: false,
                        };
                        return [4 /*yield*/, expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not add transfer operation')];
                    case 1:
                        _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        spyGetAssetDetails.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetIssueAssetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAssetDetails', function () {
        it('returns asset details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetCode, issuerKey, issuerAddress, assetMemo, assetRules, assetResult, getAssetTokenResult, spyGetAssetToken, spGetAddressByPublicKey, result, expectedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetCode = 'abc';
                        issuerKey = 'myIssuerKey';
                        issuerAddress = 'myIssuerAddress';
                        assetMemo = 'myMemo';
                        assetRules = {
                            transferable: false,
                            updatable: false,
                        };
                        assetResult = {
                            properties: {
                                issuer: {
                                    key: issuerKey,
                                },
                                memo: assetMemo,
                                asset_rules: assetRules,
                            },
                        };
                        getAssetTokenResult = {
                            response: assetResult,
                        };
                        spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(function () {
                            return Promise.resolve(getAssetTokenResult);
                        });
                        spGetAddressByPublicKey = jest
                            .spyOn(KeypairApi, 'getAddressByPublicKey')
                            .mockImplementation(function () {
                            return Promise.resolve(issuerAddress);
                        });
                        return [4 /*yield*/, SdkAsset.getAssetDetails(assetCode)];
                    case 1:
                        result = _a.sent();
                        expectedResult = {
                            code: assetCode,
                            issuer: issuerKey,
                            address: issuerAddress,
                            memo: assetMemo,
                            assetRules: __assign(__assign({}, asset_1.DEFAULT_ASSET_RULES), assetRules),
                            numbers: BigInt(0),
                            name: '',
                        };
                        expect(result).toStrictEqual(expectedResult);
                        spyGetAssetToken.mockRestore();
                        spGetAddressByPublicKey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if could not get asset token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetCode, spyGetAssetToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetCode = 'abc';
                        spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(function () {
                            throw new Error('bcd');
                        });
                        return [4 /*yield*/, expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset token')];
                    case 1:
                        _a.sent();
                        spyGetAssetToken.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if could not get asset details - there is an error in the result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetCode, getAssetTokenResult, spyGetAssetToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetCode = 'abc';
                        getAssetTokenResult = {
                            error: new Error('dodo'),
                        };
                        spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(function () {
                            return Promise.resolve(getAssetTokenResult);
                        });
                        return [4 /*yield*/, expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset details')];
                    case 1:
                        _a.sent();
                        spyGetAssetToken.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if could not get asset details - there is no response in the result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var assetCode, getAssetTokenResult, spyGetAssetToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetCode = 'abc';
                        getAssetTokenResult = {};
                        spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(function () {
                            return Promise.resolve(getAssetTokenResult);
                        });
                        return [4 /*yield*/, expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset details - asset result is missing')];
                    case 1:
                        _a.sent();
                        spyGetAssetToken.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=sdkAsset.spec.js.map