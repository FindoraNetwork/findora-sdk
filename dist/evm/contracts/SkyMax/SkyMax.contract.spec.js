"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const testHelpers_1 = require("../../testHelpers");
const compile_1 = require("./compile");
const envConfigFile = process.env.RPC_ENV_NAME
    ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
    : `../../../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const extendedExecutionTimeout = 600000;
const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;
let contract;
let accounts;
let networkId;
(0, testHelpers_1.timeStart)();
const provider = new hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
describe(`SkyMax Contract (contract test) "${rpcUrl}"`, () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        networkId = yield web3.eth.net.getId();
        accounts = yield web3.eth.getAccounts();
        (0, testHelpers_1.timeStart)();
        contract = yield new web3.eth.Contract(JSON.parse(compile_1.contractInterface))
            .deploy({ data: compile_1.contractBytecode, arguments: ['Hi there'] })
            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Contract deployment');
    }), extendedExecutionTimeout);
    it('validates that the contract can be created', () => {
        (0, testHelpers_1.setCurrentTestName)('validates that the contract can be created');
        (0, testHelpers_1.timeStart)();
        assert_1.default.ok(contract.options.address);
        (0, testHelpers_1.timeLog)('Contract validation');
    }, extendedExecutionTimeout);
    it('validates that its initial value for some contract data can be set', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that the contract can be created');
        (0, testHelpers_1.timeStart)();
        const message = yield contract.methods.message().call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(message).toEqual('Hi there');
    }), extendedExecutionTimeout);
    it('validates that its data can be updated', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that its data can be updated');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.setMessage('New Message').send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const currentMessage = yield contract.methods.message().call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(currentMessage).toEqual('New Message');
    }), extendedExecutionTimeout);
    it('validates that contract balance can be updated', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract balance can be updated');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const balanceContract = yield web3.eth.getBalance(contract.options.address);
        (0, testHelpers_1.timeLog)('Get contract balance');
        const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');
        expect(formattedContractBalance).toEqual('0.1');
    }), extendedExecutionTimeout);
    it('validates that contract can transfer balance to the address', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract can transfer balance to the address');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const balanceContract = yield web3.eth.getBalance(contract.options.address);
        (0, testHelpers_1.timeLog)('Get contract balance');
        const formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');
        expect(formattedContractBalance).toEqual('0.1');
        (0, testHelpers_1.timeStart)();
        const balanceBefore = yield web3.eth.getBalance(accounts[0]);
        (0, testHelpers_1.timeLog)('Get account balance before sending money');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.pickWinner().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const balanceAfter = yield web3.eth.getBalance(accounts[0]);
        (0, testHelpers_1.timeLog)('Get account balance after sending money');
        const balanceDifference = balanceAfter - balanceBefore;
        const expectedDiff = web3.utils.toWei('0.099', 'ether');
        assert_1.default.ok(balanceDifference > parseInt(expectedDiff));
    }), extendedExecutionTimeout);
    it('validates that contract can maintain mappings', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract can transfer balance to the address');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const balanceContract = yield web3.eth.getBalance(contract.options.address);
        (0, testHelpers_1.timeLog)('Get account balance before sending money');
        expect(web3.utils.fromWei(balanceContract, 'ether')).toEqual('0.3');
        (0, testHelpers_1.timeStart)();
        const balancFirstAccount = yield contract.methods.getContribution(accounts[0]).call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(web3.utils.fromWei(balancFirstAccount, 'ether')).toEqual('0.1');
        (0, testHelpers_1.timeStart)();
        const balanceSecondAccount = yield contract.methods.getContribution(accounts[1]).call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(web3.utils.fromWei(balanceSecondAccount, 'ether')).toEqual('0.2');
    }), extendedExecutionTimeout);
    it('validates that contract can validate required rules (i.e. minimum accepted value for the payable function)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract can validate required rules (i.e. minimum accepted value for the payable function)');
        let errorMessage = '';
        (0, testHelpers_1.timeStart)();
        try {
            yield contract.methods.enter().send({
                from: accounts[0],
                value: 1,
            });
        }
        catch (err) {
            (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
            errorMessage = err.message;
        }
        assert_1.default.ok(errorMessage);
    }), extendedExecutionTimeout);
    it('validates that contract can maintain arrays', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract can maintain arrays');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const firstPlayer = yield contract.methods.players(0).call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(firstPlayer).toEqual(accounts[0]);
        (0, testHelpers_1.timeStart)();
        const secondPlayer = yield contract.methods.players(1).call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(secondPlayer).toEqual(accounts[1]);
    }), extendedExecutionTimeout);
    it('validates that contract can parse transaction event logs to verify outputs in the event, get and assert value for the key', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract can parse transaction event logs to verify outputs in the event, get and assert value for the key');
        let firstBlock = 0;
        let secondBlock = 0;
        let firstSentTxHash;
        let secondSentTxHash;
        (0, testHelpers_1.timeStart)();
        yield contract.methods
            .enter()
            .send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))
            .on('receipt', function (_receipt) {
            const { blockNumber, transactionHash } = _receipt;
            firstBlock = blockNumber;
            firstSentTxHash = transactionHash;
        });
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        yield contract.methods
            .enter()
            .send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }))
            .on('receipt', function (_receipt) {
            const { blockNumber, transactionHash } = _receipt;
            secondBlock = blockNumber;
            secondSentTxHash = transactionHash;
        });
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        let eventsError;
        (0, testHelpers_1.timeStart)();
        const contractEvents = yield contract.getPastEvents('Transferred', {
            fromBlock: firstBlock,
            toBlock: secondBlock,
        }, (_error) => {
            if (_error) {
                eventsError = _error;
                (0, testHelpers_1.timeLog)('Get contract events with error', _error);
            }
        });
        if (!eventsError) {
            (0, testHelpers_1.timeLog)('Get contract events');
        }
        expect(contractEvents.length).toEqual(2);
        const [firstLogItem, secondLogItem] = contractEvents;
        const { transactionHash: firstTxHash, returnValues: { from: firstTxFrom, quantity: firstTxQuantity }, } = firstLogItem;
        expect(firstTxHash).toEqual(firstSentTxHash);
        expect(firstTxFrom).toEqual(accounts[0]);
        expect(web3.utils.fromWei(firstTxQuantity, 'ether')).toEqual('0.1');
        const { transactionHash: secondTxHash, returnValues: { from: secondTxFrom, quantity: secondTxQuantity }, } = secondLogItem;
        expect(secondTxHash).toEqual(secondSentTxHash);
        expect(secondTxFrom).toEqual(accounts[1]);
        expect(web3.utils.fromWei(secondTxQuantity, 'ether')).toEqual('0.2');
    }), extendedExecutionTimeout);
});
//# sourceMappingURL=SkyMax.contract.spec.js.map