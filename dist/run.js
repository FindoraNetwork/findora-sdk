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
exports.createTestBarsMulti = exports.issueCustomAsset = exports.defineCustomAsset = exports.getSidsForAsset = exports.unstakeFraTransactionSubmit = exports.delegateFraTransactionAndClaimRewards = exports.delegateFraTransactionSubmit = void 0;
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
var dotenv_1 = __importDefault(require("dotenv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var api_1 = require("./api");
var testHelpers_1 = require("./evm/testHelpers");
var Sdk_1 = __importDefault(require("./Sdk"));
var providers_1 = require("./services/cacheStore/providers");
var Fee = __importStar(require("./services/fee"));
var fee_1 = require("./services/fee");
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var utils_1 = require("./services/utils");
var UtxoHelper = __importStar(require("./services/utxoHelper"));
// import * as TMI from './tripleMasking/tripleMasking.integration';
dotenv_1.default.config();
var waitingTimeBeforeCheckTxStatus = 19000;
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    // hostUrl: 'https://prod-mainnet.prod.findora.org',
    // hostUrl: 'https://prod-testnet.prod.findora.org', // anvil balance!
    // hostUrl: 'https://dev-staging.dev.findora.org',
    // hostUrl: 'https://dev-evm.dev.findora.org',
    hostUrl: 'http://127.0.0.1',
    // hostUrl: 'https://dev-qa02.dev.findora.org',
    // hostUrl: 'https://prod-forge.prod.findora.org', // forge balance!
    // cacheProvider: FileCacheProvider,
    // hostUrl: 'https://dev-mainnetmock.dev.findora.org', //works but have 0 balance
    // hostUrl: 'https://dev-qa01.dev.findora.org',
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
/**
 * This file is a developer "sandbox". You can debug existing methods here, or play with new and so on.
 * It is executed by running `yarn start` - feel free to play with it and change it.
 * Examples here might not always be working, again - that is just a sandbox for convenience.
 */
Sdk_1.default.init(sdkEnv);
var password = '123';
console.log("Connecting to \"" + sdkEnv.hostUrl + "\"");
var _a = process.env, _b = _a.CUSTOM_ASSET_CODE, CUSTOM_ASSET_CODE = _b === void 0 ? '' : _b, _c = _a.PKEY_MINE, PKEY_MINE = _c === void 0 ? '' : _c, _d = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE, PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE = _d === void 0 ? '' : _d, _e = _a.PKEY_MINE2, PKEY_MINE2 = _e === void 0 ? '' : _e, _f = _a.PKEY_MINE3, PKEY_MINE3 = _f === void 0 ? '' : _f, _g = _a.PKEY_LOCAL_FAUCET, PKEY_LOCAL_FAUCET = _g === void 0 ? '' : _g, _h = _a.ENG_PKEY, ENG_PKEY = _h === void 0 ? '' : _h, _j = _a.PKEY_LOCAL_TRIPLE_MASKING, PKEY_LOCAL_TRIPLE_MASKING = _j === void 0 ? '' : _j, _k = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING, PKEY_LOCAL_FAUCET_MNEMONIC_STRING = _k === void 0 ? '' : _k, _l = _a.M_STRING, M_STRING = _l === void 0 ? '' : _l, _m = _a.FRA_ADDRESS, FRA_ADDRESS = _m === void 0 ? '' : _m, _o = _a.ETH_PRIVATE, ETH_PRIVATE = _o === void 0 ? '' : _o, _p = _a.ETH_ADDRESS, ETH_ADDRESS = _p === void 0 ? '' : _p;
var mainFaucet = PKEY_LOCAL_FAUCET;
var CustomAssetCode = CUSTOM_ASSET_CODE;
var myAbarAnonKeys = {
    axfrPublicKey: 'RFuVMPlD0pVcBlRIDKCwp5WNliqjGF4RG_r-SCzajOw=',
    axfrSpendKey: 'lgwn_gnSNPEiOmL1Tlb_nSzNcPkZa4yUqiIsR4B_skb4jYJBFjaRQwUlTi22XO3cOyxSbiv7k4l68kj2jzOVCURblTD5Q9KVXAZUSAygsKeVjZYqoxheERv6_kgs2ozs',
    axfrViewKey: '-I2CQRY2kUMFJU4ttlzt3DssUm4r-5OJevJI9o8zlQk=',
};
var myGivenCommitmentsList = [
    'CLHHKFVEejbeT4ZyoyabuPeg6ktkZfxoK4VaZ4ewE7T9',
    'DtJx2dVmXXiDaQS7G6xpNeUhEwH7EsuimLUf1Tqd78LH',
    '9kpQwq1UqqonX73HgreJcvXEj9SxN5mh55AhBdsSXnhZ',
];
/**
 * A simple example - how to use SDK to get FRA assset code
 */
var getFraAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 1:
                assetCode = _a.sent();
                console.log('FRA assetCode IS', assetCode);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get FRA balance
 */
var getFraBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, pkey, mString, mm, newWallet, faucetWalletInfo, balance, balanceNew, fraCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '12345';
                pkey = PKEY_LOCAL_FAUCET;
                mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE;
                mm = mString.split(' ');
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 1:
                newWallet = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                faucetWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(faucetWalletInfo)];
            case 3:
                balance = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(newWallet)];
            case 4:
                balanceNew = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 5:
                fraCode = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 95 ~ getFraBalance ~ fraCode', fraCode);
                console.log('\n');
                console.log('faucetWalletInfo.address (from pKey)', faucetWalletInfo.address);
                console.log('faucetWalletInfo.privateStr', faucetWalletInfo.privateStr);
                console.log('\n');
                console.log('newWallet.address (from mnenmonic)', newWallet.address);
                console.log('newWallet.privateStr', newWallet.privateStr);
                console.log('\n');
                console.log('balance from restored from pkey IS', balance);
                console.log('balance from restored using mnemonic IS', balanceNew);
                console.log('\n');
                console.log('\n');
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get custom asset balance
 */
var getCustomAssetBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, pkey, customAssetCode, walletInfo, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '123';
                pkey = PKEY_MINE;
                customAssetCode = CustomAssetCode;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo, customAssetCode)];
            case 2:
                balance = _a.sent();
                console.log('balance IS', balance);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Define a custom asset
 */
var defineCustomAssetRandom = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, assetCode, walletInfo, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_LOCAL_FAUCET;
                password = '123';
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                assetCode = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 110 ~ defineCustomAsset ~ assetCode', assetCode);
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, assetCode)];
            case 3:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 4:
                handle = _a.sent();
                console.log('our new asset created, handle - ! ! ', handle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Issue custom asset
 */
var issueCustomAssetGiven = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, password, walletInfo, assetBlindRules, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_LOCAL_FAUCET;
                customAssetCode = CustomAssetCode;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                assetBlindRules = { isAmountBlind: false };
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, customAssetCode, '5', assetBlindRules)];
            case 2:
                assetBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(assetBuilder)];
            case 3:
                handle = _a.sent();
                console.log('our issued tx handle IS', handle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get state commitment object (for example if we need to get current block height)
 */
var getStateCommitment = function () { return __awaiter(void 0, void 0, void 0, function () {
    var stateCommitment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Network.getStateCommitment()];
            case 1:
                stateCommitment = _a.sent();
                console.log('stateCommitment', stateCommitment);
                return [2 /*return*/];
        }
    });
}); };
var getValidatorList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var formattedVlidators;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Staking.getValidatorList()];
            case 1:
                formattedVlidators = _a.sent();
                console.log('formattedVlidators', formattedVlidators);
                return [2 /*return*/];
        }
    });
}); };
var getDelegateInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, delegateInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_LOCAL_FAUCET;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(walletInfo.address)];
            case 2:
                delegateInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 192 ~ getDelegateInfo ~ delegateInfo', delegateInfo);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get transfer operation builder (before sending a tx)
 */
