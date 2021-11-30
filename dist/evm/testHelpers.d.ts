export interface SuperSimpleObject {
    [key: string]: any;
}
export interface SimpleObject<T> {
    [key: string]: T;
}
export declare const getRpcPayload: <T>(msgId: number, method: string, extraParams?: T | undefined) => {
    id: number;
    method: string;
    params: T | undefined;
};
export declare const getPayloadWithGas: (from: string, givenChainId: number) => {
    gas: string;
    gasPrice: string;
    from: string;
    chainId: number;
};
export declare const assertResultResponse: <T>(result: T) => void;
export declare const assertBasicResult: <T extends SuperSimpleObject>(result: T, msgId: number) => void;
export declare const assertResultType: <T extends SuperSimpleObject>(result: T, resultType: string) => void;
