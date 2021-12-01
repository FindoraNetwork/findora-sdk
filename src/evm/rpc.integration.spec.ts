import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';
import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';

import {
  assertBasicResult,
  getPayloadWithGas,
  assertResultType,
  assertResultResponse,
  getRpcPayload,
} from './testHelpers';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

// This would be initialized with the data from the setup process
let existingBlockNumberToCheck = 1;
// This would be initialized with the data from the setup process
let existingBlockHashToCheck = '';
// This would be initialized with the data from the setup process
let existingTxHashToCheck = '';

let existingTransactionIndex = 0;

const extendedExecutionTimeout = 180000;

const {
  // RPC endpoint url
  rpcUrl = 'http://127.0.0.1:8545',
  //Sender mnemonic (to be used in web3)
  mnemonic,
} = rpcParams;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);

const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);

const web3 = new Web3(provider);

let networkId: number;
let accounts: string[];

const getTestResult = async <N, T>(msgId: number, method: string, extraParams?: T) => {
  const payload = getRpcPayload<typeof extraParams>(msgId, method, extraParams);

  const result = await Network.sendRpcCall<N>(rpcUrl, payload);

  assertResultResponse(result);
  assertBasicResult<N>(result, msgId);

  return result;
};

beforeAll(async (done: any) => {
  accounts = await web3.eth.getAccounts();
  networkId = await web3.eth.net.getId();

  console.log('🚀 ~ file: rpc.integration.spec.ts ~ line 63 ~ beforeAll ~ networkId', networkId);

  const transactionObject = {
    ...getPayloadWithGas(accounts[0], networkId),
    to: accounts[1],
    value: web3.utils.toWei('0.1', 'ether'),
  };

  web3.eth
    .sendTransaction(transactionObject)
    .once('sending', async _payload => {
      console.log('🚀 ~ IT IS SENDING file: rpc.spec.ts ~ line 37 ~ payload', _payload);
    })
    .once('sent', async _payload => {
      console.log('🚀 ~ IT IS SENT file: rpc.spec.ts ~ line 40 ~ payload', _payload);
    })
    .once('transactionHash', async _hash => {
      console.log('🚀 ~ file: rpc.spec.ts ~ line 44 ~ hash', _hash);
    })
    .once('receipt', async _receipt => {
      console.log('🚀 ~ file: rpc.spec.ts ~ line 45 ~ receipt', _receipt);
    })
    .on('error', async _error => {
      console.log('🚀 ~ ERROR file: rpc.spec.ts ~ line 51 ~ error', _error);
    })
    .then(function (receipt) {
      // will be fired once the receipt is mined
      const { transactionHash, blockHash, blockNumber, transactionIndex } = receipt;

      // This block number has to be from the block `existingBlockHashToCheck`
      existingBlockNumberToCheck = blockNumber;
      // This block hash must be from the block `existingBlockNumberToCheck`
      existingBlockHashToCheck = blockHash;
      // This tx hash must be from the block `existingBlockNumberToCheck`
      existingTxHashToCheck = transactionHash;

      existingTransactionIndex = transactionIndex;

      done();
    });
}, extendedExecutionTimeout);

