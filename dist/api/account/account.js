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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.getAssetBalance = void 0;
var bigNumber_1 = require("../../services/bigNumber");
var utxoHelper_1 = require("../../services/utxoHelper");
var Network = __importStar(require("../network"));
var sdkAsset_1 = require("../sdkAsset");
var getAssetBalance = function (walletKeypair, assetCode, sids) { return __awaiter(void 0, void 0, void 0, function () {
    var utxoDataList, error_1, filteredUtxoList, currentBalance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, utxoHelper_1.addUtxo(walletKeypair, sids)];
            case 1:
                utxoDataList = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                throw new Error("Could not get list of addUtxo, Details: \"" + error_1.message + "\"");
            case 3:
                if (!utxoDataList.length) {
                    return [2 /*return*/, bigNumber_1.create(0)];
                }
                filteredUtxoList = utxoDataList.filter(function (row) { var _a; return ((_a = row === null || row === void 0 ? void 0 : row.body) === null || _a === void 0 ? void 0 : _a.asset_type) === assetCode; });
                if (!filteredUtxoList.length) {
                    return [2 /*return*/, bigNumber_1.create(0)];
                }
                currentBalance = filteredUtxoList.reduce(function (acc, currentUtxoItem) {
                    var _a;
                    return acc + Number(((_a = currentUtxoItem.body) === null || _a === void 0 ? void 0 : _a.amount) || 0);
                }, 0);
                return [2 /*return*/, bigNumber_1.create(currentBalance)];
        }
    });
}); };
exports.getAssetBalance = getAssetBalance;
var getBalance = function (walletKeypair, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var sidsResult, sids, fraAssetCode, assetCodeToUse, balanceInWei, balance, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getOwnedSids(walletKeypair.publickey)];
            case 1:
                sidsResult = _a.sent();
                sids = sidsResult.response;
                if (!sids) {
                    throw new Error('No sids were fetched!');
                }
                return [4 /*yield*/, sdkAsset_1.getFraAssetCode()];
            case 2:
                fraAssetCode = _a.sent();
                assetCodeToUse = assetCode || fraAssetCode;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, exports.getAssetBalance(walletKeypair, assetCodeToUse, sids)];
            case 4:
                balanceInWei = _a.sent();
                balance = bigNumber_1.fromWei(balanceInWei, 6).toFormat(6);
                return [2 /*return*/, balance];
            case 5:
                err_1 = _a.sent();
                throw new Error("Could not fetch balance for \"" + assetCodeToUse + "\". Error - " + err_1.message);
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getBalance = getBalance;
//# sourceMappingURL=account.js.map