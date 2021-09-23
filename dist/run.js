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
exports.unstakeFraTransactionSubmit = exports.delegateFraTransactionAndClaimRewards = exports.delegateFraTransactionSubmit = void 0;
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
var dotenv_1 = __importDefault(require("dotenv"));
var api_1 = require("./api");
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber = __importStar(require("./services/bigNumber"));
var providers_1 = require("./services/cacheStore/providers");
var Fee = __importStar(require("./services/fee"));
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var UtxoHelper = __importStar(require("./services/utxoHelper"));
var api_2 = require("./api");
var sleep_promise_1 = __importDefault(require("sleep-promise"));
dotenv_1.default.config();
var waitingTimeBeforeCheckTxStatus = 18000;
var mainFaucet = 'XXX';
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    // hostUrl: 'https://dev-staging.dev.findora.org',
    // hostUrl: 'https://dev-evm.dev.findora.org',
    hostUrl: 'http://127.0.0.1',
    // hostUrl: 'https://prod-testnet.prod.findora.org',
    // cacheProvider: FileCacheProvider,
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
Sdk_1.default.init(sdkEnv);
var CustomAssetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=';
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
    var pkeyMine, pkeyMine2, pkeyMine3, pkeyMine4, pkeyLocalFaucet, pkey1, pkey2, pkey3, pkey4, pkey6, password, pkey, mString, mm, newWallet, walletInfo, fraCode, sidsResult, sids, balanceInWei, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkeyMine = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                pkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                pkeyMine3 = 'KUAxjaf4NWbxM714pEKRdOf5vLD-ECl4PuT1pgH-m0k=';
                pkeyMine4 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';
                pkeyLocalFaucet = 'o9gXFI5ft1VOkzYhvFpgUTWVoskM1CEih0zJcm3-EAQ=';
                pkey1 = 'p-9UpNFzuyptVhdMrNj2tyQqFrYaC5lqBvWrEsSKc-g=';
                pkey2 = 'ZbGRFBqZC_wD4SBfAbxqh17BG-y-jTbkeLNs06FUHJY=';
                pkey3 = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
                pkey4 = 'o9xuRVejhJ5iLCTkqfjyWfoCDmJPB4clklfyozCw5Xg=';
                pkey6 = 'gOGMwUJN8Tq33LwIdWHmkfcbYesg7Us_S58WEgJaRYc=';
                password = '1234';
                pkey = pkeyLocalFaucet;
                mString = 'math drastic little venture uncle slush patch clean sting defy apology jealous creek ship claim lonely emotion answer forest gather shrimp crouch monitor shrimp';
                mm = mString.split(' ');
                console.log('🚀 ~ file: run.ts ~ line 67 ~ getFraBalance ~ mm', mm.join(' '));
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 1:
                newWallet = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 67 ~ getFraBalance ~ newWallet', newWallet);
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 4:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, api_1.Account.getAssetBalance(walletInfo, fraCode, sids)];
            case 5:
                balanceInWei = _a.sent();
                balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                console.log('\n');
                console.log('walletInfo.address', walletInfo.address);
                console.log('walletInfo.privateStr', walletInfo.privateStr);
                console.log('balance IS', balance);
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
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
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
var defineCustomAsset = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, assetCode, walletInfo, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'Ew9fMaryTL44ZXnEhcF7hQ-AB-fxgaC8vyCH-hCGtzg=';
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
var issueCustomAsset = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, password, walletInfo, assetBlindRules, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
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
/**
 *         publickey: 'B6fhmHZe9gP4RqhX_UdSedoIENr449oNKf0rM0p5aM0=',
        address: 'fra1q7n7rxrktmmq87zx4ptl636j08dqsyx6lr3a5rffl54nxjnedrxs0v63wg',
        keypair: XfrKeyPair { ptr: 2556360 },
        privateStr: 'cFDDiU-Wq__LPXio47nmRA8ytTil4WPjKiKXwRCJRUY='
 */
var getDelegateInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, delegateInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'VKt39pHEX8RY4doRQGIOf2oP-HGDVaPKAfEhkbdoNKA=';
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
    var ledger, password, pkey, walletInfo, sidsResult, sids, utxoDataList, fraCode, amount, sendUtxoList, utxoInputsInfo, minimalFee, toPublickey, recieversInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                password = '123';
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
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
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, fraCode)];
            case 7:
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
    var password, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '123';
                return [4 /*yield*/, api_1.Keypair.createKeypair(password)];
            case 1:
                walletInfo = _a.sent();
                console.log('new wallet info', walletInfo);
                return [2 /*return*/];
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
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
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
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toPkeyMine3 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';
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
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
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
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toPkeyMine3 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';
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
                h = 'b07040a5d8c9ef6fcb98b95968e6c1f14f77405e851ac8230942e1c305913ea0';
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
                console.log('blockDetails! :)', JSON.stringify(blockDetailsResult, null, 2));
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
                h = 'bfcde17f7e8f0acb746d4efcbd61ed2490ea4e2909922cebec15a6308bab47c2';
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
                h = 'bfcde17f7e8f0acb746d4efcbd61ed2490ea4e2909922cebec15a6308bab47c2';
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getTxList(walletInfo.address, 'to')];
            case 2:
                dataResult = _a.sent();
                response = dataResult.response;
                // console.log('response!', JSON.stringify(response, null, 2));
                console.log('response!!!', response);
                return [2 /*return*/];
        }
    });
}); };
var myFunc16 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toKey, password, walletInfo, toWalletInfo, txList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Transaction.getTxList(walletInfo.address, 'from')];
            case 3:
                txList = _a.sent();
                console.log('txList', txList);
                return [2 /*return*/];
        }
    });
}); };
var myFunc17 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toKey, password, walletInfo, toWalletInfo, a;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getCreatedAssets(walletInfo.address)];
            case 3:
                a = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var myFunc18 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toKey, password, walletInfo, toWalletInfo, sids;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toKey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getRelatedSids(walletInfo.publickey)];
            case 3:
                sids = _a.sent();
                console.log('sids!!', sids);
                return [2 /*return*/];
        }
    });
}); };
// s3
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
                console.log('readRes :) 5', (_b = readRes === null || readRes === void 0 ? void 0 : readRes.Body) === null || _b === void 0 ? void 0 : _b.toString());
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
var myFuncUndelegate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rickey2, mine, password, mineWalletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rickey2 = 'glzudSr1lCGmkLjETDeUDCP_hBNkCmXILnPHPCRuI5Y=';
                mine = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(mine, password)];
            case 1:
                mineWalletInfo = _a.sent();
                return [2 /*return*/];
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
                // return true;
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
        switch (_a.label) {
            case 0:
                fraAddress = 'fra1d2yetp5ljdwn0zfhusvshgt4d3nyk4j3e0w2stqzlsnv8ra4whmsfzqfga';
                amount = '1';
                ethPrivate = 'fa6a6e57595d7e9c227e769deaf7822fcb6176cac573d73979b2c9ce808e6275';
                ethAddress = '0xA2892dA49B74F069400694E4930aa9D6Db0e67b3';
                return [4 /*yield*/, api_2.Evm.sendEvmToAccount(fraAddress, amount, ethPrivate, ethAddress)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var ethProtocol = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, methodName, existingBlockHashToCheck, extraParams, payload, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'http://127.0.0.1:8545';
                methodName = 'eth_getBlockByHash';
                existingBlockHashToCheck = '0x41f02ee22758d62ebc1b71df5ad61fd80acceecce9db57b591ff0f47ba8170a6';
                extraParams = [existingBlockHashToCheck, true];
                payload = {
                    method: methodName,
                    params: extraParams,
                };
                return [4 /*yield*/, api_1.Network.sendRpcCall(url, payload)];
            case 1:
                result = _a.sent();
                console.log("\uD83D\uDE80 ~ !file: run.ts ~ line 1154 ~ " + methodName + " ~ result", result);
                return [2 /*return*/];
        }
    });
}); };
// New
// getFraAssetCode(); // works
getFraBalance(); // works
// getCustomAssetBalance(); // works
// defineCustomAsset(); // works
// issueCustomAsset(); // works
// getStateCommitment(); // works
// getValidatorList();
// getDelegateInfo(); // 1
// getTransferBuilderOperation(); // works
// createNewKeypair(); // works
// transferFraToSingleRecepient(); // works
// transferFraToMultipleRecepients(); // works
// transferCustomAssetToSingleRecepient(); // works
// transferCustomAssetToMultipleRecepients();
// getCustomAssetDetails(); // works
// getTransactionStatus(); // works
// getBlockDetails();
// delegateFraTransactionSubmit(); // 2
// delegateFraTransactionAndClaimRewards(); //3
// unstakeFraTransactionSubmit(); //4
// sendEvmToAccount();
// ethProtocol();
//# sourceMappingURL=run.js.map