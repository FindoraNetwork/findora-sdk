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
exports.runBatchSendERC20 = void 0;
var neat_csv_1 = __importDefault(require("neat-csv"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var web3_1 = __importDefault(require("web3"));
var testHelpers_1 = require("../../evm/testHelpers");
var utils_1 = require("../../services/utils");
var envConfigFile = "../../../.env_erc_distribution";
var envConfig = require("".concat(envConfigFile, ".json"));
var rpcParams = envConfig.rpc;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a, mnemonic = rpcParams.mnemonic;
var networkId;
var accounts;
var isCsvValid = function (parsedListOfRecievers) {
    for (var i = 0; i < parsedListOfRecievers.length; i += 1) {
        var currentReciever = parsedListOfRecievers[i];
        var isAddressPresented = Object.keys(currentReciever).includes('tokenReceiveAddress');
        var isAmountPresented = Object.keys(currentReciever).includes('tokenAllocated');
        if (!isAddressPresented || !isAmountPresented) {
            throw Error("ERROR - The data row must have both \"tokenReceiveAddress\" and \"tokenAllocated\" fields ".concat(JSON.stringify(currentReciever), " "));
        }
    }
    return true;
};
var getRecieversList = function (parsedListOfRecievers) {
    var receiversList = parsedListOfRecievers.map(function (currentReciever) {
        var tokenAllocated = currentReciever.tokenAllocated, tokenReceiveAddress = currentReciever.tokenReceiveAddress;
        return {
            address: tokenReceiveAddress,
            numbers: parseFloat(tokenAllocated.replace(',', '')),
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
                resultFilePath = "batchSendLog_".concat(dateStamp, ".txt");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, utils_1.writeFile)(resultFilePath, JSON.stringify({
                        date: dateStamp,
                        distributionType: 'ERC20',
                        sendInfo: sendInfo,
                        errorsInfo: errorsInfo,
                    }, null, 2))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                throw new Error("can not write result log for \"".concat(resultFilePath, "\", \"").concat(error_1.message, "\""));
            case 4: return [2 /*return*/];
        }
    });
}); };
var sendTxToAccount = function (senderAccount, receiverAccount, amountToSend, web3) { return __awaiter(void 0, void 0, void 0, function () {
    var value, transactionObject, txReceipt, txHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                value = web3.utils.toWei(amountToSend, 'ether');
                transactionObject = __assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(senderAccount, networkId)), { to: receiverAccount, value: value });
                txReceipt = {};
                txHash = '';
                return [4 /*yield*/, web3.eth
                        .sendTransaction(transactionObject)
                        .on('error', function (_error) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, testHelpers_1.timeLog)('Once error', _error);
                            return [2 /*return*/];
                        });
                    }); })
                        .on('transactionHash', function (_hash) {
                        txHash = _hash;
                    })
                        .on('receipt', function (_receipt) {
                        txReceipt = _receipt;
                    })
                        .then(function (_receipt) {
                        (0, testHelpers_1.timeLog)('Once the receipt is mined');
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { txHash: txHash, txReceipt: txReceipt }];
        }
    });
}); };
var runBatchSendERC20 = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var data, parsedListOfRecievers, err_1, error_2, provider, web3, sendInfo, errorsInfo, senderAccount, receiversList, i, recieverInfo, _a, txHash, txReceipt, error_3, errorMessage;
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
                throw Error('Could not read file "file.csv" ');
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, neat_csv_1.default)(data)];
            case 4:
                parsedListOfRecievers = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                throw Error('Could not parse file "file.csv" ');
            case 6:
                (0, utils_1.log)('parsedListOfRecievers', parsedListOfRecievers);
                provider = new truffle_hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
                web3 = new web3_1.default(provider);
                return [4 /*yield*/, web3.eth.getAccounts()];
            case 7:
                accounts = _b.sent();
                return [4 /*yield*/, web3.eth.net.getId()];
            case 8:
                networkId = _b.sent();
                sendInfo = [];
                errorsInfo = [];
                senderAccount = accounts[0];
                try {
                    isCsvValid(parsedListOfRecievers);
                }
                catch (err) {
                    throw new Error("ERROR: CSV is not valid. Details: ".concat(err.message));
                }
                receiversList = getRecieversList(parsedListOfRecievers);
                i = 0;
                _b.label = 9;
            case 9:
                if (!(i < receiversList.length)) return [3 /*break*/, 14];
                recieverInfo = receiversList[i];
                _b.label = 10;
            case 10:
                _b.trys.push([10, 12, , 13]);
                return [4 /*yield*/, sendTxToAccount(senderAccount, recieverInfo.address, "".concat(recieverInfo.numbers), web3)];
            case 11:
                _a = _b.sent(), txHash = _a.txHash, txReceipt = _a.txReceipt;
                sendInfo.push({
                    txHash: txHash,
                    recieverInfo: __assign({}, recieverInfo),
                    txReceipt: txReceipt,
                });
                (0, utils_1.log)("".concat(i + 1, ": Tx hash is \"").concat(txHash, "\""));
                return [3 /*break*/, 13];
            case 12:
                error_3 = _b.sent();
                errorMessage = "".concat(i + 1, ": !! ERROR!! - could not send a transaction to ").concat(recieverInfo.address, ". Error: - ").concat(error_3.message, ". Skipping....");
                errorsInfo.push(errorMessage);
                (0, utils_1.log)(errorMessage);
                return [3 /*break*/, 13];
            case 13:
                i += 1;
                return [3 /*break*/, 9];
            case 14: return [4 /*yield*/, writeDistributionLog(sendInfo, errorsInfo)];
            case 15:
                _b.sent();
                (0, utils_1.log)("Batch Send Log ", JSON.stringify(sendInfo, null, 2));
                (0, utils_1.log)("Batch Send Errors Log ", JSON.stringify(errorsInfo, null, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.runBatchSendERC20 = runBatchSendERC20;
//# sourceMappingURL=batchSendErc20.js.map