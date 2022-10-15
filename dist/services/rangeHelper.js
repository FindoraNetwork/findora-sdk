"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRange = exports.itHasGaps = exports.getRangeWithGaps = exports.getRangeWithoutGaps = exports.getFirstNonConsecutive = void 0;
// it should come from a constant file. move it there later
var MAX_SUPPORTED_CHUNK_SIZE = 100;
// by default we process data all the way back till a very first atxo=1
// but later we can configure that to have a different value (in case of a specific block height is needed)
// Initial Atxo Sid should be read from the const for time being but later it would be a part of Sdk Init process
var IAS = 0;
var getFirstNonConsecutive = function (dataList) {
    for (var i = 0; i < dataList.length - 1; i++) {
        if (dataList[i] - dataList[i + 1] !== 1) {
            return [dataList[i], i];
        }
    }
    return [-1, -1];
};
exports.getFirstNonConsecutive = getFirstNonConsecutive;
var getRangeWithoutData = function (mas) {
    var start = -1;
    // case 1.A
    var end = mas;
    start = end - MAX_SUPPORTED_CHUNK_SIZE;
    // case 1.B
    if (start < IAS) {
        start = IAS;
    }
    return [start, end];
};
var getRangeWithoutGaps = function (mas, first, last) {
    var _a;
    var start = -1;
    var end = -1;
    if (last === IAS) {
        var r = getRangeWithoutData(mas);
        var start_1 = r[0], end_1 = r[1];
        // case 2.A
        if (start_1 > first) {
            return [start_1, end_1];
        }
        // case 2.Aa and 2.C
        var realFirst = first >= end_1 ? end_1 : first + 1;
        // case 2.B
        return [realFirst, end_1];
    }
    // case 3.A and 3.B
    _a = getRangeWithoutData(last - 1), start = _a[0], end = _a[1];
    return [start, end];
};
exports.getRangeWithoutGaps = getRangeWithoutGaps;
var getRangeWithGaps = function (processedList) {
    var _a = (0, exports.getFirstNonConsecutive)(processedList), firstNonConsecutive = _a[0], firstIndex = _a[1];
    var gapStart = firstNonConsecutive - 1;
    var remainedList = processedList.slice(firstIndex + 1);
    var gapEnd = remainedList[0]; // case 4.A
    var gapLength = gapStart - gapEnd;
    var calculatedGapEnd = gapLength > MAX_SUPPORTED_CHUNK_SIZE ? gapStart - MAX_SUPPORTED_CHUNK_SIZE : gapEnd + 1; // case 4.B
    return [calculatedGapEnd, gapStart];
};
exports.getRangeWithGaps = getRangeWithGaps;
var itHasGaps = function (processedList) {
    var dataLength = (processedList === null || processedList === void 0 ? void 0 : processedList.length) || 0;
    if (!dataLength) {
        return false;
    }
    var first = processedList[0];
    console.log('🚀 ~ file: rangeHelper.ts ~ line 83 ~ itHasGaps ~ processedList', processedList);
    var last = processedList[dataLength - 1];
    var itHasNoGaps = first - dataLength === last - 1;
    return !itHasNoGaps;
};
exports.itHasGaps = itHasGaps;
var getRange = function (mas, processedList) {
    var _a;
    var start = -1;
    var end = -1;
    var dataLength = (processedList === null || processedList === void 0 ? void 0 : processedList.length) || 0;
    var itHasData = !!(processedList === null || processedList === void 0 ? void 0 : processedList.length);
    if (!itHasData) {
        return getRangeWithoutData(mas);
    }
    var first = processedList[0];
    var last = processedList[dataLength - 1];
    // const itHasNoGaps = first - dataLength === last - 1;
    var itHasNoGaps = !(0, exports.itHasGaps)(processedList);
    if (itHasNoGaps) {
        return (0, exports.getRangeWithoutGaps)(mas, first, last);
    }
    _a = (0, exports.getRangeWithGaps)(processedList), start = _a[0], end = _a[1];
    return [start, end];
};
exports.getRange = getRange;
//# sourceMappingURL=rangeHelper.js.map