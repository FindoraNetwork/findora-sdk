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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitmentByAtxoSid = exports.decryptAbarMemo = exports.getNullifierHashesFromCommitments = exports.abarToBarAmount = exports.getAbarToBarAmountPayload = exports.abarToBar = exports.abarToAbarAmount = exports.abarToAbar = exports.getAbarToAbarAmountPayload = exports.getTotalAbarTransferFee = exports.getSendAtxo = exports.getAbarTransferFee = exports.prepareAnonTransferOperationBuilder = exports.barToAbar = exports.barToAbarAmount = exports.getAllAbarBalances = exports.getSpentBalance = exports.getBalance = exports.getUnspentAbars = exports.getAbarBalance = exports.getBalanceMaps = exports.getSpentAbars = exports.getOwnedAbars = exports.genNullifierHash = exports.isNullifierHashSpent = exports.openAbar = exports.getAnonKeypairFromJson = exports.getAbarOwnerMemo = exports.genAnonKeys = void 0;
var testHelpers_1 = require("../../evm/testHelpers");
var bigNumber_1 = require("../../services/bigNumber");
var fee_1 = require("../../services/fee");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var utils_1 = require("../../services/utils");
var utxoHelper_1 = require("../../services/utxoHelper");
var Keypair = __importStar(require("../keypair"));
var Network = __importStar(require("../network"));
var Asset = __importStar(require("../sdkAsset"));
var Transaction = __importStar(require("../transaction"));
var Builder = __importStar(require("../transaction/builder"));
var DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR = 3;
var genAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Keypair.getMnemonic(24)];
            case 1:
                mm = _a.sent();
                return [4 /*yield*/, Keypair.restoreFromMnemonic(mm, 'fii')];
            case 2:
                walletInfo = _a.sent();
                return [2 /*return*/, walletInfo];
        }
    });
}); };
exports.genAnonKeys = genAnonKeys;
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
                    throw new Error("Could not decode myOwnedAbar data\", Error - ".concat(error));
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
                    throw new Error("Could not fetch abar memo data for sid \"".concat(atxoSid, "\", Error - ").concat(memoError.message));
                }
                try {
                    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    throw new Error("Could not get decode abar memo data\", Error - ".concat(error.message));
                }
                return [2 /*return*/, abarOwnerMemo];
        }
    });
}); };
exports.getAbarOwnerMemo = getAbarOwnerMemo;
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
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - ").concat(mTLeafInfoError.message));
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - mTLeafInfo is empty"));
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - ".concat(error.message));
                }
                return [2 /*return*/, myMTLeafInfo];
        }
    });
}); };
var getAnonKeypairFromJson = function (
// anonKeys: FindoraWallet.FormattedAnonKeys
anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var aXfrSecretKeyConverted, axfrPublicKeyConverted, publickey, privateStr, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Keypair.getXfrPrivateKeyByBase64(privateStr)];
            case 2:
                aXfrSecretKeyConverted = _a.sent(); // XfrKeyPair
                return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(publickey)];
            case 3:
                axfrPublicKeyConverted = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                throw new Error("Could not convert AnonKeyPair from JSON\", Error - ".concat(error_1.message));
            case 5: return [2 /*return*/, {
                    aXfrSecretKeyConverted: aXfrSecretKeyConverted,
                    axfrPublicKeyConverted: axfrPublicKeyConverted,
                }];
        }
    });
}); };
exports.getAnonKeypairFromJson = getAnonKeypairFromJson;
var openAbar = function (abar, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, axfrSpendKey, openedAbar, amount, asset_type, assetCode, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                abarData = abar.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 2:
                myOwnedAbar = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarOwnerMemo)(atxoSid)];
            case 3:
                abarOwnerMemo = _a.sent();
                return [4 /*yield*/, getMyMTLeafInfo(atxoSid)];
            case 4:
                myMTLeafInfo = _a.sent();
                return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeys)];
            case 5:
                axfrSpendKey = (_a.sent()).aXfrSecretKeyConverted;
                openedAbar = ledger.get_open_abar(myOwnedAbar, abarOwnerMemo, axfrSpendKey, myMTLeafInfo);
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
var isNullifierHashSpent = function (hash) { return __awaiter(void 0, void 0, void 0, function () {
    var checkSpentResult, checkSpentResponse, checkSpentError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.checkNullifierHashSpent(hash)];
            case 1:
                checkSpentResult = _a.sent();
                checkSpentResponse = checkSpentResult.response, checkSpentError = checkSpentResult.error;
                if (checkSpentError) {
                    throw new Error("Could not check if hash \"".concat(hash, " is spent\", Error - ").concat(checkSpentError.message));
                }
                if (checkSpentResponse === undefined) {
                    throw new Error("Could not check if hash \"".concat(hash, " is spent\", Error - Response is undefined"));
                }
                return [2 /*return*/, checkSpentResponse];
        }
    });
}); };
exports.isNullifierHashSpent = isNullifierHashSpent;
var genNullifierHash = function (atxoSid, ownedAbar, axfrSpendKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarOwnerMemoResult, myMemoData, memoError, abarOwnerMemo, toSend, myXfrKeyPair, mTLeafInfoResult, mTLeafInfo, mTLeafInfoError, myMTLeafInfo, myOwnedAbar, hash;
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
                    throw new Error("Could not fetch abar memo data for sid (genNullifierHash) \"".concat(atxoSid, "\", Error - ").concat(memoError.message));
                }
                try {
                    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    console.log('error!', error);
                    throw new Error("Could not get decode abar memo data 1\", Error - ".concat(error.message));
                }
                console.log('axfrSpendKey', axfrSpendKey);
                toSend = "\"".concat(axfrSpendKey, "\"");
                console.log('to send', toSend);
                try {
                    myXfrKeyPair = ledger.create_keypair_from_secret(toSend);
                }
                catch (error) {
                    throw new Error("could not restore keypair. details: \"".concat(error, "\""));
                }
                return [4 /*yield*/, Network.getMTLeafInfo(atxoSid)];
            case 3:
                mTLeafInfoResult = _a.sent();
                mTLeafInfo = mTLeafInfoResult.response, mTLeafInfoError = mTLeafInfoResult.error;
                if (mTLeafInfoError) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - ").concat(mTLeafInfoError.message));
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - mTLeafInfo is empty"));
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - ".concat(error.message));
                }
                try {
                    myOwnedAbar = ledger.abar_from_json(ownedAbar);
                }
                catch (error) {
                    throw new Error("Could not decode myOwnedAbar data\", Error - ".concat(error));
                }
                // export function gen_nullifier_hash(abar: AnonAssetRecord, memo: AxfrOwnerMemo, keypair: XfrKeyPair, mt_leaf_info: MTLeafInfo): string;
                try {
                    hash = ledger.gen_nullifier_hash(myOwnedAbar, abarOwnerMemo, myXfrKeyPair, myMTLeafInfo);
                    return [2 /*return*/, hash];
                }
                catch (err) {
                    throw new Error("Could not get nullifier hash\", Error - ".concat(err.message));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.genNullifierHash = genNullifierHash;
var getOwnedAbars = function (givenCommitment) { return __awaiter(void 0, void 0, void 0, function () {
    var getOwnedAbarsResponse, ownedAbarsResponse, error, atxoSid, ownedAbar, abar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getOwnedAbars(givenCommitment)];
            case 1:
                getOwnedAbarsResponse = _a.sent();
                console.log('getOwnedAbars getOwnedAbarsResponse', getOwnedAbarsResponse);
                ownedAbarsResponse = getOwnedAbarsResponse.response, error = getOwnedAbarsResponse.error;
                if (error) {
                    throw new Error(error.message);
                }
                if (ownedAbarsResponse === undefined) {
                    throw new Error('Could not receive response from get ownedAbars call');
                }
                if (!ownedAbarsResponse) {
                    return [2 /*return*/, []];
                }
                atxoSid = ownedAbarsResponse[0], ownedAbar = ownedAbarsResponse[1];
                abar = {
                    commitment: givenCommitment,
                    abarData: {
                        atxoSid: atxoSid,
                        ownedAbar: __assign({}, ownedAbar),
                    },
                };
                return [2 /*return*/, [abar]];
        }
    });
}); };
exports.getOwnedAbars = getOwnedAbars;
var getSpentAbars = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, spentAbars, _i, givenCommitmentsList_1, givenCommitment, ownedAbarsResponse, error_2, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isAbarSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                spentAbars = [];
                _i = 0, givenCommitmentsList_1 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_1.length)) return [3 /*break*/, 9];
                givenCommitment = givenCommitmentsList_1[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_2.message), console.log('Full Error', error_2));
                return [3 /*break*/, 8];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 8];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                return [4 /*yield*/, (0, exports.isNullifierHashSpent)(hash)];
            case 7:
                isAbarSpent = _a.sent();
                if (isAbarSpent) {
                    spentAbars.push(__assign({}, ownedAbarItem));
                }
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9: return [2 /*return*/, spentAbars];
        }
    });
}); };
exports.getSpentAbars = getSpentAbars;
var getBalanceMaps = function (unspentAbars, 
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var assetDetailsMap, balancesMap, atxoMap, usedAssets, _i, unspentAbars_1, abar, _a, atxoSid, commitment, openedAbarItem, amount, assetType, asset;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                assetDetailsMap = {};
                balancesMap = {};
                atxoMap = {};
                usedAssets = [];
                _i = 0, unspentAbars_1 = unspentAbars;
                _b.label = 1;
            case 1:
                if (!(_i < unspentAbars_1.length)) return [3 /*break*/, 6];
                abar = unspentAbars_1[_i];
                _a = abar.abarData, atxoSid = _a.atxoSid, commitment = _a.ownedAbar.commitment;
                return [4 /*yield*/, (0, exports.openAbar)(abar, anonKeys)];
            case 2:
                openedAbarItem = _b.sent();
                amount = openedAbarItem.amount, assetType = openedAbarItem.assetType;
                if (!!assetDetailsMap[assetType]) return [3 /*break*/, 4];
                return [4 /*yield*/, Asset.getAssetDetails(assetType)];
            case 3:
                asset = _b.sent();
                usedAssets.push(assetType);
                assetDetailsMap[assetType] = asset;
                _b.label = 4;
            case 4:
                if (!balancesMap[assetType]) {
                    balancesMap[assetType] = '0';
                }
                if (!atxoMap[assetType]) {
                    atxoMap[assetType] = [];
                }
                balancesMap[assetType] = (0, bigNumber_1.plus)(balancesMap[assetType], amount).toString();
                atxoMap[assetType].push({ amount: amount.toString(), assetType: assetType, atxoSid: atxoSid, commitment: commitment });
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, {
                    assetDetailsMap: assetDetailsMap,
                    balancesMap: balancesMap,
                    usedAssets: usedAssets,
                    atxoMap: atxoMap,
                }];
        }
    });
}); };
exports.getBalanceMaps = getBalanceMaps;
var getAbarBalance = function (unspentAbars, 
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var maps, publickey, assetDetailsMap, balancesMap, usedAssets, balances, _i, usedAssets_1, assetType, decimals, amount, balanceInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeys)];
            case 1:
                maps = _a.sent();
                publickey = anonKeys.publickey;
                assetDetailsMap = maps.assetDetailsMap, balancesMap = maps.balancesMap, usedAssets = maps.usedAssets;
                balances = [];
                for (_i = 0, usedAssets_1 = usedAssets; _i < usedAssets_1.length; _i++) {
                    assetType = usedAssets_1[_i];
                    decimals = assetDetailsMap[assetType].assetRules.decimals;
                    amount = (0, bigNumber_1.fromWei)(balancesMap[assetType], decimals).toFormat(decimals);
                    balances.push({ assetType: assetType, amount: amount });
                }
                balanceInfo = {
                    publickey: publickey,
                    balances: balances,
                };
                return [2 /*return*/, balanceInfo];
        }
    });
}); };
exports.getAbarBalance = getAbarBalance;
var getUnspentAbars = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, unspentAbars, _i, givenCommitmentsList_2, givenCommitment, ownedAbarsResponse, error_3, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isAbarSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                unspentAbars = [];
                _i = 0, givenCommitmentsList_2 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_2.length)) return [3 /*break*/, 9];
                givenCommitment = givenCommitmentsList_2[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_3.message), console.log('Full Error', error_3));
                return [3 /*break*/, 8];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 8];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                return [4 /*yield*/, (0, exports.isNullifierHashSpent)(hash)];
            case 7:
                isAbarSpent = _a.sent();
                if (!isAbarSpent) {
                    unspentAbars.push(__assign({}, ownedAbarItem));
                }
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9: return [2 /*return*/, unspentAbars];
        }
    });
}); };
exports.getUnspentAbars = getUnspentAbars;
var getBalance = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var unspentAbars, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeys, givenCommitmentsList)];
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
var getSpentBalance = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var unspentAbars, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSpentAbars)(anonKeys, givenCommitmentsList)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarBalance)(unspentAbars, anonKeys)];
            case 2:
                balances = _a.sent();
                return [2 /*return*/, balances];
        }
    });
}); };
exports.getSpentBalance = getSpentBalance;
var getAllAbarBalances = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var spentBalances, unSpentBalances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSpentBalance)(anonKeys, givenCommitmentsList)];
            case 1:
                spentBalances = _a.sent();
                return [4 /*yield*/, (0, exports.getBalance)(anonKeys, givenCommitmentsList)];
            case 2:
                unSpentBalances = _a.sent();
                return [2 /*return*/, {
                        spentBalances: spentBalances,
                        unSpentBalances: unSpentBalances,
                        givenCommitmentsList: givenCommitmentsList,
                    }];
        }
    });
}); };
exports.getAllAbarBalances = getAllAbarBalances;
/**
 * Transfer the exact amount of funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * This function is used to transfer the exact amount of provided asset code from the sender to the receiver.
 * It is calling `sendToAddress` function to obtain an utxo with the exact amount, and then it is calling `barToAbar`
 * with a fetched utxo sid number
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await barToAbarAmount(senderWalletInfo, amount, fraAssetCode, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
var barToAbarAmount = function (walletInfo, amount, assetCode, receiverAxfrPublicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var assetBlindRules, transactionBuilder, sendResultHandle, asset, decimals, utxoNumbers, utxoToUse, barToAbarResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, Transaction.sendToAddress(walletInfo, walletInfo.address, amount, assetCode, assetBlindRules)];
            case 1:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, Transaction.submitTransaction(transactionBuilder)];
            case 2:
                sendResultHandle = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 501 ~ sendResultHandle', sendResultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 3:
                _a.sent();
                return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
            case 4:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                return [4 /*yield*/, (0, utxoHelper_1.getUtxoWithAmount)(walletInfo, utxoNumbers, assetCode)];
            case 5:
                utxoToUse = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 510 ~ utxoToUse', utxoToUse);
                return [4 /*yield*/, (0, exports.barToAbar)(walletInfo, [utxoToUse.sid], receiverAxfrPublicKey)];
            case 6:
                barToAbarResult = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 508 ~ barToAbarResult', barToAbarResult);
                return [2 /*return*/, barToAbarResult];
        }
    });
}); };
exports.barToAbarAmount = barToAbarAmount;
/**
 * Transfer funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * Using a given array of utxo sids, this function fetches the associated utxo objects and confidentially transfers those
 * utxos (bars) to a given receiverPublicKey. After the transaction is submitted, the receiver will receive a list of one (or multiple)
 * atxos (aka abars).
 * Please note, this function is only meant to transfer the particularly provided utxos, and it is not used for transferring a custom
 * amount. To transfer the custom amount, please use `barToAbarAmount`
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await TripleMasking.barToAbar(senderWalletInfo, arrayOfUtxoSids, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```

    @throws `Could not fetch utxo for sids `
    @throws `Could not fetch memo data for sid `
    @throws `Could not get decode memo data or get assetRecord`
    @throws `Could not add bar to abar operation`
    @throws `Could not get fee inputs for bar to abar operation`
    @throws `Could not add fee for bar to abar operation`
    @throws `could not get a list of commitments strings `
    @throws `list of commitments strings is empty`
    @throws `could not build and sign txn`

 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
var barToAbar = function (walletInfo, sids, receiverPublicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, transactionBuilder, utxoDataList, error_4, _i, utxoDataList_1, utxoItem, sid, memoDataResult, myMemoData, memoError, ownerMemo, assetRecord, seed, receiverXfrPublicKeyConverted, feeInputs, error_5, commitments, barToAbarData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 2:
                transactionBuilder = _b.sent();
                utxoDataList = [];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sids)];
            case 4:
                utxoDataList = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                throw new Error("Could not fetch utxo for sids ".concat(sids.join(',')));
            case 6:
                _i = 0, utxoDataList_1 = utxoDataList;
                _b.label = 7;
            case 7:
                if (!(_i < utxoDataList_1.length)) return [3 /*break*/, 11];
                utxoItem = utxoDataList_1[_i];
                sid = utxoItem.sid;
                return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 8:
                memoDataResult = _b.sent();
                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"".concat(sid, "\", Error - ").concat(memoError));
                }
                ownerMemo = void 0;
                assetRecord = void 0;
                try {
                    ownerMemo = myMemoData ? ledger.AxfrOwnerMemo.from_json(myMemoData) : null;
                    assetRecord = ledger.ClientAssetRecord.from_json(utxoItem.utxo);
                }
                catch (error) {
                    throw new Error("Could not get decode memo data or get assetRecord\", Error - ".concat(error));
                }
                seed = (0, utils_1.generateSeedString)();
                return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverPublicKey)];
            case 9:
                receiverXfrPublicKeyConverted = _b.sent();
                try {
                    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(seed, walletInfo.keypair, receiverXfrPublicKeyConverted, BigInt(sid), assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone());
                }
                catch (error) {
                    throw new Error("Could not add bar to abar operation\", Error - ".concat(error));
                }
                _b.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 7];
            case 11:
                _b.trys.push([11, 13, , 14]);
                return [4 /*yield*/, (0, fee_1.getFeeInputs)(walletInfo, sids, true)];
            case 12:
                feeInputs = _b.sent();
                return [3 /*break*/, 14];
            case 13:
                error_5 = _b.sent();
                throw new Error("Could not get fee inputs for bar to abar operation\", Error - ".concat(error_5));
            case 14:
                try {
                    transactionBuilder = transactionBuilder.add_fee_bar_to_abar(feeInputs);
                }
                catch (error) {
                    console.log('Full error while trying to execute add_fee_bar_to_abar', error);
                    throw new Error("Could not add fee for bar to abar operation, Error - ".concat(error));
                }
                try {
                    commitments = transactionBuilder === null || transactionBuilder === void 0 ? void 0 : transactionBuilder.get_commitments();
                }
                catch (err) {
                    throw new Error("could not get a list of commitments strings \"".concat(err, "\" "));
                }
                if (!((_a = commitments === null || commitments === void 0 ? void 0 : commitments.commitments) === null || _a === void 0 ? void 0 : _a.length)) {
                    throw new Error("list of commitments strings is empty ");
                }
                barToAbarData = {
                    receiverXfrPublicKey: receiverPublicKey,
                    commitments: commitments.commitments,
                };
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    throw new Error("could not build and sign txn \"".concat(err, "\""));
                }
                return [2 /*return*/, { transactionBuilder: transactionBuilder, barToAbarData: barToAbarData, sids: sids }];
        }
    });
}); };
exports.barToAbar = barToAbar;
var getAbarTransferInputPayload = function (ownedAbarItem, 
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
anonKeysSender) { return __awaiter(void 0, void 0, void 0, function () {
    var abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, maps, usedAssets, assetCode, asset, decimals, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 1:
                myOwnedAbar = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarOwnerMemo)(atxoSid)];
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
                return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
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
var prepareAnonTransferOperationBuilder = function (
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
walletInfo, 
// axfrPublicKeyReceiverString: string,
receiverXfrPublicKey, abarAmountToTransfer, 
// ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem,
additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, aXfrSpendKeySender, receiverXfrPublicKeyConverted, ownedAbarToUseAsSource, additionalOwnedAbars, abarPayloadOne, toAmount, addedInputs, _i, additionalOwnedAbars_1, ownedAbarItemOne, abarPayloadNext, ledger, amountAssetType, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Builder.getAnonTransferOperationBuilder()];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(walletInfo)];
                case 2:
                    aXfrSpendKeySender = (_a.sent()).aXfrSecretKeyConverted;
                    return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverXfrPublicKey)];
                case 3:
                    receiverXfrPublicKeyConverted = _a.sent();
                    ownedAbarToUseAsSource = additionalOwnedAbarItems[0], additionalOwnedAbars = additionalOwnedAbarItems.slice(1);
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, walletInfo)];
                case 4:
                    abarPayloadOne = _a.sent();
                    try {
                        // console.log('prepare anon transfer - adding input ', abarPayloadOne);
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadOne.myOwnedAbar, abarPayloadOne.abarOwnerMemo, aXfrSpendKeySender, abarPayloadOne.myMTLeafInfo);
                    }
                    catch (error) {
                        throw new Error("Could not add an input for abar transfer operation\", Error - ".concat(error.message));
                    }
                    toAmount = BigInt((0, bigNumber_1.toWei)(abarAmountToTransfer, abarPayloadOne.decimals).toString());
                    addedInputs = [];
                    _i = 0, additionalOwnedAbars_1 = additionalOwnedAbars;
                    _a.label = 5;
                case 5:
                    if (!(_i < additionalOwnedAbars_1.length)) return [3 /*break*/, 8];
                    ownedAbarItemOne = additionalOwnedAbars_1[_i];
                    if (addedInputs.length >= 4) {
                        throw new Error('Amount you are trying to send is to big to send at once. Please try a smaller amount');
                    }
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarItemOne, walletInfo)];
                case 6:
                    abarPayloadNext = _a.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadNext.myOwnedAbar, abarPayloadNext.abarOwnerMemo, aXfrSpendKeySender, abarPayloadNext.myMTLeafInfo);
                    }
                    catch (error) {
                        console.log('platform error', error);
                        throw new Error("Could not add an additional input for abar transfer operation\", Error - ".concat(error.message));
                    }
                    addedInputs.push(ownedAbarItemOne);
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 9:
                    ledger = _a.sent();
                    amountAssetType = ledger.open_abar(abarPayloadOne.myOwnedAbar, abarPayloadOne.abarOwnerMemo, aXfrSpendKeySender);
                    anonTransferOperationBuilder = anonTransferOperationBuilder.add_output(toAmount, amountAssetType.asset_type, 
                    // axfrPublicKeyReceiver,
                    receiverXfrPublicKeyConverted);
                    return [3 /*break*/, 11];
                case 10:
                    error_6 = _a.sent();
                    throw new Error("Could not add an output for abar transfer operation\", Error - ".concat(error_6.message));
                case 11:
                    anonTransferOperationBuilder = anonTransferOperationBuilder.add_keypair(aXfrSpendKeySender);
                    return [2 /*return*/, anonTransferOperationBuilder];
            }
        });
    });
};
exports.prepareAnonTransferOperationBuilder = prepareAnonTransferOperationBuilder;
var getAbarTransferFee = function (
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, expectedFee, calculatedFee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
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
var processAbarToAbarCommitmentResponse = function (commitmentsMap) { return __awaiter(void 0, void 0, void 0, function () {
    var commitmentKeys, responseMap, _i, commitmentKeys_1, commitmentKey, commitmentEntity, commitmentAxfrPublicKey, commitmentNumericAssetType, commitmentAmountInWei, commitmentAssetType, asset, commitmentAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commitmentKeys = Object.keys(commitmentsMap);
                if (!(commitmentKeys === null || commitmentKeys === void 0 ? void 0 : commitmentKeys.length)) {
                    throw new Error("Commitments maps is empty ");
                }
                responseMap = [];
                _i = 0, commitmentKeys_1 = commitmentKeys;
                _a.label = 1;
            case 1:
                if (!(_i < commitmentKeys_1.length)) return [3 /*break*/, 5];
                commitmentKey = commitmentKeys_1[_i];
                commitmentEntity = commitmentsMap[commitmentKey];
                commitmentAxfrPublicKey = commitmentEntity[0], commitmentNumericAssetType = commitmentEntity[1], commitmentAmountInWei = commitmentEntity[2];
                return [4 /*yield*/, Asset.getAssetCode(commitmentNumericAssetType)];
            case 2:
                commitmentAssetType = _a.sent();
                return [4 /*yield*/, Asset.getAssetDetails(commitmentAssetType)];
            case 3:
                asset = _a.sent();
                commitmentAmount = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(commitmentAmountInWei.toString()), (asset === null || asset === void 0 ? void 0 : asset.assetRules.decimals) || 6).toFormat((asset === null || asset === void 0 ? void 0 : asset.assetRules.decimals) || 6);
                responseMap.push({
                    commitmentKey: commitmentKey,
                    commitmentAxfrPublicKey: commitmentAxfrPublicKey,
                    commitmentAssetType: commitmentAssetType,
                    commitmentAmount: "".concat(commitmentAmount),
                });
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, responseMap];
        }
    });
}); };
var mergeAtxoList = function (arr1, arr2) {
    var res = [];
    while (arr1.length && arr2.length) {
        var assetItem1 = arr1[0];
        var assetItem2 = arr2[0];
        var amount1 = BigInt(assetItem1.amount);
        var amount2 = BigInt(assetItem2.amount);
        if (amount1 < amount2) {
            res.push(arr1.splice(0, 1)[0]);
            continue;
        }
        res.push(arr2.splice(0, 1)[0]);
    }
    return res.concat(arr1, arr2);
};
var mergeSortAtxoList = function (arr) {
    if (arr.length < 2)
        return arr;
    var middleIdx = Math.floor(arr.length / 2);
    var left = arr.splice(0, middleIdx);
    var right = arr.splice(0);
    return mergeAtxoList(mergeSortAtxoList(left), mergeSortAtxoList(right));
};
var getSendAtxo = function (code, amount, commitments, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var result, unspentAbars, balancesMaps, atxoMap, filteredUtxoList, sortedUtxoList, sum, _i, sortedUtxoList_1, assetItem, _amount, credit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [];
                return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeys, commitments)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeys)];
            case 2:
                balancesMaps = _a.sent();
                atxoMap = balancesMaps.atxoMap;
                filteredUtxoList = atxoMap[code];
                // console.log('🚀 ~ file: tripleMasking.ts ~ line 1059 ~ amount', amount);
                if (!filteredUtxoList) {
                    return [2 /*return*/, []];
                }
                sortedUtxoList = mergeSortAtxoList(filteredUtxoList);
                sum = BigInt(0);
                for (_i = 0, sortedUtxoList_1 = sortedUtxoList; _i < sortedUtxoList_1.length; _i++) {
                    assetItem = sortedUtxoList_1[_i];
                    _amount = BigInt(assetItem.amount);
                    sum = sum + _amount;
                    credit = BigInt(Number(sum) - Number(amount));
                    result.push({
                        amount: _amount,
                        sid: assetItem.atxoSid,
                        commitment: assetItem.commitment,
                    });
                    if (credit >= 0) {
                        break;
                    }
                }
                return [2 /*return*/, sum >= amount ? result : []];
        }
    });
}); };
exports.getSendAtxo = getSendAtxo;
var getTotalAbarTransferFee = function (
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, expectedFee, calculatedFee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    expectedFee = anonTransferOperationBuilder.get_total_fee_estimate();
                    console.log('🚀 ~ file: tripleMasking.ts ~ line 719 ~ total expectedFee', expectedFee);
                    calculatedFee = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(expectedFee.toString()), 6).toFormat(6);
                    return [2 /*return*/, calculatedFee];
            }
        });
    });
};
exports.getTotalAbarTransferFee = getTotalAbarTransferFee;
var getAbarToAbarAmountPayload = function (
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var asset, decimals, utxoNumbers, unspentAbars, balancesMaps, atxoMap, filteredFraAtxoList, filteredAssetAtxoList, fraAssetCode, isFraTransfer, assetCommitments, fraCommitments, atxoListToSend, additionalOwnedAbarItems, commitmentsToSend, commitmentsForFee, _i, atxoListToSend_1, atxoItem, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, calculatedFee, error_7, totalFeeEstimate, error_8, balanceAfterSendToBN, isMoreFeeNeeded, allCommitmentsForFee, idx, feeUtxoNumbers, feeAtxoListToSend, allCommitmentsForFeeSorted, calculatedFeeA, givenCommitment, myCalculatedFee, error_9, ownedAbarsResponseFee, additionalOwnedAbarItemFee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
            case 1:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeysSender, givenCommitmentsList)];
            case 2:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeysSender)];
            case 3:
                balancesMaps = _a.sent();
                atxoMap = balancesMaps.atxoMap;
                filteredFraAtxoList = [];
                filteredAssetAtxoList = atxoMap[assetCode] || [];
                if (!filteredAssetAtxoList.length) {
                    throw new Error(
                    // `There is no any abar for asset ${assetCode} available for ${anonKeysSender.axfrPublicKey}`,
                    "There is no any abar for asset ".concat(assetCode, " available for ").concat(anonKeysSender.publickey));
                }
                return [4 /*yield*/, Asset.getFraAssetCode()];
            case 4:
                fraAssetCode = _a.sent();
                isFraTransfer = assetCode === fraAssetCode;
                if (!isFraTransfer) {
                    filteredFraAtxoList = atxoMap[fraAssetCode] || [];
                }
                if (!isFraTransfer && !filteredFraAtxoList.length) {
                    throw new Error("There is no any FRA abar to cover the fee for ".concat(anonKeysSender.publickey));
                }
                assetCommitments = filteredAssetAtxoList.map(function (atxoItem) { return atxoItem.commitment; });
                fraCommitments = filteredFraAtxoList.map(function (atxoItem) { return atxoItem.commitment; });
                return [4 /*yield*/, (0, exports.getSendAtxo)(assetCode, utxoNumbers, assetCommitments, anonKeysSender)];
            case 5:
                atxoListToSend = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 338 ~ atxoListToSend', atxoListToSend);
                if (!atxoListToSend.length) {
                    throw new Error("Sender ".concat(anonKeysSender.publickey, " does not have enough abars to send ").concat(amount, " of ").concat(assetCode));
                }
                additionalOwnedAbarItems = [];
                commitmentsToSend = [];
                commitmentsForFee = [];
                _i = 0, atxoListToSend_1 = atxoListToSend;
                _a.label = 6;
            case 6:
                if (!(_i < atxoListToSend_1.length)) return [3 /*break*/, 9];
                atxoItem = atxoListToSend_1[_i];
                givenCommitment = atxoItem.commitment;
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 7:
                ownedAbarsResponseTwo = _a.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                commitmentsToSend.push(givenCommitment);
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                _a.trys.push([9, 11, , 12]);
                return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 10:
                calculatedFee = _a.sent();
                return [3 /*break*/, 12];
            case 11:
                error_7 = _a.sent();
                throw new Error('1 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 12:
                _a.trys.push([12, 14, , 15]);
                return [4 /*yield*/, (0, exports.getTotalAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 13:
                totalFeeEstimate = _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_8 = _a.sent();
                throw new Error('2 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 15:
                console.log("\uD83D\uDE80 ~ file: tripleMasking.ts ~ line 308 ~ we need ".concat(calculatedFee, " more FRA to pay fee"));
                balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFee);
                isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                if (!isMoreFeeNeeded) {
                    return [2 /*return*/, {
                            commitmentsToSend: commitmentsToSend,
                            commitmentsForFee: commitmentsForFee,
                            additionalAmountForFee: totalFeeEstimate,
                        }];
                }
                allCommitmentsForFee = fraCommitments;
                if (isFraTransfer) {
                    allCommitmentsForFee = assetCommitments.filter(function (commitment) { return !atxoListToSend.map(function (atxoItem) { return atxoItem.commitment; }).includes(commitment); });
                }
                idx = 0;
                feeUtxoNumbers = BigInt((0, bigNumber_1.toWei)(calculatedFee, 6).toString());
                return [4 /*yield*/, (0, exports.getSendAtxo)(fraAssetCode, feeUtxoNumbers, allCommitmentsForFee, anonKeysSender)];
            case 16:
                feeAtxoListToSend = _a.sent();
                allCommitmentsForFeeSorted = feeAtxoListToSend.map(function (atxoItem) { return atxoItem.commitment; });
                _a.label = 17;
            case 17:
                if (!isMoreFeeNeeded) return [3 /*break*/, 24];
                givenCommitment = allCommitmentsForFeeSorted === null || allCommitmentsForFeeSorted === void 0 ? void 0 : allCommitmentsForFeeSorted[idx];
                _a.label = 18;
            case 18:
                _a.trys.push([18, 20, , 21]);
                return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 19:
                myCalculatedFee = _a.sent();
                calculatedFeeA = myCalculatedFee;
                return [3 /*break*/, 21];
            case 20:
                error_9 = _a.sent();
                throw new Error('3 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 21:
                balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFeeA);
                isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                if (isMoreFeeNeeded && !givenCommitment) {
                    throw new Error("You still need ".concat(calculatedFeeA, " FRA to cover the fee 3"));
                }
                if (!givenCommitment) return [3 /*break*/, 23];
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 22:
                ownedAbarsResponseFee = _a.sent();
                additionalOwnedAbarItemFee = ownedAbarsResponseFee[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItemFee);
                commitmentsForFee.push(givenCommitment);
                _a.label = 23;
            case 23:
                idx += 1;
                console.log('🚀 ~ file: tripleMasking.ts ~ line 397 ~ calculatedFee', calculatedFeeA);
                return [3 /*break*/, 17];
            case 24:
                console.log('returning calculatedFeeA', calculatedFeeA);
                return [2 /*return*/, {
                        commitmentsToSend: commitmentsToSend,
                        commitmentsForFee: commitmentsForFee,
                        additionalAmountForFee: totalFeeEstimate,
                    }];
        }
    });
}); };
exports.getAbarToAbarAmountPayload = getAbarToAbarAmountPayload;
/**
 * Transfer funds from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note, that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remained abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
 *    anonKeysSender,
 *    anonKeysReceiver.publickey,
 *    '2',
 *    additionalOwnedAbarItems,
 *  );

  // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind, that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @throws 'The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount'
* @throws 'Could not process abar transfer. More fees are needed. Required amount at least "${calculatedFee} FRA"'
* @throws 'Could not build and sign abar transfer operation'
* @throws 'Could not get a list of commitments strings '
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
var abarToAbar = function (anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var calculatedFee, error_10, balanceAfterSendToBN, isMoreFeeNeeded, msg, anonTransferOperationBuilder, commitmentsMap, processedCommitmentsMap, abarToAbarData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 1:
                    calculatedFee = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    throw new Error('The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount');
                case 3:
                    console.log("\uD83D\uDE80 ~ file: tripleMasking.ts ~ line 308 ~ we need ".concat(calculatedFee, " more FRA to pay fee"));
                    balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFee);
                    isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                    if (isMoreFeeNeeded) {
                        msg = "Could not process abar transfer. More fees are needed. Required amount at least \"".concat(calculatedFee, " FRA\"");
                        throw new Error(msg);
                    }
                    return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 4:
                    anonTransferOperationBuilder = _a.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.build();
                    }
                    catch (error) {
                        console.log('🚀 ~ file: tripleMasking.ts ~ line 320 ~ error', error);
                        console.log('Full Error: ', error);
                        throw new Error("Could not build and sign abar transfer operation, Error - ".concat(error));
                    }
                    try {
                        commitmentsMap = anonTransferOperationBuilder === null || anonTransferOperationBuilder === void 0 ? void 0 : anonTransferOperationBuilder.get_commitment_map();
                    }
                    catch (err) {
                        throw new Error("Could not get a list of commitments strings \"".concat(err.message, "\" "));
                    }
                    return [4 /*yield*/, processAbarToAbarCommitmentResponse(commitmentsMap)];
                case 5:
                    processedCommitmentsMap = _a.sent();
                    abarToAbarData = {
                        anonKeysSender: anonKeysSender,
                        anonPubKeyReceiver: anonPubKeyReceiver,
                        commitmentsMap: processedCommitmentsMap,
                    };
                    return [2 /*return*/, { anonTransferOperationBuilder: anonTransferOperationBuilder, abarToAbarData: abarToAbarData }];
            }
        });
    });
};
exports.abarToAbar = abarToAbar;
/**
 * Transfer funds of the specific asset from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given asset code and the amount, this function executes a confidential transfer. Abars for the transfer are
 * being retrieved using provided commitments array. The retrieved abars array must have enough FRA abars to cover the
 * transfer fee.
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
 *   anonKeysSender,
 *   anonKeysReceiver.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );

 * // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
var abarToAbarAmount = function (anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, commitmentsToSend, commitmentsForFee, allCommitments, additionalOwnedAbarItems, _i, allCommitments_1, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, abarToAbarResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAbarToAbarAmountPayload)(anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList)];
            case 1:
                payload = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 453 ~ payload', payload);
                commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee;
                allCommitments = __spreadArray(__spreadArray([], commitmentsToSend, true), commitmentsForFee, true);
                console.log('🚀 ~ file: tripleMasking.ts ~ line 458 ~ allCommitments', allCommitments);
                additionalOwnedAbarItems = [];
                _i = 0, allCommitments_1 = allCommitments;
                _a.label = 2;
            case 2:
                if (!(_i < allCommitments_1.length)) return [3 /*break*/, 5];
                givenCommitment = allCommitments_1[_i];
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponseTwo = _a.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, (0, exports.abarToAbar)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 6:
                abarToAbarResult = _a.sent();
                return [2 /*return*/, abarToAbarResult];
        }
    });
}); };
exports.abarToAbarAmount = abarToAbarAmount;
/**
 * Transfer funds from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer
 * those abars to the receiverPublickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 *
 * ```ts
  const { transactionBuilder } = await TripleMasking.abarToBar(anonKeysSender, receiverPublickey, abarsList);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @throws `Could not add abar to bar operation", Error - ${error as Error}`
* @throws `Could not add an additional input for abar to bar transfer operation`
* @throws `Could not build txn`
*
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
var abarToBar = function (anonKeysSender, receiverXfrPublicKey, additionalOwnedAbarItems, hideAmount, hideAssetType) {
    if (hideAmount === void 0) { hideAmount = false; }
    if (hideAssetType === void 0) { hideAssetType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var transactionBuilder, receiverXfrPublicKeyConverted, aXfrSpendKeySender, ownedAbarToUseAsSource, additionalOwnedAbars, abarPayloadSource, _i, additionalOwnedAbars_2, ownedAbarItemOne, abarPayloadNext, abarToBarData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Builder.getTransactionBuilder()];
                case 1:
                    transactionBuilder = _a.sent();
                    return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverXfrPublicKey)];
                case 2:
                    receiverXfrPublicKeyConverted = _a.sent();
                    return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeysSender)];
                case 3:
                    aXfrSpendKeySender = (_a.sent()).aXfrSecretKeyConverted;
                    ownedAbarToUseAsSource = additionalOwnedAbarItems[0], additionalOwnedAbars = additionalOwnedAbarItems.slice(1);
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender)];
                case 4:
                    abarPayloadSource = _a.sent();
                    try {
                        transactionBuilder = transactionBuilder.add_operation_abar_to_bar(abarPayloadSource.myOwnedAbar, abarPayloadSource.abarOwnerMemo, abarPayloadSource.myMTLeafInfo, aXfrSpendKeySender, receiverXfrPublicKeyConverted, hideAmount, hideAssetType);
                    }
                    catch (error) {
                        console.log('Error adding Abar to bar', error);
                        throw new Error("Could not add abar to bar operation\", Error - ".concat(error));
                    }
                    _i = 0, additionalOwnedAbars_2 = additionalOwnedAbars;
                    _a.label = 5;
                case 5:
                    if (!(_i < additionalOwnedAbars_2.length)) return [3 /*break*/, 8];
                    ownedAbarItemOne = additionalOwnedAbars_2[_i];
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender)];
                case 6:
                    abarPayloadNext = _a.sent();
                    try {
                        transactionBuilder = transactionBuilder.add_operation_abar_to_bar(abarPayloadNext.myOwnedAbar, abarPayloadNext.abarOwnerMemo, abarPayloadNext.myMTLeafInfo, aXfrSpendKeySender, receiverXfrPublicKeyConverted, hideAmount, hideAssetType);
                    }
                    catch (error) {
                        console.log('Error from the backend:', error);
                        throw new Error("Could not add an additional input for abar to bar transfer operation\", Error - ".concat(error.message));
                    }
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    try {
                        transactionBuilder = transactionBuilder.build();
                    }
                    catch (err) {
                        throw new Error("could not build txn \"".concat(err, "\""));
                    }
                    abarToBarData = {
                        anonKeysSender: anonKeysSender,
                    };
                    return [2 /*return*/, { transactionBuilder: transactionBuilder, abarToBarData: abarToBarData, receiverXfrPublicKey: receiverXfrPublicKey }];
            }
        });
    });
};
exports.abarToBar = abarToBar;
var getAbarToBarAmountPayload = function (
// anonKeysSender: FindoraWallet.FormattedAnonKeys,
anonKeysSender, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, commitmentsToSend, commitmentsForFee, additionalAmountForFee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAbarToAbarAmountPayload)(anonKeysSender, anonKeysSender.publickey, amount, assetCode, givenCommitmentsList)];
            case 1:
                payload = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 453 ~ payload', payload);
                commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee, additionalAmountForFee = payload.additionalAmountForFee;
                return [2 /*return*/, {
                        commitmentsToSend: commitmentsToSend,
                        commitmentsForFee: commitmentsForFee,
                        additionalAmountForFee: additionalAmountForFee,
                    }];
        }
    });
}); };
exports.getAbarToBarAmountPayload = getAbarToBarAmountPayload;
/**
 * Transfer the exact amount of the provided asset from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided commitments, (and associated abars that are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided commitments must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Its return value also contains a list of commitments spent during this operation, and a list of commitments with the transfer remainders (if any).
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 * ```ts
 * const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
 *   anonKeysSender,
 *   toWalletInfo.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );
 *
 * // tx hash
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
var abarToBarAmount = function (anonKeysSender, receiverXfrPublicKey, amount, assetCode, givenCommitmentsList, hideAmount, hideAssetType) {
    if (hideAmount === void 0) { hideAmount = false; }
    if (hideAssetType === void 0) { hideAssetType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var payload, commitmentsToSend, commitmentsForFee, givenCommitmentsListSender, _a, anonTransferOperationBuilder, abarToAbarData, asset, decimals, amountToSendInWei, _resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, remainderCommitements, _i, commitmentsMap_1, commitmentsMapEntry, commitmentKey, commitmentAmount, commitmentAssetType, commitmentAmountInWei, isSameAssetType, isSameAmount, allCommitments, additionalOwnedAbarItems, _b, allCommitments_2, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, abarToBarResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, exports.getAbarToBarAmountPayload)(anonKeysSender, amount, assetCode, givenCommitmentsList)];
                case 1:
                    payload = _c.sent();
                    commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee;
                    givenCommitmentsListSender = __spreadArray(__spreadArray([], commitmentsToSend, true), commitmentsForFee, true);
                    return [4 /*yield*/, (0, exports.abarToAbarAmount)(anonKeysSender, anonKeysSender.publickey, amount, assetCode, givenCommitmentsListSender)];
                case 2:
                    _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                    return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
                case 3:
                    asset = _c.sent();
                    decimals = asset.assetRules.decimals;
                    amountToSendInWei = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                    return [4 /*yield*/, Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
                case 4:
                    _resultHandle = _c.sent();
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR)];
                case 5:
                    _c.sent();
                    console.log('abar transaction handle', _resultHandle);
                    commitmentsMap = abarToAbarData.commitmentsMap;
                    retrivedCommitmentsListReceiver = [];
                    remainderCommitements = [];
                    for (_i = 0, commitmentsMap_1 = commitmentsMap; _i < commitmentsMap_1.length; _i++) {
                        commitmentsMapEntry = commitmentsMap_1[_i];
                        commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAmount = commitmentsMapEntry.commitmentAmount, commitmentAssetType = commitmentsMapEntry.commitmentAssetType;
                        console.log('🚀 ~ file: tripleMasking.ts ~ line 863 ~ commitmentsMapEntry', commitmentsMapEntry);
                        commitmentAmountInWei = BigInt((0, bigNumber_1.toWei)(commitmentAmount, decimals).toString());
                        isSameAssetType = commitmentAssetType === assetCode;
                        isSameAmount = commitmentAmountInWei === amountToSendInWei;
                        if (isSameAssetType && isSameAmount) {
                            console.log('🚀 ~ file: tripleMasking.ts ~ line 906 ~ amountToSendInWei!!!', amountToSendInWei);
                            retrivedCommitmentsListReceiver.push(commitmentKey);
                            continue;
                        }
                        remainderCommitements.push(commitmentKey);
                    }
                    allCommitments = __spreadArray([], retrivedCommitmentsListReceiver, true);
                    additionalOwnedAbarItems = [];
                    _b = 0, allCommitments_2 = allCommitments;
                    _c.label = 6;
                case 6:
                    if (!(_b < allCommitments_2.length)) return [3 /*break*/, 9];
                    givenCommitment = allCommitments_2[_b];
                    return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
                case 7:
                    ownedAbarsResponseTwo = _c.sent();
                    additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                    _c.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, (0, exports.abarToBar)(anonKeysSender, receiverXfrPublicKey, additionalOwnedAbarItems, hideAmount, hideAssetType)];
                case 10:
                    abarToBarResult = _c.sent();
                    return [2 /*return*/, __assign(__assign({}, abarToBarResult), { remainderCommitements: remainderCommitements, spentCommitments: givenCommitmentsListSender })];
            }
        });
    });
};
exports.abarToBarAmount = abarToBarAmount;
var getNullifierHashesFromCommitments = function (
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, nullifierHashes, _i, givenCommitmentsList_3, givenCommitment, ownedAbarsResponse, error_11, ownedAbarItem, abarData, atxoSid, ownedAbar, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                nullifierHashes = [];
                _i = 0, givenCommitmentsList_3 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_3.length)) return [3 /*break*/, 8];
                givenCommitment = givenCommitmentsList_3[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_11.message), console.log('Full Error', error_11));
                return [3 /*break*/, 7];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 7];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                nullifierHashes.push(hash);
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: 
            // import KeyStore from '_utils/keystore';
            // const b = await KeyStore.restoreWalletInfo(anonKeys.privateStr, 'foo');
            return [2 /*return*/, nullifierHashes];
        }
    });
}); };
exports.getNullifierHashesFromCommitments = getNullifierHashesFromCommitments;
var decryptAbarMemo = function (abarMemoItem, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, atxoSid, myMemoData, axfrSpendKey, abarOwnerMemo, decryptedAbar, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                atxoSid = abarMemoItem[0], myMemoData = abarMemoItem[1];
                return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeys)];
            case 2:
                axfrSpendKey = (_a.sent()).aXfrSecretKeyConverted;
                abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                try {
                    // decryptedAbar = ledger.try_decrypt_axfr_memo(abarOwnerMemo, aXfrKeyPair);
                    decryptedAbar = ledger.try_decrypt_axfr_memo(abarOwnerMemo, axfrSpendKey);
                }
                catch (error) {
                    return [2 /*return*/, false];
                }
                result = {
                    atxoSid: atxoSid,
                    decryptedAbar: decryptedAbar,
                    owner: anonKeys,
                };
                return [2 /*return*/, result];
        }
    });
}); };
exports.decryptAbarMemo = decryptAbarMemo;
var getCommitmentByAtxoSid = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, commitementResult, error, response, commitmentInBase58;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarCommitment("".concat(atxoSid))];
            case 2:
                commitementResult = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 1519 ~ getCommitmentByAtxoSid ~ commitementResult', commitementResult);
                error = commitementResult.error, response = commitementResult.response;
                if (error) {
                    (0, utils_1.log)('error', error);
                    throw new Error("could not get commitment by atxo sid. details: ".concat(error.message));
                }
                if (!response) {
                    throw new Error("could not get commitment by atxo sid. no response retrieved");
                }
                commitmentInBase58 = ledger.base64_to_base58(response);
                // console.log(
                //   '🚀 ~ file: tripleMasking.ts ~ line 1531 ~ getCommitmentByAtxoSid ~ commitmentInBase58',
                //   commitmentInBase58,
                // );
                return [2 /*return*/, {
                        atxoSid: atxoSid,
                        commitment: commitmentInBase58,
                    }];
        }
    });
}); };
exports.getCommitmentByAtxoSid = getCommitmentByAtxoSid;
//# sourceMappingURL=tripleMasking.js.map