var getTransferBuilderOperation = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, password, pkey, walletInfo, sidsResult, sids, utxoDataList, fraCode, amount, sendUtxoList, utxoInputsInfo, minimalFee, toPublickey, transferOperationBuilder, recieversInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                password = '123';
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 3:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, sids)];
            case 4:
                utxoDataList = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 5:
                fraCode = _a.sent();
                amount = BigInt(3);
                sendUtxoList = UtxoHelper.getSendUtxo(fraCode, amount, utxoDataList);
                return [4 /*yield*/, UtxoHelper.addUtxoInputs(sendUtxoList)];
            case 6:
                utxoInputsInfo = _a.sent();
                minimalFee = ledger.fra_get_minimal_fee();
                toPublickey = ledger.fra_get_dest_pubkey();
                return [4 /*yield*/, Fee.getEmptyTransferBuilder()];
            case 7:
                transferOperationBuilder = _a.sent();
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, fraCode, transferOperationBuilder)];
            case 8:
                trasferOperation = _a.sent();
                console.log('trasferOperation!', trasferOperation);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Create a wallet info object (a keypair)
 */
var createNewKeypair = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '123';
                return [4 /*yield*/, api_1.Keypair.getMnemonic(24)];
            case 1:
                mm = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 232 ~ createNewKeypair ~ new mnemonic', mm.join(' '));
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 2:
                walletInfo = _a.sent();
                console.log('new wallet info', walletInfo);
                return [2 /*return*/, walletInfo];
        }
    });
}); };
/**
 * Send fra to a single address
 */
var transferFraToSingleAddress = function (amount) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, destAddress, toWalletInfo, balanceOld, sidsResult, sids, fraCode, assetCode, assetBlindRules, transactionBuilder, resultHandle, submitResult, sidsResultNew, sidsNew, sortedSidsNew, balanceNew;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                destAddress = walletInfo.address;
                return [4 /*yield*/, api_1.Keypair.getAddressPublicAndKey(destAddress)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 3:
                balanceOld = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 287 ~ transferFraToSingleAddress ~ balanceOld', balanceOld);
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 4:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('no sids!');
                }
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 5:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, amount, assetCode, assetBlindRules)];
            case 6:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 7:
                resultHandle = _a.sent();
                console.log('send fra result handle!!', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 8:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 9:
                submitResult = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1265 ~ barToAbar ~ submitResult after waiting', submitResult);
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 10:
                sidsResultNew = _a.sent();
                sidsNew = sidsResultNew.response;
                if (!sidsNew) {
                    throw new Error('no sids!');
                }
                sortedSidsNew = sids.sort(function (a, b) { return b - a; });
                console.log('🚀 ~ file: run.ts ~ line 335 ~ transferFraToSingleAddress ~ sortedSidsNew', sortedSidsNew);
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 11:
                balanceNew = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 307 ~ transferFraToSingleAddress ~ balanceNew', balanceNew);
                return [2 /*return*/];
        }
    });
}); };
var testTransferToYourself = function () { return __awaiter(void 0, void 0, void 0, function () {
    var amounts, _i, amounts_1, amount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amounts = ['0.3'];
                _i = 0, amounts_1 = amounts;
                _a.label = 1;
            case 1:
                if (!(_i < amounts_1.length)) return [3 /*break*/, 4];
                amount = amounts_1[_i];
                console.log("Sending amount of " + amount + " FRA");
                return [4 /*yield*/, transferFraToSingleAddress(amount)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Send fra to a single recepient
 */
var transferFraToSingleRecepient = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkeyMine2, password, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_LOCAL_FAUCET;
                toPkeyMine2 = PKEY_MINE2;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine2, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '2', assetCode, assetBlindRules)];
            case 4:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 5:
                resultHandle = _a.sent();
                console.log('send fra result handle!!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Send fra to multiple recepients
 */
var transferFraToMultipleRecepients = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkeyMine2, toPkeyMine3, password, walletInfo, toWalletInfoMine2, toWalletInfoMine3, fraCode, assetCode, assetBlindRules, recieversInfo, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                toPkeyMine2 = PKEY_MINE2;
                toPkeyMine3 = PKEY_MINE3;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine2, password)];
            case 2:
                toWalletInfoMine2 = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine3, password)];
            case 3:
                toWalletInfoMine3 = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                recieversInfo = [
                    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
                    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
                ];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules)];
            case 5:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 6:
                resultHandle = _a.sent();
                console.log('send to multiple receipient result handle!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Send custom asset to a single recepient
 */
var transferCustomAssetToSingleRecepient = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkey, customAssetCode, password, walletInfo, toWalletInfo, assetCode, assetBlindRules, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                toPkey = PKEY_MINE2;
                customAssetCode = CustomAssetCode;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                assetCode = customAssetCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '0.1', assetCode, assetBlindRules)];
            case 3:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 4:
                resultHandle = _a.sent();
                console.log('send custom result handle', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Send custom asset to multiple recepients
 */
var transferCustomAssetToMultipleRecepients = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkeyMine2, toPkeyMine3, password, walletInfo, toWalletInfoMine2, toWalletInfoMine3, assetCode, assetBlindRules, recieversInfo, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                toPkeyMine2 = PKEY_MINE2;
                toPkeyMine3 = PKEY_MINE3;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine2, password)];
            case 2:
                toWalletInfoMine2 = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine3, password)];
            case 3:
                toWalletInfoMine3 = _a.sent();
                assetCode = CustomAssetCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                recieversInfo = [
                    { reciverWalletInfo: toWalletInfoMine2, amount: '2' },
                    { reciverWalletInfo: toWalletInfoMine3, amount: '3' },
                ];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules)];
            case 4:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 5:
                resultHandle = _a.sent();
                console.log('send custom result handle!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get custom asset details
 */
var getCustomAssetDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
    var customAssetCode, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customAssetCode = CustomAssetCode;
                return [4 /*yield*/, api_1.Asset.getAssetDetails(customAssetCode)];
            case 1:
                result = _a.sent();
                console.log('get custom asset details !', result);
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get transaction status
 */
var getTransactionStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var h, txStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                h = 'YOUR_TX_HASH';
                return [4 /*yield*/, api_1.Network.getTransactionStatus(h)];
            case 1:
                txStatus = _a.sent();
                console.log('transaction status', JSON.stringify(txStatus, null, 2));
                return [2 /*return*/];
        }
    });
}); };
/**
 * get block details
 */
var getBlockDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
    var height, blockDetailsResult, response, block;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                height = 45;
                return [4 /*yield*/, api_1.Network.getBlock(height)];
            case 1:
                blockDetailsResult = _a.sent();
                console.log('blockDetails!', JSON.stringify(blockDetailsResult, null, 2));
                response = blockDetailsResult.response;
                block = response === null || response === void 0 ? void 0 : response.result;
                console.log('block', block === null || block === void 0 ? void 0 : block.block.header.height);
                return [2 /*return*/];
        }
    });
}); };
// get tx hash details
var myFunc14 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var h, dataResult, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                h = 'YOUR_TX_HASH';
                return [4 /*yield*/, api_1.Network.getHashSwap(h)];
            case 1:
                dataResult = _a.sent();
                response = dataResult.response;
                console.log(response === null || response === void 0 ? void 0 : response.result.txs);
                return [2 /*return*/];
        }
    });
}); };
// get tx list hash details
var myFunc15 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var h, pkey, password, walletInfo, dataResult, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                h = 'YOUR_TX_HASH';
                pkey = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getTxList(walletInfo.address, 'from')];
            case 2:
                dataResult = _a.sent();
                response = dataResult.response;
                console.log('response!!!', JSON.stringify(response, null, 2));
                return [2 /*return*/];
        }
    });
}); };
var myFunc16 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, txList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Transaction.getTxList(walletInfo.address, 'from')];
            case 2:
                txList = _a.sent();
                console.log('txList', txList);
                return [2 /*return*/];
        }
    });
}); };
var myFunc17 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, assets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getCreatedAssets(walletInfo.address)];
            case 2:
                assets = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 453 ~ myFunc17 ~ assets', assets);
                return [2 /*return*/];
        }
    });
}); };
var myFunc18 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, sids;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getRelatedSids(walletInfo.publickey)];
            case 2:
                sids = _a.sent();
                console.log('sids!!', sids);
                return [2 /*return*/];
        }
    });
}); };
// s3 cache
var myFuncS3 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, UTXO_CACHE_BUCKET_NAME, UTXO_CACHE_KEY_NAME, accessKeyId, secretAccessKey, cacheBucketName, cacheItemKey, s3Params, s3, readRes, error_1, e, existingContent, res, myBody, error_2, e;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = process.env, AWS_ACCESS_KEY_ID = _a.AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY = _a.AWS_SECRET_ACCESS_KEY, UTXO_CACHE_BUCKET_NAME = _a.UTXO_CACHE_BUCKET_NAME, UTXO_CACHE_KEY_NAME = _a.UTXO_CACHE_KEY_NAME;
                accessKeyId = AWS_ACCESS_KEY_ID || '';
                secretAccessKey = AWS_SECRET_ACCESS_KEY || '';
                cacheBucketName = UTXO_CACHE_BUCKET_NAME || '';
                cacheItemKey = UTXO_CACHE_KEY_NAME || '';
                s3Params = {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                };
                s3 = new s3_1.default(s3Params);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3
                        .getObject({
                        Bucket: cacheBucketName,
                        Key: cacheItemKey,
                    })
                        .promise()];
            case 2:
                readRes = _d.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                e = error_1;
                console.log('Error!', e.message);
                return [3 /*break*/, 4];
            case 4:
                console.log('readRes :)', (_b = readRes === null || readRes === void 0 ? void 0 : readRes.Body) === null || _b === void 0 ? void 0 : _b.toString());
                existingContent = (_c = readRes === null || readRes === void 0 ? void 0 : readRes.Body) === null || _c === void 0 ? void 0 : _c.toString('utf8');
                myBody = existingContent + "\nFUNCTION STARTED: " + new Date();
                _d.label = 5;
            case 5:
                _d.trys.push([5, 7, , 8]);
                return [4 /*yield*/, s3
                        .putObject({
                        Bucket: cacheBucketName,
                        Key: cacheItemKey,
                        Body: myBody,
                    })
                        .promise()];
            case 6:
                res = _d.sent();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _d.sent();
                e = error_2;
                console.log('Error!', e.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var delegateFraTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, Ledger, pkey, walletInfo, toWalletInfo, fraCode, assetBlindRules, numbersToSend, numbersToDelegate, transactionBuilderSend, resultHandleSend, balanceAfterUnstake, delegationTargetPublicKey, delegationTargetAddress, formattedVlidators, validatorAddress, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, delegateInfo, isRewardsAdded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  delegateFraTransactionSubmit //////////////// ');
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
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbersToSend, fraCode, assetBlindRules)];
            case 5:
                transactionBuilderSend = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderSend)];
            case 6:
                resultHandleSend = _a.sent();
                console.log('send fra result handle!!', resultHandleSend);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 9:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 10:
                balanceAfterUnstake = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 605 ~ delegateFraTransactionSubmit ~ balanceAfterUnstake', balanceAfterUnstake);
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
                console.log('🚀 ~ file: run.ts ~ line 600 ~ delegateFraTransactionSubmit ~ transactionBuilder', transactionBuilder);
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 14:
                resultHandle = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);
                console.log('🚀 ~ file: integration.ts ~ line 601 ~ delegateFraTransactionSubmit ~ resultHandle', resultHandle);
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
                console.log('🚀 ~ file: run.ts ~ line 472 ~ delegateFraTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandle + ". Response was: ", transactionStatus);
                    return [2 /*return*/, false];
                }
                console.log('waiting for 5 blocks before checking rewards');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _a.sent();
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
                console.log('checking rewards now');
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(toWalletInfo.address)];
            case 24:
                delegateInfo = _a.sent();
                isRewardsAdded = Number(delegateInfo.rewards) > 0;
                if (!isRewardsAdded) {
                    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
                    return [2 /*return*/, false];
                }
                console.log('accumulated rewards ', delegateInfo.rewards);
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
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 17:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 19:
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
            case 20:
                balanceAfterDelegate = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterDelegate', balanceAfterDelegate);
                console.log('waiting for 5 blocks before checking rewards');
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
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 25:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 26:
                _a.sent();
                console.log('checking rewards now');
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(toWalletInfo.address)];
            case 27:
                delegateInfo = _a.sent();
                isRewardsAdded = Number(delegateInfo.rewards) > 0;
                if (!isRewardsAdded) {
                    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
                    return [2 /*return*/, false];
                }
                console.log('accumulated rewards ', delegateInfo.rewards);
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 28:
                balanceBefore = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 801 ~ delegateFraTransactionAndClaimRewards ~ balanceBeforeClaim', balanceBefore);
                amountToClaim = delegateInfo.rewards;
                return [4 /*yield*/, api_1.Staking.claim(toWalletInfo, amountToClaim)];
            case 29:
                transactionBuilderClaim = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderClaim)];
            case 30:
                resultHandleClaim = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ delegateFraTransactionAndClaimRewards ~ resultHandleClaim', resultHandle);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 31:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 32:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 33:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 34:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 35:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 36:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandleClaim)];
            case 37:
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
            case 38:
                balanceAfter = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 845 ~ delegateFraTransactionAndClaimRewards ~ balanceAfter', balanceAfter);
                isClaimSuccessfull = Number(balanceAfter) > Number(balanceBefore);
                console.log('🚀 ~ file: run.ts ~ line 877 ~ delegateFraTransactionAndClaimRewards ~ isClaimSuccessfull', isClaimSuccessfull);
                return [2 /*return*/, isClaimSuccessfull];
        }
    });
}); };
exports.delegateFraTransactionAndClaimRewards = delegateFraTransactionAndClaimRewards;
var unstakeFraTransactionSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, Ledger, pkey, walletInfo, toWalletInfo, fraCode, assetBlindRules, numbersToSend, numbersToDelegate, transactionBuilderSend, resultHandleSend, transactionStatusSend, sendResponse, Committed, txnSID, balanceAfterSend, delegationTargetPublicKey, delegationTargetAddress, formattedVlidators, validatorAddress, transactionBuilderDelegate, resultHandleDelegate, transactionStatusDelegate, delegateResponse, CommittedDelegate, txnSIDDelegate, delegateInfo, isRewardsAdded, balanceBeforeUnstake, transactionBuilderUnstake, resultHandleUnstake, balanceAfterUnstake, isUnstakeSuccessfull;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('////////////////  unstakeFraTransactionSubmit //////////////// ');
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
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, numbersToSend, fraCode, assetBlindRules)];
            case 5:
                transactionBuilderSend = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderSend)];
            case 6:
                resultHandleSend = _a.sent();
                console.log('send fra result handle!!', resultHandleSend);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 11:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 12:
                _a.sent();
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandleSend)];
            case 13:
                transactionStatusSend = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatusSend);
                sendResponse = transactionStatusSend.response;
                if (!sendResponse) {
                    return [2 /*return*/, false];
                }
                Committed = sendResponse.Committed;
                if (!Array.isArray(Committed)) {
                    return [2 /*return*/, false];
                }
                txnSID = Committed && Array.isArray(Committed) ? Committed[0] : null;
                console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSID', txnSID);
                if (!txnSID) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandleSend + ". Response was: ", transactionStatusSend);
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 14:
                balanceAfterSend = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ delegateFraTransactionAndClaimRewards ~ balanceAfterSend', balanceAfterSend);
                delegationTargetPublicKey = Ledger.get_delegation_target_address();
                return [4 /*yield*/, api_1.Keypair.getAddressByPublicKey(delegationTargetPublicKey)];
            case 15:
                delegationTargetAddress = _a.sent();
                return [4 /*yield*/, api_1.Staking.getValidatorList()];
            case 16:
                formattedVlidators = _a.sent();
                validatorAddress = formattedVlidators.validators[0].addr;
                return [4 /*yield*/, api_1.Staking.delegate(toWalletInfo, delegationTargetAddress, numbersToDelegate, fraCode, validatorAddress, assetBlindRules)];
            case 17:
                transactionBuilderDelegate = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderDelegate', transactionBuilderDelegate);
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderDelegate)];
            case 18:
                resultHandleDelegate = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate', resultHandleDelegate);
                console.log('🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleDelegate', resultHandleDelegate);
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
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandleDelegate)];
            case 25:
                transactionStatusDelegate = _a.sent();
                console.log('Retrieved transaction status response:', transactionStatusDelegate);
                delegateResponse = transactionStatusDelegate.response;
                if (!delegateResponse) {
                    return [2 /*return*/, false];
                }
                CommittedDelegate = delegateResponse.Committed;
                if (!Array.isArray(CommittedDelegate)) {
                    return [2 /*return*/, false];
                }
                txnSIDDelegate = CommittedDelegate && Array.isArray(CommittedDelegate) ? CommittedDelegate[0] : null;
                console.log('🚀 ~ file: run.ts ~ line 472 ~ unstakeFraTransactionSubmit ~ txnSIDDelegate', txnSIDDelegate);
                if (!txnSIDDelegate) {
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle " + resultHandleDelegate + ". Response was: ", transactionStatusDelegate);
                    return [2 /*return*/, false];
                }
                console.log('waiting for 5 blocks before checking rewards');
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 26:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 27:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 28:
                _a.sent();
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
                console.log('checking rewards now');
                return [4 /*yield*/, api_1.Staking.getDelegateInfo(toWalletInfo.address)];
            case 33:
                delegateInfo = _a.sent();
                isRewardsAdded = Number(delegateInfo.rewards) > 0;
                if (!isRewardsAdded) {
                    console.log('There is no rewards yet! , delegateInfo', delegateInfo);
                    return [2 /*return*/, false];
                }
                console.log('accumulated rewards ', delegateInfo.rewards);
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 34:
                balanceBeforeUnstake = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceBeforeUnstake', balanceBeforeUnstake);
                return [4 /*yield*/, api_1.Staking.unStake(toWalletInfo, numbersToDelegate, validatorAddress)];
            case 35:
                transactionBuilderUnstake = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 600 ~ unstakeFraTransactionSubmit ~ transactionBuilderUnstake', transactionBuilderUnstake);
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilderUnstake)];
            case 36:
                resultHandleUnstake = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 599 ~ unstakeFraTransactionSubmit ~ resultHandle', resultHandleUnstake);
                console.log('🚀 ~ file: integration.ts ~ line 601 ~ unstakeFraTransactionSubmit ~ resultHandleUnstake', resultHandleUnstake);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 37:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 38:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 39:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 40:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 41:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 42:
                _a.sent();
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 43:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo)];
            case 44:
                balanceAfterUnstake = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 706 ~ unstakeFraTransactionSubmit ~ balanceAfterUnstake', balanceAfterUnstake);
                isUnstakeSuccessfull = Number(balanceAfterUnstake) > Number(balanceBeforeUnstake);
                console.log('🚀 ~ file: run.ts ~ line 877 ~ unstakeFraTransactionSubmit ~ isUnstakeSuccessfull', isUnstakeSuccessfull);
                return [2 /*return*/, isUnstakeSuccessfull];
        }
    });
}); };
exports.unstakeFraTransactionSubmit = unstakeFraTransactionSubmit;
var sendEvmToAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fraAddress, amount, ethPrivate, ethAddress;
    return __generator(this, function (_a) {
        fraAddress = FRA_ADDRESS;
        amount = '1';
        ethPrivate = ETH_PRIVATE;
        ethAddress = ETH_ADDRESS;
        return [2 /*return*/];
    });
}); };
var ethProtocol = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, methodName, existingBlockHashToCheck, extraParams, payload, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'http://127.0.0.1:8545';
                methodName = 'eth_getBlockByHash';
                existingBlockHashToCheck = '0x1af723767d06ef414e7aa6d7df2745cec9e47c315ed754a68d0a2d5cc2468077';
                extraParams = [existingBlockHashToCheck, true];
                payload = {
                    method: methodName,
                    params: extraParams,
                };
                return [4 /*yield*/, api_1.Network.sendRpcCall(url, payload)];
            case 1:
                result = _a.sent();
                console.log("\uD83D\uDE80 ~ file: run.ts ~ line 1154 ~ " + methodName + " ~ result", result);
                return [2 /*return*/];
        }
    });
}); };
var getAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var myAnonKeys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.TripleMasking.genAnonKeys()];
            case 1:
                myAnonKeys = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1149 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
                return [2 /*return*/];
        }
    });
}); };
var createTestBars = function (senderOne) {
    if (senderOne === void 0) { senderOne = PKEY_MINE; }
    return __awaiter(void 0, void 0, void 0, function () {
        var password, pkey, toPkeyMine, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, i, amount, transactionBuilder, resultHandle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('////////////////  Create Test Bars //////////////// ');
                    password = '1234';
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
                    if (!(i < 5)) return [3 /*break*/, 9];
                    amount = (0, utils_1.getRandomNumber)(1, 9);
                    console.log('🚀 ~ !! file: run.ts ~ line 1199 ~ createTestBars ~ amount', amount);
                    return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, "0.5" + amount, assetCode, assetBlindRules)];
                case 5:
                    transactionBuilder = _a.sent();
                    return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
                case 6:
                    resultHandle = _a.sent();
                    console.log('send fra result handle!!', resultHandle);
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9: return [2 /*return*/, true];
            }
        });
    });
};
var getSidsForAsset = function (senderOne, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var walletInfo, sids, sidsResult, utxoDataList, customAssetSids, _i, utxoDataList_1, utxoItem, utxoAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("//////////////// Get sids for asset " + assetCode + " //////////////// ");
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(senderOne, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 2:
                sids = (_a.sent()).response;
                sidsResult = sids;
                if (!sidsResult) {
                    console.log('ERROR no sids available');
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, sidsResult)];
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
                return [2 /*return*/, customAssetSids];
        }
    });
}); };
exports.getSidsForAsset = getSidsForAsset;
var barToAbar = function (sids, pkey) {
    if (pkey === void 0) { pkey = PKEY_MINE; }
    return __awaiter(void 0, void 0, void 0, function () {
        var password, walletInfo, sortedSids, anonKeys, _a, transactionBuilder, barToAbarData, usedSids, resultHandle, givenCommitments, _i, givenCommitments_1, givenCommitment, balances;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    password = '1234';
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
                case 1:
                    walletInfo = _b.sent();
                    sortedSids = sids;
                    anonKeys = __assign({}, myAbarAnonKeys);
                    console.log('🚀 ~file: run.ts ~ line 1202 ~ barToAbar ~ anonKeys receiver', anonKeys);
                    return [4 /*yield*/, api_1.TripleMasking.barToAbar(walletInfo, sortedSids, anonKeys.axfrPublicKey)];
                case 2:
                    _a = _b.sent(), transactionBuilder = _a.transactionBuilder, barToAbarData = _a.barToAbarData, usedSids = _a.sids;
                    console.log('🚀 ~ file: run.ts ~ line 1187 ~ barToAbar barToAbatData', JSON.stringify(barToAbarData, null, 2));
                    console.log('🚀 ~ file: run.ts ~ line 1188 ~ barToAbar usedSids', usedSids.join(','));
                    return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
                case 3:
                    resultHandle = _b.sent();
                    console.log('send bar to abar result handle!!', resultHandle);
                    givenCommitments = barToAbarData.commitments;
                    return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
                case 5:
                    _b.sent();
                    _i = 0, givenCommitments_1 = givenCommitments;
                    _b.label = 6;
                case 6:
                    if (!(_i < givenCommitments_1.length)) return [3 /*break*/, 9];
                    givenCommitment = givenCommitments_1[_i];
                    return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment])];
                case 7:
                    balances = _b.sent();
                    console.log('🚀 ~ file: run.ts ~ line 1291 ~ barToAbar ~ balances for the new commitments', JSON.stringify(balances, null, 2));
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/, givenCommitments];
            }
        });
    });
};
var barToAbarAmount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, pkey, walletInfo, anonKeys, amount, assetCode, _a, transactionBuilder, barToAbarData, usedSids, resultHandle, givenCommitments, _i, givenCommitments_2, givenCommitment, balances;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                password = '1234';
                pkey = PKEY_MINE;
                return [4 /*yield*/, createTestBars(pkey)];
            case 1:
                _b.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _b.sent();
                anonKeys = __assign({}, myAbarAnonKeys);
                console.log('🚀 ~file: run.ts ~ line 1202 ~ barToAbar ~ anonKeys receiver', anonKeys);
                amount = '31.23';
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                assetCode = _b.sent();
                return [4 /*yield*/, api_1.TripleMasking.barToAbarAmount(walletInfo, amount, assetCode, anonKeys.axfrPublicKey)];
            case 4:
                _a = _b.sent(), transactionBuilder = _a.transactionBuilder, barToAbarData = _a.barToAbarData, usedSids = _a.sids;
                console.log('🚀 ~ file: run.ts ~ line 1187 ~ barToAbar barToAbatData', JSON.stringify(barToAbarData, null, 2));
                console.log('🚀 ~ file: run.ts ~ line 1188 ~ barToAbar usedSids', usedSids.join(','));
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 5:
                resultHandle = _b.sent();
                console.log('send bar to abar result handle!!', resultHandle);
                givenCommitments = barToAbarData.commitments;
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 6:
                _b.sent();
                _i = 0, givenCommitments_2 = givenCommitments;
                _b.label = 7;
            case 7:
                if (!(_i < givenCommitments_2.length)) return [3 /*break*/, 10];
                givenCommitment = givenCommitments_2[_i];
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, [givenCommitment])];
            case 8:
                balances = _b.sent();
                console.log('🚀 ~ file: run.ts ~ line 1291 ~ barToAbar ~ balances for the new commitments', JSON.stringify(balances, null, 2));
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10: return [2 /*return*/, givenCommitments];
        }
    });
}); };
var validateUnspent = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitment, axfrSecretKey, ownedAbarsResponse, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isNullifierHashSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitment = 'ju2DbSDQWKown4so0h4Sijny_jxyHagKliC-zXIyeGY=';
                axfrSecretKey = anonKeys.axfrSpendKey;
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 1:
                ownedAbarsResponse = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1233 ~ validateUnspent ~ ownedAbarsResponse', JSON.stringify(ownedAbarsResponse, null, 2));
                ownedAbarItem = ownedAbarsResponse[0];
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, api_1.TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrSecretKey)];
            case 2:
                hash = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1249 ~ validateUnspent ~ hash', hash);
                return [4 /*yield*/, api_1.TripleMasking.isNullifierHashSpent(hash)];
            case 3:
                isNullifierHashSpent = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1279 ~ validateUnspent ~ isNullifierHashSpent', isNullifierHashSpent);
                return [2 /*return*/];
        }
    });
}); };
var getUnspentAbars = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, unspentAbars;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitmentsList = ['ju2DbSDQWKown4so0h4Sijny_jxyHagKliC-zXIyeGY='];
                return [4 /*yield*/, api_1.TripleMasking.getUnspentAbars(anonKeys, givenCommitmentsList)];
            case 1:
                unspentAbars = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1291 ~ getUnspentAbars ~ unspentAbars', unspentAbars);
                return [2 /*return*/];
        }
    });
}); };
var getAbarBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = {
                    axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
                    axfrSpendKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
                    axfrViewKey: '',
                    name: 'AnonWallet2',
                };
                givenCommitmentsList = [
                    // '2faWWWW8QyXCnpvzX5tADsgSUiRZc55KCPd1ttPfrF7E', // 9.98 spent - a1
                    // 'J9GaEtp4wG1nCm2SdDHUju6VZD6JhAmcYa5ae9y6kMT6', // 10.900000 - a1
                    // 'NxL2RAScj8vnSpnNFczaK8iu7ZCLRwB8Wq8fzKGMUgp', // 12 spent - a1
                    '3cPUB1No27iS1vCXeik53gnxQVwpU6iZPX5mywx68A8G', // 9.98 - a2?
                ];
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, givenCommitmentsList)];
            case 1:
                balances = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1291 ~ getAbarBalance ~ balances', JSON.stringify(balances, null, 2));
                return [2 /*return*/];
        }
    });
}); };
var getFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, pkey, walletInfo, feeInputsPayload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '1234';
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1299 ~ getFee ~ walletInfo', walletInfo);
                return [4 /*yield*/, (0, fee_1.getFeeInputs)(walletInfo, [11], true)];
            case 2:
                feeInputsPayload = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1301 ~ getFee ~ feeInputsPayload', feeInputsPayload);
                return [2 /*return*/];
        }
    });
}); };
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
                console.log('New asset ', assetCode, ' created, handle', handle);
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
                console.log('Asset ', assetCode, ' issued, handle', handleIssue);
                // await sleep(waitingTimeBeforeCheckTxStatus);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 4:
                // await sleep(waitingTimeBeforeCheckTxStatus);
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.issueCustomAsset = issueCustomAsset;
var createTestBarsMulti = function (senderOne, asset1Code, derivedAsset1Code) { return __awaiter(void 0, void 0, void 0, function () {
    var toPkeyMine, toWalletInfo, balance1Old, balance1New, balance1ChangeF, balance1Change;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('//////////////// Issue Custom Asset //////////////// ');
                toPkeyMine = senderOne;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine, password)];
            case 1:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, derivedAsset1Code)];
            case 2:
                balance1Old = _a.sent();
                return [4 /*yield*/, (0, exports.defineCustomAsset)(senderOne, asset1Code)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAsset1Code, '10')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAsset1Code, '5')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAsset1Code, '20')];
            case 6:
                _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(toWalletInfo, derivedAsset1Code)];
            case 7:
                balance1New = _a.sent();
                balance1ChangeF = parseFloat(balance1New.replace(/,/g, '')) - parseFloat(balance1Old.replace(/,/g, ''));
                balance1Change = Math.floor(balance1ChangeF);
                console.log('Custom Asset1 Old Balance = ', balance1Old, '; Custom Asset1 New Balance = ', balance1New, '; Custom Asset1 Balance Change = ', balance1ChangeF);
                return [2 /*return*/];
        }
    });
}); };
exports.createTestBarsMulti = createTestBarsMulti;
var abarToAbarFraOneFraAtxoForFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, pkey, walletInfo, fraCode, assetCode, derivedAssetCode, customAssetSids, cAssetSidOne, cAssetSidTwo, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fraAssetCommitmentsList, givenCommitmentsListSender, additionalOwnedAbarItems, _i, givenCommitmentsListSender_1, givenCommitment, balancesCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _b, commitmentsMap_1, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                anonKeysSender = __assign({}, myAbarAnonKeys);
                anonKeysReceiver = {
                    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                    axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                };
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _c.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                assetCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 4:
                derivedAssetCode = _c.sent();
                return [4 /*yield*/, createTestBars(pkey)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, exports.createTestBarsMulti)(pkey, assetCode, derivedAssetCode)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, derivedAssetCode)];
            case 7:
                customAssetSids = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);
                cAssetSidOne = customAssetSids[0], cAssetSidTwo = customAssetSids[1];
                return [4 /*yield*/, barToAbar([cAssetSidOne, cAssetSidTwo])];
            case 8:
                customAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, fraCode)];
            case 9:
                fraAssetSids = _c.sent();
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2];
                return [4 /*yield*/, barToAbar([fAssetSidOne])];
            case 10:
                fraAssetCommitmentsList = _c.sent();
                givenCommitmentsListSender = __spreadArray([], fraAssetCommitmentsList, true);
                additionalOwnedAbarItems = [];
                _i = 0, givenCommitmentsListSender_1 = givenCommitmentsListSender;
                _c.label = 11;
            case 11:
                if (!(_i < givenCommitmentsListSender_1.length)) return [3 /*break*/, 15];
                givenCommitment = givenCommitmentsListSender_1[_i];
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, [givenCommitment])];
            case 12:
                balancesCommitment = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used', balancesCommitment);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 13:
                ownedAbarsResponseTwo = _c.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _c.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 11];
            case 15: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '0.5', additionalOwnedAbarItems)];
            case 16:
                _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 17:
                resultHandle = _c.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for " + waitingTimeBeforeCheckTxStatus + "ms and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _c.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_1 = commitmentsMap; _b < commitmentsMap_1.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_1[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver', retrivedCommitmentsListReceiver);
                console.log('🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 19:
                balancesSender = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 20:
                balancesReceiver = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                return [2 /*return*/];
        }
    });
}); };
var abarToAbarFraMultipleFraAtxoForFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, pkey, walletInfo, fraCode, assetCode, derivedAssetCode, customAssetSids, cAssetSidOne, cAssetSidTwo, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fraAssetCommitmentsList, givenCommitmentsListSender, additionalOwnedAbarItems, _i, givenCommitmentsListSender_2, givenCommitment, balancesCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _b, commitmentsMap_2, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                anonKeysSender = __assign({}, myAbarAnonKeys);
                anonKeysReceiver = {
                    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                    axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                };
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _c.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                assetCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 4:
                derivedAssetCode = _c.sent();
                return [4 /*yield*/, createTestBars(pkey)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, exports.createTestBarsMulti)(pkey, assetCode, derivedAssetCode)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, derivedAssetCode)];
            case 7:
                customAssetSids = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);
                cAssetSidOne = customAssetSids[0], cAssetSidTwo = customAssetSids[1];
                return [4 /*yield*/, barToAbar([cAssetSidOne, cAssetSidTwo])];
            case 8:
                customAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, fraCode)];
            case 9:
                fraAssetSids = _c.sent();
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2];
                return [4 /*yield*/, barToAbar([fAssetSidOne, fAssetSidTwo])];
            case 10:
                fraAssetCommitmentsList = _c.sent();
                givenCommitmentsListSender = __spreadArray([], fraAssetCommitmentsList, true);
                additionalOwnedAbarItems = [];
                _i = 0, givenCommitmentsListSender_2 = givenCommitmentsListSender;
                _c.label = 11;
            case 11:
                if (!(_i < givenCommitmentsListSender_2.length)) return [3 /*break*/, 15];
                givenCommitment = givenCommitmentsListSender_2[_i];
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, [givenCommitment])];
            case 12:
                balancesCommitment = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used', balancesCommitment);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 13:
                ownedAbarsResponseTwo = _c.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _c.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 11];
            case 15: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '0.5', additionalOwnedAbarItems)];
            case 16:
                _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 17:
                resultHandle = _c.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for " + waitingTimeBeforeCheckTxStatus + "ms and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _c.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_2 = commitmentsMap; _b < commitmentsMap_2.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_2[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver', retrivedCommitmentsListReceiver);
                console.log('🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 19:
                balancesSender = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 20:
                balancesReceiver = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                return [2 /*return*/];
        }
    });
}); };
var abarToAbarCustomOneFraAtxoForFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, pkey, walletInfo, fraCode, assetCode, derivedAssetCode, customAssetSids, cAssetSidOne, cAssetSidTwo, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fraAssetCommitmentsList, givenCommitmentsListSender, additionalOwnedAbarItems, _i, givenCommitmentsListSender_3, givenCommitment, balancesCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _b, commitmentsMap_3, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                anonKeysSender = __assign({}, myAbarAnonKeys);
                anonKeysReceiver = {
                    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                    axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                };
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _c.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                assetCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 4:
                derivedAssetCode = _c.sent();
                return [4 /*yield*/, createTestBars(pkey)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, exports.createTestBarsMulti)(pkey, assetCode, derivedAssetCode)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, derivedAssetCode)];
            case 7:
                customAssetSids = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);
                cAssetSidOne = customAssetSids[0], cAssetSidTwo = customAssetSids[1];
                return [4 /*yield*/, barToAbar([cAssetSidOne, cAssetSidTwo])];
            case 8:
                customAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, fraCode)];
            case 9:
                fraAssetSids = _c.sent();
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2];
                return [4 /*yield*/, barToAbar([fAssetSidOne])];
            case 10:
                fraAssetCommitmentsList = _c.sent();
                givenCommitmentsListSender = __spreadArray(__spreadArray([], customAssetCommitmentsList, true), fraAssetCommitmentsList, true);
                additionalOwnedAbarItems = [];
                _i = 0, givenCommitmentsListSender_3 = givenCommitmentsListSender;
                _c.label = 11;
            case 11:
                if (!(_i < givenCommitmentsListSender_3.length)) return [3 /*break*/, 15];
                givenCommitment = givenCommitmentsListSender_3[_i];
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, [givenCommitment])];
            case 12:
                balancesCommitment = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used', balancesCommitment);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 13:
                ownedAbarsResponseTwo = _c.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _c.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 11];
            case 15: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '0.5', additionalOwnedAbarItems)];
            case 16:
                _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 17:
                resultHandle = _c.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for " + waitingTimeBeforeCheckTxStatus + "ms and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _c.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_3 = commitmentsMap; _b < commitmentsMap_3.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_3[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver', retrivedCommitmentsListReceiver);
                console.log('🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 19:
                balancesSender = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 20:
                balancesReceiver = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                return [2 /*return*/];
        }
    });
}); };
var abarToAbarCustomMultipleFraAtxoForFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, pkey, walletInfo, fraCode, assetCode, derivedAssetCode, customAssetSids, cAssetSidOne, cAssetSidTwo, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fraAssetCommitmentsList, givenCommitmentsListSender, additionalOwnedAbarItems, _i, givenCommitmentsListSender_4, givenCommitment, balancesCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, _a, anonTransferOperationBuilder, abarToAbarData, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _b, commitmentsMap_4, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                anonKeysSender = __assign({}, myAbarAnonKeys);
                anonKeysReceiver = {
                    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                    axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                };
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _c.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                assetCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 4:
                derivedAssetCode = _c.sent();
                return [4 /*yield*/, createTestBars(pkey)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, exports.createTestBarsMulti)(pkey, assetCode, derivedAssetCode)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, derivedAssetCode)];
            case 7:
                customAssetSids = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);
                cAssetSidOne = customAssetSids[0], cAssetSidTwo = customAssetSids[1];
                return [4 /*yield*/, barToAbar([cAssetSidOne, cAssetSidTwo])];
            case 8:
                customAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, fraCode)];
            case 9:
                fraAssetSids = _c.sent();
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2];
                return [4 /*yield*/, barToAbar([fAssetSidOne, fAssetSidTwo])];
            case 10:
                fraAssetCommitmentsList = _c.sent();
                givenCommitmentsListSender = __spreadArray(__spreadArray([], customAssetCommitmentsList, true), fraAssetCommitmentsList, true);
                additionalOwnedAbarItems = [];
                _i = 0, givenCommitmentsListSender_4 = givenCommitmentsListSender;
                _c.label = 11;
            case 11:
                if (!(_i < givenCommitmentsListSender_4.length)) return [3 /*break*/, 15];
                givenCommitment = givenCommitmentsListSender_4[_i];
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, [givenCommitment])];
            case 12:
                balancesCommitment = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used', balancesCommitment);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 13:
                ownedAbarsResponseTwo = _c.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _c.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 11];
            case 15: return [4 /*yield*/, api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.axfrPublicKey, '0.5', additionalOwnedAbarItems)];
            case 16:
                _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 17:
                resultHandle = _c.sent();
                console.log('transfer abar result handle!!', resultHandle);
                console.log("will wait for " + waitingTimeBeforeCheckTxStatus + "ms and then check balances for both sender and receiver commitments");
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 18:
                _c.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_4 = commitmentsMap; _b < commitmentsMap_4.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_4[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver', retrivedCommitmentsListReceiver);
                console.log('🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 19:
                balancesSender = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 20:
                balancesReceiver = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                return [2 /*return*/];
        }
    });
}); };
var abarToAbarCustomMultipleFraAtxoForFeeSendAmount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, anonKeysReceiver, walletInfo, pkey, fraCode, assetCode, derivedAssetCode, customAssetSids, customAssetCommitmentsList, fraAssetSids, fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour, fAssetSidFive, fraAssetCommitmentsList, givenCommitmentsListSender, additionalOwnedAbarItems, _i, givenCommitmentsListSender_5, givenCommitment, balancesCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, fraAssetCode, fraBalanceBeforeAbarToAbar, _a, anonTransferOperationBuilder, abarToAbarData, fraBalanceAfterAbarToAbar, resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, _b, commitmentsMap_5, commitmentsMapEntry, commitmentKey, commitmentAxfrPublicKey, balancesSender, balancesReceiver;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                anonKeysSender = __assign({}, myAbarAnonKeys);
                anonKeysReceiver = {
                    axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                    axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                    axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                };
                return [4 /*yield*/, createNewKeypair()];
            case 1:
                walletInfo = _c.sent();
                pkey = walletInfo.privateStr;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 3:
                assetCode = _c.sent();
                return [4 /*yield*/, api_1.Asset.getDerivedAssetCode(assetCode)];
            case 4:
                derivedAssetCode = _c.sent();
                return [4 /*yield*/, createTestBars(pkey)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, exports.createTestBarsMulti)(pkey, assetCode, derivedAssetCode)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, derivedAssetCode)];
            case 7:
                customAssetSids = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1574 ~ abarToAbar ~ customAssetSids', customAssetSids);
                return [4 /*yield*/, barToAbar(customAssetSids, pkey)];
            case 8:
                customAssetCommitmentsList = _c.sent();
                return [4 /*yield*/, (0, exports.getSidsForAsset)(pkey, fraCode)];
            case 9:
                fraAssetSids = _c.sent();
                fAssetSidOne = fraAssetSids[0], fAssetSidTwo = fraAssetSids[1], fAssetSidThree = fraAssetSids[2], fAssetSidFour = fraAssetSids[3], fAssetSidFive = fraAssetSids[4];
                return [4 /*yield*/, barToAbar([fAssetSidOne, fAssetSidTwo, fAssetSidThree], pkey)];
            case 10:
                fraAssetCommitmentsList = _c.sent();
                // throw new Error(`You still need ${calculatedFee} FRA to cover the fee`);
                // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo], pkey);
                // const fraAssetCommitmentsList = await barToAbar(fraAssetSids);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 11:
                // throw new Error(`You still need ${calculatedFee} FRA to cover the fee`);
                // const fraAssetCommitmentsList = await barToAbar([fAssetSidOne, fAssetSidTwo], pkey);
                // const fraAssetCommitmentsList = await barToAbar(fraAssetSids);
                _c.sent();
                givenCommitmentsListSender = __spreadArray(__spreadArray([], customAssetCommitmentsList, true), fraAssetCommitmentsList, true);
                additionalOwnedAbarItems = [];
                _i = 0, givenCommitmentsListSender_5 = givenCommitmentsListSender;
                _c.label = 12;
            case 12:
                if (!(_i < givenCommitmentsListSender_5.length)) return [3 /*break*/, 16];
                givenCommitment = givenCommitmentsListSender_5[_i];
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, [givenCommitment])];
            case 13:
                balancesCommitment = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1617 ~ abarToAbar ~ balancesCommitment to be used', balancesCommitment);
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 14:
                ownedAbarsResponseTwo = _c.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _c.label = 15;
            case 15:
                _i++;
                return [3 /*break*/, 12];
            case 16: return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 17:
                fraAssetCode = _c.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo, fraAssetCode)];
            case 18:
                fraBalanceBeforeAbarToAbar = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 2253 ~ abarToBar ~ fraBalanceBeforeAbarToAbar', fraBalanceBeforeAbarToAbar);
                return [4 /*yield*/, api_1.TripleMasking.abarToAbarAmount(anonKeysSender, anonKeysReceiver.axfrPublicKey, '35', derivedAssetCode, givenCommitmentsListSender)];
            case 19:
                _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo, fraAssetCode)];
            case 20:
                fraBalanceAfterAbarToAbar = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 2164 ~ abarToAbarCustomMultipleFraAtxoForFeeSendAmount ~ fraBalanceAfterAbarToAbar', fraBalanceAfterAbarToAbar);
                // const result = await TripleMasking.getAbarToAbarAmountPayload(
                //   anonKeysSender,
                //   anonKeysReceiver.axfrPublicKey,
                //   '35',
                //   derivedAssetCode,
                //   givenCommitmentsListSender,
                // );
                // console.log(
                //   '🚀 ~ file: run.ts ~ line 2138 ~ abarToAbarCustomMultipleFraAtxoForFeeSendAmount ~ result',
                //   result,
                // );
                // await waitForBlockChange();
                // const { commitmentsForFee, commitmentsToSend, additionalAmountForFee } = result;
                // console.log(
                //   '🚀 ~ file: run.ts ~ line 2153 ~ abarToAbarCustomMultipleFraAtxoForFeeSendAmount ~ additionalAmountForFee',
                //   additionalAmountForFee,
                // );
                // const balancesToSend = await TripleMasking.getBalance(anonKeysSender, commitmentsToSend);
                // console.log(
                //   '🚀 ~ file: run.ts ~ line 2154 ~ abarToAbarCustomMultipleFraAtxoForFeeSendAmount ~ balancesToSend',
                //   balancesToSend,
                // );
                // const balancesForFee = await TripleMasking.getBalance(anonKeysSender, commitmentsForFee);
                // console.log(
                //   '🚀 ~ file: run.ts ~ line 2156 ~ abarToAbarCustomMultipleFraAtxoForFeeSendAmount ~ balancesForFee',
                //   balancesForFee,
                // );
                console.log('🚀 ~ file: run.ts ~ line 1388 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
                return [4 /*yield*/, api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
            case 21:
                resultHandle = _c.sent();
                console.log('transfer abar result handle!!', resultHandle);
                // console.log(
                //   `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
                // );
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(2)];
            case 22:
                // console.log(
                //   `will wait for ${waitingTimeBeforeCheckTxStatus}ms and then check balances for both sender and receiver commitments`,
                // );
                _c.sent();
                console.log('now checking balances\n\n\n');
                commitmentsMap = abarToAbarData.commitmentsMap;
                retrivedCommitmentsListReceiver = [];
                for (_b = 0, commitmentsMap_5 = commitmentsMap; _b < commitmentsMap_5.length; _b++) {
                    commitmentsMapEntry = commitmentsMap_5[_b];
                    commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAxfrPublicKey = commitmentsMapEntry.commitmentAxfrPublicKey;
                    if (commitmentAxfrPublicKey === anonKeysSender.axfrPublicKey) {
                        givenCommitmentsListSender.push(commitmentKey);
                    }
                    if (commitmentAxfrPublicKey === anonKeysReceiver.axfrPublicKey) {
                        retrivedCommitmentsListReceiver.push(commitmentKey);
                    }
                }
                console.log('🚀 ~ file: run.ts ~ line 1419 ~ abarToAbar ~ retrivedCommitmentsListReceiver', retrivedCommitmentsListReceiver);
                console.log('🚀 ~ file: run.ts ~ line 1423 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender)];
            case 23:
                balancesSender = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1428 ~ abarToAbar ~ balancesSender', balancesSender);
                return [4 /*yield*/, api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver)];
            case 24:
                balancesReceiver = _c.sent();
                console.log('🚀 ~ file: run.ts ~ line 1431 ~ abarToAbar ~ balancesReceiver', balancesReceiver);
                return [2 /*return*/];
        }
    });
}); };
var abarToBar = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, pkey, walletInfo, anonKeysSender, givenCommitmentOne, ownedAbarsResponseOne, ownedAbarToUseAsSource, _a, transactionBuilder, abarToBarData, receiverWalletInfo, resultHandle;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                password = '1234';
                pkey = PKEY_MINE;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _b.sent();
                anonKeysSender = {
                    axfrPublicKey: 'T_0kQOWEToeg53Q8dS8eej91sJKVBEV2f7rs7Btz5CY=',
                    axfrSpendKey: 'HVdrTiyyL6dFBqq7HvPjYgACG1eIF6-pgvc-OomswAhP_SRA5YROh6DndDx1Lx56P3WwkpUERXZ_uuzsG3PkJg==',
                    axfrViewKey: '',
                };
                givenCommitmentOne = 'yUUf9lK7V-7t36rk1_2Omsl11hi_CJe4VNExbcXuiTQ=';
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitmentOne)];
            case 2:
                ownedAbarsResponseOne = _b.sent();
                ownedAbarToUseAsSource = ownedAbarsResponseOne[0];
                console.log('🚀 ~ file: run.ts ~ line 1396 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);
                return [4 /*yield*/, api_1.TripleMasking.abarToBar(anonKeysSender, walletInfo, [ownedAbarToUseAsSource])];
            case 3:
                _a = _b.sent(), transactionBuilder = _a.transactionBuilder, abarToBarData = _a.abarToBarData, receiverWalletInfo = _a.receiverWalletInfo;
                console.log('🚀 ~ file: run.ts ~ line 1413 ~ abarToBar ~ abarToBarData', abarToBarData);
                console.log('🚀 ~ file: run.ts ~ line 1413 ~ abarToBar ~ receiverWalletInfo', receiverWalletInfo);
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 4:
                resultHandle = _b.sent();
                console.log('abar to bar result handle!!!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
var getAnonTxList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeysSender, subject, hashes, txList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeysSender = {
                    axfrPublicKey: 'oDosEZB9uq4joxcM6xE993XHdSwBs90z2DEzg7QzSus=',
                    axfrSpendKey: 'Gsppgb5TA__Lsry9TMe9hBZdn_VOU4FS1oCaHrdLHQCgOiwRkH26riOjFwzrET33dcd1LAGz3TPYMTODtDNK6w==',
                    axfrViewKey: '',
                };
                subject = '2faWWWW8QyXCnpvzX5tADsgSUiRZc55KCPd1ttPfrF7E';
                return [4 /*yield*/, api_1.TripleMasking.getNullifierHashesFromCommitments(anonKeysSender, [subject])];
            case 1:
                hashes = _a.sent();
                return [4 /*yield*/, api_1.Transaction.getAnonTxList(hashes, 'from')];
            case 2:
                txList = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1516 ~ getAnonTxList ~ hashes', hashes);
                console.log('!anon txList!', JSON.stringify(txList, null, 2));
                return [2 /*return*/];
        }
    });
}); };
var testIt = function () { return __awaiter(void 0, void 0, void 0, function () {
    function isCoinBase(fraAddress) {
        console.log("we are going to call leger with " + fraAddress);
        // return false;
        var addressInBase64 = findoraWasm.bech32_to_base64(fraAddress);
        return false;
        // return [findoraWasm.get_coinbase_principal_address(), findoraWasm.get_coinbase_address()].includes(
        //   addressInBase64,
        // );
    }
    var findoraWasm, aaa1, aaa2, aaa3, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                findoraWasm = _a.sent();
                aaa1 = '3a42pm482SV4wgPk9ibZ5vq7iuoMVSqzqV2x1hvWRcSZ';
                aaa2 = 'DNnXvLm6eMEuVf7xe48arKug6BhGHTMBQy5rF4W6WHFm';
                aaa3 = 'fra1ngv43xvre25pwtuynrh4ua4fhxn9mye6nh8kakcjdgc6ghger0cquazydn';
                result = isCoinBase(aaa1);
                console.log('result', result);
                return [2 /*return*/];
        }
    });
}); };
// const testBlockWait = async () => {
//   // const result = await waitForBlockChange(2);
//   // log('🚀 ~ file: run.ts ~ line 2126 ~ testBlockWait ~ result', result);
//   const anonKeys1 = await TMI.getAnonKeys();
//   const walletInfo = await TMI.createNewKeypair();
//   const senderOne = walletInfo.privateStr!;
//   const resultS = await TMI.createTestBars(senderOne);
//   const result = await TMI.abarToBar(senderOne, anonKeys1);
//   console.log('🚀 ~ file: run.ts ~ line 2133 ~ testBlockWait ~ result', result);
// };
function approveToken() {
    return __awaiter(this, void 0, void 0, function () {
        var addr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.Evm.hashAddressTofraAddress('0xfd66Bd7839Ed3AeC90f5F54ab2E11E7bF2FF4be5')];
                case 1:
                    addr = _a.sent();
                    console.log(addr);
                    return [2 /*return*/];
            }
        });
    });
}
// approveToken();
// testIt();
// getFraBalance();
// getAnonKeys(); // +
// createTestBars();
// barToAbar(); // ++
// getUnspentAbars(); // +
// getAbarBalance(); // +
// getFee();
// abarToAbar(); // ++
// abarToBar(); // +
// validateUnspent(); // +
// getCustomAssetBala9r8HN7YmJdg4mcbBRnBAiq5vu1cHaBDE49dnKamGbmbX);
// defineCustomAsset();
// issueCustomAsset();
// getStateCommitment();
// getValidatorList();
// getDelegateInfo();
// getTransferBuilderOperation();
// createNewKeypair();
// transferFraToSingleRecepient();
// transferFraToSingleAddress();
// transferFraToMultipleRecepients();
// transferCustomAssetToSingleRecepient();
// transferCustomAssetToMultipleRecepients();
// getCustomAssetDetails();
// getTransactionStatus();
// getBlockDetails();
// delegateFraTransactionSubmit();
// delegateFraTransactionAiindClaimRewards();
// unstakeFraTransactionSubmit();
// sendEvmToAccount();
// ethProtocol();
// myFunc16(); // tx list
// getAnonTxList();
// testTransferToYourself();
// 1. PASSING: this one is passing
// abarToAbarFraOneFraAtxoForFee();
// 2. PASSING: this one has multiple fra atxo (two) and it is failing
// abarToAbarFraMultipleFraAtxoForFee();
// 3. PASSING: this one is also passing (it has only one fra atxo)
// abarToAbarCustomOneFraAtxoForFee();
// 4. PASSING: this one has multiple fra txo and it is also failing
// abarToAbarCustomMultipleFraAtxoForFee();
// testBlockWait();
// barToAbarAmount();
abarToAbarCustomMultipleFraAtxoForFeeSendAmount();
//# sourceMappingURL=run.js.map