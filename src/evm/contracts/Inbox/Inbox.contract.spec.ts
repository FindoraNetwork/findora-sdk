/* eslint-disable @typescript-eslint/naming-convention */
import assert from 'assert';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import {
  afterAllLog,
  afterEachLog,
  getPayloadWithGas,
  setCurrentTestName,
  timeLog,
  timeStart,
} from '../../testHelpers';
import { contractBytecode, contractInterface } from './compile';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

const extendedExecutionTimeout = 600000;

timeLog('Connecting to the server', rpcParams.rpcUrl);

let inbox: any;
let accounts: string[];
let networkId: number;

// const getPayloadWithGas = (from: string): SendOptions => ({
//   gas: 1000000,
//   gasPrice: '10000000001',
//   from,
//   chainId: networkId,
// });

afterAll(afterAllLog);
afterEach(afterEachLog);

const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);

const web3 = new Web3(provider);

beforeEach(async () => {
  setCurrentTestName('');

  networkId = await web3.eth.net.getId();
  accounts = await web3.eth.getAccounts();

  timeStart();

  inbox = await new web3.eth.Contract(JSON.parse(contractInterface))
    .deploy({
      data: contractBytecode,
      arguments: ['Hi there'],
    })
    .send(getPayloadWithGas(accounts[0], networkId));

  timeLog('Contract deployment');
}, extendedExecutionTimeout);

describe(`Inbox (contract test) "${rpcUrl}"`, () => {
  it(
    'deploys a contract successfully',
    () => {
      setCurrentTestName('deploys a contract successfully');

      timeStart();
      assert.ok(inbox.options.address);
      timeLog('Contract validation');
    },
    extendedExecutionTimeout,
  );
  it(
    'deploys a contract with a default assigned message',
    async () => {
      setCurrentTestName('deploys a contract with a default assigned message');

      timeStart();
      const message = await inbox.methods.message().call();
      timeLog('Call contract method');

      expect(message).toEqual('Hi there');
    },
    extendedExecutionTimeout,
  );
  it(
    'updates a message with a given value',
    async () => {
      setCurrentTestName('updates a message with a given value');

      timeStart();
      await inbox.methods.setMessage('New Message').send(getPayloadWithGas(accounts[0], networkId));
      timeLog('Call contract method with send a tx');

      timeStart();
      const currentMessage = await inbox.methods.message().call();
      timeLog(`Call contract method`);

      expect(currentMessage).toEqual('New Message');
    },
    extendedExecutionTimeout,
  );
});
