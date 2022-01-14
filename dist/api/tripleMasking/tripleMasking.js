"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.barToAbar = exports.genAnonKeys = void 0;
var api_1 = require("../../api");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var utxoHelper_1 = require("../../services/utxoHelper");
var transaction_1 = require("../transaction");
var genAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, anonKeys, axfrPublicKey, axfrSecretKey, decKey, encKey, formattedAnonKeys, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ledger.gen_anon_keys()];
            case 3:
                anonKeys = _a.sent();
                axfrPublicKey = anonKeys.axfr_public_key;
                axfrSecretKey = anonKeys.axfr_secret_key;
                decKey = anonKeys.dec_key;
                encKey = anonKeys.enc_key;
                formattedAnonKeys = {
                    axfrPublicKey: axfrPublicKey,
                    axfrSecretKey: axfrSecretKey,
                    decKey: decKey,
                    encKey: encKey,
                };
                return [2 /*return*/, {
                        keysInstance: anonKeys,
                        formatted: formattedAnonKeys,
                    }];
            case 4:
                err_1 = _a.sent();
                throw new Error("could not get anon keys, \"" + err_1 + "\" ");
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.genAnonKeys = genAnonKeys;
var barToAbar = function (walletInfo, sid, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, transactionBuilder, item, utxoDataList, utxoItem, error_1, memoDataResult, myMemoData, memoError, ownerMemo, assetRecord, axfrPublicKey, encKey, error_2, randomizers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, (0, transaction_1.getTransactionBuilder)()];
            case 2:
                transactionBuilder = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, [sid])];
            case 4:
                utxoDataList = _a.sent();
                utxoItem = utxoDataList[0];
                item = utxoItem;
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                throw new Error("could not fetch utxo for sid " + sid);
            case 6: return [4 /*yield*/, api_1.Network.getOwnerMemo(sid)];
            case 7:
                memoDataResult = _a.sent();
                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"" + sid + "\", Error - " + memoError.message);
                }
                try {
                    ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;
                    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
                }
                catch (error) {
                    throw new Error("Could not get decode memo data or get assetRecord\", Error - " + error.message);
                }
                _a.label = 8;
            case 8:
                _a.trys.push([8, 11, , 12]);
                return [4 /*yield*/, api_1.Keypair.getAXfrPublicKeyByBase64(anonKeys.formatted.axfrPublicKey)];
            case 9:
                axfrPublicKey = _a.sent();
                return [4 /*yield*/, api_1.Keypair.getXPublicKeyByBase64(anonKeys.formatted.encKey)];
            case 10:
                encKey = _a.sent();
                return [3 /*break*/, 12];
            case 11:
                error_2 = _a.sent();
                throw new Error("Could not convert AXfrPublicKey\", Error - " + error_2.message);
            case 12:
                try {
                    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(walletInfo.keypair, axfrPublicKey, BigInt(sid), assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), encKey);
                }
                catch (error) {
                    throw new Error("Could not add bar to abar operation\", Error - " + error.message);
                }
                try {
                    randomizers = transactionBuilder === null || transactionBuilder === void 0 ? void 0 : transactionBuilder.get_randomizers();
                }
                catch (err) {
                    throw new Error("could not get a list of randomizers strings \"" + err.message + "\" ");
                }
                if (!randomizers) {
                    throw new Error("list of randomizers strings is empty ");
                }
                try {
                    anonKeys.keysInstance.free();
                }
                catch (error) {
                    throw new Error("could not get release the anonymous keys instance  \"" + error.message + "\" ");
                }
                return [2 /*return*/, { transactionBuilder: transactionBuilder, randomizers: randomizers }];
        }
    });
}); };
exports.barToAbar = barToAbar;
//# sourceMappingURL=tripleMasking.js.map