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
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForBlockChange = exports.formatFromWei = exports.isNumberChangedBy = exports.afterAllLog = exports.afterEachLog = exports.setCurrentTestName = exports.timeStart = exports.timeLog = exports.msToTime = exports.assertResultType = exports.assertBasicResult = exports.assertResultResponse = exports.getPayloadWithGas = exports.getRpcPayload = void 0;
const Network = __importStar(require("../api/network"));
const bigNumber = __importStar(require("../services/bigNumber"));
const utils_1 = require("../services/utils");
const getRpcPayload = (msgId, method, extraParams) => {
    const payload = {
        id: msgId,
        method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
const getPayloadWithGas = (from, givenChainId) => ({
    gas: 1000000,
    gasPrice: '10000000001',
    from,
    chainId: givenChainId,
});
exports.getPayloadWithGas = getPayloadWithGas;
const assertResultResponse = (result) => {
    expect(result).toHaveProperty('response');
    expect(result).not.toHaveProperty('error');
};
exports.assertResultResponse = assertResultResponse;
const assertBasicResult = (result, msgId) => {
    var _a, _b, _c;
    expect(typeof ((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.jsonrpc)).toEqual('string');
    expect(typeof ((_b = result === null || result === void 0 ? void 0 : result.response) === null || _b === void 0 ? void 0 : _b.id)).toEqual('number');
    expect((_c = result === null || result === void 0 ? void 0 : result.response) === null || _c === void 0 ? void 0 : _c.id).toEqual(msgId);
};
exports.assertBasicResult = assertBasicResult;
const assertResultType = (result, resultType) => {
    var _a;
    expect(typeof ((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.result)).toEqual(resultType);
};
exports.assertResultType = assertResultType;
let currentTestName = '';
const start = Date.now();
let lastOperation = Date.now();
let logsCount = 0;
let testLogs = [];
const msToTime = (s) => {
    let sTime = s;
    const ms = sTime % 1000;
    sTime = (sTime - ms) / 1000;
    const secs = sTime % 60;
    sTime = (sTime - secs) / 60;
    const mins = sTime % 60;
    const hrs = (sTime - mins) / 60;
    const formattedHours = hrs > 0 ? `${hrs}h ` : '';
    const formattedMinutes = mins > 0 ? `${mins}m ` : '';
    const formattedSeconds = secs > 0 ? `${secs}.${ms}s` : `${ms}ms`;
    const result = `${formattedHours}${formattedMinutes}${formattedSeconds}`;
    return result;
};
exports.msToTime = msToTime;
const timeLog = (label, data) => {
    const currentTime = Date.now();
    const extraData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data === false ? '' : data;
    const sinceStart = currentTime - start;
    const sinceLastOperation = currentTime - lastOperation;
    const formattedLabel = label ? `${label} ` : '';
    const lastLog = data === false ? '' : `took ${(0, exports.msToTime)(sinceLastOperation)} `;
    const totalTime = `-> Total run time ${(0, exports.msToTime)(sinceStart)}`;
    const formattedExtra = extraData ? `with data - ${extraData} ` : '';
    const formattedTestName = currentTestName ? `Test "${currentTestName}" -> ` : '';
    logsCount += 1;
    const messageToLog = `${logsCount}. ${formattedTestName}${formattedLabel}${formattedExtra}${lastLog}${totalTime}`;
    testLogs.push(messageToLog);
    lastOperation = currentTime;
};
exports.timeLog = timeLog;
const timeStart = () => {
    const currentTime = Date.now();
    lastOperation = currentTime;
};
exports.timeStart = timeStart;
const setCurrentTestName = (testName) => {
    currentTestName = testName;
};
exports.setCurrentTestName = setCurrentTestName;
const afterEachLog = () => {
    const msg = `Test "${currentTestName}" is finished`;
    (0, exports.setCurrentTestName)('');
    (0, exports.timeLog)(msg, false);
};
exports.afterEachLog = afterEachLog;
const afterAllLog = () => {
    (0, exports.setCurrentTestName)('');
    (0, exports.timeLog)('All tests are finished', false);
    console.log('testLogs', testLogs);
};
exports.afterAllLog = afterAllLog;
const isNumberChangedBy = (numberBefore, numberAfter, expectedDifference, decimals) => {
    const differenceInWei = bigNumber.toWei(expectedDifference, decimals).toString();
    const numberBeforeBN = bigNumber.create(numberBefore);
    const numberAfterBN = bigNumber.create(numberAfter);
    const expectedAfterChangeBN = bigNumber.plus(numberBeforeBN, differenceInWei);
    const isChangedSuccessfully = numberAfterBN.eq(expectedAfterChangeBN);
    return isChangedSuccessfully;
};
exports.isNumberChangedBy = isNumberChangedBy;
const formatFromWei = (numberToFormat) => bigNumber.fromWei(numberToFormat, 6).toFormat(6).toString();
exports.formatFromWei = formatFromWei;
const waitForBlockChange = (numberOfBlocksToWait = 1) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const initialBlockData = yield Network.getLatestBlock();
    const initialBlock = ((_a = initialBlockData.response) === null || _a === void 0 ? void 0 : _a.result) || '';
    const initialBlockNumber = parseInt(initialBlock, 16);
    (0, utils_1.log)(`waiting for ${numberOfBlocksToWait} blocks`);
    let updatedBlockNumber = initialBlockNumber;
    yield (0, utils_1.wait)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const currentBlockData = yield Network.getLatestBlock();
        const currentBlock = ((_b = currentBlockData.response) === null || _b === void 0 ? void 0 : _b.result) || '';
        const currentBlockNumber = parseInt(currentBlock, 16);
        updatedBlockNumber = currentBlockNumber;
        const blockDifference = currentBlockNumber - initialBlockNumber;
        const _isBlockChanged = blockDifference >= numberOfBlocksToWait;
        return _isBlockChanged;
    }), 1000);
    (0, utils_1.log)(`waited from block ${initialBlockNumber} until block ${updatedBlockNumber}`);
});
exports.waitForBlockChange = waitForBlockChange;
//# sourceMappingURL=testHelpers.js.map