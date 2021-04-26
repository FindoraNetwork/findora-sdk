import BigNumber from 'bignumber.js';
export declare type BigNumberValue = BigNumber.Value;
export declare const toWei: (value: BigNumberValue, precision?: number) => BigNumber;
export declare const fromWei: (value: BigNumberValue, precision?: number) => BigNumber;
export declare const calDecimalPrecision: (val: BigNumberValue, num: number) => string;
export declare const create: (value: BigNumberValue) => BigNumber;
