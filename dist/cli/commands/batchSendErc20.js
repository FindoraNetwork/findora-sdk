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
exports.runBatchSendERC20 = void 0;
const neat_csv_1 = __importDefault(require("neat-csv"));
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const web3_1 = __importDefault(require("web3"));
const testHelpers_1 = require("../../evm/testHelpers");
const utils_1 = require("../../services/utils");
let networkId;
let accounts;
const isCsvValid = (parsedListOfRecievers) => {
    for (let i = 0; i < parsedListOfRecievers.length; i += 1) {
        const currentReciever = parsedListOfRecievers[i];
        const isAddressPresented = Object.keys(currentReciever).includes('tokenReceiveAddress');
        const isAmountPresented = Object.keys(currentReciever).includes('tokenAllocated');
        if (!isAddressPresented || !isAmountPresented) {
            throw Error(`ERROR - The data row must have both "tokenReceiveAddress" and "tokenAllocated" fields ${JSON.stringify(currentReciever)} `);
        }
    }
    return true;
};
const getRecieversList = (parsedListOfRecievers) => {
    const receiversList = parsedListOfRecievers.map(currentReciever => {
        const { tokenAllocated, tokenReceiveAddress } = currentReciever;
        return {
            address: tokenReceiveAddress,
            numbers: parseFloat(tokenAllocated.replace(',', '')),
        };
    });
    return receiversList;
};
const writeDistributionLog = (sendInfo, errorsInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const dateStamp = (0, utils_1.now)();
    const resultFilePath = `batchSendLog_${dateStamp}.txt`;
    try {
        yield (0, utils_1.writeFile)(resultFilePath, JSON.stringify({
            date: dateStamp,
            distributionType: 'ERC20',
            sendInfo,
            errorsInfo,
        }, null, 2));
    }
    catch (error) {
        throw new Error(`can not write result log for "${resultFilePath}", "${error.message}"`);
    }
});
const sendTxToAccount = (senderAccount, receiverAccount, amountToSend, web3) => __awaiter(void 0, void 0, void 0, function* () {
    const value = web3.utils.toWei(amountToSend, 'ether');
    const transactionObject = Object.assign(Object.assign({}, (0, testHelpers_1.getPayloadWithGas)(senderAccount, networkId)), { to: receiverAccount, value });
    let txReceipt = {};
    let txHash = '';
    yield web3.eth
        .sendTransaction(transactionObject)
        .on('error', (_error) => __awaiter(void 0, void 0, void 0, function* () {
        (0, testHelpers_1.timeLog)('Once error', _error);
    }))
        .on('transactionHash', function (_hash) {
        txHash = _hash;
    })
        .on('receipt', function (_receipt) {
        txReceipt = _receipt;
    })
        .then(function (_receipt) {
        (0, testHelpers_1.timeLog)('Once the receipt is mined');
    });
    return { txHash, txReceipt };
});
const runBatchSendERC20 = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    let parsedListOfRecievers;
    const envConfigFile = process.env.INTEGRATION_ENV_NAME
        ? `../../../.env_erc_distribution_${process.env.INTEGRATION_ENV_NAME}`
        : `../../../.env_erc_distribution`;
    const fullPathToConfig = `${envConfigFile}.json`;
    const envConfig = require(`${fullPathToConfig}`);
    const { rpc: rpcParams } = envConfig;
    const { rpcUrl = 'http://127.0.0.1:8545', mnemonic } = rpcParams;
    if (!rpcParams || (rpcParams === null || rpcParams === void 0 ? void 0 : rpcParams.mnemonic) === 'XXX XX') {
        throw new Error(`'mnemonic' was not found in the file at path ${fullPathToConfig}. check your configuration file`);
    }
    try {
        data = yield (0, utils_1.readFile)(filePath);
    }
    catch (err) {
        throw Error('Could not read file "file.csv" ');
    }
    try {
        parsedListOfRecievers = yield (0, neat_csv_1.default)(data);
    }
    catch (error) {
        throw Error('Could not parse file "file.csv" ');
    }
    (0, utils_1.log)('parsedListOfRecievers', parsedListOfRecievers);
    const provider = new hdwallet_provider_1.default(mnemonic, rpcUrl, 0, mnemonic.length);
    const web3 = new web3_1.default(provider);
    accounts = yield web3.eth.getAccounts();
    networkId = yield web3.eth.net.getId();
    const sendInfo = [];
    const errorsInfo = [];
    const senderAccount = accounts[0];
    try {
        isCsvValid(parsedListOfRecievers);
    }
    catch (err) {
        throw new Error(`ERROR: CSV is not valid. Details: ${err.message}`);
    }
    const receiversList = getRecieversList(parsedListOfRecievers);
    for (let i = 0; i < receiversList.length; i += 1) {
        const recieverInfo = receiversList[i];
        try {
            const { txHash, txReceipt } = yield sendTxToAccount(senderAccount, recieverInfo.address, `${recieverInfo.numbers}`, web3);
            sendInfo.push({
                txHash,
                recieverInfo: Object.assign({}, recieverInfo),
                txReceipt,
            });
            (0, utils_1.log)(`${i + 1}: Tx hash is "${txHash}"`);
        }
        catch (error) {
            const errorMessage = `${i + 1}: !! ERROR!! - could not send a transaction to ${recieverInfo.address}. Error: - ${error.message}. Skipping....`;
            errorsInfo.push(errorMessage);
            (0, utils_1.log)(errorMessage);
        }
    }
    yield writeDistributionLog(sendInfo, errorsInfo);
    (0, utils_1.log)(`Batch Send Log `, JSON.stringify(sendInfo, null, 2));
    (0, utils_1.log)(`Batch Send Errors Log `, JSON.stringify(errorsInfo, null, 2));
});
exports.runBatchSendERC20 = runBatchSendERC20;
//# sourceMappingURL=batchSendErc20.js.map