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
var Staking = __importStar(require("./staking"));
var Transaction = __importStar(require("../transaction/transaction"));
var Fee = __importStar(require("../../services/fee"));
var SdkAsset = __importStar(require("../sdkAsset/sdkAsset"));
describe('staking (unit test)', function () {
    describe('undelegate', function () {
        it('undelegates all funds from the validator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationUndelegate, spyAddOperationUndelegatePartially, spyAddTransferOperation, walletInfo, amount, validator, isFullUnstake, result;
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
                            add_operation_undelegate: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_undelegate_partially: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationUndelegate = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddOperationUndelegatePartially = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = true;
                        return [4 /*yield*/, Staking.unStake(walletInfo, amount, validator, isFullUnstake)];
                    case 1:
                        result = _a.sent();
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
                        expect(spyAddOperationUndelegate).toHaveBeenCalledWith(walletInfo.keypair);
                        expect(spyAddOperationUndelegatePartially).not.toHaveBeenCalled();
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationUndelegate.mockRestore();
                        spyAddOperationUndelegatePartially.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('partially undelegates funds from the validator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationUndelegate, spyAddOperationUndelegatePartially, spyAddTransferOperation, walletInfo, amount, validator, isFullUnstake, result;
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
                            add_operation_undelegate: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_undelegate_partially: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationUndelegate = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddOperationUndelegatePartially = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = false;
                        return [4 /*yield*/, Staking.unStake(walletInfo, amount, validator, isFullUnstake)];
                    case 1:
                        result = _a.sent();
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
                        expect(spyAddOperationUndelegate).not.toHaveBeenCalledWith();
                        expect(spyAddOperationUndelegatePartially).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount), validator);
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationUndelegate.mockRestore();
                        spyAddOperationUndelegatePartially.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transfer operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, walletInfo, amount, validator, isFullUnstake;
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = false;
                        return [4 /*yield*/, expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not create transfer operation with fee')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not create a transaction builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, walletInfo, amount, validator, isFullUnstake;
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            throw new Error('boom');
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = false;
                        return [4 /*yield*/, expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not get "stakingTransactionBuilder"')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not add staking unStake operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationUndelegatePartially, walletInfo, amount, validator, isFullUnstake;
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
                            add_operation_undelegate: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_undelegate_partially: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationUndelegatePartially = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                            .mockImplementation(function () {
                            throw new Error('bomboom');
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = false;
                        return [4 /*yield*/, expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not add staking unStake operation')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationUndelegatePartially.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error when could not add transfer to unStake operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationUndelegatePartially, spyAddTransferOperation, walletInfo, amount, validator, isFullUnstake;
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
                            add_operation_undelegate: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_undelegate_partially: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationUndelegatePartially = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            throw new Error('bomboom');
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        isFullUnstake = false;
                        return [4 /*yield*/, expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not add transfer to unStake operation')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationUndelegatePartially.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delegate', function () {
        it('delegates funds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, spyTransactionSendToaddress, spyAddOperationDelegate, decimals, fakeLedgerAssetDetails, spyGetAssetDetails, address, assetCode, walletInfo, amount, validator, assetBlindRules, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            add_operation_delegate: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
                        spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationDelegate = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_delegate')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        decimals = 6;
                        fakeLedgerAssetDetails = {
                            assetRules: {
                                decimals: decimals,
                            },
                        };
                        spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(function () {
                            return Promise.resolve(fakeLedgerAssetDetails);
                        });
                        address = 'myAddress';
                        assetCode = 'myAssetCode';
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        validator = 'myValidaotrAddress';
                        assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                        return [4 /*yield*/, Staking.delegate(walletInfo, address, amount, assetCode, validator, assetBlindRules)];
                    case 1:
                        result = _a.sent();
                        expect(spyGetAssetDetails).toHaveBeenCalledWith(assetCode);
                        expect(spyTransactionSendToaddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
                        expect(spyAddOperationDelegate).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount) * BigInt(Math.pow(10, 6)), validator);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyGetAssetDetails.mockRestore();
                        spyTransactionSendToaddress.mockRestore();
                        spyAddOperationDelegate.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('claim', function () {
        it('claims the rewards from the validator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationClaimCustom, spyAddTransferOperation, walletInfo, amount, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_claim_custom: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationClaimCustom = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        spyAddTransferOperation = jest
                            .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                            .mockImplementation(function () {
                            return fakeTransactionBuilder;
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        return [4 /*yield*/, Staking.claim(walletInfo, amount)];
                    case 1:
                        result = _a.sent();
                        expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
                        expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
                        expect(spyAddOperationClaimCustom).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount));
                        expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
                        expect(result).toBe(fakeTransactionBuilder);
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationClaimCustom.mockRestore();
                        spyAddTransferOperation.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get a transfer operation builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, walletInfo, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        receivedTransferOperation = 'txHash';
                        fakeTransferOperationBuilderFee = {
                            create: jest.fn(function () {
                                return fakeTransferOperationBuilderFee;
                            }),
                            sign: jest.fn(function () {
                                throw new Error('boom');
                            }),
                            transaction: jest.fn(function () {
                                return receivedTransferOperation;
                            }),
                        };
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        return [4 /*yield*/, expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not create transfer operation')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get a transaction operation builder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, walletInfo, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_claim_custom: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            throw new Error('boom');
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        return [4 /*yield*/, expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not get "stakingTransactionBuilder"')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not add staking claim operation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeTransactionBuilder, receivedTransferOperation, fakeTransferOperationBuilderFee, spyBuildTransferOperationWithFee, spyTransactionGetTransactionBuilder, spyAddOperationClaimCustom, walletInfo, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeTransactionBuilder = {
                            add_transfer_operation: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                            add_operation_claim_custom: jest.fn(function () {
                                return fakeTransactionBuilder;
                            }),
                        };
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
                        spyBuildTransferOperationWithFee = jest
                            .spyOn(Fee, 'buildTransferOperationWithFee')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransferOperationBuilderFee);
                        });
                        spyTransactionGetTransactionBuilder = jest
                            .spyOn(Transaction, 'getTransactionBuilder')
                            .mockImplementation(function () {
                            return Promise.resolve(fakeTransactionBuilder);
                        });
                        spyAddOperationClaimCustom = jest
                            .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
                            .mockImplementation(function () {
                            throw new Error('bam');
                        });
                        walletInfo = { publickey: 'senderPub' };
                        amount = '2';
                        return [4 /*yield*/, expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not add staking claim operation')];
                    case 1:
                        _a.sent();
                        spyBuildTransferOperationWithFee.mockRestore();
                        spyTransactionGetTransactionBuilder.mockRestore();
                        spyAddOperationClaimCustom.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=staking.spec.js.map