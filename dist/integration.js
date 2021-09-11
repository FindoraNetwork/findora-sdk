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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delegateFraTransactionAndClaimRewards = exports.delegateFraTransactionSubmit = exports.issueAndSendConfidentialAsset = exports.getBalance = exports.sendFraToMultipleReceiversTransactionSubmit = exports.sendFraTransactionSubmit = exports.defineIssueAndSendAssetTransactionSubmit = exports.defineAndIssueAssetTransactionSubmit = exports.defineAssetTransactionSubmit = exports.defineAssetTransaction = exports.keystoreUsage = void 0;
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber = __importStar(require("./services/bigNumber"));
var api_1 = require("./api");
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var providers_1 = require("./services/cacheStore/providers");
var envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? "../.env_" + process.env.INTEGRATION_ENV_NAME
    : "../env_example";
var envConfig = require(envConfigFile + ".json");
var walletKeys = envConfig.keys, envHostUrl = envConfig.hostUrl;
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    hostUrl: envHostUrl,
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
var waitingTimeBeforeCheckTxStatus = 18000;
console.log('🚀 ~ file: integration.ts ~ line 31 ~ Findora Sdk is configured to use:', sdkEnv);
Sdk_1.default.init(sdkEnv);
var mainFaucet = walletKeys.mainFaucet, senderOne = walletKeys.senderOne, senderTwo = walletKeys.senderTwo, receiverOne = walletKeys.receiverOne, receiverTwo = walletKeys.receiverTwo;
var password = 'yourSecretPassword';
var keystoreUsage = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, true];
    });
}); };
exports.keystoreUsage = keystoreUsage;
var defineAssetTransaction = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, tokenCode, memo, assetBuilder, submitData, operation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  defineAssetTransaction //////////////// ');
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 2:
                tokenCode = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 42 ~ defineAssetTransaction ~ assetCode', tokenCode);
                memo = 'this is a test asset';
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode, memo)];
            case 3:
                assetBuilder = _a.sent();
                submitData = assetBuilder.transaction();
                try {
                    operation = JSON.parse(submitData).body.operations[0];
                    return [2 /*return*/, 'DefineAsset' in operation];
                }
                catch (error) {
                    console.log('Error!', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.defineAssetTransaction = defineAssetTransaction;
var defineAssetTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, tokenCode, assetBuilder, handle, transactionStatus, defineTransactionResponse, Committed, txnSID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  defineAssetTransactionSubmit //////////////// ');
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 2:
                tokenCode = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 76 ~ defineAssetTransactionSubmit ~ tokenCode', tokenCode);
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode)];
            case 3:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 4:
                handle = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 81 ~ defineAssetTransactionSubmit ~ handle', handle);
                console.log('🚀 ~ file: integration.ts ~ line 82 ~ defineAssetTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 5:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handle)];
            case 6:
                transactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 87 ~ defineAssetTransactionSubmit ~ Retrieved transaction status response:', transactionStatus);
                defineTransactionResponse = transactionStatus.response;
                if (!defineTransactionResponse) {
                    return [2 /*return*/, false];
                }
                Committed = defineTransactionResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 106 ~ defineAssetTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 105 ~ defineAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handle + ". Response was:", transactionStatus);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineAssetTransactionSubmit = defineAssetTransactionSubmit;
var defineAndIssueAssetTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, tokenCode, assetRules, memo, assetBuilder, handle, transactionStatus, defineTransactionResponse, Committed, txnSID, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, issueTransactionStatus, issueTransactionResponse, IssueCommitted, issueTxnSID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  defineAndIssueAssetTransactionSubmit //////////////// ');
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 2:
                tokenCode = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 128 ~ defineAndIssueAssetTransactionSubmit ~ tokenCode', tokenCode);
                assetRules = {
                    transferable: false,
                    updatable: true,
                    decimals: 6,
                };
                memo = 'this is a test asset';
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules)];
            case 3:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 4:
                handle = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 145 ~ defineAndIssueAssetTransactionSubmit ~ handle', handle);
                console.log('🚀 ~ file: integration.ts ~ line 147 ~ defineAndIssueAssetTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 5:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handle)];
            case 6:
                transactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 152 ~ defineAndIssueAssetTransactionSubmit ~ transactionStatus', transactionStatus);
                defineTransactionResponse = transactionStatus.response;
                if (!defineTransactionResponse) {
                    return [2 /*return*/, false];
                }
                Committed = defineTransactionResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 167 ~ defineAndIssueAssetTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 172 ~ defineAndIssueAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handle + ". Response was:", transactionStatus);
                    return [2 /*return*/, false];
                }
                inputNumbers = '5';
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, tokenCode, inputNumbers, assetBlindRules)];
            case 7:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 8:
                handleIssue = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 192 ~ defineAndIssueAssetTransactionSubmit ~ handleIssue', handleIssue);
                console.log('🚀 ~ file: integration.ts ~ line 193 ~ defineAndIssueAssetTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 9:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleIssue)];
            case 10:
                issueTransactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 200 ~ defineAndIssueAssetTransactionSubmit ~ issueTransactionStatus', issueTransactionStatus);
                issueTransactionResponse = issueTransactionStatus.response;
                if (!issueTransactionResponse) {
                    return [2 /*return*/, false];
                }
                IssueCommitted = issueTransactionResponse.Committed;
                if (!Array.isArray(IssueCommitted)) {
                    return [2 /*return*/, false];
                }
                issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 216 ~ defineAndIssueAssetTransactionSubmit ~ issueTxnSID', issueTxnSID);
                if (!issueTxnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 222 ~ defineAndIssueAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handleIssue + ". Response was:", issueTransactionStatus);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineAndIssueAssetTransactionSubmit = defineAndIssueAssetTransactionSubmit;
var defineIssueAndSendAssetTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkey, walletInfo, toWalletInfo, tokenCode, assetRules, memo, assetBuilder, handle, transactionStatus, defineResponse, Committed, txnSID, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, issueTransactionStatus, issueResponse, IssueCommitted, issueTxnSID, assetBlindRulesForSend, sendTransactionBuilder, handleSend, sendTransactionStatus, sendResponse, SendCommitted, sendTxnSID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  defineIssueAndSendAssetTransactionSubmit //////////////// ');
                pkey = mainFaucet;
                toPkey = receiverOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                tokenCode = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 243 ~ defineIssueAndSendAssetTransactionSubmit ~ tokenCode', tokenCode);
                assetRules = {
                    transferable: false,
                    updatable: true,
                    decimals: 6,
                };
                memo = 'this is a test asset';
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules)];
            case 4:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 5:
                handle = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 256 ~ defineIssueAndSendAssetTransactionSubmit ~ handle', handle);
                console.log('🚀 ~ file: integration.ts ~ line 257 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 6:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handle)];
            case 7:
                transactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 262 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieved transaction status response', transactionStatus);
                defineResponse = transactionStatus.response;
                if (!defineResponse) {
                    return [2 /*return*/, false];
                }
                Committed = defineResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 278 ~ defineIssueAndSendAssetTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 281 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                inputNumbers = 5;
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, tokenCode, "" + inputNumbers, assetBlindRules)];
            case 8:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 9:
                handleIssue = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 315 ~ defineIssueAndSendAssetTransactionSubmit ~ handleIssue', handleIssue);
                console.log('🚀 ~ file: integration.ts ~ line 316 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 10:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleIssue)];
            case 11:
                issueTransactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 321 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieved transaction status response:');
                issueResponse = issueTransactionStatus.response;
                if (!issueResponse) {
                    return [2 /*return*/, false];
                }
                IssueCommitted = issueResponse.Committed;
                if (!Array.isArray(IssueCommitted)) {
                    return [2 /*return*/, false];
                }
                issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 336 ~ defineIssueAndSendAssetTransactionSubmit ~ issueTxnSID', issueTxnSID);
                if (!issueTxnSID) {
                    console.log("~ file: integration.ts ~ line 340 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handleIssue + ". Response was: ", issueTransactionStatus);
                    return [2 /*return*/, false];
                }
                assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, "" + inputNumbers / 2, tokenCode, assetBlindRulesForSend)];
            case 12:
                sendTransactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(sendTransactionBuilder)];
            case 13:
                handleSend = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 357 ~ defineIssueAndSendAssetTransactionSubmit ~ handleSend', handleSend);
                console.log('🚀 ~ file: integration.ts ~ line 357 ~ defineIssueAndSendAssetTransactionSubmit ~ Retrieving transaction status..');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 14:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleSend)];
            case 15:
                sendTransactionStatus = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 363 ~ defineIssueAndSendAssetTransactionSubmit ~ sendTransactionStatus', sendTransactionStatus);
                sendResponse = sendTransactionStatus.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                SendCommitted = sendResponse.Committed;
                if (!Array.isArray(SendCommitted)) {
                    return [2 /*return*/, false];
                }
                sendTxnSID = SendCommitted && Array.isArray(SendCommitted) ? SendCommitted[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 378 ~ defineIssueAndSendAssetTransactionSubmit ~ sendTxnSID', sendTxnSID);
                if (!sendTxnSID) {
                    console.log("\"\uD83D\uDE80 ~ file: integration.ts ~ line 382 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not retrieve the transaction with a handle " + handleSend + ". Response was: ", sendTransactionStatus);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineIssueAndSendAssetTransactionSubmit = defineIssueAndSendAssetTransactionSubmit;
var sendFraTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, toWalletInfo, receiverBalanceBeforeTransfer, assetBlindRules, numbers, assetCode, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, receiverBalanceAfterTransfer, isItRight, peterCheckResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  sendFraTransactionSubmit //////////////// ');
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 3:
                receiverBalanceBeforeTransfer = _a.sent();
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                numbers = '0.1';
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                assetCode = _a.sent();
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbers, assetCode, assetBlindRules)];
            case 5:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 6:
                resultHandle = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 446 ~ sendFraTransactionSubmit ~ resultHandle', resultHandle);
                console.log('🚀 ~ file: integration.ts ~ line 446 ~ sendFraTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 8:
                transactionStatus = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatus);
                sendResponse = transactionStatus.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 472 ~ sendFraTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ sendFraTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 9:
                receiverBalanceAfterTransfer = _a.sent();
                isItRight = receiverBalanceBeforeTransfer === '0.000000' && receiverBalanceAfterTransfer === '0.100000';
                peterCheckResult = "Peter balance should be 0.100000 and now it is " + receiverBalanceAfterTransfer + ", so this is \"" + isItRight + "\" ";
                console.log('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);
                return [2 /*return*/, isItRight];
        }
    });
}); };
exports.sendFraTransactionSubmit = sendFraTransactionSubmit;
var sendFraToMultipleReceiversTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, aliceWalletInfo, petereWalletInfo, aliceBalanceBeforeTransfer, peterBalanceBeforeTransfer, assetBlindRules, numbersForAlice, numbersForPeter, assetCode, recieversInfo, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, aliceBalanceAfterTransfer, peterBalanceAfterTransfer, isItRightAlice, isItRightPeter, aliceCheckResult, peterCheckResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = mainFaucet;
                console.log('////////////////  sendFraToMultipleReceiversTransactionSubmit //////////////// ');
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 2:
                aliceWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 3:
                petereWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(aliceWalletInfo)];
            case 4:
                aliceBalanceBeforeTransfer = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(petereWalletInfo)];
            case 5:
                peterBalanceBeforeTransfer = _a.sent();
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                numbersForAlice = '0.1';
                numbersForPeter = '0.2';
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 6:
                assetCode = _a.sent();
                recieversInfo = [
                    { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
                    { reciverWalletInfo: petereWalletInfo, amount: numbersForPeter },
                ];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules)];
            case 7:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 8:
                resultHandle = _a.sent();
                console.log('🚀 ~ file: integration.ts ~ line 536 ~ sendFraToMultipleReceiversTransactionSubmit ~ resultHandle', resultHandle);
                console.log('🚀 ~ file: integration.ts ~ line 540 ~ sendFraToMultipleReceiversTransactionSubmit ~ Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 9:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 10:
                transactionStatus = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatus);
                console.log('🚀 ~ file: integration.ts ~ line 549 ~ sendFraToMultipleReceiversTransactionSubmit ~ transactionStatus', transactionStatus);
                sendResponse = transactionStatus.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: integration.ts ~ line 568 ~ sendFraToMultipleReceiversTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 574 ~ sendFraToMultipleReceiversTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalance(aliceWalletInfo)];
            case 11:
                aliceBalanceAfterTransfer = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(petereWalletInfo)];
            case 12:
                peterBalanceAfterTransfer = _a.sent();
                isItRightAlice = aliceBalanceBeforeTransfer === '0.000000' && aliceBalanceAfterTransfer === '0.100000';
                isItRightPeter = peterBalanceBeforeTransfer === '0.000000' && peterBalanceAfterTransfer === '0.200000';
                aliceCheckResult = "Alice balance should be 0.100000 and now it is " + aliceBalanceAfterTransfer + ", so this is \"" + isItRightAlice + "\" ";
                peterCheckResult = "Peter balance should be 0.200000 and now it is " + peterBalanceAfterTransfer + ", so this is \"" + isItRightPeter + "\" ";
                console.log('🚀 ~ file: integration.ts ~ line 597 ~ sendFraToMultipleReceiversTransactionSubmit ~ aliceCheckResult', aliceCheckResult);
                console.log('🚀 ~ file: integration.ts ~ line 602 ~ sendFraToMultipleReceiversTransactionSubmit ~ peterCheckResult', peterCheckResult);
                return [2 /*return*/, isItRightAlice && isItRightPeter];
        }
    });
}); };
exports.sendFraToMultipleReceiversTransactionSubmit = sendFraToMultipleReceiversTransactionSubmit;
var getBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  getBalance //////////////// ');
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 2:
                balance = _a.sent();
                return [2 /*return*/, parseFloat(balance) > 0];
        }
    });
}); };
exports.getBalance = getBalance;
var issueAndSendConfidentialAsset = function () { return __awaiter(void 0, void 0, void 0, function () {
    var Ledger, pkey, toPkey, walletInfo, toWalletInfo, aliceKeyPair, bobKeyPair, tokenCode, assetRules, memo, assetBuilder, handle, transactionStatus, defineResponse, Committed, txnSID, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, issueTransactionStatus, issueResponse, IssueCommitted, issueTxnSID, confSid, nonConfSid, confUtxoResponse, nonConfUtxoResponse, confUtxo, nonConfUtxo, isNonConfidentialMatches, isConfidentiaExists, ownerMemoDataResult, ownerMemoJson, ownerMemo, assetRecord, decryptedRecord, isDecryptedRecordCorrect, transferAmount, numbersForPeter, assetBlindRulesForSend, recieversInfo, sendTransactionBuilder, handleSend, sendTransactionStatus, sendResponse, SendCommitted, sendTxnSID, bobTxoSidsResult, bobTxoSids, newSid, bobUtxoDataResult, bobUtxoResponse, bobMemoDataResult, bobMemoJson, bobOwnerMemo, bobAssetRecord, bobDecryptedRecord, isBobDecryptedRecordCorrect, isAssetTypeCorrect;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  issueAndSendConfidentialAsset //////////////// ');
                return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                Ledger = _a.sent();
                pkey = mainFaucet;
                toPkey = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 3:
                toWalletInfo = _a.sent();
                aliceKeyPair = walletInfo.keypair;
                bobKeyPair = toWalletInfo.keypair;
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 4:
                tokenCode = _a.sent();
                console.log('Defining a custom asset:', tokenCode);
                assetRules = {
                    transferable: false,
                    updatable: true,
                    decimals: 6,
                };
                memo = 'this is a test asset';
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules)];
            case 5:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 6:
                handle = _a.sent();
                console.log('Define Asset Transaction handle:', handle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handle)];
            case 8:
                transactionStatus = _a.sent();
                defineResponse = transactionStatus.response;
                if (!defineResponse) {
                    console.log('ERROR could not get defineResponse, line 657');
                    return [2 /*return*/, false];
                }
                Committed = defineResponse.Committed;
                if (!Array.isArray(Committed)) {
                    console.log('ERROR could not get Commited from defineResponse, line 664');
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                if (!txnSID) {
                    console.log("Could not retrieve the transaction with a handle " + handle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                inputNumbers = '5';
                assetBlindRules = { isAmountBlind: true };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, tokenCode, inputNumbers, assetBlindRules)];
            case 9:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 10:
                handleIssue = _a.sent();
                console.log('Issue Asset with secret amount Transaction handle:', handleIssue);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 11:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleIssue)];
            case 12:
                issueTransactionStatus = _a.sent();
                issueResponse = issueTransactionStatus.response;
                if (!issueResponse) {
                    console.log('ERROR issueTransactionStatus', issueTransactionStatus);
                    return [2 /*return*/, false];
                }
                IssueCommitted = issueResponse.Committed;
                if (!Array.isArray(IssueCommitted)) {
                    console.log('ERROR could not get Commited from defineResponse, line 705');
                    return [2 /*return*/, false];
                }
                issueTxnSID = IssueCommitted && Array.isArray(IssueCommitted) ? IssueCommitted[0] : null;
                if (!issueTxnSID) {
                    console.log("Could not retrieve the transaction with a handle " + handleIssue + ". Response was: ", issueTransactionStatus);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, IssueCommitted[1][0]];
            case 13:
                confSid = _a.sent();
                return [4 /*yield*/, IssueCommitted[1][1]];
            case 14:
                nonConfSid = _a.sent();
                return [4 /*yield*/, api_1.Network.getUtxo(confSid)];
            case 15:
                confUtxoResponse = _a.sent();
                return [4 /*yield*/, api_1.Network.getUtxo(nonConfSid)];
            case 16:
                nonConfUtxoResponse = _a.sent();
                confUtxo = confUtxoResponse.response;
                nonConfUtxo = nonConfUtxoResponse.response;
                isNonConfidentialMatches = (nonConfUtxo === null || nonConfUtxo === void 0 ? void 0 : nonConfUtxo.utxo.record.amount.NonConfidential) === '10000';
                if (!isNonConfidentialMatches) {
                    console.log('🚀 ~ file: integration.ts ~ line 778 ~ issueAndSendConfidentialAsset ~ isNonConfidentialMatches IS FALSE', isNonConfidentialMatches, nonConfUtxo === null || nonConfUtxo === void 0 ? void 0 : nonConfUtxo.utxo.record.amount.NonConfidential);
                    return [2 /*return*/, false];
                }
                isConfidentiaExists = confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo.record.amount.Confidential;
                if (!isConfidentiaExists) {
                    console.log('🚀 ~ file: integration.ts ~ line 782 ~ issueAndSendConfidentialAsset ~ isConfidentiaExists IS FALSE , confUtxo?.utxo.record.amount', isConfidentiaExists, confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo.record.amount);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Network.getOwnerMemo(confSid)];
            case 17:
                ownerMemoDataResult = _a.sent();
                ownerMemoJson = ownerMemoDataResult.response;
                if (!ownerMemoJson) {
                    console.log('🚀 ~ file: integration.ts ~ line 794 ~ issueAndSendConfidentialAsset ~ there is not ownerMemo for confidential sid!');
                    console.log('🚀 ~ file: integration.ts ~ line 797 ~ issueAndSendConfidentialAsset ~ ownerMemoDataResult', ownerMemoDataResult);
                    return [2 /*return*/, false];
                }
                ownerMemo = Ledger.OwnerMemo.from_json(ownerMemoJson);
                assetRecord = Ledger.ClientAssetRecord.from_json(confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo);
                decryptedRecord = Ledger.open_client_asset_record(assetRecord, ownerMemo.clone(), aliceKeyPair);
                isDecryptedRecordCorrect = (decryptedRecord === null || decryptedRecord === void 0 ? void 0 : decryptedRecord.amount) === '5000000';
                if (!isDecryptedRecordCorrect) {
                    console.log('🚀 ~ file: integration.ts ~ line 815 ~ issueAndSendConfidentialAsset ~ isDecryptedRecordCorrect IS FALSE!, decryptedRecord', isDecryptedRecordCorrect, decryptedRecord);
                }
                transferAmount = decryptedRecord === null || decryptedRecord === void 0 ? void 0 : decryptedRecord.amount;
                numbersForPeter = bigNumber.fromWei(transferAmount, 6).toFormat(6);
                assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };
                recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: numbersForPeter }];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, tokenCode, assetBlindRulesForSend)];
            case 18:
                sendTransactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(sendTransactionBuilder)];
            case 19:
                handleSend = _a.sent();
                console.log('Send Transaction handle:', handleSend);
                console.log('Retrieving transaction status...');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 20:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleSend)];
            case 21:
                sendTransactionStatus = _a.sent();
                console.log('Retrieved transaction status response:', sendTransactionStatus);
                sendResponse = sendTransactionStatus.response;
                if (!sendResponse) {
                    console.log('ERROR could not get send transaction response', sendTransactionStatus);
                    return [2 /*return*/, false];
                }
                SendCommitted = sendResponse.Committed;
                if (!Array.isArray(SendCommitted)) {
                    console.log('ERROR could not get Commited from sendResponse, line 828');
                    return [2 /*return*/, false];
                }
                sendTxnSID = SendCommitted && Array.isArray(SendCommitted) ? SendCommitted[0] : null;
                console.log("TxnSID is: " + sendTxnSID);
                if (!sendTxnSID) {
                    console.log("Could not retrieve the transaction with a handle " + handleSend + ". Response was: ", sendTransactionStatus);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, (0, sleep_promise_1.default)(4000)];
            case 22:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(toWalletInfo.publickey)];
            case 23:
                bobTxoSidsResult = _a.sent();
                bobTxoSids = bobTxoSidsResult.response;
                if (!bobTxoSids) {
                    console.log("Could not retrieve the list of sids of the receiver. Response was: ", bobTxoSidsResult);
                    return [2 /*return*/, false];
                }
                newSid = bobTxoSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, api_1.Network.getUtxo(newSid)];
            case 24:
                bobUtxoDataResult = _a.sent();
                bobUtxoResponse = bobUtxoDataResult.response;
                if (!bobUtxoResponse) {
                    console.log('ERROR could not get bobUtxoResponse', bobUtxoDataResult);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Network.getOwnerMemo(newSid)];
            case 25:
                bobMemoDataResult = _a.sent();
                bobMemoJson = bobMemoDataResult.response;
                if (!bobMemoJson) {
                    console.log('could not get owner memo for the send to Bob transfer!', bobMemoDataResult);
                    return [2 /*return*/, false];
                }
                bobOwnerMemo = Ledger.OwnerMemo.from_json(bobMemoJson);
                bobAssetRecord = Ledger.ClientAssetRecord.from_json(bobUtxoResponse === null || bobUtxoResponse === void 0 ? void 0 : bobUtxoResponse.utxo);
                bobDecryptedRecord = Ledger.open_client_asset_record(bobAssetRecord, bobOwnerMemo, bobKeyPair);
                isBobDecryptedRecordCorrect = (bobDecryptedRecord === null || bobDecryptedRecord === void 0 ? void 0 : bobDecryptedRecord.amount) === '5000000';
                if (!isBobDecryptedRecordCorrect) {
                    console.log('🚀 ERROR ~ file: integration.ts ~ line 883 ~ issueAndSendConfidentialAsset ~ isBobDecryptedRecordCorrect', isBobDecryptedRecordCorrect, bobDecryptedRecord);
                    return [2 /*return*/, false];
                }
                isAssetTypeCorrect = Ledger.asset_type_from_jsvalue(bobDecryptedRecord.asset_type) == tokenCode;
                if (!isAssetTypeCorrect) {
                    console.log('🚀 ERROR ~ file: integration.ts ~ line 893 ~ issueAndSendConfidentialAsset ~ isAssetTypeCorrect', isAssetTypeCorrect, bobDecryptedRecord);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.issueAndSendConfidentialAsset = issueAndSendConfidentialAsset;
var delegateFraTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var Ledger, pkey, walletInfo, toWalletInfo, fraCode, assetBlindRules, numbersToSend, numbersToDelegate, transactionBuilderSend, resultHandleSend, delegationTargetPublicKey, delegationTargetAddress, formattedVlidators, validatorAddress, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, delegateInfo, isRewardsAdded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  delegateFraTransactionSubmit //////////////// ');
                return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                Ledger = _a.sent();
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 3:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraCode = _a.sent();
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                numbersToSend = '1000010';
                numbersToDelegate = '1000000';
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbersToSend, fraCode, assetBlindRules)];
            case 5:
                transactionBuilderSend = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderSend)];
            case 6:
                resultHandleSend = _a.sent();
                console.log('🚀  ~ delegateFraTransactionSubmit ~ send fra result handle', resultHandleSend);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                delegationTargetPublicKey = Ledger.get_delegation_target_address();
                return [4 /*yield*/, api_1.Keypair.getAddressByPublicKey(delegationTargetPublicKey)];
            case 8:
                delegationTargetAddress = _a.sent();
                return [4 /*yield*/, api_1.Staking.getValidatorList()];
            case 9:
                formattedVlidators = _a.sent();
                validatorAddress = formattedVlidators.validators[0].addr;
                return [4 /*yield*/, api_1.Staking.delegate(toWalletInfo, delegationTargetAddress, numbersToDelegate, fraCode, validatorAddress, assetBlindRules)];
            case 10:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 11:
                resultHandle = _a.sent();
                console.log('🚀  ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);
                console.log('🚀  ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 12:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 13:
                transactionStatus = _a.sent();
                console.log('🚀  ~ delegateFraTransactionSubmit ~ Retrieved transaction status response:', transactionStatus);
                sendResponse = transactionStatus.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ delegateFraTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80  ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                console.log('🚀  ~ delegateFraTransactionSubmit ~ waiting for 5 blocks before checking rewards');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 14:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 15:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 16:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 17:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _a.sent();
                console.log('🚀  ~ delegateFraTransactionSubmit ~ checking rewards now');
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(walletInfo.address)];
            case 19:
                delegateInfo = _a.sent();
                isRewardsAdded = Number(delegateInfo.rewards) > 0;
                if (!isRewardsAdded) {
                    console.log('🚀  ~ delegateFraTransactionSubmit ~ There is no rewards yet! , delegateInfo', delegateInfo);
                    return [2 /*return*/, false];
                }
                console.log('🚀  ~ delegateFraTransactionSubmit ~ accumulated rewards ', delegateInfo.rewards);
                return [2 /*return*/, true];
        }
    });
}); };
exports.delegateFraTransactionSubmit = delegateFraTransactionSubmit;
var delegateFraTransactionAndClaimRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, Ledger, pkey, walletInfo, toWalletInfo, fraCode, assetBlindRules, numbersToSend, numbersToDelegate, balanceBeforeSend, transactionBuilderSend, resultHandleSend, balanceAfterSend, delegationTargetPublicKey, delegationTargetAddress, formattedVlidators, validatorAddress, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, balanceAfterDelegate, delegateInfo, isRewardsAdded, balanceBefore, amountToClaim, transactionBuilderClaim, resultHandleClaim, transactionStatusClaim, claimResponse, ClaimCommited, txnSIDClaim, balanceAfter, isClaimSuccessfull;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');
                password = '123';
                return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                Ledger = _a.sent();
                pkey = mainFaucet;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 3:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraCode = _a.sent();
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                numbersToSend = '1000010';
                numbersToDelegate = '1000000';
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 5:
                balanceBeforeSend = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeSend', balanceBeforeSend);
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbersToSend, fraCode, assetBlindRules)];
            case 6:
                transactionBuilderSend = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderSend)];
            case 7:
                resultHandleSend = _a.sent();
                console.log('send fra result handle!!', resultHandleSend);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 9:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 10:
                balanceAfterSend = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend', balanceAfterSend);
                delegationTargetPublicKey = Ledger.get_delegation_target_address();
                return [4 /*yield*/, api_1.Keypair.getAddressByPublicKey(delegationTargetPublicKey)];
            case 11:
                delegationTargetAddress = _a.sent();
                return [4 /*yield*/, api_1.Staking.getValidatorList()];
            case 12:
                formattedVlidators = _a.sent();
                validatorAddress = formattedVlidators.validators[0].addr;
                return [4 /*yield*/, api_1.Staking.delegate(toWalletInfo, delegationTargetAddress, numbersToDelegate, fraCode, validatorAddress, assetBlindRules)];
            case 13:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 14:
                resultHandle = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ delegateResultHandle', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 15:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 16:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 17:
                transactionStatus = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatus);
                sendResponse = transactionStatus.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 18:
                balanceAfterDelegate = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterDelegate', balanceAfterDelegate);
                console.log('waiting for 5 blocks before checking rewards');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 19:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 20:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 21:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 22:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 23:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 24:
                _a.sent();
                console.log('checking rewards now');
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(toWalletInfo.address)];
            case 25:
                delegateInfo = _a.sent();
                isRewardsAdded = Number(delegateInfo.rewards) > 0;
                if (!isRewardsAdded) {
                    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
                    return [2 /*return*/, false];
                }
                console.log('accumulated rewards ', delegateInfo.rewards);
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 26:
                balanceBefore = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 801 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim', balanceBefore);
                amountToClaim = delegateInfo.rewards;
                return [4 /*yield*/, api_1.Staking.claim(toWalletInfo, amountToClaim)];
            case 27:
                transactionBuilderClaim = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderClaim)];
            case 28:
                resultHandleClaim = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ resultHandleClaim', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 29:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 30:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 31:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 32:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 33:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandleClaim)];
            case 34:
                transactionStatusClaim = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatusClaim);
                claimResponse = transactionStatusClaim.response;
                if (!claimResponse) {
                    return [2 /*return*/, false];
                }
                ClaimCommited = claimResponse.Committed;
                if (!Array.isArray(ClaimCommited)) {
                    return [2 /*return*/, false];
                }
                txnSIDClaim = ClaimCommited && Array.isArray(ClaimCommited) ? ClaimCommited[0] : null;
                console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionAndClaimRewards ~ txnSIDClaim', txnSIDClaim);
                if (!txnSIDClaim) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatusClaim);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 35:
                balanceAfter = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 845 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter', balanceAfter);
                isClaimSuccessfull = Number(balanceAfter) > Number(balanceBefore);
                console.log('🚀 ~ file: run.ts ~ line 877 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull', isClaimSuccessfull);
                return [2 /*return*/, isClaimSuccessfull];
        }
    });
}); };
exports.delegateFraTransactionAndClaimRewards = delegateFraTransactionAndClaimRewards;
//# sourceMappingURL=integration.js.map