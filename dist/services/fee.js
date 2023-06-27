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
exports.buildTransferOperationV2 = exports.buildTransferOperation = exports.getFeeInputs = exports.buildTransferOperationWithFee = exports.getPayloadForFeeInputs = exports.getTransferOperation = exports.getAssetTracingPolicies = exports.getEmptyTransferBuilder = void 0;
const Network = __importStar(require("../api/network"));
const AssetApi = __importStar(require("../api/sdkAsset"));
const ledgerWrapper_1 = require("./ledger/ledgerWrapper");
const utxoHelper_1 = require("./utxoHelper");
const getEmptyTransferBuilder = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    return ledger.TransferOperationBuilder.new();
});
exports.getEmptyTransferBuilder = getEmptyTransferBuilder;
const getAssetTracingPolicies = (asset) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const tracingPolicies = ledger.AssetType.from_json({ properties: asset }).get_tracing_policies();
    return tracingPolicies;
});
exports.getAssetTracingPolicies = getAssetTracingPolicies;
const getTransferOperation = (walletInfo, utxoInputs, recieversInfo, assetCode, transferOp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // let transferOp = await getEmptyTransferBuilder();
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const asset = yield AssetApi.getAssetDetails(assetCode);
    const isTraceable = ((_a = asset.assetRules.tracing_policies) === null || _a === void 0 ? void 0 : _a.length) > 0;
    let tracingPolicies;
    if (isTraceable) {
        try {
            tracingPolicies = yield (0, exports.getAssetTracingPolicies)(asset);
            console.log('tracingPolicies:', tracingPolicies);
        }
        catch (e) {
            console.log(e);
        }
    }
    let isBlindIsAmount = recieversInfo.some(item => { var _a; return ((_a = item.assetBlindRules) === null || _a === void 0 ? void 0 : _a.isAmountBlind) === true; });
    let isBlindIsType = recieversInfo.some(item => { var _a; return ((_a = item.assetBlindRules) === null || _a === void 0 ? void 0 : _a.isTypeBlind) === true; });
    let utxoNumbers = BigInt(0);
    const { inputParametersList, inputAmount } = utxoInputs;
    const inputPromise = inputParametersList.map((inputParameters) => __awaiter(void 0, void 0, void 0, function* () {
        const { txoRef, assetRecord, amount, sid } = inputParameters;
        const memoDataResult = yield Network.getOwnerMemo(sid);
        const { response: myMemoData, error: memoError } = memoDataResult;
        if (memoError) {
            throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
        }
        utxoNumbers = utxoNumbers + BigInt(amount.toString());
        const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
        if (isTraceable) {
            transferOp = transferOp.add_input_with_tracing(txoRef, assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), tracingPolicies, walletInfo.keypair, BigInt(amount.toString()));
        }
        else {
            transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair, BigInt(amount.toString()));
        }
    }));
    yield Promise.all(inputPromise);
    recieversInfo.forEach(reciverInfo => {
        const { utxoNumbers, toPublickey, assetBlindRules = {} } = reciverInfo;
        const blindIsAmount = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isAmountBlind;
        const blindIsType = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isTypeBlind;
        if (isTraceable) {
            transferOp = transferOp.add_output_with_tracing(BigInt(utxoNumbers.toString()), toPublickey, tracingPolicies, assetCode, !!blindIsAmount, !!blindIsType);
        }
        else {
            transferOp = transferOp.add_output_no_tracing(BigInt(utxoNumbers.toString()), toPublickey, assetCode, !!blindIsAmount, !!blindIsType);
        }
    });
    if (inputAmount > utxoNumbers) {
        const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));
        if (isTraceable) {
            tracingPolicies = yield (0, exports.getAssetTracingPolicies)(asset);
            transferOp = transferOp.add_output_with_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), tracingPolicies, assetCode, isBlindIsAmount, isBlindIsType);
        }
        else {
            transferOp = transferOp.add_output_no_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), assetCode, isBlindIsAmount, isBlindIsType);
        }
    }
    return transferOp;
});
exports.getTransferOperation = getTransferOperation;
const getPayloadForFeeInputs = (walletInfo, utxoInputs) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const feeInputsPayload = [];
    const { inputParametersList } = utxoInputs;
    const inputPromise = inputParametersList.map((inputParameters) => __awaiter(void 0, void 0, void 0, function* () {
        const { txoRef, assetRecord, amount, sid } = inputParameters;
        const memoDataResult = yield Network.getOwnerMemo(sid);
        const { response: myMemoData, error: memoError } = memoDataResult;
        if (memoError) {
            throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
        }
        const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
        feeInputsPayload.push({
            txoRef,
            assetRecord,
            ownerMemo: ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(),
            keypair: walletInfo.keypair,
            amount,
        });
    }));
    yield Promise.all(inputPromise);
    return feeInputsPayload;
});
exports.getPayloadForFeeInputs = getPayloadForFeeInputs;
// creates an istance of a TransferOperationBuilder with a minimal FRA fee
const buildTransferOperationWithFee = (walletInfo, assetBlindRules) => __awaiter(void 0, void 0, void 0, function* () {
    const minimalFee = yield AssetApi.getMinimalFee();
    const fraAssetCode = yield AssetApi.getFraAssetCode();
    const toPublickey = yield AssetApi.getFraPublicKey();
    const recieversInfo = [
        {
            utxoNumbers: minimalFee,
            toPublickey,
            assetBlindRules,
        },
    ];
    const trasferOperation = yield (0, exports.buildTransferOperation)(walletInfo, recieversInfo, fraAssetCode);
    return trasferOperation;
});
exports.buildTransferOperationWithFee = buildTransferOperationWithFee;
// used in triple masking
const getFeeInputs = (walletInfo, excludeSids, _isBarToAbar) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const sidsResult = yield Network.getOwnedSids(walletInfo.publickey);
    const { response: sids } = sidsResult;
    if (!sids) {
        throw new Error('No sids were fetched');
    }
    const filteredSids = sids.filter(sid => !excludeSids.includes(sid));
    //const filteredSids = sids.filter(sid => sid !== excludeSid);
    const minimalFee = yield AssetApi.getMinimalFee();
    console.log('🚀 ~ file: fee.ts ~ line 263 ~ abar minimalFee', minimalFee);
    const fraAssetCode = yield AssetApi.getFraAssetCode();
    const utxoDataList = yield (0, utxoHelper_1.addUtxo)(walletInfo, filteredSids);
    const sendUtxoList = (0, utxoHelper_1.getSendUtxo)(fraAssetCode, minimalFee, utxoDataList);
    const utxoInputsInfo = yield (0, utxoHelper_1.addUtxoInputs)(sendUtxoList);
    const feeInputsPayload = yield (0, exports.getPayloadForFeeInputs)(walletInfo, utxoInputsInfo);
    let feeInputs = ledger.FeeInputs.new();
    feeInputsPayload.forEach(payloadItem => {
        const { amount, txoRef, assetRecord, ownerMemo, keypair } = payloadItem;
        feeInputs = feeInputs.append2(BigInt(amount.toString()), txoRef, assetRecord, ownerMemo, keypair);
    });
    return feeInputs;
});
exports.getFeeInputs = getFeeInputs;
// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
const buildTransferOperation = (walletInfo, recieversInfo, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const sidsResult = yield Network.getOwnedSids(walletInfo.publickey);
    const { response: sids } = sidsResult;
    if (!sids) {
        throw new Error('No sids were fetched');
    }
    const totalUtxoNumbers = recieversInfo.reduce((acc, receiver) => {
        return BigInt(Number(receiver.utxoNumbers) + Number(acc));
    }, BigInt(0));
    const utxoDataList = yield (0, utxoHelper_1.addUtxo)(walletInfo, sids);
    const sendUtxoList = (0, utxoHelper_1.getSendUtxo)(assetCode, totalUtxoNumbers, utxoDataList);
    const utxoInputsInfo = yield (0, utxoHelper_1.addUtxoInputs)(sendUtxoList);
    let transferOperationBuilder = yield (0, exports.getEmptyTransferBuilder)();
    transferOperationBuilder = yield (0, exports.getTransferOperation)(walletInfo, utxoInputsInfo, recieversInfo, assetCode, transferOperationBuilder);
    return transferOperationBuilder;
});
exports.buildTransferOperation = buildTransferOperation;
// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
const buildTransferOperationV2 = (walletInfo, recieversInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const sidsResult = yield Network.getOwnedSids(walletInfo.publickey);
    const { response: sids } = sidsResult;
    if (!sids) {
        throw new Error('No sids were fetched');
    }
    let transferOperationBuilder = yield (0, exports.getEmptyTransferBuilder)();
    for (const assetCodeType of Object.keys(recieversInfo)) {
        const assetCodeItem = recieversInfo[assetCodeType];
        const totalUtxoNumbers = assetCodeItem.reduce((acc, receiver) => {
            return BigInt(Number(receiver.utxoNumbers) + Number(acc));
        }, BigInt(0));
        const utxoDataList = yield (0, utxoHelper_1.addUtxo)(walletInfo, sids);
        const sendUtxoList = (0, utxoHelper_1.getSendUtxo)(assetCodeType, totalUtxoNumbers, utxoDataList);
        const utxoInputsInfo = yield (0, utxoHelper_1.addUtxoInputs)(sendUtxoList);
        transferOperationBuilder = yield (0, exports.getTransferOperation)(walletInfo, utxoInputsInfo, assetCodeItem, assetCodeType, transferOperationBuilder);
    }
    return transferOperationBuilder;
});
exports.buildTransferOperationV2 = buildTransferOperationV2;
//# sourceMappingURL=fee.js.map