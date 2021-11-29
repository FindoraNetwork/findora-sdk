import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';

import { assertBasicResult, assertResultResponse, getRpcPayload } from './testHelpers';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

const extendedExecutionTimeout = 180000;

const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);

const existingBlockNumberToCheck = 4;

const getTestResult = async <N, T>(msgId: number, method: string, extraParams?: T) => {
  const payload = getRpcPayload<typeof extraParams>(msgId, method, extraParams);

  const result = await Network.sendRpcCall<N>(rpcUrl, payload);

  assertResultResponse(result);
  assertBasicResult<N>(result, msgId);

  return result;
};

describe(`Api Endpoint (rpc test) for "${rpcUrl}"`, () => {
  describe('eth_getBlockByNumber', () => {
    it(
      'Returns information about a block by block number and verifies its parent block information',
      async () => {
        const extraParams = [existingBlockNumberToCheck, true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, typeof extraParams>(
          2,
          'eth_getBlockByNumber',
          extraParams,
        );

        expect(result?.response?.result.number).toEqual('0x4');
        expect(typeof result?.response?.result?.parentHash).toEqual('string');

        const parentBlockHash = result?.response?.result?.parentHash;

        const parentExtraParams = [parentBlockHash, true];

        const parentResult = await getTestResult<
          NetworkTypes.EthGetBlockByHashRpcResult,
          typeof parentExtraParams
        >(3, 'eth_getBlockByHash', parentExtraParams);

        expect(parentResult?.response?.id).toEqual(3);
        expect(parentResult?.response?.result.number).toEqual('0x3');
        expect(parentResult?.response?.result.hash).toEqual(parentBlockHash);
      },
      extendedExecutionTimeout,
    );
  });
});
