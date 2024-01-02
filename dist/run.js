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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstakeFraTransactionSubmit = exports.delegateFraTransactionAndClaimRewards = exports.delegateFraTransactionSubmit = void 0;
/* eslint-disable no-console */
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
var dotenv_1 = __importDefault(require("dotenv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var Sdk_1 = __importDefault(require("./Sdk"));
var api_1 = require("./api");
var testHelpers_1 = require("./evm/testHelpers");
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
    hostUrl: 'https://prod-testnet.prod.findora.org',
    // hostUrl: 'https://dev-staging.dev.findora.org',
    // hostUrl: 'https://dev-evm.dev.findora.org',
    // hostUrl: 'http://127.0.0.1',
    // hostUrl: 'https://dev-qa04.dev.findora.org',
    // hostUrl: 'https://dev-qa02.dev.findora.org',
    // hostUrl: 'https://prod-forge.prod.findora.org', // forge balance!
    // cacheProvider: FileCacheProvider,
    // hostUrl: 'https://dev-mainnetmock.dev.findora.org', //works but have 0 balance
    // hostUrl: 'https://dev-qa01.dev.findora.org',
    blockScanerUrl: 'https://prod-testnet.backend.findorascan.io',
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
/**
 * This file is a developer "sandbox". You can debug existing methods here, or play with new and so on.
 * It is executed by running `yarn start` - feel free to play with it and change it.
 * Examples here might not always be working, again - that is just a sandbox for convenience.
 */
Sdk_1.default.init(sdkEnv);
console.log("Connecting to \"".concat(sdkEnv.hostUrl, "\""));
var password = '123';
var _a = process.env, _b = _a.CUSTOM_ASSET_CODE, CUSTOM_ASSET_CODE = _b === void 0 ? '' : _b, _c = _a.PKEY_MINE, PKEY_MINE = _c === void 0 ? '' : _c, _d = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1, PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1 = _d === void 0 ? '' : _d, _e = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2, PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2 = _e === void 0 ? '' : _e, _f = _a.PKEY_MINE2, PKEY_MINE2 = _f === void 0 ? '' : _f, _g = _a.PKEY_MINE3, PKEY_MINE3 = _g === void 0 ? '' : _g, _h = _a.PKEY_LOCAL_FAUCET, PKEY_LOCAL_FAUCET = _h === void 0 ? '' : _h, _j = _a.ENG_PKEY, ENG_PKEY = _j === void 0 ? '' : _j, _k = _a.PKEY_LOCAL_TRIPLE_MASKING, PKEY_LOCAL_TRIPLE_MASKING = _k === void 0 ? '' : _k, _l = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING, PKEY_LOCAL_FAUCET_MNEMONIC_STRING = _l === void 0 ? '' : _l, _m = _a.M_STRING, M_STRING = _m === void 0 ? '' : _m, _o = _a.FRA_ADDRESS, FRA_ADDRESS = _o === void 0 ? '' : _o, _p = _a.ETH_PRIVATE, ETH_PRIVATE = _p === void 0 ? '' : _p, _q = _a.ETH_ADDRESS, ETH_ADDRESS = _q === void 0 ? '' : _q;
var mainFaucet = PKEY_LOCAL_FAUCET;
var CustomAssetCode = CUSTOM_ASSET_CODE;
var myAbarAnonKeys = {
    axfrPublicKey: 'RFuVMPlD0pVcBlRIDKCwp5WNliqjGF4RG_r-SCzajOw=',
    axfrSecretKey: 'lgwn_gnSNPEiOmL1Tlb_nSzNcPkZa4yUqiIsR4B_skb4jYJBFjaRQwUlTi22XO3cOyxSbiv7k4l68kj2jzOVCURblTD5Q9KVXAZUSAygsKeVjZYqoxheERv6_kgs2ozs',
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
    var password, isFra, faucetWalletInfo, newWalletMine1, newWalletMine2, balanceFaucet, balanceNewMine1, balanceNewMine2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '12345';
                isFra = false;
                console.log('🚀 ~ file: run.ts ~ line 113 ~ getFraBalance ~ isFra', isFra);
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(PKEY_LOCAL_FAUCET_MNEMONIC_STRING.split(' '), password)];
            case 1:
                faucetWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1.split(' '), password)];
            case 2:
                newWalletMine1 = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2.split(' '), password)];
            case 3:
                newWalletMine2 = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(faucetWalletInfo)];
            case 4:
                balanceFaucet = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(newWalletMine1)];
            case 5:
                balanceNewMine1 = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(newWalletMine2)];
            case 6:
                balanceNewMine2 = _a.sent();
                console.log('\n');
                console.log('Faucet Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING, '\n');
                console.log('faucetWalletInfo.address ', faucetWalletInfo.address);
                console.log('faucetWalletInfo.privateStr', faucetWalletInfo.privateStr);
                console.log('\n');
                console.log('Mine1 Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1, '\n');
                console.log('newWalletMine1.address ', newWalletMine1.address);
                console.log('newWalletMine1.privateStr ', newWalletMine1.privateStr);
                console.log('\n');
                console.log('Mine2 Mnemonic', PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE2, '\n');
                console.log('newWalletMine2.address', newWalletMine2.address);
                console.log('newWalletMine2.privateStr', newWalletMine2.privateStr);
                console.log('\n');
                console.log('balance from restored faucet IS', balanceFaucet);
                console.log('balance from restored MINE1 IS', balanceNewMine1);
                console.log('balance from restored MINE2 IS', balanceNewMine2);
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
    var pkey, password, walletInfo, destAddress, toWalletInfo, balanceOld, sidsResult, sids, fraCode, assetCode, assetBlindRules, transactionBuilder, resultHandle, height, blockDetailsResult, h, txStatus, dataResult, submitResult, sidsResultNew, sidsNew, sortedSidsNew, balanceNew;
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
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 9:
                _a.sent();
                height = 45;
                return [4 /*yield*/, api_1.Network.getBlock(height)];
            case 10:
                blockDetailsResult = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 337 ~ transferFraToSingleAddress ~ blockDetailsResult', JSON.stringify(blockDetailsResult, null, 2));
                h = resultHandle;
                return [4 /*yield*/, api_1.Network.getTransactionStatus(h)];
            case 11:
                txStatus = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 341 ~ transferFraToSingleAddress ~ txStatus', JSON.stringify(txStatus, null, 2));
                return [4 /*yield*/, api_1.Network.getHashSwap(h)];
            case 12:
                dataResult = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 345 ~ transferFraToSingleAddress ~ dataResult', JSON.stringify(dataResult, null, 2));
                return [4 /*yield*/, api_1.Network.getTransactionStatus(resultHandle)];
            case 13:
                submitResult = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1265 ~ barToAbar ~ submitResult after waiting', submitResult);
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 14:
                sidsResultNew = _a.sent();
                sidsNew = sidsResultNew.response;
                if (!sidsNew) {
                    throw new Error('no sids!');
                }
                sortedSidsNew = sids.sort(function (a, b) { return b - a; });
                console.log('🚀 ~ file: run.ts ~ line 335 ~ transferFraToSingleAddress ~ sortedSidsNew', sortedSidsNew);
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 15:
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
                console.log("Sending amount of ".concat(amount, " FRA"));
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
                toPkeyMine2 = PKEY_MINE;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 396 ~ transferFraToSingleRecepient ~ walletInfo', walletInfo);
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkeyMine2, password)];
            case 2:
                toWalletInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 397 ~ transferFraToSingleRecepient ~ toWalletInfo', toWalletInfo);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                assetCode = fraCode;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '0.03', assetCode, assetBlindRules)];
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
                myBody = "".concat(existingContent, "\nFUNCTION STARTED: ").concat(new Date());
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
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionSubmit ~ Could not retrieve the transaction with a handle ".concat(resultHandle, ". Response was: "), transactionStatus);
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
    var password, Ledger, pkey, walletInfo, toWalletInfo, fraCode, assetBlindRules, numbersToSend, numbersToDelegate, balanceBeforeSend, transactionBuilderSend, resultHandleSend, balanceAfterSend, delegationTargetPublicKey, delegationTargetAddress, formattedVlidators, validatorAddress, transactionBuilder, resultHandle, transactionStatus, sendResponse, Committed, txnSID, balanceAfterDelegate, delegateInfo, isRewardsAdded, balanceBefore, transactionBuilderClaim, resultHandleClaim, transactionStatusClaim, claimResponse, ClaimCommited, txnSIDClaim, balanceAfter, isClaimSuccessfull;
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
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ".concat(resultHandle, ". Response was: "), transactionStatus);
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
                return [4 /*yield*/, api_1.Staking.claim(toWalletInfo, ['addr'])];
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
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ delegateFraTransactionAndClaimRewards ~ Could not retrieve the transaction with a handle ".concat(resultHandle, ". Response was: "), transactionStatusClaim);
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
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ".concat(resultHandleSend, ". Response was: "), transactionStatusSend);
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
                    console.log("\uD83D\uDE80 ~ file: integration.ts ~ line 477 ~ unstakeFraTransactionSubmit ~ Could not retrieve the transaction with a handle ".concat(resultHandleDelegate, ". Response was: "), transactionStatusDelegate);
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
                console.log("\uD83D\uDE80 ~ file: run.ts ~ line 1154 ~ ".concat(methodName, " ~ result"), result);
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
                    return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, "1.2".concat(amount), assetCode, assetBlindRules)];
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
function approveToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function testCommitment() {
    return __awaiter(this, void 0, void 0, function () {
        var data2, atxoSid, myMemoData, anonKeysReceiver, ledger, commitmentInBase64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data2 = [
                        33,
                        {
                            point: 'd4koAbY2p-9fu5KOSkcmlRtefgqmwrIlm--3gx0KLjU=',
                            ctext: [
                                153, 62, 220, 132, 222, 139, 46, 13, 77, 111, 92, 117, 139, 60, 245, 53, 247, 132, 69, 227, 69, 186,
                                173, 123, 147, 193, 177, 244, 148, 26, 186, 90, 19, 157, 1, 113, 170, 113, 165, 15, 76, 15, 83, 82,
                                138, 161, 98, 95, 34, 54, 118, 251, 30, 232, 104, 241, 101, 249, 228, 103, 153, 149, 249, 145, 174,
                                179, 176, 156, 255, 163, 40, 26, 105, 206, 199, 37, 102, 217, 160, 234, 79, 197, 103, 171, 213, 122,
                                14, 204,
                            ],
                        },
                    ];
                    atxoSid = data2[0], myMemoData = data2[1];
                    anonKeysReceiver = {
                        axfrPublicKey: '-pYD3GuyEZEQFuVglcPs4QTRqaaEGdK4jgfuxmNnBZ4=',
                        axfrSpendKey: 'uM-PgcQxe2Vx1_NpSEnRe1VAJmDEUIgdFUqkaN7n70KfrzM0HF4CpGqBu49EGcVLjt9mib_UGh8EgGlp6DZ2BvqWA9xrshGREBblYJXD7OEE0ammhBnSuI4H7sZjZwWe',
                        axfrViewKey: 'n68zNBxeAqRqgbuPRBnFS47fZom_1BofBIBpaeg2dgY=',
                    };
                    return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    commitmentInBase64 = '-NVMwSq6OciQPxpm1mNAond3c8Euxse4Rt9tTyPk0jo=';
                    return [2 /*return*/];
            }
        });
    });
}
function runAbarCreating(iterations) {
    if (iterations === void 0) { iterations = 20; }
    return __awaiter(this, void 0, void 0, function () {
        var anonKeys1, anonKeys2, wallets, i, maxAtxoSidResult, masError, masResponse, walletIndex, amountToSend, currentWallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    anonKeys1 = {
                        axfrPublicKey: 'vZ91wm2xNKuQDmziOYQruRRg6Pj36k8V6YH2NbyjSnAA',
                        axfrSecretKey: 'Ip-rnJqV3kBFhuQATH1mqtXIYUCvoxkbUjYk4bFDc-y9n3XCbbE0q5AObOI5hCu5FGDo-PfqTxXpgfY1vKNKcAA=',
                    };
                    anonKeys2 = {
                        axfrPublicKey: '-4HK7kShP7wxSeUUb0z3I_goisFx3xywXte1iPSFfauA',
                        axfrSecretKey: '01xTmsZbLjkQhJjrQuqnK0bgd0glIJXSTit1WvSLq3T7gcruRKE_vDFJ5RRvTPcj-CiKwXHfHLBe17WI9IV9q4A=',
                    };
                    wallets = [anonKeys1, anonKeys2];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < iterations)) return [3 /*break*/, 4];
                    console.log("-=-=-=-=-=-=-   =-=-=-==-==- ==-==-   ITERARION ".concat(i));
                    return [4 /*yield*/, api_1.Network.getMaxAtxoSid()];
                case 2:
                    maxAtxoSidResult = _a.sent();
                    masError = maxAtxoSidResult.error, masResponse = maxAtxoSidResult.response;
                    if (masError) {
                        (0, utils_1.log)('error!', masError);
                        throw new Error('could not get mas');
                    }
                    console.log("=======   ========= ======= Current MAS = ".concat(masResponse));
                    walletIndex = (i + 1) % 2 === 0 ? 1 : 0;
                    amountToSend = walletIndex ? '10' : '10';
                    currentWallet = wallets[walletIndex];
                    console.log('🚀 ~ file: run.ts ~ line 1655 ~ runAbarCreating ~ currentWallet', currentWallet);
                    _a.label = 3;
                case 3:
                    i = i + 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// async function testFailure() {
//   const result = await TMI.abarToBarCustomSendAmount();
//   console.log('🚀 ~ file: run.ts ~ line 1647 ~ testFailure ~ result', result);
// }
function getMas() {
    return __awaiter(this, void 0, void 0, function () {
        var maxAtxoSidResult, masError, masResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.Network.getMaxAtxoSid()];
                case 1:
                    maxAtxoSidResult = _a.sent();
                    masError = maxAtxoSidResult.error, masResponse = maxAtxoSidResult.response;
                    if (masError) {
                        (0, utils_1.log)('error!', masError);
                        throw new Error('could not get mas');
                    }
                    console.log("Current MAS = ".concat(masResponse));
                    return [4 /*yield*/, api_1.Network.getAbarMemos('1', '20')];
                case 2:
                    result = _a.sent();
                    console.log('🚀 /////////////// . ~ file: run.ts ~ line 1450 ~ testIt ~ result', result);
                    return [2 /*return*/];
            }
        });
    });
}
function prism() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = api_1.Evm.fraAddressToHashAddress('eth1qg9szy8wxgxgn7swrwj7va4whuur65z7xvj3vddh4wkd2nd7u8mpsu8882y');
            console.log(result);
            return [2 /*return*/];
        });
    });
}
function testWasmFunctions(walletInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var ledger, publickeyFormatEth, publickeyAddressFormatEth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    publickeyFormatEth = ledger.get_pub_key_str(walletInfo.keypair);
                    publickeyAddressFormatEth = ledger.bech32_to_base64(walletInfo.address);
                    console.log('============');
                    console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
                    console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);
                    console.log('============');
                    return [2 /*return*/];
            }
        });
    });
}
function testBrokenKeypairOne() {
    return __awaiter(this, void 0, void 0, function () {
        var ledger, mnemonic, keypair, publickey, address, publickeyFormatEth, publickeyAddressFormatEth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    console.log('============');
                    mnemonic = 'zoo nerve assault talk depend approve mercy surge bicycle ridge dismiss satoshi boring opera next fat cinnamon valley office actor above spray alcohol giant';
                    keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic);
                    return [4 /*yield*/, api_1.Keypair.getPublicKeyStr(keypair)];
                case 2:
                    publickey = _a.sent();
                    console.log('publickey (from restored keypair)', publickey);
                    return [4 /*yield*/, api_1.Keypair.getAddress(keypair)];
                case 3:
                    address = _a.sent();
                    console.log('address (from restored keypair)', address);
                    publickeyFormatEth = ledger.get_pub_key_str(keypair);
                    publickeyAddressFormatEth = ledger.bech32_to_base64(address);
                    console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
                    console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);
                    console.log('\n');
                    console.log('============');
                    return [2 /*return*/];
            }
        });
    });
}
function testBrokenKeypairTwo() {
    return __awaiter(this, void 0, void 0, function () {
        var ledger, keypair, publickey, address, publickeyFormatEth, publickeyAddressFormatEth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    console.log('============');
                    keypair = ledger.new_keypair();
                    return [4 /*yield*/, api_1.Keypair.getPublicKeyStr(keypair)];
                case 2:
                    publickey = _a.sent();
                    console.log('publickey (from created keypair)', publickey);
                    return [4 /*yield*/, api_1.Keypair.getAddress(keypair)];
                case 3:
                    address = _a.sent();
                    console.log('address (from created keypair)', address);
                    publickeyFormatEth = ledger.get_pub_key_str(keypair);
                    publickeyAddressFormatEth = ledger.bech32_to_base64(address);
                    console.log('publickeyFormatEth (from keypair , using get_pub_key_str)', publickeyFormatEth);
                    console.log('publickeyAddressFormatEth (from address , using bech32_to_base64)', publickeyAddressFormatEth);
                    console.log('\n');
                    console.log('============');
                    return [2 /*return*/];
            }
        });
    });
}
function testBrokenKeypairs() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testBrokenKeypairOne()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testBrokenKeypairTwo()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getNewBalanace() {
    return __awaiter(this, void 0, void 0, function () {
        var isFra, pkeyLocalFaucetFra, pkeyLocalFaucetEth, mnemonicLocalFaucet, faucetWalletInfoPkeyFra, faucetWalletInfoPkeyEth, faucetWalletInfoMnemonic, balanceFaucetFra, balanceFaucetEth, balanceFaucetMnemonic, error_3, error_4, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isFra = false;
                    pkeyLocalFaucetFra = 'o9gXFI5ft1VOkzYhvFpgUTWVoskM1CEih0zJcm3-EAQ=';
                    pkeyLocalFaucetEth = 'AW1bcpuGIThE5wnspklloHG6s5qGOKbC6Msca0OTpb41';
                    mnemonicLocalFaucet = 'zoo nerve assault talk depend approve mercy surge bicycle ridge dismiss satoshi boring opera next fat cinnamon valley office actor above spray alcohol giant';
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkeyLocalFaucetFra, password)];
                case 1:
                    faucetWalletInfoPkeyFra = _a.sent();
                    return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkeyLocalFaucetEth, password)];
                case 2:
                    faucetWalletInfoPkeyEth = _a.sent();
                    return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mnemonicLocalFaucet.split(' '), password)];
                case 3:
                    faucetWalletInfoMnemonic = _a.sent();
                    return [4 /*yield*/, api_1.Account.getBalance(faucetWalletInfoPkeyFra)];
                case 4:
                    balanceFaucetFra = _a.sent();
                    return [4 /*yield*/, api_1.Account.getBalance(faucetWalletInfoPkeyEth)];
                case 5:
                    balanceFaucetEth = _a.sent();
                    return [4 /*yield*/, api_1.Account.getBalance(faucetWalletInfoMnemonic)];
                case 6:
                    balanceFaucetMnemonic = _a.sent();
                    console.log('============--------------=============================');
                    console.log('\n');
                    console.log('Faucet pkey fra', pkeyLocalFaucetFra, '\n');
                    console.log('faucetWalletInfoPkeyFra.address ', faucetWalletInfoPkeyFra.address);
                    console.log('faucetWalletInfoPkeyFra.privateStr', faucetWalletInfoPkeyFra.privateStr);
                    console.log('faucetWalletInfoPkeyFra.publickey', faucetWalletInfoPkeyFra.publickey);
                    console.log('\n');
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, testWasmFunctions(faucetWalletInfoPkeyFra)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    console.log('we have an error', error_3);
                    return [3 /*break*/, 10];
                case 10:
                    console.log('\n');
                    console.log('============--------------=============================');
                    console.log('\n');
                    console.log('Faucet pkey eth', pkeyLocalFaucetEth, '\n');
                    console.log('faucetWalletInfoPkeyEth.address ', faucetWalletInfoPkeyEth.address);
                    console.log('faucetWalletInfoPkeyEth.privateStr', faucetWalletInfoPkeyEth.privateStr);
                    console.log('faucetWalletInfoPkeyEth.publickey', faucetWalletInfoPkeyEth.publickey);
                    console.log('\n');
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, testWasmFunctions(faucetWalletInfoPkeyFra)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_4 = _a.sent();
                    console.log('we have an error', error_4);
                    return [3 /*break*/, 14];
                case 14:
                    console.log('\n');
                    console.log('============--------------=============================');
                    console.log('\n');
                    console.log('Faucet Mnemonic', mnemonicLocalFaucet, '\n');
                    console.log('faucetWalletInfoMnemonic.address ', faucetWalletInfoMnemonic.address);
                    console.log('faucetWalletInfoMnemonic.privateStr', faucetWalletInfoMnemonic.privateStr);
                    console.log('faucetWalletInfoMnemonic.publickey', faucetWalletInfoMnemonic.publickey);
                    console.log('\n');
                    _a.label = 15;
                case 15:
                    _a.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, testWasmFunctions(faucetWalletInfoMnemonic)];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 17:
                    error_5 = _a.sent();
                    console.log('we have an error', error_5);
                    return [3 /*break*/, 18];
                case 18:
                    console.log('\n');
                    return [2 /*return*/];
            }
        });
    });
}
function getTxnListTest() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function fnsNameResolver() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.Evm.getDomainCurrentText('eba.fra')];
                case 1:
                    result = _a.sent();
                    console.log(result === null || result === void 0 ? void 0 : result.eth);
                    return [2 /*return*/];
            }
        });
    });
}
// prism();
// approveToken();
// testItSync();
// getFraBalance();
// testWasmFunctions();
// getAnonKeys();
// runAbarCreating(2);
// getMas();
// getAbarBalance();
// testFailure();
// getNewBalanace();
// testBrokenKeypairs();
// getTxnListTest();
// fnsNameResolver();
var deployBrc20 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, balanceOld, sidsResult, transactionBuilder, tx, bytes, binary, i, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'eWI2DwxJY7v3JGVn9T16iHgV-ORhVa9hKAqfgpkzmsg=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 2:
                balanceOld = _a.sent();
                console.log('🚀 ~ file: run.ts ~ balanceOld', balanceOld);
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 3:
                sidsResult = _a.sent();
                console.log('sids:', sidsResult);
                return [4 /*yield*/, api_1.Transaction.brc20(walletInfo, 'deploy', 'giambi222')];
            case 4:
                transactionBuilder = _a.sent();
                tx = stringToHex(transactionBuilder.transaction());
                // const tx = '7b22626f6479223a7b226e6f5f7265706c61795f746f6b656e223a5b5b3131302c3230372c33332c3138362c3235342c3134372c3138362c3133375d2c31393132315d2c226f7065726174696f6e73223a5b7b225472616e736665724173736574223a7b22626f6479223a7b22696e70757473223a5b7b224162736f6c757465223a35373331347d5d2c22706f6c6963696573223a7b2276616c6964223a747275652c22696e707574735f74726163696e675f706f6c6963696573223a5b5b5d5d2c22696e707574735f7369675f636f6d6d69746d656e7473223a5b6e756c6c5d2c226f7574707574735f74726163696e675f706f6c6963696573223a5b5b5d2c5b5d2c5b5d5d2c226f7574707574735f7369675f636f6d6d69746d656e7473223a5b6e756c6c2c6e756c6c2c6e756c6c5d7d2c226f757470757473223a5b7b226964223a6e756c6c2c227265636f7264223a7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a223130303030227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a22414141414141414141414141414141414141414141414141414141414141414141414141414141414141413d227d7d2c7b226964223a6e756c6c2c227265636f7264223a7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a2231227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a226c30517567744e554b47443533574b6646364271364548457550775a63526e45766e5f5047343852336a673d227d2c226d656d6f223a227b5c22705c223a5c226272632d32305c222c5c226f705c223a5c227472616e736665725c222c5c227469636b5c223a5c226f7264695c222c5c22616d745c223a5c22313030305c227d227d2c7b226964223a6e756c6c2c227265636f7264223a7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a223437343839363233313039393935227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a22485a6e787750493550445f78705158314e714b54485871506448585658744765377951304a49334d5654733d227d7d5d2c227472616e73666572223a7b22696e70757473223a5b7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a223437343839363233313139393936227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a22485a6e787750493550445f78705158314e714b54485871506448585658744765377951304a49334d5654733d227d5d2c226f757470757473223a5b7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a223130303030227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a22414141414141414141414141414141414141414141414141414141414141414141414141414141414141413d227d2c7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a2231227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a226c30517567744e554b47443533574b6646364271364548457550775a63526e45766e5f5047343852336a673d227d2c7b22616d6f756e74223a7b224e6f6e436f6e666964656e7469616c223a223437343839363233313039393935227d2c2261737365745f74797065223a7b224e6f6e436f6e666964656e7469616c223a5b302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c302c305d7d2c227075626c69635f6b6579223a22485a6e787750493550445f78705158314e714b54485871506448585658744765377951304a49334d5654733d227d5d2c2270726f6f6673223a7b2261737365745f747970655f616e645f616d6f756e745f70726f6f66223a224e6f50726f6f66222c2261737365745f74726163696e675f70726f6f66223a7b2261737365745f747970655f616e645f616d6f756e745f70726f6f6673223a5b5d2c22696e707574735f6964656e746974795f70726f6f6673223a5b5b5d5d2c226f7574707574735f6964656e746974795f70726f6f6673223a5b5b5d2c5b5d2c5b5d5d7d7d2c2261737365745f74726163696e675f6d656d6f73223a5b5b5d2c5b5d2c5b5d2c5b5d5d2c226f776e6572735f6d656d6f73223a5b6e756c6c2c6e756c6c2c6e756c6c5d7d2c227472616e736665725f74797065223a225374616e64617264227d2c22626f64795f7369676e617475726573223a5b7b2261646472657373223a7b226b6579223a22485a6e787750493550445f78705158314e714b54485871506448585658744765377951304a49334d5654733d227d2c227369676e6174757265223a22594e2d473466437258334b5938614d464a78734e6a654b6135527266396c79584861453975773876583877455f557575706633736a6b67477530347573334e574f6d6f4167733042317a32624a31636f7356396344513d3d227d5d7d7d5d7d2c227075626b65795f7369676e5f6d6170223a7b22485a6e787750493550445f78705158314e714b54485871506448585658744765377951304a49334d5654733d223a2261556f7775334b7462634d446b4539592d4b6673646859617467596852613367475833774464505a595337394847634a6d617a6d567134337669384d6561584e4c446944333268324165716f4c506a31554c713742773d3d227d7d';
                console.log('send fra result handle!!');
                bytes = hexToBytes(tx);
                console.log(bytes);
                binary = '';
                for (i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                console.log(btoa(binary));
                return [4 /*yield*/, api_1.Network.submitBRC20Tx(btoa(binary))];
            case 5:
                result = _a.sent();
                console.log(result);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
deployBrc20();
function hexToBytes(hex) {
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
var stringToHex = function (str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        var hexValue = charCode.toString(16);
        // Pad with zeros to ensure two-digit representation
        hex += hexValue.padStart(2, '0');
    }
    return hex;
};
//# sourceMappingURL=run.js.map