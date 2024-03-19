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
exports.runBatchTransferTicket = void 0;
var neat_csv_1 = __importDefault(require("neat-csv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var Sdk_1 = __importDefault(require("../../Sdk"));
var api_1 = require("../../api");
var utils_1 = require("../../services/utils");
var brc20_1 = require("../../services/brc20");
var resultFileLogName = "batchTransferTicketLog";
var isCsvValid = function (listOfRecords) {
    for (var i = 0; i < listOfRecords.length; i += 1) {
        var currentRecord = listOfRecords[i];
        var isPkPresented = Object.keys(currentRecord).includes('pKey');
        var isTickPresented = Object.keys(currentRecord).includes('tick');
        var isAmtPresented = Object.keys(currentRecord).includes('amt');
        var isToPresented = Object.keys(currentRecord).includes('tickReceiveAddress');
        var isMinPresented = Object.keys(currentRecord).includes('rndSecMin');
        var isMaxPresented = Object.keys(currentRecord).includes('rndSecMax');
        if (!isPkPresented ||
            !isTickPresented ||
            !isAmtPresented ||
            !isToPresented ||
            !isMinPresented ||
            !isMaxPresented) {
            throw Error("ERROR - The data row must have \"pKey\", \"tick\", \"amt\", \"tickReceiveAddress\", \"rndSecMin\" and \"rndSecMax\" fields ".concat(JSON.stringify(currentRecord), " "));
        }
    }
    return true;
};
var getRecordsList = function (parsedListOfRecords) {
    var recordsList = parsedListOfRecords.map(function (currentRecord) {
        var pKey = currentRecord.pKey, tick = currentRecord.tick, amt = currentRecord.amt, tickReceiveAddress = currentRecord.tickReceiveAddress, rndSecMin = currentRecord.rndSecMin, rndSecMax = currentRecord.rndSecMax;
        return {
            pKey: pKey.trim(),
            tick: tick.trim().toLowerCase(),
            amt: +amt.trim().replace(',', ''),
            tickReceiveAddress: tickReceiveAddress.trim().toLowerCase(),
            rndSecMin: +rndSecMin.trim().replace(',', ''),
            rndSecMax: +rndSecMax.trim().replace(',', ''),
        };
    });
    return recordsList;
};
var writeDistributionLog = function (sendInfo, errorsInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var dateStamp, resultFilePath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dateStamp = (0, utils_1.now)();
                resultFilePath = "".concat(resultFileLogName, "_").concat(dateStamp, ".txt");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, utils_1.writeFile)(resultFilePath, JSON.stringify({
                        date: dateStamp,
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
var runBatchTransferTicket = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var data, parsedListOfRecords, err_1, error_2, hostUrl, processedInfo, errorsInfo, recordsList, password, i, _i, recordsList_1, currentRecord, fromPk, tick, amt, tickReceiveAddress, rndSecMin, rndSecMax, walletFrom, waitTimeInMSec, result, response, txHash, rowData, errorMessage, rowData, errorMessage, error_3, rowData, errorMessage;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('filePath', filePath);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, utils_1.readFile)(filePath)];
            case 2:
                data = _c.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _c.sent();
                throw Error("Could not read file \"".concat(filePath, "\" "));
            case 4:
                _c.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, neat_csv_1.default)(data)];
            case 5:
                parsedListOfRecords = _c.sent();
                return [3 /*break*/, 7];
            case 6:
                error_2 = _c.sent();
                throw Error("Could not parse file \"".concat(filePath, "\" "));
            case 7:
                hostUrl = Sdk_1.default.environment.brc20url;
                if (!hostUrl) {
                    throw Error("brc20url must be set for Sdk initialization");
                }
                processedInfo = [];
                errorsInfo = [];
                try {
                    isCsvValid(parsedListOfRecords);
                }
                catch (err) {
                    throw new Error("ERROR: CSV is not valid. Details: ".concat(err.message));
                }
                recordsList = getRecordsList(parsedListOfRecords);
                password = '123';
                i = 1;
                _i = 0, recordsList_1 = recordsList;
                _c.label = 8;
            case 8:
                if (!(_i < recordsList_1.length)) return [3 /*break*/, 16];
                currentRecord = recordsList_1[_i];
                _c.label = 9;
            case 9:
                _c.trys.push([9, 13, , 14]);
                (0, utils_1.log)("".concat(i, ": Processing data row # ").concat(i));
                fromPk = currentRecord.pKey, tick = currentRecord.tick, amt = currentRecord.amt, tickReceiveAddress = currentRecord.tickReceiveAddress, rndSecMin = currentRecord.rndSecMin, rndSecMax = currentRecord.rndSecMax;
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(fromPk, password)];
            case 10:
                walletFrom = _c.sent();
                waitTimeInMSec = (0, utils_1.getRandomNumber)(rndSecMin * 1000, rndSecMax * 1000);
                return [4 /*yield*/, (0, brc20_1.sendBRC20TransferTx)(tick, amt, tickReceiveAddress, walletFrom)];
            case 11:
                result = _c.sent();
                response = result.response;
                txHash = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hash) !== null && _b !== void 0 ? _b : '';
                (0, utils_1.log)("".concat(i, ": Tx hash is \"").concat(txHash, "\""));
                if (!(response === null || response === void 0 ? void 0 : response.result)) {
                    rowData = JSON.stringify(currentRecord);
                    errorMessage = "".concat(i, ": !! ERROR!! - potential error while processing data \"").concat(rowData, "\". Error: - transfer result is empty.");
                    errorsInfo.push(errorMessage);
                    (0, utils_1.log)(errorMessage);
                }
                if (!txHash) {
                    rowData = JSON.stringify(currentRecord);
                    errorMessage = "".concat(i, ": !! ERROR!! - potential error while processing data \"").concat(rowData, "\". Error: - txHash is empty.");
                    errorsInfo.push(errorMessage);
                    (0, utils_1.log)(errorMessage);
                }
                processedInfo.push({
                    txHash: txHash,
                    dataItem: __assign({}, currentRecord),
                    chosenRandomWaitingTimeSec: "".concat((waitTimeInMSec / 1000).toFixed(1)),
                });
                (0, utils_1.log)("".concat(i, ": Waiting for randomly chosen ").concat(waitTimeInMSec / 1000, "s (given range is ").concat(rndSecMin, " - ").concat(rndSecMax, ") before processing next record"));
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitTimeInMSec)];
            case 12:
                _c.sent();
                return [3 /*break*/, 14];
            case 13:
                error_3 = _c.sent();
                rowData = JSON.stringify(currentRecord);
                errorMessage = "".concat(i, ": !! ERROR!! - could not process data from this row \"").concat(rowData, "\". Error: - ").concat(error_3.message);
                errorsInfo.push(errorMessage);
                (0, utils_1.log)(errorMessage);
                return [3 /*break*/, 14];
            case 14:
                i += 1;
                _c.label = 15;
            case 15:
                _i++;
                return [3 /*break*/, 8];
            case 16: return [4 /*yield*/, writeDistributionLog(processedInfo, errorsInfo)];
            case 17:
                _c.sent();
                (0, utils_1.log)("Command Log ", JSON.stringify(processedInfo, null, 2));
                (0, utils_1.log)("Command Errors Log ", JSON.stringify(errorsInfo, null, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.runBatchTransferTicket = runBatchTransferTicket;
//# sourceMappingURL=batchTransferTicket.js.map