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
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
var decimals = 6;
var addUtxoIt = function (_a) {
    var walletInfo = _a.walletInfo, addSids = _a.addSids;
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, utxoDataList, i, sid, utxoData, utxoDataResult, utxoDataFetched, utxoError, err_1, memoDataResult, memoData, memoError, ownerMemo, assetRecord, decryptAssetData, _b, item;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
                case 1:
                    ledger = _c.sent();
                    utxoDataList = [];
                    console.log("addSids for \"" + walletInfo.privateStr + "\"", addSids);
                    i = 0;
                    _c.label = 2;
                case 2:
                    if (!(i < addSids.length)) return [3 /*break*/, 11];
                    sid = addSids[i];
                    utxoData = void 0;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, Network.getUtxo(sid)];
                case 4:
                    utxoDataResult = _c.sent();
                    utxoDataFetched = utxoDataResult.response, utxoError = utxoDataResult.error;
                    utxoData = utxoDataFetched;
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    console.log("address \"" + walletInfo.address + "\", skipping sid \"" + sid + "\" because of the error - ", err_1.message);
                    return [3 /*break*/, 10];
                case 6: return [4 /*yield*/, Network.getOwnerMemo(sid)];
                case 7:
                    memoDataResult = _c.sent();
                    memoData = memoDataResult.response, memoError = memoDataResult.error;
                    ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;
                    // const myOwnerMemo = ownerMemo ? ownerMemo.clone() : null;
                    if (!utxoData) {
                        throw new Error('aaaa!!');
                    }
                    assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
                    return [4 /*yield*/, ledger.open_client_asset_record(assetRecord, ownerMemo ? ownerMemo.clone() : ownerMemo, walletInfo.keypair)];
                case 8:
                    decryptAssetData = _c.sent();
                    _b = decryptAssetData;
                    return [4 /*yield*/, ledger.asset_type_from_jsvalue(decryptAssetData.asset_type)];
                case 9:
                    _b.asset_type = _c.sent();
                    decryptAssetData.amount = BigInt(decryptAssetData.amount);
                    item = {
                        address: walletInfo.address,
                        sid: sid,
                        body: decryptAssetData || {},
                    };
                    utxoDataList.push(item);
                    _c.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 2];
                case 11: return [2 /*return*/, utxoDataList];
            }
        });
    });
};
var getSendUtxoIt = function (_a) {
    var code = _a.code, amount = _a.amount, walletInfo = _a.walletInfo;
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, senderBase64PubKey, sidsResult, senderTxoSidsFetched, addSids, balance, result, utxoDataList, i, assetItem, _amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
                case 1:
                    ledger = _b.sent();
                    senderBase64PubKey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(walletInfo.keypair));
                    return [4 /*yield*/, Network.getOwnedSids(senderBase64PubKey)];
                case 2:
                    sidsResult = _b.sent();
                    senderTxoSidsFetched = sidsResult.response;
                    console.log('sids!', senderTxoSidsFetched);
                    if (!senderTxoSidsFetched) {
                        return [2 /*return*/];
                    }
                    addSids = senderTxoSidsFetched.sort(function (a, b) { return a - b; });
                    balance = amount;
                    result = [];
                    return [4 /*yield*/, addUtxoIt({ walletInfo: walletInfo, addSids: addSids })];
                case 3:
                    utxoDataList = _b.sent();
                    for (i = 0; i < utxoDataList.length; i++) {
                        assetItem = utxoDataList[i];
                        if (assetItem.body.asset_type === code) {
                            _amount = BigInt(assetItem.body.amount);
                            if (balance <= BigInt(0)) {
                                break;
                            }
                            else if (BigInt(_amount) >= balance) {
                                result.push({ amount: balance, originAmount: _amount, sid: assetItem.sid });
                                break;
                            }
                            else {
                                balance = BigInt(balance) - BigInt(_amount);
                                result.push({ amount: _amount, originAmount: _amount, sid: assetItem.sid });
                            }
                        }
                    }
                    return [2 /*return*/, result];
            }
        });
    });
};
var addUtxoInputsIt = function (givenTransferOp, utxoSids, walletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, inputAmount, transferOp, i, item, utxoData, utxoDataResult, utxoDataFetched, utxoError, err_2, assetRecord, memoDataResult, memoData, memoError, ownerMemo, myOwnerMemo, txoRef, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                inputAmount = BigInt(0);
                transferOp = givenTransferOp;
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < utxoSids.length)) return [3 /*break*/, 9];
                item = utxoSids[i];
                utxoData = void 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Network.getUtxo(item.sid)];
            case 4:
                utxoDataResult = _a.sent();
                utxoDataFetched = utxoDataResult.response, utxoError = utxoDataResult.error;
                utxoData = utxoDataFetched;
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log("skipping sid \"" + item.sid + "\" because of the error ");
                return [3 /*break*/, 8];
            case 6:
                inputAmount = BigInt(inputAmount) + BigInt(item.originAmount);
                if (!utxoData) {
                    throw new Error('aaaa!!');
                }
                assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
                return [4 /*yield*/, Network.getOwnerMemo(item.sid)];
            case 7:
                memoDataResult = _a.sent();
                memoData = memoDataResult.response, memoError = memoDataResult.error;
                ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;
                myOwnerMemo = ownerMemo ? ownerMemo.clone() : null;
                txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
                transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, myOwnerMemo, walletInfo.keypair, BigInt(item.amount));
                _a.label = 8;
            case 8:
                i += 1;
                return [3 /*break*/, 2];
            case 9:
                res = { transferOpWithInputs: transferOp, inputAmount: inputAmount };
                return [2 /*return*/, res];
        }
    });
}); };
var sendTxToAddress = function (walletInfo, toWalletInfo, numbers, isBlindAmount, isBlindType) {
    if (isBlindAmount === void 0) { isBlindAmount = false; }
    if (isBlindType === void 0) { isBlindType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, sidsResult, sids, fraAssetCode, minimalFee, toPublickey, utxoNumbers, transferOp, utxoSids, utxoInputs, transferOpWithInputs, inputAmount, _a, stateCommitment, error, _, height, blockCount, transferOperation, submitData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
                case 1:
                    ledger = _b.sent();
                    return [4 /*yield*/, Network.getOwnedSids(walletInfo.publickey)];
                case 2:
                    sidsResult = _b.sent();
                    sids = sidsResult.response;
                    console.log('sids', sids);
                    if (!sids) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AssetApi.getFraAssetCode()];
                case 3:
                    fraAssetCode = _b.sent();
                    minimalFee = ledger.fra_get_minimal_fee();
                    toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
                    utxoNumbers = BigInt(Number(bigNumber_1.toWei(numbers, decimals).toString()) + Number(minimalFee));
                    console.log('utxoNumbers', utxoNumbers);
                    console.log('minimalFee', minimalFee);
                    console.log('toWei(numbers, decimals).toString()!', Number(bigNumber_1.toWei(numbers, decimals).toString()));
                    transferOp = ledger.TransferOperationBuilder.new();
                    transferOp = transferOp.add_output_no_tracing(minimalFee, ledger.fra_get_dest_pubkey(), fraAssetCode, false, false);
                    return [4 /*yield*/, getSendUtxoIt({
                            walletInfo: walletInfo,
                            code: fraAssetCode,
                            amount: utxoNumbers,
                        })];
                case 4:
                    utxoSids = _b.sent();
                    return [4 /*yield*/, addUtxoInputsIt(transferOp, utxoSids, walletInfo)];
                case 5:
                    utxoInputs = _b.sent();
                    transferOpWithInputs = utxoInputs.transferOpWithInputs, inputAmount = utxoInputs.inputAmount;
                    transferOp = transferOpWithInputs;
                    transferOp = transferOp.add_output_no_tracing(BigInt(bigNumber_1.toWei(numbers, decimals).toString()), toPublickey, fraAssetCode, isBlindAmount, isBlindType);
                    console.log('a', 3);
                    console.log('inputAmount > utxoNumbers', inputAmount, utxoNumbers);
                    if (BigInt(inputAmount) > BigInt(utxoNumbers)) {
                        // const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));
                        console.log('inputAmount > utxoNumbers', inputAmount, utxoNumbers);
                        transferOp = transferOp.add_output_no_tracing(BigInt(inputAmount) - BigInt(utxoNumbers), ledger.get_pk_from_keypair(walletInfo.keypair), fraAssetCode, isBlindAmount, isBlindType);
                    }
                    console.log('a', 4);
                    transferOp = transferOp.create().sign(walletInfo.keypair);
                    console.log('a', 5);
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
                    console.log('submitData!', submitData);
                    return [2 /*return*/];
            }
        });
    });
};
exports.sendTxToAddress = sendTxToAddress;
//# sourceMappingURL=transaction.js.map