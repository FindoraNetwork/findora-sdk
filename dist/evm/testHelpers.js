"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afterAllLog = exports.afterEachLog = exports.setCurrentTestName = exports.timeLog = exports.msToTime = exports.assertResultType = exports.assertBasicResult = exports.assertResultResponse = exports.getPayloadWithGas = exports.getRpcPayload = void 0;
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
    gas: '1000000',
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
var msToTime = function (s) {
    var sTime = s;
    var ms = sTime % 1000;
    sTime = (sTime - ms) / 1000;
    var secs = sTime % 60;
    sTime = (sTime - secs) / 60;
    var mins = sTime % 60;
    var hrs = (sTime - mins) / 60;
    var formattedHours = hrs > 0 ? hrs + ":" : '';
    var formattedMinutes = mins > 0 ? mins + ":" : '';
    var formattedSeconds = secs > 0 ? secs + "." + ms + "s" : ms + "ms";
    var result = "" + formattedHours + formattedMinutes + formattedSeconds;
    return result;
};
exports.msToTime = msToTime;
var testLogs = [];
var timeLog = function (label, data) {
    var currentTime = Date.now();
    var extraData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    var sinceStart = currentTime - start;
    var sinceLastOperation = currentTime - lastOperation;
    var messageToLog = testLogs.length + 1 + ". " + (currentTestName ? "\"" + currentTestName + "\"" : '') + " Last log " + (0, exports.msToTime)(sinceLastOperation) + " ago. Total is " + (0, exports.msToTime)(sinceStart) + (label ? " - \"" + label + "\" " : '') + (extraData ? "- " + extraData : '');
    testLogs.push(messageToLog);
    lastOperation = currentTime;
};
exports.timeLog = timeLog;
var setCurrentTestName = function (testName) {
    currentTestName = testName;
};
exports.setCurrentTestName = setCurrentTestName;
var afterEachLog = function () {
    (0, exports.timeLog)("After one test case");
};
exports.afterEachLog = afterEachLog;
var afterAllLog = function () {
    (0, exports.setCurrentTestName)('after all hook');
    (0, exports.timeLog)('After all tests');
    console.log('testLogs', testLogs);
};
exports.afterAllLog = afterAllLog;
//# sourceMappingURL=testHelpers.js.map