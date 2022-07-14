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
exports.getRandomAssetCode = exports.abarToAbarMulti = exports.createTestBarsMulti = exports.abarToBar = exports.abarToAbar = exports.barToAbar = exports.validateSpent = exports.getAnonKeys = exports.createTestBars = exports.createNewKeypair = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var api_1 = require("../api");
var Sdk_1 = __importDefault(require("../Sdk"));
var providers_1 = require("../services/cacheStore/providers");
var utxoHelper_1 = require("../services/utxoHelper");
dotenv_1.default.config();
var envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? "../../.env_tm_integration_".concat(process.env.INTEGRATION_ENV_NAME)
    : "../../.env_example";
var envConfig = require("".concat(envConfigFile, ".json"));
var walletKeys = envConfig.keys, envHostUrl = envConfig.hostUrl;
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    hostUrl: envHostUrl,
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
var waitingTimeBeforeCheckTxStatus = 19000;
console.log('🚀 ~ Findora Sdk is configured to use:', sdkEnv);
console.log("Connecting to \"".concat(sdkEnv.hostUrl, "\""));
Sdk_1.default.init(sdkEnv);
var mainFaucet = walletKeys.mainFaucet;
var password = 'yourSecretPassword';
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
                console.log('new wallet info', walletInfo);
                return [2 /*return*/, walletInfo];
        }
    });
}); };
exports.createNewKeypair = createNewKeypair;
/**
 * Create FRA Test BARs for Single Asset Integration Test
 */
var createTestBars = function (senderOne) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkeyMine, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, i, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  Create Test Bars //////////////// ');
                pkey = mainFaucet;
                toPkeyMine = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < 4)) return [3 /*break*/, 9];
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '210', assetCode, assetBlindRules)];
            case 5:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 6:
                resultHandle = _a.sent();
                console.log('send fra result handle!!', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 4];
            case 9: return [2 /*return*/, true];
        }
    });
}); };
exports.createTestBars = createTestBars;
/**
 * Generate and return new set of Anon Keys
 */
var getAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var myAnonKeys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('//////////////// Generate Anon Keys //////////////// ');
                return [4 /*yield*/, api_1.TripleMasking.genAnonKeys()];
            case 1:
                myAnonKeys = _a.sent();
                console.log('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
                return [2 /*return*/, myAnonKeys];
        }
    });
}); };
exports.getAnonKeys = getAnonKeys;
/**
 * Balance check for BAR to ABAR conversion Integration Test
 */
