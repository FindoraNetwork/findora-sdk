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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.barToAbarAmount = exports.abarToBarFraSendAmount = exports.abarToBarCustomSendAmount = exports.abarToBar = exports.abarToAbarCustomMultipleFraAtxoForFeeSendAmount = exports.abarToAbarFraMultipleFraAtxoForFeeSendAmount = exports.abarToAbarMulti = exports.abarToAbar = exports.barToAbar = exports.createTestBars = exports.getSidsForSingleAsset = exports.validateSpent = exports.issueCustomAsset = exports.defineCustomAsset = exports.createNewKeypair = exports.getAnonKeys = exports.getDerivedAssetCode = exports.getRandomAssetCode = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var api_1 = require("../api");
var testHelpers_1 = require("../evm/testHelpers");
var Sdk_1 = __importDefault(require("../Sdk"));
var providers_1 = require("../services/cacheStore/providers");
var utils_1 = require("../services/utils");
var utxoHelper_1 = require("../services/utxoHelper");
var bigNumber_1 = require("../services/bigNumber");
dotenv_1.default.config();
var envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? "../../.env_tm_integration_".concat(process.env.INTEGRATION_ENV_NAME)
    : "../../.env_example";
var envConfig = require("".concat(envConfigFile, ".json"));
var walletKeys = envConfig.keys, envHostUrl = envConfig.hostUrl;
var sdkEnv = {
    hostUrl: envHostUrl,
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
(0, utils_1.log)('🚀 ~ Findora Sdk is configured to use:', sdkEnv);
(0, utils_1.log)("Connecting to \"".concat(sdkEnv.hostUrl, "\""));
Sdk_1.default.init(sdkEnv);
var mainFaucet = walletKeys.mainFaucet;
var password = 'yourSecretPassword';
var getRandomAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var asset1Code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                asset1Code = _a.sent();
                return [2 /*return*/, asset1Code];
        }
    });
}); };
exports.getRandomAssetCode = getRandomAssetCode;
var getDerivedAssetCode = function (asset1Code) { return __awaiter(void 0, void 0, void 0, function () {
    var derivedAsset1Code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(asset1Code)];
            case 1:
                derivedAsset1Code = _a.sent();
                return [2 /*return*/, derivedAsset1Code];
        }
    });
}); };
exports.getDerivedAssetCode = getDerivedAssetCode;
var getAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var myAnonKeys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, utils_1.log)('//////////////// Generate Anon Keys //////////////// ');
                return [4 /*yield*/, api_1.TripleMasking.genAnonKeys()];
            case 1:
                myAnonKeys = _a.sent();
                (0, utils_1.log)('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
                return [2 /*return*/, myAnonKeys];
        }
    });
}); };
exports.getAnonKeys = getAnonKeys;
var createNewKeypair = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Keypair.getMnemonic(24)];
            case 1:
                mm = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 2:
                walletInfo = _a.sent();
                (0, utils_1.log)('new wallet info', walletInfo);
                return [2 /*return*/, walletInfo];
        }
    });
}); };
exports.createNewKeypair = createNewKeypair;
var defineCustomAsset = function (senderOne, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, assetCode)];
            case 2:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 3:
                handle = _a.sent();
                (0, utils_1.log)('New asset ', assetCode, ' created, handle', handle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.defineCustomAsset = defineCustomAsset;
var issueCustomAsset = function (senderOne, assetCode, derivedAssetCode, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, assetBlindRules, assetBuilderIssue, handleIssue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, derivedAssetCode, amount, assetBlindRules)];
            case 2:
                assetBuilderIssue = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilderIssue)];
            case 3:
                handleIssue = _a.sent();
                (0, utils_1.log)('Asset ', assetCode, ' issued, handle', handleIssue);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.issueCustomAsset = issueCustomAsset;
