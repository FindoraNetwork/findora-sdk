import * as bigNumber from '../services/bigNumber';
export interface SuperSimpleObject {
    [key: string]: any;
}
export interface SimpleObject<T> {
    [key: string]: T;
}
export interface SendOptions {
    from: string;
    gasPrice?: string;
    gas?: number;
    value?: number | string;
    nonce?: number;
    chainId?: number;
}
export declare const getRpcPayload: <T>(msgId: number, method: string, extraParams?: T | undefined) => {
    id: number;
    method: string;
    params: T | undefined;
};
export declare const getPayloadWithGas: (from: string, givenChainId: number) => SendOptions;
export declare const assertResultResponse: <T>(result: T) => void;
export declare const assertBasicResult: <T extends SuperSimpleObject>(result: T, msgId: number) => void;
export declare const assertResultType: <T extends SuperSimpleObject>(result: T, resultType: string) => void;
export declare const msToTime: (s: number) => string;
export declare const timeLog: (label?: string, data?: SuperSimpleObject | string | number | boolean) => void;
export declare const timeStart: () => void;
export declare const setCurrentTestName: (testName: string) => void;
export declare const afterEachLog: () => void;
export declare const afterAllLog: () => void;
export declare const isNumberChangedBy: (numberBefore: bigNumber.BigNumberValue, numberAfter: bigNumber.BigNumberValue, expectedDifference: string, decimals?: 6) => boolean;
export declare const formatFromWei: (numberToFormat: bigNumber.BigNumberValue) => string;
export declare const waitForBlockChange: (numberOfBlocksToWait?: number) => Promise<void>;
