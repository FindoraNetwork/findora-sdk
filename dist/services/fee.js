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
exports.buildTransferOperation = exports.buildTransferOperationWithFee = exports.getTransferOperation = void 0;
var Network = __importStar(require("../api/network"));
var ledgerWrapper_1 = require("./ledger/ledgerWrapper");
var utxoHelper_1 = require("./utxoHelper");
/**
 * @todo - rename the whole file from Fee to smth like TransferHelper, which better represents its purpose
 */
var getTransferOperation = function (walletInfo, utxoInputs, recieversInfo, totalUtxoNumbers, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, blindIsAmount, blindIsType, transferOp, inputParametersList, inputAmount, numberToSubmit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                blindIsAmount = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isAmountBlind;
                blindIsType = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isTypeBlind;
                transferOp = ledger.TransferOperationBuilder.new();
                inputParametersList = utxoInputs.inputParametersList, inputAmount = utxoInputs.inputAmount;
                inputParametersList.forEach(function (inputParameters) {
                    var txoRef = inputParameters.txoRef, assetRecord = inputParameters.assetRecord, amount = inputParameters.amount, memoData = inputParameters.memoData;
                    var ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;
                    var newOwnerMemo = ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone();
                    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, newOwnerMemo, walletInfo.keypair, amount);
                });
                recieversInfo.forEach(function (reciverInfo) {
                    var utxoNumbers = reciverInfo.utxoNumbers, toPublickey = reciverInfo.toPublickey;
                    transferOp = transferOp.add_output_no_tracing(utxoNumbers, toPublickey, assetCode, !!blindIsAmount, !!blindIsType);
                });
                if (inputAmount > totalUtxoNumbers) {
                    numberToSubmit = BigInt(Number(inputAmount) - Number(totalUtxoNumbers));
                    transferOp = transferOp.add_output_no_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), assetCode, !!blindIsAmount, !!blindIsType);
                }
                return [2 /*return*/, transferOp];
        }
    });
}); };
exports.getTransferOperation = getTransferOperation;
var buildTransferOperationWithFee = function (walletInfo, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, sidsResult, sids, utxoDataList, minimalFee, fraAssetCode, sendUtxoList, utxoInputsInfo, toPublickey, recieversInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
            case 2:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('no sids were fetched!');
                }
                return [4 /*yield*/, utxoHelper_1.addUtxo(walletInfo, sids)];
            case 3:
                utxoDataList = _a.sent();
                minimalFee = ledger.fra_get_minimal_fee();
                fraAssetCode = ledger.fra_get_asset_code();
                sendUtxoList = utxoHelper_1.getSendUtxo(fraAssetCode, minimalFee, utxoDataList);
                return [4 /*yield*/, utxoHelper_1.addUtxoInputs(sendUtxoList)];
            case 4:
                utxoInputsInfo = _a.sent();
                toPublickey = ledger.fra_get_dest_pubkey();
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                return [4 /*yield*/, exports.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, minimalFee, fraAssetCode, assetBlindRules)];
            case 5:
                trasferOperation = _a.sent();
                return [2 /*return*/, trasferOperation];
        }
    });
}); };
exports.buildTransferOperationWithFee = buildTransferOperationWithFee;
var buildTransferOperation = function (walletInfo, recieversInfo, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var sidsResult, sids, totalUtxoNumbers, utxoDataList, sendUtxoList, utxoInputsInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
            case 1:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('no sids were fetched!');
                }
                totalUtxoNumbers = recieversInfo.reduce(function (acc, receiver) {
                    return BigInt(Number(receiver.utxoNumbers) + Number(acc));
                }, BigInt(0));
                return [4 /*yield*/, utxoHelper_1.addUtxo(walletInfo, sids)];
            case 2:
                utxoDataList = _a.sent();
                sendUtxoList = utxoHelper_1.getSendUtxo(assetCode, totalUtxoNumbers, utxoDataList);
                return [4 /*yield*/, utxoHelper_1.addUtxoInputs(sendUtxoList)];
            case 3:
                utxoInputsInfo = _a.sent();
                return [4 /*yield*/, exports.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, totalUtxoNumbers, assetCode, assetBlindRules)];
            case 4:
                trasferOperation = _a.sent();
                return [2 /*return*/, trasferOperation];
        }
    });
}); };
exports.buildTransferOperation = buildTransferOperation;
//# sourceMappingURL=fee.js.map