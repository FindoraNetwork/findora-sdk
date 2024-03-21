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
exports.runBatchBuyTicket = void 0;
var neat_csv_1 = __importDefault(require("neat-csv"));
var sleep_promise_1 = __importDefault(require("sleep-promise"));
var Sdk_1 = __importDefault(require("../../Sdk"));
var api_1 = require("../../api");
var utils_1 = require("../../services/utils");
var brc20_1 = require("../../services/brc20");
var resultFileLogName = "batchBuyTicketLog";
var isCsvValid = function (listOfRecords) {
    for (var i = 0; i < listOfRecords.length; i += 1) {
        var currentRecord = listOfRecords[i];
        var isPkPresented = Object.keys(currentRecord).includes('pKey');
        var isTickPresented = Object.keys(currentRecord).includes('tick');
        var isPricePresented = Object.keys(currentRecord).includes('totalFraToSpend');
        var isAmountPresented = Object.keys(currentRecord).includes('maxAmtToBuy');
        var isMinPresented = Object.keys(currentRecord).includes('rndSecMin');
        var isMaxPresented = Object.keys(currentRecord).includes('rndSecMax');
        if (!isPkPresented ||
            !isTickPresented ||
            !isAmountPresented ||
            !isPricePresented ||
            !isMinPresented ||
            !isMaxPresented) {
            throw Error("ERROR - The data row must have \"pKey\", \"tick\", \"maxAmtToBuy\", \"totalFraToSpend\", \"rndSecMin\" and \"rndSecMax\" fields ".concat(JSON.stringify(currentRecord), " "));
        }
    }
    return true;
};
var getRecordsList = function (parsedListOfRecords) {
    var recordsList = parsedListOfRecords.map(function (currentRecord) {
        var pKey = currentRecord.pKey, tick = currentRecord.tick, totalFraToSpend = currentRecord.totalFraToSpend, maxAmtToBuy = currentRecord.maxAmtToBuy, rndSecMin = currentRecord.rndSecMin, rndSecMax = currentRecord.rndSecMax;
        return {
            pKey: pKey.trim(),
            tick: tick.trim().toLowerCase(),
            totalFraToSpend: +totalFraToSpend.trim().replace(/,/g, ''),
            maxAmtToBuy: +maxAmtToBuy.trim().replace(/,/g, ''),
            rndSecMin: +rndSecMin.trim().replace(/,/g, ''),
            rndSecMax: +rndSecMax.trim().replace(/,/g, ''),
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
var runBatchBuyTicket = function (filePath, repeatTimes, waitBetweenRepeatMinutes) { return __awaiter(void 0, void 0, void 0, function () {
    var data, parsedListOfRecords, err_1, error_2, hostUrl, processedInfo, errorsInfo, recordsList, password, totalRepetitions, i, _loop_1, _i, recordsList_1, currentRecord;
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
                throw Error("Could not read file \"".concat(filePath, "\" "));
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, neat_csv_1.default)(data)];
            case 4:
                parsedListOfRecords = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                throw Error("Could not parse file \"".concat(filePath, "\" "));
            case 6:
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
                totalRepetitions = 1;
                _a.label = 7;
            case 7:
                (0, utils_1.log)("Begin: Set \"".concat(totalRepetitions, "\" out of \"").concat(repeatTimes, "\""));
                i = 1;
                _loop_1 = function (currentRecord) {
                    var fromPk, tick, totalFraToSpend_1, maxAmtToBuy_1, rndSecMin, rndSecMax, walletFrom, waitTimeInMSec, rowData, postedListings, data_1, total, errorMessage, sortedList, errorMessage, selectedOrderIdx, selectedOrder, listId, amt, fraPrice, _b, txHash, buyResult, rowData_1, errorMessage, rowData_2, errorMessage, error_3, rowData, errorMessage;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 5, , 6]);
                                (0, utils_1.log)("".concat(i, ": Processing data row # ").concat(i));
                                fromPk = currentRecord.pKey, tick = currentRecord.tick, totalFraToSpend_1 = currentRecord.totalFraToSpend, maxAmtToBuy_1 = currentRecord.maxAmtToBuy, rndSecMin = currentRecord.rndSecMin, rndSecMax = currentRecord.rndSecMax;
                                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(fromPk, password)];
                            case 1:
                                walletFrom = _c.sent();
                                waitTimeInMSec = (0, utils_1.getRandomNumber)(rndSecMin * 1000, rndSecMax * 1000);
                                rowData = JSON.stringify(currentRecord);
                                return [4 /*yield*/, (0, brc20_1.getTradingListingList)(1, 100, tick, hostUrl, walletFrom, 0, true)];
                            case 2:
                                postedListings = _c.sent();
                                data_1 = postedListings.data, total = postedListings.total;
                                if (!total || data_1.length === 0) {
                                    errorMessage = "".concat(i, ": !! ERROR!! - was a handled error while fetching listOfRecords, or there is no listings for ticker \"").concat(tick, "\" to buy  - row data - \"").concat(rowData, "\".");
                                    errorsInfo.push(errorMessage);
                                    (0, utils_1.log)(errorMessage);
                                }
                                sortedList = data_1
                                    // we filtering out records from the list which match the specified in the csv file
                                    // max amount of units to buy and max fra to spend per row
                                    .filter(function (el) { return +el.fraPrice <= totalFraToSpend_1 && +el.amount <= maxAmtToBuy_1; })
                                    // we sort filtered list buy most expensive price per unit
                                    .sort(function (a, b) { return +b.unitsAmount - +a.unitsAmount; });
                                if (!sortedList.length) {
                                    errorMessage = "".concat(i, ": !! ERROR!! - there is no listing for ticker \"").concat(tick, "\" which matches given max units amout to buy and max fra to spend - row data - \"").concat(rowData, "\".");
                                    errorsInfo.push(errorMessage);
                                    (0, utils_1.log)(errorMessage);
                                    i += 1;
                                    return [2 /*return*/, "continue"];
                                }
                                selectedOrderIdx = (0, utils_1.getRandomNumber)(1, sortedList.length);
                                selectedOrder = sortedList[selectedOrderIdx - 1];
                                console.log('selectedOrder', selectedOrder);
                                listId = selectedOrder.id, amt = selectedOrder.amount, fraPrice = selectedOrder.fraPrice;
                                return [4 /*yield*/, (0, brc20_1.buy)(listId, fraPrice, hostUrl, walletFrom)];
                            case 3:
                                _b = _c.sent(), txHash = _b.txHash, buyResult = _b.buyResult;
                                (0, utils_1.log)("".concat(i, ": Tx hash is \"").concat(txHash, "\""));
                                if (!buyResult) {
                                    rowData_1 = JSON.stringify(currentRecord);
                                    errorMessage = "".concat(i, ": !! ERROR!! - potential error while processing data \"").concat(rowData_1, "\". Error: - buyResult is false.");
                                    errorsInfo.push(errorMessage);
                                    (0, utils_1.log)(errorMessage);
                                }
                                if (!txHash) {
                                    rowData_2 = JSON.stringify(currentRecord);
                                    errorMessage = "".concat(i, ": !! ERROR!! - potential error while processing data \"").concat(rowData_2, "\". Error: - txHash is empty.");
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
                            case 4:
                                _c.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                error_3 = _c.sent();
                                rowData = JSON.stringify(currentRecord);
                                errorMessage = "".concat(i, ": !! ERROR!! - could not process data from this row \"").concat(rowData, "\". Error: - ").concat(error_3.message);
                                errorsInfo.push(errorMessage);
                                (0, utils_1.log)(errorMessage);
                                return [3 /*break*/, 6];
                            case 6:
                                i += 1;
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, recordsList_1 = recordsList;
                _a.label = 8;
            case 8:
                if (!(_i < recordsList_1.length)) return [3 /*break*/, 11];
                currentRecord = recordsList_1[_i];
                return [5 /*yield**/, _loop_1(currentRecord)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                (0, utils_1.log)("End: Set \"".concat(totalRepetitions, "\" out of \"").concat(repeatTimes, "\""));
                (0, utils_1.log)("Waiting for \"".concat(waitBetweenRepeatMinutes, "\" minutes before the next set"));
                return [4 /*yield*/, (0, sleep_promise_1.default)(waitBetweenRepeatMinutes * 60 * 1000)];
            case 12:
                _a.sent();
                totalRepetitions += 1;
                _a.label = 13;
            case 13:
                if (totalRepetitions <= repeatTimes) return [3 /*break*/, 7];
                _a.label = 14;
            case 14: return [4 /*yield*/, writeDistributionLog(processedInfo, errorsInfo)];
            case 15:
                _a.sent();
                (0, utils_1.log)("Command Log ", JSON.stringify(processedInfo, null, 2));
                (0, utils_1.log)("Command Errors Log ", JSON.stringify(errorsInfo, null, 2));
                return [2 /*return*/];
        }
    });
}); };
exports.runBatchBuyTicket = runBatchBuyTicket;
//# sourceMappingURL=batchBuyTicket.js.map