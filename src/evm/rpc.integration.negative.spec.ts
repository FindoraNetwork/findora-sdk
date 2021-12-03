import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';
import {
  afterAllLog,
  afterEachLog,
  assertResultResponse,
  getRpcPayload,
  setCurrentTestName,
  timeLog,
  timeStart,
} from './testHelpers';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;

const extendedExecutionTimeout = 600000;

//moonbeam (polkadot) compatible
const ERROR_INVALID_REQUEST = -32600;
const ERROR_METHOD_NOT_FOUND = -32601;
const ERROR_INVALID_PARAMS = -32602;

timeStart();
timeLog('Connecting to the server', rpcParams.rpcUrl);

afterAll(afterAllLog);
afterEach(afterEachLog);

const getTestResult = async <N, T>(msgId: number, method: string, extraParams?: T) => {
  const payload = getRpcPayload<typeof extraParams>(msgId, method, extraParams);

  timeStart();
  const result = await Network.sendRpcCall<N>(rpcUrl, payload);
  timeLog(`Send an RPC call for "${method}"`);

  assertResultResponse(result);

  return result;
};

describe(`Api Endpoint (rpc test negative) for "${rpcUrl}"`, () => {
  describe('notSupportedMethod', () => {
    it(
      'Returns a proper error code when requested method was not found',
      async () => {
        setCurrentTestName('Returns a proper error code when requested method was not found');

        const result = await getTestResult<NetworkTypes.EthProtocolRpcResult, void>(2, 'foobar');

        expect(result?.response?.error?.code).toEqual(ERROR_METHOD_NOT_FOUND);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBalance', () => {
    it(
      'Returns a proper error code when address in given payload is invalid',
      async () => {
        setCurrentTestName('Returns a proper error code when address in given payload is invalid');

        const extraParams = ['wrong_address', 'latest'];

        const result = await getTestResult<NetworkTypes.EthGetBalanceRpcResult, typeof extraParams>(
          2,
          'eth_getBalance',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code when params payload is missing',
      async () => {
        setCurrentTestName('Returns a proper error code when params payload is missing');

        const result = await getTestResult<NetworkTypes.EthGetBalanceRpcResult, void>(2, 'eth_getBalance');

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when params payload format is invalid',
      async () => {
        setCurrentTestName('Returns an error when params payload format is invalid');

        const extraParams = 'foo';

        const result = await getTestResult<NetworkTypes.EthGetBalanceRpcResult, typeof extraParams>(
          2,
          'eth_getBalance',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_call', () => {
    const extraParams = [
      {
        from: '0xabcd',
        to: '0xbcde',
        data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
      },
    ];

    it(
      'Returns a proper error code for missing required parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for missing required parameter');

        const result = await getTestResult<NetworkTypes.EthCallRpcResult, typeof extraParams>(
          2,
          'eth_call',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when required parameter is incorrect',
      async () => {
        setCurrentTestName('Returns an error when required parameter is incorrect');

        const extraExtraParams = [...extraParams, '0x0'];

        const result = await getTestResult<NetworkTypes.EthCallRpcResult, typeof extraExtraParams>(
          2,
          'eth_call',
          extraExtraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'foo';

        const result = await getTestResult<NetworkTypes.EthCallRpcResult, typeof extraParams>(
          2,
          'eth_call',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockByHash', () => {
    it(
      'Returns a proper error code for invalid parameters',
      async () => {
        setCurrentTestName('Returns a proper error code for invalid parameters');

        const extraParams = ['0x0', true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByHashRpcResult, typeof extraParams>(
          3,
          'eth_getBlockByHash',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for missing parameters',
      async () => {
        setCurrentTestName('Returns a proper error code for missing parameters');

        const extraParams = ['0x0', true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByHashRpcResult, typeof extraParams>(
          4,
          'eth_getBlockByHash',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for the missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for the missing payload');

        const result = await getTestResult<NetworkTypes.EthGetBlockByHashRpcResult, void>(
          1,
          'eth_getBlockByHash',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockByNumber', () => {
    it(
      'Returns a proper error code for the wrong parameter in the payload',
      async () => {
        setCurrentTestName('Returns a proper error code for the wrong parameter in the payload');

        const extraParams = ['aaa', true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, typeof extraParams>(
          1,
          'eth_getBlockByNumber',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error for the wrong format of the payload',
      async () => {
        setCurrentTestName('Returns an error for the wrong format of the payload');

        const extraParams = 'aaaa';

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, typeof extraParams>(
          2,
          'eth_getBlockByNumber',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for the missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for the missing payload');

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, void>(
          2,
          'eth_getBlockByNumber',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionCount', () => {
    it(
      'Returns a proper error code when a wrong address is given',
      async () => {
        setCurrentTestName('Returns a proper error code when a wrong address is given');

        const extraParams = ['0x0', 'latest'];

        const result = await getTestResult<NetworkTypes.EthGetTransactionCountRpcResult, typeof extraParams>(
          2,
          'eth_getTransactionCount',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code when no payload is given',
      async () => {
        setCurrentTestName('Returns a proper error code when no payload is given');

        const result = await getTestResult<NetworkTypes.EthGetTransactionCountRpcResult, void>(
          2,
          'eth_getTransactionCount',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<NetworkTypes.EthGetTransactionCountRpcResult, typeof extraParams>(
          2,
          'eth_getTransactionCount',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockTransactionCountByHash', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['0x0'];

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByHashRpcResult,
          typeof extraParams
        >(3, 'eth_getBlockTransactionCountByHash', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = 'aaaa';

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByHashRpcResult,
          typeof extraParams
        >(3, 'eth_getBlockTransactionCountByHash', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockTransactionCountByNumber', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByHashRpcResult,
          typeof extraParams
        >(1, 'eth_getBlockTransactionCountByNumber', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthGetBlockTransactionCountByHashRpcResult, void>(
          2,
          'eth_getBlockTransactionCountByHash',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByHashRpcResult,
          typeof extraParams
        >(1, 'eth_getBlockTransactionCountByNumber', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getCode', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<NetworkTypes.EthGetCodeRpcResult, typeof extraParams>(
          3,
          'eth_getCode',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthGetCodeRpcResult, void>(2, 'eth_getCode');

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<NetworkTypes.EthGetCodeRpcResult, typeof extraParams>(
          1,
          'eth_getCode',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_sendRawTransaction', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<NetworkTypes.EthSendRawTransactionRpcResult, typeof extraParams>(
          1,
          'eth_sendRawTransaction',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthSendRawTransactionRpcResult, void>(
          2,
          'eth_sendRawTransaction',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaaaa';
        const result = await getTestResult<NetworkTypes.EthSendRawTransactionRpcResult, typeof extraParams>(
          1,
          'eth_sendRawTransaction',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_estimateGas', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<NetworkTypes.EthEstimateGasRpcResult, typeof extraParams>(
          1,
          'eth_estimateGas',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthEstimateGasRpcResult, void>(1, 'eth_estimateGas');

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaaa';

        const result = await getTestResult<NetworkTypes.EthEstimateGasRpcResult, typeof extraParams>(
          1,
          'eth_estimateGas',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByHash', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<NetworkTypes.EthGetTransactionByHashRpcResult, typeof extraParams>(
          1,
          'eth_getTransactionByHash',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthGetTransactionByHashRpcResult, void>(
          4,
          'eth_getTransactionByHash',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaaa';

        const result = await getTestResult<NetworkTypes.EthGetTransactionByHashRpcResult, typeof extraParams>(
          2,
          'eth_getTransactionByHash',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByBlockHashAndIndex', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult,
          typeof extraParams
        >(1, 'eth_getTransactionByBlockHashAndIndex', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult, void>(
          3,
          'eth_getTransactionByBlockHashAndIndex',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult,
          typeof extraParams
        >(2, 'eth_getTransactionByBlockHashAndIndex', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByBlockNumberAndIndex', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult,
          typeof extraParams
        >(2, 'eth_getTransactionByBlockNumberAndIndex', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult,
          void
        >(3, 'eth_getTransactionByBlockNumberAndIndex');

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult,
          typeof extraParams
        >(1, 'eth_getTransactionByBlockNumberAndIndex', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionReceipt', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = ['aaa'];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionReceiptRpcResult,
          typeof extraParams
        >(3, 'eth_getTransactionReceipt', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        setCurrentTestName('Returns a proper error code for a missing payload');

        const result = await getTestResult<NetworkTypes.EthGetTransactionReceiptRpcResult, void>(
          3,
          'eth_getTransactionReceipt',
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionReceiptRpcResult,
          typeof extraParams
        >(3, 'eth_getTransactionReceipt', extraParams);

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getLogs', () => {
    it(
      'Returns a proper error code for a wrong payload format parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload format parameter');

        const extraParams = ['0x0x0'];

        const result = await getTestResult<NetworkTypes.EthGetLogsRpcResult, typeof extraParams>(
          1,
          'eth_getLogs',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        setCurrentTestName('Returns a proper error code for a wrong payload parameter');

        const extraParams = [
          {
            address: '0x0',
          },
        ];

        const result = await getTestResult<NetworkTypes.EthGetLogsRpcResult, typeof extraParams>(
          4,
          'eth_getLogs',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        setCurrentTestName('Returns an error when payload format is incorrect');

        const extraParams = 'aaa';

        const result = await getTestResult<NetworkTypes.EthGetLogsRpcResult, typeof extraParams>(
          3,
          'eth_getLogs',
          extraParams,
        );

        expect(result?.response?.error?.code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });
});
