"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var MyBigNumber = __importStar(require("./bigNumber"));
describe('bigNumber', function () {
    var num = 1;
    var bigNum = MyBigNumber.create(num);
    describe('toWei', function () {
        it('returns formatted value in wei', function () {
            var result = MyBigNumber.toWei(bigNum, 4);
            expect(result.toString()).toStrictEqual('10000');
        });
        it('returns formatted value in wei using default precission', function () {
            var result = MyBigNumber.toWei(bigNum);
            expect(result.toString()).toStrictEqual('1000000');
        });
    });
    describe('fromWei', function () {
        it('returns formatted value in wei', function () {
            var result = MyBigNumber.fromWei(bigNum, 4);
            expect(result.toString()).toStrictEqual('0.0001');
        });
        it('returns formatted value in wei using default precission', function () {
            var result = MyBigNumber.fromWei(bigNum);
            expect(result.toString()).toStrictEqual('0.000001');
        });
    });
    describe('calDecimalPrecision', function () {
        it('properly calculates the number using given precision for a floating number', function () {
            var num = '1.23456789';
            var bigNum = MyBigNumber.create(num);
            var result = MyBigNumber.calDecimalPrecision(bigNum, 3);
            expect(result.toString()).toStrictEqual('0.00123456789');
        });
        it('properly calculates the number using given precision for an integer number', function () {
            var num = '123456789';
            var bigNum = MyBigNumber.create(num);
            var result = MyBigNumber.calDecimalPrecision(bigNum, 5);
            expect(result.toString()).toStrictEqual('1,234.56789');
        });
    });
    describe('totalSum', function () {
        it('returns a summ of two big numbers', function () {
            var numOne = '1.13';
            var numTwo = '4.56';
            var bigNumOne = MyBigNumber.create(numOne);
            var bigNumTwo = MyBigNumber.create(numTwo);
            var result = MyBigNumber.totalSum([bigNumOne, bigNumTwo]);
            expect(result.toString()).toStrictEqual('5.69');
        });
        it('returns zero if array of big numbers is empty', function () {
            var result = MyBigNumber.totalSum([]);
            expect(result.toString()).toStrictEqual('0');
        });
        it('returns proper summ even if receives an array of numbers and not big numbers', function () {
            var numOne = '1.16';
            var numTwo = '4.61';
            var result = MyBigNumber.totalSum([numOne, numTwo]);
            expect(result.toString()).toStrictEqual('5.77');
        });
        it('returns NaN if receives an array of incorrect numbers', function () {
            var numOne = 'foo';
            var numTwo = 'bar';
            var numThree = 'null';
            var result = MyBigNumber.totalSum([numOne, numTwo, numThree]);
            expect(result.toString()).toStrictEqual('NaN');
        });
    });
    describe('plus', function () {
        it('adds given value to the given big number', function () {
            var numOne = '1.16';
            var numTwo = '4.61';
            var result = MyBigNumber.plus(numOne, numTwo);
            expect(result.toString()).toStrictEqual('5.77');
        });
        it('returns NaN if one of the arguments is not a number', function () {
            var numOne = '1.16';
            var numTwo = 'foo';
            var result = MyBigNumber.plus(numOne, numTwo);
            expect(result.toString()).toStrictEqual('NaN');
        });
    });
});
//# sourceMappingURL=bigNumber.spec.js.map