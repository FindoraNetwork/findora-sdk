import '@testing-library/jest-dom/extend-expect';
import * as Network from './network';
import * as NetworkTypes from './types';

// const rpcUrl = 'http://127.0.0.1:8545';
const rpcUrl = 'https://dev-evm.dev.findora.org:8545';

// Sender account, it has to have tokens
const ethAccountToCheck = '0xff6246f1011C1F7aD15877fb1232BEda1536b3bC';

// Store contract address - see `eth_getStorageAt`
const ethStoreContractAddress = '0xD5153e5fcBCD1dc50dCFa3debB0bD174F20EA8A4';

// This should be an existing contract address, which you can send tokens to - see `eth_call` and `eth_sendTransaction`
const ethContractAddressToReceive = '0xCC4e53d92f09C385FD9aEece3c1cd263addDbDE3';

// This block number has to be from the block `existingBlockHashToCheck`
const existingBlockNumberToCheck = '0xe';
// This block hash must be from the block `existingBlockNumberToCheck`
const existingBlockHashToCheck = '0x41f02ee22758d62ebc1b71df5ad61fd80acceecce9db57b591ff0f47ba8170a6';
// This tx hash must be from the block `existingBlockNumberToCheck`
const existingTxHashToCheck = '0x647dc5a7fec839541403f931773736d43d1aa8cdcf759f10f3543ac1ebe6763d';

