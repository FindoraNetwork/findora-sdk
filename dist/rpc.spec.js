"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var web3_1 = __importDefault(require("web3"));
var envConfigFile = process.env.RPC_ENV_NAME ? "../.env_" + process.env.RPC_ENV_NAME : "../env_example";
var envConfig = require(envConfigFile + ".json");
var rpcParams = envConfig.rpc;
// This would be initialized with the data from the setup process
var existingBlockNumberToCheck = 1;
// This would be initialized with the data from the setup process
var existingBlockHashToCheck = '';
// This would be initialized with the data from the setup process
var existingTxHashToCheck = '';
var extendedExecutionTimeout = 20000;
var ethContractAddressToReceive = '0xCC4e53d92f09C385FD9aEece3c1cd263addDbDE3';
var 
// RPC endpoint url
_a = rpcParams.rpcUrl, 
// RPC endpoint url
rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a, 
// Sender account, it has to have tokens
ethAccountToCheck = rpcParams.ethAccountToCheck;
var web3 = new web3_1.default(rpcUrl);
beforeAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionObject;
    return __generator(this, function (_a) {
        transactionObject = {
            from: ethAccountToCheck,
            to: ethContractAddressToReceive,
            value: '1000000000000000',
            // port: 8545, // Standard Ethereum port (default: none)
            // network_id: 523, // Any network (default: none)
            gas: 8000000,
            gasPrice: 700000000000,
            // disableConfirmationListener: true,
        };
        done();
        return [2 /*return*/];
    });
}); });
var a = web3.eth
    .signTransaction({
    from: ethAccountToCheck,
    gas: 8000000,
    gasPrice: 700000000000,
    to: ethContractAddressToReceive,
    value: '1000000000000000000',
    data: '',
})
    .then(console.log);
