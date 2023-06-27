"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plus = exports.totalSum = exports.create = exports.calDecimalPrecision = exports.fromWei = exports.toWei = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const toWei = (value, precision = 6) => {
    return new bignumber_js_1.default(value).times(Math.pow(10, precision));
};
exports.toWei = toWei;
const fromWei = (value, precision = 6) => {
    return new bignumber_js_1.default(value).div(Math.pow(10, precision));
};
exports.fromWei = fromWei;
const calDecimalPrecision = (val, num) => {
    const x = new bignumber_js_1.default(val);
    const y = new bignumber_js_1.default(Math.pow(10, num));
    const newAmount = x.dividedBy(y).toFormat();
    return newAmount;
};
exports.calDecimalPrecision = calDecimalPrecision;
const create = (value) => new bignumber_js_1.default(value);
exports.create = create;
const totalSum = (amounts) => {
    let amount = new bignumber_js_1.default(0);
    amounts.forEach(currentAmount => {
        amount = new bignumber_js_1.default(currentAmount).plus(amount);
    });
    return amount;
};
exports.totalSum = totalSum;
const plus = (currentValue, valueToAdd) => new bignumber_js_1.default(currentValue).plus(valueToAdd);
exports.plus = plus;
//# sourceMappingURL=bigNumber.js.map