var barToAbarBalances = function (walletInfo, anonKeys, givenCommitment, balance) { return __awaiter(void 0, void 0, void 0, function () {
    var balanceNew, balanceChangeF, balanceChange, anonBalances, anonBalUnspent, anonBalanceValue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 1:
                balanceNew = _a.sent();
                console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
                console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
                balanceChangeF = parseFloat(balance.replace(/,/g, '')) - parseFloat(balanceNew.replace(/,/g, ''));
                balanceChange = Math.floor(balanceChangeF);
                console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');
                if (balanceChange != 210) {
                    console.log('BAR balance does not match expected value');
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment])];
            case 2:
                anonBalances = _a.sent();
                anonBalUnspent = anonBalances.unSpentBalances.balances[0].amount;
                anonBalanceValue = parseInt(anonBalUnspent.replace(/,/g, ''), 10);
                console.log('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, ' FRA');
                if (anonBalanceValue != 210 && anonBalanceValue != 209) {
                    console.log('ABAR balance does not match expected value');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
/**
 * Given a commitment, check if nullifier is spent
 */
var validateSpent = function (AnonKeys, givenCommitment) { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, axfrKeyPair, ownedAbarsResponse, ownedAbarItem, abarData, atxoSid, ownedAbar, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, AnonKeys);
                axfrKeyPair = anonKeys.axfrSpendKey;
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 1:
                ownedAbarsResponse = _a.sent();
                ownedAbarItem = ownedAbarsResponse[0];
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, api_1.TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrKeyPair)];
            case 2:
                hash = _a.sent();
                return [4 /*yield*/, api_1.TripleMasking.isNullifierHashSpent(hash)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.validateSpent = validateSpent;
/**
 * BAR to ABAR conversion
 */
var barToAbar = function (senderOne, AnonKeys, isBalanceCheck, givenSid) {
    if (givenSid === void 0) { givenSid = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var pkey, walletInfo, balance, sid, sidsResult, sids, sortedSids, anonKeys, _a, transactionBuilder, barToAbarData, usedSid, resultHandle, givenCommitment, ownedAbarsResponse, ownedAbarsSaveResult, balanceResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('////////////////  BAR To ABAR conversion //////////////// ');
                    pkey = senderOne;
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                case 1:
                    walletInfo = _b.sent();
                    return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
                case 2:
                    balance = _b.sent();
                    sid = givenSid;
                    if (!(givenSid === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
                case 3:
                    sidsResult = _b.sent();
                    sids = sidsResult.response;
                    if (!sids) {
                        console.log('ERROR no sids available');
                        return [2 /*return*/, false];
                    }
                    sortedSids = sids.sort(function (a, b) { return b - a; });
                    console.log('🚀 ~ barToAbar ~ sortedSids', sortedSids);
                    sid = sortedSids[0];
                    _b.label = 4;
                case 4:
                    anonKeys = __assign({}, AnonKeys);
                    return [4 /*yield*/, api_1.TripleMasking.barToAbar(walletInfo, sid, anonKeys)];
                case 5:
                    _a = _b.sent(), transactionBuilder = _a.transactionBuilder, barToAbarData = _a.barToAbarData, usedSid = _a.sid;
                    console.log('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
                    console.log('🚀 ~ usedSid', usedSid);
                    return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
                case 6:
                    resultHandle = _b.sent();
                    console.log('send bar to abar result handle!!', resultHandle);
                    givenCommitment = barToAbarData.commitments[0];
                    return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
                case 8:
                    ownedAbarsResponse = _b.sent();
                    console.log('🚀 ~ barToAbar ~ ownedAbarsResponse', JSON.stringify(ownedAbarsResponse, null, 2));
                    return [4 /*yield*/, api_1.TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbarsResponse)];
                case 9:
                    ownedAbarsSaveResult = _b.sent();
                    console.log('🚀 ~ barToAbar ~ ownedAbarsSaveResult', ownedAbarsSaveResult);
                    if (!isBalanceCheck) return [3 /*break*/, 11];
                    return [4 /*yield*/, barToAbarBalances(walletInfo, anonKeys, givenCommitment, balance)];
                case 10:
                    balanceResult = _b.sent();
                    if (!balanceResult) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 11: return [2 /*return*/, givenCommitment];
            }
        });
    });
};
exports.barToAbar = barToAbar;
/**
 * Single Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
var abarToAbar = function (senderOne, AnonKeys1, AnonKeys2) { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, givenCommitmentToTransfer, givenCommitmentsListSender, ownedAbarsResponseOne, ownedAbarToUseAsSource, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrievedCommitmentsListReceiver, _i, commitmentsMap_1, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver, balSender, balanceSender, balReceiver, balanceReceiver, isNullifierHashSpent;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('//////////////// Single Asset Anonymous Transfer (ABAR To ABAR) //////////////// ');
                anonKeysSender = __assign({}, AnonKeys1);
                anonKeysReceiver = __assign({}, AnonKeys2);
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, false)];
            case 1:
                givenCommitmentToTransfer = (_b.sent());
                console.log('🚀 ~ abarToAbar ~ givenCommitmentToTransfer', givenCommitmentToTransfer);
                givenCommitmentsListSender = [givenCommitmentToTransfer];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentToTransfer)];
            case 2:
                ownedAbarsResponseOne = _b.sent();
                ownedAbarToUseAsSource = ownedAbarsResponseOne[0];
                return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver, '50', ownedAbarToUseAsSource)];
            case 3:
                _a = _b.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                console.log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 4:
                resultHandle = _b.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for ".concat(waitingTimeBeforeCheckTxStatus, "ms and then check balances for both sender and receiver commitments"));
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 5:
                _b.sent();
                console.log('now checking balances\n\n\n');
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
                console.log('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
                console.log('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 6:
                balancesSender = _b.sent();
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver)];
            case 7:
                balancesReceiver = _b.sent();
                balSender = balancesSender.balances[0].amount;
                balanceSender = parseInt(balSender.replace(/,/g, ''), 10);
                balReceiver = balancesReceiver.balances[0].amount;
                balanceReceiver = parseInt(balReceiver.replace(/,/g, ''), 10);
                if (balanceSender != 158 || balanceReceiver != 50) {
                    console.log('ABAR balances does not match expected value');
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentToTransfer)];
            case 8:
                isNullifierHashSpent = _b.sent();
                if (!isNullifierHashSpent) {
                    console.log('Nullifier hash of sender still unspent');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbar = abarToAbar;
/**
 * ABAR To BAR conversion Integration Test for FRA
 */
