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
exports.getDelegateInfo = exports.getValidatorList = exports.claim = exports.delegate = exports.unStake = void 0;
var orderBy_1 = __importDefault(require("lodash/orderBy"));
var Transaction = __importStar(require("../../api/transaction"));
var Builder = __importStar(require("../transaction/builder"));
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var keypair_1 = require("../keypair");
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
/**
 * Unstake FRA tokens
 *
 * @remarks
 * This function allows users to unstake (aka unbond) FRA tokens.
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  // Define whether or not user desires to unstake all the tokens, or only part of the staked amount
 *  const isFullUnstake = false;
 *
 *  const transactionBuilder = await StakingApi.unStake(
 *    walletInfo,
 *    amount,
 *    validator,
 *    isFullUnstake,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
var unStake = function (walletInfo, amount, validator, isFullUnstake) {
    if (isFullUnstake === void 0) { isFullUnstake = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var transferFeeOperationBuilder, receivedTransferFeeOperation, e, transactionBuilder, error_1, e, e, e;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo)];
                case 1:
                    transferFeeOperationBuilder = _a.sent();
                    try {
                        receivedTransferFeeOperation = transferFeeOperationBuilder
                            .create()
                            .sign(walletInfo.keypair)
                            .transaction();
                    }
                    catch (error) {
                        e = error;
                        throw new Error("Could not create transfer operation with fee, Error: \"".concat(e.message, "\""));
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Builder.getTransactionBuilder()];
                case 3:
                    transactionBuilder = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    e = error_1;
                    throw new Error("Could not get \"stakingTransactionBuilder\", Error: \"".concat(e.message, "\""));
                case 5:
                    try {
                        if (isFullUnstake) {
                            transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
                        }
                        else {
                            transactionBuilder = transactionBuilder.add_operation_undelegate_partially(walletInfo.keypair, BigInt(amount), validator);
                        }
                    }
                    catch (error) {
                        e = error;
                        throw new Error("Could not add staking unStake operation, Error: \"".concat(e.message, "\""));
                    }
                    try {
                        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferFeeOperation);
                    }
                    catch (error) {
                        e = error;
                        throw new Error("Could not add transfer to unStake operation, Error: \"".concat(e.message, "\""));
                    }
                    try {
                        transactionBuilder = transactionBuilder.build();
                        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                    }
                    catch (err) {
                        console.log('sendToMany error in build and sign ', err);
                        throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                    }
                    return [2 /*return*/, transactionBuilder];
            }
        });
    });
};
exports.unStake = unStake;
/**
 * Delegates FRA tokens
 *
 * @remarks
 * This function allows users to delegate FRA tokens to a validator.
 *
 * This functionality is nearly identical to Transaction.sendToAddress except
 * it adds one additional operation (i.e. add_operation_delegate) to the transaction builder.
 *
 * @example
 *
 * ```ts
 *  const ledger = await getLedger();
 *
 *  // This is the address funds are sent to.
 *  // Actual `transfer to validator` process would be handled via added `add_operation_delegate` operation
 *
 *   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
 *   const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);
 *
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  const assetCode = await Asset.getFraAssetCode();
 *
 *  const assetBlindRules: Asset.AssetBlindRules = {
 *    isTypeBlind: false,
 *    isAmountBlind: false
 *  };
 *
 *  const transactionBuilder = await StakingApi.delegate(
 *    walletInfo,
 *    delegationTargetAddress,
 *    amount,
 *    assetCode,
 *    validatorAddress,
 *    assetBlindRules,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
var delegate = function (walletInfo, address, amount, assetCode, validator, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionBuilder, asset, decimals, delegateAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules)];
            case 1:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                delegateAmount = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                transactionBuilder = transactionBuilder.add_operation_delegate(walletInfo.keypair, delegateAmount, validator);
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.delegate = delegate;
/**
 * Claim FRA Token Rewards
 *
 * @remarks
 * This function enables users to claim rewards earned from staking FRA tokens.
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

 *  const transactionBuilder = await StakingApi.claim(
 *    walletInfo,
 *    amount,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
var claim = function (walletInfo, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var transferFeeOperationBuilder, receivedTransferFeeOperation, e, transactionBuilder, error_2, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo)];
            case 1:
                transferFeeOperationBuilder = _a.sent();
                try {
                    receivedTransferFeeOperation = transferFeeOperationBuilder
                        .create()
                        .sign(walletInfo.keypair)
                        .transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation, Error: \"".concat(e.message, "\""));
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 3:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                e = error_2;
                throw new Error("Could not get \"stakingTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 5:
                try {
                    transactionBuilder = transactionBuilder
                        .add_operation_claim_custom(walletInfo.keypair, BigInt(amount))
                        .add_transfer_operation(receivedTransferFeeOperation);
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not add staking claim operation, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.claim = claim;
/**
 * @todo Add unit test
 * @param commissionRate
 * @returns
 */
