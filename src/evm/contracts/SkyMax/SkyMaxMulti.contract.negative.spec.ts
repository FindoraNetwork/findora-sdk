import assert from 'assert';
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

const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;

const extendedExecutionTimeout = 600000;

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

describe(`SkyMaxMulti Contract (contract test negative) "${rpcUrl}"`, () => {
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
    'validates that contract does not crashes and returns an error if method is called with invalid type of a parameter',
    async () => {
      setCurrentTestName(
        'validates that contract does not crashes and returns an error if method is called with invalid type of a parameter',
      );

      let errorMessage = '';

      timeStart();

      try {
        await contractExisting.methods.enter_Signature().send({
          ...getPayloadWithGas(accounts[0], networkId),
          value: 'aaaaaa',
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
    'validates that contract does not crashes and returns an error if method is called with invalid number of parameters',
    async () => {
      setCurrentTestName(
        'validates that contract does not crashes and returns an error if method is called with invalid number of parameters',
      );
      let errorMessage = '';

      timeStart();

      try {
        await contractExisting.methods.setA_Signature().send(getPayloadWithGas(accounts[0], networkId));
      } catch (err) {
        timeLog('Call contract method with send a tx and catch an error');

        errorMessage = (err as Error).message;
      }
      assert.ok(errorMessage);
    },
    extendedExecutionTimeout,
  );

  it(
    'validates that contract it does not do any operations which must not be done when transaction is reverted',
    async () => {
      setCurrentTestName(
        'validates that contract it does not do any operations which must not be done when transaction is reverted',
      );
      let errorMessage = '';

      timeStart();

      try {
        await contractExisting.methods.setA_Signature().send(getPayloadWithGas(accounts[0], networkId));
      } catch (err) {
        timeLog('Call contract method with send a tx and catch an error');

        errorMessage = (err as Error).message;
      }
      assert.ok(errorMessage);

      const currentMessage = await contractDeployed.methods.a().call();
      expect(currentMessage).toEqual('123');
    },
    extendedExecutionTimeout,
  );
});
