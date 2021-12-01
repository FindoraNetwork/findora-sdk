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

let currentTestName = '';

const start = Date.now();

let lastOperation = Date.now();

export const msToTime = (s: number) => {
  let sTime = s;
  const ms = sTime % 1000;
  sTime = (sTime - ms) / 1000;

  const secs = sTime % 60;
  sTime = (sTime - secs) / 60;
  const mins = sTime % 60;
  const hrs = (sTime - mins) / 60;

  const formattedHours = hrs > 0 ? `${hrs}:` : '';
  const formattedMinutes = mins > 0 ? `${mins}:` : '';
  const formattedSeconds = secs > 0 ? `${secs}.${ms}s` : `${ms}ms`;

  const result = `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  return result;
};

const testLogs: string[] = [];

export const timeLog = (label?: string, data?: SuperSimpleObject | string | number | boolean) => {
  const currentTime = Date.now();
  const extraData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

  const sinceStart = currentTime - start;
  const sinceLastOperation = currentTime - lastOperation;

  const messageToLog = `${testLogs.length + 1}. ${
    currentTestName ? `"${currentTestName}"` : ''
  } Last log ${msToTime(sinceLastOperation)} ago. Total is ${msToTime(sinceStart)}${
    label ? ` - "${label}" ` : ''
  }${extraData ? `- ${extraData}` : ''}`;

  testLogs.push(messageToLog);

  lastOperation = currentTime;
};

export const setCurrentTestName = (testName: string) => {
  currentTestName = testName;
};

export const afterEachLog = () => {
  timeLog(`After one test case`);
};

export const afterAllLog = () => {
  setCurrentTestName('after all hook');
  timeLog('After all tests');
  console.log('testLogs', testLogs);
};
