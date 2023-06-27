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
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, testHelpers_1.setCurrentTestName)('');
    networkId = yield web3.eth.net.getId();
    accounts = yield web3.eth.getAccounts();
    (0, testHelpers_1.timeStart)();
    contract = yield new web3.eth.Contract(JSON.parse(compile_1.contractInterface))
        .deploy({
        data: compile_1.contractBytecode,
        arguments: ['Hi there'],
    })
        .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
    (0, testHelpers_1.timeLog)('Contract deployment');
}), extendedExecutionTimeout);
describe(`Inbox (contract test) "${rpcUrl}"`, () => {
    it('deploys a contract successfully', () => {
        (0, testHelpers_1.setCurrentTestName)('deploys a contract successfully');
        (0, testHelpers_1.timeStart)();
        assert_1.default.ok(contract.options.address);
        (0, testHelpers_1.timeLog)('Contract validation');
    }, extendedExecutionTimeout);
    it('deploys a contract with a default assigned message', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('deploys a contract with a default assigned message');
        (0, testHelpers_1.timeStart)();
        const message = yield contract.methods.message().call();
        (0, testHelpers_1.timeLog)('Call contract method');
        expect(message).toEqual('Hi there');
    }), extendedExecutionTimeout);
    it('updates a message with a given value', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('updates a message with a given value');
        (0, testHelpers_1.timeStart)();
        yield contract.methods.setMessage('New Message').send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Call contract method with send a tx');
        (0, testHelpers_1.timeStart)();
        const currentMessage = yield contract.methods.message().call();
        (0, testHelpers_1.timeLog)(`Call contract method`);
        expect(currentMessage).toEqual('New Message');
    }), extendedExecutionTimeout);
});
//# sourceMappingURL=Inbox.contract.spec.js.map