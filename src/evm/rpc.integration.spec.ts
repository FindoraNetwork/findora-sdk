import '@testing-library/jest-dom/extend-expect';
import * as Network from '../api/network/network';
import * as NetworkTypes from '../api/network/types';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;

// This would be initialized with the data from the setup process
let existingBlockNumberToCheck = 1;
// This would be initialized with the data from the setup process
let existingBlockHashToCheck = '';
// This would be initialized with the data from the setup process
let existingTxHashToCheck = '';

const extendedExecutionTimeout = 20000;

const {
  // RPC endpoint url
  rpcUrl = 'http://127.0.0.1:8545',
  // Sender account, it has to have tokens
  ethAccountToCheck,
  //Sender mnemonic (to be used in web3)
  mnemonic,
} = rpcParams;
console.log('🚀 ~ rpcParams.rpcUrl', rpcParams.rpcUrl);

const provider = new HDWalletProvider(mnemonic, rpcUrl);

const web3 = new Web3(provider);

let accounts: string[];

const getPayloadWithGas = (from: string) => ({
  gas: '1000000',
  gasPrice: '500000',
  from,
});

beforeAll(async (done: any) => {
  accounts = await web3.eth.getAccounts();

  const transactionObject = {
    ...getPayloadWithGas(accounts[0]),
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
      const { transactionHash, blockHash, blockNumber } = receipt;

      // This block number has to be from the block `existingBlockHashToCheck`
      existingBlockNumberToCheck = blockNumber;
      // This block hash must be from the block `existingBlockNumberToCheck`
      existingBlockHashToCheck = blockHash;
      // This tx hash must be from the block `existingBlockNumberToCheck`
      existingTxHashToCheck = transactionHash;
      done();
    });
}, extendedExecutionTimeout);