var calculateComissionRate = function (validatorAddress, commissionRate) {
    if (!Array.isArray(commissionRate)) {
        return '0';
    }
    if (commissionRate.length !== 2) {
        return '0';
    }
    var rate = commissionRate[0], divideBy = commissionRate[1];
    try {
        var commissionRateView = (0, bigNumber_1.create)(rate).div(divideBy).times(100).toString();
        return commissionRateView;
    }
    catch (error) {
        console.log("Could not calculate comission rate for validator \"".concat(validatorAddress, "\". Error: \"").concat(error.message, "\""));
        return '0';
    }
};
/**
 * @returns
 * @todo add unit test
 */
var getValidatorList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, validatorListResponse, error, validators, validatorsFormatted, validatorsOrdered;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Network.getValidatorList()];
            case 1:
                _a = _b.sent(), validatorListResponse = _a.response, error = _a.error;
                if (error) {
                    throw new Error(error.message);
                }
                if (!validatorListResponse) {
                    throw new Error('Could not receive response from get validators call');
                }
                validators = validatorListResponse.validators;
                try {
                    if (!validators.length) {
                        throw new Error('Validators list is empty!');
                    }
                    validatorsFormatted = validators.map(function (item, _index) {
                        var commission_rate_view = calculateComissionRate(item.addr, item.commission_rate);
                        return __assign(__assign({}, item), { commission_rate_view: commission_rate_view });
                    });
                    validatorsOrdered = (0, orderBy_1.default)(validatorsFormatted, function (_order) {
                        return Number(_order.commission_rate_view);
                    }, ['desc']);
                    return [2 /*return*/, { validators: validatorsOrdered }];
                }
                catch (err) {
                    throw new Error("Could not get validators list', \"".concat(err.message, "\""));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getValidatorList = getValidatorList;
/**
 * @returns
 * @todo add unit test
 */
var getDelegateInfo = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var lightWalletKeypair, delegateInfoDataResult, delegateInfoResponse, validatorListInfo_1, bond_entries, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, keypair_1.getAddressPublicAndKey)(address)];
            case 1:
                lightWalletKeypair = _b.sent();
                return [4 /*yield*/, Network.getDelegateInfo(lightWalletKeypair.publickey)];
            case 2:
                delegateInfoDataResult = _b.sent();
                delegateInfoResponse = delegateInfoDataResult.response;
                if (!delegateInfoResponse) {
                    throw new Error('Delegator info response is missing!');
                }
                return [4 /*yield*/, (0, exports.getValidatorList)()];
            case 3:
                validatorListInfo_1 = _b.sent();
                if (!((_a = delegateInfoResponse.bond_entries) === null || _a === void 0 ? void 0 : _a.length)) {
                    return [2 /*return*/, delegateInfoResponse];
                }
                bond_entries = delegateInfoResponse.bond_entries.map(function (item) {
                    var _a, _b;
                    var extra = (_b = (_a = validatorListInfo_1.validators.find(function (_validator) { return _validator.addr === item[0]; })) === null || _a === void 0 ? void 0 : _a.extra) !== null && _b !== void 0 ? _b : null;
                    return { addr: item[0], amount: item[1], extra: extra };
                });
                return [2 /*return*/, __assign(__assign({}, delegateInfoResponse), { bond_entries: bond_entries })];
            case 4:
                err_1 = _b.sent();
                throw new Error("Could not get delegation info', \"".concat(err_1.message, "\""));
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getDelegateInfo = getDelegateInfo;
//# sourceMappingURL=staking.js.map