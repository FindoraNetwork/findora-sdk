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
exports.runBatchSendFra = void 0;
var neat_csv_1 = __importDefault(require("neat-csv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var api_1 = require("../../api");
var utils_1 = require("../../services/utils");
var waitingTimeBeforeCheckTxStatus = 18000;
var chunk = function (arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, function (_v, i) { return arr.slice(i * size, i * size + size); });
};
var isCsvValid = function (parsedListOfRecievers) {
    for (var i = 0; i < parsedListOfRecievers.length; i += 1) {
        var currentReciever = parsedListOfRecievers[i];
        var isAddressPresented = Object.keys(currentReciever).includes('tokenReceiveAddress');
        var isAmountPresented = Object.keys(currentReciever).includes('tokenAllocated');
        if (!isAddressPresented || !isAmountPresented) {
            throw Error("ERROR - The data row must have both \"tokenReceiveAddress\" and \"tokenAllocated\" fields " + JSON.stringify(currentReciever) + " ");
        }
    }
    return true;
};
var getRecieversList = function (parsedListOfRecievers) {
    var receiversList = parsedListOfRecievers.map(function (currentReciever) {
        var tokenAllocated = currentReciever.tokenAllocated, tokenReceiveAddress = currentReciever.tokenReceiveAddress;
        return {
            address: tokenReceiveAddress,
            numbers: tokenAllocated.replace(',', ''),
        };
    });
    return receiversList;
};
var writeDistributionLog = function (sendInfo, errorsInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var dateStamp, resultFilePath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dateStamp = (0, utils_1.now)();
                resultFilePath = "batchFraSendLog_" + dateStamp + ".txt";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, utils_1.writeFile)(resultFilePath, JSON.stringify({
                        date: dateStamp,
                        distributionType: 'FRA',
                        sendInfo: sendInfo,
                        errorsInfo: errorsInfo,
                    }, null, 2))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                throw new Error("can not write result log for \"" + resultFilePath + "\", \"" + error_1.message + "\"");
            case 4: return [2 /*return*/];
        }
    });
}); };
var processTransferRecieverItem = function (tokenReceiver) { return __awaiter(void 0, void 0, void 0, function () {
    var reciverWalletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Keypair.getAddressPublicAndKey(tokenReceiver.address)];
            case 1:
                reciverWalletInfo = _a.sent();
                return [2 /*return*/, { reciverWalletInfo: reciverWalletInfo, amount: tokenReceiver.numbers }];
        }
    });
}); };
var processTransferRecievers = function (tokenReceiversChunk) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(tokenReceiversChunk.map(function (tokenReceiver) { return processTransferRecieverItem(tokenReceiver); }))];
    });
}); };
var sendTxToAccounts = function (senderWallet, recieversInfo, assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var assetBlindRules, transactionBuilder, txHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, api_1.Transaction.sendToMany(senderWallet, recieversInfo, assetCode, assetBlindRules)];
            case 1:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 2:
                txHash = _a.sent();
                console.log('🚀 ~ file: batchSendFra.ts ~ line 132 ~ txHash', txHash);
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus)];
            case 3:
                _a.sent();
                return [2 /*return*/, { txHash: txHash }];
        }
    });
}); };
var runBatchSendFra = function (filePath, fromPk, numberOfOutputs) { return __awaiter(void 0, void 0, void 0, function () {
    var data, parsedListOfRecievers, err_1, error_2, password, walletFrom, sendInfo, errorsInfo, receiversList, receiversChunks, fraCode, i, _i, receiversChunks_1, currentChunk, recieversInfo, txHash, error_3, addresses, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, utils_1.readFile)(filePath)];
            case 1:
                data = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                throw Error('Could not read file "fileFra.csv" ');
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, neat_csv_1.default)(data)];
            case 4:
                parsedListOfRecievers = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                throw Error('Could not parse file "fileFra.csv" ');
            case 6:
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(fromPk, password)];
            case 7:
                walletFrom = _a.sent();
                sendInfo = [];
                errorsInfo = [];
                try {
                    isCsvValid(parsedListOfRecievers);
                }
                catch (err) {
                    throw new Error("ERROR: CSV is not valid. Details: " + err.message);
                }
                receiversList = getRecieversList(parsedListOfRecievers);
                receiversChunks = chunk(receiversList, numberOfOutputs);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 8:
                fraCode = _a.sent();
                i = 0;
                _i = 0, receiversChunks_1 = receiversChunks;
                _a.label = 9;
            case 9:
                if (!(_i < receiversChunks_1.length)) return [3 /*break*/, 16];
                currentChunk = receiversChunks_1[_i];
                _a.label = 10;
            case 10:
                _a.trys.push([10, 13, , 14]);
                return [4 /*yield*/, processTransferRecievers(currentChunk)];
            case 11:
                recieversInfo = _a.sent();
                return [4 /*yield*/, sendTxToAccounts(walletFrom, recieversInfo, fraCode)];
            case 12:
                txHash = (_a.sent()).txHash;
                sendInfo.push({
                    txHash: txHash,
                    tokenReceivers: __assign({}, currentChunk),
                });
                (0, utils_1.log)(i + 1 + ": Tx hash is \"" + txHash + "\"");
                return [3 /*break*/, 14];
            case 13:
                error_3 = _a.sent();
                addresses = currentChunk.map(function (item) { return item.address; }).join(',');
                errorMessage = i + 1 + ": !! ERROR!! - could not send a transaction to one of those addresses \"" + addresses + "\". Error: - " + error_3.message + ". Skipping....";
                errorsInfo.push(errorMessage);
                (0, utils_1.log)(errorMessage);
                return [3 /*break*/, 14];
            case 14:
                i += 1;
                _a.label = 15;
            case 15:
                _i++;
                return [3 /*break*/, 9];
            case 16: return [4 /*yield*/, writeDistributionLog(sendInfo, errorsInfo)];
            case 17:
                _a.sent();
                (0, utils_1.log)("Batch Send Log ", JSON.stringify(sendInfo, null, 2));
                (0, utils_1.log)("Batch Send Errors Log ", JSON.stringify(errorsInfo, null, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.runBatchSendFra = runBatchSendFra;
//# sourceMappingURL=batchSendFra.js.map