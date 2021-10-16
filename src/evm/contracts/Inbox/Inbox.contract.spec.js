/* eslint-disable @typescript-eslint/naming-convention */
const assert = require('assert');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const HDWalletProvider = require('truffle-hdwallet-provider');

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

const extendedExecutionTimeout = 40000;

let inbox;
let accounts;

const getPayloadWithGas = from => ({
  gas: '1000000',
  gasPrice: '500000',
  from,
});

describe('Inbox (contract test)', () => {
  const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, 5);

  const web3 = new Web3(provider);

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: ['Hi there'],
      })
      .send(getPayloadWithGas(accounts[0]));
  }, extendedExecutionTimeout);

  it('deploys a contract successfully', () => {
    assert.ok(inbox.options.address);
  });
  it('deploys a contract with a default assigned message', async () => {
    const message = await inbox.methods.message().call();
    expect(message).toEqual('Hi there');
  });
  it('updates a message with a given value', async () => {
    await inbox.methods.setMessage('New Message').send(getPayloadWithGas(accounts[0]));

    const currentMessage = await inbox.methods.message().call();
    expect(currentMessage).toEqual('New Message');
  });
});
