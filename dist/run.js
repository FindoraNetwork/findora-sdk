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
var _1 = require(".");
var api_1 = require("./api");
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber = __importStar(require("./services/bigNumber"));
var providers_1 = require("./services/cacheStore/providers");
var Fee = __importStar(require("./services/fee"));
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var UtxoHelper = __importStar(require("./services/utxoHelper"));
var sdkEnv = {
    hostUrl: 'https://dev-staging.dev.findora.org',
    cacheProvider: providers_1.FileCacheProvider,
    cachePath: './cache',
};
Sdk_1.default.init(sdkEnv);
var myFunc1 = function () { return __awaiter(void 0, void 0, void 0, function () {
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
// define asset
var myFunc2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, assetCode, walletInfo, asset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
                password = '123';
                console.log('pass!', password);
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                assetCode = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, assetCode)];
            case 3:
                asset = _a.sent();
                console.log('our new asset IS ', asset);
                return [2 /*return*/];
        }
    });
}); };
// get state commitment
var myFunc3 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, sidsResult, sid, utxo, ownerMemo, stateCommitment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';
                return [4 /*yield*/, api_1.Network.getOwnedSids(address)];
            case 1:
                sidsResult = _a.sent();
                console.log('sidsResult', sidsResult);
                sid = 519;
                return [4 /*yield*/, api_1.Network.getUtxo(sid)];
            case 2:
                utxo = _a.sent();
                console.log('utxo!', utxo);
                return [4 /*yield*/, api_1.Network.getOwnerMemo(sid)];
            case 3:
                ownerMemo = _a.sent();
                console.log('owner memo', ownerMemo);
                return [4 /*yield*/, api_1.Network.getStateCommitment()];
            case 4:
                stateCommitment = _a.sent();
                console.log('stateCommitment', stateCommitment);
                return [2 /*return*/];
        }
    });
}); };
// get transfer operation with fee
var myFunc4 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, address, pkey, password, walletInfo, sidsResult, sids, utxoDataList, fraCode, amount, sendUtxoList, utxoInputsInfo, minimalFee, toPublickey, recieversInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';
                pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(address)];
            case 3:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                console.log('sids', sids);
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, UtxoHelper.addUtxo(walletInfo, sids)];
            case 4:
                utxoDataList = _a.sent();
                console.log('utxoDataList', utxoDataList);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 5:
                fraCode = _a.sent();
                amount = BigInt(3);
                sendUtxoList = UtxoHelper.getSendUtxo(fraCode, amount, utxoDataList);
                console.log('sendUtxoList!', sendUtxoList);
                return [4 /*yield*/, UtxoHelper.addUtxoInputs(sendUtxoList)];
            case 6:
                utxoInputsInfo = _a.sent();
                console.log('utxoInputsInfo!', utxoInputsInfo);
                minimalFee = ledger.fra_get_minimal_fee();
                toPublickey = ledger.fra_get_dest_pubkey();
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, minimalFee, fraCode)];
            case 7:
                trasferOperation = _a.sent();
                console.log('trasferOperation!', trasferOperation);
                return [2 /*return*/];
        }
    });
}); };
// get fra balance
var myFunc5 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, pkey, password, walletInfo, fraCode, sidsResult, sids, balanceInWei, balance, balanceInWeiT, balanceT;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';
                pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(address)];
            case 3:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                console.log('sids!', sids);
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, api_1.Account.getAssetBalance(walletInfo, fraCode, sids)];
            case 4:
                balanceInWei = _a.sent();
                console.log('balance in wei IS!!', balanceInWei);
                balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
                console.log('balance IS!!!!!', balance);
                return [4 /*yield*/, api_1.Account.getAssetBalance(walletInfo, fraCode, sids)];
            case 5:
                balanceInWeiT = _a.sent();
                console.log('balanceT in wei IS!!', balanceInWeiT);
                balanceT = bigNumber.fromWei(balanceInWeiT, 6).toFormat(6);
                console.log('balance IS!!!!!', balanceT);
                return [2 /*return*/];
        }
    });
}); };
// get custom asset balance
var myFunc6 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, customAssetCode, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo, customAssetCode)];
            case 2:
                balance = _a.sent();
                console.log('balance IS :)', balance);
                return [2 /*return*/];
        }
    });
}); };
// issue custom asset
var myFunc7 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, password, walletInfo, assetBlindRules, decimals, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                assetBlindRules = { isAmountBlind: false };
                decimals = 6;
                return [4 /*yield*/, api_1.Asset.issueAsset(walletInfo, customAssetCode, 5, assetBlindRules, decimals)];
            case 2:
                handle = _a.sent();
                console.log('our issued tx handle IS  ', handle);
                return [2 /*return*/];
        }
    });
}); };
// creates a kp
var myFunc8 = function () { return __awaiter(void 0, void 0, void 0, function () {
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
// send fra
var myFunc9 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, toPkey, password, walletInfo, toWalletInfo, fraCode, assetCode, decimals, assetBlindRules, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toPkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                assetCode = fraCode;
                decimals = 6;
                assetBlindRules = { isTypeBlind: false, isAmountBlind: true };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, 0.1, assetCode, decimals, assetBlindRules)];
            case 4:
                resultHandle = _a.sent();
                console.log('send fra result handle', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
// send custom asset
var myFunc10 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, toPkey, password, walletInfo, toWalletInfo, assetCode, decimals, assetBlindRules, resultHandle, resultHandleTwo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';
                toPkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                assetCode = customAssetCode;
                decimals = 6;
                assetBlindRules = { isTypeBlind: true, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, 0.1, assetCode, decimals, assetBlindRules)];
            case 3:
                resultHandle = _a.sent();
                console.log('send custom result handle!', resultHandle);
                return [4 /*yield*/, api_1.Transaction.sendToPublicKey(walletInfo, toWalletInfo.publickey, 0.1, assetCode, decimals, assetBlindRules)];
            case 4:
                resultHandleTwo = _a.sent();
                console.log('send custom result handle 2!', resultHandleTwo);
                return [2 /*return*/];
        }
    });
}); };
// get custom asset details
var myFunc11 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var customAssetCode, result, h, txStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';
                return [4 /*yield*/, _1.Api.Asset.getAssetDetails(customAssetCode)];
            case 1:
                result = _a.sent();
                console.log('get custom asset details !', result);
                h = 'b07040a5d8c9ef6fcb98b95968e6c1f14f77405e851ac8230942e1c305913ea0';
                return [4 /*yield*/, api_1.Network.getTransactionStatus(h)];
            case 2:
                txStatus = _a.sent();
                console.log('txStatus!', JSON.stringify(txStatus, null, 2));
                return [2 /*return*/];
        }
    });
}); };
// send custom asset to many
var myFunc12 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, toPkey, password, walletInfo, toWalletInfo, assetCode, decimals, assetBlindRules, recieversInfo, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                customAssetCode = 'R_WbJ22P5lufAoOlF3kjI3Jgt6va8Afo3G6rZ_4Vjdg=';
                toPkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(toPkey, password)];
            case 2:
                toWalletInfo = _a.sent();
                assetCode = customAssetCode;
                decimals = 6;
                assetBlindRules = { isTypeBlind: true, isAmountBlind: false };
                recieversInfo = [
                    { reciverWalletInfo: toWalletInfo, amount: 0.1 },
                    { reciverWalletInfo: toWalletInfo, amount: 0.2 },
                ];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, decimals, assetBlindRules)];
            case 3:
                resultHandle = _a.sent();
                console.log('send custom result handle!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
// myFunc7();
// send custom
// myFunc10();
// send fra
// myFunc9();
myFunc12();
// myFunc8();
// myFunc7();
//# sourceMappingURL=run.js.map