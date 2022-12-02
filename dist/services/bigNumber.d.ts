import BigNumber from 'bignumber.js';
export type BigNumberValue = BigNumber.Value;
export declare const toWei: (value: BigNumberValue, precision?: number) => BigNumber;
export declare const fromWei: (value: BigNumberValue, precision?: number) => BigNumber;
export declare const calDecimalPrecision: (val: BigNumberValue, num: number) => string;
export declare const create: (value: BigNumberValue) => BigNumber;
export declare const totalSum: (amounts: BigNumberValue[]) => BigNumber;
export declare const plus: (currentValue: BigNumberValue, valueToAdd: BigNumberValue) => BigNumberValue;
