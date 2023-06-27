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
const sleep_promise_1 = __importDefault(require("sleep-promise"));
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const testHelpers_1 = require("../../testHelpers");
const compile_1 = require("./compile");
const envConfigFile = process.env.RPC_ENV_NAME
    ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
    : `../../../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;
const extendedExecutionTimeout = 600000;
let contract;
let accounts;
let networkId;
(0, testHelpers_1.timeStart)();
const provider = new hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
const sendTxToAccount = (senderAccount, receiverAccount, amountToSend) => __awaiter(void 0, void 0, void 0, function* () {
    const value = web3.utils.toWei(amountToSend, 'ether');
    const transactionObject = Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(senderAccount, networkId)), { to: receiverAccount, value });
    (0, testHelpers_1.timeStart)();
    yield web3.eth
        .sendTransaction(transactionObject)
        .on('error', (_error) => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.timeLog)('Once error', _error);
    }))
        .then(function (_receipt) {
        (0, testHelpers_1.timeLog)('Once the receipt is mined');
    });
});
const sendBatchOfTx = (senderAccount, receiverAccount, amountToSend, txQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    let sent = 1;
    while (sent <= txQuantity) {
        yield sendTxToAccount(senderAccount, receiverAccount, amountToSend);
        sent += 1;
        yield (0, sleep_promise_1.default)(1000);
    }
    return sent;
});
describe(`Send a transaction and check the balances and confirmations "${rpcUrl}"`, () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('');
        accounts = yield web3.eth.getAccounts();
        networkId = yield web3.eth.net.getId();
        (0, testHelpers_1.timeStart)();
        contract = yield new web3.eth.Contract(JSON.parse(compile_1.contractInterface))
            .deploy({ data: compile_1.contractBytecode })
            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Contract deployment');
    }), extendedExecutionTimeout);
    it('sends money to the contract and receives it back, verifies the sender balance and confirmations', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('sends money to the contract and receives it back, verifies the sender balance and confirmations');
        let numberOfConfirmations = 0;
        let txReceipt = {};
        let txHash = '';
        (0, testHelpers_1.timeStart)();
        yield contract.methods.enter().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }));
        (0, testHelpers_1.timeLog)('Send money to the contract');
        (0, testHelpers_1.timeStart)();
        const balanceContract = yield web3.eth.getBalance(contract.options.address);
        (0, testHelpers_1.timeLog)('Get contract balance');
        assert_1.default.ok(parseInt(balanceContract) > 0);
        (0, testHelpers_1.timeStart)();
        const balanceBefore = yield web3.eth.getBalance(accounts[0]);
        (0, testHelpers_1.timeLog)('Get account balance before receiving money from the contract');
        (0, testHelpers_1.timeStart)();
        yield contract.methods
            .pickWinner()
            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))
            .on('transactionHash', function (_hash) {
            txHash = _hash;
        })
            .on('confirmation', function (_confirmationNumber, _receipt) {
            numberOfConfirmations += 1;
        })
            .on('receipt', function (_receipt) {
            txReceipt = _receipt;
        });
        (0, testHelpers_1.timeLog)('Call contract method with sending a tx');
        assert_1.default.ok(txHash !== '');
        assert_1.default.strictEqual(txReceipt.transactionHash, txHash);
        (0, testHelpers_1.timeStart)();
        const balanceAfter = yield web3.eth.getBalance(accounts[0]);
        (0, testHelpers_1.timeLog)('Get account balance after receiving money from the contract');
        const balanceDifference = balanceAfter - balanceBefore;
        assert_1.default.ok(accounts.length > 0);
        const expectedDiff = web3.utils.toWei('0.099', 'ether');
        assert_1.default.ok(balanceDifference > parseInt(expectedDiff));
        const fromAddress = accounts[3];
        const toAddress = accounts[2];
        (0, testHelpers_1.timeStart)();
        yield sendBatchOfTx(fromAddress, toAddress, '0.02', 13);
        (0, testHelpers_1.timeLog)('Send a batch of transactions to an address');
        yield (0, sleep_promise_1.default)(2000);
        assert_1.default.ok(numberOfConfirmations >= 12);
    }), extendedExecutionTimeout);
});
//# sourceMappingURL=Lottery.contract.spec.js.map