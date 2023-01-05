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
var Fee = __importStar(require("../../services/fee"));
var NodeLedger = __importStar(require("../../services/ledger/nodeLedger"));
var KeypairApi = __importStar(require("../keypair/keypair"));
var NetworkApi = __importStar(require("../network/network"));
var AssetApi = __importStar(require("../sdkAsset/sdkAsset"));
var Builder = __importStar(require("./builder"));
var helpers = __importStar(require("./helpers"));
var Processor = __importStar(require("./processor"));
var Transaction = __importStar(require("./transaction"));
describe('transaction (unit test)', function () {
    describe('getTransactionBuilder', function () {
        it('returns transaction builder instance', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeOpBuilder, myLedger, height, myStateCommitementResult, spyGetStateCommitment, spyGetLedger, spyNew, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeOpBuilder = {
                            new: jest.fn(function () {
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
                        return [4 /*yield*/, Builder.getTransactionBuilder()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeOpBuilder);
                        expect(spyGetLedger).toBeCalled();
                        expect(spyNew).toBeCalled();
                        expect(spyNew).toHaveBeenCalledWith(BigInt(height));
                        spyGetLedger.mockRestore();
                        spyNew.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result contains an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myLedger = {
                            foo: 'node',
                        };
                        myStateCommitementResult = {
                            error: new Error('foo bar'),
                        };
                        spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(function () {
                            return Promise.resolve(myStateCommitementResult);
                        });
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        return [4 /*yield*/, expect(Builder.getTransactionBuilder()).rejects.toThrowError('foo bar')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if state commitment result does not contain a response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myLedger, myStateCommitementResult, spyGetStateCommitment, spyGetLedger;
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
                        return [4 /*yield*/, expect(Builder.getTransactionBuilder()).rejects.toThrowError('Could not receive response from state commitement call')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockReset();
                        spyGetStateCommitment.mockReset();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sendToMany', function () {
        it('sends fra to recievers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilder, fraAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyGetTransactionBuilder, spyAddTransferOperation, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fraAssetCode = 'AA';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
                        return [4 /*yield*/, Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)];
                    case 1:
                        result = _a.sent();
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
                                toPublickey: toPublickey,
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not create or sign transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilder, fraAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                throw Error('can not sign');
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fraAssetCode = 'AA';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        return [4 /*yield*/, expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not create transfer operation')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockRestore();
                        spyGetAssetDetails.mockRestore();
                        spyGetMinimalFee.mockRestore();
                        spyGetFraPublicKey.mockRestore();
                        spyBuildTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not get transactionBuilder from getTransactionBuilder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilder, fraAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyGetTransactionBuilder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fraAssetCode = 'AA';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            throw new Error('foo');
                        });
                        return [4 /*yield*/, expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not get transactionBuilder from "getTransactionBuilder"')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockRestore();
                        spyGetAssetDetails.mockRestore();
                        spyGetMinimalFee.mockRestore();
                        spyGetFraPublicKey.mockRestore();
                        spyBuildTransferOperation.mockRestore();
                        spyGetTransactionBuilder.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not add a transfer operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilder, fraAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyGetTransactionBuilder, spyAddTransferOperation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                throw new Error('boom');
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fraAssetCode = 'AA';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
                        return [4 /*yield*/, expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow('Could not add transfer operation')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockRestore();
                        spyGetAssetDetails.mockRestore();
                        spyGetMinimalFee.mockRestore();
                        spyGetFraPublicKey.mockRestore();
                        spyBuildTransferOperation.mockRestore();
                        spyGetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('sends custom asset to recievers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, receivedTransferOperationFee, fakeTransferOperationBuilder, fakeTransferOperationBuilderFee, fraAssetCode, customAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyBuildTransferOperationWithFee, spyGetTransactionBuilder, spyAddTransferOperation, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        receivedTransferOperationFee = 'txHashFee';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperationFee;
                            }),
                        };
                        fraAssetCode = 'AA';
                        customAssetCode = 'BB';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
                        return [4 /*yield*/, Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)];
                    case 1:
                        result = _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if can not create or sign transaction to add fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, receivedTransferOperationFee, fakeTransferOperationBuilder, fakeTransferOperationBuilderFee, fraAssetCode, customAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyBuildTransferOperationWithFee, spyGetTransactionBuilder, spyAddTransferOperation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        receivedTransferOperationFee = 'txHashFee';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                throw new Error('foofoo');
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperationFee;
                            }),
                        };
                        fraAssetCode = 'AA';
                        customAssetCode = 'BB';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
                        return [4 /*yield*/, expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow('Could not create transfer operation for fee')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockRestore();
                        spyGetAssetDetails.mockRestore();
                        spyGetMinimalFee.mockRestore();
                        spyGetFraPublicKey.mockRestore();
                        spyBuildTransferOperation.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not add a transfer operation for fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, receivedTransferOperationFee, fakeTransferOperationBuilder, fakeTransferOperationBuilderFee, fraAssetCode, customAssetCode, receiverPubKey, minimalFee, toPublickey, walletInfo, toWalletInfo, recieversInfo, myLedger, assetDetails, spyGetLedger, spyGetAssetDetails, spyGetMinimalFee, spyGetFraPublicKey, spyBuildTransferOperation, spyBuildTransferOperationWithFee, spyGetTransactionBuilder, spyAddTransferOperation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        receivedTransferOperation = 'txHash';
                        receivedTransferOperationFee = 'txHashFee';
                        fakeTransferOperationBuilder = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilder;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperationFee;
                            }),
                        };
                        fraAssetCode = 'AA';
                        customAssetCode = 'BB';
                        receiverPubKey = 'toPubKey';
                        minimalFee = BigInt(2);
                        toPublickey = 'mockedToPublickey';
                        walletInfo = { publickey: 'senderPub' };
                        toWalletInfo = { publickey: receiverPubKey };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];
                        myLedger = {
                            foo: 'node',
                            TransactionBuilder: fakeTransactionBuilder,
                            TransferOperationBuilder: fakeTransferOperationBuilder,
                            fra_get_asset_code: jest.fn(function () {
                                return fraAssetCode;
                            }),
                            public_key_from_base64: jest.fn(function () {
                                return receiverPubKey;
                            }),
                        };
                        assetDetails = {
                            assetRules: {
                                decimals: 5,
                            },
                        };
                        spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(function () {
                            return Promise.resolve(myLedger);
                        });
                        spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(assetDetails);
                        });
                        spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(function () {
                            return Promise.resolve(minimalFee);
                        });
                        spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(function () {
                            return Promise.resolve(toPublickey);
                        });
                        spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilder);
                        });
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyGetTransactionBuilder = jest.spyOn(Builder, 'getTransactionBuilder').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');
                        spyAddTransferOperation
                            .mockImplementationOnce(function () {
                            return fakeTransactionBuilder;
                        })
                            .mockImplementationOnce(function () {
                            throw Error('barfoo');
                        });
                        return [4 /*yield*/, expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow('Could not add transfer operation for fee')];
                    case 1:
                        _a.sent();
                        spyGetLedger.mockRestore();
                        spyGetAssetDetails.mockRestore();
                        spyGetMinimalFee.mockRestore();
                        spyGetFraPublicKey.mockRestore();
                        spyBuildTransferOperation.mockRestore();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyGetTransactionBuilder.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('submitTransaction', function () {
        it('submits a transaction and returns a handle', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myHandle, submitData, fakeTransactionBuilder, submitResult, spySubmitTransaction, handle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myHandle = 'myHandleFromSubmit';
                        submitData = {
                            foo: 'bar',
                        };
                        fakeTransactionBuilder = {
                            transaction: jest.fn(function () {
                                return submitData;
                            }),
                        };
                        submitResult = {
                            response: myHandle,
                        };
                        spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(function () {
                            return Promise.resolve(submitResult);
                        });
                        return [4 /*yield*/, Transaction.submitTransaction(fakeTransactionBuilder)];
                    case 1:
                        handle = _a.sent();
                        expect(spySubmitTransaction).toHaveBeenCalledWith(submitData);
                        expect(handle).toBe(myHandle);
                        spySubmitTransaction.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if network call to submit data has failed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitData, fakeTransactionBuilder, spySubmitTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submitData = {
                            foo: 'bar',
                        };
                        fakeTransactionBuilder = {
                            transaction: jest.fn(function () {
                                return submitData;
                            }),
                        };
                        spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(function () {
                            throw new Error('foo');
                        });
                        return [4 /*yield*/, expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Error Could not submit transaction')];
                    case 1:
                        _a.sent();
                        spySubmitTransaction.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if network call to submit data has return an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitData, fakeTransactionBuilder, submitResult, spySubmitTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submitData = {
                            foo: 'bar',
                        };
                        fakeTransactionBuilder = {
                            transaction: jest.fn(function () {
                                return submitData;
                            }),
                        };
                        submitResult = {
                            error: new Error('barfoo'),
                        };
                        spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(function () {
                            return Promise.resolve(submitResult);
                        });
                        return [4 /*yield*/, expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Could not submit transaction')];
                    case 1:
                        _a.sent();
                        spySubmitTransaction.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if network call to submit data has an empty handle as a response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitData, fakeTransactionBuilder, submitResult, spySubmitTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submitData = {
                            foo: 'bar',
                        };
                        fakeTransactionBuilder = {
                            transaction: jest.fn(function () {
                                return submitData;
                            }),
                        };
                        submitResult = {
                            response: undefined,
                        };
                        spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(function () {
                            return Promise.resolve(submitResult);
                        });
                        return [4 /*yield*/, expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow('Handle is missing. Could not submit transaction')];
                    case 1:
                        _a.sent();
                        spySubmitTransaction.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sendToPublicKey', function () {
        it('send a transaction to an address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, walletInfo, publicKey, address, amount, assetCode, assetBlindRules, spyGetAddressByPublicKey, spySendToAddress, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        walletInfo = { publickey: 'senderPub' };
                        publicKey = 'pub123';
                        address = 'fra123';
                        amount = '0.5';
                        assetCode = 'CCC';
                        assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                        spyGetAddressByPublicKey = jest
                            .spyOn(KeypairApi, 'getAddressByPublicKey')
                            .mockImplementation(function () {
                            return Promise.resolve(address);
                        });
                        spySendToAddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        return [4 /*yield*/, Transaction.sendToPublicKey(walletInfo, publicKey, amount, assetCode, assetBlindRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAddressByPublicKey).toHaveBeenCalledWith(publicKey);
                        expect(spySendToAddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
                        expect(result).toBe(fakeTransactionBuilder);
                        spySendToAddress.mockRestore();
                        spyGetAddressByPublicKey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sendToAddress', function () {
        it('send a transaction to an address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, walletInfo, address, amount, assetCode, assetBlindRules, toWalletInfoLight, recieversInfo, spyGetAddressPublicAndKey, spySendToMany, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            new: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        walletInfo = { publickey: 'senderPub' };
                        address = 'fra123';
                        amount = '0.5';
                        assetCode = 'CCC';
                        assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                        toWalletInfoLight = {
                            address: 'fra123',
                            publickey: 'pub456',
                        };
                        recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount: amount }];
                        spyGetAddressPublicAndKey = jest
                            .spyOn(KeypairApi, 'getAddressPublicAndKey')
                            .mockImplementation(function () {
                            return Promise.resolve(toWalletInfoLight);
                        });
                        spySendToMany = jest.spyOn(Transaction, 'sendToMany').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        return [4 /*yield*/, Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAddressPublicAndKey).toHaveBeenCalledWith(address);
                        expect(spySendToMany).toHaveBeenCalledWith(walletInfo, recieversInfo, assetCode, assetBlindRules);
                        expect(result).toBe(fakeTransactionBuilder);
                        spySendToMany.mockRestore();
                        spyGetAddressPublicAndKey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTxList', function () {
        it('returns a list of transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var address, type, page, transparent, totalTxQuantity, dataResult, txList, processedTxList, spyGetTxList, spyGetTxListFromResponse, spyProcesseTxInfoList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = 'fra123';
                        type = 'to';
                        page = 2;
                        transparent = 'transparent';
                        totalTxQuantity = 5;
                        dataResult = {
                            response: {
                                result: {
                                    total_count: totalTxQuantity,
                                },
                            },
                        };
                        txList = [
                            {
                                foo: 'bar',
                            },
                        ];
                        processedTxList = [
                            {
                                bar: 'foo',
                            },
                        ];
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(function () {
                            return Promise.resolve(dataResult);
                        });
                        spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(function () {
                            return txList;
                        });
                        spyProcesseTxInfoList = jest.spyOn(Processor, 'processeTxInfoList').mockImplementation(function () {
                            return Promise.resolve(processedTxList);
                        });
                        return [4 /*yield*/, Transaction.getTxList(address, type, page)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetTxList).toHaveBeenCalledWith(address, type, page, transparent);
                        expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);
                        expect(spyProcesseTxInfoList).toHaveBeenCalledWith(txList);
                        expect(result).toEqual({
                            total_count: totalTxQuantity,
                            txs: processedTxList,
                        });
                        spyGetTxList.mockRestore();
                        spyGetTxListFromResponse.mockRestore();
                        spyProcesseTxInfoList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not fetch a list of transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var address, type, page, transparent, dataResult, spyGetTxList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = 'fra123';
                        type = 'to';
                        page = 2;
                        transparent = 'transparent';
                        dataResult = {};
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(function () {
                            return Promise.resolve(dataResult);
                        });
                        return [4 /*yield*/, expect(Transaction.getTxList(address, type, page)).rejects.toThrow('Could not fetch a list of transactions. No response from the server')];
                    case 1:
                        _a.sent();
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if there is no list of transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var address, type, page, transparent, totalTxQuantity, dataResult, txList, spyGetTxList, spyGetTxListFromResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = 'fra123';
                        type = 'to';
                        page = 2;
                        transparent = 'transparent';
                        totalTxQuantity = 5;
                        dataResult = {
                            response: {
                                result: {
                                    total_count: totalTxQuantity,
                                },
                            },
                        };
                        txList = undefined;
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(function () {
                            return Promise.resolve(dataResult);
                        });
                        spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(function () {
                            return txList;
                        });
                        return [4 /*yield*/, expect(Transaction.getTxList(address, type, page)).rejects.toThrow('Could not get a list of transactions from the server response')];
                    case 1:
                        _a.sent();
                        expect(spyGetTxList).toHaveBeenCalledWith(address, type, page, transparent);
                        expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);
                        spyGetTxList.mockRestore();
                        spyGetTxListFromResponse.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=transaction.spec.js.map