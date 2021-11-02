import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

const extendedExecutionTimeout = 20000;

const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;

//moonbeam (polkadot) compatible
const ERROR_INVALID_REQUEST = -32600;
const ERROR_METHOD_NOT_FOUND = -32601;
const ERROR_INVALID_PARAMS = -32602;

const assertResultResponse = (result: NetworkTypes.NetworkAxiosDataResult) => {
  expect(result).toHaveProperty('response');
  expect(result).not.toHaveProperty('error');
};

describe(`Api Endpoint (rpc test negative) for "${rpcUrl}"`, () => {
  const msgId = 2;

  const payload = {
    id: msgId,
    method: '',
  };

  describe('notSupportedMethod', () => {
    it(
      'Returns a proper error code when requested method was not found',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthProtocolRpcResult>(rpcUrl, {
          ...payload,
          method: 'foobar',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_METHOD_NOT_FOUND);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBalance', () => {
    it(
      'Returns a proper error code when address in given payload is invalid',
      async () => {
        const extraParams = ['wrong_address', 'latest'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBalanceRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBalance',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code when params payload is missing',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBalanceRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBalance',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when params payload format is invalid',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBalanceRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBalance',
          params: 'foo',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
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
        const result = await Network.sendRpcCall<NetworkTypes.EthCallRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_call',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when required parameter is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthCallRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_call',
          params: [...extraParams, '0x0'],
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const extraParams = 'foo';

        const result = await Network.sendRpcCall<NetworkTypes.EthCallRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_call',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockByHash', () => {
    it(
      'Returns a proper error code for invalid parameters',
      async () => {
        const extraParams = ['0x0', true];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByHash',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for missing parameters',
      async () => {
        const extraParams = ['0x0', true];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByHash',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for the missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByHash',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockByNumber', () => {
    it(
      'Returns a proper error code for the wrong parameter in the payload',
      async () => {
        const extraParams = ['aaa', true];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByNumberRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByNumber',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error for the wrong format of the payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByNumberRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByNumber',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for the missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByNumberRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getBlockByNumber',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionCount', () => {
    it(
      'Returns a proper error code when a wrong address is given',
      async () => {
        const extraParams = ['0x0', 'latest'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionCount',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code when no payload is given',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionCount',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionCount',
          params: 'aaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockTransactionCountByHash', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['0x0'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByHashRpcResult>(
          rpcUrl,
          { ...payload, method: 'eth_getBlockTransactionCountByHash', params: extraParams },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByHashRpcResult>(
          rpcUrl,
          { ...payload, method: 'eth_getBlockTransactionCountByHash', params: 'aaa' },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getBlockTransactionCountByNumber', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getBlockTransactionCountByNumber',
            params: extraParams,
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getBlockTransactionCountByNumber',
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getBlockTransactionCountByNumber',
            params: 'aaaa',
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getCode', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetCodeRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getCode',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetCodeRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getCode',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetCodeRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getCode',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_sendRawTransaction', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_sendRawTransaction',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_sendRawTransaction',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_sendRawTransaction',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_estimateGas', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthEstimateGasRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_estimateGas',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthEstimateGasRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_estimateGas',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthEstimateGasRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_estimateGas',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByHash', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionByHash',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionByHash',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByHashRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionByHash',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByBlockHashAndIndex', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getTransactionByBlockHashAndIndex',
            params: extraParams,
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getTransactionByBlockHashAndIndex',
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult>(
          rpcUrl,
          {
            ...payload,
            method: 'eth_getTransactionByBlockHashAndIndex',
            params: 'aaaa',
          },
        );

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionByBlockNumberAndIndex', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result =
          await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(rpcUrl, {
            ...payload,
            method: 'eth_getTransactionByBlockNumberAndIndex',
            params: extraParams,
          });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result =
          await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(rpcUrl, {
            ...payload,
            method: 'eth_getTransactionByBlockNumberAndIndex',
          });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result =
          await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(rpcUrl, {
            ...payload,
            method: 'eth_getTransactionByBlockNumberAndIndex',
            params: 'aaaa',
          });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getTransactionReceipt', () => {
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = ['aaa'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionReceiptRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionReceipt',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a missing payload',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionReceiptRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionReceipt',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionReceiptRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getTransactionReceipt',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });

  describe('eth_getLogs', () => {
    it(
      'Returns a proper error code for a wrong payload format parameter',
      async () => {
        const extraParams = ['0x0x0'];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetLogsRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getLogs',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns a proper error code for a wrong payload parameter',
      async () => {
        const extraParams = [
          {
            address: '0x0',
          },
        ];

        const result = await Network.sendRpcCall<NetworkTypes.EthGetLogsRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getLogs',
          params: extraParams,
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_PARAMS);
      },
      extendedExecutionTimeout,
    );
    it(
      'Returns an error when payload format is incorrect',
      async () => {
        const result = await Network.sendRpcCall<NetworkTypes.EthGetLogsRpcResult>(rpcUrl, {
          ...payload,
          method: 'eth_getLogs',
          params: 'aaaa',
        });

        assertResultResponse(result);

        const code = result?.response?.error?.code;

        expect(code).toEqual(ERROR_INVALID_REQUEST);
      },
      extendedExecutionTimeout,
    );
  });
});