var abarToBar = function (senderOne, AnonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, anonKeysSender, givenCommitment, balance, ownedAbarsResponse, ownedAbarToUseAsSource, _a, transactionBuilder, abarToBarData, receiverWalletInfo, resultHandle, balanceNew, balanceChangeF, balanceChange, anonBalances, anonBalSpent, anonBalanceValue, isNullifierHashSpent;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('//////////////// ABAR To BAR conversion //////////////// ');
                pkey = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _d.sent();
                anonKeysSender = __assign({}, AnonKeys);
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, false)];
            case 2:
                givenCommitment = (_d.sent());
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 3:
                balance = _d.sent();
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 4:
                ownedAbarsResponse = _d.sent();
                ownedAbarToUseAsSource = ownedAbarsResponse[0];
                return [4 /*yield*/, api_1.TripleMasking.abarToBar(anonKeysSender, walletInfo, ownedAbarToUseAsSource)];
            case 5:
                _a = _d.sent(), transactionBuilder = _a.transactionBuilder, abarToBarData = _a.abarToBarData, receiverWalletInfo = _a.receiverWalletInfo;
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 6:
                resultHandle = _d.sent();
                console.log('abar to bar result handle!!!', resultHandle);
                // Check BAR and ABAR balances, and nullifier spending
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                // Check BAR and ABAR balances, and nullifier spending
                _d.sent();
                console.log('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ' FRA');
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 8:
                balanceNew = _d.sent();
                console.log('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
                balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
                balanceChange = Math.floor(balanceChangeF);
                console.log('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');
                if (balanceChange != 209 && balanceChange != 210) {
                    console.log('ERROR BAR balance does not match expected value', balanceChange);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeysSender, [givenCommitment])];
            case 9:
                anonBalances = _d.sent();
                console.log('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
                if (!((_c = (_b = anonBalances === null || anonBalances === void 0 ? void 0 : anonBalances.spentBalances) === null || _b === void 0 ? void 0 : _b.balances) === null || _c === void 0 ? void 0 : _c.length)) {
                    console.log('ERROR No ABAR spent balances available');
                    return [2 /*return*/, false];
                }
                anonBalSpent = anonBalances.spentBalances.balances[0].amount;
                anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);
                if (anonBalanceValue != 210 && anonBalanceValue != 209) {
                    console.log('ERROR ABAR balance does not match expected value');
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitment)];
            case 10:
                isNullifierHashSpent = _d.sent();
                if (!isNullifierHashSpent) {
                    console.log('ERROR Nullifier hash of sender still unspent');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToBar = abarToBar;
/**
 * Define and Issue a custom asset
 */
var defineIssueCustomAsset = function (senderOne, assetCode, derivedAssetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, assetBuilder, handle, assetBlindRules, assetBuilderIssue, handleIssue;
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
                console.log('New asset ', assetCode, ' created, handle', handle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 4:
                _a.sent();
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, derivedAssetCode, '1000', assetBlindRules)];
            case 5:
                assetBuilderIssue = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilderIssue)];
            case 6:
                handleIssue = _a.sent();
                console.log('Asset ', assetCode, ' issued, handle', handleIssue);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get available SIDs for a given custom asset and FRA
 */
