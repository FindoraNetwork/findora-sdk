/* eslint-disable @typescript-eslint/naming-convention */
const assert = require('assert');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const HDWalletProvider = require('truffle-hdwallet-provider');

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const extendedExecutionTimeout = 600000;

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

let networkId;
let accounts;
let contract;

const getPayloadWithGas = from => ({
  gas: '1000000',
  gasPrice: '10000000000',
  from,
  chainId: networkId,
});

describe(`SkyMax Contract (contract test negative) "${rpcUrl}"`, () => {
  const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);

  const web3 = new Web3(provider);

  beforeEach(async () => {
    networkId = await web3.eth.net.getId();
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: ['Hi there'] })
      .send(getPayloadWithGas(accounts[0]));
  }, extendedExecutionTimeout);

  it(
    'validates that contract does not crashes and returns an error if method is called with invalid type of a parameter',
    async () => {
      let errorMessage = '';

      try {
        await contract.methods.enter().send({
          ...getPayloadWithGas(accounts[0]),
          value: 'aaaaaa',
        });
      } catch (err) {
        errorMessage = err.message;
      }
      assert.ok(errorMessage);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract does not crashes and returns an error if method is called with invalid number of parameters',
    async () => {
      let errorMessage = '';

      try {
        await contract.methods.setMessage().send(getPayloadWithGas(accounts[0]));
      } catch (err) {
        errorMessage = err.message;
      }
      assert.ok(errorMessage);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract it does not do any operations which must not be done when transaction is reverted',
    async () => {
      let errorMessage = '';

      try {
        await contract.methods.setMessage().send(getPayloadWithGas(accounts[0]));
      } catch (err) {
        errorMessage = err.message;
      }
      assert.ok(errorMessage);

      const currentMessage = await contract.methods.message().call();
      expect(currentMessage).toEqual('Hi there');
    },
    extendedExecutionTimeout,
  );
});
