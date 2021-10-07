const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const sleep = require('sleep-promise');

const { interface, bytecode } = require('./compile');

let accounts;
let contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 14 ~ beforeEach ~ accounts', accounts);

  contract = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode }).send({
    from: accounts[0],
    gas: '1000000',
    gasPrice: '500000',
  });
});

const sendTxToContract = async (account, amount) => {
  await contract.methods.enter().send({
    from: account,
    value: web3.utils.toWei(amount, 'ether'),
  });
};

const txSleepMs = 1000;

const sendBatchOfTx = async (account, amount, quantity) => {
  let sent = 1;

  while (sent <= quantity) {
    // console.log(`sending tx# ${sent}`);
    await sendTxToContract(account, amount);
    // console.log(`tx# ${sent} has been sent. waiting for ${txSleepMs} ms`);
    sent += 1;
  }

  return sent;
};

describe('Lottery Contract', () => {
  it('sends money to the winner and resets the players array', async () => {
    let numberOfConfirmations = 0;
    let txReceipt = {};
    let txHash = '';

    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    await contract.methods
      .pickWinner()
      .send({
        from: accounts[0],
      })
      .on('transactionHash', function (_hash) {
        // console.log('on transactionHash: ', _hash);
        txHash = _hash;
      })
      .on('confirmation', function (_confirmationNumber, _receipt) {
        // console.log('on confirmation: ', _confirmationNumber, _receipt);
        numberOfConfirmations += 1;
      })
      .on('receipt', function (_receipt) {
        // console.log('on receipt: ', _receipt);
        txReceipt = _receipt;
      });

    assert.ok(txHash !== '');
    assert.strictEqual(txReceipt.transactionHash, txHash);

    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const balanceDifference = balanceAfter - balanceBefore;

    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 102 ~ it ~ balanceBefore', balanceBefore);
    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 82 ~ it ~ balanceAfter', balanceAfter);
    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 123 ~ it ~ balanceDifference', balanceDifference);

    assert.ok(balanceDifference > web3.utils.toWei('1.99', 'ether'));

    await sendBatchOfTx(accounts[3], '0.02', 13);

    console.log('waiting for 2000 ms before final assettion');
    await sleep(2000);
    console.log(
      '🚀 ~ file: Lottery.contract.spec.js ~ line 70 ~ numberOfConfirmations',
      numberOfConfirmations,
    );
    assert.ok(numberOfConfirmations >= 12);
  }, 150000);
});
