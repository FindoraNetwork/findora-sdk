export interface SuperSimpleObject {
  [key: string]: any;
}

export interface SimpleObject<T> {
  [key: string]: T;
}

export const getRpcPayload = <T>(msgId: number, method: string, extraParams?: T) => {
  const payload = {
    id: msgId,
    method,
    params: extraParams,
  };

  return payload;
};

export const getPayloadWithGas = (from: string, givenChainId: number) => ({
  gas: '1000000',
  gasPrice: '10000000001',
  from,
  chainId: givenChainId,
});

export const assertResultResponse = <T>(result: T) => {
  expect(result).toHaveProperty('response');
  expect(result).not.toHaveProperty('error');
};

export const assertBasicResult = <T extends SuperSimpleObject>(result: T, msgId: number) => {
  expect(typeof result?.response?.jsonrpc).toEqual('string');
  expect(typeof result?.response?.id).toEqual('number');
  expect(result?.response?.id).toEqual(msgId);
};

export const assertResultType = <T extends SuperSimpleObject>(result: T, resultType: string) => {
  expect(typeof result?.response?.result).toEqual(resultType);
};
