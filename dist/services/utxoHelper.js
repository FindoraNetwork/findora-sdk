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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUtxoInputs = exports.getSendUtxo = exports.addUtxo = exports.getUtxoItem = exports.decryptUtxoItem = void 0;
var Network = __importStar(require("../api/network"));
var cache_1 = require("../config/cache");
var Sdk_1 = __importDefault(require("../Sdk"));
var factory_1 = __importDefault(require("./cacheStore/factory"));
var ledgerWrapper_1 = require("./ledger/ledgerWrapper");
var decryptUtxoItem = function (sid, walletInfo, utxoData, memoData) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetRecord, err, memoDataResult, myMemoData, memoError, ownerMemo, err, decryptAssetData, error_1, err, decryptedAsetType, err, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
                }
                catch (error) {
                    err = error;
                    throw new Error("Can not get client asset record. Details: \"" + err.message + "\"");
                }
                return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 2:
                memoDataResult = _a.sent();
                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"" + sid + "\", Error - " + memoError.message);
                }
                try {
                    ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : undefined;
                }
                catch (error) {
                    err = error;
                    throw new Error("Can not decode owner memo. Details: \"" + err.message + "\"");
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, ledger.open_client_asset_record(assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair)];
            case 4:
                decryptAssetData = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                err = error_1;
                throw new Error("Can not open client asset record to decode. Details: \"" + err.message + "\"");
            case 6:
                try {
                    decryptedAsetType = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);
                }
                catch (error) {
                    err = error;
                    throw new Error("Can not decrypt asset type. Details: \"" + err.message + "\"");
                }
                decryptAssetData.asset_type = decryptedAsetType;
                decryptAssetData.amount = BigInt(decryptAssetData.amount);
                item = {
                    address: walletInfo.address,
                    sid: sid,
                    body: decryptAssetData || {},
                    utxo: __assign({}, utxoData.utxo),
                    ownerMemo: ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(),
                    memoData: memoData,
                };
                return [2 /*return*/, item];
        }
    });
}); };
exports.decryptUtxoItem = decryptUtxoItem;
var getUtxoItem = function (sid, walletInfo, cachedItem) { return __awaiter(void 0, void 0, void 0, function () {
    var utxoDataResult, utxoData, utxoError, memoDataResult, memoData, memoError, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (cachedItem) {
                    return [2 /*return*/, cachedItem];
                }
                console.log("Fetching sid \"" + sid + "\"");
                return [4 /*yield*/, Network.getUtxo(sid)];
            case 1:
                utxoDataResult = _a.sent();
                utxoData = utxoDataResult.response, utxoError = utxoDataResult.error;
                if (utxoError || !utxoData) {
                    throw new Error("Could not fetch utxo data for sid \"" + sid + "\", Error - " + (utxoError === null || utxoError === void 0 ? void 0 : utxoError.message));
                }
                return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 2:
                memoDataResult = _a.sent();
                memoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"" + sid + "\", Error - " + memoError.message);
                }
                return [4 /*yield*/, (0, exports.decryptUtxoItem)(sid, walletInfo, utxoData, memoData)];
            case 3:
                item = _a.sent();
                return [2 /*return*/, item];
        }
    });
}); };
exports.getUtxoItem = getUtxoItem;
// creates a list of items with descrypted utxo information
var addUtxo = function (walletInfo, addSids) { return __awaiter(void 0, void 0, void 0, function () {
    var utxoDataList, cacheDataToSave, utxoDataCache, cacheEntryName, fullPathToCacheEntry, error_2, err, i, sid, item, error_3, err, error_4, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                utxoDataList = [];
                cacheDataToSave = {};
                cacheEntryName = cache_1.CACHE_ENTRIES.UTXO_DATA + "_" + walletInfo.address;
                fullPathToCacheEntry = Sdk_1.default.environment.cachePath + "/" + cacheEntryName + ".json";
                try {
                    if (window && (window === null || window === void 0 ? void 0 : window.document)) {
                        fullPathToCacheEntry = cacheEntryName;
                    }
                }
                catch (error) { }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, factory_1.default.read(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider)];
            case 2:
                utxoDataCache = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                err = error_2;
                throw new Error("Error reading the cache, \"" + err.message + "\"");
            case 4:
                i = 0;
                _a.label = 5;
            case 5:
                if (!(i < addSids.length)) return [3 /*break*/, 10];
                sid = addSids[i];
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, exports.getUtxoItem)(sid, walletInfo, utxoDataCache === null || utxoDataCache === void 0 ? void 0 : utxoDataCache["sid_" + sid])];
            case 7:
                item = _a.sent();
                utxoDataList.push(item);
                cacheDataToSave["sid_" + item.sid] = item;
                return [3 /*break*/, 9];
            case 8:
                error_3 = _a.sent();
                err = error_3;
                console.log("Could not process addUtxo for sid " + sid + ", Details: \"" + err.message + "\"");
                return [3 /*break*/, 9];
            case 9:
                i++;
                return [3 /*break*/, 5];
            case 10:
                _a.trys.push([10, 12, , 13]);
                return [4 /*yield*/, factory_1.default.write(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider)];
            case 11:
                _a.sent();
                return [3 /*break*/, 13];
            case 12:
                error_4 = _a.sent();
                err = error_4;
                console.log("Could not write cache for utxoData, \"" + err.message + "\"");
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
                    memoData: assetItem.memoData,
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
                    memoData: assetItem.memoData,
                });
            }
        }
    }
    return result;
};
exports.getSendUtxo = getSendUtxo;
// creates a list of inputs, which would be used by transaction builder in a fee service
var addUtxoInputs = function (utxoSids) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, inputAmount, inputParametersList, i, item, assetRecord, err, txoRef, err, inputParameters, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                inputAmount = BigInt(0);
                inputParametersList = [];
                for (i = 0; i < utxoSids.length; i += 1) {
                    item = utxoSids[i];
                    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));
                    assetRecord = void 0;
                    try {
                        assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
                    }
                    catch (error) {
                        err = error;
                        throw new Error("Can not get client asset record. Details: \"" + err.message + "\"");
                    }
                    txoRef = void 0;
                    try {
                        txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
                    }
                    catch (error) {
                        err = error;
                        throw new Error("Can not convert given sid id to a BigInt, \"" + item.sid + "\", Details - \"" + err.message + "\"");
                    }
                    inputParameters = {
                        txoRef: txoRef,
                        assetRecord: assetRecord,
                        ownerMemo: item === null || item === void 0 ? void 0 : item.ownerMemo,
                        amount: item.amount,
                        memoData: item.memoData,
                        sid: item.sid,
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