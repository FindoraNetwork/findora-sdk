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
const compileDeployed_1 = require("./compileDeployed");
const compileExisting_1 = require("./compileExisting");
const envConfigFile = process.env.RPC_ENV_NAME
    ? `../../../../.env_rpc_${process.env.RPC_ENV_NAME}`
    : `../../../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { rpc: rpcParams } = envConfig;
const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;
const extendedExecutionTimeout = 600000;
let contractDeployed;
let contractExisting;
let accounts;
let networkId;
(0, testHelpers_1.timeStart)();
const provider = new hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
const web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
describe(`SkyMaxMulti Contract (contract test negative) "${rpcUrl}"`, () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('');
        networkId = yield web3.eth.net.getId();
        accounts = yield web3.eth.getAccounts();
        (0, testHelpers_1.timeStart)();
        contractDeployed = yield new web3.eth.Contract(JSON.parse(compileDeployed_1.contractInterface))
            .deploy({ data: compileDeployed_1.contractBytecode, arguments: [123] })
            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Contract deployment');
        (0, testHelpers_1.timeStart)();
        contractExisting = yield new web3.eth.Contract(JSON.parse(compileExisting_1.contractInterface))
            .deploy({ data: compileExisting_1.contractBytecode, arguments: [contractDeployed.options.address] })
            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        (0, testHelpers_1.timeLog)('Contract deployment');
    }), extendedExecutionTimeout);
    it('validates that contract does not crashes and returns an error if method is called with invalid type of a parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract does not crashes and returns an error if method is called with invalid type of a parameter');
        let errorMessage = '';
        (0, testHelpers_1.timeStart)();
        try {
            yield contractExisting.methods.enter_Signature().send(Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: 'aaaaaa' }));
        }
        catch (err) {
            (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
            errorMessage = err.message;
        }
        assert_1.default.ok(errorMessage);
    }), extendedExecutionTimeout);
    it('validates that contract does not crashes and returns an error if method is called with invalid number of parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract does not crashes and returns an error if method is called with invalid number of parameters');
        let errorMessage = '';
        (0, testHelpers_1.timeStart)();
        try {
            yield contractExisting.methods.setA_Signature().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        }
        catch (err) {
            (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
            errorMessage = err.message;
        }
        assert_1.default.ok(errorMessage);
    }), extendedExecutionTimeout);
    it('validates that contract it does not do any operations which must not be done when transaction is reverted', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.setCurrentTestName)('validates that contract it does not do any operations which must not be done when transaction is reverted');
        let errorMessage = '';
        (0, testHelpers_1.timeStart)();
        try {
            yield contractExisting.methods.setA_Signature().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId));
        }
        catch (err) {
            (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
            errorMessage = err.message;
        }
        assert_1.default.ok(errorMessage);
        const currentMessage = yield contractDeployed.methods.a().call();
        expect(currentMessage).toEqual('123');
    }), extendedExecutionTimeout);
});
//# sourceMappingURL=SkyMaxMulti.contract.negative.spec.js.map