var barToAbarBalances = function (walletInfo, anonKeys, givenCommitments, balance, givenBalanceChange, assetCode, extraSpent) { return __awaiter(void 0, void 0, void 0, function () {
    var fraAssetCode, isFraCheck, balanceNew, balanceChangeF, realBalanceChange, expectedBalanceChange, expectedBarBalanceChange, barToBarFeeAmount, extraSpentAmount, message, anonBalances, anonBalUnspent, anonBalanceValue, realAnonBalanceValue, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 1:
                fraAssetCode = _a.sent();
                isFraCheck = fraAssetCode === assetCode;
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 2:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo, assetCode)];
            case 3:
                balanceNew = _a.sent();
                (0, utils_1.log)('Old BAR balance for public key ', walletInfo.address, ' is ', balance, " ".concat(assetCode));
                (0, utils_1.log)('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, " ".concat(assetCode));
                balanceChangeF = parseFloat(balance.replace(/,/g, '')) - parseFloat(balanceNew.replace(/,/g, ''));
                (0, utils_1.log)('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, " ".concat(assetCode));
                realBalanceChange = (0, bigNumber_1.create)((0, bigNumber_1.create)(balanceChangeF).toPrecision(7));
                expectedBalanceChange = (0, bigNumber_1.create)(givenBalanceChange);
                expectedBarBalanceChange = expectedBalanceChange.toPrecision(7);
                if (isFraCheck) {
                    barToBarFeeAmount = (0, bigNumber_1.create)('0.02');
                    extraSpentAmount = (0, bigNumber_1.create)(extraSpent || '0');
                    expectedBarBalanceChange = expectedBalanceChange
                        .plus(barToBarFeeAmount)
                        .plus(extraSpentAmount)
                        .toPrecision(7);
                }
                if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
                    message = "BAR balance of ".concat(realBalanceChange.toString(), " does not match expected value ").concat(expectedBarBalanceChange.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, givenCommitments)];
            case 4:
                anonBalances = _a.sent();
                anonBalUnspent = anonBalances.unSpentBalances.balances[0].amount;
                anonBalanceValue = anonBalUnspent.replace(/,/g, '');
                (0, utils_1.log)('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, " ".concat(assetCode));
                realAnonBalanceValue = (0, bigNumber_1.create)(anonBalanceValue);
                if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
                    message = "ABAR balance does not match expected value, real is ".concat(realAnonBalanceValue.toString(), " and expected is ").concat(expectedBalanceChange.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                return [2 /*return*/, true];
        }
    });
}); };
var validateSpent = function (AnonKeys, givenCommitments) { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, axfrKeyPair, _i, givenCommitments_1, givenCommitment, ownedAbarsResponse, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, AnonKeys);
                axfrKeyPair = anonKeys.axfrSpendKey;
                _i = 0, givenCommitments_1 = givenCommitments;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitments_1.length)) return [3 /*break*/, 6];
                givenCommitment = givenCommitments_1[_i];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 2:
                ownedAbarsResponse = _a.sent();
                ownedAbarItem = ownedAbarsResponse[0];
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, api_1.TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrKeyPair)];
            case 3:
                hash = _a.sent();
                return [4 /*yield*/, api_1.TripleMasking.isNullifierHashSpent(hash)];
            case 4:
                result = _a.sent();
                if (!result) {
                    throw new Error("hash for commitment ".concat(givenCommitment, " is still unspent"));
                }
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, true];
        }
    });
}); };
exports.validateSpent = validateSpent;
var getSidsForSingleAsset = function (senderOne, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var walletInfo, sids, utxoDataList, customAssetSids, _i, utxoDataList_1, utxoItem, utxoAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, utils_1.log)("//////////////// Get sids for asset ".concat(assetCode, " //////////////// "));
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(senderOne, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 2:
                sids = (_a.sent()).response;
                if (!sids) {
                    console.log('ERROR no sids available');
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sids)];
            case 3:
                utxoDataList = _a.sent();
                customAssetSids = [];
                for (_i = 0, utxoDataList_1 = utxoDataList; _i < utxoDataList_1.length; _i++) {
                    utxoItem = utxoDataList_1[_i];
                    utxoAsset = utxoItem['body']['asset_type'];
                    if (utxoAsset === assetCode) {
                        customAssetSids.push(utxoItem['sid']);
                    }
                }
                return [2 /*return*/, customAssetSids.sort(function (a, b) { return a - b; })];
        }
    });
}); };
exports.getSidsForSingleAsset = getSidsForSingleAsset;
// External Tests
var createTestBars = function (givenSenderOne, amount, iterations) {
    if (amount === void 0) { amount = '210'; }
    if (iterations === void 0) { iterations = 4; }
    return __awaiter(void 0, void 0, void 0, function () {
        var pkey, toPkeyMine, senderWalletInfo, formattedAmount, expectedBalance, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, i, transactionBuilder, resultHandle, assetBalance, cleanedBalanceValue, realBalance, isFunded, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, utils_1.log)('////////////////  Create Test Bars //////////////// ');
                    pkey = mainFaucet;
                    toPkeyMine = givenSenderOne;
                    if (!!givenSenderOne) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.createNewKeypair)()];
                case 1:
                    senderWalletInfo = _a.sent();
                    toPkeyMine = senderWalletInfo.privateStr;
                    _a.label = 2;
                case 2:
                    if (!toPkeyMine) {
                        throw new Error('Sender private key is not specified');
                    }
                    formattedAmount = (0, bigNumber_1.create)(amount);
                    expectedBalance = formattedAmount.multipliedBy(iterations);
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                case 3:
                    walletInfo = _a.sent();
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine, password)];
                case 4:
                    toWalletInfo = _a.sent();
                    return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
                case 5:
                    fraCode = _a.sent();
                    assetCode = fraCode;
                    assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < iterations)) return [3 /*break*/, 11];
                    return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, amount, assetCode, assetBlindRules)];
                case 7:
                    transactionBuilder = _a.sent();
                    return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
                case 8:
                    resultHandle = _a.sent();
                    (0, utils_1.log)('🚀 ~ createTestBars ~ send fra result handle!!', resultHandle);
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 6];
                case 11: return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, fraCode)];
                case 14:
                    assetBalance = _a.sent();
                    (0, utils_1.log)("\uD83D\uDE80 ~ createTestBars ~ \"".concat(fraCode, "\" assetBalance "), assetBalance);
                    cleanedBalanceValue = assetBalance.replace(/,/g, '');
                    (0, utils_1.log)('🚀 ~ createTestBars ~ cleanedBalanceValue', cleanedBalanceValue);
                    realBalance = (0, bigNumber_1.create)(cleanedBalanceValue);
                    (0, utils_1.log)('🚀 ~ createTestBars ~ realBalance', realBalance.toString());
                    (0, utils_1.log)('🚀 ~ createTestBars ~ expectedBalance', expectedBalance.toString());
                    isFunded = expectedBalance.isEqualTo(realBalance);
                    if (!isFunded) {
                        errorMessage = "Expected FRA balance is ".concat(expectedBalance.toString(), " but we have ").concat(realBalance.toString());
                        throw Error(errorMessage);
                    }
                    return [2 /*return*/, isFunded];
            }
        });
    });
};
exports.createTestBars = createTestBars;
var barToAbar = function (givenSenderOne, AnonKeys, givenSids, givenBalanceChange, givenAssetCode, isBalanceCheck) {
    if (isBalanceCheck === void 0) { isBalanceCheck = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonKeys, _a, _b, senderOne, senderWalletInfo, sids, balanceChange, walletInfo, weOnlyHaveSid, weOnlyHaveBalanceChange, weHaveUncomplete, assetCode, balance, fraSids, fraSid, _c, transactionBuilder, barToAbarData, usedSids, resultHandle, givenCommitments;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, utils_1.log)('////////////////  BAR To ABAR conversion //////////////// ');
                    if (!AnonKeys) return [3 /*break*/, 1];
                    _a = __assign({}, AnonKeys);
                    return [3 /*break*/, 3];
                case 1:
                    _b = [{}];
                    return [4 /*yield*/, (0, exports.getAnonKeys)()];
                case 2:
                    _a = __assign.apply(void 0, _b.concat([(_d.sent())]));
                    _d.label = 3;
                case 3:
                    anonKeys = _a;
                    senderOne = givenSenderOne;
                    if (!!givenSenderOne) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, exports.createNewKeypair)()];
                case 4:
                    senderWalletInfo = _d.sent();
                    senderOne = senderWalletInfo.privateStr;
                    _d.label = 5;
                case 5:
                    if (!senderOne) {
                        throw new Error('Sender private key is not specified');
                    }
                    sids = givenSids;
                    balanceChange = givenBalanceChange;
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(senderOne, password)];
                case 6:
                    walletInfo = _d.sent();
                    weOnlyHaveSid = givenSids && !givenBalanceChange;
                    weOnlyHaveBalanceChange = !givenSids && givenBalanceChange;
                    weHaveUncomplete = weOnlyHaveSid || weOnlyHaveBalanceChange;
                    if (weHaveUncomplete) {
                        throw new Error('either both SID and BALANCE CHANGE must be provided or none of them');
                    }
                    assetCode = givenAssetCode;
                    if (!!givenAssetCode) return [3 /*break*/, 8];
                    return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
                case 7:
                    assetCode = _d.sent();
                    _d.label = 8;
                case 8:
                    if (!assetCode) {
                        throw new Error('We dont have asset code and cant check the balance');
                    }
                    return [4 /*yield*/, api_1.Account.getBalance(walletInfo, assetCode)];
                case 9:
                    balance = _d.sent();
                    if (!(!givenSids && !givenBalanceChange)) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, exports.createTestBars)(senderOne, '10', 2)];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(senderOne, assetCode)];
                case 11:
                    fraSids = _d.sent();
                    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
                    fraSid = fraSids.sort(function (a, b) { return a - b; })[0];
                    sids = [fraSid];
                    (0, utils_1.log)('🚀 ~ sids to use ', sids);
                    balanceChange = '10';
                    (0, utils_1.log)('🚀 ~ balanceChange to use', balanceChange);
                    return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
                case 12:
                    balance = _d.sent();
                    _d.label = 13;
                case 13:
                    if (!sids || !balanceChange) {
                        throw new Error('no sid or balance change exist. cant perform bar to abar');
                    }
                    (0, utils_1.log)('🚀 ~ final balanceChange', balanceChange);
                    (0, utils_1.log)('🚀 ~ final sids ', sids);
                    return [4 /*yield*/, api_1.TripleMasking.barToAbar(walletInfo, sids, anonKeys.axfrPublicKey)];
                case 14:
                    _c = _d.sent(), transactionBuilder = _c.transactionBuilder, barToAbarData = _c.barToAbarData, usedSids = _c.sids;
                    (0, utils_1.log)('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
                    (0, utils_1.log)('🚀 ~ usedSids', usedSids.join(','));
                    return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
                case 15:
                    resultHandle = _d.sent();
                    (0, utils_1.log)('send bar to abar result handle!!', resultHandle);
                    givenCommitments = barToAbarData.commitments;
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
                case 16:
                    _d.sent();
                    if (!isBalanceCheck) return [3 /*break*/, 18];
                    return [4 /*yield*/, barToAbarBalances(walletInfo, anonKeys, givenCommitments, balance, balanceChange, assetCode)];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18: return [2 /*return*/, givenCommitments];
            }
        });
    });
};
exports.barToAbar = barToAbar;
var abarToAbar = function (givenAnonKeysReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var senderWalletInfo, senderOne, anonKeysSender, generatedAnonKeysReceiver, anonKeysReceiver, fraAssetCode, fraSids, fraSid, givenCommitmentsToTransfer, givenCommitmentsListSender, ownedAbarsResponseOne, ownedAbarToUseAsSource, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrievedCommitmentsListReceiver, _i, commitmentsMap_1, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver, balSender, balanceSender, balReceiver, balanceReceiver, expectedBalanceSender, expectedBalanceReceiver, realBalanceSender, realBalanceReceiver, message, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                (0, utils_1.log)('//////////////// Single Asset Anonymous Transfer (ABAR To ABAR) //////////////// ');
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 1:
                senderWalletInfo = _b.sent();
                senderOne = senderWalletInfo.privateStr;
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 2:
                anonKeysSender = _b.sent();
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 3:
                generatedAnonKeysReceiver = _b.sent();
                anonKeysReceiver = givenAnonKeysReceiver
                    ? __assign({}, givenAnonKeysReceiver) : __assign({}, generatedAnonKeysReceiver);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraAssetCode = _b.sent();
                return [4 /*yield*/, (0, exports.createTestBars)(senderOne, '10', 2)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(senderOne, fraAssetCode)];
            case 6:
                fraSids = _b.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
                fraSid = fraSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode)];
            case 7:
                givenCommitmentsToTransfer = _b.sent();
                (0, utils_1.log)('🚀 ~ abarToAbar ~ givenCommitmentsToTransfer', givenCommitmentsToTransfer);
                givenCommitmentsListSender = __spreadArray([], givenCommitmentsToTransfer, true);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0])];
            case 8:
                ownedAbarsResponseOne = _b.sent();
                ownedAbarToUseAsSource = ownedAbarsResponseOne[0];
                return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '8', [ownedAbarToUseAsSource])];
            case 9:
                _a = _b.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 10:
                resultHandle = _b.sent();
                (0, utils_1.log)('transfer abar result handle!!', resultHandle);
                (0, utils_1.log)("will wait for the next block and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 11:
                _b.sent();
                (0, utils_1.log)('//////////////// now checking balances ///////////////////\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrievedCommitmentsListReceiver = [];
                for (_i = 0, commitmentsMap_1 = commitmentsMap; _i < commitmentsMap_1.length; _i++) {
                    commitmentsMapEntry = commitmentsMap_1[_i];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrievedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                (0, utils_1.log)('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
                (0, utils_1.log)('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 12:
                balancesSender = _b.sent();
                (0, utils_1.log)('🚀 ~ abarToAbar ~ balancesSender', JSON.stringify(balancesSender, null, 2));
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver)];
            case 13:
                balancesReceiver = _b.sent();
                (0, utils_1.log)('🚀 ~ abarToAbar ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));
                balSender = balancesSender.balances[0].amount;
                console.log('🚀 ~ balSender', balSender);
                balanceSender = balSender.replace(/,/g, '');
                balReceiver = balancesReceiver.balances[0].amount;
                console.log('🚀 ~ balReceiver', balReceiver);
                balanceReceiver = balReceiver.replace(/,/g, '');
                expectedBalanceSender = (0, bigNumber_1.create)('1.2');
                expectedBalanceReceiver = (0, bigNumber_1.create)('8');
                realBalanceSender = (0, bigNumber_1.create)(balanceSender);
                realBalanceReceiver = (0, bigNumber_1.create)(balanceReceiver);
                if (!realBalanceSender.isEqualTo(expectedBalanceSender)) {
                    message = "sender ABAR balance ".concat(expectedBalanceSender.toString(), " does not match expected ").concat(realBalanceSender.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                if (!realBalanceReceiver.isEqualTo(expectedBalanceReceiver)) {
                    message = "receiver ABAR balance ".concat(expectedBalanceReceiver.toString(), " does not match expected ").concat(realBalanceReceiver.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                // it would throw an error if it is unspent
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToTransfer)];
            case 14:
                // it would throw an error if it is unspent
                _b.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbar = abarToAbar;
var abarToAbarMulti = function (givenAnonKeysReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, generatedAnonKeysReceiver, anonKeysReceiver, asset1Code, senderWalletInfo, fraAssetCode, senderOne, derivedAssetCode, customAssetSids, customAssetSid, givenCommitmentsToTransfer, fraSids, fraSid, givenCommitmentsToPayFee, givenCommitmentsListSender, balancesSenderBefore, additionalOwnedAbarItems, ownedAbarsResponseOne, ownedAbarToUseAsSource, _i, givenCommitmentsToPayFee_1, givenCommitmentToPayFee, ownedAbarsResponseFee, additionalOwnedAbarItem, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrievedCommitmentsListReceiver, _b, commitmentsMap_2, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, fraBalSend, fraBalanceSender, fraBalanceSenderConverted, minimumExpectedSenderFraBalance, message, senderCustomBalances, message, sendercustomSpent, customSpentSender, customBalanceSenderConverted, expectedSenderCustomBalance, message, balancesReceiver, customBalReceive, customBalanceReceiver, customBalanceReceiverConverted, expectedReceiverCustomBalance, message;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                (0, utils_1.log)('////////////////  Multi Asset Anon Transfer (abarToAbar) //////////////// ');
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                anonKeysSender = _e.sent();
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 2:
                generatedAnonKeysReceiver = _e.sent();
                anonKeysReceiver = givenAnonKeysReceiver
                    ? __assign({}, givenAnonKeysReceiver) : __assign({}, generatedAnonKeysReceiver);
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                asset1Code = _e.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 4:
                senderWalletInfo = _e.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 5:
                fraAssetCode = _e.sent();
                senderOne = senderWalletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(asset1Code)];
            case 6:
                derivedAssetCode = _e.sent();
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(senderOne, '10', 5)];
            case 7:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _e.sent();
                (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
                return [4 /*yield*/, (0, exports.defineCustomAsset)(senderOne, asset1Code)];
            case 8:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '10')];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '5')];
            case 10:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '20')];
            case 11:
                _e.sent();
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(senderOne, derivedAssetCode)];
            case 12:
                customAssetSids = _e.sent();
                (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
                customAssetSid = customAssetSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, [customAssetSid], '20', derivedAssetCode)];
            case 13:
                givenCommitmentsToTransfer = _e.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 14:
                _e.sent();
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(senderOne, fraAssetCode)];
            case 15:
                fraSids = _e.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
                fraSid = fraSids.sort(function (a, b) { return a - b; })[0];
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode)];
            case 16:
                givenCommitmentsToPayFee = _e.sent();
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ Given ABAR commitments To Transfer', givenCommitmentsToTransfer);
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ Given FRA ABAR Commitment', givenCommitmentsToPayFee);
                givenCommitmentsListSender = __spreadArray([givenCommitmentsToTransfer[0]], givenCommitmentsToPayFee, true);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 17:
                balancesSenderBefore = _e.sent();
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ balancesSenderBefore', JSON.stringify(balancesSenderBefore, null, 2));
                additionalOwnedAbarItems = [];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0])];
            case 18:
                ownedAbarsResponseOne = _e.sent();
                ownedAbarToUseAsSource = ownedAbarsResponseOne[0];
                additionalOwnedAbarItems.push(ownedAbarToUseAsSource);
                _i = 0, givenCommitmentsToPayFee_1 = givenCommitmentsToPayFee;
                _e.label = 19;
            case 19:
                if (!(_i < givenCommitmentsToPayFee_1.length)) return [3 /*break*/, 22];
                givenCommitmentToPayFee = givenCommitmentsToPayFee_1[_i];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentToPayFee)];
            case 20:
                ownedAbarsResponseFee = _e.sent();
                additionalOwnedAbarItem = ownedAbarsResponseFee[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _e.label = 21;
            case 21:
                _i++;
                return [3 /*break*/, 19];
            case 22: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '2', additionalOwnedAbarItems)];
            case 23:
                _a = _e.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 24:
                resultHandle = _e.sent();
                (0, utils_1.log)('transfer abar result handle!!', resultHandle);
                (0, utils_1.log)("will wait for the next block and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 25:
                _e.sent();
                (0, utils_1.log)('////////////////////// now checking balances///////////////////// \n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrievedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_2 = commitmentsMap; _b < commitmentsMap_2.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_2[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrievedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ givenCommitmentsListSender', givenCommitmentsListSender);
                (0, utils_1.log)('////////////////// checking sender balances ///////////////////////');
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 26:
                balancesSender = _e.sent();
                (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ balancesSender', JSON.stringify(balancesSender, null, 2));
                fraBalSend = balancesSender.balances[0].amount;
                fraBalanceSender = fraBalSend.replace(/,/g, '');
                console.log('🚀 ~ abarToAbarMulti ~ fraBalanceSender', fraBalanceSender);
                fraBalanceSenderConverted = (0, bigNumber_1.create)(fraBalanceSender);
                minimumExpectedSenderFraBalance = (0, bigNumber_1.create)('8.8');
                if (!fraBalanceSenderConverted.isGreaterThanOrEqualTo(minimumExpectedSenderFraBalance)) {
                    message = 'Sender FRA ABAR balance does not match expected value';
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitmentsToTransfer)];
            case 27:
                senderCustomBalances = _e.sent();
                console.log('🚀 ~ abarToAbarMulti ~ senderCustomBalances', JSON.stringify(senderCustomBalances, null, 2));
                if (!((_d = (_c = senderCustomBalances === null || senderCustomBalances === void 0 ? void 0 : senderCustomBalances.spentBalances) === null || _c === void 0 ? void 0 : _c.balances) === null || _d === void 0 ? void 0 : _d.length)) {
                    message = 'No ABAR spent balances available';
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                sendercustomSpent = senderCustomBalances.spentBalances.balances[0].amount;
                console.log('🚀 ~ abarToAbarMulti  ~ sendercustomSpent', sendercustomSpent);
                customSpentSender = sendercustomSpent.replace(/,/g, '');
                console.log('🚀 ~ abarToAbarMulti ~ customSpentSender', customSpentSender);
                customBalanceSenderConverted = (0, bigNumber_1.create)(customSpentSender);
                expectedSenderCustomBalance = (0, bigNumber_1.create)('20');
                if (!customBalanceSenderConverted.isEqualTo(expectedSenderCustomBalance)) {
                    message = 'ABAR balances does not match expected value';
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                (0, utils_1.log)('////////////////// checking receiver balances ///////////////////////');
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver)];
            case 28:
                balancesReceiver = _e.sent();
                (0, utils_1.log)('🚀 ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));
                customBalReceive = balancesReceiver.balances[0].amount;
                customBalanceReceiver = customBalReceive.replace(/,/g, '');
                customBalanceReceiverConverted = (0, bigNumber_1.create)(customBalanceReceiver);
                expectedReceiverCustomBalance = (0, bigNumber_1.create)('2');
                if (!customBalanceReceiverConverted.isEqualTo(expectedReceiverCustomBalance)) {
                    message = 'Receiver custom balance does not match expected value';
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                (0, utils_1.log)('////////////////// checking spent validation ///////////////////////');
                // it would throw an error if it is unspent
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToTransfer)];
            case 29:
                // it would throw an error if it is unspent
                _e.sent();
                // it would throw an error if it is unspent
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToPayFee)];
            case 30:
                // it would throw an error if it is unspent
                _e.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbarMulti = abarToAbarMulti;
