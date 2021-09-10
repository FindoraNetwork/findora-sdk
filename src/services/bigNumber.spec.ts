import '@testing-library/jest-dom/extend-expect';

import * as MyBigNumber from './bigNumber';

describe('bigNumber (unit test)', () => {
  const num = 1;
  const bigNum = MyBigNumber.create(num);
  describe('toWei', () => {
    it('returns formatted value in wei', () => {
      const result = MyBigNumber.toWei(bigNum, 4);

      expect(result.toString()).toStrictEqual('10000');
    });
    it('returns formatted value in wei using default precission', () => {
      const result = MyBigNumber.toWei(bigNum);

      expect(result.toString()).toStrictEqual('1000000');
    });
  });
  describe('fromWei', () => {
    it('returns formatted value in wei', () => {
      const result = MyBigNumber.fromWei(bigNum, 4);

      expect(result.toString()).toStrictEqual('0.0001');
    });
    it('returns formatted value in wei using default precission', () => {
      const result = MyBigNumber.fromWei(bigNum);

      expect(result.toString()).toStrictEqual('0.000001');
    });
  });
  describe('calDecimalPrecision', () => {
    it('properly calculates the number using given precision for a floating number', () => {
      const num = '1.23456789';
      const bigNum = MyBigNumber.create(num);

      const result = MyBigNumber.calDecimalPrecision(bigNum, 3);
      expect(result.toString()).toStrictEqual('0.00123456789');
    });
    it('properly calculates the number using given precision for an integer number', () => {
      const num = '123456789';
      const bigNum = MyBigNumber.create(num);

      const result = MyBigNumber.calDecimalPrecision(bigNum, 5);
      expect(result.toString()).toStrictEqual('1,234.56789');
    });
  });
  describe('totalSum', () => {
    it('returns a summ of two big numbers', () => {
      const numOne = '1.13';
      const numTwo = '4.56';
      const bigNumOne = MyBigNumber.create(numOne);
      const bigNumTwo = MyBigNumber.create(numTwo);

      const result = MyBigNumber.totalSum([bigNumOne, bigNumTwo]);

      expect(result.toString()).toStrictEqual('5.69');
    });
    it('returns zero if array of big numbers is empty', () => {
      const result = MyBigNumber.totalSum([]);

      expect(result.toString()).toStrictEqual('0');
    });
    it('returns proper summ even if receives an array of numbers and not big numbers', () => {
      const numOne = '1.16';
      const numTwo = '4.61';

      const result = MyBigNumber.totalSum([numOne, numTwo]);

      expect(result.toString()).toStrictEqual('5.77');
    });
    it('returns NaN if receives an array of incorrect numbers', () => {
      const numOne = 'foo';
      const numTwo = 'bar';
      const numThree = 'null';

      const result = MyBigNumber.totalSum([numOne, numTwo, numThree]);

      expect(result.toString()).toStrictEqual('NaN');
    });
  });
  describe('plus', () => {
    it('adds given value to the given big number', () => {
      const numOne = '1.16';
      const numTwo = '4.61';

      const result = MyBigNumber.plus(numOne, numTwo);

      expect(result.toString()).toStrictEqual('5.77');
    });
    it('returns NaN if one of the arguments is not a number', () => {
      const numOne = '1.16';
      const numTwo = 'foo';

      const result = MyBigNumber.plus(numOne, numTwo);

      expect(result.toString()).toStrictEqual('NaN');
    });
  });
});
