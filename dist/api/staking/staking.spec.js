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
const SdkAsset = __importStar(require("../sdkAsset/sdkAsset"));
const Builder = __importStar(require("../transaction/builder"));
const Transaction = __importStar(require("../transaction/transaction"));
const Staking = __importStar(require("./staking"));
describe('staking (unit test)', () => {
    describe('undelegate', () => {
        it('undelegates all funds from the validator', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate_partially: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationUndelegate = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddOperationUndelegatePartially = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = true;
            const result = yield Staking.unStake(walletInfo, amount, validator, isFullUnstake);
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
        }));
        it('partially undelegates funds from the validator', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate_partially: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationUndelegate = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddOperationUndelegatePartially = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = false;
            const result = yield Staking.unStake(walletInfo, amount, validator, isFullUnstake);
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = false;
            yield expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not create transfer operation with fee');
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                throw new Error('boom');
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = false;
            yield expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not get "stakingTransactionBuilder"');
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
        }));
        it('throws an error when could not add staking unStake operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate_partially: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationUndelegatePartially = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                .mockImplementation(() => {
                throw new Error('bomboom');
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = false;
            yield expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not add staking unStake operation');
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
            spyAddOperationUndelegatePartially.mockRestore();
        }));
        it('throws an error when could not add transfer to unStake operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                new: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_undelegate_partially: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationUndelegatePartially = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                throw new Error('bomboom');
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const isFullUnstake = false;
            yield expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow('Could not add transfer to unStake operation');
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
            spyAddOperationUndelegatePartially.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
    });
    describe('delegate', () => {
        it('delegates funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                add_operation_delegate: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationDelegate = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_delegate')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const decimals = 6;
            const fakeLedgerAssetDetails = {
                assetRules: {
                    decimals,
                },
            };
            const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
                return Promise.resolve(fakeLedgerAssetDetails);
            });
            const address = 'myAddress';
            const assetCode = 'myAssetCode';
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const validator = 'myValidaotrAddress';
            const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
            const result = yield Staking.delegate(walletInfo, address, amount, assetCode, validator, assetBlindRules);
            expect(spyGetAssetDetails).toHaveBeenCalledWith(assetCode);
            expect(spyTransactionSendToaddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
            expect(spyAddOperationDelegate).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount) * BigInt(Math.pow(10, 6)), validator);
            expect(result).toBe(fakeTransactionBuilder);
            spyGetAssetDetails.mockRestore();
            spyTransactionSendToaddress.mockRestore();
            spyAddOperationDelegate.mockRestore();
        }));
    });
    describe('claim', () => {
        it('claims the rewards from the validator', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_claim_custom: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationClaimCustom = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const spyAddTransferOperation = jest
                .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const result = yield Staking.claim(walletInfo, amount);
            expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
            expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
            expect(spyAddOperationClaimCustom).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount));
            expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);
            expect(result).toBe(fakeTransactionBuilder);
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
            spyAddOperationClaimCustom.mockRestore();
            spyAddTransferOperation.mockRestore();
        }));
        it('throws an error if it can not get a transfer operation builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const receivedTransferOperation = 'txHash';
            const fakeTransferOperationBuilderFee = {
                create: jest.fn(() => {
                    return fakeTransferOperationBuilderFee;
                }),
                sign: jest.fn(() => {
                    throw new Error('boom');
                }),
                transaction: jest.fn(() => {
                    return receivedTransferOperation;
                }),
            };
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            yield expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not create transfer operation');
            spyBuildTransferOperationWithFee.mockRestore();
        }));
        it('throws an error if it can not get a transaction operation builder', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_claim_custom: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                throw new Error('boom');
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            yield expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not get "stakingTransactionBuilder"');
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
        }));
        it('throws an error if it can not add staking claim operation', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                add_transfer_operation: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                add_operation_claim_custom: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
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
            const spyBuildTransferOperationWithFee = jest
                .spyOn(Fee, 'buildTransferOperationWithFee')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransferOperationBuilderFee);
            });
            const spyTransactionGetTransactionBuilder = jest
                .spyOn(Builder, 'getTransactionBuilder')
                .mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationClaimCustom = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
                .mockImplementation(() => {
                throw new Error('bam');
            });
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            yield expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not add staking claim operation');
            spyBuildTransferOperationWithFee.mockRestore();
            spyTransactionGetTransactionBuilder.mockRestore();
            spyAddOperationClaimCustom.mockRestore();
        }));
    });
});
//# sourceMappingURL=staking.spec.js.map