var abarToAbarFraMultipleFraAtxoForFeeSendAmount = function (givenAnonKeysReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var generatedAnonKeysReceiver, anonKeysReceiver, anonKeysSender, senderWalletInfo, pkey, fraAssetCode, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour, fraAssetCommitmentsList, givenCommitmentsListSender, assetCodeToUse, amountToSend, payload, totalExpectedFee, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _i, commitmentsMap_3, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesReceiverAfter, receiverExpectedFraAbarBalanceTransfer, fraAbarAmountAfterTransfer, realReceiverFraAbarBalance, isReceiverHasProperFraBalanceAfter, balancesSenderAfter, senderExpectedFraAbarBalanceTransfer, fraAbarAmountAfterTransferSender, realSenderFraAbarBalanceAfter, isSenderHasProperFraBalanceAfter;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                generatedAnonKeysReceiver = _d.sent();
                anonKeysReceiver = givenAnonKeysReceiver
                    ? __assign({}, givenAnonKeysReceiver) : __assign({}, generatedAnonKeysReceiver);
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 2:
                anonKeysSender = _d.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 3:
                senderWalletInfo = _d.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraAssetCode = _d.sent();
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 5)];
            case 5:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _d.sent();
                (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 6:
                fraAssetSids = _d.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2], fAssetSidFour = fraAssetSids[3];
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
                    fraAssetCode)];
            case 7:
                fraAssetCommitmentsList = _d.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 8:
                _d.sent();
                givenCommitmentsListSender = __spreadArray([], fraAssetCommitmentsList, true);
                (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to abar //////////////');
                assetCodeToUse = fraAssetCode;
                amountToSend = '23.15';
                return [4 /*yield*/, api_1.TripleMasking.getAbarToAbarAmountPayload(anonKeysSender, anonKeysReceiver.axfrPublicKey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 9:
                payload = _d.sent();
                totalExpectedFee = payload.additionalAmountForFee;
                (0, utils_1.log)('totalExpectedFee for abar to abar', totalExpectedFee);
                return [4 /*yield*/, api_1.TripleMasking.abarToAbarAmount(anonKeysSender, anonKeysReceiver.axfrPublicKey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 10:
                _a = _d.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 11:
                resultHandle = _d.sent();
                (0, utils_1.log)('transfer abar result handle!!', resultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 12:
                _d.sent();
                (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_i = 0, commitmentsMap_3 = commitmentsMap; _i < commitmentsMap_3.length; _i++) {
                    commitmentsMapEntry = commitmentsMap_3[_i];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 13:
                balancesReceiverAfter = _d.sent();
                (0, utils_1.log)('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));
                receiverExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)(amountToSend);
                fraAbarAmountAfterTransfer = (_b = balancesReceiverAfter === null || balancesReceiverAfter === void 0 ? void 0 : balancesReceiverAfter.balances.find(function (element) { return element.assetType === assetCodeToUse; })) === null || _b === void 0 ? void 0 : _b.amount;
                if (!fraAbarAmountAfterTransfer) {
                    throw new Error("Receiver is expected to have ".concat(receiverExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(fraAbarAmountAfterTransfer, "'"));
                }
                realReceiverFraAbarBalance = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
                isReceiverHasProperFraBalanceAfter = realReceiverFraAbarBalance.isEqualTo(receiverExpectedFraAbarBalanceTransfer);
                if (!isReceiverHasProperFraBalanceAfter) {
                    throw new Error("Receiver is expected to have ".concat(receiverExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(realReceiverFraAbarBalance.toString(), "'"));
                }
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 14:
                balancesSenderAfter = _d.sent();
                (0, utils_1.log)('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));
                senderExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)('15.65');
                fraAbarAmountAfterTransferSender = (_c = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === assetCodeToUse; })) === null || _c === void 0 ? void 0 : _c.amount;
                if (!fraAbarAmountAfterTransferSender) {
                    throw new Error("Sender is expected to have ".concat(senderExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(fraAbarAmountAfterTransferSender, "'"));
                }
                realSenderFraAbarBalanceAfter = (0, bigNumber_1.create)(fraAbarAmountAfterTransferSender);
                isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(senderExpectedFraAbarBalanceTransfer);
                if (!isSenderHasProperFraBalanceAfter) {
                    throw new Error("Sender is expected to have at least ".concat(senderExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(realSenderFraAbarBalanceAfter.toString(), "'"));
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbarFraMultipleFraAtxoForFeeSendAmount = abarToAbarFraMultipleFraAtxoForFeeSendAmount;
var abarToAbarCustomMultipleFraAtxoForFeeSendAmount = function (givenAnonKeysReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var generatedAnonKeysReceiver, anonKeysReceiver, anonKeysSender, senderWalletInfo, pkey, assetCode, derivedAssetCode, fraAssetCode, assetCodeToUse, expectedSenderBalance, assetBalance, realSenderBalance, isSenderFunded, errorMessage, customAssetSids, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour, expectedFraBalanceAfterBarToAbar, fraAssetCommitmentsList, givenCommitmentsListSender, amountToSend, payload, totalExpectedFee, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _i, commitmentsMap_4, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesReceiverAfter, receiverExpectedCustomAbarBalanceTransfer, customAbarAmountAfterTransfer, realReceiverCustomAbarBalance, isReceiverHasProperCustomBalanceAfter, balancesSenderAfter, senderExpectedFraAbarBalanceTransfer, fraAbarAmountAfterTransferSender, realSenderFraAbarBalanceAfter, isSenderHasProperFraBalanceAfter, senderExpectedCustomAbarBalanceTransfer, customAbarAmountAfterTransferSender, realSenderCustomAbarBalanceAfter, isSenderHasProperCustomBalanceAfter;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                generatedAnonKeysReceiver = _e.sent();
                anonKeysReceiver = givenAnonKeysReceiver
                    ? __assign({}, givenAnonKeysReceiver) : __assign({}, generatedAnonKeysReceiver);
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 2:
                anonKeysSender = _e.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 3:
                senderWalletInfo = _e.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 4:
                assetCode = _e.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 5:
                derivedAssetCode = _e.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 6:
                fraAssetCode = _e.sent();
                assetCodeToUse = derivedAssetCode;
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 5)];
            case 7:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _e.sent();
                (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
                return [4 /*yield*/, (0, exports.defineCustomAsset)(pkey, assetCode)];
            case 8:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '10')];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '5')];
            case 10:
                _e.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '20')];
            case 11:
                _e.sent();
                expectedSenderBalance = (0, bigNumber_1.create)('35');
                return [4 /*yield*/, api_1.Account.getBalance(senderWalletInfo, assetCodeToUse)];
            case 12:
                assetBalance = _e.sent();
                (0, utils_1.log)("sender bar \"".concat(assetCodeToUse, "\" assetBalance before transfer (after issuing the asset)"), assetBalance);
                realSenderBalance = (0, bigNumber_1.create)(assetBalance);
                isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);
                if (!isSenderFunded) {
                    errorMessage = "Expected bar ".concat(assetCodeToUse, " balance is ").concat(expectedSenderBalance.toString(), " but it has ").concat(realSenderBalance.toString());
                    throw Error(errorMessage);
                }
                (0, utils_1.log)('//////////////// bar to abar custom asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, assetCodeToUse)];
            case 13:
                customAssetSids = _e.sent();
                (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, __spreadArray([], customAssetSids, true), '35', derivedAssetCode)];
            case 14:
                customAssetCommitmentsList = _e.sent();
                (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 15:
                fraAssetSids = _e.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2], fAssetSidFour = fraAssetSids[3];
                expectedFraBalanceAfterBarToAbar = '40';
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], expectedFraBalanceAfterBarToAbar, fraAssetCode)];
            case 16:
                fraAssetCommitmentsList = _e.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 17:
                _e.sent();
                givenCommitmentsListSender = __spreadArray(__spreadArray([], customAssetCommitmentsList, true), fraAssetCommitmentsList, true);
                (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to abar //////////////');
                amountToSend = '22.14';
                return [4 /*yield*/, api_1.TripleMasking.getAbarToAbarAmountPayload(anonKeysSender, anonKeysReceiver.axfrPublicKey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 18:
                payload = _e.sent();
                totalExpectedFee = payload.additionalAmountForFee;
                (0, utils_1.log)('totalExpectedFee for abar to abar', totalExpectedFee);
                return [4 /*yield*/, api_1.TripleMasking.abarToAbarAmount(anonKeysSender, anonKeysReceiver.axfrPublicKey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 19:
                _a = _e.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 20:
                resultHandle = _e.sent();
                (0, utils_1.log)('transfer abar result handle!!', resultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 21:
                _e.sent();
                (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_i = 0, commitmentsMap_4 = commitmentsMap; _i < commitmentsMap_4.length; _i++) {
                    commitmentsMapEntry = commitmentsMap_4[_i];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 22:
                balancesReceiverAfter = _e.sent();
                (0, utils_1.log)('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));
                receiverExpectedCustomAbarBalanceTransfer = (0, bigNumber_1.create)(amountToSend);
                customAbarAmountAfterTransfer = (_b = balancesReceiverAfter === null || balancesReceiverAfter === void 0 ? void 0 : balancesReceiverAfter.balances.find(function (element) { return element.assetType === assetCodeToUse; })) === null || _b === void 0 ? void 0 : _b.amount;
                if (!customAbarAmountAfterTransfer) {
                    throw new Error("Receiver is expected to have ".concat(receiverExpectedCustomAbarBalanceTransfer.toString(), " ABAR custom but it has '").concat(customAbarAmountAfterTransfer, "'"));
                }
                realReceiverCustomAbarBalance = (0, bigNumber_1.create)(customAbarAmountAfterTransfer);
                isReceiverHasProperCustomBalanceAfter = realReceiverCustomAbarBalance.isEqualTo(receiverExpectedCustomAbarBalanceTransfer);
                if (!isReceiverHasProperCustomBalanceAfter) {
                    throw new Error("Receiver is expected to have ".concat(receiverExpectedCustomAbarBalanceTransfer.toString(), " ABAR custom but it has '").concat(realReceiverCustomAbarBalance.toString(), "'"));
                }
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 23:
                balancesSenderAfter = _e.sent();
                (0, utils_1.log)('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));
                senderExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)('38.5');
                fraAbarAmountAfterTransferSender = (_c = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === fraAssetCode; })) === null || _c === void 0 ? void 0 : _c.amount;
                if (!fraAbarAmountAfterTransferSender) {
                    throw new Error("Sender is expected to have ".concat(senderExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(fraAbarAmountAfterTransferSender, "'"));
                }
                realSenderFraAbarBalanceAfter = (0, bigNumber_1.create)(fraAbarAmountAfterTransferSender);
                isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(senderExpectedFraAbarBalanceTransfer);
                if (!isSenderHasProperFraBalanceAfter) {
                    throw new Error("Sender is expected to have at least ".concat(senderExpectedFraAbarBalanceTransfer.toString(), " ABAR FRA but it has '").concat(realSenderFraAbarBalanceAfter.toString(), "'"));
                }
                senderExpectedCustomAbarBalanceTransfer = (0, bigNumber_1.create)('12.86');
                customAbarAmountAfterTransferSender = (_d = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === assetCodeToUse; })) === null || _d === void 0 ? void 0 : _d.amount;
                if (!customAbarAmountAfterTransferSender) {
                    throw new Error("Sender is expected to have ".concat(senderExpectedCustomAbarBalanceTransfer.toString(), " custom ABAR but it has '").concat(customAbarAmountAfterTransferSender, "'"));
                }
                realSenderCustomAbarBalanceAfter = (0, bigNumber_1.create)(customAbarAmountAfterTransferSender);
                isSenderHasProperCustomBalanceAfter = realSenderCustomAbarBalanceAfter.isEqualTo(senderExpectedCustomAbarBalanceTransfer);
                if (!isSenderHasProperCustomBalanceAfter) {
                    throw new Error("Sender is expected to have ".concat(senderExpectedCustomAbarBalanceTransfer.toString(), " custom ABAR but it has '").concat(realSenderCustomAbarBalanceAfter.toString(), "'"));
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbarCustomMultipleFraAtxoForFeeSendAmount = abarToAbarCustomMultipleFraAtxoForFeeSendAmount;
var abarToBar = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, senderWalletInfo, pkey, fraAssetCode, walletInfo, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, givenCommitments, givenCommitment, givenCommitmentOne, balance, ownedAbarsResponse, ownedAbarToUseAsSource, ownedAbarsResponseOne, ownedAbarToUseAsSourceOne, transactionBuilder, resultHandle, balanceNew, balanceChangeF, givenBalanceChange, realBalanceChange, expectedBalanceChange, expectedBarBalanceChange, message, anonBalances, err, anonBalSpent, anonBalanceValue, realAnonBalanceValue, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                (0, utils_1.log)('//////////////// ABAR To BAR conversion //////////////// ');
                return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                anonKeysSender = _c.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 2:
                senderWalletInfo = _c.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraAssetCode = _c.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 4:
                walletInfo = _c.sent();
                // we create 4 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 4)];
            case 5:
                // we create 4 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 6:
                fraAssetSids = _c.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2];
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree], '30', fraAssetCode)];
            case 7:
                givenCommitments = _c.sent();
                console.log('🚀 ~ givenCommitments', givenCommitments);
                givenCommitment = givenCommitments[0], givenCommitmentOne = givenCommitments[1];
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 8:
                balance = _c.sent();
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 9:
                ownedAbarsResponse = _c.sent();
                ownedAbarToUseAsSource = ownedAbarsResponse[0];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentOne)];
            case 10:
                ownedAbarsResponseOne = _c.sent();
                ownedAbarToUseAsSourceOne = ownedAbarsResponseOne[0];
                (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);
                (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSourceOne', ownedAbarToUseAsSourceOne);
                return [4 /*yield*/, api_1.TripleMasking.abarToBar(anonKeysSender, walletInfo.publickey, [
                        ownedAbarToUseAsSource,
                        ownedAbarToUseAsSourceOne,
                    ])];
            case 11:
                transactionBuilder = (_c.sent()).transactionBuilder;
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 12:
                resultHandle = _c.sent();
                (0, utils_1.log)('abar to bar result handle!!!', resultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 13:
                _c.sent();
                (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 14:
                balanceNew = _c.sent();
                (0, utils_1.log)('Old BAR balance for public key: ', walletInfo.address, ' is ', balance, ' FRA');
                (0, utils_1.log)('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
                balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
                (0, utils_1.log)('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');
                givenBalanceChange = '20';
                realBalanceChange = (0, bigNumber_1.create)((0, bigNumber_1.create)(balanceChangeF).toPrecision(7));
                expectedBalanceChange = (0, bigNumber_1.create)(givenBalanceChange);
                expectedBarBalanceChange = expectedBalanceChange;
                if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
                    message = "BAR balance of ".concat(realBalanceChange.toString(), " does not match expected value ").concat(expectedBarBalanceChange.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitments)];
            case 15:
                anonBalances = _c.sent();
                (0, utils_1.log)('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
                if (!((_b = (_a = anonBalances === null || anonBalances === void 0 ? void 0 : anonBalances.spentBalances) === null || _a === void 0 ? void 0 : _a.balances) === null || _b === void 0 ? void 0 : _b.length)) {
                    err = 'ERROR No ABAR spent balances available';
                    (0, utils_1.log)(err);
                    throw new Error(err);
                }
                anonBalSpent = anonBalances.spentBalances.balances[0].amount;
                anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);
                realAnonBalanceValue = (0, bigNumber_1.create)(anonBalanceValue);
                if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
                    message = "ABAR balance does not match expected value, real is ".concat(realAnonBalanceValue.toString(), " and expected is ").concat(expectedBalanceChange.toString());
                    (0, utils_1.log)(message);
                    throw new Error(message);
                }
                // it would throw an error if it is unspent
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, [givenCommitment, givenCommitmentOne])];
            case 16:
                // it would throw an error if it is unspent
                _c.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToBar = abarToBar;