describe('Api Endpoint (rpc test)', () => {
  describe('eth_protocolVersion', () => {
    it('Returns the current ethereum protocol version', async () => {
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
      expect(typeof response?.result).toEqual('string');
    });
  });
  describe('eth_chainId', () => {
    it('Returns the current chain id', async () => {
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
    });
  });
  describe('eth_accounts', () => {
    it('Returns a list of addresses owned by client', async () => {
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
    });
  });
  describe('eth_getBalance', () => {
    it('Returns the balance of the account of given address', async () => {
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
    });
  });
  describe('eth_sendTransaction', () => {
    it('Creates new message call transaction or a contract creation, if the data field contains code', async () => {
      const msgId = 1;

      const extraParams = [
        {
          from: ethAccountToCheck,
          to: ethContractAddressToReceive,
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
      expect(typeof response?.result).toEqual('string');
    });
  });
  describe('eth_call', () => {
    it('Executes a message immediately without creating a transaction', async () => {
      const msgId = 1;

      const extraParams = [
        {
          from: ethAccountToCheck,
          to: ethContractAddressToReceive,
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
    });
  });
  describe('eth_coinbase', () => {
    it('Returns the client coinbase address', async () => {
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
    });
  });
  describe('eth_gasPrice', () => {
    it('Returns the current price per gas in wei', async () => {
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
    });
  });
  describe('eth_blockNumber', () => {
    it('Returns the number of most recent block', async () => {
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
    });
  });
  describe('eth_getStorageAt', () => {
    it('Returns the value from a storage position at a given address', async () => {
      const msgId = 1;

      /**
       * Example of the Store contract
       * // SPDX-License-Identifier: GPL-3.0

        pragma solidity >=0.7.0 <0.9.0;

        contract Storage {

          uint256 pos0;

          mapping(address => uint256) pos1;

          constructor() {
              pos0 = 1234;
          }

          function store(uint256 num) public {
              pos1[msg.sender] = num;
          }

          function retrieve() public view returns (uint256){
              return pos1[msg.sender];
          }
        }
      */

      // for more details see http://man.hubwiz.com/docset/Ethereum.docset/Contents/Resources/Documents/eth_getStorageAt.html

      // that is what we define during the contract creation - pos0 = 1234;
      const expectedValue = '0x04d2';

      // ethStoreContractAddress is an Address of the Store contract
      const extraParams = [ethStoreContractAddress, '0x0', 'latest'];

      const payload = {
        id: msgId,
        method: 'eth_getStorageAt',
        params: extraParams,
      };

      const result = await Network.sendRpcCall<NetworkTypes.EthGetStorageAtRpcResult>(rpcUrl, payload);

      expect(result).toHaveProperty('response');
      expect(result).not.toHaveProperty('error');

      const { response } = result;

      expect(response?.id).toEqual(msgId);
      expect(typeof response?.id).toEqual('number');
      expect(typeof response?.jsonrpc).toEqual('string');
      expect(typeof response?.result).toEqual('string');
      expect(response?.result).toEqual(expectedValue);
    });
  });
  describe('eth_getBlockByHash', () => {
    it('Returns information about a block by hash', async () => {
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
    });
  });
  describe('eth_getBlockByNumber', () => {
    it('Returns information about a block by block number.', async () => {
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
    });
  });
  describe('eth_getTransactionCount', () => {
    it('Returns the number of transactions SENT from an address', async () => {
      const msgId = 1;

      const extraParams = [ethAccountToCheck, 'latest'];

      const payload = {
        id: msgId,
        method: 'eth_getTransactionCount',
        params: extraParams,
      };

      const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(rpcUrl, payload);

      expect(result).toHaveProperty('response');
      expect(result).not.toHaveProperty('error');

      const { response } = result;

      expect(response?.id).toEqual(msgId);
      expect(typeof response?.id).toEqual('number');
      expect(typeof response?.jsonrpc).toEqual('string');
      expect(typeof response?.result).toEqual('string');
      expect(response?.result).not.toEqual('0x0');
    });
  });
  describe('eth_getBlockTransactionCountByHash', () => {
    it('Returns the number of transactions in a block from a block matching the given block hash', async () => {
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
    });
  });
  describe('eth_getBlockTransactionCountByNumber', () => {
    it('Returns the number of transactions in a block from a block matching the given block number', async () => {
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
    });
  });
  describe('eth_getCode', () => {
    it('Returns code at a given address', async () => {
      const msgId = 1;

      const extraParams = [ethStoreContractAddress, 'latest'];

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
    });
  });
  describe('eth_sendRawTransaction', () => {
    it('Creates new message call transaction or a contract creation for signed transactions (negative case)', async () => {
      const msgId = 1;

      const txData = '0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d';
      const extraParams = [txData];

      const payload = {
        id: msgId,
        method: 'eth_sendRawTransaction',
        params: extraParams,
      };

      const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(rpcUrl, payload);

      expect(result).toHaveProperty('response');
      expect(result).not.toHaveProperty('error');

      const { response } = result;

      expect(response?.error?.message).toEqual('Invalid Signature');
      expect(response?.error?.code).toEqual(-32000);
    });
  });
  describe('eth_estimateGas', () => {
    it('Generates and returns an estimate of how much gas is necessary to allow the transaction to complete', async () => {
      const msgId = 1;

      const extraParams = [
        {
          from: ethAccountToCheck,
          to: ethContractAddressToReceive,
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
    });
  });
  describe('eth_getTransactionByHash', () => {
    it('Returns the information about a transaction requested by transaction hash', async () => {
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
    });
  });
  describe('eth_getTransactionByBlockHashAndIndex', () => {
    it('Returns information about a transaction by block hash and transaction index position', async () => {
      const msgId = 1;

      const extraParams = [existingBlockHashToCheck, '0x0'];

      const payload = {
        id: msgId,
        method: 'eth_getTransactionByBlockHashAndIndex',
        params: extraParams,
      };

      const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
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
      expect(response?.result?.blockHash).toEqual(existingBlockHashToCheck);
    });
  });
  describe('eth_getTransactionByBlockNumberAndIndex', () => {
    it('Returns information about a transaction by block number and transaction index position', async () => {
      const msgId = 1;

      const extraParams = [existingBlockNumberToCheck, '0x0'];

      const payload = {
        id: msgId,
        method: 'eth_getTransactionByBlockNumberAndIndex',
        params: extraParams,
      };

      const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
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
      expect(response?.result?.blockHash).toEqual(existingBlockHashToCheck);
    });
  });
  describe('eth_getTransactionReceipt', () => {
    it('Returns the receipt of a transaction by transaction hash', async () => {
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
      expect(response?.result?.blockHash).toEqual(existingBlockHashToCheck);
    });
  });
  describe('eth_getLogs', () => {
    it('Returns an array of all logs matching a given filter object', async () => {
      const msgId = 1;

      const extraParams = [
        {
          address: ethStoreContractAddress,
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
    });
  });
});
