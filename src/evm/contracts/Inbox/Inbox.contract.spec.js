const assert = require('assert');
const Web3 = require('web3');
const contract = require('./compile');
const HDWalletProvider = require('truffle-hdwallet-provider');
const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_${process.env.RPC_ENV_NAME}`
  : `../../../../env_example`;

const envConfig = require(`${envConfigFile}.json`);

const extendedExecutionTimeout = 40000;

const { rpc: rpcParams } = envConfig;
const {
  // RPC endpoint url
  rpcUrl = 'http://127.0.0.1:8545',
  // Sender account, it has to have tokens
  ethAccountToCheck,
  //Sender mnemonic (to be used in web3)
  mnemonic,
} = rpcParams;

const { interface, bytecode } = contract;

let inbox;

describe('Inbox (contract test)', () => {
  const provider = new HDWalletProvider(mnemonic, rpcUrl);

  const web3 = new Web3(provider);
  beforeEach(async done => {
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: ['Hi there'],
      })
      .send({
        from: ethAccountToCheck,
        gas: 1000000,
        gasPrice: 700000000000,
      });
    done();
  }, extendedExecutionTimeout);

  it('deploys a contract successfully', () => {
    assert.ok(inbox.options.address);
  });
  it('deploys a contract with a default assigned message', async () => {
    const message = await inbox.methods.message().call();
    expect(message).toEqual('Hi there');
  });
  it('updates a message with a given value', async () => {
    await inbox.methods.setMessage('New Message').send({
      from: ethAccountToCheck,
      gas: 1000000,
      gasPrice: 700000000000,
    });
    const currentMessage = await inbox.methods.message().call();
    expect(currentMessage).toEqual('New Message');
  });
});