describe('Api Endpoint (rpc test)', () => {
  describe('eth_protocolVersion', () => {
    it(
      'Returns the current ethereum protocol version',
      async () => {
        const msgId = 2;
        const payload = {
          id: msgId,
          method: 'eth_protocolVersion',
        };
        const result = await Network.sendRpcCall<NetworkTypes.EthProtocolRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_chainId', () => {
    it(
      'Returns the current chain id',
      async () => {
        const msgId = 1;
        const payload = {
          id: msgId,
          method: 'eth_chainId',
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthChainIdRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_accounts', () => {
    it(
      'Returns a list of addresses owned by client',
      async () => {
        const msgId = 1;

        const payload = {
          id: msgId,
          method: 'eth_accounts',
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthAccountsRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(Array.isArray(response?.result)).toEqual(true);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBalance', () => {
    it(
      'Returns the balance of the account of given address',
      async () => {
        const msgId = 1;

        const extraParams = [ethAccountToCheck, 'latest'];

        const payload = {
          id: msgId,
          method: 'eth_getBalance',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBalanceRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_sendTransaction', () => {
    it(
      'Creates new message call transaction or a contract creation, if the data field contains code',
      async () => {
        const msgId = 1;

        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            value: 0,
          },
        ];

        const payload = {
          id: msgId,
          method: 'eth_sendTransaction',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthSendTransactionRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_call', () => {
    it(
      'Executes a message immediately without creating a transaction',
      async () => {
        const msgId = 1;

        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
          },
        ];

        const payload = {
          id: msgId,
          method: 'eth_call',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthCallRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_coinbase', () => {
    it(
      'Returns the client coinbase address',
      async () => {
        const msgId = 1;

        const payload = {
          id: msgId,
          method: 'eth_coinbase',
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthCoinbaseRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_gasPrice', () => {
    it(
      'Returns the current price per gas in wei',
      async () => {
        const msgId = 1;

        const payload = {
          id: msgId,
          method: 'eth_gasPrice',
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGasPriceRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_blockNumber', () => {
    it(
      'Returns the number of most recent block',
      async () => {
        const msgId = 1;

        const payload = {
          id: msgId,
          method: 'eth_blockNumber',
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthBlockNumberRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockByHash', () => {
    it(
      'Returns information about a block by hash',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockHashToCheck, true];

        const payload = {
          id: msgId,
          method: 'eth_getBlockByHash',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.hash).toEqual('string');
        expect(typeof response?.result?.parentHash).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockByNumber', () => {
    it(
      'Returns information about a block by block number.',
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
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.hash).toEqual('string');
        expect(typeof response?.result?.parentHash).toEqual('string');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionCount', () => {
    it(
      'Returns the number of transactions SENT from an address',
      async () => {
        const msgId = 1;

        const extraParams = [accounts[0], 'latest'];

        const payload = {
          id: msgId,
          method: 'eth_getTransactionCount',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
        expect(response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockTransactionCountByHash', () => {
    it(
      'Returns the number of transactions in a block from a block matching the given block hash',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockHashToCheck];

        const payload = {
          id: msgId,
          method: 'eth_getBlockTransactionCountByHash',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByHashRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
        expect(response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getBlockTransactionCountByNumber', () => {
    it(
      'Returns the number of transactions in a block from a block matching the given block number',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockNumberToCheck];

        const payload = {
          id: msgId,
          method: 'eth_getBlockTransactionCountByNumber',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
        expect(response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getCode', () => {
    it(
      'Returns code at a given address',
      async () => {
        const msgId = 1;

        const extraParams = [accounts[1], 'latest'];

        const payload = {
          id: msgId,
          method: 'eth_getCode',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetCodeRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.id).toEqual(msgId);
        expect(typeof response?.id).toEqual('number');
        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result).toEqual('string');
        expect(response?.result).not.toEqual('0x0');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_sendRawTransaction', () => {
    it(
      'Creates new message call transaction or a contract creation for signed transactions (negative case)',
      async () => {
        const msgId = 1;

        const txData = '0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d';
        const extraParams = [txData];

        const payload = {
          id: msgId,
          method: 'eth_sendRawTransaction',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.error?.code).toEqual('number');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_estimateGas', () => {
    it(
      'Generates and returns an estimate of how much gas is necessary to allow the transaction to complete',
      async () => {
        const msgId = 1;

        const extraParams = [
          {
            from: accounts[0],
            to: accounts[1],
            data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
          },
        ];

        const payload = {
          id: msgId,
          method: 'eth_estimateGas',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthEstimateGasRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(response?.result).toEqual('0x52d4');
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByHash', () => {
    it(
      'Returns the information about a transaction requested by transaction hash',
      async () => {
        const msgId = 1;

        const extraParams = [existingTxHashToCheck];

        const payload = {
          id: msgId,
          method: 'eth_getTransactionByHash',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByHashRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.blockHash).toEqual('string');
        expect(typeof response?.result?.blockNumber).toEqual('string');
        expect(response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByBlockHashAndIndex', () => {
    it(
      'Returns information about a transaction by block hash and transaction index position',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockHashToCheck, '0x0'];

        const payload = {
          id: msgId,
          method: 'eth_getTransactionByBlockHashAndIndex',
          params: extraParams,
        };

        const result =
          await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
            rpcUrl,
            payload,
          );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.blockHash).toEqual('string');
        expect(typeof response?.result?.blockNumber).toEqual('string');
        expect(response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionByBlockNumberAndIndex', () => {
    it(
      'Returns information about a transaction by block number and transaction index position',
      async () => {
        const msgId = 1;

        const extraParams = [existingBlockNumberToCheck, '0x0'];

        const payload = {
          id: msgId,
          method: 'eth_getTransactionByBlockNumberAndIndex',
          params: extraParams,
        };

        const result =
          await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
            rpcUrl,
            payload,
          );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.blockHash).toEqual('string');
        expect(typeof response?.result?.blockNumber).toEqual('string');
        expect(response?.result?.hash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getTransactionReceipt', () => {
    it(
      'Returns the receipt of a transaction by transaction hash',
      async () => {
        const msgId = 1;

        const extraParams = [existingTxHashToCheck];

        const payload = {
          id: msgId,
          method: 'eth_getTransactionReceipt',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionReceiptRpcResult>(
          rpcUrl,
          payload,
        );

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.jsonrpc).toEqual('string');
        expect(typeof response?.result?.blockHash).toEqual('string');
        expect(typeof response?.result?.blockNumber).toEqual('string');
        expect(response?.result?.transactionHash).toEqual(existingTxHashToCheck);
      },
      extendedExecutionTimeout,
    );
  });
  describe('eth_getLogs', () => {
    it(
      'Returns an array of all logs matching a given filter object',
      async () => {
        const msgId = 1;

        const extraParams = [
          {
            address: accounts[0],
          },
        ];

        const payload = {
          id: msgId,
          method: 'eth_getLogs',
          params: extraParams,
        };

        const result = await Network.sendRpcCall<NetworkTypes.EthGetLogsRpcResult>(rpcUrl, payload);

        expect(result).toHaveProperty('response');
        expect(result).not.toHaveProperty('error');

        const { response } = result;

        expect(typeof response?.jsonrpc).toEqual('string');
        expect(Array.isArray(response?.result)).toEqual(true);
      },
      extendedExecutionTimeout,
    );
  });
});
