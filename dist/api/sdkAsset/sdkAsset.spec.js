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
const asset_1 = require("../../config/asset");
const bigNumber_1 = require("../../services/bigNumber");
const Fee = __importStar(require("../../services/fee"));
const NodeLedger = __importStar(require("../../services/ledger/nodeLedger"));
const KeypairApi = __importStar(require("../keypair/keypair"));
const NetworkApi = __importStar(require("../network/network"));
const SdkAsset = __importStar(require("./sdkAsset"));
describe('sdkAsset (unit test)', () => {
    describe('getFraAssetCode', () => {
        it('returns an fra asset code', () => __awaiter(void 0, void 0, void 0, function* () {
            const fraAssetCode = 'AA';
            const myLedger = {
                foo: 'node',
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const result = yield SdkAsset.getFraAssetCode();
            expect(spyGetLedger).toHaveBeenCalled();
            expect(result).toBe(fraAssetCode);
            spyGetLedger.mockRestore();
        }));
    });
    describe('getMinimalFee', () => {
        it('returns an fra minimal fee', () => __awaiter(void 0, void 0, void 0, function* () {
            const fraMinimalFee = BigInt(2);
            const myLedger = {
                foo: 'node',
                fra_get_minimal_fee: jest.fn(() => {
                    return fraMinimalFee;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const result = yield SdkAsset.getMinimalFee();
            expect(spyGetLedger).toHaveBeenCalled();
            expect(result).toBe(fraMinimalFee);
            spyGetLedger.mockRestore();
        }));
    });
    describe('getFraPublicKey', () => {
        it('returns an fra public key', () => __awaiter(void 0, void 0, void 0, function* () {
            const fraPublicKey = 'myPub';
            const myLedger = {
                foo: 'node',
                fra_get_dest_pubkey: jest.fn(() => {
                    return fraPublicKey;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const result = yield SdkAsset.getFraPublicKey();
            expect(spyGetLedger).toHaveBeenCalled();
            expect(result).toBe(fraPublicKey);
            spyGetLedger.mockRestore();
        }));
    });
    describe('getAssetCode', () => {
        it('returns a required asset code', () => __awaiter(void 0, void 0, void 0, function* () {
            const decryptedAsetType = 'myPub';
            const val = [1, 2];
            const myLedger = {
                foo: 'node',
                asset_type_from_jsvalue: jest.fn(() => {
                    return decryptedAsetType;
                }),
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');
            const result = yield SdkAsset.getAssetCode(val);
            expect(spyGetLedger).toHaveBeenCalledWith();
            expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(val);
            expect(result).toBe(decryptedAsetType);
            spyGetLedger.mockRestore();
            spyLedgerAssetTypeFromJsvalue.mockRestore();
        }));
    });
    describe('getDefaultAssetRules', () => {
        it('returns default asset rules', () => __awaiter(void 0, void 0, void 0, function* () {
            const defaultTransferable = asset_1.DEFAULT_ASSET_RULES.transferable;
            const defaultUpdatable = asset_1.DEFAULT_ASSET_RULES.updatable;
            const defaultDecimals = asset_1.DEFAULT_ASSET_RULES.decimals;
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const myLedger = {
                foo: 'node',
                AssetRules: fakeLedgerAssetRules,
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetRulesNew = jest.spyOn(fakeLedgerAssetRules, 'new');
            const spyLedgerAssetRulesSetTransferable = jest.spyOn(fakeLedgerAssetRules, 'set_transferable');
            const spyLedgerAssetRulesSetUpdatable = jest.spyOn(fakeLedgerAssetRules, 'set_updatable');
            const spyLedgerAssetRulesSetDecimals = jest.spyOn(fakeLedgerAssetRules, 'set_decimals');
            const result = yield SdkAsset.getDefaultAssetRules();
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
        }));
    });
    describe('getAssetRules', () => {
        it('returns default asset rules if no new asset rules are given', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const result = yield SdkAsset.getAssetRules();
            expect(result).toBe(fakeLedgerAssetRules);
            spyGetDefaultAssetRules.mockRestore();
        }));
        it('returns asset rules with max units set', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_max_units: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                add_tracing_policy: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const fakeLedgerAssetTracerKeyPair = {
                new: jest.fn(() => {
                    return fakeLedgerAssetTracerKeyPair;
                }),
            };
            const fakeLedgerTracingPolicy = {
                new_with_tracing: jest.fn(() => {
                    return fakeLedgerTracingPolicy;
                }),
            };
            const myLedger = {
                foo: 'node',
                AssetRules: fakeLedgerAssetRules,
                AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                TracingPolicy: fakeLedgerTracingPolicy,
            };
            const maxNumbers = '10000000';
            const newAssetRules = {
                transferable: true,
                updatable: false,
                decimals: 6,
                traceable: true,
                maxNumbers,
            };
            const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');
            const result = yield SdkAsset.getAssetRules(newAssetRules);
            expect(spyLedgerAssetRulesSetMaxUnits).toHaveBeenCalledWith(BigInt(maxNumbers));
            expect(result).toBe(fakeLedgerAssetRules);
            spyGetDefaultAssetRules.mockRestore();
            spyGetLedger.mockRestore();
            spyLedgerAssetRulesSetMaxUnits.mockRestore();
        }));
        it('returns asset rules without max units set and setter is not called', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_max_units: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                add_tracing_policy: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const fakeLedgerAssetTracerKeyPair = {
                new: jest.fn(() => {
                    return fakeLedgerAssetTracerKeyPair;
                }),
            };
            const fakeLedgerTracingPolicy = {
                new_with_tracing: jest.fn(() => {
                    return fakeLedgerTracingPolicy;
                }),
            };
            const myLedger = {
                foo: 'node',
                AssetRules: fakeLedgerAssetRules,
                AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                TracingPolicy: fakeLedgerTracingPolicy,
            };
            const newAssetRules = {
                transferable: true,
                updatable: false,
                decimals: 6,
                traceable: true,
            };
            const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');
            const result = yield SdkAsset.getAssetRules(newAssetRules);
            expect(spyLedgerAssetRulesSetMaxUnits).not.toHaveBeenCalled();
            expect(result).toBe(fakeLedgerAssetRules);
            spyGetDefaultAssetRules.mockRestore();
            spyGetLedger.mockRestore();
            spyLedgerAssetRulesSetMaxUnits.mockRestore();
        }));
        it('returns asset rules with tracing policy', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_max_units: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                add_tracing_policy: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const trackingKey = 'myTrackingKey';
            const fakeLedgerAssetTracerKeyPair = {
                new: jest.fn(() => {
                    return trackingKey;
                }),
            };
            const tracingPolicy = 'myTracingPolicy';
            const fakeLedgerTracingPolicy = {
                new_with_tracing: jest.fn(() => {
                    return tracingPolicy;
                }),
            };
            const myLedger = {
                foo: 'node',
                AssetRules: fakeLedgerAssetRules,
                AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                TracingPolicy: fakeLedgerTracingPolicy,
            };
            const newAssetRules = {
                transferable: true,
                updatable: false,
                decimals: 6,
                traceable: true,
            };
            const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
            const spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');
            const spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');
            const result = yield SdkAsset.getAssetRules(newAssetRules);
            expect(spyLedgerAssetTracerKeyPairNew).toHaveBeenCalled();
            expect(spyLedgerTracingPolicyNewWithTracing).toHaveBeenCalledWith(trackingKey);
            expect(spyLedgerAssetRulesAddTracingPolicy).toHaveBeenCalledWith(tracingPolicy);
            expect(result).toBe(fakeLedgerAssetRules);
            spyGetDefaultAssetRules.mockRestore();
            spyGetLedger.mockRestore();
            spyLedgerAssetTracerKeyPairNew.mockRestore();
            spyLedgerTracingPolicyNewWithTracing.mockRestore();
            spyLedgerAssetRulesAddTracingPolicy.mockRestore();
        }));
        it('returns asset rules without tracing policy and tracing method was not called', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_transferable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_updatable: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_decimals: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                set_max_units: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
                add_tracing_policy: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const trackingKey = 'myTrackingKey';
            const fakeLedgerAssetTracerKeyPair = {
                new: jest.fn(() => {
                    return trackingKey;
                }),
            };
            const tracingPolicy = 'myTracingPolicy';
            const fakeLedgerTracingPolicy = {
                new_with_tracing: jest.fn(() => {
                    return tracingPolicy;
                }),
            };
            const myLedger = {
                foo: 'node',
                AssetRules: fakeLedgerAssetRules,
                AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
                TracingPolicy: fakeLedgerTracingPolicy,
            };
            const newAssetRules = {
                transferable: true,
                updatable: false,
                decimals: 6,
                traceable: false,
            };
            const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
            const spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');
            const spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');
            const result = yield SdkAsset.getAssetRules(newAssetRules);
            expect(spyLedgerAssetTracerKeyPairNew).not.toHaveBeenCalled();
            expect(spyLedgerTracingPolicyNewWithTracing).not.toHaveBeenCalledWith();
            expect(spyLedgerAssetRulesAddTracingPolicy).not.toHaveBeenCalledWith();
            expect(result).toBe(fakeLedgerAssetRules);
            spyGetDefaultAssetRules.mockRestore();
            spyGetLedger.mockRestore();
            spyLedgerAssetTracerKeyPairNew.mockRestore();
            spyLedgerTracingPolicyNewWithTracing.mockRestore();
            spyLedgerAssetRulesAddTracingPolicy.mockRestore();
        }));
    });
    describe('getDefineAssetTransactionBuilder', () => {
        it('returns transaction builder instance', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeOpBuilder = {
                new: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_operation_create_asset: jest.fn(() => {
                    return fakeOpBuilder;
                }),
            };
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeOpBuilder,
            };
            const height = 15;
            const myStateCommitementResult = {
                response: ['foo', height],
            };
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyNew = jest.spyOn(fakeOpBuilder, 'new');
            const spyAddOperationCreateAsset = jest.spyOn(fakeOpBuilder, 'add_operation_create_asset');
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const assetRules = { foo: 'bar' };
            const assetMemo = 'memo';
            const result = yield SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo);
            expect(result).toBe(fakeOpBuilder);
            expect(spyGetLedger).toBeCalled();
            expect(spyNew).toHaveBeenCalledWith(BigInt(height));
            expect(spyAddOperationCreateAsset).toHaveBeenCalledWith(walletKeypair, assetMemo, assetName, assetRules);
            spyGetLedger.mockRestore();
            spyNew.mockReset();
            spyAddOperationCreateAsset.mockReset();
            spyGetStateCommitment.mockReset();
        }));
        it('throws an error if state commitment result contains an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLedger = {
                foo: 'node',
            };
            const myStateCommitementResult = {
                error: new Error('myStateCommitementResult error'),
            };
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const assetRules = { foo: 'bar' };
            const assetMemo = 'memo';
            yield expect(SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo)).rejects.toThrowError('myStateCommitementResult error');
            spyGetLedger.mockReset();
            spyGetStateCommitment.mockReset();
        }));
        it('throws an error if state commitment result does not contain a response', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLedger = {
                foo: 'node',
            };
            const myStateCommitementResult = {};
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const assetRules = { foo: 'bar' };
            const assetMemo = 'memo';
            yield expect(SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo)).rejects.toThrowError('Could not receive response from state commitement call');
            spyGetLedger.mockReset();
            spyGetStateCommitment.mockReset();
        }));
    });
    describe('getIssueAssetTransactionBuilder', () => {
        it('returns transaction builder instance', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeOpBuilder = {
                new: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_operation_create_asset: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_basic_issue_asset: jest.fn(() => {
                    return fakeOpBuilder;
                }),
            };
            const fakePubParams = {
                new: jest.fn(() => {
                    return 'myParams';
                }),
            };
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeOpBuilder,
                PublicParams: fakePubParams,
            };
            const height = 15;
            const myStateCommitementResult = {
                response: ['foo', height],
            };
            const blockCount = BigInt(height);
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyNew = jest.spyOn(fakeOpBuilder, 'new');
            const spyAddBasicIssueAsset = jest.spyOn(fakeOpBuilder, 'add_basic_issue_asset');
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const amountToIssue = '11';
            const assetBlindRules = { foo: 'barbar' };
            const assetDecimals = 6;
            const result = yield SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals);
            expect(result).toBe(fakeOpBuilder);
            expect(spyGetLedger).toBeCalled();
            expect(spyNew).toHaveBeenCalledWith(BigInt(height));
            const utxoNumbers = BigInt((0, bigNumber_1.toWei)(amountToIssue, assetDecimals).toString());
            expect(spyAddBasicIssueAsset).toHaveBeenCalledWith(walletKeypair, assetName, BigInt(blockCount), utxoNumbers, false, 'myParams');
            spyGetStateCommitment.mockReset();
            spyGetLedger.mockRestore();
            spyNew.mockReset();
            spyAddBasicIssueAsset.mockReset();
        }));
        it('throws an error if state commitment result contains an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLedger = {
                foo: 'node',
            };
            const myStateCommitementResult = {
                error: new Error('myStateCommitementResult error'),
            };
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const amountToIssue = '11';
            const assetBlindRules = { foo: 'barbar' };
            const assetDecimals = 6;
            yield expect(SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals)).rejects.toThrowError('myStateCommitementResult error');
            spyGetLedger.mockReset();
            spyGetStateCommitment.mockReset();
        }));
        it('throws an error if state commitment result does not contain a response', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLedger = {
                foo: 'node',
            };
            const myStateCommitementResult = {};
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const walletKeypair = walletInfo.keypair;
            const assetName = 'abc';
            const amountToIssue = '11';
            const assetBlindRules = { foo: 'barbar' };
            const assetDecimals = 6;
            yield expect(SdkAsset.getIssueAssetTransactionBuilder(walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals)).rejects.toThrowError('Could not receive response from state commitement call');
            spyGetLedger.mockReset();
            spyGetStateCommitment.mockReset();
        }));
    });
    describe('defineAsset', () => {
        it('defines an asset', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetDefineAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const assetMemo = 'memo';
            const newAssetRules = {
                transferable: true,
                updatable: false,
                decimals: 6,
                traceable: true,
            };
            const result = yield SdkAsset.defineAsset(walletInfo, assetName, assetMemo, newAssetRules);
            expect(spyGetAssetRules).toHaveBeenCalledWith(newAssetRules);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            expect(spyGetDefineAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, fakeLedgerAssetRules, assetMemo);
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetAssetRules.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetDefineAssetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error when could not create a transfer operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const assetMemo = 'memo';
            yield expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not create transfer operation');
            spyGetAssetRules.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
        }));
        it('throws an error when could not create a transaction builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetDefineAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                .mockImplementation(() => {
                throw new Error('boom');
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const assetMemo = 'memo';
            yield expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not get "defineTransactionBuilder');
            spyGetAssetRules.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetDefineAssetTransactionBuilder.mockRestore();
        }));
        it('throws an error when could not add a transfer operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeLedgerAssetRules = {
                new: jest.fn(() => {
                    return fakeLedgerAssetRules;
                }),
            };
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetRules);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetDefineAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                throw new Error('boom');
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const assetMemo = 'memo';
            yield expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow('Could not add transfer operation');
            spyGetAssetRules.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetDefineAssetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
    });
    describe('issueAsset', () => {
        it('issues an asset with default decimal, coming from asset details', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetIssueAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const amountToIssue = '123';
            const assetBlindRules = {
                isAmountBlind: false,
                isTypeBlind: false,
            };
            const result = yield SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, decimals);
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, decimals);
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetAssetDetails.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetIssueAssetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('issues an asset with a given decimal', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetIssueAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const amountToIssue = '123';
            const assetBlindRules = {
                isAmountBlind: false,
                isTypeBlind: false,
            };
            const result = yield SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7);
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, 7);
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetAssetDetails.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetIssueAssetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error when could not create a transfer operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const amountToIssue = '123';
            const assetBlindRules = {
                isAmountBlind: false,
                isTypeBlind: false,
            };
            yield expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not create transfer operation');
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            spyGetAssetDetails.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
        }));
        it('throws an error when could not create a transaction builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetIssueAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                .mockImplementation(() => {
                throw new Error('bdnd');
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const amountToIssue = '123';
            const assetBlindRules = {
                isAmountBlind: false,
                isTypeBlind: false,
            };
            yield expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not get "issueAssetTransactionBuilder"');
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            spyGetAssetDetails.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetIssueAssetTransactionBuilder.mockRestore();
        }));
        it('throws an error when could not create a transaction builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetIssueAssetTransactionBuilder = jest
                .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                throw new Error('bad');
            });
            const walletInfo = {
                publickey: 'senderPub',
                keypair: 'senderKeypair',
                address: 'myAddress',
            };
            const assetName = 'acb';
            const amountToIssue = '123';
            const assetBlindRules = {
                isAmountBlind: false,
                isTypeBlind: false,
            };
            yield expect(SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7)).rejects.toThrow('Could not add transfer operation');
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            spyGetAssetDetails.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetIssueAssetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
    });
    describe('getAssetDetails', () => {
        it('returns asset details', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetCode = 'abc';
            const issuerKey = 'myIssuerKey';
            const issuerAddress = 'myIssuerAddress';
            const assetMemo = 'myMemo';
            const assetRules = {
                transferable: false,
                updatable: false,
            };
            const assetResult = {
                properties: {
                    issuer: {
                        key: issuerKey,
                    },
                    memo: assetMemo,
                    asset_rules: assetRules,
                },
            };
            const getAssetTokenResult = {
                response: assetResult,
            };
            const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
                return Promise.resolve(getAssetTokenResult);
            });
            const spGetAddressByPublicKey = jest
                .spyOn(KeypairApi, 'getAddressByPublicKey')
                .mockImplementation(() => {
                return Promise.resolve(issuerAddress);
            });
            const result = yield SdkAsset.getAssetDetails(assetCode);
            const expectedResult = {
                code: assetCode,
                issuer: issuerKey,
                address: issuerAddress,
                memo: assetMemo,
                assetRules: Object.assign(Object.assign({}, asset_1.DEFAULT_ASSET_RULES), assetRules),
                numbers: BigInt(0),
                name: '',
            };
            expect(result).toStrictEqual(expectedResult);
            spyGetAssetToken.mockRestore();
            spGetAddressByPublicKey.mockRestore();
        }));
        it('throws an error if could not get asset token', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetCode = 'abc';
            const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
                throw new Error('bcd');
            });
            yield expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset token');
            spyGetAssetToken.mockRestore();
        }));
        it('throws an error if could not get asset details - there is an error in the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetCode = 'abc';
            const getAssetTokenResult = {
                error: new Error('dodo'),
            };
            const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
                return Promise.resolve(getAssetTokenResult);
            });
            yield expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset details');
            spyGetAssetToken.mockRestore();
        }));
        it('throws an error if could not get asset details - there is no response in the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetCode = 'abc';
            const getAssetTokenResult = {};
            const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
                return Promise.resolve(getAssetTokenResult);
            });
            yield expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset details - asset result is missing');
            spyGetAssetToken.mockRestore();
        }));
    });
});
//# sourceMappingURL=sdkAsset.spec.js.map