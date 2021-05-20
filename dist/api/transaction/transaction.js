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
exports.sendTxToAddress = void 0;
var bigNumber_1 = require("../../services/bigNumber");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var UtxoHelper = __importStar(require("../../services/utxoHelper"));
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
var decimals = 6;
var sendTxToAddress = function (walletInfo, toWalletInfo, numbers, isBlindAmount, isBlindType) {
    if (isBlindAmount === void 0) { isBlindAmount = false; }
    if (isBlindType === void 0) { isBlindType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, fraAssetCode, minimalFee, toPublickey, utxoNumbers, transferOp, sidsResult, sids, utxoDataList, sendUtxoList, utxoInputsInfo, inputParametersList, inputAmount, numberToSubmit, _a, stateCommitment, error, _, height, blockCount, transferOperation, submitData, result, err_1, handle, submitError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
                case 1:
                    ledger = _b.sent();
                    return [4 /*yield*/, AssetApi.getFraAssetCode()];
                case 2:
                    fraAssetCode = _b.sent();
                    minimalFee = ledger.fra_get_minimal_fee();
                    toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
                    utxoNumbers = BigInt(Number(bigNumber_1.toWei(numbers, decimals).toString()) + Number(minimalFee));
                    transferOp = ledger.TransferOperationBuilder.new();
                    transferOp = transferOp.add_output_no_tracing(minimalFee, ledger.fra_get_dest_pubkey(), fraAssetCode, isBlindAmount, isBlindType);
                    return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
                case 3:
                    sidsResult = _b.sent();
                    sids = sidsResult.response;
                    console.log('sids', sids);
                    if (!sids) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, sids)];
                case 4:
                    utxoDataList = _b.sent();
                    console.log('utxoDataList', utxoDataList);
                    sendUtxoList = UtxoHelper.getSendUtxo(fraAssetCode, utxoNumbers, utxoDataList);
                    console.log('sendUtxoList!', sendUtxoList);
                    return [4 /*yield*/, UtxoHelper.addUtxoInputs(sendUtxoList)];
                case 5:
                    utxoInputsInfo = _b.sent();
                    console.log('utxoInputsInfo!', utxoInputsInfo);
                    inputParametersList = utxoInputsInfo.inputParametersList, inputAmount = utxoInputsInfo.inputAmount;
                    inputParametersList.forEach(function (inputParameters) {
                        var txoRef = inputParameters.txoRef, assetRecord = inputParameters.assetRecord, ownerMemo = inputParameters.ownerMemo, amount = inputParameters.amount;
                        transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
                    });
                    // end s
                    transferOp = transferOp.add_output_no_tracing(BigInt(bigNumber_1.toWei(numbers, decimals).toString()), toPublickey, fraAssetCode, isBlindAmount, isBlindType);
                    console.log('a', 3);
                    console.log('inputAmount > utxoNumbers', inputAmount, utxoNumbers);
                    if (inputAmount > utxoNumbers) {
                        numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));
                        transferOp = transferOp.add_output_no_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), fraAssetCode, isBlindAmount, isBlindType);
                    }
                    transferOp = transferOp.create().sign(walletInfo.keypair);
                    return [4 /*yield*/, Network.getStateCommitment()];
                case 6:
                    _a = _b.sent(), stateCommitment = _a.response, error = _a.error;
                    if (error) {
                        throw new Error(error.message);
                    }
                    if (!stateCommitment) {
                        throw new Error('could not receive response from state commitement call');
                    }
                    _ = stateCommitment[0], height = stateCommitment[1];
                    blockCount = BigInt(height);
                    transferOperation = ledger.TransactionBuilder.new(BigInt(blockCount)).add_transfer_operation(transferOp.transaction());
                    submitData = transferOperation.transaction();
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, Network.submitTransaction(submitData)];
                case 8:
                    result = _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    throw new Error("Error Could not define asset: \"" + err_1.message + "\"");
                case 10:
                    handle = result.response, submitError = result.error;
                    if (submitError) {
                        throw new Error("Could not submit issue asset transaction: \"" + submitError.message + "\"");
                    }
                    if (!handle) {
                        throw new Error("Could not issue asset - submit handle is missing");
                    }
                    return [2 /*return*/, handle];
            }
        });
    });
};
exports.sendTxToAddress = sendTxToAddress;
//# sourceMappingURL=transaction.js.map