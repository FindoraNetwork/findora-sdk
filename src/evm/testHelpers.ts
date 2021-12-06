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

export const getRpcPayload = <T>(msgId: number, method: string, extraParams?: T) => {
  const payload = {
    id: msgId,
    method,
    params: extraParams,
  };

  return payload;
};

export const getPayloadWithGas = (from: string, givenChainId: number): SendOptions => ({
  gas: 1000000,
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
let logsCount = 0;
let testLogs: string[] = [];

export const msToTime = (s: number) => {
  let sTime = s;
  const ms = sTime % 1000;
  sTime = (sTime - ms) / 1000;

  const secs = sTime % 60;
  sTime = (sTime - secs) / 60;
  const mins = sTime % 60;
  const hrs = (sTime - mins) / 60;

  const formattedHours = hrs > 0 ? `${hrs}h ` : '';
  const formattedMinutes = mins > 0 ? `${mins}m ` : '';
  const formattedSeconds = secs > 0 ? `${secs}.${ms}s` : `${ms}ms`;

  const result = `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  return result;
};

export const timeLog = (label?: string, data?: SuperSimpleObject | string | number | boolean) => {
  const currentTime = Date.now();
  const extraData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data === false ? '' : data;

  const sinceStart = currentTime - start;
  const sinceLastOperation = currentTime - lastOperation;

  const formattedLabel = label ? `${label} ` : '';
  const lastLog = data === false ? '' : `took ${msToTime(sinceLastOperation)} `;
  const totalTime = `-> Total run time ${msToTime(sinceStart)}`;
  const formattedExtra = extraData ? `with data - ${extraData} ` : '';
  const formattedTestName = currentTestName ? `Test "${currentTestName}" -> ` : '';

  logsCount += 1;

  const messageToLog = `${logsCount}. ${formattedTestName}${formattedLabel}${formattedExtra}${lastLog}${totalTime}`;

  testLogs.push(messageToLog);

  lastOperation = currentTime;
};

export const timeStart = () => {
  const currentTime = Date.now();

  lastOperation = currentTime;
};

export const setCurrentTestName = (testName: string) => {
  currentTestName = testName;
};

export const afterEachLog = () => {
  const msg = `Test "${currentTestName}" is finished`;
  setCurrentTestName('');
  timeLog(msg, false);
};

export const afterAllLog = () => {
  setCurrentTestName('');
  timeLog('All tests are finished', false);
  console.log('testLogs', testLogs);
};
