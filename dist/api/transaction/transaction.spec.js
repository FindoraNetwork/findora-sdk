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
const Fee = __importStar(require("../../services/fee"));
const NodeLedger = __importStar(require("../../services/ledger/nodeLedger"));
const KeypairApi = __importStar(require("../keypair/keypair"));
const NetworkApi = __importStar(require("../network/network"));
const AssetApi = __importStar(require("../sdkAsset/sdkAsset"));
const Builder = __importStar(require("./builder"));
const Transaction = __importStar(require("./transaction"));
describe('transaction (unit test)', () => {
    describe('getTransactionBuilder', () => {
        it('returns transaction builder instance', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeOpBuilder = {
                new: jest.fn(() => {
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
            const result = yield Builder.getTransactionBuilder();
            expect(result).toBe(fakeOpBuilder);
            expect(spyGetLedger).toBeCalled();
            expect(spyNew).toBeCalled();
            expect(spyNew).toHaveBeenCalledWith(BigInt(height));
            spyGetLedger.mockRestore();
            spyNew.mockReset();
            spyGetStateCommitment.mockReset();
        }));
        it('throws an error if state commitment result contains an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLedger = {
                foo: 'node',
            };
            const myStateCommitementResult = {
                error: new Error('foo bar'),
            };
            const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
                return Promise.resolve(myStateCommitementResult);
            });
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            yield expect(Builder.getTransactionBuilder()).rejects.toThrowError('foo bar');
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
            yield expect(Builder.getTransactionBuilder()).rejects.toThrowError('Could not receive response from state commitement call');
            spyGetLedger.mockReset();
            spyGetStateCommitment.mockReset();
        }));
    });
    describe('sendToMany', () => {
        it('sends fra to recievers', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fraAssetCode = 'AA';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
            const result = yield Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode);
            expect(spyGetMinimalFee).toHaveBeenCalled();
            expect(spyGetFraPublicKey).toHaveBeenCalled();
            expect(spyBuildTransferOperation).toHaveBeenCalledWith(walletInfo, [
                {
                    assetBlindRules: undefined,
                    toPublickey: receiverPubKey,
                    utxoNumbers: BigInt(300000),
                },
                {
                    utxoNumbers: minimalFee,
                    toPublickey,
                },
            ], fraAssetCode);
            expect(spyGetTransactionBuilder).toHaveBeenCalled();
            expect(spyAddTransferOperation).toHaveBeenLastCalledWith(receivedTransferOperation);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyGetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error if can not create or sign transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    throw Error('can not sign');
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fraAssetCode = 'AA';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            yield expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not create transfer operation');
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
        }));
        it('throws an error if can not get transactionBuilder from getTransactionBuilder', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fraAssetCode = 'AA';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                throw new Error('foo');
            });
            yield expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not get transactionBuilder from "getTransactionBuilder"');
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyGetTransactionBuilder.mockRestore();
        }));
        it('throws an error if it can not add a transfer operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    throw new Error('boom');
                }),
            };
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fraAssetCode = 'AA';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
            yield expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not add transfer operation');
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyGetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('sends custom asset to recievers', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const receivedTransferOperationFee = 'txHashFee';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperationFee;
                }),
            };
            const fraAssetCode = 'AA';
            const customAssetCode = 'BB';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
            const result = yield Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode);
            expect(spyGetMinimalFee).not.toHaveBeenCalled();
            expect(spyGetFraPublicKey).not.toHaveBeenCalled();
            expect(spyBuildTransferOperation).toHaveBeenCalledWith(walletInfo, [
                {
                    assetBlindRules: undefined,
                    toPublickey: receiverPubKey,
                    utxoNumbers: BigInt(300000),
                },
            ], customAssetCode);
            expect(spyGetTransactionBuilder).toHaveBeenCalled();
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperationFee);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error if can not create or sign transaction to add fee', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const receivedTransferOperationFee = 'txHashFee';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    throw new Error('foofoo');
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperationFee;
                }),
            };
            const fraAssetCode = 'AA';
            const customAssetCode = 'BB';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
            yield expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow('Could not create transfer operation for fee');
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error if it can not add a transfer operation for fee', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const receivedTransferOperation = 'txHash';
            const receivedTransferOperationFee = 'txHashFee';
            const fakeTransferOperationBuilder = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilder;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperationFee;
                }),
            };
            const fraAssetCode = 'AA';
            const customAssetCode = 'BB';
            const receiverPubKey = 'toPubKey';
            const minimalFee = BigInt(2);
            const toPublickey = 'mockedToPublickey';
            const walletInfo = { publickey: 'senderPub' };
            const toWalletInfo = { publickey: receiverPubKey };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
            const myLedger = {
                foo: 'node',
                TransactionBuilder: fakeTransactionBuilder,
                TransferOperationBuilder: fakeTransferOperationBuilder,
                fra_get_asset_code: jest.fn(() => {
                    return fraAssetCode;
                }),
                public_key_from_base64: jest.fn(() => {
                    return receiverPubKey;
                }),
            };
            const assetDetails = {
                assetRules: {
                    decimals: 5,
                },
            };
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myLedger);
            });
            const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(assetDetails);
            });
            const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
                return Promise.resolve(minimalFee);
            });
            const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
                return Promise.resolve(toPublickey);
            });
            const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilder);
            });
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
            spyAddTransferOperation
                .mockImplementationOnce(() => {
                return fakeTransactionBuilder;
            })
                .mockImplementationOnce(() => {
                throw Error('barfoo');
            });
            yield expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow('Could not add transfer operation for fee');
            spyGetLedger.mockRestore();
            spyGetAssetDetails.mockRestore();
            spyGetMinimalFee.mockRestore();
            spyGetFraPublicKey.mockRestore();
            spyBuildTransferOperation.mockRestore();
            spyBuildTransferOperationWithFee.mockRestore();
            spyGetTransactionBuilder.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
    });
    describe('submitTransaction', () => {
        it('submits a transaction and returns a handle', () => __awaiter(void 0, void 0, void 0, function* () {
            const myHandle = 'myHandleFromSubmit';
            const submitData = {
                foo: 'bar',
            };
            const fakeTransactionBuilder = {
                transaction: jest.fn(() => {
                    return submitData;
                }),
            };
            const submitResult = {
                response: myHandle,
            };
            const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
                return Promise.resolve(submitResult);
            });
            const handle = yield Transaction.submitTransaction(fakeTransactionBuilder);
            expect(spySubmitTransaction).toHaveBeenCalledWith(submitData);
            expect(handle).toBe(myHandle);
            spySubmitTransaction.mockRestore();
        }));
        it('throws an error if network call to submit data has failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const submitData = {
                foo: 'bar',
            };
            const fakeTransactionBuilder = {
                transaction: jest.fn(() => {
                    return submitData;
                }),
            };
            const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
                throw new Error('foo');
            });
            yield expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Error Could not submit transaction');
            spySubmitTransaction.mockRestore();
        }));
        it('throws an error if network call to submit data has return an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const submitData = {
                foo: 'bar',
            };
            const fakeTransactionBuilder = {
                transaction: jest.fn(() => {
                    return submitData;
                }),
            };
            const submitResult = {
                error: new Error('barfoo'),
            };
            const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
                return Promise.resolve(submitResult);
            });
            yield expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Could not submit transaction');
            spySubmitTransaction.mockRestore();
        }));
        it('throws an error if network call to submit data has an empty handle as a response', () => __awaiter(void 0, void 0, void 0, function* () {
            const submitData = {
                foo: 'bar',
            };
            const fakeTransactionBuilder = {
                transaction: jest.fn(() => {
                    return submitData;
                }),
            };
            const submitResult = {
                response: undefined,
            };
            const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
                return Promise.resolve(submitResult);
            });
            yield expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Handle is missing. Could not submit transaction');
            spySubmitTransaction.mockRestore();
        }));
    });
    describe('sendToPublicKey', () => {
        it('send a transaction to an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const walletInfo = { publickey: 'senderPub' };
            const publicKey = 'pub123';
            const address = 'fra123';
            const amount = '0.5';
            const assetCode = 'CCC';
            const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
            const spyGetAddressByPublicKey = jest
                .spyOn(KeypairApi, 'getAddressByPublicKey')
                .mockImplementation(() => {
                return Promise.resolve(address);
            });
            const spySendToAddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const result = yield Transaction.sendToPublicKey(walletInfo, publicKey, amount, assetCode, assetBlindRules);
            expect(spyGetAddressByPublicKey).toHaveBeenCalledWith(publicKey);
            expect(spySendToAddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
            expect(result).toBe(fakeTransactionBuilder);
            spySendToAddress.mockRestore();
            spyGetAddressByPublicKey.mockRestore();
        }));
    });
    describe('sendToAddress', () => {
        it('send a transaction to an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const walletInfo = { publickey: 'senderPub' };
            const address = 'fra123';
            const amount = '0.5';
            const assetCode = 'CCC';
            const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
            const toWalletInfoLight = {
                address: 'fra123',
                publickey: 'pub456',
            };
            const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];
            const spyGetAddressPublicAndKey = jest
                .spyOn(KeypairApi, 'getAddressPublicAndKey')
                .mockImplementation(() => {
                return Promise.resolve(toWalletInfoLight);
            });
            const spySendToMany = jest.spyOn(Transaction, 'sendToMany').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const result = yield Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules);
            expect(spyGetAddressPublicAndKey).toHaveBeenCalledWith(address);
            expect(spySendToMany).toHaveBeenCalledWith(walletInfo, recieversInfo, assetCode, assetBlindRules);
            expect(result).toBe(fakeTransactionBuilder);
            spySendToMany.mockRestore();
            spyGetAddressPublicAndKey.mockRestore();
        }));
    });
    // describe('getTxList', () => {
    //   it('returns a list of transactions', async () => {
    //     const address = 'fra123';
    //     const type = 'to';
    //     const page = 2;
    //     const transparent = 'transparent';
    //     const totalTxQuantity = 5;
    //     const dataResult = {
    //       response: {
    //         result: {
    //           total_count: totalTxQuantity,
    //         },
    //       },
    //     } as unknown as NetworkTypes.TxListDataResult;
    //     const txList = [
    //       {
    //         foo: 'bar',
    //       },
    //     ] as unknown as NetworkTypes.TxInfo[];
    //     const processedTxList = [
    //       {
    //         bar: 'foo',
    //       },
    //     ] as unknown as ProcessedTxInfo[];
    //     const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
    //       return Promise.resolve(dataResult);
    //     });
    //     const spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(() => {
    //       return txList;
    //     });
    //     const spyProcesseTxInfoList = jest.spyOn(Processor, 'processeTxInfoList').mockImplementation(() => {
    //       return Promise.resolve(processedTxList);
    //     });
    //     const result = await Transaction.getTxList(address, type, page);
    //     expect(spyGetTxList).toHaveBeenCalledWith(address, type, page, transparent);
    //     expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);
    //     expect(spyProcesseTxInfoList).toHaveBeenCalledWith(txList);
    //     expect(result).toEqual({
    //       total_count: totalTxQuantity,
    //       txs: processedTxList,
    //     });
    //     spyGetTxList.mockRestore();
    //     spyGetTxListFromResponse.mockRestore();
    //     spyProcesseTxInfoList.mockRestore();
    //   });
    //   it('throws an error if it can not fetch a list of transactions', async () => {
    //     const address = 'fra123';
    //     const type = 'to';
    //     const page = 2;
    //     const transparent = 'transparent';
    //     const dataResult = {} as unknown as NetworkTypes.TxListDataResult;
    //     const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
    //       return Promise.resolve(dataResult);
    //     });
    //     await expect(Transaction.getTxList(address, type, page)).rejects.toThrow(
    //       'Could not fetch a list of transactions. No response from the server',
    //     );
    //     spyGetTxList.mockRestore();
    //   });
    //   it('throws an error if there is no list of transactions', async () => {
    //     const address = 'fra123';
    //     const type = 'to';
    //     const page = 2;
    //     const transparent = 'transparent';
    //     const totalTxQuantity = 5;
    //     const dataResult = {
    //       response: {
    //         result: {
    //           total_count: totalTxQuantity,
    //         },
    //       },
    //     } as unknown as NetworkTypes.TxListDataResult;
    //     const txList = undefined as unknown as NetworkTypes.TxInfo[];
    //     const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
    //       return Promise.resolve(dataResult);
    //     });
    //     const spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(() => {
    //       return txList;
    //     });
    //     await expect(Transaction.getTxList(address, type, page)).rejects.toThrow(
    //       'Could not get a list of transactions from the server response',
    //     );
    //     expect(spyGetTxList).toHaveBeenCalledWith(address, type, page, transparent);
    //     expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);
    //     spyGetTxList.mockRestore();
    //     spyGetTxListFromResponse.mockRestore();
    //   });
    // });
});
//# sourceMappingURL=transaction.spec.js.map