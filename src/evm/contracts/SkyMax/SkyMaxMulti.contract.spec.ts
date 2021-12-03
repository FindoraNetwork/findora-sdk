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
import {
  contractBytecode as contractBytecodeDeployed,
  contractInterface as contractInterfaceDeployed,
} from './compileDeployed';
import {
  contractBytecode as contractBytecodeExisting,
  contractInterface as contractInterfaceExisting,
} from './compileExisting';

const envConfigFile = process.env.RPC_ENV_NAME
  ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
  : `../../../../.env_example`;

const envConfig = require(`${envConfigFile}.json`);

const extendedExecutionTimeout = 600000;

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

let contractDeployed: any;
let contractExisting: any;
let accounts: string[];
let networkId: number;

timeStart();
const provider = new HDWalletProvider(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new Web3(provider);
timeLog('Connecting to the server', rpcParams.rpcUrl);

afterAll(afterAllLog);
afterEach(afterEachLog);

describe(`SkyMaxMulti Contract (contract test) "${rpcUrl}"`, () => {
  beforeEach(async () => {
    setCurrentTestName('');

    networkId = await web3.eth.net.getId();
    accounts = await web3.eth.getAccounts();

    timeStart();
    contractDeployed = await new web3.eth.Contract(JSON.parse(contractInterfaceDeployed))
      .deploy({ data: contractBytecodeDeployed, arguments: [123] })
      .send(getPayloadWithGas(accounts[0], networkId));
    timeLog('Contract deployment');

    timeStart();
    contractExisting = await new web3.eth.Contract(JSON.parse(contractInterfaceExisting))
      .deploy({ data: contractBytecodeExisting, arguments: [contractDeployed.options.address] })
      .send(getPayloadWithGas(accounts[0], networkId));
    timeLog('Contract deployment');
  }, extendedExecutionTimeout);

  it(
    'validates that the contract can be created',
    () => {
      setCurrentTestName('validates that the contract can be created');
      timeStart();
      assert.ok(contractDeployed.options.address);
      assert.ok(contractExisting.options.address);
      timeLog('Contracts creation validation');
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that internal contract data can be updated by another contract',
    async () => {
      setCurrentTestName('validates that internal contract data can be updated by another contract');

      timeStart();
      await contractExisting.methods.setA_Signature(456).send({
        ...getPayloadWithGas(accounts[0], networkId),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      const messageNum = await contractDeployed.methods.a().call();
      timeLog('Call contract method');

      expect(messageNum).toEqual(`456`);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract balance can be updated by the call from another contract',
    async () => {
      setCurrentTestName('validates that contract balance can be updated by the call from another contract');

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[0], networkId),
        value: web3.utils.toWei('0.1', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);
      timeLog('Get contract balance');

      const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

      expect(formattedContractBalance).toEqual('0.1');
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract can transfer balance to the address, which is added from another contract',
    async () => {
      setCurrentTestName(
        'validates that contract can transfer balance to the address, which is added from another contract',
      );

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[0], networkId),
        value: web3.utils.toWei('0.1', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);
      timeLog('Get contract balance');

      const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');

      expect(formattedContractBalance).toEqual('0.1');

      timeStart();
      const balanceBefore = await web3.eth.getBalance(accounts[0]);
      timeLog('Get account balance before sending money');

      timeStart();
      await contractDeployed.methods.pickWinner().send(getPayloadWithGas(accounts[0], networkId));
      timeLog('Call contract method with send a tx');

      timeStart();
      const balanceAfter = await web3.eth.getBalance(accounts[0]);
      timeLog('Get account balance after sending money');

      const balanceDifference = (balanceAfter as unknown as number) - (balanceBefore as unknown as number);

      const expectedDiff = web3.utils.toWei('0.099', 'ether');

      assert.ok(balanceDifference > parseInt(expectedDiff));
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract can maintain mappings coming from another contract',
    async () => {
      setCurrentTestName('validates that contract can maintain mappings coming from another contract');

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[0], networkId),
        value: web3.utils.toWei('0.1', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[1], networkId),
        value: web3.utils.toWei('0.2', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      const balanceContract = await web3.eth.getBalance(contractDeployed.options.address);
      timeLog('Get account balance before sending money');

      expect(web3.utils.fromWei(balanceContract, 'ether')).toEqual('0.3');

      timeStart();
      const balancFirstAccount = await contractDeployed.methods.getContribution(accounts[0]).call();
      timeLog('Call contract method');

      expect(web3.utils.fromWei(balancFirstAccount, 'ether')).toEqual('0.1');

      timeStart();
      const balanceSecondAccount = await contractDeployed.methods.getContribution(accounts[1]).call();
      timeLog('Call contract method');

      expect(web3.utils.fromWei(balanceSecondAccount, 'ether')).toEqual('0.2');
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract can validate required rules (i.e. minimum accepted value for the payable function) when it is called from another contract',
    async () => {
      setCurrentTestName(
        'validates that contract can validate required rules (i.e. minimum accepted value for the payable function) when it is called from another contract',
      );

      let errorMessage = '';

      timeStart();

      try {
        await contractExisting.methods.enter_Signature().send({
          from: accounts[0],
          value: 1,
        });
      } catch (err) {
        timeLog('Call contract method with send a tx and catch an error');

        errorMessage = (err as Error).message;
      }
      assert.ok(errorMessage);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract can maintain arrays created by another contract',
    async () => {
      setCurrentTestName('validates that contract can maintain arrays created by another contract');

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[0], networkId),
        value: web3.utils.toWei('0.1', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      await contractExisting.methods.enter_Signature().send({
        ...getPayloadWithGas(accounts[1], networkId),
        value: web3.utils.toWei('0.2', 'ether'),
      });
      timeLog('Call contract method with send a tx');

      timeStart();
      const firstPlayer = await contractDeployed.methods.players(0).call();
      timeLog('Call contract method');

      expect(firstPlayer).toEqual(accounts[0]);

      timeStart();
      const secondPlayer = await contractDeployed.methods.players(1).call();
      timeLog('Call contract method');

      expect(secondPlayer).toEqual(accounts[1]);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract can parse transaction event logs to verify outputs in the event, created by a trigger from another contract, get and assert value for the key',
    async () => {
      setCurrentTestName(
        'validates that contract can parse transaction event logs to verify outputs in the event, created by a trigger from another contract, get and assert value for the key',
      );

      let firstBlock = 0;
      let secondBlock = 0;
      let firstSentTxHash;
      let secondSentTxHash;

      timeStart();
      await contractExisting.methods
        .enter_Signature()
        .send({
          ...getPayloadWithGas(accounts[0], networkId),
          value: web3.utils.toWei('0.1', 'ether'),
        })
        .on('receipt', function (_receipt: any) {
          const { blockNumber, transactionHash } = _receipt;
          firstBlock = blockNumber;
          firstSentTxHash = transactionHash;
        });
      timeLog('Call contract method with send a tx');

      timeStart();
      await contractExisting.methods
        .enter_Signature()
        .send({
          ...getPayloadWithGas(accounts[1], networkId),
          value: web3.utils.toWei('0.2', 'ether'),
        })
        .on('receipt', function (_receipt: any) {
          const { blockNumber, transactionHash } = _receipt;
          secondBlock = blockNumber;
          secondSentTxHash = transactionHash;
        });
      timeLog('Call contract method with send a tx');

      let eventsError;

      timeStart();
      const contractEvents = await contractDeployed.getPastEvents(
        'Transferred',
        {
          fromBlock: firstBlock,
          toBlock: secondBlock,
        },
        (_error: Error) => {
          if (_error) {
            timeLog('Get contract events with error', _error);
            eventsError = _error;
          }
        },
      );

      if (!eventsError) {
        timeLog('Get contract events');
      }

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
    },
    extendedExecutionTimeout,
  );
});
