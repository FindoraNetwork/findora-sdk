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
exports.genNullifierHash = exports.getOwnedAbars = exports.getAbarBalance = exports.getBalance = exports.getBalanceMaps = exports.openAbar = exports.getUnspentAbars = exports.isNullifierHashSpent = exports.abarToBar = exports.barToAbar = exports.getAbarTransferFee = exports.prepareAnonTransferOperationBuilder = exports.abarToAbar = exports.saveOwnedAbarsToCache = exports.saveBarToAbarToCache = exports.genAnonKeys = void 0;
var cache_1 = require("../../config/cache");
var Sdk_1 = __importDefault(require("../../Sdk"));
var bigNumber_1 = require("../../services/bigNumber");
var factory_1 = __importDefault(require("../../services/cacheStore/factory"));
var fee_1 = require("../../services/fee");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var utxoHelper_1 = require("../../services/utxoHelper");
var Keypair = __importStar(require("../keypair"));
var Network = __importStar(require("../network"));
var sdkAsset_1 = require("../sdkAsset");
var transaction_1 = require("../transaction");
var genAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, anonKeys, axfrPublicKey, axfrSecretKey, decKey, encKey, formattedAnonKeys, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ledger.gen_anon_keys()];
            case 3:
                anonKeys = _a.sent();
                axfrPublicKey = anonKeys.axfr_public_key;
                axfrSecretKey = anonKeys.axfr_secret_key;
                decKey = anonKeys.dec_key;
                encKey = anonKeys.enc_key;
                formattedAnonKeys = {
                    axfrPublicKey: axfrPublicKey,
                    axfrSecretKey: axfrSecretKey,
                    decKey: decKey,
                    encKey: encKey,
                };
                try {
                    anonKeys.free();
                }
                catch (error) {
                    throw new Error("could not get release the anonymous keys instance  \"" + error.message + "\" ");
                }
                return [2 /*return*/, formattedAnonKeys];
            case 4:
                err_1 = _a.sent();
                throw new Error("could not get anon keys, \"" + err_1 + "\" ");
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.genAnonKeys = genAnonKeys;
var resolvePathToCacheEntry = function (cacheEntryName) {
    var fullPathToCacheEntry = Sdk_1.default.environment.cachePath + "/" + cacheEntryName + ".json";
    try {
        if (window && (window === null || window === void 0 ? void 0 : window.document)) {
            fullPathToCacheEntry = cacheEntryName;
        }
    }
    catch (error) {
        console.log('for browser mode a default fullPathToCacheEntry was used');
    }
    return fullPathToCacheEntry;
};
var saveBarToAbarToCache = function (walletInfo, sid, randomizers, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var cacheDataToSave, cacheEntryName, fullPathToCacheEntry, abarDataCache, error_1, barToAbarData, error_2, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cacheDataToSave = {};
                cacheEntryName = cache_1.CACHE_ENTRIES.BAR_TO_ABAR + "_" + walletInfo.address;
                fullPathToCacheEntry = resolvePathToCacheEntry(cacheEntryName);
                abarDataCache = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, factory_1.default.read(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider)];
            case 2:
                abarDataCache = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("Error reading the abarDataCache for " + walletInfo.address + ". Creating an empty object now");
                return [3 /*break*/, 4];
            case 4:
                barToAbarData = {
                    anonKeysFormatted: anonKeys,
                    randomizers: randomizers,
                };
                cacheDataToSave["sid_" + sid] = barToAbarData;
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, factory_1.default.write(fullPathToCacheEntry, __assign(__assign({}, abarDataCache), cacheDataToSave), Sdk_1.default.environment.cacheProvider)];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                err = error_2;
                console.log("Could not write cache for abarDataCache, \"" + err.message + "\"");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, barToAbarData];
        }
    });
}); };
exports.saveBarToAbarToCache = saveBarToAbarToCache;
var saveOwnedAbarsToCache = function (walletInfo, ownedAbars, savePath) { return __awaiter(void 0, void 0, void 0, function () {
    var cacheDataToSave, cacheEntryName, fullPathToCacheEntry, resolvedFullPathToCacheEntry, ownedAbarItem, abarData, atxoSid, abarDataCache, error_3, error_4, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cacheDataToSave = {};
                cacheEntryName = cache_1.CACHE_ENTRIES.OWNED_ABARS + "_" + walletInfo.address;
                fullPathToCacheEntry = resolvePathToCacheEntry(cacheEntryName);
                resolvedFullPathToCacheEntry = savePath || fullPathToCacheEntry;
                ownedAbarItem = ownedAbars[0];
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid;
                cacheDataToSave["atxoSid_" + atxoSid] = ownedAbars;
                abarDataCache = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, factory_1.default.read(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider)];
            case 2:
                abarDataCache = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log("Error reading the ownedAbarsCache for " + walletInfo.address + ". Creating an empty object now");
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, factory_1.default.write(resolvedFullPathToCacheEntry, __assign(__assign({}, abarDataCache), cacheDataToSave), Sdk_1.default.environment.cacheProvider)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                err = error_4;
                console.log("Could not write cache for ownedAbarsCache, \"" + err.message + "\"");
                return [2 /*return*/, false];
            case 7: return [2 /*return*/, true];
        }
    });
}); };
exports.saveOwnedAbarsToCache = saveOwnedAbarsToCache;
var getAbarFromJson = function (ownedAbar) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, myOwnedAbar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    myOwnedAbar = ledger.abar_from_json(ownedAbar);
                }
                catch (error) {
                    throw new Error("Could not decode myOwnedAbar data\", Error - " + error.message);
                }
                return [2 /*return*/, myOwnedAbar];
        }
    });
}); };
var getAbarOwnerMemo = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarOwnerMemoResult, myMemoData, memoError, abarOwnerMemo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarOwnerMemo(atxoSid)];
            case 2:
                abarOwnerMemoResult = _a.sent();
                myMemoData = abarOwnerMemoResult.response, memoError = abarOwnerMemoResult.error;
                if (memoError) {
                    throw new Error("Could not fetch abar memo data for sid \"" + atxoSid + "\", Error - " + memoError.message);
                }
                try {
                    abarOwnerMemo = ledger.OwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    throw new Error("Could not get decode abar memo data\", Error - " + error.message);
                }
                return [2 /*return*/, abarOwnerMemo];
        }
    });
}); };
var getMyMTLeafInfo = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, mTLeafInfoResult, mTLeafInfo, mTLeafInfoError, myMTLeafInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getMTLeafInfo(atxoSid)];
            case 2:
                mTLeafInfoResult = _a.sent();
                mTLeafInfo = mTLeafInfoResult.response, mTLeafInfoError = mTLeafInfoResult.error;
                if (mTLeafInfoError) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"" + atxoSid + "\", Error - " + mTLeafInfoError.message);
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"" + atxoSid + "\", Error - mTLeafInfo is empty");
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - " + error.message);
                }
                return [2 /*return*/, myMTLeafInfo];
        }
    });
}); };
var getAnonKeypairFromJson = function (anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var aXfrKeyPairConverted, secretDecKeyConverted, axfrPublicKeyConverted, encKeyConverted, axfrSecretKey, decKey, encKey, axfrPublicKey, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                axfrSecretKey = anonKeys.axfrSecretKey, decKey = anonKeys.decKey, encKey = anonKeys.encKey, axfrPublicKey = anonKeys.axfrPublicKey;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey)];
            case 2:
                aXfrKeyPairConverted = _a.sent(); // AXfrKeyPair
                return [4 /*yield*/, Keypair.getXPrivateKeyByBase64(decKey)];
            case 3:
                secretDecKeyConverted = _a.sent(); // XSecretKey
                return [4 /*yield*/, Keypair.getAXfrPublicKeyByBase64(axfrPublicKey)];
            case 4:
                axfrPublicKeyConverted = _a.sent(); // AXfrPubKey
                return [4 /*yield*/, Keypair.getXPublicKeyByBase64(encKey)];
            case 5:
                encKeyConverted = _a.sent(); // XPublicKey
                return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                throw new Error("Could not convert AnonKeyPair from JSON\", Error - " + error_5.message);
            case 7: return [2 /*return*/, {
                    aXfrKeyPairConverted: aXfrKeyPairConverted,
                    secretDecKeyConverted: secretDecKeyConverted,
                    axfrPublicKeyConverted: axfrPublicKeyConverted,
                    encKeyConverted: encKeyConverted,
                }];
        }
    });
}); };
var getAbarTransferInputPayload = function (ownedAbarItem, anonKeysSender) { return __awaiter(void 0, void 0, void 0, function () {
    var abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, maps, usedAssets, assetCode, asset, decimals, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 1:
                myOwnedAbar = _a.sent();
                return [4 /*yield*/, getAbarOwnerMemo(atxoSid)];
            case 2:
                abarOwnerMemo = _a.sent();
                return [4 /*yield*/, getMyMTLeafInfo(atxoSid)];
            case 3:
                myMTLeafInfo = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)([ownedAbarItem], anonKeysSender)];
            case 4:
                maps = _a.sent();
                usedAssets = maps.usedAssets;
                assetCode = usedAssets[0];
                return [4 /*yield*/, (0, sdkAsset_1.getAssetDetails)(assetCode)];
            case 5:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                result = {
                    myOwnedAbar: myOwnedAbar,
                    abarOwnerMemo: abarOwnerMemo,
                    myMTLeafInfo: myMTLeafInfo,
                    assetCode: assetCode,
                    decimals: decimals,
                };
                return [2 /*return*/, __assign({}, result)];
        }
    });
}); };
var abarToAbar = function (anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var calculatedFee, balanceAfterSendToBN, isMoreFeeNeeded, msg, encKeySender, anonTransferOperationBuilder, randomizers, abarToAbarData;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems)];
                case 1:
                    calculatedFee = _b.sent();
                    console.log('🚀 ~ file: tripleMasking.ts ~ line 288 ~ calculatedFee', calculatedFee);
                    balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFee);
                    isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                    if (isMoreFeeNeeded) {
                        msg = "Could not process abar transfer. More fee are needed. Required amount at least \"" + calculatedFee + " FRA\"";
                        throw new Error(msg);
                    }
                    return [4 /*yield*/, getAnonKeypairFromJson(anonKeysSender)];
                case 2:
                    encKeySender = (_b.sent()).encKeyConverted;
                    return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems)];
                case 3:
                    anonTransferOperationBuilder = _b.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.set_fra_remainder_receiver(encKeySender);
                    }
                    catch (error) {
                        throw new Error("Could not set remainder receiver for abar transfer operation\", Error - " + error.message);
                    }
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.build_and_sign();
                    }
                    catch (error) {
                        console.log('🚀 ~ file: tripleMasking.ts ~ line 320 ~ error', error);
                        throw new Error("Could not build and sign abar transfer operation\", Error - " + error.message);
                    }
                    try {
                        randomizers = anonTransferOperationBuilder === null || anonTransferOperationBuilder === void 0 ? void 0 : anonTransferOperationBuilder.get_randomizers();
                    }
                    catch (err) {
                        throw new Error("Could not get a list of randomizers strings \"" + err.message + "\" ");
                    }
                    console.log('🚀 ~ file: tripleMasking.ts ~ line 368 ~ randomizers', randomizers);
                    if (!((_a = randomizers === null || randomizers === void 0 ? void 0 : randomizers.randomizers) === null || _a === void 0 ? void 0 : _a.length)) {
                        throw new Error("List of randomizers strings is empty ");
                    }
                    abarToAbarData = {
                        anonKeysSender: anonKeysSender,
                        anonKeysReceiver: anonKeysReceiver,
                        randomizers: randomizers.randomizers,
                    };
                    return [2 /*return*/, { anonTransferOperationBuilder: anonTransferOperationBuilder, abarToAbarData: abarToAbarData }];
            }
        });
    });
};
exports.abarToAbar = abarToAbar;
var prepareAnonTransferOperationBuilder = function (anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, _a, aXfrKeyPairSender, secretDecKeySender, encKeySender, _b, axfrPublicKeyReceiver, encKeyReceiver, abarPayloadOne, _i, additionalOwnedAbarItems_1, ownedAbarItemOne, abarPayloadNext, toAmount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, transaction_1.getAnonTransferOperationBuilder)()];
                case 1:
                    anonTransferOperationBuilder = _c.sent();
                    return [4 /*yield*/, getAnonKeypairFromJson(anonKeysSender)];
                case 2:
                    _a = _c.sent(), aXfrKeyPairSender = _a.aXfrKeyPairConverted, secretDecKeySender = _a.secretDecKeyConverted, encKeySender = _a.encKeyConverted;
                    return [4 /*yield*/, getAnonKeypairFromJson(anonKeysReceiver)];
                case 3:
                    _b = _c.sent(), axfrPublicKeyReceiver = _b.axfrPublicKeyConverted, encKeyReceiver = _b.encKeyConverted;
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender)];
                case 4:
                    abarPayloadOne = _c.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadOne.myOwnedAbar, abarPayloadOne.abarOwnerMemo, aXfrKeyPairSender, secretDecKeySender, abarPayloadOne.myMTLeafInfo);
                    }
                    catch (error) {
                        throw new Error("Could not add an input for abar transfer operation\", Error - " + error.message);
                    }
                    _i = 0, additionalOwnedAbarItems_1 = additionalOwnedAbarItems;
                    _c.label = 5;
                case 5:
                    if (!(_i < additionalOwnedAbarItems_1.length)) return [3 /*break*/, 8];
                    ownedAbarItemOne = additionalOwnedAbarItems_1[_i];
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender)];
                case 6:
                    abarPayloadNext = _c.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadNext.myOwnedAbar, abarPayloadNext.abarOwnerMemo, aXfrKeyPairSender, secretDecKeySender, abarPayloadNext.myMTLeafInfo);
                    }
                    catch (error) {
                        throw new Error("Could not add an additional input for abar transfer operation\", Error - " + error.message);
                    }
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    toAmount = BigInt((0, bigNumber_1.toWei)(abarAmountToTransfer, abarPayloadOne.decimals).toString());
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_output(toAmount, axfrPublicKeyReceiver, encKeyReceiver);
                    }
                    catch (error) {
                        throw new Error("Could not add an output for abar transfer operation\", Error - " + error.message);
                    }
                    return [2 /*return*/, anonTransferOperationBuilder];
            }
        });
    });
};
exports.prepareAnonTransferOperationBuilder = prepareAnonTransferOperationBuilder;
var getAbarTransferFee = function (anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, expectedFee, calculatedFee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonKeysReceiver, abarAmountToTransfer, ownedAbarToUseAsSource, additionalOwnedAbarItems)];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    expectedFee = anonTransferOperationBuilder.get_expected_fee();
                    calculatedFee = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(expectedFee.toString()), 6).toFormat(6);
                    return [2 /*return*/, calculatedFee];
            }
        });
    });
};
exports.getAbarTransferFee = getAbarTransferFee;
var barToAbar = function (walletInfo, sid, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, transactionBuilder, item, utxoDataList, utxoItem, error_6, memoDataResult, myMemoData, memoError, ownerMemo, assetRecord, axfrPublicKey, encKey, error_7, feeInputs, error_8, randomizers, barToAbarData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, (0, transaction_1.getTransactionBuilder)()];
            case 2:
                transactionBuilder = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, [sid])];
            case 4:
                utxoDataList = _b.sent();
                utxoItem = utxoDataList[0];
                item = utxoItem;
                return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                throw new Error("could not fetch utxo for sid " + sid);
            case 6: return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 7:
                memoDataResult = _b.sent();
                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"" + sid + "\", Error - " + memoError.message);
                }
                try {
                    ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
                    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
                }
                catch (error) {
                    throw new Error("Could not get decode memo data or get assetRecord\", Error - " + error.message);
                }
                _b.label = 8;
            case 8:
                _b.trys.push([8, 11, , 12]);
                return [4 /*yield*/, Keypair.getAXfrPublicKeyByBase64(anonKeys.axfrPublicKey)];
            case 9:
                axfrPublicKey = _b.sent();
                return [4 /*yield*/, Keypair.getXPublicKeyByBase64(anonKeys.encKey)];
            case 10:
                encKey = _b.sent();
                return [3 /*break*/, 12];
            case 11:
                error_7 = _b.sent();
                throw new Error("Could not convert AXfrPublicKey\", Error - " + error_7.message);
            case 12:
                // auth_key_pair: XfrKeyPair, abar_pubkey: AXfrPubKey, txo_sid: BigInt,
                // input_record: ClientAssetRecord, owner_memo: OwnerMemo | undefined,
                // enc_key: XPublicKey
                try {
                    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(walletInfo.keypair, axfrPublicKey, BigInt(sid), assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), encKey);
                }
                catch (error) {
                    throw new Error("Could not add bar to abar operation\", Error - " + error.message);
                }
                _b.label = 13;
            case 13:
                _b.trys.push([13, 15, , 16]);
                return [4 /*yield*/, (0, fee_1.getFeeInputs)(walletInfo, sid)];
            case 14:
                feeInputs = _b.sent();
                return [3 /*break*/, 16];
            case 15:
                error_8 = _b.sent();
                throw new Error("Could not get fee inputs for bar to abar operation\", Error - " + error_8.message);
            case 16:
                try {
                    transactionBuilder = transactionBuilder.add_fee(feeInputs);
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Could not add fee for bar to abar operation\", Error - " + error.message);
                }
                try {
                    randomizers = transactionBuilder === null || transactionBuilder === void 0 ? void 0 : transactionBuilder.get_randomizers();
                    console.log('🚀 ~ file: tripleMasking.ts ~ line 355 ~ randomizers', randomizers);
                }
                catch (err) {
                    throw new Error("could not get a list of randomizers strings \"" + err.message + "\" ");
                }
                if (!((_a = randomizers === null || randomizers === void 0 ? void 0 : randomizers.randomizers) === null || _a === void 0 ? void 0 : _a.length)) {
                    throw new Error("list of randomizers strings is empty ");
                }
                barToAbarData = {
                    anonKeysFormatted: anonKeys,
                    randomizers: randomizers.randomizers,
                };
                return [2 /*return*/, { transactionBuilder: transactionBuilder, barToAbarData: barToAbarData, sid: "" + sid }];
        }
    });
}); };
exports.barToAbar = barToAbar;
var abarToBar = function (anonKeysSender, receiverWalletInfo, ownedAbarToUseAsSource, ownedAbarToUseAsFee) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionBuilder, receiverXfrPublicKey, _a, aXfrKeyPairSender, secretDecKeySender, abarPayloadSource, abarPayloadFee, randomizers, abarToBarData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, transaction_1.getTransactionBuilder)()];
            case 1:
                transactionBuilder = _b.sent();
                return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverWalletInfo.publickey)];
            case 2:
                receiverXfrPublicKey = _b.sent();
                return [4 /*yield*/, getAnonKeypairFromJson(anonKeysSender)];
            case 3:
                _a = _b.sent(), aXfrKeyPairSender = _a.aXfrKeyPairConverted, secretDecKeySender = _a.secretDecKeyConverted;
                return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender)];
            case 4:
                abarPayloadSource = _b.sent();
                try {
                    transactionBuilder = transactionBuilder.add_operation_abar_to_bar(abarPayloadSource.myOwnedAbar, abarPayloadSource.abarOwnerMemo, abarPayloadSource.myMTLeafInfo, aXfrKeyPairSender, secretDecKeySender, receiverXfrPublicKey, false, false);
                }
                catch (error) {
                    throw new Error("Could not add abar to bar operation\", Error - " + error.message);
                }
                return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsFee, anonKeysSender)];
            case 5:
                abarPayloadFee = _b.sent();
                // input: AnonBlindAssetRecord, owner_memo: OwnerMemo, mt_leaf_info: MTLeafInfo,
                // from_keypair: AXfrKeyPair, from_dec_key: XSecretKey
                try {
                    transactionBuilder = transactionBuilder.add_operation_anon_fee(abarPayloadFee.myOwnedAbar, abarPayloadFee.abarOwnerMemo, abarPayloadFee.myMTLeafInfo, aXfrKeyPairSender, secretDecKeySender);
                }
                catch (error) {
                    console.log('Full Error', error);
                    throw new Error("Could not anon fee operation\", Error - " + error.message);
                }
                try {
                    randomizers = transactionBuilder === null || transactionBuilder === void 0 ? void 0 : transactionBuilder.get_randomizers();
                    console.log('🚀 ~ file: tripleMasking.ts ~ line 542 ~ randomizers', randomizers);
                }
                catch (err) {
                    throw new Error("could not get a list of randomizers strings \"" + err.message + "\" ");
                }
                console.log('🚀 ~ file: tripleMasking.ts ~ line 547 ~ randomizers', randomizers);
                abarToBarData = {
                    anonKeysSender: anonKeysSender,
                    randomizers: randomizers.randomizers,
                };
                return [2 /*return*/, { transactionBuilder: transactionBuilder, abarToBarData: abarToBarData, receiverWalletInfo: receiverWalletInfo }];
        }
    });
}); };
exports.abarToBar = abarToBar;
var isNullifierHashSpent = function (hash) { return __awaiter(void 0, void 0, void 0, function () {
    var checkSpentResult, checkSpentResponse, checkSpentError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.checkNullifierHashSpent(hash)];
            case 1:
                checkSpentResult = _a.sent();
                checkSpentResponse = checkSpentResult.response, checkSpentError = checkSpentResult.error;
                if (checkSpentError) {
                    throw new Error("Could not check if hash \"" + hash + " is spent\", Error - " + checkSpentError.message);
                }
                if (checkSpentResponse === undefined) {
                    throw new Error("Could not check if hash \"" + hash + " is spent\", Error - Response is undefined");
                }
                return [2 /*return*/, checkSpentResponse];
        }
    });
}); };
exports.isNullifierHashSpent = isNullifierHashSpent;
var getUnspentAbars = function (anonKeys, givenRandomizersList) { return __awaiter(void 0, void 0, void 0, function () {
    var axfrPublicKey, axfrSecretKey, decKey, unspentAbars, _i, givenRandomizersList_1, givenRandomizer, ownedAbarsResponse, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isAbarSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                axfrPublicKey = anonKeys.axfrPublicKey, axfrSecretKey = anonKeys.axfrSecretKey, decKey = anonKeys.decKey;
                unspentAbars = [];
                _i = 0, givenRandomizersList_1 = givenRandomizersList;
                _a.label = 1;
            case 1:
                if (!(_i < givenRandomizersList_1.length)) return [3 /*break*/, 6];
                givenRandomizer = givenRandomizersList_1[_i];
                return [4 /*yield*/, (0, exports.getOwnedAbars)(axfrPublicKey, givenRandomizer)];
            case 2:
                ownedAbarsResponse = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 279 ~ ownedAbarsResponse', ownedAbarsResponse);
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 5];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, axfrSecretKey, decKey, givenRandomizer)];
            case 3:
                hash = _a.sent();
                return [4 /*yield*/, (0, exports.isNullifierHashSpent)(hash)];
            case 4:
                isAbarSpent = _a.sent();
                if (!isAbarSpent) {
                    unspentAbars.push(__assign({}, ownedAbarItem));
                }
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, unspentAbars];
        }
    });
}); };
exports.getUnspentAbars = getUnspentAbars;
var openAbar = function (abar, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, _a, aXfrKeyPair, secretDecKey, openedAbar, amount, asset_type, assetCode, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                abarData = abar.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 2:
                myOwnedAbar = _b.sent();
                return [4 /*yield*/, getAbarOwnerMemo(atxoSid)];
            case 3:
                abarOwnerMemo = _b.sent();
                return [4 /*yield*/, getMyMTLeafInfo(atxoSid)];
            case 4:
                myMTLeafInfo = _b.sent();
                return [4 /*yield*/, getAnonKeypairFromJson(anonKeys)];
            case 5:
                _a = _b.sent(), aXfrKeyPair = _a.aXfrKeyPairConverted, secretDecKey = _a.secretDecKeyConverted;
                openedAbar = ledger.get_open_abar(myOwnedAbar, abarOwnerMemo, aXfrKeyPair, secretDecKey, myMTLeafInfo);
                amount = openedAbar.amount, asset_type = openedAbar.asset_type;
                assetCode = ledger.asset_type_from_jsvalue(asset_type);
                item = {
                    amount: amount,
                    assetType: assetCode,
                    abar: openedAbar,
                };
                return [2 /*return*/, item];
        }
    });
}); };
exports.openAbar = openAbar;
var getBalanceMaps = function (unspentAbars, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var assetDetailsMap, balancesMap, usedAssets, _i, unspentAbars_1, abar, openedAbarItem, amount, assetType, asset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetDetailsMap = {};
                balancesMap = {};
                usedAssets = [];
                _i = 0, unspentAbars_1 = unspentAbars;
                _a.label = 1;
            case 1:
                if (!(_i < unspentAbars_1.length)) return [3 /*break*/, 6];
                abar = unspentAbars_1[_i];
                return [4 /*yield*/, (0, exports.openAbar)(abar, anonKeys)];
            case 2:
                openedAbarItem = _a.sent();
                amount = openedAbarItem.amount, assetType = openedAbarItem.assetType;
                if (!!assetDetailsMap[assetType]) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, sdkAsset_1.getAssetDetails)(assetType)];
            case 3:
                asset = _a.sent();
                usedAssets.push(assetType);
                assetDetailsMap[assetType] = asset;
                _a.label = 4;
            case 4:
                if (!balancesMap[assetType]) {
                    balancesMap[assetType] = '0';
                }
                balancesMap[assetType] = (0, bigNumber_1.plus)(balancesMap[assetType], amount).toString();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, {
                    assetDetailsMap: assetDetailsMap,
                    balancesMap: balancesMap,
                    usedAssets: usedAssets,
                }];
        }
    });
}); };
exports.getBalanceMaps = getBalanceMaps;
var getBalance = function (anonKeys, givenRandomizersList) { return __awaiter(void 0, void 0, void 0, function () {
    var unspentAbars, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeys, givenRandomizersList)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarBalance)(unspentAbars, anonKeys)];
            case 2:
                balances = _a.sent();
                return [2 /*return*/, balances];
        }
    });
}); };
exports.getBalance = getBalance;
var getAbarBalance = function (unspentAbars, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var maps, axfrPublicKey, assetDetailsMap, balancesMap, usedAssets, balances, _i, usedAssets_1, assetType, decimals, amount, balanceInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeys)];
            case 1:
                maps = _a.sent();
                axfrPublicKey = anonKeys.axfrPublicKey;
                assetDetailsMap = maps.assetDetailsMap, balancesMap = maps.balancesMap, usedAssets = maps.usedAssets;
                balances = [];
                for (_i = 0, usedAssets_1 = usedAssets; _i < usedAssets_1.length; _i++) {
                    assetType = usedAssets_1[_i];
                    decimals = assetDetailsMap[assetType].assetRules.decimals;
                    amount = (0, bigNumber_1.fromWei)(balancesMap[assetType], decimals).toFormat(decimals);
                    balances.push({ assetType: assetType, amount: amount });
                }
                balanceInfo = {
                    axfrPublicKey: axfrPublicKey,
                    balances: balances,
                };
                return [2 /*return*/, balanceInfo];
        }
    });
}); };
exports.getAbarBalance = getAbarBalance;
var getOwnedAbars = function (formattedAxfrPublicKey, givenRandomizer) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, axfrPublicKey, randomizedPubKey, _a, ownedAbarsResponse, error, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Keypair.getAXfrPublicKeyByBase64(formattedAxfrPublicKey)];
            case 2:
                axfrPublicKey = _b.sent();
                randomizedPubKey = ledger.randomize_axfr_pubkey(axfrPublicKey, givenRandomizer);
                return [4 /*yield*/, Network.getOwnedAbars(randomizedPubKey)];
            case 3:
                _a = _b.sent(), ownedAbarsResponse = _a.response, error = _a.error;
                // console.log('🚀 ~ file: tripleMasking.ts ~ line 456 ~ ownedAbarsResponse', ownedAbarsResponse);
                if (error) {
                    throw new Error(error.message);
                }
                if (!ownedAbarsResponse) {
                    throw new Error('Could not receive response from get ownedAbars call');
                }
                result = ownedAbarsResponse.map(function (ownedAbarItem) {
                    var atxoSid = ownedAbarItem[0], ownedAbar = ownedAbarItem[1];
                    var abar = {
                        axfrPublicKey: formattedAxfrPublicKey,
                        randomizer: givenRandomizer,
                        abarData: {
                            atxoSid: atxoSid,
                            ownedAbar: __assign({}, ownedAbar),
                        },
                    };
                    return abar;
                });
                return [2 /*return*/, result];
        }
    });
}); };
exports.getOwnedAbars = getOwnedAbars;
var genNullifierHash = function (atxoSid, ownedAbar, axfrSecretKey, decKey, randomizer) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarOwnerMemoResult, myMemoData, memoError, abarOwnerMemo, aXfrKeyPairForRandomizing, aXfrKeyPair, randomizeAxfrKeypairString, randomizeAxfrKeypair, mTLeafInfoResult, mTLeafInfo, mTLeafInfoError, myMTLeafInfo, myOwnedAbar, secretDecKey, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarOwnerMemo(atxoSid)];
            case 2:
                abarOwnerMemoResult = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 761 ~ atxoSid', atxoSid);
                myMemoData = abarOwnerMemoResult.response, memoError = abarOwnerMemoResult.error;
                if (memoError) {
                    throw new Error("Could not fetch abar memo data for sid (genNullifierHash) \"" + atxoSid + "\", Error - " + memoError.message);
                }
                console.log('myMemoData!', myMemoData);
                try {
                    abarOwnerMemo = ledger.OwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    console.log('error!', error);
                    throw new Error("Could not get decode abar memo data 1\", Error - " + error.message);
                }
                return [4 /*yield*/, Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey)];
            case 3:
                aXfrKeyPairForRandomizing = _a.sent();
                return [4 /*yield*/, Keypair.getAXfrPrivateKeyByBase64(axfrSecretKey)];
            case 4:
                aXfrKeyPair = _a.sent();
                return [4 /*yield*/, Keypair.getRandomizeAxfrKeypair(aXfrKeyPairForRandomizing, randomizer)];
            case 5:
                randomizeAxfrKeypairString = _a.sent();
                return [4 /*yield*/, Keypair.getAXfrPrivateKeyByBase64(randomizeAxfrKeypairString)];
            case 6:
                randomizeAxfrKeypair = _a.sent();
                return [4 /*yield*/, Network.getMTLeafInfo(atxoSid)];
            case 7:
                mTLeafInfoResult = _a.sent();
                mTLeafInfo = mTLeafInfoResult.response, mTLeafInfoError = mTLeafInfoResult.error;
                if (mTLeafInfoError) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"" + atxoSid + "\", Error - " + mTLeafInfoError.message);
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"" + atxoSid + "\", Error - mTLeafInfo is empty");
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - " + error.message);
                }
                try {
                    myOwnedAbar = ledger.abar_from_json(ownedAbar);
                }
                catch (error) {
                    throw new Error("Could not decode myOwnedAbar data\", Error - " + error.message);
                }
                secretDecKey = ledger.x_secretkey_from_string(decKey);
                try {
                    hash = ledger.gen_nullifier_hash(myOwnedAbar, abarOwnerMemo, aXfrKeyPair, randomizeAxfrKeypair, secretDecKey, myMTLeafInfo);
                    return [2 /*return*/, hash];
                }
                catch (err) {
                    throw new Error("Could not get nullifier hash\", Error - " + err.message);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.genNullifierHash = genNullifierHash;
//# sourceMappingURL=tripleMasking.js.map