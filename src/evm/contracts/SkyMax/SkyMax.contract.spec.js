/* eslint-disable @typescript-eslint/naming-convention */
const assert = require('assert');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// const ganache = require('ganache-cli');
// const ganacheProvider = ganache.provider();
// const web3 = new Web3(ganacheProvider);

const HDWalletProvider = require('@truffle/hdwallet-provider');

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, 5);

const web3 = new Web3(provider);

let accounts;
let contract;

const getPayloadWithGas = from => ({
  gas: '1000000',
  gasPrice: '500000',
  from,
});

describe('SkyMax Contract (contract test)', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: ['Hi there'] })
      .send(getPayloadWithGas(accounts[0]));
  });

  it('validates that the contract can be created', () => {
    assert.ok(contract.options.address);
  });
  it('validates that its initial value for some contract data can be set', async () => {
    const message = await contract.methods.message().call();
    expect(message).toEqual('Hi there');
  });
  it('validates that its data can be updated', async () => {
    await contract.methods.setMessage('New Message').send(getPayloadWithGas(accounts[0]));
    const currentMessage = await contract.methods.message().call();
    expect(currentMessage).toEqual('New Message');
  });
  it('validates that contract balance can be updated', async () => {
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contract.options.address);

    const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

    expect(formattedContractBalance).toEqual('0.1');
  });
  it('validates that contract can transfer balance to the address', async () => {
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contract.options.address);

    const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

    expect(formattedContractBalance).toEqual('0.1');

    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    await contract.methods.pickWinner().send(getPayloadWithGas(accounts[0]));

    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const balanceDifference = balanceAfter - balanceBefore;

    assert.ok(balanceDifference > web3.utils.toWei('0.0999', 'ether'));
  });
  it('validates that contract can maintain mappings', async () => {
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[1]),
      value: web3.utils.toWei('0.2', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contract.options.address);
    expect(web3.utils.fromWei(balanceContract, 'ether')).toEqual('0.3');

    const balancFirstAccount = await contract.methods.getContribution(accounts[0]).call();
    expect(web3.utils.fromWei(balancFirstAccount, 'ether')).toEqual('0.1');

    const balanceSecondAccount = await contract.methods.getContribution(accounts[1]).call();
    expect(web3.utils.fromWei(balanceSecondAccount, 'ether')).toEqual('0.2');
  });
  it('validates that contract can validate required rules (i.e. minimum accepted value for the payable function)', async () => {
    let errorMessage = '';

    try {
      await contract.methods.enter().send({
        from: accounts[0],
        value: 1,
      });
    } catch (err) {
      errorMessage = err.message;
    }
    assert.ok(errorMessage);
  });
  it('validates that contract can maintain arrays', async () => {
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });
    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[1]),
      value: web3.utils.toWei('0.2', 'ether'),
    });

    const firstPlayer = await contract.methods.players(0).call();
    expect(firstPlayer).toEqual(accounts[0]);
    const secondPlayer = await contract.methods.players(1).call();
    expect(secondPlayer).toEqual(accounts[1]);
  });
  it('validates that contract can parse transaction event logs to verify outputs in the event, get and aseert value for the key', async () => {
    let firstBlock = 0;
    let secondBlock = 0;
    let firstSentTxHash;
    let secondSentTxHash;

    await contract.methods
      .enter()
      .send({
        ...getPayloadWithGas(accounts[0]),
        value: web3.utils.toWei('0.1', 'ether'),
      })
      .on('receipt', function (_receipt) {
        const { blockNumber, transactionHash } = _receipt;
        firstBlock = blockNumber;
        firstSentTxHash = transactionHash;
      });

    await contract.methods
      .enter()
      .send({
        ...getPayloadWithGas(accounts[1]),
        value: web3.utils.toWei('0.2', 'ether'),
      })
      .on('receipt', function (_receipt) {
        const { blockNumber, transactionHash } = _receipt;
        secondBlock = blockNumber;
        secondSentTxHash = transactionHash;
      });

    const contractEvents = await contract.getPastEvents(
      'Transferred',
      {
        fromBlock: firstBlock,
        toBlock: secondBlock,
      },
      _error => {
        if (_error) {
          console.log('🚀 ~ file: SkyMax.contract.spec.js ~ line 245 ~ it ~ 1 _error', _error);
        }
      },
    );

    expect(contractEvents.length).toEqual(2);

    const [firstLogItem, secondLogItem] = contractEvents;

    const {
      transactionHash: firstTxHash,
      returnValues: { from: firstTxFrom, quantity: firstTxQuantity },
    } = firstLogItem;

    expect(firstTxHash).toEqual(firstSentTxHash);
    expect(firstTxFrom).toEqual(accounts[0]);
    expect(web3.utils.fromWei(firstTxQuantity, 'ether')).toEqual('0.1');

    const {
      transactionHash: secondTxHash,
      returnValues: { from: secondTxFrom, quantity: secondTxQuantity },
    } = secondLogItem;

    expect(secondTxHash).toEqual(secondSentTxHash);
    expect(secondTxFrom).toEqual(accounts[1]);
    expect(web3.utils.fromWei(secondTxQuantity, 'ether')).toEqual('0.2');
  });
});
