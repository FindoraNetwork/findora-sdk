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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var api_1 = require("./api");
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber_1 = require("./services/bigNumber");
var providers_1 = require("./services/cacheStore/providers");
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
console.log("Connecting to \"" + sdkEnv.hostUrl + "\"");
var _a = process.env, _b = _a.CUSTOM_ASSET_CODE, CUSTOM_ASSET_CODE = _b === void 0 ? '' : _b, _c = _a.PKEY_MINE, PKEY_MINE = _c === void 0 ? '' : _c, _d = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1, PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1 = _d === void 0 ? '' : _d, _e = _a.PKEY_MINE2, PKEY_MINE2 = _e === void 0 ? '' : _e, _f = _a.PKEY_MINE3, PKEY_MINE3 = _f === void 0 ? '' : _f, _g = _a.PKEY_LOCAL_FAUCET, PKEY_LOCAL_FAUCET = _g === void 0 ? '' : _g, _h = _a.ENG_PKEY, ENG_PKEY = _h === void 0 ? '' : _h, _j = _a.PKEY_LOCAL_TRIPLE_MASKING, PKEY_LOCAL_TRIPLE_MASKING = _j === void 0 ? '' : _j, _k = _a.PKEY_LOCAL_FAUCET_MNEMONIC_STRING, PKEY_LOCAL_FAUCET_MNEMONIC_STRING = _k === void 0 ? '' : _k, _l = _a.M_STRING, M_STRING = _l === void 0 ? '' : _l, _m = _a.FRA_ADDRESS, FRA_ADDRESS = _m === void 0 ? '' : _m, _o = _a.ETH_PRIVATE, ETH_PRIVATE = _o === void 0 ? '' : _o, _p = _a.ETH_ADDRESS, ETH_ADDRESS = _p === void 0 ? '' : _p;
var mainFaucet = PKEY_LOCAL_FAUCET;
var CustomAssetCode = CUSTOM_ASSET_CODE;
var myAbarAnonKeys = {
    axfrPublicKey: 'RFuVMPlD0pVcBlRIDKCwp5WNliqjGF4RG_r-SCzajOw=',
    axfrSpendKey: 'lgwn_gnSNPEiOmL1Tlb_nSzNcPkZa4yUqiIsR4B_skb4jYJBFjaRQwUlTi22XO3cOyxSbiv7k4l68kj2jzOVCURblTD5Q9KVXAZUSAygsKeVjZYqoxheERv6_kgs2ozs',
    axfrViewKey: '-I2CQRY2kUMFJU4ttlzt3DssUm4r-5OJevJI9o8zlQk=',
};
var myGivenCommitmentsList = [
    // 'FYKxtmrH4SoXvVTf82wNz6PVqWdbo1kJcmYpcgctnvH5', // 6
    // '8Q1eEr4HoWfwqXGDucUvmrZ4UDZHgPFnF7vi9UAVj2GC', // 5
    // '3qZaSoUscNyU5MUJjzHoQWPgUwQ515i2TtGmHFpjYfQy', // 8
    // 'FeKLHRpfREkG5XzLLPKzwPjWTJazJe7b1jhkpbv5NomA',
    'GD1q5AZX7kwgeMM88x5MTYy2Ek2vi1bbt4ep6oSdeg6a',
    'EU6sbUEKBpoMwxdx1D1vE8GDgVh6ccQ6Dv4y1TZ2Nwg3',
    '4zRUTuWqq3RcmXpcPxiM5GYkBnf8g6M6jisenJEJniKr',
];
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
                mString = PKEY_LOCAL_FAUCET_MNEMONIC_STRING_MINE1;
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
var getUnspentAbars = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, unspentAbars;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitmentsList = myGivenCommitmentsList;
                return [4 /*yield*/, api_1.TripleMasking.getUnspentAbars(anonKeys, givenCommitmentsList)];
            case 1:
                unspentAbars = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1291 ~ getUnspentAbars ~ unspentAbars', JSON.stringify(unspentAbars, null, 2));
                return [2 /*return*/];
        }
    });
}); };
var validateUnspent = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, spentAbars, _i, givenCommitmentsList_1, givenCommitment, axfrSecretKey, ownedAbarsResponse, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isNullifierHashSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitmentsList = myGivenCommitmentsList;
                return [4 /*yield*/, api_1.TripleMasking.getSpentAbars(anonKeys, givenCommitmentsList)];
            case 1:
                spentAbars = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1319 ~ getAbarBalance ~ spentAbars', JSON.stringify(spentAbars, null, 2));
                _i = 0, givenCommitmentsList_1 = givenCommitmentsList;
                _a.label = 2;
            case 2:
                if (!(_i < givenCommitmentsList_1.length)) return [3 /*break*/, 7];
                givenCommitment = givenCommitmentsList_1[_i];
                console.log("processing " + givenCommitment);
                axfrSecretKey = anonKeys.axfrSpendKey;
                return [4 /*yield*/, api_1.TripleMasking.getOwnedAbars(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1233 ~ validateUnspent ~ ownedAbarsResponse', JSON.stringify(ownedAbarsResponse, null, 2));
                ownedAbarItem = ownedAbarsResponse[0];
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, api_1.TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrSecretKey)];
            case 4:
                hash = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1249 ~ validateUnspent ~ hash', hash);
                return [4 /*yield*/, api_1.TripleMasking.isNullifierHashSpent(hash)];
            case 5:
                isNullifierHashSpent = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1279 ~ validateUnspent ~ isNullifierHashSpent', isNullifierHashSpent);
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getAbarBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitmentsList = myGivenCommitmentsList;
                return [4 /*yield*/, api_1.TripleMasking.getAllAbarBalances(anonKeys, givenCommitmentsList)];
            case 1:
                balances = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 1291 ~ getAbarBalance ~ balances', JSON.stringify(balances, null, 2));
                return [2 /*return*/];
        }
    });
}); };
var getAtxoSendList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var anonKeys, givenCommitmentsList, assetCode, amount, asset, decimals, amountToSend, atxoSendList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anonKeys = __assign({}, myAbarAnonKeys);
                givenCommitmentsList = myGivenCommitmentsList;
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 1:
                assetCode = _a.sent();
                amount = '26';
                return [4 /*yield*/, api_1.Asset.getAssetDetails(assetCode)];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                amountToSend = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                return [4 /*yield*/, api_1.TripleMasking.getSendAtxo(assetCode, amountToSend, givenCommitmentsList, anonKeys)];
            case 3:
                atxoSendList = _a.sent();
                console.log('🚀 ~ file: run-balance.ts ~ line 119 ~ getAbarBalance ~ atxoSendList', atxoSendList);
                return [2 /*return*/];
        }
    });
}); };
var testIt = function () { return __awaiter(void 0, void 0, void 0, function () {
    var txHash, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                txHash = 'dac392d9cd93d85d768f6c6784862d747fdeffd0d52e1295bde2c3dc10242225';
                return [4 /*yield*/, api_1.Network.getTransactionDetails(txHash)];
            case 1:
                result = _a.sent();
                console.log('🚀 ~ file: run-balance.ts ~ line 183 ~ getAnonKeys ~ result', result);
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
getFraBalance();
// getAnonKeys(); // +
// getAbarBalance();
//getAtxoSendList();
// getUnspentAbars();
// validateUnspent();
// testIt();
//# sourceMappingURL=run-balance.js.map