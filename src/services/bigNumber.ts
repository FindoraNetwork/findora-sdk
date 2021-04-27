import BigNumber from 'bignumber.js';

export type BigNumberValue = BigNumber.Value;

export const toWei = (value: BigNumberValue, precision = 6): BigNumber => {
  return new BigNumber(value).times(10 ** precision);
};

export const fromWei = (value: BigNumberValue, precision = 6): BigNumber => {
  return new BigNumber(value).div(10 ** precision);
};

export const calDecimalPrecision = (val: BigNumberValue, num: number): string => {
  const x = new BigNumber(val);
  const y = new BigNumber(10 ** num);
  const newAmount = x.dividedBy(y).toFormat();
  return newAmount;
};

export const create = (value: BigNumberValue): BigNumber => new BigNumber(value);
