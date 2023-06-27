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
exports.runBatchSendFra = void 0;
const neat_csv_1 = __importDefault(require("neat-csv"));
const sleep_promise_1 = __importDefault(require("sleep-promise"));
const api_1 = require("../../api");
const utils_1 = require("../../services/utils");
const waitingTimeBeforeCheckTxStatus = 18000;
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) => arr.slice(i * size, i * size + size));
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
            numbers: tokenAllocated.replace(',', ''),
        };
    });
    return receiversList;
};
const writeDistributionLog = (sendInfo, errorsInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const dateStamp = (0, utils_1.now)();
    const resultFilePath = `batchFraSendLog_${dateStamp}.txt`;
    try {
        yield (0, utils_1.writeFile)(resultFilePath, JSON.stringify({
            date: dateStamp,
            distributionType: 'FRA',
            sendInfo,
            errorsInfo,
        }, null, 2));
    }
    catch (error) {
        throw new Error(`can not write result log for "${resultFilePath}", "${error.message}"`);
    }
});
const processTransferRecieverItem = (tokenReceiver) => __awaiter(void 0, void 0, void 0, function* () {
    const reciverWalletInfo = yield api_1.Keypair.getAddressPublicAndKey(tokenReceiver.address);
    return { reciverWalletInfo, amount: tokenReceiver.numbers };
});
const processTransferRecievers = (tokenReceiversChunk) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(tokenReceiversChunk.map(tokenReceiver => processTransferRecieverItem(tokenReceiver)));
});
const sendTxToAccounts = (senderWallet, recieversInfo, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
    const transactionBuilder = yield api_1.Transaction.sendToMany(senderWallet, recieversInfo, assetCode, assetBlindRules);
    const txHash = yield api_1.Transaction.submitTransaction(transactionBuilder);
    console.log('🚀 ~ file: batchSendFra.ts ~ line 132 ~ txHash', txHash);
    yield (0, sleep_promise_1.default)(waitingTimeBeforeCheckTxStatus);
    return { txHash };
});
const runBatchSendFra = (filePath, fromPk, numberOfOutputs) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    let parsedListOfRecievers;
    try {
        data = yield (0, utils_1.readFile)(filePath);
    }
    catch (err) {
        throw Error('Could not read file "fileFra.csv" ');
    }
    try {
        parsedListOfRecievers = yield (0, neat_csv_1.default)(data);
    }
    catch (error) {
        throw Error('Could not parse file "fileFra.csv" ');
    }
    const password = '123';
    const walletFrom = yield api_1.Keypair.restoreFromPrivateKey(fromPk, password);
    const sendInfo = [];
    const errorsInfo = [];
    try {
        isCsvValid(parsedListOfRecievers);
    }
    catch (err) {
        throw new Error(`ERROR: CSV is not valid. Details: ${err.message}`);
    }
    const receiversList = getRecieversList(parsedListOfRecievers);
    const receiversChunks = chunk(receiversList, numberOfOutputs);
    const fraCode = yield api_1.Asset.getFraAssetCode();
    let i = 0;
    for (let currentChunk of receiversChunks) {
        try {
            const recieversInfo = yield processTransferRecievers(currentChunk);
            const { txHash } = yield sendTxToAccounts(walletFrom, recieversInfo, fraCode);
            sendInfo.push({
                txHash,
                tokenReceivers: Object.assign({}, currentChunk),
            });
            (0, utils_1.log)(`${i + 1}: Tx hash is "${txHash}"`);
        }
        catch (error) {
            const addresses = currentChunk.map(item => item.address).join(',');
            const errorMessage = `${i + 1}: !! ERROR!! - could not send a transaction to one of those addresses "${addresses}". Error: - ${error.message}. Skipping....`;
            errorsInfo.push(errorMessage);
            (0, utils_1.log)(errorMessage);
        }
        i += 1;
    }
    yield writeDistributionLog(sendInfo, errorsInfo);
    (0, utils_1.log)(`Batch Send Log `, JSON.stringify(sendInfo, null, 2));
    (0, utils_1.log)(`Batch Send Errors Log `, JSON.stringify(errorsInfo, null, 2));
});
exports.runBatchSendFra = runBatchSendFra;
//# sourceMappingURL=batchSendFra.js.map