var getSidsForAsset = function (senderOne, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var walletInfo, fraCode, sids, sidsResult, utxoDataList, fraSids, customAssetSids, _i, utxoDataList_1, utxoItem, utxoAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(senderOne, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 3:
                sids = (_a.sent()).response;
                sidsResult = sids;
                if (!sidsResult) {
                    console.log('ERROR no sids available');
                    return [2 /*return*/, [[], []]];
                }
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sidsResult)];
            case 4:
                utxoDataList = _a.sent();
                fraSids = [];
                customAssetSids = [];
                for (_i = 0, utxoDataList_1 = utxoDataList; _i < utxoDataList_1.length; _i++) {
                    utxoItem = utxoDataList_1[_i];
                    utxoAsset = utxoItem['body']['asset_type'];
                    if (utxoAsset === fraCode) {
                        fraSids.push(utxoItem['sid']);
                    }
                    if (utxoAsset === assetCode) {
                        customAssetSids.push(utxoItem['sid']);
                    }
                }
                console.log('FRA Sids: ', fraSids, '; Custom Asset Sids: ', customAssetSids);
                return [2 /*return*/, [fraSids, customAssetSids]];
        }
    });
}); };
/**
 * Create FRA Test BARs and Issue Custom Asset for Multi Asset Integration Test
 */
