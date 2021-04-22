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
exports.buildTransferOperationWithFee = exports.getTransferOperationWithFee = exports.addUtxoInputs = exports.getSendUtxo = exports.addUtxo = void 0;
var services_1 = require("../../services");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
// export interface UtxoInputsOperation {
//   transferOpWithInputs: TransferOperationBuilder;
//   inputAmount: BigInt;
// }
// creates a list of items with descrypted utxo information
var addUtxo = function (walletInfo, addSids) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, utxoDataList, i, sid, utxoDataResult, utxoData, utxoError, memoDataResult, memoData, memoError, assetRecord, ownerMemo, decryptAssetData, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                utxoDataList = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < addSids.length)) return [3 /*break*/, 7];
                sid = addSids[i];
                console.log("Processing sid \"" + sid + "\" (" + (i + 1) + " out of " + addSids.length + ")");
                return [4 /*yield*/, services_1.network.getUtxo(sid)];
            case 3:
                utxoDataResult = _a.sent();
                utxoData = utxoDataResult.response, utxoError = utxoDataResult.error;
                if (utxoError || !utxoData) {
                    // console.log('err!!', utxoDataResult);
                    // console.log(
                    //   `address "${walletInfo.address}", skipping sid "${sid}" because of the error - `,
                    //   utxoError?.message,
                    // );
                    return [3 /*break*/, 6];
                }
                return [4 /*yield*/, services_1.network.getOwnerMemo(sid)];
            case 4:
                memoDataResult = _a.sent();
                memoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    return [3 /*break*/, 6];
                }
                assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
                ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;
                return [4 /*yield*/, ledger.open_client_asset_record(assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair)];
            case 5:
                decryptAssetData = _a.sent();
                decryptAssetData.asset_type = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);
                decryptAssetData.amount = BigInt(decryptAssetData.amount);
                item = {
                    address: walletInfo.address,
                    sid: sid,
                    body: decryptAssetData || {},
                    utxo: __assign({}, utxoData.utxo),
                    ownerMemo: ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(),
                };
                utxoDataList.push(item);
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7: 
            // console.log('!utxoDataList', utxoDataList);
            return [2 /*return*/, utxoDataList];
        }
    });
}); };
exports.addUtxo = addUtxo;
// creates a list of utxo like object, which are suitable for the required send operation
var getSendUtxo = function (code, amount, utxoDataList) {
    // const ledger = await getLedger();
    // const senderBase64PubKey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(walletInfo.keypair));
    // const senderTxoSidsFetchedResult = await network.getOwnedSids(senderBase64PubKey);
    // const { response: senderTxoSidsFetched, error } = senderTxoSidsFetchedResult;
    // if (error) {
    //   throw new Error(error.message);
    // }
    // if (!senderTxoSidsFetched) {
    //   throw new Error('could not get owned sids information');
    // }
    // console.log('==!!  senderTxoSidsFetched !!==', senderTxoSidsFetched);
    // const addSids = senderTxoSidsFetched.sort((a, b) => a - b);
    var balance = amount;
    var result = [];
    // const utxoDataList = await addUtxo({ walletInfo, addSids });
    for (var i = 0; i < utxoDataList.length; i++) {
        var assetItem = utxoDataList[i];
        if (assetItem.body.asset_type === code) {
            var _amount = BigInt(assetItem.body.amount);
            if (balance <= BigInt(0)) {
                break;
            }
            else if (BigInt(_amount) >= balance) {
                result.push({
                    amount: balance,
                    originAmount: _amount,
                    sid: assetItem.sid,
                    utxo: __assign({}, assetItem.utxo),
                    ownerMemo: assetItem.ownerMemo,
                });
                break;
            }
            else {
                balance = BigInt(Number(balance) - Number(_amount));
                result.push({
                    amount: _amount,
                    originAmount: _amount,
                    sid: assetItem.sid,
                    utxo: __assign({}, assetItem.utxo),
                    ownerMemo: assetItem.ownerMemo,
                });
            }
        }
    }
    // console.log('getSendUtxo res', result);
    return result;
};
exports.getSendUtxo = getSendUtxo;
var addUtxoInputs = function (utxoSids) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, inputAmount, inputParametersList, i, item, assetRecord, txoRef, inputParameters, res;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _b.sent();
                inputAmount = BigInt(0);
                inputParametersList = [];
                for (i = 0; i < utxoSids.length; i += 1) {
                    item = utxoSids[i];
                    // let utxoDataResult;
                    // try {
                    //   utxoDataResult = await network.getUtxo(item.sid);
                    // } catch (err) {
                    //   console.log(`skipping sid "${item.sid}" because of the error `);
                    //   continue;
                    // }
                    // const { response: utxoData, error } = utxoDataResult;
                    // if (error || !utxoData) {
                    //   continue;
                    // }
                    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));
                    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
                    txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
                    inputParameters = {
                        txoRef: txoRef,
                        assetRecord: assetRecord,
                        ownerMemo: (_a = item.ownerMemo) === null || _a === void 0 ? void 0 : _a.clone(),
                        // walletInfo.keypair,
                        amount: item.amount,
                    };
                    inputParametersList.push(inputParameters);
                }
                res = { inputParametersList: inputParametersList, inputAmount: inputAmount };
                return [2 /*return*/, res];
        }
    });
}); };
exports.addUtxoInputs = addUtxoInputs;
var getTransferOperationWithFee = function (walletInfo, utxoInputs) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, minimalFee, toPublickey, assetCode, isBlindAmount, isBlindType, transferOp, inputParametersList, inputAmount, numberToSubmit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                minimalFee = ledger.fra_get_minimal_fee();
                toPublickey = ledger.fra_get_dest_pubkey();
                assetCode = ledger.fra_get_asset_code();
                isBlindAmount = false;
                isBlindType = false;
                transferOp = ledger.TransferOperationBuilder.new();
                inputParametersList = utxoInputs.inputParametersList, inputAmount = utxoInputs.inputAmount;
                inputParametersList.forEach(function (inputParameters) {
                    var txoRef = inputParameters.txoRef, assetRecord = inputParameters.assetRecord, ownerMemo = inputParameters.ownerMemo, amount = inputParameters.amount;
                    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
                });
                // transferOp = transferOpWithInputs;
                transferOp = transferOp.add_output_no_tracing(minimalFee, toPublickey, assetCode, isBlindAmount, isBlindType);
                // const numberToSubmit = BigInt(inputAmount) - BigInt(minimalFee);
                // Decide whether to add a "change"
                if (inputAmount > minimalFee) {
                    numberToSubmit = BigInt(Number(inputAmount) - Number(minimalFee));
                    transferOp = transferOp.add_output_no_tracing(numberToSubmit, ledger.get_pk_from_keypair(walletInfo.keypair), assetCode, isBlindAmount, isBlindType);
                }
                return [2 /*return*/, transferOp];
        }
    });
}); };
exports.getTransferOperationWithFee = getTransferOperationWithFee;
var buildTransferOperationWithFee = function (walletInfo, fraCode) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, minimalFee, sidsResult, sids, utxoDataList, sendUtxoList, utxoInputsInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                minimalFee = ledger.fra_get_minimal_fee();
                console.log('!walletInfo', walletInfo);
                return [4 /*yield*/, services_1.network.getOwnedSids(walletInfo.publickey)];
            case 2:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                console.log('sids', sids);
                if (!sids) {
                    console.log('sidsResult', sidsResult);
                    throw new Error('no sids were fetched!');
                }
                return [4 /*yield*/, exports.addUtxo(walletInfo, sids)];
            case 3:
                utxoDataList = _a.sent();
                console.log('utxoDataList', utxoDataList);
                sendUtxoList = exports.getSendUtxo(fraCode, minimalFee, utxoDataList);
                console.log('sendUtxoList!', sendUtxoList);
                return [4 /*yield*/, exports.addUtxoInputs(sendUtxoList)];
            case 4:
                utxoInputsInfo = _a.sent();
                console.log('utxoInputsInfo!', utxoInputsInfo);
                return [4 /*yield*/, exports.getTransferOperationWithFee(walletInfo, utxoInputsInfo)];
            case 5:
                trasferOperation = _a.sent();
                console.log('trasferOperation!', trasferOperation);
                return [2 /*return*/, trasferOperation];
        }
    });
}); };
exports.buildTransferOperationWithFee = buildTransferOperationWithFee;
//# sourceMappingURL=fee.js.map