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
const KeypairApi = __importStar(require("../api/keypair"));
const NetworkApi = __importStar(require("../api/network/network"));
const Asset = __importStar(require("../api/sdkAsset/sdkAsset"));
const Fee = __importStar(require("./fee"));
const Ledger = __importStar(require("./ledger/ledgerWrapper"));
const UtxoHelper = __importStar(require("./utxoHelper"));
describe('fee (unit test)', () => {
    const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
    const password = '123';
    const assetCode = 'foo';
    const amount = BigInt(3);
    describe('getEmptyTransferBuilder', () => {
        it('creates an instance of a transfer operation builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeOpBuilder = {
                new: jest.fn(() => {
                    return fakeOpBuilder;
                }),
            };
            const fakedLedger = {
                TransferOperationBuilder: fakeOpBuilder,
            };
            const spyLedger = jest
                .spyOn(Ledger, 'getLedger')
                .mockImplementation(jest.fn(() => Promise.resolve(fakedLedger)));
            const res = yield Fee.getEmptyTransferBuilder();
            expect(res).toBe(fakeOpBuilder);
            spyLedger.mockRestore();
        }));
    });
    describe('getAssetTracingPolicies', () => {
        it('creates an instance of a transfer operation builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const tPol = [1, 2];
            const fakeAsset = {
                get_tracing_policies: jest.fn(() => {
                    return tPol;
                }),
            };
            const fakeAssetType = {
                from_json: jest.fn(() => {
                    return fakeAsset;
                }),
            };
            const fakedLedger = {
                AssetType: fakeAssetType,
            };
            const spyLedger = jest
                .spyOn(Ledger, 'getLedger')
                .mockImplementation(jest.fn(() => Promise.resolve(fakedLedger)));
            const asset = { foo: 1 };
            const res = yield Fee.getAssetTracingPolicies(asset);
            expect(res).toBe(tPol);
            spyLedger.mockRestore();
        }));
    });
    describe('getTransferOperation', () => {
        it('verifies that for no-traceble assets only non tracing methods are called', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedAssetNonTracing = {
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
            const fakeOpBuilder = {
                add_input_with_tracing: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_input_no_tracing: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_output_with_tracing: jest.fn(() => {
                    return fakeOpBuilder;
                }),
                add_output_no_tracing: jest.fn(() => {
                    return fakeOpBuilder;
                }),
            };
            const mockGetAssetDetails = jest
                .spyOn(Asset, 'getAssetDetails')
                .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetNonTracing)));
            const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
                return Promise.resolve(fakeOpBuilder);
            });
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve({ response: null });
            });
            const spyInputNoTracing = jest.spyOn(fakeOpBuilder, 'add_input_no_tracing');
            const spyInputWithTracing = jest.spyOn(fakeOpBuilder, 'add_input_with_tracing');
            const spyOutputNoTracing = jest.spyOn(fakeOpBuilder, 'add_output_no_tracing');
            const spyOutputWithTracing = jest.spyOn(fakeOpBuilder, 'add_output_with_tracing');
            const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
                return Promise.resolve(undefined);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            const toPublickey = yield KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);
            const utxoInputsInfo = {
                inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
            };
            const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };
            const recieversInfo = [
                {
                    utxoNumbers: amount,
                    toPublickey,
                    assetBlindRules,
                },
            ];
            let transferOperationBuilder = yield Fee.getEmptyTransferBuilder();
            yield Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode, transferOperationBuilder);
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
            spyGetOwnerMemo.mockRestore();
            spyGetAssetTracingPolicies.mockRestore();
        }));
        it('verifies that for traceble assets only tracing methods are called', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedAssetTracing = {
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
            const fakeOpBuilderTwo = {
                add_input_with_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_input_no_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_output_with_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_output_no_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
            };
            const mockGetAssetDetails = jest
                .spyOn(Asset, 'getAssetDetails')
                .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetTracing)));
            const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
                return Promise.resolve(fakeOpBuilderTwo);
            });
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve({ response: null });
            });
            const spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
            const spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
            const spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
            const spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');
            const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
                return Promise.resolve([1, 2]);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            const toPublickey = yield KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);
            const utxoInputsInfo = {
                inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
            };
            const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };
            const recieversInfo = [
                {
                    utxoNumbers: amount,
                    toPublickey,
                    assetBlindRules,
                },
            ];
            let transferOperationBuilder = yield Fee.getEmptyTransferBuilder();
            yield Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode, transferOperationBuilder);
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
            spyGetOwnerMemo.mockRestore();
            spyGetAssetTracingPolicies.mockRestore();
        }));
        it('throws an error if there was an error while fetching owner memo data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedAssetTracing = {
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
            const fakeOpBuilderTwo = {
                add_input_with_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_input_no_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_output_with_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
                add_output_no_tracing: jest.fn(() => {
                    return fakeOpBuilderTwo;
                }),
            };
            const mockGetAssetDetails = jest
                .spyOn(Asset, 'getAssetDetails')
                .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetTracing)));
            const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
                return Promise.resolve(fakeOpBuilderTwo);
            });
            const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
                return Promise.resolve({
                    error: { message: 'foobar' },
                });
            });
            const spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
            const spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
            const spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
            const spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');
            const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
                return Promise.resolve([1, 2]);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            const toPublickey = yield KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);
            const utxoInputsInfo = {
                inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
            };
            const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };
            const recieversInfo = [
                {
                    utxoNumbers: amount,
                    toPublickey,
                    assetBlindRules,
                },
            ];
            let transferOperationBuilder = yield Fee.getEmptyTransferBuilder();
            yield expect(Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode, transferOperationBuilder)).rejects.toThrowError('Could not fetch memo data for sid ');
            expect(spyInputNoTracing).not.toBeCalled();
            expect(spyInputWithTracing).not.toBeCalled();
            expect(spyOutputNoTracing).not.toBeCalled();
            expect(spyOutputWithTracing).not.toBeCalled();
            mockGetAssetDetails.mockRestore();
            spyGetEmptyTransferBuilder.mockRestore();
            spyInputNoTracing.mockRestore();
            spyInputWithTracing.mockRestore();
            spyOutputNoTracing.mockRestore();
            spyOutputWithTracing.mockRestore();
            spyGetOwnerMemo.mockRestore();
            spyGetAssetTracingPolicies.mockRestore();
        }));
    });
    describe('buildTransferOperationWithFee ', () => {
        it('builds a transfer operation succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidsResult = { response: [1, 2, 3] };
            const utxoDataList = [{ foo: 'bar' }];
            const minimalFee = BigInt(1);
            const fraAssetCode = 'fra';
            const sendUtxoList = [{ bar: 1 }];
            const utxoInputsInfo = 2;
            const toPublickey = 1;
            const transferOperationBuilder = { foo: 'bar' };
            const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
                return Promise.resolve(sidsResult);
            });
            const spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataList);
            });
            const spyAddUtxoInputs = jest.spyOn(UtxoHelper, 'addUtxoInputs').mockImplementation(() => {
                return Promise.resolve(utxoInputsInfo);
            });
            const spyGetSendUtxo = jest.spyOn(UtxoHelper, 'getSendUtxo').mockImplementation(() => {
                return sendUtxoList;
            });
            const spyGetFraAssetCode = jest.spyOn(Asset, 'getFraAssetCode').mockImplementation(() => {
                return Promise.resolve(fraAssetCode);
            });
            const spyGetMinimalFee = jest.spyOn(Asset, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(Asset, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyGetTransferOperation = jest.spyOn(Fee, 'getTransferOperation').mockImplementation(() => {
                return Promise.resolve(transferOperationBuilder);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            const recieversInfo = [
                {
                    utxoNumbers: minimalFee,
                    toPublickey,
                },
            ];
            yield Fee.buildTransferOperationWithFee(walletInfo);
            expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, sidsResult.response);
            expect(spyGetSendUtxo).toHaveBeenCalledWith(fraAssetCode, minimalFee, utxoDataList);
            expect(spyAddUtxoInputs).toHaveBeenCalledWith(sendUtxoList);
            expect(spyGetTransferOperation).toHaveBeenCalledWith(walletInfo, utxoInputsInfo, recieversInfo, fraAssetCode);
            spyGetOwnedSids.mockRestore();
            spyAddUtxo.mockRestore();
            spyAddUtxoInputs.mockRestore();
            spyGetSendUtxo.mockRestore();
            spyGetFraAssetCode.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyGetTransferOperation.mockRestore();
        }));
        it('throws an error if sids were not fetched', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidsResult = { foo: 'bar' };
            const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
                return Promise.resolve(sidsResult);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            yield expect(Fee.buildTransferOperationWithFee(walletInfo)).rejects.toThrowError('No sids were fetched');
            spyGetOwnedSids.mockRestore();
        }));
    });
    describe('buildTransferOperation', () => {
        it('builds a transfer operation succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidsResult = { response: [1, 2, 3] };
            const utxoDataList = [{ foo: 'bar' }];
            const minimalFee = BigInt(1);
            const fraAssetCode = 'fra';
            const sendUtxoList = [{ bar: 1 }];
            const utxoInputsInfo = 2;
            const toPublickey = 1;
            const transferOperationBuilder = { foo: 'bar' };
            const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
                return Promise.resolve(sidsResult);
            });
            const spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo').mockImplementation(() => {
                return Promise.resolve(utxoDataList);
            });
            const spyAddUtxoInputs = jest.spyOn(UtxoHelper, 'addUtxoInputs').mockImplementation(() => {
                return Promise.resolve(utxoInputsInfo);
            });
            const spyGetSendUtxo = jest.spyOn(UtxoHelper, 'getSendUtxo').mockImplementation(() => {
                return sendUtxoList;
            });
            const spyGetFraAssetCode = jest.spyOn(Asset, 'getFraAssetCode').mockImplementation(() => {
                return Promise.resolve(fraAssetCode);
            });
            const spyGetMinimalFee = jest.spyOn(Asset, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(Asset, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyGetTransferOperation = jest.spyOn(Fee, 'getTransferOperation').mockImplementation(() => {
                return Promise.resolve(transferOperationBuilder);
            });
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            const recieversInfo = [
                {
                    utxoNumbers: minimalFee,
                    toPublickey,
                },
                {
                    utxoNumbers: minimalFee,
                    toPublickey,
                },
            ];
            const totalMinimalFee = BigInt(Number(minimalFee) + Number(minimalFee));
            yield Fee.buildTransferOperation(walletInfo, recieversInfo, fraAssetCode);
            expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, sidsResult.response);
            expect(spyGetSendUtxo).toHaveBeenCalledWith(fraAssetCode, totalMinimalFee, utxoDataList); //
            expect(spyAddUtxoInputs).toHaveBeenCalledWith(sendUtxoList);
            expect(spyGetTransferOperation).toHaveBeenCalledWith(walletInfo, utxoInputsInfo, recieversInfo, fraAssetCode);
            spyGetOwnedSids.mockRestore();
            spyAddUtxo.mockRestore();
            spyAddUtxoInputs.mockRestore();
            spyGetSendUtxo.mockRestore();
            spyGetFraAssetCode.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyGetTransferOperation.mockRestore();
        }));
        it('throws an error if sids were not fetched', () => __awaiter(void 0, void 0, void 0, function* () {
            const sidsResult = { foo: 'bar' };
            const minimalFee = BigInt(1);
            const toPublickey = 1;
            const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
                return Promise.resolve(sidsResult);
            });
            const recieversInfo = [
                {
                    utxoNumbers: minimalFee,
                    toPublickey,
                },
            ];
            const walletInfo = yield KeypairApi.restoreFromPrivateKey(pkey, password);
            yield expect(Fee.buildTransferOperation(walletInfo, recieversInfo, assetCode)).rejects.toThrowError('No sids were fetched');
            spyGetOwnedSids.mockRestore();
        }));
    });
});
//# sourceMappingURL=fee.spec.js.map