var createTestBarsMulti = function (senderOne, asset1Code, derivedAsset1Code) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkeyMine, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, transactionBuilder, resultHandle, balance1Old, balance1New, balance1ChangeF, balance1Change;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('//////////////// Issue Custom Asset and Create Test Bars //////////////// ');
                pkey = mainFaucet;
                toPkeyMine = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '210', assetCode, assetBlindRules)];
            case 4:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 5:
                resultHandle = _a.sent();
                console.log('send fra result handle!!', resultHandle);
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, derivedAsset1Code)];
            case 6:
                balance1Old = _a.sent();
                return [4 /*yield*/, defineIssueCustomAsset(senderOne, asset1Code, derivedAsset1Code)];
            case 7:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, derivedAsset1Code)];
            case 8:
                balance1New = _a.sent();
                balance1ChangeF = parseFloat(balance1New.replace(/,/g, '')) - parseFloat(balance1Old.replace(/,/g, ''));
                balance1Change = Math.floor(balance1ChangeF);
                console.log('Custom Asset1 Old Balance = ', balance1Old, '; Custom Asset1 New Balance = ', balance1New, '; Custom Asset1 Balance Change = ', balance1ChangeF);
                if (balance1Change != 1000) {
                    console.log('Custom Asset BAR balance does not match expected value');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.createTestBarsMulti = createTestBarsMulti;
/**
 * Multi/Custom Asset Anonymous Transfer (ABAR To ABAR) Integration Test
 */
var abarToAbarMulti = function (senderOne, AnonKeys1, AnonKeys2, asset1Code) { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, _a, _fraSids, customAssetSids, customAssetSid, givenCommitmentToTransfer, _b, fraSids, _customAssetSids, fraSid, givenCommitmentsToPayFee, givenCommitmentsListSender, additionalOwnedAbarItems, ownedAbarsResponseOne, ownedAbarToUseAsSource, _i, givenCommitmentsToPayFee_1, givenCommitmentToPayFee, ownedAbarsResponseFee, additionalOwnedAbarItem, _c, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrievedCommitmentsListReceiver, _d, commitmentsMap_2, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver, fraBalSend, fraBalanceSender, customBalReceive, customBalanceReceiver, senderCustomBalances, sendercustomSpent, customSpentSender, isNullifierHashSpent, isFraNullifierHashSpent;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                console.log('////////////////  Multi Asset Anon Transfer (abarToAbar) //////////////// ');
                anonKeysSender = __assign({}, AnonKeys1);
                anonKeysReceiver = __assign({}, AnonKeys2);
                return [4 /*yield*/, getSidsForAsset(senderOne, asset1Code)];
            case 1:
                _a = _g.sent(), _fraSids = _a[0], customAssetSids = _a[1];
                customAssetSid = customAssetSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, false, customAssetSid)];
            case 2:
                givenCommitmentToTransfer = (_g.sent());
                return [4 /*yield*/, getSidsForAsset(senderOne, asset1Code)];
            case 3:
                _b = _g.sent(), fraSids = _b[0], _customAssetSids = _b[1];
                fraSid = fraSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, (0, exports.barToAbar)(senderOne, anonKeysSender, false, fraSid)];
            case 4:
                givenCommitmentsToPayFee = [(_g.sent())];
                console.log('🚀 ~ abarToAbar ~ Given ABAR commitment To Transfer', givenCommitmentToTransfer);
                console.log('🚀 ~ abarToAbar ~ Given FRA ABAR Commitment', givenCommitmentsToPayFee);
                givenCommitmentsListSender = __spreadArray([givenCommitmentToTransfer], givenCommitmentsToPayFee, true);
                additionalOwnedAbarItems = [];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentToTransfer)];
            case 5:
                ownedAbarsResponseOne = _g.sent();
                ownedAbarToUseAsSource = ownedAbarsResponseOne[0];
                _i = 0, givenCommitmentsToPayFee_1 = givenCommitmentsToPayFee;
                _g.label = 6;
            case 6:
                if (!(_i < givenCommitmentsToPayFee_1.length)) return [3 /*break*/, 9];
                givenCommitmentToPayFee = givenCommitmentsToPayFee_1[_i];
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentToPayFee)];
            case 7:
                ownedAbarsResponseFee = _g.sent();
                additionalOwnedAbarItem = ownedAbarsResponseFee[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _g.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver, '1000', ownedAbarToUseAsSource, additionalOwnedAbarItems)];
            case 10:
                _c = _g.sent(), anonTransferOperationBuilder = _c.anonTransferOperationBuilder, abarToAbarData = _c.abarToAbarData;
                console.log('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 11:
                resultHandle = _g.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for ".concat(waitingTimeBeforeCheckTxStatus, "ms and then check balances for both sender and receiver commitments"));
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 12:
                _g.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrievedCommitmentsListReceiver = [];
                for (_d = 0, commitmentsMap_2 = commitmentsMap; _d < commitmentsMap_2.length; _d++) {
                    commitmentsMapEntry = commitmentsMap_2[_d];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrievedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
                console.log('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 13:
                balancesSender = _g.sent();
                console.log('🚀 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver)];
            case 14:
                balancesReceiver = _g.sent();
                console.log('🚀 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                fraBalSend = balancesSender.balances[0].amount;
                fraBalanceSender = parseInt(fraBalSend.replace(/,/g, ''), 10);
                customBalReceive = balancesReceiver.balances[0].amount;
                customBalanceReceiver = parseInt(customBalReceive.replace(/,/g, ''), 10);
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeysSender, [
                        givenCommitmentToTransfer,
                    ])];
            case 15:
                senderCustomBalances = _g.sent();
                console.log('🚀 Custom Asset spent balances for sender after transfer', senderCustomBalances.spentBalances);
                if (!((_f = (_e = senderCustomBalances === null || senderCustomBalances === void 0 ? void 0 : senderCustomBalances.spentBalances) === null || _e === void 0 ? void 0 : _e.balances) === null || _f === void 0 ? void 0 : _f.length)) {
                    console.log('No ABAR spent balances available');
                    return [2 /*return*/, false];
                }
                sendercustomSpent = senderCustomBalances.spentBalances.balances[0].amount;
                customSpentSender = parseInt(sendercustomSpent.replace(/,/g, ''), 10);
                if (customSpentSender != 1000 || customBalanceReceiver != 1000) {
                    console.log('ABAR balances does not match expected value');
                    return [2 /*return*/, false];
                }
                if (fraBalanceSender != 209 && fraBalanceSender != 208) {
                    console.log('Sender FRA ABAR balance does not match expected value');
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentToTransfer)];
            case 16:
                isNullifierHashSpent = _g.sent();
                if (!isNullifierHashSpent) {
                    console.log('Custom Asset Nullifier hash of sender still unspent');
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToPayFee[0])];
            case 17:
                isFraNullifierHashSpent = _g.sent();
                if (!isFraNullifierHashSpent) {
                    console.log('FRA Nullifier hash of sender still unspent');
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.abarToAbarMulti = abarToAbarMulti;
var getRandomAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, asset1Code, derivedAsset1Code;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                _a = _b.sent(), asset1Code = _a[0], derivedAsset1Code = _a[1];
                return [2 /*return*/, [asset1Code, derivedAsset1Code]];
        }
    });
}); };
exports.getRandomAssetCode = getRandomAssetCode;
//# sourceMappingURL=tripleMasking.integration.js.map