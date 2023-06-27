import assert from 'assert';
import sleep from 'sleep-promise';
import HDWalletProvider from '@truffle/hdwallet-provider';
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

let contract: any;
let accounts: string[];
let networkId: number;

timeStart();
const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new Web3(provider);
timeLog('Connecting to the server', rpcParams.rpcUrl);

afterAll(afterAllLog);
afterEach(afterEachLog);

const sendTxToAccount = async (senderAccount: string, receiverAccount: string, amountToSend: string) => {
  const value = web3.utils.toWei(amountToSend, 'ether');

  const transactionObject = {
    ...getPayloadWithGas(senderAccount, networkId),
    to: receiverAccount,
    value,
  };

  timeStart();
  await web3.eth
    .sendTransaction(transactionObject)
    .on('error', async _error => {
      timeLog('Once error', _error);
    })
    .then(function (_receipt) {
      timeLog('Once the receipt is mined');
    });
};

const sendBatchOfTx = async (
  senderAccount: string,
  receiverAccount: string,
  amountToSend: string,
  txQuantity: number,
) => {
  let sent = 1;

  while (sent <= txQuantity) {
    await sendTxToAccount(senderAccount, receiverAccount, amountToSend);
    sent += 1;
    await sleep(1000);
  }

  return sent;
};

describe(`Send a transaction and check the balances and confirmations "${rpcUrl}"`, () => {
  beforeEach(async () => {
    setCurrentTestName('');

    accounts = await web3.eth.getAccounts();
    networkId = await web3.eth.net.getId();

    timeStart();
    contract = await new web3.eth.Contract(JSON.parse(contractInterface))
      .deploy({ data: contractBytecode })
      .send(getPayloadWithGas(accounts[0], networkId));
    timeLog('Contract deployment');
  }, extendedExecutionTimeout);

  it(
    'sends money to the contract and receives it back, verifies the sender balance and confirmations',
    async () => {
      setCurrentTestName(
        'sends money to the contract and receives it back, verifies the sender balance and confirmations',
      );

      let numberOfConfirmations = 0;
      let txReceipt: { transactionHash?: string } = {};
      let txHash = '';

      timeStart();
      await contract.methods.enter().send({
        ...getPayloadWithGas(accounts[0], networkId),
        value: web3.utils.toWei('0.1', 'ether'),
      });
      timeLog('Send money to the contract');

      timeStart();
      const balanceContract = await web3.eth.getBalance(contract.options.address);
      timeLog('Get contract balance');

      assert.ok(parseInt(balanceContract) > 0);

      timeStart();
      const balanceBefore = await web3.eth.getBalance(accounts[0]);
      timeLog('Get account balance before receiving money from the contract');

      timeStart();
      await contract.methods
        .pickWinner()
        .send(getPayloadWithGas(accounts[0], networkId))
        .on('transactionHash', function (_hash: string) {
          txHash = _hash;
        })
        .on('confirmation', function (_confirmationNumber: string, _receipt: any) {
          numberOfConfirmations += 1;
        })
        .on('receipt', function (_receipt: any) {
          txReceipt = _receipt;
        });
      timeLog('Call contract method with sending a tx');

      assert.ok(txHash !== '');
      assert.strictEqual(txReceipt.transactionHash, txHash);

      timeStart();
      const balanceAfter = await web3.eth.getBalance(accounts[0]);
      timeLog('Get account balance after receiving money from the contract');

      const balanceDifference = (balanceAfter as unknown as number) - (balanceBefore as unknown as number);

      assert.ok(accounts.length > 0);

      const expectedDiff = web3.utils.toWei('0.099', 'ether');

      assert.ok(balanceDifference > parseInt(expectedDiff));

      const fromAddress = accounts[3];
      const toAddress = accounts[2];

      timeStart();
      await sendBatchOfTx(fromAddress, toAddress, '0.02', 13);
      timeLog('Send a batch of transactions to an address');

      await sleep(2000);

      assert.ok(numberOfConfirmations >= 12);
    },
    extendedExecutionTimeout,
  );
});