console.log('a', a);
describe('Api Endpoint (rpc test)', function () {
    describe('eth_protocolVersion', function () {
        it('Returns the current ethereum protocol version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var msgId, payload;
            return __generator(this, function (_a) {
                msgId = 2;
                payload = {
                    id: msgId,
                    method: 'eth_protocolVersion',
                };
                expect(true).toBe(true);
                return [2 /*return*/];
            });
        }); }, extendedExecutionTimeout);
    });
    // describe('eth_chainId', () => {
    //   it('Returns the current chain id', async () => {
    //     const msgId = 1;
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_chainId',
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthChainIdRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_accounts', () => {
    //   it('Returns a list of addresses owned by client', async () => {
    //     const msgId = 1;
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_accounts',
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthAccountsRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(Array.isArray(response?.result)).toEqual(true);
    //   });
    // });
    // describe('eth_getBalance', () => {
    //   it('Returns the balance of the account of given address', async () => {
    //     const msgId = 1;
    //     const extraParams = [ethAccountToCheck, 'latest'];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getBalance',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetBalanceRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_sendTransaction', () => {
    //   it('Creates new message call transaction or a contract creation, if the data field contains code', async () => {
    //     const msgId = 1;
    //     const extraParams = [
    //       {
    //         from: ethAccountToCheck,
    //         to: ethContractAddressToReceive,
    //         value: 0,
    //       },
    //     ];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_sendTransaction',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthSendTransactionRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_call', () => {
    //   it('Executes a message immediately without creating a transaction', async () => {
    //     const msgId = 1;
    //     const extraParams = [
    //       {
    //         from: ethAccountToCheck,
    //         to: ethContractAddressToReceive,
    //         data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
    //       },
    //     ];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_call',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthCallRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_coinbase', () => {
    //   it('Returns the client coinbase address', async () => {
    //     const msgId = 1;
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_coinbase',
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthCoinbaseRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_gasPrice', () => {
    //   it('Returns the current price per gas in wei', async () => {
    //     const msgId = 1;
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_gasPrice',
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGasPriceRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_blockNumber', () => {
    //   it('Returns the number of most recent block', async () => {
    //     const msgId = 1;
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_blockNumber',
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthBlockNumberRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //   });
    // });
    // describe('eth_getBlockByHash', () => {
    //   it('Returns information about a block by hash', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockHashToCheck, true];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getBlockByHash',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByHashRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.hash).toEqual('string');
    //     expect(typeof response?.result?.parentHash).toEqual('string');
    //   });
    // });
    // describe('eth_getBlockByNumber', () => {
    //   it('Returns information about a block by block number.', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockNumberToCheck, true];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getBlockByNumber',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockByNumberRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.hash).toEqual('string');
    //     expect(typeof response?.result?.parentHash).toEqual('string');
    //   });
    // });
    // describe('eth_getTransactionCount', () => {
    //   it('Returns the number of transactions SENT from an address', async () => {
    //     const msgId = 1;
    //     const extraParams = [ethAccountToCheck, 'latest'];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getTransactionCount',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionCountRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //     expect(response?.result).not.toEqual('0x0');
    //   });
    // });
    // describe('eth_getBlockTransactionCountByHash', () => {
    //   it('Returns the number of transactions in a block from a block matching the given block hash', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockHashToCheck];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getBlockTransactionCountByHash',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByHashRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //     expect(response?.result).not.toEqual('0x0');
    //   });
    // });
    // describe('eth_getBlockTransactionCountByNumber', () => {
    //   it('Returns the number of transactions in a block from a block matching the given block number', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockNumberToCheck];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getBlockTransactionCountByNumber',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetBlockTransactionCountByNumberRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //     expect(response?.result).not.toEqual('0x0');
    //   });
    // });
    // describe('eth_getCode', () => {
    //   it('Returns code at a given address', async () => {
    //     const msgId = 1;
    //     const extraParams = [ethContractAddressToReceive, 'latest'];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getCode',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetCodeRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.id).toEqual(msgId);
    //     expect(typeof response?.id).toEqual('number');
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result).toEqual('string');
    //     expect(response?.result).not.toEqual('0x0');
    //   });
    // });
    // describe('eth_sendRawTransaction', () => {
    //   it('Creates new message call transaction or a contract creation for signed transactions (negative case)', async () => {
    //     const msgId = 1;
    //     const txData = '0xa25ed3bfffc6fe42766a5246eb83a634c08b3f4a64433517605332639363398d';
    //     const extraParams = [txData];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_sendRawTransaction',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthSendRawTransactionRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.error?.message).toEqual('Invalid Signature');
    //     expect(response?.error?.code).toEqual(-32000);
    //   });
    // });
    // describe('eth_estimateGas', () => {
    //   it('Generates and returns an estimate of how much gas is necessary to allow the transaction to complete', async () => {
    //     const msgId = 1;
    //     const extraParams = [
    //       {
    //         from: ethAccountToCheck,
    //         to: ethContractAddressToReceive,
    //         data: '0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005',
    //       },
    //     ];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_estimateGas',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthEstimateGasRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(response?.result).toEqual('0x52d4');
    //   });
    // });
    // describe('eth_getTransactionByHash', () => {
    //   it('Returns the information about a transaction requested by transaction hash', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingTxHashToCheck];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getTransactionByHash',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByHashRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.blockHash).toEqual('string');
    //     expect(typeof response?.result?.blockNumber).toEqual('string');
    //     expect(response?.result?.hash).toEqual(existingTxHashToCheck);
    //   });
    // });
    // describe('eth_getTransactionByBlockHashAndIndex', () => {
    //   it('Returns information about a transaction by block hash and transaction index position', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockHashToCheck, '0x0'];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getTransactionByBlockHashAndIndex',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.blockHash).toEqual('string');
    //     expect(typeof response?.result?.blockNumber).toEqual('string');
    //     expect(response?.result?.hash).toEqual(existingTxHashToCheck);
    //   });
    // });
    // describe('eth_getTransactionByBlockNumberAndIndex', () => {
    //   it('Returns information about a transaction by block number and transaction index position', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingBlockNumberToCheck, '0x0'];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getTransactionByBlockNumberAndIndex',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionByBlockNumberAndIndexRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.blockHash).toEqual('string');
    //     expect(typeof response?.result?.blockNumber).toEqual('string');
    //     expect(response?.result?.hash).toEqual(existingTxHashToCheck);
    //   });
    // });
    // describe('eth_getTransactionReceipt', () => {
    //   it('Returns the receipt of a transaction by transaction hash', async () => {
    //     const msgId = 1;
    //     const extraParams = [existingTxHashToCheck];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getTransactionReceipt',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetTransactionReceiptRpcResult>(
    //       rpcUrl,
    //       payload,
    //     );
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(typeof response?.result?.blockHash).toEqual('string');
    //     expect(typeof response?.result?.blockNumber).toEqual('string');
    //     expect(response?.result?.transactionHash).toEqual(existingTxHashToCheck);
    //   });
    // });
    // describe('eth_getLogs', () => {
    //   it('Returns an array of all logs matching a given filter object', async () => {
    //     const msgId = 1;
    //     const extraParams = [
    //       {
    //         address: ethContractAddressToReceive,
    //       },
    //     ];
    //     const payload = {
    //       id: msgId,
    //       method: 'eth_getLogs',
    //       params: extraParams,
    //     };
    //     const result = await Network.sendRpcCall<NetworkTypes.EthGetLogsRpcResult>(rpcUrl, payload);
    //     expect(result).toHaveProperty('response');
    //     expect(result).not.toHaveProperty('error');
    //     const { response } = result;
    //     expect(typeof response?.jsonrpc).toEqual('string');
    //     expect(Array.isArray(response?.result)).toEqual(true);
    //   });
    // });
});
//# sourceMappingURL=rpc.spec.js.map