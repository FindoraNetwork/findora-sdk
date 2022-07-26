"use strict";
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
exports.issueAndSendConfidentialAsset = exports.getBalance = exports.sendFraToMultipleReceiversTransactionSubmit = exports.sendFraTransactionSubmit = exports.defineIssueAndSendAssetTransactionSubmit = exports.defineAndIssueAssetTransactionSubmit = exports.defineAssetTransactionSubmit = exports.defineAssetTransaction = void 0;
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var api_1 = require("./api");
var testHelpers_1 = require("./evm/testHelpers");
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber = __importStar(require("./services/bigNumber"));
var providers_1 = require("./services/cacheStore/providers");
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? "../.env_integration_".concat(process.env.INTEGRATION_ENV_NAME)
    : "../.env_example";
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
console.log('🚀 ~ file: integration.ts ~ line 31 ~ Findora Sdk is configured to use:', sdkEnv);
console.log("Connecting to \"".concat(sdkEnv.hostUrl, "\""));
Sdk_1.default.init(sdkEnv);
var mainFaucet = walletKeys.mainFaucet, receiverOne = walletKeys.receiverOne;
var password = 'yourSecretPassword';
var getTxSid = function (operationName, txHandle) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionStatus, sendResponse, Committed, txnSID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("\uD83D\uDE80 ~ ".concat(operationName, " ~ txHandle"), txHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 1:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(txHandle)];
            case 2:
                transactionStatus = _a.sent();
                sendResponse = transactionStatus.response;
                if (!sendResponse) {
                    console.log("\uD83D\uDE80 ~ ERROR 1 - ".concat(operationName, " ~ transactionStatus"), transactionStatus);
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    console.log("\uD83D\uDE80 ~ ERROR 2 - ".concat(operationName, " ~ sendResponse"), sendResponse);
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log("\uD83D\uDE80 ~ ".concat(operationName, " ~ txnSID"), txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80  ~ ERROR 3 - ".concat(operationName, " ~ Could not retrieve the transaction with a handle ").concat(txHandle, ". Response was: "), transactionStatus);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
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
                console.log('🚀 ~ defineAssetTransaction ~ assetCode', tokenCode);
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
    var pkey, walletInfo, tokenCode, assetBuilder, handle, isTxSent;
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
                console.log('🚀 ~ defineAssetTransactionSubmit ~ tokenCode', tokenCode);
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode)];
            case 3:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 4:
                handle = _a.sent();
                return [4 /*yield*/, getTxSid('define asset', handle)];
            case 5:
                isTxSent = _a.sent();
                if (!isTxSent) {
                    console.log("\uD83D\uDE80 ~ defineAssetTransactionSubmit ~ Could not submit define asset");
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineAssetTransactionSubmit = defineAssetTransactionSubmit;
var defineAndIssueAssetTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, tokenCode, derivedTokenCode, assetRules, memo, assetBuilder, handle, isTxSent, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, isTxIssued;
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
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(tokenCode)];
            case 3:
                derivedTokenCode = _a.sent();
                console.log('🚀 ~ defineAndIssueAssetTransactionSubmit ~ tokenCode', tokenCode, derivedTokenCode);
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
                return [4 /*yield*/, getTxSid('define asset', handle)];
            case 6:
                isTxSent = _a.sent();
                if (!isTxSent) {
                    console.log("\uD83D\uDE80 ~ defineAndIssueAssetTransactionSubmit ~ Could not submit define asset");
                    return [2 /*return*/, false];
                }
                inputNumbers = '5';
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, derivedTokenCode, inputNumbers, assetBlindRules)];
            case 7:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 8:
                handleIssue = _a.sent();
                return [4 /*yield*/, getTxSid('issue', handleIssue)];
            case 9:
                isTxIssued = _a.sent();
                if (!isTxIssued) {
                    console.log("\uD83D\uDE80 ~ delegateFraTransactionAndClaimRewards ~ Could not submit asset issue");
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineAndIssueAssetTransactionSubmit = defineAndIssueAssetTransactionSubmit;
var defineIssueAndSendAssetTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkey, walletInfo, toWalletInfo, tokenCode, derivedTokenCode, assetRules, memo, assetBuilder, handle, isTxDefineSent, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, isTxIssueSent, assetBlindRulesForSend, sendTransactionBuilder, handleSend, isTxTransferSent;
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
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(tokenCode)];
            case 4:
                derivedTokenCode = _a.sent();
                console.log('🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ tokenCode', tokenCode);
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
                return [4 /*yield*/, getTxSid('define', handle)];
            case 7:
                isTxDefineSent = _a.sent();
                if (!isTxDefineSent) {
                    console.log("\uD83D\uDE80 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit define");
                    return [2 /*return*/, false];
                }
                inputNumbers = 5;
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, derivedTokenCode, "".concat(inputNumbers), assetBlindRules)];
            case 8:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 9:
                handleIssue = _a.sent();
                return [4 /*yield*/, getTxSid('define', handleIssue)];
            case 10:
                isTxIssueSent = _a.sent();
                if (!isTxIssueSent) {
                    console.log("\uD83D\uDE80 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit issue");
                    return [2 /*return*/, false];
                }
                assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, "".concat(inputNumbers / 2), derivedTokenCode, assetBlindRulesForSend)];
            case 11:
                sendTransactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(sendTransactionBuilder)];
            case 12:
                handleSend = _a.sent();
                return [4 /*yield*/, getTxSid('send', handleSend)];
            case 13:
                isTxTransferSent = _a.sent();
                if (!isTxTransferSent) {
                    console.log("\uD83D\uDE80 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit send");
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.defineIssueAndSendAssetTransactionSubmit = defineIssueAndSendAssetTransactionSubmit;
var sendFraTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, toWalletInfo, receiverBalanceBeforeTransfer, assetBlindRules, numbers, assetCode, transactionBuilder, resultHandle, isTxSend, receiverBalanceAfterTransfer, isItRight, peterCheckResult;
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
                return [4 /*yield*/, api_1.Account.getBalanceInWei(toWalletInfo)];
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
                return [4 /*yield*/, getTxSid('send', resultHandle)];
            case 7:
                isTxSend = _a.sent();
                if (!isTxSend) {
                    console.log("\uD83D\uDE80  ~ sendFraTransactionSubmit ~ Could not submit send");
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalanceInWei(toWalletInfo)];
            case 8:
                receiverBalanceAfterTransfer = _a.sent();
                isItRight = (0, testHelpers_1.isNumberChangedBy)(receiverBalanceBeforeTransfer, receiverBalanceAfterTransfer, numbers);
                peterCheckResult = "Peter balance should be 0.100000 and now it is ".concat((0, testHelpers_1.formatFromWei)(receiverBalanceAfterTransfer), ", so this is \"").concat(isItRight, "\" ");
                console.log('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);
                return [2 /*return*/, isItRight];
        }
    });
}); };
exports.sendFraTransactionSubmit = sendFraTransactionSubmit;
var sendFraToMultipleReceiversTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, walletInfo, aliceWalletInfo, petereWalletInfo, aliceBalanceBeforeTransfer, peterBalanceBeforeTransfer, assetBlindRules, numbersForAlice, numbersForPeter, assetCode, recieversInfo, transactionBuilder, resultHandle, isTxSend, aliceBalanceAfterTransfer, peterBalanceAfterTransfer, isItRightAlice, isItRightPeter, aliceCheckResult, peterCheckResult;
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
                return [4 /*yield*/, api_1.Account.getBalanceInWei(aliceWalletInfo)];
            case 4:
                aliceBalanceBeforeTransfer = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalanceInWei(petereWalletInfo)];
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
                return [4 /*yield*/, getTxSid('send', resultHandle)];
            case 9:
                isTxSend = _a.sent();
                if (!isTxSend) {
                    console.log("\uD83D\uDE80  ~ sendFraToMultipleReceiversTransactionSubmit ~ Could not submit send");
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalanceInWei(aliceWalletInfo)];
            case 10:
                aliceBalanceAfterTransfer = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalanceInWei(petereWalletInfo)];
            case 11:
                peterBalanceAfterTransfer = _a.sent();
                isItRightAlice = (0, testHelpers_1.isNumberChangedBy)(aliceBalanceBeforeTransfer, aliceBalanceAfterTransfer, numbersForAlice);
                isItRightPeter = (0, testHelpers_1.isNumberChangedBy)(peterBalanceBeforeTransfer, peterBalanceAfterTransfer, numbersForPeter);
                aliceCheckResult = "Alice balance should be 0.100000 and now it is ".concat((0, testHelpers_1.formatFromWei)(aliceBalanceAfterTransfer), ", so this is \"").concat(isItRightAlice, "\" ");
                peterCheckResult = "Peter balance should be 0.200000 and now it is ".concat((0, testHelpers_1.formatFromWei)(peterBalanceAfterTransfer), ", so this is \"").concat(isItRightPeter, "\" ");
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
    var Ledger, pkey, toPkey, walletInfo, toWalletInfo, aliceKeyPair, bobKeyPair, tokenCode, derivedTokenCode, assetRules, memo, assetBuilder, handle, isTxDefine, inputNumbers, assetBlindRules, issueAssetBuilder, handleIssue, isTxIssue, issueTransactionStatus, issueResponse, IssueCommitted, confSid, nonConfSid, confUtxoResponse, nonConfUtxoResponse, confUtxo, nonConfUtxo, isNonConfidentialMatches, isConfidentiaExists, ownerMemoDataResult, ownerMemoJson, ownerMemo, assetRecord, decryptedRecord, isDecryptedRecordCorrect, transferAmount, numbersForPeter, assetBlindRulesForSend, recieversInfo, sendTransactionBuilder, handleSend, isTxSend, bobTxoSidsResult, bobTxoSids, newSid, bobUtxoDataResult, bobUtxoResponse, bobMemoDataResult, bobMemoJson, bobOwnerMemo, bobAssetRecord, bobDecryptedRecord, isBobDecryptedRecordCorrect, isAssetTypeCorrect;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  issueAndSendConfidentialAsset //////////////// ');
                return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                Ledger = _a.sent();
                pkey = mainFaucet;
                toPkey = receiverOne;
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
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(tokenCode)];
            case 5:
                derivedTokenCode = _a.sent();
                console.log('Defining a custom asset:', tokenCode, derivedTokenCode);
                assetRules = {
                    transferable: false,
                    updatable: true,
                    decimals: 6,
                };
                memo = 'this is a test asset';
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules)];
            case 6:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 7:
                handle = _a.sent();
                return [4 /*yield*/, getTxSid('defineAsset', handle)];
            case 8:
                isTxDefine = _a.sent();
                if (!isTxDefine) {
                    console.log("\uD83D\uDE80  ~ issueAndSendConfidentialAsset ~ Could not submit define");
                    return [2 /*return*/, false];
                }
                inputNumbers = '5';
                assetBlindRules = { isAmountBlind: true };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, derivedTokenCode, inputNumbers, assetBlindRules)];
            case 9:
                issueAssetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(issueAssetBuilder)];
            case 10:
                handleIssue = _a.sent();
                return [4 /*yield*/, getTxSid('issue', handleIssue)];
            case 11:
                isTxIssue = _a.sent();
                if (!isTxIssue) {
                    console.log("\uD83D\uDE80  ~ issueAndSendConfidentialAsset ~ Could not submit issue");
                    return [2 /*return*/, false];
                }
                console.log('Issue Asset with secret amount Transaction handle:', handleIssue);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 12:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(handleIssue)];
            case 13:
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
                return [4 /*yield*/, IssueCommitted[1][0]];
            case 14:
                confSid = _a.sent();
                return [4 /*yield*/, IssueCommitted[1][1]];
            case 15:
                nonConfSid = _a.sent();
                return [4 /*yield*/, api_1.Network.getUtxo(confSid)];
            case 16:
                confUtxoResponse = _a.sent();
                return [4 /*yield*/, api_1.Network.getUtxo(nonConfSid)];
            case 17:
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
            case 18:
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
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, derivedTokenCode, assetBlindRulesForSend)];
            case 19:
                sendTransactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(sendTransactionBuilder)];
            case 20:
                handleSend = _a.sent();
                return [4 /*yield*/, getTxSid('send', handleSend)];
            case 21:
                isTxSend = _a.sent();
                if (!isTxSend) {
                    console.log("\uD83D\uDE80  ~ issueAndSendConfidentialAsset ~ Could not submit send");
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Network.getOwnedSids(toWalletInfo.publickey)];
            case 22:
                bobTxoSidsResult = _a.sent();
                bobTxoSids = bobTxoSidsResult.response;
                if (!bobTxoSids) {
                    console.log("Could not retrieve the list of sids of the receiver. Response was: ", bobTxoSidsResult);
                    return [2 /*return*/, false];
                }
                newSid = bobTxoSids.sort(function (a, b) { return b - a; })[0];
                return [4 /*yield*/, api_1.Network.getUtxo(newSid)];
            case 23:
                bobUtxoDataResult = _a.sent();
                bobUtxoResponse = bobUtxoDataResult.response;
                if (!bobUtxoResponse) {
                    console.log('ERROR could not get bobUtxoResponse', bobUtxoDataResult);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Network.getOwnerMemo(newSid)];
            case 24:
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
                isAssetTypeCorrect = Ledger.asset_type_from_jsvalue(bobDecryptedRecord.asset_type) == derivedTokenCode;
                if (!isAssetTypeCorrect) {
                    console.log('🚀 ERROR ~ file: integration.ts ~ line 893 ~ issueAndSendConfidentialAsset ~ isAssetTypeCorrect', isAssetTypeCorrect, bobDecryptedRecord);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.issueAndSendConfidentialAsset = issueAndSendConfidentialAsset;
// export const delegateFraTransactionSubmit = async () => {
//   console.log('////////////////  delegateFraTransactionSubmit //////////////// ');
//   // send part
//   const Ledger = await getLedger();
//   const pkey = mainFaucet;
//   const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
//   const toWalletInfo = await KeypairApi.createKeypair(password);
//   const numbersToDelegate = '1000000';
//   const numbersToSend = '1000010';
//   const fraCode = await AssetApi.getFraAssetCode();
//   const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };
//   const isFundSuccesfull = await sendFromFaucetToAccount(walletInfo, toWalletInfo, numbersToSend);
//   if (!isFundSuccesfull) {
//     console.log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
//     return false;
//   }
//   // delegate part
//   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
//   const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);
//   const formattedVlidators = await StakingApi.getValidatorList();
//   const validatorAddress = formattedVlidators.validators[0].addr;
//   const transactionBuilder = await StakingApi.delegate(
//     toWalletInfo,
//     delegationTargetAddress,
//     numbersToDelegate,
//     fraCode,
//     validatorAddress,
//     assetBlindRules,
//   );
//   const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
//   const isTxDelegated = await getTxSid('delegate', resultHandle);
//   if (!isTxDelegated) {
//     console.log(`🚀  ~ delegateFraTransactionSubmit ~ Could not submit delegation`);
//     return false;
//   }
//   console.log('🚀  ~ delegateFraTransactionSubmit ~ waiting for 10 blocks before checking rewards');
//   // 10 blocks
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   console.log('🚀  ~ delegateFraTransactionSubmit ~ checking rewards now');
//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);
//   const isRewardsAdded = Number(delegateInfo.rewards) > 0;
//   if (!isRewardsAdded) {
//     console.log('🚀  ~ delegateFraTransactionSubmit ~ There is no rewards yet! , delegateInfo', delegateInfo);
//     return false;
//   }
//   console.log('🚀  ~ delegateFraTransactionSubmit ~ accumulated rewards ', delegateInfo.rewards);
//   return true;
// };
// export const delegateFraTransactionAndClaimRewards = async () => {
//   console.log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');
//   const password = '123';
//   const Ledger = await getLedger();
//   const pkey = mainFaucet;
//   const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
//   const toWalletInfo = await KeypairApi.createKeypair(password);
//   console.log(
//     '🚀 ~ file: integration.ts ~ line 1096 ~ delegateFraTransactionAndClaimRewards ~ toWalletInfo',
//     toWalletInfo,
//   );
//   const numbersToDelegate = '1000001';
//   const numbersToSend = '1000010';
//   const fraCode = await AssetApi.getFraAssetCode();
//   const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };
//   const isFundSuccesfull = await sendFromFaucetToAccount(walletInfo, toWalletInfo, numbersToSend);
//   if (!isFundSuccesfull) {
//     console.log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
//     return false;
//   }
//   // delegate
//   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
//   const delegationTargetAddress = await KeypairApi.getAddressByPublicKey(delegationTargetPublicKey);
//   const formattedVlidators = await StakingApi.getValidatorList();
//   const validatorAddress = formattedVlidators.validators[0].addr;
//   const transactionBuilder = await StakingApi.delegate(
//     toWalletInfo,
//     delegationTargetAddress,
//     numbersToDelegate,
//     fraCode,
//     validatorAddress,
//     assetBlindRules,
//   );
//   const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
//   // w2
//   const isTxDelegated = await getTxSid('delegate', resultHandle);
//   if (!isTxDelegated) {
//     console.log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit delegation`);
//     return false;
//   }
//   console.log('delegateFraTransactionAndClaimRewards - waiting for 11 blocks before checking rewards');
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   console.log('delegateFraTransactionAndClaimRewards - checking rewards now');
//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);
//   const amountToClaim = delegateInfo.rewards;
//   const isRewardsAdded = Number(amountToClaim) > 0;
//   if (!isRewardsAdded) {
//     console.log(
//       'delegateFraTransactionAndClaimRewards - There is no rewards yet! , delegateInfo',
//       delegateInfo,
//     );
//     return false;
//   }
//   console.log('delegateFraTransactionAndClaimRewards - accumulated rewards ', amountToClaim);
//   // claim
//   const balanceBefore = await AccountApi.getBalanceInWei(toWalletInfo);
//   console.log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim', balanceBefore);
//   const transactionBuilderClaim = await StakingApi.claim(toWalletInfo, amountToClaim);
//   const resultHandleClaim = await TransactionApi.submitTransaction(transactionBuilderClaim);
//   // w 10
//   const isTxClaimed = await getTxSid('clam', resultHandleClaim);
//   if (!isTxClaimed) {
//     console.log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit claim`);
//     return false;
//   }
//   console.log(
//     'delegateFraTransactionAndClaimRewards - waiting for 11 blocks before checking balance of claimed rewards',
//   );
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   await sleep(waitingTimeBeforeCheckTxStatus);
//   const balanceAfter = await AccountApi.getBalanceInWei(toWalletInfo);
//   console.log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter', balanceAfter);
//   const balanceBeforeBN = bigNumber.create(balanceBefore);
//   const balanceAfterBN = bigNumber.create(balanceAfter);
//   const isClaimSuccessfull = balanceAfterBN.gte(balanceBeforeBN);
//   console.log('🚀 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull', isClaimSuccessfull);
//   return isClaimSuccessfull;
// };
//# sourceMappingURL=integration.js.map