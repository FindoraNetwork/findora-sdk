/* eslint-disable @typescript-eslint/naming-convention */
const assert = require('assert');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const HDWalletProvider = require('truffle-hdwallet-provider');

const sleep = require('sleep-promise');

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

const sendTxToAccount = async (senderAccount, receiverAccount, amountToSend) => {
  const value = web3.utils.toWei(amountToSend, 'ether');

  const transactionObject = {
    ...getPayloadWithGas(senderAccount),
    to: receiverAccount,
    value,
  };

  await web3.eth
    .sendTransaction(transactionObject)
    .on('error', async _error => {
      console.log('🚀 ~ ERROR file: rpc.spec.ts ~ line 51 ~ error', _error);
    })
    .then(function (_receipt) {
      // will be fired once the receipt is mined
      const { blockNumber } = _receipt;
      console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 87 ~ blockNumber', blockNumber);
    });
};

const sendBatchOfTx = async (senderAccount, receiverAccount, amountToSend, txQuantity) => {
  let sent = 1;

  while (sent <= txQuantity) {
    await sendTxToAccount(senderAccount, receiverAccount, amountToSend);
    sent += 1;
    await sleep(2000);
  }

  return sent;
};

describe('Send a transaction and check the balances and confirmations', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode })
      .send(getPayloadWithGas(accounts[0]));
  });

  it('sends money to the contract and receives it back, verifies the sender balance and confirmations', async () => {
    let numberOfConfirmations = 0;
    let txReceipt = {};
    let txHash = '';

    await contract.methods.enter().send({
      ...getPayloadWithGas(accounts[0]),
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contract.options.address);

    assert.ok(balanceContract > 0);

    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    await contract.methods
      .pickWinner()
      .send(getPayloadWithGas(accounts[0]))
      .on('transactionHash', function (_hash) {
        txHash = _hash;
      })
      .on('confirmation', function (_confirmationNumber, _receipt) {
        numberOfConfirmations += 1;
      })
      .on('receipt', function (_receipt) {
        txReceipt = _receipt;
      });

    assert.ok(txHash !== '');
    assert.strictEqual(txReceipt.transactionHash, txHash);

    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const balanceDifference = balanceAfter - balanceBefore;

    assert.ok(accounts.length > 0);

    assert.ok(balanceDifference > web3.utils.toWei('0.0999', 'ether'));

    const fromAddress = accounts[3];
    const toAddress = accounts[2];

    await sendBatchOfTx(fromAddress, toAddress, '0.02', 13);

    console.log('waiting for 2000 ms before final assettion');

    await sleep(2000);

    console.log(
      '🚀 ~ file: Lottery.contract.spec.js ~ line 70 ~ numberOfConfirmations',
      numberOfConfirmations,
    );

    assert.ok(numberOfConfirmations >= 12);
  }, 150000);
});
