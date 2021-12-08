"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var web3_1 = __importDefault(require("web3"));
var testHelpers_1 = require("../../testHelpers");
var compile_1 = require("./compile");
var envConfigFile = process.env.RPC_ENV_NAME
    ? "../../../../.env_rpc_" + process.env.RPC_ENV_NAME
    : "../../../../.env_example";
var envConfig = require(envConfigFile + ".json");
var extendedExecutionTimeout = 600000;
var rpcParams = envConfig.rpc;
var _a = rpcParams.rpcUrl, rpcUrl = _a === void 0 ? 'http://127.0.0.1:8545' : _a, mnemonic = rpcParams.mnemonic;
var contract;
var accounts;
var networkId;
(0, testHelpers_1.timeStart)();
var provider = new truffle_hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
var web3 = new web3_1.default(provider);
(0, testHelpers_1.timeLog)('Connecting to the server', rpcParams.rpcUrl);
afterAll(testHelpers_1.afterAllLog);
afterEach(testHelpers_1.afterEachLog);
describe("SkyMax Contract (contract test) \"" + rpcUrl + "\"", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.net.getId()];
                case 1:
                    networkId = _a.sent();
                    return [4 /*yield*/, web3.eth.getAccounts()];
                case 2:
                    accounts = _a.sent();
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, new web3.eth.Contract(JSON.parse(compile_1.contractInterface))
                            .deploy({ data: compile_1.contractBytecode, arguments: ['Hi there'] })
                            .send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 3:
                    contract = _a.sent();
                    (0, testHelpers_1.timeLog)('Contract deployment');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that the contract can be created', function () {
        (0, testHelpers_1.setCurrentTestName)('validates that the contract can be created');
        (0, testHelpers_1.timeStart)();
        assert_1.default.ok(contract.options.address);
        (0, testHelpers_1.timeLog)('Contract validation');
    }, extendedExecutionTimeout);
    it('validates that its initial value for some contract data can be set', function () { return __awaiter(void 0, void 0, void 0, function () {
        var message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that the contract can be created');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.message().call()];
                case 1:
                    message = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(message).toEqual('Hi there');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that its data can be updated', function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that its data can be updated');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.setMessage('New Message').send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 1:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.message().call()];
                case 2:
                    currentMessage = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(currentMessage).toEqual('New Message');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract balance can be updated', function () { return __awaiter(void 0, void 0, void 0, function () {
        var balanceContract, formattedContractBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract balance can be updated');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))];
                case 1:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, web3.eth.getBalance(contract.options.address)];
                case 2:
                    balanceContract = _a.sent();
                    (0, testHelpers_1.timeLog)('Get contract balance');
                    formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');
                    expect(formattedContractBalance).toEqual('0.1');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract can transfer balance to the address', function () { return __awaiter(void 0, void 0, void 0, function () {
        var balanceContract, formattedContractBalance, balanceBefore, balanceAfter, balanceDifference, expectedDiff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract can transfer balance to the address');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))];
                case 1:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, web3.eth.getBalance(contract.options.address)];
                case 2:
                    balanceContract = _a.sent();
                    (0, testHelpers_1.timeLog)('Get contract balance');
                    formattedContractBalance = web3.utils.fromWei(balanceContract, 'ether');
                    expect(formattedContractBalance).toEqual('0.1');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, web3.eth.getBalance(accounts[0])];
                case 3:
                    balanceBefore = _a.sent();
                    (0, testHelpers_1.timeLog)('Get account balance before sending money');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.pickWinner().send((0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId))];
                case 4:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, web3.eth.getBalance(accounts[0])];
                case 5:
                    balanceAfter = _a.sent();
                    (0, testHelpers_1.timeLog)('Get account balance after sending money');
                    balanceDifference = balanceAfter - balanceBefore;
                    expectedDiff = web3.utils.toWei('0.099', 'ether');
                    assert_1.default.ok(balanceDifference > parseInt(expectedDiff));
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract can maintain mappings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var balanceContract, balancFirstAccount, balanceSecondAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract can transfer balance to the address');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))];
                case 1:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }))];
                case 2:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, web3.eth.getBalance(contract.options.address)];
                case 3:
                    balanceContract = _a.sent();
                    (0, testHelpers_1.timeLog)('Get account balance before sending money');
                    expect(web3.utils.fromWei(balanceContract, 'ether')).toEqual('0.3');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.getContribution(accounts[0]).call()];
                case 4:
                    balancFirstAccount = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(web3.utils.fromWei(balancFirstAccount, 'ether')).toEqual('0.1');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.getContribution(accounts[1]).call()];
                case 5:
                    balanceSecondAccount = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(web3.utils.fromWei(balanceSecondAccount, 'ether')).toEqual('0.2');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract can validate required rules (i.e. minimum accepted value for the payable function)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract can validate required rules (i.e. minimum accepted value for the payable function)');
                    errorMessage = '';
                    (0, testHelpers_1.timeStart)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.methods.enter().send({
                            from: accounts[0],
                            value: 1,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx and catch an error');
                    errorMessage = err_1.message;
                    return [3 /*break*/, 4];
                case 4:
                    assert_1.default.ok(errorMessage);
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract can maintain arrays', function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstPlayer, secondPlayer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract can maintain arrays');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))];
                case 1:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.enter().send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }))];
                case 2:
                    _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.players(0).call()];
                case 3:
                    firstPlayer = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(firstPlayer).toEqual(accounts[0]);
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods.players(1).call()];
                case 4:
                    secondPlayer = _a.sent();
                    (0, testHelpers_1.timeLog)('Call contract method');
                    expect(secondPlayer).toEqual(accounts[1]);
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
    it('validates that contract can parse transaction event logs to verify outputs in the event, get and assert value for the key', function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstBlock, secondBlock, firstSentTxHash, secondSentTxHash, eventsError, contractEvents, firstLogItem, secondLogItem, firstTxHash, _a, firstTxFrom, firstTxQuantity, secondTxHash, _b, secondTxFrom, secondTxQuantity;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testHelpers_1.setCurrentTestName)('validates that contract can parse transaction event logs to verify outputs in the event, get and assert value for the key');
                    firstBlock = 0;
                    secondBlock = 0;
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods
                            .enter()
                            .send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[0], networkId)), { value: web3.utils.toWei('0.1', 'ether') }))
                            .on('receipt', function (_receipt) {
                            var blockNumber = _receipt.blockNumber, transactionHash = _receipt.transactionHash;
                            firstBlock = blockNumber;
                            firstSentTxHash = transactionHash;
                        })];
                case 1:
                    _c.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.methods
                            .enter()
                            .send(__assign(__assign({}, (0, testHelpers_1.getPayloadWithGas)(accounts[1], networkId)), { value: web3.utils.toWei('0.2', 'ether') }))
                            .on('receipt', function (_receipt) {
                            var blockNumber = _receipt.blockNumber, transactionHash = _receipt.transactionHash;
                            secondBlock = blockNumber;
                            secondSentTxHash = transactionHash;
                        })];
                case 2:
                    _c.sent();
                    (0, testHelpers_1.timeLog)('Call contract method with send a tx');
                    (0, testHelpers_1.timeStart)();
                    return [4 /*yield*/, contract.getPastEvents('Transferred', {
                            fromBlock: firstBlock,
                            toBlock: secondBlock,
                        }, function (_error) {
                            if (_error) {
                                eventsError = _error;
                                (0, testHelpers_1.timeLog)('Get contract events with error', _error);
                            }
                        })];
                case 3:
                    contractEvents = _c.sent();
                    if (!eventsError) {
                        (0, testHelpers_1.timeLog)('Get contract events');
                    }
                    expect(contractEvents.length).toEqual(2);
                    firstLogItem = contractEvents[0], secondLogItem = contractEvents[1];
                    firstTxHash = firstLogItem.transactionHash, _a = firstLogItem.returnValues, firstTxFrom = _a.from, firstTxQuantity = _a.quantity;
                    expect(firstTxHash).toEqual(firstSentTxHash);
                    expect(firstTxFrom).toEqual(accounts[0]);
                    expect(web3.utils.fromWei(firstTxQuantity, 'ether')).toEqual('0.1');
                    secondTxHash = secondLogItem.transactionHash, _b = secondLogItem.returnValues, secondTxFrom = _b.from, secondTxQuantity = _b.quantity;
                    expect(secondTxHash).toEqual(secondSentTxHash);
                    expect(secondTxFrom).toEqual(accounts[1]);
                    expect(web3.utils.fromWei(secondTxQuantity, 'ether')).toEqual('0.2');
                    return [2 /*return*/];
            }
        });
    }); }, extendedExecutionTimeout);
});
//# sourceMappingURL=SkyMax.contract.spec.js.map