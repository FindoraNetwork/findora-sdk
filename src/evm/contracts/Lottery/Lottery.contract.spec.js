const assert = require('assert');
// const ganache = require('ganache-cli');
const Web3 = require('web3');
const sleep = require('sleep-promise');
const Network = require('../../../api/network/network');

const HDWalletProvider = require('truffle-hdwallet-provider');

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../env_example`;

const envConfig = require(`${envConfigFile}.json`);

// const extendedExecutionTimeout = 40000;

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', ethAccountToCheck, mnemonic } = rpcParams;

const provider = new HDWalletProvider(mnemonic, rpcUrl);

const { interface, bytecode } = require('./compile');

// const web3 = new Web3(ganache.provider());
const web3 = new Web3(provider);

let accounts;
let contract;

beforeEach(async () => {
  const payload = {
    id: 1,
    method: 'eth_accounts',
  };

  const result = await Network.sendRpcCall(rpcUrl, payload);

  accounts = result.response.result;

  console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 14 ~ beforeEach ~ accounts', accounts);

  contract = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode }).send({
    from: accounts[0],
    gas: '1000000',
    gasPrice: '500000',
  });
});

// const sendTxToContract = async (localWeb3, account, amount) => {
//   await contract.methods.enter().send({
//     from: account,
//     gas: '1000000',
//     gasPrice: '500000',
//     value: web3.utils.toWei(amount, 'ether'),
//   });
// };

// // const txSleepMs = 1000;

// const sendBatchOfTx = async (accountIndex, amount, quantity) => {
//   const localProvider = new HDWalletProvider(mnemonic, rpcUrl, accountIndex);

//   const localWeb3 = new Web3(localProvider);

//   let sent = 1;

//   while (sent <= quantity) {
//     // console.log(`sending tx# ${sent}`);
//     await sendTxToContract(localWeb3, account, amount);
//     // console.log(`tx# ${sent} has been sent. waiting for ${txSleepMs} ms`);
//     sent += 1;
//   }

//   return sent;
// };

describe('Lottery Contract', () => {
  it('sends money to the winner and resets the players array', async () => {
    let numberOfConfirmations = 0;
    let txReceipt = {};
    let txHash = '';

    await contract.methods.enter().send({
      from: accounts[0],
      gas: '1000000',
      gasPrice: '500000',
      value: web3.utils.toWei('0.1', 'ether'),
    });

    const balanceContract = await web3.eth.getBalance(contract.options.address);

    const balanceBefore = await web3.eth.getBalance(accounts[0]);

    await contract.methods
      .pickWinner()
      .send({
        gas: '1000000',
        gasPrice: '500000',
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

    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 92 ~ it ~ balanceBefore', balanceBefore);

    assert.ok(txHash !== '');
    assert.strictEqual(txReceipt.transactionHash, txHash);

    const balanceAfter = await web3.eth.getBalance(accounts[0]);
    const balanceDifference = balanceAfter - balanceBefore;

    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 88 ~ it ~ balanceContract', balanceContract);
    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 102 ~ it ~ balanceBefore', balanceBefore);
    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 82 ~ it ~ balanceAfter', balanceAfter);
    console.log('🚀 ~ file: Lottery.contract.spec.js ~ line 123 ~ it ~ balanceDifference', balanceDifference);

    assert.ok(accounts.length > 0);
    assert.ok(balanceDifference > web3.utils.toWei('0.0999', 'ether'));

    // const accountIndex = 3;

    // await sendBatchOfTx(accountIndex, '0.02', 13);

    console.log('waiting for 2000 ms before final assettion');

    await sleep(2000);

    console.log(
      '🚀 ~ file: Lottery.contract.spec.js ~ line 70 ~ numberOfConfirmations',
      numberOfConfirmations,
    );

    assert.ok(numberOfConfirmations >= 12);
  }, 150000);
});