describe(`Api Endpoint (rpc test) for "${rpcUrl}"`, () => {
  describe('eth_protocolVersion', () => {
    it(
      'Returns the current ethereum protocol version',
      async () => {
        const result = await getTestResult<NetworkTypes.EthProtocolRpcResult, void>(2, 'eth_protocolVersion');

        assertResultType(result, 'number');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_chainId', () => {
    it(
      'Returns the current chain id',
      async () => {
        const result = await getTestResult<NetworkTypes.EthChainIdRpcResult, void>(1, 'eth_chainId');

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_accounts', () => {
    it(
      'Returns a list of addresses owned by client',
      async () => {
        const result = await getTestResult<NetworkTypes.EthAccountsRpcResult, void>(1, 'eth_accounts');

        expect(Array.isArray(result.response?.result)).toEqual(true);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBalance', () => {
    it(
      'Returns the balance of the account of given address',
      async () => {
        const extraParams = [accounts[0], 'latest'];

        const result = await getTestResult<NetworkTypes.EthGetBalanceRpcResult, typeof extraParams>(
          2,
          'eth_getBalance',
          extraParams,
        );

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_sendTransaction', () => {
    it(
      'Creates new message call transaction or a contract creation, if the data field contains code',
      async () => {
        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            value: 0,
          },
        ];

        const result = await getTestResult<NetworkTypes.EthSendTransactionRpcResult, typeof extraParams>(
          1,
          'eth_sendTransaction',
          extraParams,
        );

        assertResultType(result, 'undefined');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_call', () => {
    it(
      'Executes a message immediately without creating a transaction',
      async () => {
        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
          },
        ];

        const result = await getTestResult<NetworkTypes.EthCallRpcResult, typeof extraParams>(
          3,
          'eth_call',
          extraParams,
        );

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_coinbase', () => {
    it(
      'Returns the client coinbase address',
      async () => {
        const result = await getTestResult<NetworkTypes.EthCoinbaseRpcResult, void>(1, 'eth_coinbase');

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_gasPrice', () => {
    it(
      'Returns the current price per gas in wei',
      async () => {
        const result = await getTestResult<NetworkTypes.EthGasPriceRpcResult, void>(1, 'eth_gasPrice');

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_blockNumber', () => {
    it(
      'Returns the number of most recent block',
      async () => {
        const result = await getTestResult<NetworkTypes.EthBlockNumberRpcResult, void>(1, 'eth_blockNumber');

        assertResultType(result, 'string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockByHash', () => {
    it(
      'Returns information about a block by hash',
      async () => {
        const extraParams = [existingBlockHashToCheck, true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByHashRpcResult, typeof extraParams>(
          1,
          'eth_getBlockByHash',
          extraParams,
        );

        console.log('🚀 ~ file: rpc.integration.spec.ts ~ line 240 ~  eth_getBlockByHash result', result);

        expect(typeof result?.response?.result?.hash).toEqual('string');
        expect(typeof result?.response?.result?.parentHash).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockByNumber', () => {
    it(
      'Returns information about a block by block number.',
      async () => {
        const extraParams = [existingBlockNumberToCheck, true];

        const result = await getTestResult<NetworkTypes.EthGetBlockByNumberRpcResult, typeof extraParams>(
          1,
          'eth_getBlockByNumber',
          extraParams,
        );

        expect(typeof result?.response?.result?.hash).toEqual('string');
        expect(typeof result?.response?.result?.parentHash).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionCount', () => {
    it(
      'Returns the number of transactions SENT from an address',
      async () => {
        const extraParams = [accounts[0], 'latest'];

        const result = await getTestResult<NetworkTypes.EthGetTransactionCountRpcResult, typeof extraParams>(
          1,
          'eth_getTransactionCount',
          extraParams,
        );

        assertResultType(result, 'string');
        expect(result?.response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockTransactionCountByHash', () => {
    it(
      'Returns the number of transactions in a block from a block matching the given block hash',
      async () => {
        const extraParams = [existingBlockHashToCheck];

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByHashRpcResult,
          typeof extraParams
        >(1, 'eth_getBlockTransactionCountByHash', extraParams);

        assertResultType(result, 'string');
        expect(result?.response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockTransactionCountByNumber', () => {
    it(
      'Returns the number of transactions in a block from a block matching the given block number',
      async () => {
        const extraParams = [existingBlockNumberToCheck];

        const result = await getTestResult<
          NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult,
          typeof extraParams
        >(2, 'eth_getBlockTransactionCountByNumber', extraParams);

        assertResultType(result, 'string');
        expect(result?.response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getCode', () => {
    it(
      'Returns code at a given address',
      async () => {
        const extraParams = [accounts[1], 'latest'];

        const result = await getTestResult<NetworkTypes.EthGetCodeRpcResult, typeof extraParams>(
          2,
          'eth_getCode',
          extraParams,
        );

        assertResultType(result, 'string');
        expect(result?.response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_sendRawTransaction', () => {
    it(
      'Creates new message call transaction or a contract creation for signed transactions (negative case)',
      async () => {
        const extraParams = ['0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d'];

        const result = await getTestResult<NetworkTypes.EthSendRawTransactionRpcResult, typeof extraParams>(
          2,
          'eth_sendRawTransaction',
          extraParams,
        );

        expect(typeof result?.response?.error?.code).toEqual('number');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_estimateGas', () => {
    it(
      'Generates and returns an estimate of how much gas is necessary to allow the transaction to complete',
      async () => {
        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
          },
        ];

        const result = await getTestResult<NetworkTypes.EthEstimateGasRpcResult, typeof extraParams>(
          3,
          'eth_estimateGas',
          extraParams,
        );

        expect(result?.response?.result).toEqual('0x52d4');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByHash', () => {
    it(
      'Returns the information about a transaction requested by transaction hash',
      async () => {
        const extraParams = [existingTxHashToCheck];

        const result = await getTestResult<NetworkTypes.EthGetTransactionByHashRpcResult, typeof extraParams>(
          3,
          'eth_getTransactionByHash',
          extraParams,
        );

        expect(typeof result?.response?.result?.blockHash).toEqual('string');
        expect(typeof result?.response?.result?.blockNumber).toEqual('string');
        expect(result?.response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByBlockHashAndIndex', () => {
    it(
      'Returns information about a transaction by block hash and transaction index position',
      async () => {
        const extraParams = [existingBlockHashToCheck, existingTransactionIndex];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockHashAndIndexRpcResult,
          typeof extraParams
        >(3, 'eth_getTransactionByBlockHashAndIndex', extraParams);

        console.log(
          '🚀 ~ file: rpc.integration.spec.ts ~ line 401 ~ eth_getTransactionByBlockHashAndIndex result',
          result,
        );

        expect(typeof result?.response?.result?.blockHash).toEqual('string');
        expect(typeof result?.response?.result?.blockNumber).toEqual('string');
        expect(result?.response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByBlockNumberAndIndex', () => {
    it(
      'Returns information about a transaction by block number and transaction index position',
      async () => {
        const extraParams = [existingBlockNumberToCheck, existingTransactionIndex];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult,
          typeof extraParams
        >(3, 'eth_getTransactionByBlockNumberAndIndex', extraParams);

        expect(typeof result?.response?.result?.blockHash).toEqual('string');
        expect(typeof result?.response?.result?.blockNumber).toEqual('string');
        expect(result?.response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionReceipt', () => {
    it(
      'Returns the receipt of a transaction by transaction hash',
      async () => {
        const extraParams = [existingTxHashToCheck];

        const result = await getTestResult<
          NetworkTypes.EthGetTransactionReceiptRpcResult,
          typeof extraParams
        >(1, 'eth_getTransactionReceipt', extraParams);

        expect(typeof result?.response?.result?.blockHash).toEqual('string');
        expect(typeof result?.response?.result?.blockNumber).toEqual('string');
        expect(result?.response?.result?.transactionHash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getLogs', () => {
    it(
      'Returns an array of all logs matching a given filter object',
      async () => {
        const extraParams = [
          {
            address: accounts[0],
          },
        ];

        const result = await getTestResult<NetworkTypes.EthGetLogsRpcResult, typeof extraParams>(
          1,
          'eth_getLogs',
          extraParams,
        );

        expect(Array.isArray(result?.response?.result)).toEqual(true);
      },
      extendedExecutionTimeout,
    );
  });
});
