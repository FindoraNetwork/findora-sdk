/* eslint-disable @typescript-eslint/naming-convention */
const assert = require('assert');
const Web3 = require('web3');
const { interface: interfaceD, bytecode: bytecodeD } = require('./compileDeployed');
const { interface: interfaceE, bytecode: bytecodeE } = require('./compileExisting');

const HDWalletProvider = require('truffle-hdwallet-provider');

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

let accounts;
let contractDeployed;
let contractExisting;

const getPayloadWithGas = from => ({
  gas: '1000000',
  gasPrice: '10000000001',
  from,
});

describe('SkyMaxMulti Contract (contract test)', () => {
  const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);

  const web3 = new Web3(provider);

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contractDeployed = await new web3.eth.Contract(JSON.parse(interfaceD))
      .deploy({ data: bytecodeD, arguments: [123] })
      .send(getPayloadWithGas(accounts[0]));

    contractExisting = await new web3.eth.Contract(JSON.parse(interfaceE))
      .deploy({ data: bytecodeE, arguments: [contractDeployed.options.address] })
      .send(getPayloadWithGas(accounts[0]));
  });

  it('validates that the contract can be created', () => {
    assert.ok(contractDeployed.options.address);
    assert.ok(contractExisting.options.address);
  });

  it('validates that internal contract data can be updated by another contract', async () => {
    await contractExisting.methods.setA_Signature(456).send({
      ...getPayloadWithGas(accounts[0]),
    });

    const messageNum = await contractDeployed.methods.a().call();

    expect(messageNum).toEqual(`456`);
  });

  it('validates that contract balance can be updated by the call from another contract', async () => {
    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);

    const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

    expect(formattedContractBalance).toEqual('0.1');
  });

  it('validates that contract can transfer balance to the address, which is added from another contract', async () => {
    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);

    const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

    expect(formattedContractBalance).toEqual('0.1');

    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    await contractDeployed.methods.pickWinner().send(getPayloadWithGas(accounts[0]));

    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const balanceDifference = balanceAfter - balanceBefore;

    assert.ok(balanceDifference > web3.utils.toWei('0.0999', 'ether'));
  });

  it('validates that contract can maintain mappings coming from another contract', async () => {
    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[1]),
      value: web3.utils.toWei('0.2', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);
    expect(web3.utils.fromWei(balanceContract, 'ether')).toEqual('0.3');

    const balancFirstAccount = await contractDeployed.methods.getContribution(accounts[0]).call();
    expect(web3.utils.fromWei(balancFirstAccount, 'ether')).toEqual('0.1');

    const balanceSecondAccount = await contractDeployed.methods.getContribution(accounts[1]).call();
    expect(web3.utils.fromWei(balanceSecondAccount, 'ether')).toEqual('0.2');
  });

  it('validates that contract can validate required rules (i.e. minimum accepted value for the payable function) when it is called from another contract', async () => {
    let errorMessage = '';

    try {
      await contractExisting.methods.enter_Signature().send({
        from: accounts[0],
        value: 1,
      });
    } catch (err) {
      errorMessage = err.message;
    }
    assert.ok(errorMessage);
  });

  it('validates that contract can maintain arrays created by another contract', async () => {
    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });
    await contractExisting.methods.enter_Signature().send({
      ...getPayloadWithGas(accounts[1]),
      value: web3.utils.toWei('0.2', 'ether'),
    });

    const firstPlayer = await contractDeployed.methods.players(0).call();
    expect(firstPlayer).toEqual(accounts[0]);
    const secondPlayer = await contractDeployed.methods.players(1).call();
    expect(secondPlayer).toEqual(accounts[1]);
  });

  it('validates that contract can parse transaction event logs to verify outputs in the event, created by a trigger from another contract, get and assert value for the key', async () => {
    let firstBlock = 0;
    let secondBlock = 0;
    let firstSentTxHash;
    let secondSentTxHash;

    await contractExisting.methods
      .enter_Signature()
      .send({
        ...getPayloadWithGas(accounts[0]),
        value: web3.utils.toWei('0.1', 'ether'),
      })
      .on('receipt', function (_receipt) {
        const { blockNumber, transactionHash } = _receipt;
        firstBlock = blockNumber;
        firstSentTxHash = transactionHash;
      });

    await contractExisting.methods
      .enter_Signature()
      .send({
        ...getPayloadWithGas(accounts[1]),
        value: web3.utils.toWei('0.2', 'ether'),
      })
      .on('receipt', function (_receipt) {
        const { blockNumber, transactionHash } = _receipt;
        secondBlock = blockNumber;
        secondSentTxHash = transactionHash;
      });

    const contractEvents = await contractDeployed.getPastEvents(
      'Transferred',
      {
        fromBlock: firstBlock,
        toBlock: secondBlock,
      },
      _error => {
        if (_error) {
          console.log('🚀 ~ _error', _error);
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
