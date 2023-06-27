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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDelegateInfo = exports.getValidatorList = exports.claim = exports.delegate = exports.unStake = void 0;
const orderBy_1 = __importDefault(require("lodash/orderBy"));
const Transaction = __importStar(require("../../api/transaction"));
const bigNumber_1 = require("../../services/bigNumber");
const Fee = __importStar(require("../../services/fee"));
const keypair_1 = require("../keypair");
const Network = __importStar(require("../network"));
const AssetApi = __importStar(require("../sdkAsset"));
const Builder = __importStar(require("../transaction/builder"));
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
const unStake = (walletInfo, amount, validator, isFullUnstake = false) => __awaiter(void 0, void 0, void 0, function* () {
    const transferFeeOperationBuilder = yield Fee.buildTransferOperationWithFee(walletInfo);
    let receivedTransferFeeOperation;
    try {
        receivedTransferFeeOperation = transferFeeOperationBuilder
            .create()
            .sign(walletInfo.keypair)
            .transaction();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not create transfer operation with fee, Error: "${e.message}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        if (isFullUnstake) {
            transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
        }
        else {
            transactionBuilder = transactionBuilder.add_operation_undelegate_partially(walletInfo.keypair, BigInt(amount), validator);
        }
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not add staking unStake operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferFeeOperation);
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not add transfer to unStake operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
        // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return transactionBuilder;
});
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
const delegate = (walletInfo, address, amount, assetCode, validator, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    let transactionBuilder = yield Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules);
    const asset = yield AssetApi.getAssetDetails(assetCode);
    const decimals = asset.assetRules.decimals;
    const delegateAmount = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
    transactionBuilder = transactionBuilder.add_operation_delegate(walletInfo.keypair, delegateAmount, validator);
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
        // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return transactionBuilder;
});
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
const claim = (walletInfo, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const transferFeeOperationBuilder = yield Fee.buildTransferOperationWithFee(walletInfo);
    let receivedTransferFeeOperation;
    try {
        receivedTransferFeeOperation = transferFeeOperationBuilder
            .create()
            .sign(walletInfo.keypair)
            .transaction();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder
            .add_operation_claim_custom(walletInfo.keypair, BigInt(amount))
            .add_transfer_operation(receivedTransferFeeOperation);
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not add staking claim operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
        // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return transactionBuilder;
});
exports.claim = claim;
/**
 * @todo Add unit test
 * @param commissionRate
 * @returns
 */
const calculateComissionRate = (validatorAddress, commissionRate) => {
    if (!Array.isArray(commissionRate)) {
        return '0';
    }
    if (commissionRate.length !== 2) {
        return '0';
    }
    const [rate, divideBy] = commissionRate;
    try {
        const commissionRateView = (0, bigNumber_1.create)(rate).div(divideBy).times(100).toString();
        return commissionRateView;
    }
    catch (error) {
        console.log(`Could not calculate comission rate for validator "${validatorAddress}". Error: "${error.message}"`);
        return '0';
    }
};
/**
 * @returns
 * @todo add unit test
 */
const getValidatorList = () => __awaiter(void 0, void 0, void 0, function* () {
    const { response: validatorListResponse, error } = yield Network.getValidatorList();
    if (error) {
        throw new Error(error.message);
    }
    if (!validatorListResponse) {
        throw new Error('Could not receive response from get validators call');
    }
    const { validators } = validatorListResponse;
    try {
        if (!validators.length) {
            throw new Error('Validators list is empty!');
        }
        const validatorsFormatted = validators.map((item, _index) => {
            const commission_rate_view = calculateComissionRate(item.addr, item.commission_rate);
            return Object.assign(Object.assign({}, item), { commission_rate_view });
        });
        const validatorsOrdered = (0, orderBy_1.default)(validatorsFormatted, _order => {
            return Number(_order.commission_rate_view);
        }, ['desc']);
        return { validators: validatorsOrdered };
    }
    catch (err) {
        throw new Error(`Could not get validators list', "${err.message}"`);
    }
});
exports.getValidatorList = getValidatorList;
/**
 * @returns
 * @todo add unit test
 */
const getDelegateInfo = (address) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const lightWalletKeypair = yield (0, keypair_1.getAddressPublicAndKey)(address);
        const delegateInfoDataResult = yield Network.getDelegateInfo(lightWalletKeypair.publickey);
        const { response: delegateInfoResponse } = delegateInfoDataResult;
        if (!delegateInfoResponse) {
            throw new Error('Delegator info response is missing!');
        }
        const validatorListInfo = yield (0, exports.getValidatorList)();
        if (!((_a = delegateInfoResponse.bond_entries) === null || _a === void 0 ? void 0 : _a.length)) {
            return delegateInfoResponse;
        }
        const bond_entries = delegateInfoResponse.bond_entries.map(item => {
            var _a, _b;
            const extra = (_b = (_a = validatorListInfo.validators.find(_validator => _validator.addr === item[0])) === null || _a === void 0 ? void 0 : _a.extra) !== null && _b !== void 0 ? _b : null;
            return { addr: item[0], amount: item[1], extra };
        });
        return Object.assign(Object.assign({}, delegateInfoResponse), { bond_entries });
    }
    catch (err) {
        throw new Error(`Could not get delegation info', "${err.message}"`);
    }
});
exports.getDelegateInfo = getDelegateInfo;
//# sourceMappingURL=staking.js.map