var abarToBarCustomSendAmount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, senderWalletInfo, pkey, toWalletInfo, assetCode, derivedAssetCode, senderOne, fraAssetCode, assetCodeToUse, expectedSenderBalance, assetBalance, realSenderBalance, isSenderFunded, errorMessage, customAssetSids, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour, fraAssetCommitmentsList, givenCommitmentsListSender, amountToSend, assetBalanceBeforeAbarToBar, receiverAssetBalanceBeforeTransfer, isReceiverHasEmptyAssetBalanceBeforeTransfer, _a, transactionBuilder, remainderCommitements, spentCommitments, resultHandle, balancesSenderAfter, expectedFraAbarMinimumAmountAfterTransfer, expectedCustomAbarAmountAfterTransfer, fraAbarAmountAfterTransfer, customAbarAmountAfterTransfer, senderAssetBalanceAfterTransfer, isSenderHasProperAssetBalanceAfterTransfer, senderFraBalanceAfterTransfer, isSenderHasProperFraBalanceAfterTransfer, assetBalanceAfterAbarToBar, receiverAssetBalanceAfterTransfer, isReceiverHasProperAssetBalanceBeforeTransfer;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                anonKeysSender = _d.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 2:
                senderWalletInfo = _d.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 3:
                toWalletInfo = _d.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 4:
                assetCode = _d.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 5:
                derivedAssetCode = _d.sent();
                senderOne = pkey;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 6:
                fraAssetCode = _d.sent();
                assetCodeToUse = derivedAssetCode;
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 5)];
            case 7:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _d.sent();
                (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
                return [4 /*yield*/, (0, exports.defineCustomAsset)(senderOne, assetCode)];
            case 8:
                _d.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '10')];
            case 9:
                _d.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '5')];
            case 10:
                _d.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '20')];
            case 11:
                _d.sent();
                expectedSenderBalance = (0, bigNumber_1.create)('35');
                return [4 /*yield*/, api_1.Account.getBalance(senderWalletInfo, assetCodeToUse)];
            case 12:
                assetBalance = _d.sent();
                (0, utils_1.log)("sender bar \"".concat(assetCodeToUse, "\" assetBalance before transfer (after issuing the asset)"), assetBalance);
                realSenderBalance = (0, bigNumber_1.create)(assetBalance);
                isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);
                if (!isSenderFunded) {
                    errorMessage = "Expected bar ".concat(assetCodeToUse, " balance is ").concat(expectedSenderBalance.toString(), " but it has ").concat(realSenderBalance.toString());
                    throw Error(errorMessage);
                }
                (0, utils_1.log)('//////////////// bar to abar custom asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, assetCodeToUse)];
            case 13:
                customAssetSids = _d.sent();
                (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, customAssetSids, '35', derivedAssetCode)];
            case 14:
                customAssetCommitmentsList = _d.sent();
                (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 15:
                fraAssetSids = _d.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2], fAssetSidFour = fraAssetSids[3];
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', fraAssetCode)];
            case 16:
                fraAssetCommitmentsList = _d.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 17:
                _d.sent();
                givenCommitmentsListSender = __spreadArray(__spreadArray([], customAssetCommitmentsList, true), fraAssetCommitmentsList, true);
                (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to bar //////////////');
                amountToSend = '12.15';
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, assetCodeToUse)];
            case 18:
                assetBalanceBeforeAbarToBar = _d.sent();
                receiverAssetBalanceBeforeTransfer = (0, bigNumber_1.create)(assetBalanceBeforeAbarToBar);
                isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo((0, bigNumber_1.create)('0'));
                if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
                    throw new Error("Receiver must have 0 balance of the asset but it has ".concat(receiverAssetBalanceBeforeTransfer.toString()));
                }
                return [4 /*yield*/, api_1.TripleMasking.abarToBarAmount(anonKeysSender, toWalletInfo.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 19:
                _a = _d.sent(), transactionBuilder = _a.transactionBuilder, remainderCommitements = _a.remainderCommitements, spentCommitments = _a.spentCommitments;
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 20:
                resultHandle = _d.sent();
                (0, utils_1.log)('abar to bar result handle!!', resultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(4)];
            case 21:
                _d.sent();
                (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, __spreadArray(__spreadArray([], givenCommitmentsListSender, true), remainderCommitements, true))];
            case 22:
                balancesSenderAfter = _d.sent();
                (0, utils_1.log)('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));
                expectedFraAbarMinimumAmountAfterTransfer = (0, bigNumber_1.create)('38');
                expectedCustomAbarAmountAfterTransfer = (0, bigNumber_1.create)('22.85');
                fraAbarAmountAfterTransfer = (_b = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === fraAssetCode; })) === null || _b === void 0 ? void 0 : _b.amount;
                if (!fraAbarAmountAfterTransfer) {
                    throw new Error("Sender is expected to have ".concat(expectedFraAbarMinimumAmountAfterTransfer.toString(), " ABAR FRA but it has '").concat(fraAbarAmountAfterTransfer, "'"));
                }
                customAbarAmountAfterTransfer = (_c = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === assetCodeToUse; })) === null || _c === void 0 ? void 0 : _c.amount;
                if (!customAbarAmountAfterTransfer) {
                    throw new Error("Sender is expected to have ".concat(expectedCustomAbarAmountAfterTransfer.toString(), " ABAR custom asset but it has '").concat(customAbarAmountAfterTransfer, "'"));
                }
                senderAssetBalanceAfterTransfer = (0, bigNumber_1.create)(customAbarAmountAfterTransfer);
                isSenderHasProperAssetBalanceAfterTransfer = senderAssetBalanceAfterTransfer.isEqualTo(expectedCustomAbarAmountAfterTransfer);
                if (!isSenderHasProperAssetBalanceAfterTransfer) {
                    throw new Error("Sender must have 22.5 balance of the asset but it has ".concat(senderAssetBalanceAfterTransfer.toString()));
                }
                senderFraBalanceAfterTransfer = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
                isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(expectedFraAbarMinimumAmountAfterTransfer);
                if (!isSenderHasProperFraBalanceAfterTransfer) {
                    throw new Error("Sender must have at least ".concat(expectedFraAbarMinimumAmountAfterTransfer.toString(), " balance but it has ").concat(senderFraBalanceAfterTransfer.toString()));
                }
                (0, utils_1.log)('//////////// checking receiver bar balance //////////');
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, assetCodeToUse)];
            case 23:
                assetBalanceAfterAbarToBar = _d.sent();
                (0, utils_1.log)('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);
                receiverAssetBalanceAfterTransfer = (0, bigNumber_1.create)(assetBalanceAfterAbarToBar);
                isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo((0, bigNumber_1.create)(amountToSend));
                if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
                    throw new Error("Receiver must have ".concat(amountToSend, " balance of the asset but it has ").concat(receiverAssetBalanceAfterTransfer.toString()));
                }
                (0, utils_1.log)('🚀 ~ spentCommitments', spentCommitments);
                (0, utils_1.log)('🚀 ~ remainderCommitements', remainderCommitements);
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToBarCustomSendAmount = abarToBarCustomSendAmount;
var abarToBarFraSendAmount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, senderWalletInfo, pkey, toWalletInfo, fraAssetCode, assetCodeToUse, assetBalance, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour, fraAssetCommitmentsList, givenCommitmentsListSender, amountToSend, assetBalanceBeforeAbarToBar, receiverAssetBalanceBeforeTransfer, isReceiverHasEmptyAssetBalanceBeforeTransfer, _a, transactionBuilder, remainderCommitements, spentCommitments, resultHandle, balancesSenderAfter, expectedFraAbarMinimumAmountAfterTransfer, fraAbarAmountAfterTransfer, senderFraBalanceAfterTransfer, isSenderHasProperFraBalanceAfterTransfer, assetBalanceAfterAbarToBar, receiverAssetBalanceAfterTransfer, isReceiverHasProperAssetBalanceBeforeTransfer;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                anonKeysSender = _c.sent();
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 2:
                senderWalletInfo = _c.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 3:
                toWalletInfo = _c.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraAssetCode = _c.sent();
                assetCodeToUse = fraAssetCode;
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 5)];
            case 5:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _c.sent();
                return [4 /*yield*/, api_1.Account.getBalance(senderWalletInfo, fraAssetCode)];
            case 6:
                assetBalance = _c.sent();
                (0, utils_1.log)("sender bar \"".concat(assetCodeToUse, "\" assetBalance before transfer"), assetBalance);
                (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 7:
                fraAssetSids = _c.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2], fAssetSidFour = fraAssetSids[3];
                return [4 /*yield*/, (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
                    fraAssetCode)];
            case 8:
                fraAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 9:
                _c.sent();
                givenCommitmentsListSender = __spreadArray([], fraAssetCommitmentsList, true);
                (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to bar //////////////');
                amountToSend = '2.16';
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, assetCodeToUse)];
            case 10:
                assetBalanceBeforeAbarToBar = _c.sent();
                receiverAssetBalanceBeforeTransfer = (0, bigNumber_1.create)(assetBalanceBeforeAbarToBar);
                isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo((0, bigNumber_1.create)('0'));
                if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
                    throw new Error("Receiver must have 0 balance of the asset but it has ".concat(receiverAssetBalanceBeforeTransfer.toString()));
                }
                return [4 /*yield*/, api_1.TripleMasking.abarToBarAmount(anonKeysSender, toWalletInfo.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender)];
            case 11:
                _a = _c.sent(), transactionBuilder = _a.transactionBuilder, remainderCommitements = _a.remainderCommitements, spentCommitments = _a.spentCommitments;
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 12:
                resultHandle = _c.sent();
                console.log('abar to bar result handle!!', resultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 13:
                _c.sent();
                console.log('/////////////////// now checking balances //////////// \n\n\n ');
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, __spreadArray(__spreadArray([], givenCommitmentsListSender, true), remainderCommitements, true))];
            case 14:
                balancesSenderAfter = _c.sent();
                (0, utils_1.log)('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));
                expectedFraAbarMinimumAmountAfterTransfer = (0, bigNumber_1.create)('36.69');
                fraAbarAmountAfterTransfer = (_b = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(function (element) { return element.assetType === fraAssetCode; })) === null || _b === void 0 ? void 0 : _b.amount;
                if (!fraAbarAmountAfterTransfer) {
                    throw new Error("Sender is expected to have ".concat(expectedFraAbarMinimumAmountAfterTransfer.toString(), " ABAR FRA but it has '").concat(fraAbarAmountAfterTransfer, "'"));
                }
                senderFraBalanceAfterTransfer = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
                isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(expectedFraAbarMinimumAmountAfterTransfer);
                if (!isSenderHasProperFraBalanceAfterTransfer) {
                    throw new Error("Sender must have at least ".concat(expectedFraAbarMinimumAmountAfterTransfer.toString(), " balance but it has ").concat(senderFraBalanceAfterTransfer.toString()));
                }
                (0, utils_1.log)('//////////// checking receiver bar balance //////////');
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, assetCodeToUse)];
            case 15:
                assetBalanceAfterAbarToBar = _c.sent();
                (0, utils_1.log)('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);
                receiverAssetBalanceAfterTransfer = (0, bigNumber_1.create)(assetBalanceAfterAbarToBar);
                isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo((0, bigNumber_1.create)(amountToSend));
                if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
                    throw new Error("Receiver must have ".concat(amountToSend, " balance of the asset but it has ").concat(receiverAssetBalanceAfterTransfer.toString()));
                }
                (0, utils_1.log)('🚀 ~ spentCommitments', spentCommitments);
                (0, utils_1.log)('🚀 ~ remainderCommitements', remainderCommitements);
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToBarFraSendAmount = abarToBarFraSendAmount;
var barToAbarAmount = function (givenAnonKeysReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var generatedAnonKeysReceiver, anonKeysReceiver, senderWalletInfo, pkey, fraAssetCode, fraAssetSids, amount, balance, _a, transactionBuilder, barToAbarData, usedSids, resultHandle, givenCommitments, minimalFeeForBarToBar, extraSpent;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, exports.getAnonKeys)()];
            case 1:
                generatedAnonKeysReceiver = _b.sent();
                anonKeysReceiver = givenAnonKeysReceiver
                    ? __assign({}, givenAnonKeysReceiver) : __assign({}, generatedAnonKeysReceiver);
                return [4 /*yield*/, (0, exports.createNewKeypair)()];
            case 2:
                senderWalletInfo = _b.sent();
                pkey = senderWalletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraAssetCode = _b.sent();
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                return [4 /*yield*/, (0, exports.createTestBars)(pkey, '10', 5)];
            case 4:
                // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
                _b.sent();
                (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
                return [4 /*yield*/, (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode)];
            case 5:
                fraAssetSids = _b.sent();
                (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
                amount = '35';
                return [4 /*yield*/, api_1.Account.getBalance(senderWalletInfo)];
            case 6:
                balance = _b.sent();
                console.log('🚀 ~ balance', balance);
                return [4 /*yield*/, api_1.TripleMasking.barToAbarAmount(senderWalletInfo, amount, fraAssetCode, anonKeysReceiver.axfrPublicKey)];
            case 7:
                _a = _b.sent(), transactionBuilder = _a.transactionBuilder, barToAbarData = _a.barToAbarData, usedSids = _a.sids;
                (0, utils_1.log)('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
                (0, utils_1.log)('🚀 ~ usedSids', usedSids.join(','));
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 8:
                resultHandle = _b.sent();
                (0, utils_1.log)('send bar to abar result handle!!', resultHandle);
                givenCommitments = barToAbarData.commitments;
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 9:
                _b.sent();
                minimalFeeForBarToBar = '0.01';
                extraSpent = minimalFeeForBarToBar;
                return [4 /*yield*/, barToAbarBalances(senderWalletInfo, anonKeysReceiver, givenCommitments, balance, amount, fraAssetCode, extraSpent)];
            case 10:
                _b.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.barToAbarAmount = barToAbarAmount;
//# sourceMappingURL=tripleMasking.integration.js.map