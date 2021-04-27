"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.calDecimalPrecision = exports.fromWei = exports.toWei = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var toWei = function (value, precision) {
    if (precision === void 0) { precision = 6; }
    return new bignumber_js_1.default(value).times(Math.pow(10, precision));
};
exports.toWei = toWei;
var fromWei = function (value, precision) {
    if (precision === void 0) { precision = 6; }
    return new bignumber_js_1.default(value).div(Math.pow(10, precision));
};
exports.fromWei = fromWei;
var calDecimalPrecision = function (val, num) {
    var x = new bignumber_js_1.default(val);
    var y = new bignumber_js_1.default(Math.pow(10, num));
    var newAmount = x.dividedBy(y).toFormat();
    return newAmount;
};
exports.calDecimalPrecision = calDecimalPrecision;
var create = function (value) { return new bignumber_js_1.default(value); };
exports.create = create;
//# sourceMappingURL=bigNumber.js.map