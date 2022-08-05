"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.waitForBlockChange = exports.formatFromWei = exports.isNumberChangedBy = exports.afterAllLog = exports.afterEachLog = exports.setCurrentTestName = exports.timeStart = exports.timeLog = exports.msToTime = exports.assertResultType = exports.assertBasicResult = exports.assertResultResponse = exports.getPayloadWithGas = exports.getRpcPayload = void 0;
var Network = __importStar(require("../api/network"));
var bigNumber = __importStar(require("../services/bigNumber"));
var utils_1 = require("../services/utils");
var getRpcPayload = function (msgId, method, extraParams) {
    var payload = {
        id: msgId,
        method: method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
var getPayloadWithGas = function (from, givenChainId) { return ({
    gas: 1000000,
    gasPrice: '10000000001',
    from: from,
    chainId: givenChainId,
}); };
exports.getPayloadWithGas = getPayloadWithGas;
var assertResultResponse = function (result) {
    expect(result).toHaveProperty('response');
    expect(result).not.toHaveProperty('error');
};
exports.assertResultResponse = assertResultResponse;
var assertBasicResult = function (result, msgId) {
    var _a, _b, _c;
    expect(typeof ((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.jsonrpc)).toEqual('string');
    expect(typeof ((_b = result === null || result === void 0 ? void 0 : result.response) === null || _b === void 0 ? void 0 : _b.id)).toEqual('number');
    expect((_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.id).toEqual(msgId);
};
exports.assertBasicResult = assertBasicResult;
var assertResultType = function (result, resultType) {
    var _a;
    expect(typeof ((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(resultType);
};
exports.assertResultType = assertResultType;
var currentTestName = '';
var start = Date.now();
var lastOperation = Date.now();
var logsCount = 0;
var testLogs = [];
var msToTime = function (s) {
    var sTime = s;
    var ms = sTime % 1000;
    sTime = (sTime - ms) / 1000;
    var secs = sTime % 60;
    sTime = (sTime - secs) / 60;
    var mins = sTime % 60;
    var hrs = (sTime - mins) / 60;
    var formattedHours = hrs > 0 ? "".concat(hrs, "h ") : '';
    var formattedMinutes = mins > 0 ? "".concat(mins, "m ") : '';
    var formattedSeconds = secs > 0 ? "".concat(secs, ".").concat(ms, "s") : "".concat(ms, "ms");
    var result = "".concat(formattedHours).concat(formattedMinutes).concat(formattedSeconds);
    return result;
};
exports.msToTime = msToTime;
var timeLog = function (label, data) {
    var currentTime = Date.now();
    var extraData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data === false ? '' : data;
    var sinceStart = currentTime - start;
    var sinceLastOperation = currentTime - lastOperation;
    var formattedLabel = label ? "".concat(label, " ") : '';
    var lastLog = data === false ? '' : "took ".concat((0, exports.msToTime)(sinceLastOperation), " ");
    var totalTime = "-> Total run time ".concat((0, exports.msToTime)(sinceStart));
    var formattedExtra = extraData ? "with data - ".concat(extraData, " ") : '';
    var formattedTestName = currentTestName ? "Test \"".concat(currentTestName, "\" -> ") : '';
    logsCount += 1;
    var messageToLog = "".concat(logsCount, ". ").concat(formattedTestName).concat(formattedLabel).concat(formattedExtra).concat(lastLog).concat(totalTime);
    testLogs.push(messageToLog);
    lastOperation = currentTime;
};
exports.timeLog = timeLog;
var timeStart = function () {
    var currentTime = Date.now();
    lastOperation = currentTime;
};
exports.timeStart = timeStart;
var setCurrentTestName = function (testName) {
    currentTestName = testName;
};
exports.setCurrentTestName = setCurrentTestName;
var afterEachLog = function () {
    var msg = "Test \"".concat(currentTestName, "\" is finished");
    (0, exports.setCurrentTestName)('');
    (0, exports.timeLog)(msg, false);
};
exports.afterEachLog = afterEachLog;
var afterAllLog = function () {
    (0, exports.setCurrentTestName)('');
    (0, exports.timeLog)('All tests are finished', false);
    console.log('testLogs', testLogs);
};
exports.afterAllLog = afterAllLog;
var isNumberChangedBy = function (numberBefore, numberAfter, expectedDifference, decimals) {
    var differenceInWei = bigNumber.toWei(expectedDifference, decimals).toString();
    var numberBeforeBN = bigNumber.create(numberBefore);
    var numberAfterBN = bigNumber.create(numberAfter);
    var expectedAfterChangeBN = bigNumber.plus(numberBeforeBN, differenceInWei);
    var isChangedSuccessfully = numberAfterBN.eq(expectedAfterChangeBN);
    return isChangedSuccessfully;
};
exports.isNumberChangedBy = isNumberChangedBy;
var formatFromWei = function (numberToFormat) {
    return bigNumber.fromWei(numberToFormat, 6).toFormat(6).toString();
};
exports.formatFromWei = formatFromWei;
var waitForBlockChange = function (numberOfBlocksToWait) {
    if (numberOfBlocksToWait === void 0) { numberOfBlocksToWait = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var initialBlockData, initialBlock, initialBlockNumber, updatedBlockNumber;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Network.getLatestBlock()];
                case 1:
                    initialBlockData = _b.sent();
                    initialBlock = ((_a = initialBlockData.response) === null || _a === void 0 ? void 0 : _a.result) || '';
                    initialBlockNumber = parseInt(initialBlock, 16);
                    (0, utils_1.log)("waiting for ".concat(numberOfBlocksToWait, " blocks"));
                    updatedBlockNumber = initialBlockNumber;
                    return [4 /*yield*/, (0, utils_1.wait)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var currentBlockData, currentBlock, currentBlockNumber, blockDifference, _isBlockChanged;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Network.getLatestBlock()];
                                    case 1:
                                        currentBlockData = _b.sent();
                                        currentBlock = ((_a = currentBlockData.response) === null || _a === void 0 ? void 0 : _a.result) || '';
                                        currentBlockNumber = parseInt(currentBlock, 16);
                                        updatedBlockNumber = currentBlockNumber;
                                        blockDifference = currentBlockNumber - initialBlockNumber;
                                        _isBlockChanged = blockDifference >= numberOfBlocksToWait;
                                        return [2 /*return*/, _isBlockChanged];
                                }
                            });
                        }); }, 1000)];
                case 2:
                    _b.sent();
                    (0, utils_1.log)("waited from block ".concat(initialBlockNumber, " until block ").concat(updatedBlockNumber));
                    return [2 /*return*/];
            }
        });
    });
};
exports.waitForBlockChange = waitForBlockChange;
//# sourceMappingURL=testHelpers.js.map