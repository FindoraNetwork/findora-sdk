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
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
var dotenv_1 = __importDefault(require("dotenv"));
var _1 = require(".");
var api_1 = require("./api");
var Sdk_1 = __importDefault(require("./Sdk"));
var bigNumber = __importStar(require("./services/bigNumber"));
var providers_1 = require("./services/cacheStore/providers");
var Fee = __importStar(require("./services/fee"));
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
var UtxoHelper = __importStar(require("./services/utxoHelper"));
dotenv_1.default.config();
var sdkEnv = {
    // hostUrl: 'https://dev-staging.dev.findora.org',
    hostUrl: 'https://prod-testnet.prod.findora.org',
    cacheProvider: providers_1.FileCacheProvider,
    // cacheProvider: MemoryCacheProvider,
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
    var pkey2, pkey, password, assetCode, walletInfo, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                assetCode = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 41 ~ myFunc2 ~ assetCode', assetCode);
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
// myFunc2();
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
    var ledger, address, pkey, password, walletInfo, sidsResult, sids, utxoDataList, fraCode, amount, sendUtxoList, utxoInputsInfo, minimalFee, toPublickey, publicKeyInString, addressInString, recieversInfo, trasferOperation;
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
                console.log('toPublickey', toPublickey);
                publicKeyInString = ledger.public_key_to_base64(toPublickey);
                console.log('publicKeyInString', publicKeyInString);
                addressInString = ledger.base64_to_bech32(publicKeyInString);
                console.log('addressInString', addressInString);
                recieversInfo = [
                    {
                        utxoNumbers: minimalFee,
                        toPublickey: toPublickey,
                    },
                ];
                return [4 /*yield*/, Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, 
                    // minimalFee,
                    fraCode)];
            case 7:
                trasferOperation = _a.sent();
                console.log('trasferOperation!', trasferOperation);
                return [2 /*return*/];
        }
    });
}); };
// get fra balance
var myFunc5 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey1, pkey2, pkey3, pkey4, pkey5, pkey6, toPkeyMine2, toPkeyMine3, password, walletInfo, fraCode, sidsResult, sids, balanceInWei, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey1 = 'p-9UpNFzuyptVhdMrNj2tyQqFrYaC5lqBvWrEsSKc-g=';
                pkey2 = 'ZbGRFBqZC_wD4SBfAbxqh17BG-y-jTbkeLNs06FUHJY=';
                pkey3 = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
                pkey4 = 'o9xuRVejhJ5iLCTkqfjyWfoCDmJPB4clklfyozCw5Xg=';
                pkey5 = 'lr4eDDnOHPo8DsLL12bQtzTZkdz4kcB6CSs8RgD0sVk=';
                pkey6 = 'gOGMwUJN8Tq33LwIdWHmkfcbYesg7Us_S58WEgJaRYc=';
                toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toPkeyMine3 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey6, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                fraCode = _a.sent();
                return [4 /*yield*/, api_1.Network.getOwnedSids(walletInfo.publickey)];
            case 3:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, api_1.Account.getAssetBalance(walletInfo, fraCode, sids)];
            case 4:
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
// get custom asset balance
var myFunc6 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, customAssetCode, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';
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
    var pkey, customAssetCode, password, walletInfo, assetBlindRules, assetBuilder, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                customAssetCode = 'GWw7tW0-KPFldMqFE3Zy2ZT7Ko_TSIvi0wh2D8_2Vec=';
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
    var pkey, toPkeyMine2, toPkeyMine3, password, walletInfo, toWalletInfo, fraCode, assetCode, assetBlindRules, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
                toPkeyMine2 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
                toPkeyMine3 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
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
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, '4', assetCode, assetBlindRules)];
            case 4:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 5:
                resultHandle = _a.sent();
                // console.log(resultHandle.transaction());
                console.log('send fra result handle!!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
// send custom asset
var myFunc10 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, customAssetCode, toPkey, password, walletInfo, toWalletInfo, assetCode, assetBlindRules, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                customAssetCode = '1LZBwDm6JM8obbHQonBq8ICMIekDY1gbA1-Sify3t3M=';
                toPkey = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
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
                resultHandle = _a.sent();
                console.log('send custom result handle!', resultHandle);
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
    var pkey, toPkeyMine2, toPkeyMine3, password, walletInfo, toWalletInfoMine2, toWalletInfoMine3, fraCode, assetCode, assetBlindRules, recieversInfo, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = '2p2Pmy9VOsgVQfnt4pz77Cfr-JWM8IC97VIHt8ATvBE=';
                toPkeyMine2 = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';
                toPkeyMine3 = 'han9zoCsVi5zISyft_KWDVTwakAX30WgKYHrLPEhsF0=';
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
                    { reciverWalletInfo: toWalletInfoMine2, amount: '10' },
                    { reciverWalletInfo: toWalletInfoMine3, amount: '20' },
                ];
                return [4 /*yield*/, api_1.Transaction.sendToMany(walletInfo, recieversInfo, assetCode, assetBlindRules)];
            case 5:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 6:
                resultHandle = _a.sent();
                console.log('send custom result handle!', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
// get block details
var myFunc13 = function () { return __awaiter(void 0, void 0, void 0, function () {
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
// send custom
// myFunc10();
// fra balance
// myFunc5();
// myFunc12();
// send fra
// myFunc9();
// myFunc4();
// send fra to many
// myFunc12();
// myFunc8();
// define asset
// myFunc2();
// issue custom asset
// myFunc7();
// send custom asset
// myFunc10();
myFunc6();
//# sourceMappingURL=run.js.map