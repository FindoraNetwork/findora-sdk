import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';
import {
  afterAllLog,
  afterEachLog,
  assertBasicResult,
  assertResultResponse,
  getRpcPayload,
  setCurrentTestName,
  timeLog,
  SuperSimpleObject,
  timeStart,
} from './testHelpers';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

const extendedExecutionTimeout = 600000;
const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;

afterAll(afterAllLog);
afterEach(afterEachLog);

const getTestResult = async <N extends SuperSimpleObject, T>(
  msgId: number,
  method: string,
  extraParams?: T,
) => {
  const payload = getRpcPayload<typeof extraParams>(msgId, method, extraParams);

  timeStart();
  const result = await Network.sendRpcCall<N>(rpcUrl, payload);
  timeLog(`Send an RPC call for "${method}"`);

  assertResultResponse(result);
  assertBasicResult<N>(result, msgId);

  return result;
};

describe(`Api Endpoint (rpc test no tx) for "${rpcUrl}"`, () => {
  describe('eth_getBlockByNumber', () => {
    it(
      'Returns information about a block by block number and verifies its parent block information',
      async () => {
        setCurrentTestName(
          'Returns information about a block by block number and verifies its parent block information',
        );

        const lastBlockResult = await getTestResult<NetworkTypes.EthBlockNumberRpcResult, void>(
          1,
          'eth_blockNumber',
        );

        const { response: lastBlockResponse } = lastBlockResult;

        if (!lastBlockResponse) {
          console.log('lastBlockResult', lastBlockResult);
          throw new Error('Could not fetch last block data');
        }

        const existingBlockNumberToCheck = parseInt(lastBlockResponse.result, 16);

        const extraParams = [existingBlockNumberToCheck, true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, typeof extraParams>(
          1312,
          'eth_getBlockByNumber',
          extraParams,
        );

        expect(result?.response?.result.number).toEqual(lastBlockResponse.result);
        expect(typeof result?.response?.result?.parentHash).toEqual('string');

        const parentBlockHash = result?.response?.result?.parentHash;

        const parentExtraParams = [parentBlockHash, true];

        const parentResult = await getTestResult<
          NetworkTypes.EthGetBlockByHashRpcResult,
          typeof parentExtraParams
        >(3, 'eth_getBlockByHash', parentExtraParams);

        expect(parentResult?.response?.id).toEqual(3);
        expect(parseInt(parentResult.response!.result.number, 16)).toEqual(existingBlockNumberToCheck - 1);
        expect(parentResult?.response?.result.hash).toEqual(parentBlockHash);
      },
      extendedExecutionTimeout,
    );
  });
});
