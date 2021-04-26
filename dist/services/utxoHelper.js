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
exports.addUtxoInputs = exports.getSendUtxo = exports.addUtxo = void 0;
var Network = __importStar(require("../api/network"));
var cacheStore_1 = require("./cacheStore");
var ledgerWrapper_1 = require("./ledger/ledgerWrapper");
var decriptUtxoItem = function (sid, walletInfo, utxoData, memoData) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetRecord, ownerMemo, decryptAssetData, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
                ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;
                return [4 /*yield*/, ledger.open_client_asset_record(assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair)];
            case 2:
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
                return [2 /*return*/, item];
        }
    });
}); };
var getUtxoItem = function (sid, walletInfo, cachedItem) { return __awaiter(void 0, void 0, void 0, function () {
    var utxoDataResult, utxoData, utxoError, memoDataResult, memoData, memoError, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (cachedItem) {
                    console.log('we have cache for', "sid_" + sid);
                    return [2 /*return*/, cachedItem];
                }
                console.log("Fetching sid \"" + sid + "\"");
                return [4 /*yield*/, Network.getUtxo(sid)];
            case 1:
                utxoDataResult = _a.sent();
                utxoData = utxoDataResult.response, utxoError = utxoDataResult.error;
                if (utxoError || !utxoData) {
                    throw new Error("could not fetch utxo data for sid \"" + sid + "\", Error - " + (utxoError === null || utxoError === void 0 ? void 0 : utxoError.message));
                }
                return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 2:
                memoDataResult = _a.sent();
                memoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("could not fetch utxo data for sid \"" + sid + "\", Error - " + memoError.message);
                }
                return [4 /*yield*/, decriptUtxoItem(sid, walletInfo, utxoData, memoData)];
            case 3:
                item = _a.sent();
                return [2 /*return*/, item];
        }
    });
}); };
// creates a list of items with descrypted utxo information
var addUtxo = function (walletInfo, addSids) { return __awaiter(void 0, void 0, void 0, function () {
    var utxoDataList, cacheDataToSave, utxoDataCache, error_1, i, sid, item, error_2, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                utxoDataList = [];
                cacheDataToSave = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cacheStore_1.readCache('utxoDataCache')];
            case 2:
                utxoDataCache = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log('aa');
                return [3 /*break*/, 4];
            case 4:
                i = 0;
                _a.label = 5;
            case 5:
                if (!(i < addSids.length)) return [3 /*break*/, 10];
                sid = addSids[i];
                console.log("Processing sid \"" + sid + "\" (" + (i + 1) + " out of " + addSids.length + ")");
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, getUtxoItem(sid, walletInfo, utxoDataCache === null || utxoDataCache === void 0 ? void 0 : utxoDataCache["sid_" + sid])];
            case 7:
                item = _a.sent();
                utxoDataList.push(item);
                cacheDataToSave["sid_" + item.sid] = item;
                return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                console.log("could not process addUtxo for sid " + sid + ", Details: \"" + error_2.message + "\"");
                return [3 /*break*/, 9];
            case 9:
                i++;
                return [3 /*break*/, 5];
            case 10:
                _a.trys.push([10, 12, , 13]);
                return [4 /*yield*/, cacheStore_1.writeCache('utxoDataCache', cacheDataToSave)];
            case 11:
                _a.sent();
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.log("could not write cache for utxoData, \"" + err_1.message + "\"");
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/, utxoDataList];
        }
    });
}); };
exports.addUtxo = addUtxo;
// creates a list of utxo like object, which are suitable for the required send operation
var getSendUtxo = function (code, amount, utxoDataList) {
    var balance = amount;
    var result = [];
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
    return result;
};
exports.getSendUtxo = getSendUtxo;
// creates a list of inputs, which would be used by transaction builder in a fee service
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
                    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));
                    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
                    txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
                    inputParameters = {
                        txoRef: txoRef,
                        assetRecord: assetRecord,
                        ownerMemo: (_a = item.ownerMemo) === null || _a === void 0 ? void 0 : _a.clone(),
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
//# sourceMappingURL=utxoHelper.js.map