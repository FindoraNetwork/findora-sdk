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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueAndSendConfidentialAsset = exports.getBalance = exports.sendFraToMultipleReceiversTransactionSubmit = exports.sendFraConfidentialTransactionSubmit = exports.sendFraTransactionSubmit = exports.defineIssueAndSendAssetTransactionSubmit = exports.defineAndIssueAssetTransactionSubmit = exports.defineAssetTransactionSubmit = exports.defineAssetTransaction = void 0;
const api_1 = require("./api");
const testHelpers_1 = require("./evm/testHelpers");
const Sdk_1 = __importDefault(require("./Sdk"));
const bigNumber = __importStar(require("./services/bigNumber"));
const providers_1 = require("./services/cacheStore/providers");
const ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
const utils_1 = require("./services/utils");
const envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? `../.env_integration_${process.env.INTEGRATION_ENV_NAME}`
    : `../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { keys: walletKeys, hostUrl: envHostUrl } = envConfig;
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
    hostUrl: envHostUrl,
    cacheProvider: providers_1.MemoryCacheProvider,
    blockScanerUrl: '',
    cachePath: './cache',
};
(0, utils_1.log)('🚀 ~ file: integration.ts ~ line 31 ~ Findora Sdk is configured to use:', sdkEnv);
(0, utils_1.log)(`Connecting to "${sdkEnv.hostUrl}"`);
Sdk_1.default.init(sdkEnv);
const { mainFaucet, receiverOne } = walletKeys;
const password = 'yourSecretPassword';
const getTxSid = (operationName, txHandle, retry = true) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)(`🚀 ~ ${operationName} ~ txHandle`, txHandle);
    yield (0, testHelpers_1.waitForBlockChange)();
    const transactionStatus = yield api_1.Network.getTransactionStatus(txHandle);
    const { response: sendResponse } = transactionStatus;
    if (!sendResponse) {
        (0, utils_1.log)(`🚀 ~ ERROR 1 - ${operationName} ~ transactionStatus`, transactionStatus);
        return false;
    }
    const { Committed } = sendResponse;
    if (!Array.isArray(Committed)) {
        if (retry) {
            (0, utils_1.log)(`🚀  ~ ERROR 2 - ${operationName} ~ sendResponse ${txHandle}. Response was: `, sendResponse, `- Retrying...`);
            return getTxSid(operationName, txHandle, false);
        }
        else {
            (0, utils_1.log)(`🚀 ~ ERROR 2 - ${operationName} ~ sendResponse`, sendResponse);
            return false;
        }
    }
    const txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
    (0, utils_1.log)(`🚀 ~ ${operationName} ~ txnSID`, txnSID);
    if (!txnSID) {
        if (retry) {
            (0, utils_1.log)(`🚀  ~ ERROR 3 - ${operationName} ~ Could not retrieve the transaction with a handle ${txHandle}. Response was: `, transactionStatus, `- Retrying...`);
            return getTxSid(operationName, txHandle, false);
        }
        else {
            (0, utils_1.log)(`🚀  ~ ERROR 3 - ${operationName} ~ Could not retrieve the transaction with a handle ${txHandle}. Response was: `, transactionStatus);
            return false;
        }
    }
    return true;
});
const defineAssetTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  defineAssetTransaction //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const tokenCode = yield api_1.Asset.getRandomAssetCode();
    (0, utils_1.log)('🚀 ~ defineAssetTransaction ~ assetCode', tokenCode);
    const memo = 'this is a test asset';
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, tokenCode, memo);
    const submitData = assetBuilder.transaction();
    try {
        const { body: { operations: [operation], }, } = JSON.parse(submitData);
        return 'DefineAsset' in operation;
    }
    catch (error) {
        (0, utils_1.log)('Error!', error);
        return false;
    }
});
exports.defineAssetTransaction = defineAssetTransaction;
const defineAssetTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  defineAssetTransactionSubmit //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const tokenCode = yield api_1.Asset.getRandomAssetCode();
    (0, utils_1.log)('🚀 ~ defineAssetTransactionSubmit ~ tokenCode', tokenCode);
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, tokenCode);
    const handle = yield api_1.Transaction.submitTransaction(assetBuilder);
    const isTxSent = yield getTxSid('define asset', handle);
    if (!isTxSent) {
        (0, utils_1.log)(`🚀 ~ defineAssetTransactionSubmit ~ Could not submit define asset`);
        return false;
    }
    return true;
});
exports.defineAssetTransactionSubmit = defineAssetTransactionSubmit;
const defineAndIssueAssetTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  defineAndIssueAssetTransactionSubmit //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const tokenCode = yield api_1.Asset.getRandomAssetCode();
    const derivedTokenCode = yield api_1.Asset.getDerivedAssetCode(tokenCode);
    (0, utils_1.log)('🚀 ~ defineAndIssueAssetTransactionSubmit ~ tokenCode', tokenCode, derivedTokenCode);
    const assetRules = {
        transferable: false,
        updatable: true,
        decimals: 6,
    };
    const memo = 'this is a test asset';
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules);
    const handle = yield api_1.Transaction.submitTransaction(assetBuilder);
    const isTxSent = yield getTxSid('define asset', handle);
    if (!isTxSent) {
        (0, utils_1.log)(`🚀 ~ defineAndIssueAssetTransactionSubmit ~ Could not submit define asset`);
        return false;
    }
    const inputNumbers = '5';
    const assetBlindRules = { isAmountBlind: false };
    const issueAssetBuilder = yield api_1.Asset.issueAsset(walletInfo, derivedTokenCode, inputNumbers, assetBlindRules);
    const handleIssue = yield api_1.Transaction.submitTransaction(issueAssetBuilder);
    const isTxIssued = yield getTxSid('issue', handleIssue);
    if (!isTxIssued) {
        (0, utils_1.log)(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit asset issue`);
        return false;
    }
    return true;
});
exports.defineAndIssueAssetTransactionSubmit = defineAndIssueAssetTransactionSubmit;
const defineIssueAndSendAssetTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  defineIssueAndSendAssetTransactionSubmit //////////////// ');
    const pkey = mainFaucet;
    const toPkey = receiverOne;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const toWalletInfo = yield api_1.Keypair.restoreFromPrivateKey(toPkey, password);
    const tokenCode = yield api_1.Asset.getRandomAssetCode();
    const derivedTokenCode = yield api_1.Asset.getDerivedAssetCode(tokenCode);
    (0, utils_1.log)('🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ tokenCode', tokenCode);
    const assetRules = {
        transferable: false,
        updatable: true,
        decimals: 6,
    };
    const memo = 'this is a test asset';
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules);
    const handle = yield api_1.Transaction.submitTransaction(assetBuilder);
    const isTxDefineSent = yield getTxSid('define', handle);
    if (!isTxDefineSent) {
        (0, utils_1.log)(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit define`);
        return false;
    }
    const inputNumbers = 5;
    const assetBlindRules = { isAmountBlind: false };
    const issueAssetBuilder = yield api_1.Asset.issueAsset(walletInfo, derivedTokenCode, `${inputNumbers}`, assetBlindRules);
    const handleIssue = yield api_1.Transaction.submitTransaction(issueAssetBuilder);
    const isTxIssueSent = yield getTxSid('define', handleIssue);
    if (!isTxIssueSent) {
        (0, utils_1.log)(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit issue`);
        return false;
    }
    const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: false };
    const sendTransactionBuilder = yield api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, `${inputNumbers / 2}`, derivedTokenCode, assetBlindRulesForSend);
    const handleSend = yield api_1.Transaction.submitTransaction(sendTransactionBuilder);
    const isTxTransferSent = yield getTxSid('send', handleSend);
    if (!isTxTransferSent) {
        (0, utils_1.log)(`🚀 ~ defineIssueAndSendAssetTransactionSubmit ~ Could not submit send`);
        return false;
    }
    return true;
});
exports.defineIssueAndSendAssetTransactionSubmit = defineIssueAndSendAssetTransactionSubmit;
const sendFraTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  sendFraTransactionSubmit //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const toWalletInfo = yield api_1.Keypair.createKeypair(password);
    const receiverBalanceBeforeTransfer = yield api_1.Account.getBalanceInWei(toWalletInfo);
    const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
    const numbers = '0.1';
    const assetCode = yield api_1.Asset.getFraAssetCode();
    const transactionBuilder = yield api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbers, assetCode, assetBlindRules);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    const isTxSend = yield getTxSid('send', resultHandle);
    if (!isTxSend) {
        (0, utils_1.log)(`🚀  ~ sendFraTransactionSubmit ~ Could not submit send`);
        return false;
    }
    const receiverBalanceAfterTransfer = yield api_1.Account.getBalanceInWei(toWalletInfo);
    const isItRight = (0, testHelpers_1.isNumberChangedBy)(receiverBalanceBeforeTransfer, receiverBalanceAfterTransfer, numbers);
    const peterCheckResult = `Peter balance should be 0.100000 and now it is ${(0, testHelpers_1.formatFromWei)(receiverBalanceAfterTransfer)}, so this is "${isItRight}" `;
    (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);
    return isItRight;
});
exports.sendFraTransactionSubmit = sendFraTransactionSubmit;
const sendFraConfidentialTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  sendFraConfidentialTransactionSubmit //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const toWalletInfo = yield api_1.Keypair.createKeypair(password);
    const receiverBalanceBeforeTransfer = yield api_1.Account.getBalanceInWei(toWalletInfo);
    const assetBlindRules = { isTypeBlind: true, isAmountBlind: true };
    const numbers = '0.2';
    const assetCode = yield api_1.Asset.getFraAssetCode();
    const transactionBuilder = yield api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbers, assetCode, assetBlindRules);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    const isTxSend = yield getTxSid('send', resultHandle);
    if (!isTxSend) {
        (0, utils_1.log)(`🚀  ~ sendFraTransactionSubmit ~ Could not submit send`);
        return false;
    }
    const receiverBalanceAfterTransfer = yield api_1.Account.getBalanceInWei(toWalletInfo);
    const isItRight = (0, testHelpers_1.isNumberChangedBy)(receiverBalanceBeforeTransfer, receiverBalanceAfterTransfer, numbers);
    const peterCheckResult = `Peter balance should be 0.200000 and now it is ${(0, testHelpers_1.formatFromWei)(receiverBalanceAfterTransfer)}, so this is "${isItRight}" `;
    (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 498 ~ sendFraTransactionSubmit ~ peterCheckResult', peterCheckResult);
    return isItRight;
});
exports.sendFraConfidentialTransactionSubmit = sendFraConfidentialTransactionSubmit;
const sendFraToMultipleReceiversTransactionSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
    const pkey = mainFaucet;
    (0, utils_1.log)('////////////////  sendFraToMultipleReceiversTransactionSubmit //////////////// ');
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const aliceWalletInfo = yield api_1.Keypair.createKeypair(password);
    const petereWalletInfo = yield api_1.Keypair.createKeypair(password);
    const aliceBalanceBeforeTransfer = yield api_1.Account.getBalanceInWei(aliceWalletInfo);
    const peterBalanceBeforeTransfer = yield api_1.Account.getBalanceInWei(petereWalletInfo);
    const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
    const numbersForAlice = '0.1';
    const numbersForPeter = '0.2';
    const assetCode = yield api_1.Asset.getFraAssetCode();
    const recieversInfo = [
        { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
        { reciverWalletInfo: petereWalletInfo, amount: numbersForPeter },
    ];
    const transactionBuilder = yield api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    const isTxSend = yield getTxSid('send', resultHandle);
    if (!isTxSend) {
        (0, utils_1.log)(`🚀  ~ sendFraToMultipleReceiversTransactionSubmit ~ Could not submit send`);
        return false;
    }
    const aliceBalanceAfterTransfer = yield api_1.Account.getBalanceInWei(aliceWalletInfo);
    const peterBalanceAfterTransfer = yield api_1.Account.getBalanceInWei(petereWalletInfo);
    const isItRightAlice = (0, testHelpers_1.isNumberChangedBy)(aliceBalanceBeforeTransfer, aliceBalanceAfterTransfer, numbersForAlice);
    const isItRightPeter = (0, testHelpers_1.isNumberChangedBy)(peterBalanceBeforeTransfer, peterBalanceAfterTransfer, numbersForPeter);
    const aliceCheckResult = `Alice balance should be 0.100000 and now it is ${(0, testHelpers_1.formatFromWei)(aliceBalanceAfterTransfer)}, so this is "${isItRightAlice}" `;
    const peterCheckResult = `Peter balance should be 0.200000 and now it is ${(0, testHelpers_1.formatFromWei)(peterBalanceAfterTransfer)}, so this is "${isItRightPeter}" `;
    (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 597 ~ sendFraToMultipleReceiversTransactionSubmit ~ aliceCheckResult', aliceCheckResult);
    (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 602 ~ sendFraToMultipleReceiversTransactionSubmit ~ peterCheckResult', peterCheckResult);
    return isItRightAlice && isItRightPeter;
});
exports.sendFraToMultipleReceiversTransactionSubmit = sendFraToMultipleReceiversTransactionSubmit;
const getBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  getBalance //////////////// ');
    const pkey = mainFaucet;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const balance = yield api_1.Account.getBalance(walletInfo);
    return parseFloat(balance) > 0;
});
exports.getBalance = getBalance;
const issueAndSendConfidentialAsset = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  issueAndSendConfidentialAsset //////////////// ');
    const Ledger = yield (0, ledgerWrapper_1.getLedger)();
    const pkey = mainFaucet;
    const toPkey = receiverOne;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const toWalletInfo = yield api_1.Keypair.restoreFromPrivateKey(toPkey, password);
    const aliceKeyPair = walletInfo.keypair;
    const bobKeyPair = toWalletInfo.keypair;
    const tokenCode = yield api_1.Asset.getRandomAssetCode();
    const derivedTokenCode = yield api_1.Asset.getDerivedAssetCode(tokenCode);
    (0, utils_1.log)('Defining a custom asset:', tokenCode, derivedTokenCode);
    const assetRules = {
        transferable: false,
        updatable: true,
        decimals: 6,
    };
    const memo = 'this is a test asset';
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, tokenCode, memo, assetRules);
    const handle = yield api_1.Transaction.submitTransaction(assetBuilder);
    const isTxDefine = yield getTxSid('defineAsset', handle);
    if (!isTxDefine) {
        (0, utils_1.log)(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit define`);
        return false;
    }
    const inputNumbers = '5';
    const assetBlindRules = { isAmountBlind: true };
    const issueAssetBuilder = yield api_1.Asset.issueAsset(walletInfo, derivedTokenCode, inputNumbers, assetBlindRules);
    const handleIssue = yield api_1.Transaction.submitTransaction(issueAssetBuilder);
    const isTxIssue = yield getTxSid('issue', handleIssue);
    if (!isTxIssue) {
        (0, utils_1.log)(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit issue`);
        return false;
    }
    (0, utils_1.log)('Issue Asset with secret amount Transaction handle:', handleIssue);
    yield (0, testHelpers_1.waitForBlockChange)();
    const issueTransactionStatus = yield api_1.Network.getTransactionStatus(handleIssue);
    const { response: issueResponse } = issueTransactionStatus;
    if (!issueResponse) {
        (0, utils_1.log)('ERROR issueTransactionStatus', issueTransactionStatus);
        return false;
    }
    const { Committed: IssueCommitted } = issueResponse;
    if (!Array.isArray(IssueCommitted)) {
        (0, utils_1.log)('ERROR could not get Commited from defineResponse, line 705');
        return false;
    }
    const confSid = yield IssueCommitted[1][0];
    const nonConfSid = yield IssueCommitted[1][1];
    const confUtxoResponse = yield api_1.Network.getUtxo(confSid);
    const nonConfUtxoResponse = yield api_1.Network.getUtxo(nonConfSid);
    const { response: confUtxo } = confUtxoResponse;
    const { response: nonConfUtxo } = nonConfUtxoResponse;
    const isNonConfidentialMatches = (nonConfUtxo === null || nonConfUtxo === void 0 ? void 0 : nonConfUtxo.utxo.record.amount.NonConfidential) === '10000';
    if (!isNonConfidentialMatches) {
        (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 778 ~ issueAndSendConfidentialAsset ~ isNonConfidentialMatches IS FALSE', isNonConfidentialMatches, nonConfUtxo === null || nonConfUtxo === void 0 ? void 0 : nonConfUtxo.utxo.record.amount.NonConfidential);
        return false;
    }
    const isConfidentiaExists = confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo.record.amount.Confidential;
    if (!isConfidentiaExists) {
        (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 782 ~ issueAndSendConfidentialAsset ~ isConfidentiaExists IS FALSE , confUtxo?.utxo.record.amount', isConfidentiaExists, confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo.record.amount);
        return false;
    }
    const ownerMemoDataResult = yield api_1.Network.getOwnerMemo(confSid);
    const { response: ownerMemoJson } = ownerMemoDataResult;
    if (!ownerMemoJson) {
        (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 794 ~ issueAndSendConfidentialAsset ~ there is not ownerMemo for confidential sid!');
        (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 797 ~ issueAndSendConfidentialAsset ~ ownerMemoDataResult', ownerMemoDataResult);
        return false;
    }
    const ownerMemo = Ledger.OwnerMemo.from_json(ownerMemoJson);
    const assetRecord = Ledger.ClientAssetRecord.from_json(confUtxo === null || confUtxo === void 0 ? void 0 : confUtxo.utxo);
    const decryptedRecord = Ledger.open_client_asset_record(assetRecord, ownerMemo.clone(), aliceKeyPair);
    const isDecryptedRecordCorrect = (decryptedRecord === null || decryptedRecord === void 0 ? void 0 : decryptedRecord.amount) === '5000000';
    if (!isDecryptedRecordCorrect) {
        (0, utils_1.log)('🚀 ~ file: integration.ts ~ line 815 ~ issueAndSendConfidentialAsset ~ isDecryptedRecordCorrect IS FALSE!, decryptedRecord', isDecryptedRecordCorrect, decryptedRecord);
    }
    const transferAmount = decryptedRecord === null || decryptedRecord === void 0 ? void 0 : decryptedRecord.amount;
    const numbersForPeter = bigNumber.fromWei(transferAmount, 6).toFormat(6);
    const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };
    const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: numbersForPeter }];
    const sendTransactionBuilder = yield api_1.Transaction.sendToMany(walletInfo, recieversInfo, derivedTokenCode, assetBlindRulesForSend);
    const handleSend = yield api_1.Transaction.submitTransaction(sendTransactionBuilder);
    const isTxSend = yield getTxSid('send', handleSend);
    if (!isTxSend) {
        (0, utils_1.log)(`🚀  ~ issueAndSendConfidentialAsset ~ Could not submit send`);
        return false;
    }
    const bobTxoSidsResult = yield api_1.Network.getOwnedSids(toWalletInfo.publickey);
    const { response: bobTxoSids } = bobTxoSidsResult;
    if (!bobTxoSids) {
        (0, utils_1.log)(`Could not retrieve the list of sids of the receiver. Response was: `, bobTxoSidsResult);
        return false;
    }
    const [newSid] = bobTxoSids.sort((a, b) => b - a);
    const bobUtxoDataResult = yield api_1.Network.getUtxo(newSid);
    const { response: bobUtxoResponse } = bobUtxoDataResult;
    if (!bobUtxoResponse) {
        (0, utils_1.log)('ERROR could not get bobUtxoResponse', bobUtxoDataResult);
        return false;
    }
    const bobMemoDataResult = yield api_1.Network.getOwnerMemo(newSid);
    const { response: bobMemoJson } = bobMemoDataResult;
    if (!bobMemoJson) {
        (0, utils_1.log)('could not get owner memo for the send to Bob transfer!', bobMemoDataResult);
        return false;
    }
    const bobOwnerMemo = Ledger.OwnerMemo.from_json(bobMemoJson);
    const bobAssetRecord = Ledger.ClientAssetRecord.from_json(bobUtxoResponse === null || bobUtxoResponse === void 0 ? void 0 : bobUtxoResponse.utxo);
    const bobDecryptedRecord = Ledger.open_client_asset_record(bobAssetRecord, bobOwnerMemo, bobKeyPair);
    const isBobDecryptedRecordCorrect = (bobDecryptedRecord === null || bobDecryptedRecord === void 0 ? void 0 : bobDecryptedRecord.amount) === '5000000';
    if (!isBobDecryptedRecordCorrect) {
        (0, utils_1.log)('🚀 ERROR ~ file: integration.ts ~ line 883 ~ issueAndSendConfidentialAsset ~ isBobDecryptedRecordCorrect', isBobDecryptedRecordCorrect, bobDecryptedRecord);
        return false;
    }
    const isAssetTypeCorrect = Ledger.asset_type_from_jsvalue(bobDecryptedRecord.asset_type) == derivedTokenCode;
    if (!isAssetTypeCorrect) {
        (0, utils_1.log)('🚀 ERROR ~ file: integration.ts ~ line 893 ~ issueAndSendConfidentialAsset ~ isAssetTypeCorrect', isAssetTypeCorrect, bobDecryptedRecord);
        return false;
    }
    return true;
});
exports.issueAndSendConfidentialAsset = issueAndSendConfidentialAsset;
// export const delegateFraTransactionSubmit = async () => {
//   log('////////////////  delegateFraTransactionSubmit //////////////// ');
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
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
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
//     log(`🚀  ~ delegateFraTransactionSubmit ~ Could not submit delegation`);
//     return false;
//   }
//   log('🚀  ~ delegateFraTransactionSubmit ~ waiting for 10 blocks before checking rewards');
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
//   log('🚀  ~ delegateFraTransactionSubmit ~ checking rewards now');
//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);
//   const isRewardsAdded = Number(delegateInfo.rewards) > 0;
//   if (!isRewardsAdded) {
//     log('🚀  ~ delegateFraTransactionSubmit ~ There is no rewards yet! , delegateInfo', delegateInfo);
//     return false;
//   }
//   log('🚀  ~ delegateFraTransactionSubmit ~ accumulated rewards ', delegateInfo.rewards);
//   return true;
// };
// export const delegateFraTransactionAndClaimRewards = async () => {
//   log('////////////////  delegateFraTransactionAndClaimRewards //////////////// ');
//   const password = '123';
//   const Ledger = await getLedger();
//   const pkey = mainFaucet;
//   const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);
//   const toWalletInfo = await KeypairApi.createKeypair(password);
//   log(
//     '🚀 ~ file: integration.ts ~ line 1096 ~ delegateFraTransactionAndClaimRewards ~ toWalletInfo',
//     toWalletInfo,
//   );
//   const numbersToDelegate = '1000001';
//   const numbersToSend = '1000010';
//   const fraCode = await AssetApi.getFraAssetCode();
//   const assetBlindRules: AssetApi.AssetBlindRules = { isTypeBlind: false, isAmountBlind: false };
//   const isFundSuccesfull = await sendFromFaucetToAccount(walletInfo, toWalletInfo, numbersToSend);
//   if (!isFundSuccesfull) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not fund account`);
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
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit delegation`);
//     return false;
//   }
//   log('delegateFraTransactionAndClaimRewards - waiting for 11 blocks before checking rewards');
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
//   log('delegateFraTransactionAndClaimRewards - checking rewards now');
//   const delegateInfo = await StakingApi.getDelegateInfo(toWalletInfo.address);
//   const amountToClaim = delegateInfo.rewards;
//   const isRewardsAdded = Number(amountToClaim) > 0;
//   if (!isRewardsAdded) {
//     log(
//       'delegateFraTransactionAndClaimRewards - There is no rewards yet! , delegateInfo',
//       delegateInfo,
//     );
//     return false;
//   }
//   log('delegateFraTransactionAndClaimRewards - accumulated rewards ', amountToClaim);
//   // claim
//   const balanceBefore = await AccountApi.getBalanceInWei(toWalletInfo);
//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim', balanceBefore);
//   const transactionBuilderClaim = await StakingApi.claim(toWalletInfo, amountToClaim);
//   const resultHandleClaim = await TransactionApi.submitTransaction(transactionBuilderClaim);
//   // w 10
//   const isTxClaimed = await getTxSid('clam', resultHandleClaim);
//   if (!isTxClaimed) {
//     log(`🚀 ~ delegateFraTransactionAndClaimRewards ~ Could not submit claim`);
//     return false;
//   }
//   log(
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
//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter', balanceAfter);
//   const balanceBeforeBN = bigNumber.create(balanceBefore);
//   const balanceAfterBN = bigNumber.create(balanceAfter);
//   const isClaimSuccessfull = balanceAfterBN.gte(balanceBeforeBN);
//   log('🚀 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull', isClaimSuccessfull);
//   return isClaimSuccessfull;
// };
//# sourceMappingURL=integration.js.map