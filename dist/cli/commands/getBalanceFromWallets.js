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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGetBalanceFromWallets = void 0;
var utils_1 = require("../../services/utils");
var api_1 = require("../../api");
var password = '1232320';
var processRecord = function (index, privateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var walletInfo, balance, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(privateKey.trim(), password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Account.getBalance(walletInfo)];
            case 2:
                balance = _a.sent();
                result = "".concat(index, ". Balance for \"").concat(walletInfo.address, "\" is ").concat(balance);
                return [2 /*return*/, result];
        }
    });
}); };
var runGetBalanceFromWallets = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_1, walletsList, resultList, _i, walletsList_1, currentWallet, _a, privateKey, address, index, balanceResult, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, utils_1.readFile)(filePath)];
            case 1:
                data = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                throw Error("Could not read file \"".concat(filePath, "\" "));
            case 3:
                walletsList = [];
                try {
                    walletsList = JSON.parse(data);
                }
                catch (err) {
                    (0, utils_1.log)("can not parse wallets data from the ".concat(filePath));
                    console.log('err', err);
                }
                resultList = [];
                _i = 0, walletsList_1 = walletsList;
                _b.label = 4;
            case 4:
                if (!(_i < walletsList_1.length)) return [3 /*break*/, 9];
                currentWallet = walletsList_1[_i];
                _a = currentWallet.privateKey, privateKey = _a === void 0 ? '' : _a, address = currentWallet.address, index = currentWallet.index;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, processRecord(index, privateKey)];
            case 6:
                balanceResult = _b.sent();
                resultList.push(balanceResult);
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                resultList.push("".concat(index, ". Error - could not process record for row ").concat(index, " address \"").concat(address, "\""));
                return [3 /*break*/, 8];
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9:
                (0, utils_1.log)(JSON.stringify(resultList, null, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.runGetBalanceFromWallets = runGetBalanceFromWallets;
//# sourceMappingURL=getBalanceFromWallets.js.map