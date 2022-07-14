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
exports.sendEvmToAccount = exports.sendAccountToEvm = exports.createLowLevelData = void 0;
var ethers_1 = require("ethers");
var js_base64_1 = __importDefault(require("js-base64"));
var web3_1 = __importDefault(require("web3"));
var api_1 = require("../../api");
var bigNumber_1 = require("../../services/bigNumber");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var AssetApi = __importStar(require("../sdkAsset"));
var Transaction = __importStar(require("../transaction"));
var toHex = function (covertThis, padding) {
    var temp1 = ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.utils.hexlify(BigInt(covertThis)), padding);
    return temp1;
};
var createGenericDepositData = function (hexMetaData) {
    if (hexMetaData === null) {
        return '0x' + toHex('0', 32).substring(2); // len(metaData) (32 bytes)
    }
    var hexMetaDataLength = hexMetaData.substring(2).length / 2;
    return '0x' + toHex(String(hexMetaDataLength), 32).substring(2) + hexMetaData.substr(2);
};
var createLowLevelData = function (destinationChainId, tokenAmount, tokenId, recipientAddress, funcName) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, data, fun, dt, callData, fun1;
    return __generator(this, function (_a) {
        web3 = new web3_1.default();
        data = web3.eth.abi.encodeParameters(['uint256', 'address', 'uint256'], [tokenId, recipientAddress, tokenAmount]);
        fun = web3.eth.abi.encodeFunctionCall({
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                },
            ],
            name: 'withdrawToOtherChainCallback',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        }, [data]);
        dt = '0x' + fun.substring(10);
        callData = createGenericDepositData(dt);
        fun1 = web3.eth.abi.encodeFunctionCall({
            inputs: [
                {
                    name: 'chainId',
                    type: 'uint8',
                },
                {
                    name: 'data',
                    type: 'bytes',
                },
            ],
            name: funcName,
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        }, [destinationChainId, callData]);
        return [2 /*return*/, fun1];
    });
}); };
exports.createLowLevelData = createLowLevelData;
var sendAccountToEvm = function (walletInfo, amount, ethAddress, assetCode, lowLevelData) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, address, fraAssetCode, mainAssetCode, assetBlindRules, transactionBuilder, asset, decimals, convertAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                address = ledger.base64_to_bech32(ledger.get_coinbase_address());
                fraAssetCode = ledger.fra_get_asset_code();
                mainAssetCode = assetCode || fraAssetCode;
                assetBlindRules = {
                    isAmountBlind: false,
                    isTypeBlind: false,
                };
                return [4 /*yield*/, Transaction.sendToAddress(walletInfo, address, amount, mainAssetCode, assetBlindRules)];
            case 2:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 3:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                convertAmount = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                transactionBuilder = transactionBuilder
                    .add_operation_convert_account(walletInfo.keypair, ethAddress, convertAmount, mainAssetCode, lowLevelData)
                    .sign(walletInfo.keypair);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.sendAccountToEvm = sendAccountToEvm;
/**
 * Transfer ETH to the user FRA address
 *
 * @remarks
 * To transfer ETH tokens to the FRA address (EVM transfer) user should use this function
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *  const ethPrivate = 'faXXXX';
 *  const ethAddress = '0xXXX';
 *
 *  const result = await Evm.sendEvmToAccount(walletInfo.address, amount, ethPrivate, ethAddress);
 * ```
 *
 * @throws `Get nonce error`
 * @throws `Evm to Account wasm error`
 * @throws `Could not submit of transactions. No response from the server`
 * @throws `Evm to Account submit error`
 *
 * @returns Result of transaction submission to the network
 */
var sendEvmToAccount = function (fraAddress, amount, ethPrivate, ethAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, accountPublickey, asset, decimals, utxoNumbers, nonce, result_1, err_1, e, result, e, submitResult, err_2, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                accountPublickey = ledger.public_key_from_bech32(fraAddress);
                return [4 /*yield*/, AssetApi.getAssetDetails(ledger.fra_get_asset_code())];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                nonce = '';
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, api_1.Network.getAbciNoce(ethAddress)];
            case 4:
                result_1 = _a.sent();
                if (result_1.response && result_1.response.result.response.code === 0) {
                    nonce = result_1.response.result.response.value;
                    nonce = js_base64_1.default.atob(nonce);
                    nonce = JSON.parse(nonce);
                }
                else {
                    throw new Error('Get nonce error');
                }
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                e = err_1;
                throw new Error("Get nonce error \"" + ethAddress + "\". Error - " + e.message);
            case 6:
                result = '';
                try {
                    result = ledger.transfer_to_utxo_from_account(accountPublickey, BigInt(utxoNumbers), ethPrivate, BigInt(nonce));
                }
                catch (err) {
                    e = err;
                    throw new Error("Evm to Account wasm error\". Error - " + e.message);
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, api_1.Network.submitEvmTx(js_base64_1.default.encode(result))];
            case 8:
                submitResult = _a.sent();
                if (!submitResult.response) {
                    throw new Error('Could not submit of transactions. No response from the server.');
                }
                return [2 /*return*/, submitResult];
            case 9:
                err_2 = _a.sent();
                e = err_2;
                throw new Error("Evm to Account submit error\". Error - " + e.message);
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.sendEvmToAccount = sendEvmToAccount;
//# sourceMappingURL=evm.js.map