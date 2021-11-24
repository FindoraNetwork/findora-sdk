import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

const extendedExecutionTimeout = 180000;

const { rpcUrl = 'http://127.0.0.1:8545' } = rpcParams;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);

const existingBlockNumberToCheck = 4;

describe(`Api Endpoint (rpc test) for "${rpcUrl}"`, () => {
  describe('eth_getBlockByNumber', () => {
    it(
      'Returns information about a block by block number and verifies its parent block information',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockNumberToCheck, true];
        const payload = {
          id: msgId,
          method: 'eth_getBlockByNumber',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByNumberRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(response?.result.number).toEqual('0x4');
        expect(typeof response?.result?.parentHash).toEqual('string');

        const parentBlockHash = response?.result?.parentHash;

        const payloadForParentBlock = {
          id: 2,
          method: 'eth_getBlockByHash',
          params: [parentBlockHash, true],
        };

        const parentResult = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(
          rpcUrl,
          payloadForParentBlock,
        );

        expect(parentResult).toHaveProperty('response');
        expect(parentResult).not.toHaveProperty('error');

        const { response: parentResponse } = parentResult;

        expect(parentResponse?.id).toEqual(2);
        expect(parentResponse?.result.number).toEqual('0x3');
        expect(parentResponse?.result.hash).toEqual(parentBlockHash);
      },
      extendedExecutionTimeout,
    );
  });
});
