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
exports.abarToBarFraSendAmount = exports.abarToBarCustomSendAmount = exports.abarToBarWithHiddenAmountAndType = exports.abarToBar = exports.abarToAbarCustomMultipleFraAtxoForFeeSendAmount = exports.abarToAbarFraMultipleFraAtxoForFeeSendAmount = exports.abarToAbarMulti = exports.abarToAbar = exports.barToAbarAmount = exports.barToAbar = exports.createTestBars = exports.getSidsForSingleAsset = exports.validateSpent = exports.issueCustomAsset = exports.defineCustomAsset = exports.getAnonKeys = exports.createNewKeypair = exports.getDerivedAssetCode = exports.getRandomAssetCode = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = require("../api");
const testHelpers_1 = require("../evm/testHelpers");
const Sdk_1 = __importDefault(require("../Sdk"));
const bigNumber_1 = require("../services/bigNumber");
const providers_1 = require("../services/cacheStore/providers");
const utils_1 = require("../services/utils");
const utxoHelper_1 = require("../services/utxoHelper");
dotenv_1.default.config();
const envConfigFile = process.env.INTEGRATION_ENV_NAME
    ? `../../.env_tm_integration_${process.env.INTEGRATION_ENV_NAME}`
    : `../../.env_example`;
const envConfig = require(`${envConfigFile}.json`);
const { keys: walletKeys, hostUrl: envHostUrl } = envConfig;
console.log('walletKeys for tm', walletKeys);
const sdkEnv = {
    hostUrl: envHostUrl,
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
    blockScanerUrl: '',
};
(0, utils_1.log)('🚀 ~ Findora Sdk is configured to use:', sdkEnv);
(0, utils_1.log)(`Connecting to "${sdkEnv.hostUrl}"`);
Sdk_1.default.init(sdkEnv);
const { mainFaucet } = walletKeys;
const password = 'yourSecretPassword';
const DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR = 3;
const GIVEN_BLOCKS_TO_WAIT_AFTER_ABAR = process.env.BLOCKS_TO_WAIT_AFTER_ABAR;
const BLOCKS_TO_WAIT_AFTER_ABAR = GIVEN_BLOCKS_TO_WAIT_AFTER_ABAR
    ? +GIVEN_BLOCKS_TO_WAIT_AFTER_ABAR
    : DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR;
const getRandomAssetCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const asset1Code = yield api_1.Asset.getRandomAssetCode();
    return asset1Code;
});
exports.getRandomAssetCode = getRandomAssetCode;
const getDerivedAssetCode = (asset1Code) => __awaiter(void 0, void 0, void 0, function* () {
    const derivedAsset1Code = yield api_1.Asset.getDerivedAssetCode(asset1Code);
    return derivedAsset1Code;
});
exports.getDerivedAssetCode = getDerivedAssetCode;
const createNewKeypair = () => __awaiter(void 0, void 0, void 0, function* () {
    const mm = yield api_1.Keypair.getMnemonic(24);
    const walletInfo = yield api_1.Keypair.restoreFromMnemonic(mm, password);
    (0, utils_1.log)('new wallet info', walletInfo);
    return walletInfo;
});
exports.createNewKeypair = createNewKeypair;
const getAnonKeys = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('//////////////// Generate Anon Keys //////////////// ');
    const myAnonKeys = yield (0, exports.createNewKeypair)();
    //
    // const myAnonKeys = await TripleMasking.genAnonKeys();
    //
    (0, utils_1.log)('🚀 ~ getAnonKeys ~ myAnonKeys', myAnonKeys);
    return myAnonKeys;
});
exports.getAnonKeys = getAnonKeys;
const defineCustomAsset = (senderOne, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const pkey = senderOne;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const assetBuilder = yield api_1.Asset.defineAsset(walletInfo, assetCode);
    const handle = yield api_1.Transaction.submitTransaction(assetBuilder);
    (0, utils_1.log)('New asset ', assetCode, ' created, handle', handle);
    yield (0, testHelpers_1.waitForBlockChange)();
});
exports.defineCustomAsset = defineCustomAsset;
const issueCustomAsset = (senderOne, assetCode, derivedAssetCode, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const pkey = senderOne;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const assetBlindRules = { isAmountBlind: false };
    const assetBuilderIssue = yield api_1.Asset.issueAsset(walletInfo, derivedAssetCode, amount, assetBlindRules);
    const handleIssue = yield api_1.Transaction.submitTransaction(assetBuilderIssue);
    (0, utils_1.log)('Asset ', assetCode, ' issued, handle', handleIssue);
    yield (0, testHelpers_1.waitForBlockChange)();
});
exports.issueCustomAsset = issueCustomAsset;
const barToAbarBalances = (walletInfo, 
// anonKeys: FindoraWallet.FormattedAnonKeys,
anonKeys, givenCommitments, balance, givenBalanceChange, assetCode, extraSpent) => __awaiter(void 0, void 0, void 0, function* () {
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const isFraCheck = fraAssetCode === assetCode;
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    const balanceNew = yield api_1.Account.getBalance(walletInfo, assetCode);
    (0, utils_1.log)('Old BAR balance for public key ', walletInfo.address, ' is ', balance, ` ${assetCode}`);
    (0, utils_1.log)('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ` ${assetCode}`);
    const balanceChangeF = parseFloat(balance.replace(/,/g, '')) - parseFloat(balanceNew.replace(/,/g, ''));
    (0, utils_1.log)('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ` ${assetCode}`);
    const realBalanceChange = (0, bigNumber_1.create)((0, bigNumber_1.create)(balanceChangeF).toPrecision(7));
    const expectedBalanceChange = (0, bigNumber_1.create)(givenBalanceChange);
    let expectedBarBalanceChange = expectedBalanceChange.toPrecision(7);
    if (isFraCheck) {
        const barToBarFeeAmount = (0, bigNumber_1.create)('0.02'); // current bar to abar fee
        const extraSpentAmount = (0, bigNumber_1.create)(extraSpent || '0');
        expectedBarBalanceChange = expectedBalanceChange
            .plus(barToBarFeeAmount)
            .plus(extraSpentAmount)
            .toPrecision(7);
    }
    if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
        const message = `BAR balance of ${realBalanceChange.toString()} does not match expected value ${expectedBarBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    const anonBalances = yield api_1.TripleMasking.getAllAbarBalances(anonKeys, givenCommitments);
    const anonBalUnspent = anonBalances.unSpentBalances.balances[0].amount;
    const anonBalanceValue = anonBalUnspent.replace(/,/g, '');
    // log('ABAR balance for anon public key ', anonKeys.axfrPublicKey, ' is ', anonBalanceValue, ` ${assetCode}`);
    (0, utils_1.log)('ABAR balance for anon public key ', anonKeys.publickey, ' is ', anonBalanceValue, ` ${assetCode}`);
    const realAnonBalanceValue = (0, bigNumber_1.create)(anonBalanceValue);
    if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
        const message = `ABAR balance does not match expected value, real is ${realAnonBalanceValue.toString()} and expected is ${expectedBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    return true;
});
const validateSpent = (
// AnonKeys: FindoraWallet.FormattedAnonKeys,
AnonKeys, givenCommitments) => __awaiter(void 0, void 0, void 0, function* () {
    const anonKeys = Object.assign({}, AnonKeys);
    const axfrKeyPair = anonKeys.privateStr;
    for (const givenCommitment of givenCommitments) {
        const ownedAbarsResponse = yield api_1.TripleMasking.getOwnedAbars(givenCommitment);
        const [ownedAbarItem] = ownedAbarsResponse;
        const { abarData } = ownedAbarItem;
        const { atxoSid, ownedAbar } = abarData;
        const hash = yield api_1.TripleMasking.genNullifierHash(atxoSid, ownedAbar, axfrKeyPair);
        const result = yield api_1.TripleMasking.isNullifierHashSpent(hash);
        if (!result) {
            throw new Error(`hash for commitment ${givenCommitment} is still unspent`);
        }
    }
    return true;
});
exports.validateSpent = validateSpent;
const getSidsForSingleAsset = (senderOne, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)(`//////////////// Get sids for asset ${assetCode} //////////////// `);
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(senderOne, password);
    const { response: sids } = yield api_1.Network.getOwnedSids(walletInfo.publickey);
    if (!sids) {
        console.log('ERROR no sids available');
        return [];
    }
    const utxoDataList = yield (0, utxoHelper_1.addUtxo)(walletInfo, sids);
    const customAssetSids = [];
    for (const utxoItem of utxoDataList) {
        const utxoAsset = utxoItem['body']['asset_type'];
        if (utxoAsset === assetCode) {
            customAssetSids.push(utxoItem['sid']);
        }
    }
    return customAssetSids.sort((a, b) => a - b);
});
exports.getSidsForSingleAsset = getSidsForSingleAsset;
// External Tests
const createTestBars = (givenSenderOne, amount = '210', iterations = 4) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  Create Test Bars //////////////// ');
    const givenFaucet = process.env.FAUCET_PKEY;
    const pkey = givenFaucet ? givenFaucet : mainFaucet;
    let toPkeyMine = givenSenderOne;
    if (!givenSenderOne) {
        const senderWalletInfo = yield (0, exports.createNewKeypair)();
        toPkeyMine = senderWalletInfo.privateStr;
    }
    if (!toPkeyMine) {
        throw new Error('Sender private key is not specified');
    }
    const formattedAmount = (0, bigNumber_1.create)(amount);
    const expectedBalance = formattedAmount.multipliedBy(iterations);
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const toWalletInfo = yield api_1.Keypair.restoreFromPrivateKey(toPkeyMine, password);
    const fraCode = yield api_1.Asset.getFraAssetCode();
    const assetCode = fraCode;
    const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
    for (let i = 0; i < iterations; i++) {
        const transactionBuilder = yield api_1.Transaction.sendToAddress(walletInfo, toWalletInfo.address, amount, assetCode, assetBlindRules);
        const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
        (0, utils_1.log)('🚀 ~ createTestBars ~ send fra result handle!!', resultHandle);
        const additional_block_waittime = (i + 1) % 2 === 0 ? 1 : 0;
        yield (0, testHelpers_1.waitForBlockChange)(1 + additional_block_waittime);
    }
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    const assetBalance = yield api_1.Account.getBalance(toWalletInfo, fraCode);
    (0, utils_1.log)(`🚀 ~ createTestBars ~ "${fraCode}" assetBalance `, assetBalance);
    const cleanedBalanceValue = assetBalance.replace(/,/g, '');
    (0, utils_1.log)('🚀 ~ createTestBars ~ cleanedBalanceValue', cleanedBalanceValue);
    const realBalance = (0, bigNumber_1.create)(cleanedBalanceValue);
    (0, utils_1.log)('🚀 ~ createTestBars ~ realBalance', realBalance.toString());
    (0, utils_1.log)('🚀 ~ createTestBars ~ expectedBalance', expectedBalance.toString());
    const isFunded = expectedBalance.isEqualTo(realBalance);
    if (!isFunded) {
        const errorMessage = `Expected FRA balance is ${expectedBalance.toString()} but we have ${realBalance.toString()}`;
        throw Error(errorMessage);
    }
    return isFunded;
});
exports.createTestBars = createTestBars;
const barToAbar = (givenSenderOne, AnonKeys, 
// AnonKeys?: FindoraWallet.FormattedAnonKeys,
givenSids, givenBalanceChange, givenAssetCode, isBalanceCheck = true) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('////////////////  BAR To ABAR conversion //////////////// ');
    const anonKeys = AnonKeys ? Object.assign({}, AnonKeys) : Object.assign({}, (yield (0, exports.getAnonKeys)()));
    // const anonKeys = { ...(await createNewKeypair()) };
    let senderOne = givenSenderOne;
    if (!givenSenderOne) {
        const senderWalletInfo = yield (0, exports.createNewKeypair)();
        senderOne = senderWalletInfo.privateStr;
    }
    if (!senderOne) {
        throw new Error('Sender private key is not specified');
    }
    let sids = givenSids;
    let balanceChange = givenBalanceChange;
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(senderOne, password);
    const weOnlyHaveSid = givenSids && !givenBalanceChange;
    const weOnlyHaveBalanceChange = !givenSids && givenBalanceChange;
    const weHaveUncomplete = weOnlyHaveSid || weOnlyHaveBalanceChange;
    if (weHaveUncomplete) {
        throw new Error('either both SID and BALANCE CHANGE must be provided or none of them');
    }
    let assetCode = givenAssetCode;
    if (!givenAssetCode) {
        assetCode = yield api_1.Asset.getFraAssetCode();
    }
    if (!assetCode) {
        throw new Error('We dont have asset code and cant check the balance');
    }
    let balance = yield api_1.Account.getBalance(walletInfo, assetCode);
    if (!givenSids && !givenBalanceChange) {
        yield (0, exports.createTestBars)(senderOne, '10', 2);
        const fraSids = yield (0, exports.getSidsForSingleAsset)(senderOne, assetCode);
        (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
        const fraSid = fraSids.sort((a, b) => a - b)[0];
        sids = [fraSid];
        (0, utils_1.log)('🚀 ~ sids to use ', sids);
        balanceChange = '10';
        (0, utils_1.log)('🚀 ~ balanceChange to use', balanceChange);
        balance = yield api_1.Account.getBalance(walletInfo);
    }
    if (!sids || !balanceChange) {
        throw new Error('no sid or balance change exist. cant perform bar to abar');
    }
    (0, utils_1.log)('🚀 ~ final balanceChange', balanceChange);
    (0, utils_1.log)('🚀 ~ final sids ', sids);
    const { transactionBuilder, barToAbarData, sids: usedSids, } = yield api_1.TripleMasking.barToAbar(walletInfo, sids, anonKeys.publickey);
    // } = await TripleMasking.barToAbar(walletInfo, sids, anonKeys.axfrPublicKey);
    (0, utils_1.log)('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
    (0, utils_1.log)('🚀 ~ usedSids', usedSids.join(','));
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('send bar to abar result handle!!', resultHandle);
    const givenCommitments = barToAbarData.commitments;
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    if (isBalanceCheck) {
        yield barToAbarBalances(walletInfo, anonKeys, givenCommitments, balance, balanceChange, assetCode);
    }
    return givenCommitments;
});
exports.barToAbar = barToAbar;
const barToAbarAmount = (
// givenAnonKeysReceiver?: FindoraWallet.FormattedAnonKeys,
givenAnonKeysReceiver, amountToSend = '35') => __awaiter(void 0, void 0, void 0, function* () {
    const generatedAnonKeysReceiver = yield (0, exports.getAnonKeys)();
    const anonKeysReceiver = givenAnonKeysReceiver
        ? Object.assign({}, givenAnonKeysReceiver) : Object.assign({}, generatedAnonKeysReceiver);
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 5);
    (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const amount = amountToSend;
    const balance = yield api_1.Account.getBalance(senderWalletInfo);
    console.log('🚀 ~ sender balance', balance);
    const { transactionBuilder, barToAbarData, sids: usedSids, } = yield api_1.TripleMasking.barToAbarAmount(senderWalletInfo, amount, fraAssetCode, anonKeysReceiver.publickey);
    (0, utils_1.log)('🚀 ~ barToAbarData', JSON.stringify(barToAbarData, null, 2));
    (0, utils_1.log)('🚀 ~ usedSids', usedSids.join(','));
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('send bar to abar result handle!!', resultHandle);
    const givenCommitments = barToAbarData.commitments;
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    const minimalFeeForBarToBar = '0.01'; // minimal fee for a bar to bar transfer, when we transfer to ourselves to make exact amount
    const extraSpent = minimalFeeForBarToBar;
    yield barToAbarBalances(senderWalletInfo, anonKeysReceiver, givenCommitments, balance, amount, fraAssetCode, extraSpent);
    return true;
});
exports.barToAbarAmount = barToAbarAmount;
const abarToAbar = (givenAnonKeysReceiver) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.log)('//////////////// Single Asset Anonymous Transfer (ABAR To ABAR) //////////////// ');
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const senderOne = senderWalletInfo.privateStr;
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const generatedAnonKeysReceiver = yield (0, exports.getAnonKeys)();
    const anonKeysReceiver = givenAnonKeysReceiver
        ? Object.assign({}, givenAnonKeysReceiver) : Object.assign({}, generatedAnonKeysReceiver);
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    yield (0, exports.createTestBars)(senderOne, '10', 2);
    const fraSids = yield (0, exports.getSidsForSingleAsset)(senderOne, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
    const fraSid = fraSids.sort((a, b) => b - a)[0];
    const givenCommitmentsToTransfer = yield (0, exports.barToAbar)(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ givenCommitmentsToTransfer', givenCommitmentsToTransfer);
    const givenCommitmentsListSender = [...givenCommitmentsToTransfer];
    const ownedAbarsResponseOne = yield api_1.TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0]);
    const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;
    const { anonTransferOperationBuilder, abarToAbarData } = yield api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.publickey, '8', [ownedAbarToUseAsSource]);
    (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
    const resultHandle = yield api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder);
    (0, utils_1.log)('transfer abar result handle!!', resultHandle);
    (0, utils_1.log)(`will wait for the next block and then check balances for both sender and receiver commitments`);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('//////////////// now checking balances ///////////////////\n\n\n');
    const { commitmentsMap } = abarToAbarData;
    const retrievedCommitmentsListReceiver = [];
    for (const commitmentsMapEntry of commitmentsMap) {
        const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
        if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
            givenCommitmentsListSender.push(commitmentKey);
        }
        if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
            retrievedCommitmentsListReceiver.push(commitmentKey);
        }
    }
    (0, utils_1.log)('🚀 ~ abarToAbar ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ givenCommitmentsListSender', givenCommitmentsListSender);
    const balancesSender = yield api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ balancesSender', JSON.stringify(balancesSender, null, 2));
    const balancesReceiver = yield api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));
    const balSender = balancesSender.balances[0].amount;
    console.log('🚀 ~ balSender', balSender);
    const balanceSender = balSender.replace(/,/g, '');
    const balReceiver = balancesReceiver.balances[0].amount;
    console.log('🚀 ~ balReceiver', balReceiver);
    const balanceReceiver = balReceiver.replace(/,/g, '');
    const expectedBalanceSender = (0, bigNumber_1.create)('1.2');
    const expectedBalanceReceiver = (0, bigNumber_1.create)('8');
    const realBalanceSender = (0, bigNumber_1.create)(balanceSender);
    const realBalanceReceiver = (0, bigNumber_1.create)(balanceReceiver);
    if (!realBalanceSender.isEqualTo(expectedBalanceSender)) {
        const message = `sender ABAR balance ${expectedBalanceSender.toString()} does not match expected ${realBalanceSender.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    if (!realBalanceReceiver.isEqualTo(expectedBalanceReceiver)) {
        const message = `receiver ABAR balance ${expectedBalanceReceiver.toString()} does not match expected ${realBalanceReceiver.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    // it would throw an error if it is unspent
    yield (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToTransfer);
    return true;
});
exports.abarToAbar = abarToAbar;
const abarToAbarMulti = (givenAnonKeysReceiver) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, utils_1.log)('////////////////  Multi Asset Anon Transfer (abarToAbar) //////////////// ');
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const generatedAnonKeysReceiver = yield (0, exports.getAnonKeys)();
    const anonKeysReceiver = givenAnonKeysReceiver
        ? Object.assign({}, givenAnonKeysReceiver) : Object.assign({}, generatedAnonKeysReceiver);
    const asset1Code = yield api_1.Asset.getRandomAssetCode();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const senderOne = senderWalletInfo.privateStr;
    const derivedAssetCode = yield api_1.Asset.getDerivedAssetCode(asset1Code);
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(senderOne, '10', 5);
    (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
    yield (0, exports.defineCustomAsset)(senderOne, asset1Code);
    yield (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '10');
    yield (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '5');
    yield (0, exports.issueCustomAsset)(senderOne, asset1Code, derivedAssetCode, '20');
    const customAssetSids = yield (0, exports.getSidsForSingleAsset)(senderOne, derivedAssetCode);
    (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
    const customAssetSid = customAssetSids.sort((a, b) => b - a)[0];
    const givenCommitmentsToTransfer = yield (0, exports.barToAbar)(senderOne, anonKeysSender, [customAssetSid], '20', derivedAssetCode);
    const fraSids = yield (0, exports.getSidsForSingleAsset)(senderOne, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraSids);
    const fraSid = fraSids.sort((a, b) => a - b)[0];
    const givenCommitmentsToPayFee = yield (0, exports.barToAbar)(senderOne, anonKeysSender, [fraSid], '10', fraAssetCode);
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ Given ABAR commitments To Transfer', givenCommitmentsToTransfer);
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ Given FRA ABAR Commitment', givenCommitmentsToPayFee);
    const givenCommitmentsListSender = [givenCommitmentsToTransfer[0], ...givenCommitmentsToPayFee];
    const balancesSenderBefore = yield api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ balancesSenderBefore', JSON.stringify(balancesSenderBefore, null, 2));
    const additionalOwnedAbarItems = [];
    const ownedAbarsResponseOne = yield api_1.TripleMasking.getOwnedAbars(givenCommitmentsToTransfer[0]);
    const [ownedAbarToUseAsSource] = ownedAbarsResponseOne;
    additionalOwnedAbarItems.push(ownedAbarToUseAsSource);
    for (const givenCommitmentToPayFee of givenCommitmentsToPayFee) {
        const ownedAbarsResponseFee = yield api_1.TripleMasking.getOwnedAbars(givenCommitmentToPayFee);
        const [additionalOwnedAbarItem] = ownedAbarsResponseFee;
        additionalOwnedAbarItems.push(additionalOwnedAbarItem);
    }
    const { anonTransferOperationBuilder, abarToAbarData } = yield api_1.TripleMasking.abarToAbar(anonKeysSender, anonKeysReceiver.publickey, '2', additionalOwnedAbarItems);
    (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
    const resultHandle = yield api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder);
    (0, utils_1.log)('transfer abar result handle!!', resultHandle);
    (0, utils_1.log)(`will wait for the next block and then check balances for both sender and receiver commitments`);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('////////////////////// now checking balances///////////////////// \n\n\n');
    const { commitmentsMap } = abarToAbarData;
    const retrievedCommitmentsListReceiver = [];
    for (const commitmentsMapEntry of commitmentsMap) {
        const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
        if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
            givenCommitmentsListSender.push(commitmentKey);
        }
        if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
            retrievedCommitmentsListReceiver.push(commitmentKey);
        }
    }
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ retrievedCommitmentsListReceiver', retrievedCommitmentsListReceiver);
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ givenCommitmentsListSender', givenCommitmentsListSender);
    (0, utils_1.log)('////////////////// checking sender balances ///////////////////////');
    const balancesSender = yield api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
    (0, utils_1.log)('🚀 ~ abarToAbarMulti ~ balancesSender', JSON.stringify(balancesSender, null, 2));
    const fraBalSend = balancesSender.balances[0].amount;
    const fraBalanceSender = fraBalSend.replace(/,/g, '');
    console.log('🚀 ~ abarToAbarMulti ~ fraBalanceSender', fraBalanceSender);
    const fraBalanceSenderConverted = (0, bigNumber_1.create)(fraBalanceSender);
    const minimumExpectedSenderFraBalance = (0, bigNumber_1.create)('8.8'); // 10 - fee (about 1.2 fra) = 8.8
    if (!fraBalanceSenderConverted.isGreaterThanOrEqualTo(minimumExpectedSenderFraBalance)) {
        const message = 'Sender FRA ABAR balance does not match expected value';
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    const senderCustomBalances = yield api_1.TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitmentsToTransfer);
    console.log('🚀 ~ abarToAbarMulti ~ senderCustomBalances', JSON.stringify(senderCustomBalances, null, 2));
    if (!((_b = (_a = senderCustomBalances === null || senderCustomBalances === void 0 ? void 0 : senderCustomBalances.spentBalances) === null || _a === void 0 ? void 0 : _a.balances) === null || _b === void 0 ? void 0 : _b.length)) {
        const message = 'No ABAR spent balances available';
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    const sendercustomSpent = senderCustomBalances.spentBalances.balances[0].amount;
    console.log('🚀 ~ abarToAbarMulti  ~ sendercustomSpent', sendercustomSpent);
    const customSpentSender = sendercustomSpent.replace(/,/g, '');
    console.log('🚀 ~ abarToAbarMulti ~ customSpentSender', customSpentSender);
    const customBalanceSenderConverted = (0, bigNumber_1.create)(customSpentSender);
    const expectedSenderCustomBalance = (0, bigNumber_1.create)('20');
    if (!customBalanceSenderConverted.isEqualTo(expectedSenderCustomBalance)) {
        const message = 'ABAR balances does not match expected value';
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    (0, utils_1.log)('////////////////// checking receiver balances ///////////////////////');
    const balancesReceiver = yield api_1.TripleMasking.getBalance(anonKeysReceiver, retrievedCommitmentsListReceiver);
    (0, utils_1.log)('🚀 ~ balancesReceiver', JSON.stringify(balancesReceiver, null, 2));
    const customBalReceive = balancesReceiver.balances[0].amount;
    const customBalanceReceiver = customBalReceive.replace(/,/g, '');
    const customBalanceReceiverConverted = (0, bigNumber_1.create)(customBalanceReceiver);
    const expectedReceiverCustomBalance = (0, bigNumber_1.create)('2');
    if (!customBalanceReceiverConverted.isEqualTo(expectedReceiverCustomBalance)) {
        const message = 'Receiver custom balance does not match expected value';
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    (0, utils_1.log)('////////////////// checking spent validation ///////////////////////');
    // it would throw an error if it is unspent
    yield (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToTransfer);
    // it would throw an error if it is unspent
    yield (0, exports.validateSpent)(anonKeysSender, givenCommitmentsToPayFee);
    return true;
});
exports.abarToAbarMulti = abarToAbarMulti;
const abarToAbarFraMultipleFraAtxoForFeeSendAmount = (givenAnonKeysReceiver) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const generatedAnonKeysReceiver = yield (0, exports.getAnonKeys)();
    const anonKeysReceiver = givenAnonKeysReceiver
        ? Object.assign({}, givenAnonKeysReceiver) : Object.assign({}, generatedAnonKeysReceiver);
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 5);
    (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;
    const fraAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
    fraAssetCode);
    const givenCommitmentsListSender = [...fraAssetCommitmentsList];
    (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to abar //////////////');
    const assetCodeToUse = fraAssetCode;
    const amountToSend = '23.15';
    const payload = yield api_1.TripleMasking.getAbarToAbarAmountPayload(anonKeysSender, anonKeysReceiver.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    const { additionalAmountForFee: totalExpectedFee } = payload;
    (0, utils_1.log)('totalExpectedFee for abar to abar', totalExpectedFee);
    const { anonTransferOperationBuilder, abarToAbarData } = yield api_1.TripleMasking.abarToAbarAmount(anonKeysSender, anonKeysReceiver.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
    const resultHandle = yield api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder);
    (0, utils_1.log)('transfer abar result handle!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
    const { commitmentsMap } = abarToAbarData;
    const retrivedCommitmentsListReceiver = [];
    for (const commitmentsMapEntry of commitmentsMap) {
        const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
        if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
            givenCommitmentsListSender.push(commitmentKey);
        }
        if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
            retrivedCommitmentsListReceiver.push(commitmentKey);
        }
    }
    const balancesReceiverAfter = yield api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
    (0, utils_1.log)('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));
    const receiverExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)(amountToSend);
    const fraAbarAmountAfterTransfer = (_c = balancesReceiverAfter === null || balancesReceiverAfter === void 0 ? void 0 : balancesReceiverAfter.balances.find(element => element.assetType === assetCodeToUse)) === null || _c === void 0 ? void 0 : _c.amount;
    if (!fraAbarAmountAfterTransfer) {
        throw new Error(`Receiver is expected to have ${receiverExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`);
    }
    const realReceiverFraAbarBalance = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
    const isReceiverHasProperFraBalanceAfter = realReceiverFraAbarBalance.isEqualTo(receiverExpectedFraAbarBalanceTransfer);
    if (!isReceiverHasProperFraBalanceAfter) {
        throw new Error(`Receiver is expected to have ${receiverExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realReceiverFraAbarBalance.toString()}'`);
    }
    const balancesSenderAfter = yield api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
    (0, utils_1.log)('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));
    const senderExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)('15.65'); // 40 - 23.15 = 15.85 - 1.2 total fee = 15.65
    const fraAbarAmountAfterTransferSender = (_d = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === assetCodeToUse)) === null || _d === void 0 ? void 0 : _d.amount;
    if (!fraAbarAmountAfterTransferSender) {
        throw new Error(`Sender is expected to have ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransferSender}'`);
    }
    const realSenderFraAbarBalanceAfter = (0, bigNumber_1.create)(fraAbarAmountAfterTransferSender);
    const isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(senderExpectedFraAbarBalanceTransfer);
    if (!isSenderHasProperFraBalanceAfter) {
        throw new Error(`Sender is expected to have at least ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realSenderFraAbarBalanceAfter.toString()}'`);
    }
    return true;
});
exports.abarToAbarFraMultipleFraAtxoForFeeSendAmount = abarToAbarFraMultipleFraAtxoForFeeSendAmount;
const abarToAbarCustomMultipleFraAtxoForFeeSendAmount = (givenAnonKeysReceiver) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    const generatedAnonKeysReceiver = yield (0, exports.getAnonKeys)();
    const anonKeysReceiver = givenAnonKeysReceiver
        ? Object.assign({}, givenAnonKeysReceiver) : Object.assign({}, generatedAnonKeysReceiver);
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const assetCode = yield api_1.Asset.getRandomAssetCode();
    const derivedAssetCode = yield api_1.Asset.getDerivedAssetCode(assetCode);
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const assetCodeToUse = derivedAssetCode;
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 5);
    (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
    yield (0, exports.defineCustomAsset)(pkey, assetCode);
    yield (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '10');
    yield (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '5');
    yield (0, exports.issueCustomAsset)(pkey, assetCode, assetCodeToUse, '20');
    const expectedSenderBalance = (0, bigNumber_1.create)('35');
    const assetBalance = yield api_1.Account.getBalance(senderWalletInfo, assetCodeToUse);
    (0, utils_1.log)(`sender bar "${assetCodeToUse}" assetBalance before transfer (after issuing the asset)`, assetBalance);
    const realSenderBalance = (0, bigNumber_1.create)(assetBalance);
    const isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);
    if (!isSenderFunded) {
        const errorMessage = `Expected bar ${assetCodeToUse} balance is ${expectedSenderBalance.toString()} but it has ${realSenderBalance.toString()}`;
        throw Error(errorMessage);
    }
    (0, utils_1.log)('//////////////// bar to abar custom asset transfer ///////////////// ');
    const customAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, assetCodeToUse);
    (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
    const customAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, [...customAssetSids], '35', derivedAssetCode);
    (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;
    const expectedFraBalanceAfterBarToAbar = '40';
    const fraAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], expectedFraBalanceAfterBarToAbar, fraAssetCode);
    const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
    (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to abar //////////////');
    const amountToSend = '22.14';
    const payload = yield api_1.TripleMasking.getAbarToAbarAmountPayload(anonKeysSender, anonKeysReceiver.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    const { additionalAmountForFee: totalExpectedFee } = payload;
    (0, utils_1.log)('totalExpectedFee for abar to abar', totalExpectedFee);
    const { anonTransferOperationBuilder, abarToAbarData } = yield api_1.TripleMasking.abarToAbarAmount(anonKeysSender, anonKeysReceiver.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    (0, utils_1.log)('🚀 ~ abarToAbarData', JSON.stringify(abarToAbarData, null, 2));
    const resultHandle = yield api_1.Transaction.submitAbarTransaction(anonTransferOperationBuilder);
    (0, utils_1.log)('transfer abar result handle!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
    const { commitmentsMap } = abarToAbarData;
    const retrivedCommitmentsListReceiver = [];
    for (const commitmentsMapEntry of commitmentsMap) {
        const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
        if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
            givenCommitmentsListSender.push(commitmentKey);
        }
        if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
            retrivedCommitmentsListReceiver.push(commitmentKey);
        }
    }
    const balancesReceiverAfter = yield api_1.TripleMasking.getBalance(anonKeysReceiver, retrivedCommitmentsListReceiver);
    (0, utils_1.log)('receiver balances after abar to abar', JSON.stringify(balancesReceiverAfter, null, 2));
    const receiverExpectedCustomAbarBalanceTransfer = (0, bigNumber_1.create)(amountToSend);
    const customAbarAmountAfterTransfer = (_e = balancesReceiverAfter === null || balancesReceiverAfter === void 0 ? void 0 : balancesReceiverAfter.balances.find(element => element.assetType === assetCodeToUse)) === null || _e === void 0 ? void 0 : _e.amount;
    if (!customAbarAmountAfterTransfer) {
        throw new Error(`Receiver is expected to have ${receiverExpectedCustomAbarBalanceTransfer.toString()} ABAR custom but it has '${customAbarAmountAfterTransfer}'`);
    }
    const realReceiverCustomAbarBalance = (0, bigNumber_1.create)(customAbarAmountAfterTransfer);
    const isReceiverHasProperCustomBalanceAfter = realReceiverCustomAbarBalance.isEqualTo(receiverExpectedCustomAbarBalanceTransfer);
    if (!isReceiverHasProperCustomBalanceAfter) {
        throw new Error(`Receiver is expected to have ${receiverExpectedCustomAbarBalanceTransfer.toString()} ABAR custom but it has '${realReceiverCustomAbarBalance.toString()}'`);
    }
    const balancesSenderAfter = yield api_1.TripleMasking.getBalance(anonKeysSender, givenCommitmentsListSender);
    (0, utils_1.log)('sender balances after abar to abar', JSON.stringify(balancesSenderAfter, null, 2));
    const senderExpectedFraAbarBalanceTransfer = (0, bigNumber_1.create)('38.5'); // 40 - 1.5 total fee = 38.5
    const fraAbarAmountAfterTransferSender = (_f = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === fraAssetCode)) === null || _f === void 0 ? void 0 : _f.amount;
    if (!fraAbarAmountAfterTransferSender) {
        throw new Error(`Sender is expected to have ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransferSender}'`);
    }
    const realSenderFraAbarBalanceAfter = (0, bigNumber_1.create)(fraAbarAmountAfterTransferSender);
    const isSenderHasProperFraBalanceAfter = realSenderFraAbarBalanceAfter.isGreaterThanOrEqualTo(senderExpectedFraAbarBalanceTransfer);
    if (!isSenderHasProperFraBalanceAfter) {
        throw new Error(`Sender is expected to have at least ${senderExpectedFraAbarBalanceTransfer.toString()} ABAR FRA but it has '${realSenderFraAbarBalanceAfter.toString()}'`);
    }
    const senderExpectedCustomAbarBalanceTransfer = (0, bigNumber_1.create)('12.86'); // 35 - 22.14 = 12.86
    const customAbarAmountAfterTransferSender = (_g = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === assetCodeToUse)) === null || _g === void 0 ? void 0 : _g.amount;
    if (!customAbarAmountAfterTransferSender) {
        throw new Error(`Sender is expected to have ${senderExpectedCustomAbarBalanceTransfer.toString()} custom ABAR but it has '${customAbarAmountAfterTransferSender}'`);
    }
    const realSenderCustomAbarBalanceAfter = (0, bigNumber_1.create)(customAbarAmountAfterTransferSender);
    const isSenderHasProperCustomBalanceAfter = realSenderCustomAbarBalanceAfter.isEqualTo(senderExpectedCustomAbarBalanceTransfer);
    if (!isSenderHasProperCustomBalanceAfter) {
        throw new Error(`Sender is expected to have ${senderExpectedCustomAbarBalanceTransfer.toString()} custom ABAR but it has '${realSenderCustomAbarBalanceAfter.toString()}'`);
    }
    return true;
});
exports.abarToAbarCustomMultipleFraAtxoForFeeSendAmount = abarToAbarCustomMultipleFraAtxoForFeeSendAmount;
const abarToBar = () => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    (0, utils_1.log)('//////////////// ABAR To BAR conversion //////////////// ');
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    // we create 4 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 4);
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;
    const givenCommitments = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree], '30', fraAssetCode);
    console.log('🚀 ~ givenCommitments', givenCommitments);
    const [givenCommitment, givenCommitmentOne] = givenCommitments;
    const balance = yield api_1.Account.getBalance(walletInfo);
    const ownedAbarsResponse = yield api_1.TripleMasking.getOwnedAbars(givenCommitment);
    const [ownedAbarToUseAsSource] = ownedAbarsResponse;
    const ownedAbarsResponseOne = yield api_1.TripleMasking.getOwnedAbars(givenCommitmentOne);
    const [ownedAbarToUseAsSourceOne] = ownedAbarsResponseOne;
    (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);
    (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSourceOne', ownedAbarToUseAsSourceOne);
    const { transactionBuilder } = yield api_1.TripleMasking.abarToBar(anonKeysSender, walletInfo.publickey, [
        ownedAbarToUseAsSource,
        ownedAbarToUseAsSourceOne,
    ]);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('abar to bar result handle!!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
    const balanceNew = yield api_1.Account.getBalance(walletInfo);
    (0, utils_1.log)('Old BAR balance for public key: ', walletInfo.address, ' is ', balance, ' FRA');
    (0, utils_1.log)('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
    const balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
    (0, utils_1.log)('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');
    const givenBalanceChange = '20';
    const realBalanceChange = (0, bigNumber_1.create)((0, bigNumber_1.create)(balanceChangeF).toPrecision(7));
    const expectedBalanceChange = (0, bigNumber_1.create)(givenBalanceChange);
    const expectedBarBalanceChange = expectedBalanceChange;
    if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
        const message = `BAR balance of ${realBalanceChange.toString()} does not match expected value ${expectedBarBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    const anonBalances = yield api_1.TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitments);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
    if (!((_j = (_h = anonBalances === null || anonBalances === void 0 ? void 0 : anonBalances.spentBalances) === null || _h === void 0 ? void 0 : _h.balances) === null || _j === void 0 ? void 0 : _j.length)) {
        const err = 'ERROR No ABAR spent balances available';
        (0, utils_1.log)(err);
        throw new Error(err);
    }
    const anonBalSpent = anonBalances.spentBalances.balances[0].amount;
    const anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);
    const realAnonBalanceValue = (0, bigNumber_1.create)(anonBalanceValue);
    if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
        const message = `ABAR balance does not match expected value, real is ${realAnonBalanceValue.toString()} and expected is ${expectedBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    // it would throw an error if it is unspent
    yield (0, exports.validateSpent)(anonKeysSender, [givenCommitment, givenCommitmentOne]);
    return true;
});
exports.abarToBar = abarToBar;
const abarToBarWithHiddenAmountAndType = () => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l;
    (0, utils_1.log)('//////////////// ABAR To BAR conversion //////////////// ');
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    // we create 4 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 4);
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree] = fraAssetSids;
    const givenCommitments = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree], '30', fraAssetCode);
    console.log('🚀 ~ givenCommitments', givenCommitments);
    const [givenCommitment, givenCommitmentOne] = givenCommitments;
    const balance = yield api_1.Account.getBalance(walletInfo);
    const ownedAbarsResponse = yield api_1.TripleMasking.getOwnedAbars(givenCommitment);
    const [ownedAbarToUseAsSource] = ownedAbarsResponse;
    const ownedAbarsResponseOne = yield api_1.TripleMasking.getOwnedAbars(givenCommitmentOne);
    const [ownedAbarToUseAsSourceOne] = ownedAbarsResponseOne;
    (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSource', ownedAbarToUseAsSource);
    (0, utils_1.log)('🚀 ~ abarToBar ~ ownedAbarToUseAsSourceOne', ownedAbarToUseAsSourceOne);
    const hideAmount = true;
    const hideAssetType = true;
    const { transactionBuilder } = yield api_1.TripleMasking.abarToBar(anonKeysSender, walletInfo.publickey, [ownedAbarToUseAsSource, ownedAbarToUseAsSourceOne], hideAmount, hideAssetType);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('abar to bar result handle!!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
    const balanceNew = yield api_1.Account.getBalance(walletInfo);
    (0, utils_1.log)('Old BAR balance for public key: ', walletInfo.address, ' is ', balance, ' FRA');
    (0, utils_1.log)('New BAR balance for public key ', walletInfo.address, ' is ', balanceNew, ' FRA');
    const balanceChangeF = parseFloat(balanceNew.replace(/,/g, '')) - parseFloat(balance.replace(/,/g, ''));
    (0, utils_1.log)('Change of BAR balance for public key ', walletInfo.address, ' is ', balanceChangeF, ' FRA');
    const givenBalanceChange = '20';
    const realBalanceChange = (0, bigNumber_1.create)((0, bigNumber_1.create)(balanceChangeF).toPrecision(7));
    const expectedBalanceChange = (0, bigNumber_1.create)(givenBalanceChange);
    const expectedBarBalanceChange = expectedBalanceChange;
    if (!realBalanceChange.isEqualTo(expectedBarBalanceChange)) {
        const message = `BAR balance of ${realBalanceChange.toString()} does not match expected value ${expectedBarBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    const anonBalances = yield api_1.TripleMasking.getAllAbarBalances(anonKeysSender, givenCommitments);
    (0, utils_1.log)('🚀 ~ abarToAbar ~ spentBalances after transfer', anonBalances.spentBalances);
    if (!((_l = (_k = anonBalances === null || anonBalances === void 0 ? void 0 : anonBalances.spentBalances) === null || _k === void 0 ? void 0 : _k.balances) === null || _l === void 0 ? void 0 : _l.length)) {
        const err = 'ERROR No ABAR spent balances available';
        (0, utils_1.log)(err);
        throw new Error(err);
    }
    const anonBalSpent = anonBalances.spentBalances.balances[0].amount;
    const anonBalanceValue = parseInt(anonBalSpent.replace(/,/g, ''), 10);
    const realAnonBalanceValue = (0, bigNumber_1.create)(anonBalanceValue);
    if (!realAnonBalanceValue.isEqualTo(expectedBalanceChange)) {
        const message = `ABAR balance does not match expected value, real is ${realAnonBalanceValue.toString()} and expected is ${expectedBalanceChange.toString()}`;
        (0, utils_1.log)(message);
        throw new Error(message);
    }
    // it would throw an error if it is unspent
    yield (0, exports.validateSpent)(anonKeysSender, [givenCommitment, givenCommitmentOne]);
    return true;
});
exports.abarToBarWithHiddenAmountAndType = abarToBarWithHiddenAmountAndType;
const abarToBarCustomSendAmount = () => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const toWalletInfo = yield (0, exports.createNewKeypair)();
    const assetCode = yield api_1.Asset.getRandomAssetCode();
    const derivedAssetCode = yield api_1.Asset.getDerivedAssetCode(assetCode);
    const senderOne = pkey;
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const assetCodeToUse = derivedAssetCode;
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 5);
    (0, utils_1.log)('//////////////// defining and issuing custom asset ////////////// ');
    yield (0, exports.defineCustomAsset)(senderOne, assetCode);
    yield (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '10');
    yield (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '5');
    yield (0, exports.issueCustomAsset)(senderOne, assetCode, assetCodeToUse, '20');
    const expectedSenderBalance = (0, bigNumber_1.create)('35');
    const assetBalance = yield api_1.Account.getBalance(senderWalletInfo, assetCodeToUse);
    (0, utils_1.log)(`sender bar "${assetCodeToUse}" assetBalance before transfer (after issuing the asset)`, assetBalance);
    const realSenderBalance = (0, bigNumber_1.create)(assetBalance);
    const isSenderFunded = expectedSenderBalance.isEqualTo(realSenderBalance);
    if (!isSenderFunded) {
        const errorMessage = `Expected bar ${assetCodeToUse} balance is ${expectedSenderBalance.toString()} but it has ${realSenderBalance.toString()}`;
        throw Error(errorMessage);
    }
    (0, utils_1.log)('//////////////// bar to abar custom asset transfer ///////////////// ');
    const customAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, assetCodeToUse);
    (0, utils_1.log)('🚀 ~ all customAssetSids', customAssetSids);
    const customAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, customAssetSids, '35', derivedAssetCode);
    (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;
    const fraAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', fraAssetCode);
    const givenCommitmentsListSender = [...customAssetCommitmentsList, ...fraAssetCommitmentsList];
    (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to bar //////////////');
    const amountToSend = '12.15';
    const assetBalanceBeforeAbarToBar = yield api_1.Account.getBalance(toWalletInfo, assetCodeToUse);
    const receiverAssetBalanceBeforeTransfer = (0, bigNumber_1.create)(assetBalanceBeforeAbarToBar);
    const isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo((0, bigNumber_1.create)('0'));
    if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
        throw new Error(`Receiver must have 0 balance of the asset but it has ${receiverAssetBalanceBeforeTransfer.toString()}`);
    }
    const { transactionBuilder, remainderCommitements, spentCommitments } = yield api_1.TripleMasking.abarToBarAmount(anonKeysSender, toWalletInfo.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('abar to bar result handle!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    (0, utils_1.log)('/////////////////// now checking balances //////////// \n\n\n ');
    const balancesSenderAfter = yield api_1.TripleMasking.getBalance(anonKeysSender, [
        ...givenCommitmentsListSender,
        ...remainderCommitements,
    ]);
    (0, utils_1.log)('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));
    const expectedFraAbarMinimumAmountAfterTransfer = (0, bigNumber_1.create)('38'); // assuming 2 FRA was spent for fee, so at least 38 FRA min
    const expectedCustomAbarAmountAfterTransfer = (0, bigNumber_1.create)('22.85'); // has to be 35 - 12.15 = 22.85
    const fraAbarAmountAfterTransfer = (_m = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === fraAssetCode)) === null || _m === void 0 ? void 0 : _m.amount;
    if (!fraAbarAmountAfterTransfer) {
        throw new Error(`Sender is expected to have ${expectedFraAbarMinimumAmountAfterTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`);
    }
    const customAbarAmountAfterTransfer = (_o = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === assetCodeToUse)) === null || _o === void 0 ? void 0 : _o.amount;
    if (!customAbarAmountAfterTransfer) {
        throw new Error(`Sender is expected to have ${expectedCustomAbarAmountAfterTransfer.toString()} ABAR custom asset but it has '${customAbarAmountAfterTransfer}'`);
    }
    const senderAssetBalanceAfterTransfer = (0, bigNumber_1.create)(customAbarAmountAfterTransfer);
    const isSenderHasProperAssetBalanceAfterTransfer = senderAssetBalanceAfterTransfer.isEqualTo(expectedCustomAbarAmountAfterTransfer);
    if (!isSenderHasProperAssetBalanceAfterTransfer) {
        throw new Error(`Sender must have 22.5 balance of the asset but it has ${senderAssetBalanceAfterTransfer.toString()}`);
    }
    const senderFraBalanceAfterTransfer = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
    const isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(expectedFraAbarMinimumAmountAfterTransfer);
    if (!isSenderHasProperFraBalanceAfterTransfer) {
        throw new Error(`Sender must have at least ${expectedFraAbarMinimumAmountAfterTransfer.toString()} balance but it has ${senderFraBalanceAfterTransfer.toString()}`);
    }
    (0, utils_1.log)('//////////// checking receiver bar balance //////////');
    const assetBalanceAfterAbarToBar = yield api_1.Account.getBalance(toWalletInfo, assetCodeToUse);
    (0, utils_1.log)('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);
    const receiverAssetBalanceAfterTransfer = (0, bigNumber_1.create)(assetBalanceAfterAbarToBar);
    const isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo((0, bigNumber_1.create)(amountToSend));
    if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
        throw new Error(`Receiver must have ${amountToSend} balance of the asset but it has ${receiverAssetBalanceAfterTransfer.toString()}`);
    }
    (0, utils_1.log)('🚀 ~ spentCommitments', spentCommitments);
    (0, utils_1.log)('🚀 ~ remainderCommitements', remainderCommitements);
    return true;
});
exports.abarToBarCustomSendAmount = abarToBarCustomSendAmount;
const abarToBarFraSendAmount = () => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    const anonKeysSender = yield (0, exports.getAnonKeys)();
    const senderWalletInfo = yield (0, exports.createNewKeypair)();
    const pkey = senderWalletInfo.privateStr;
    const toWalletInfo = yield (0, exports.createNewKeypair)();
    const fraAssetCode = yield api_1.Asset.getFraAssetCode();
    const assetCodeToUse = fraAssetCode;
    // we create 5 FRA bars and we dont need to check the balance, as if it is not equal it would fail at createTestBars
    yield (0, exports.createTestBars)(pkey, '10', 5);
    const assetBalance = yield api_1.Account.getBalance(senderWalletInfo, fraAssetCode);
    (0, utils_1.log)(`sender bar "${assetCodeToUse}" assetBalance before transfer`, assetBalance);
    (0, utils_1.log)('//////////////// bar to abar fra asset transfer ///////////////// ');
    const fraAssetSids = yield (0, exports.getSidsForSingleAsset)(pkey, fraAssetCode);
    (0, utils_1.log)('🚀 ~ all fraAssetSids', fraAssetSids);
    const [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour] = fraAssetSids;
    const fraAssetCommitmentsList = yield (0, exports.barToAbar)(pkey, anonKeysSender, [fAssetSidOne, fAssetSidTwo, fAssetSidThree, fAssetSidFour], '40', // it is a total of 4 sids. needed to verify the balance change of anon wallet
    fraAssetCode);
    const givenCommitmentsListSender = [...fraAssetCommitmentsList];
    (0, utils_1.log)('////////////////////// bar to abar is done, sending abar to bar //////////////');
    const amountToSend = '2.16';
    const assetBalanceBeforeAbarToBar = yield api_1.Account.getBalance(toWalletInfo, assetCodeToUse);
    const receiverAssetBalanceBeforeTransfer = (0, bigNumber_1.create)(assetBalanceBeforeAbarToBar);
    const isReceiverHasEmptyAssetBalanceBeforeTransfer = receiverAssetBalanceBeforeTransfer.isEqualTo((0, bigNumber_1.create)('0'));
    if (!isReceiverHasEmptyAssetBalanceBeforeTransfer) {
        throw new Error(`Receiver must have 0 balance of the asset but it has ${receiverAssetBalanceBeforeTransfer.toString()}`);
    }
    const { transactionBuilder, remainderCommitements, spentCommitments } = yield api_1.TripleMasking.abarToBarAmount(anonKeysSender, toWalletInfo.publickey, amountToSend, assetCodeToUse, givenCommitmentsListSender);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    console.log('abar to bar result handle!!', resultHandle);
    yield (0, testHelpers_1.waitForBlockChange)(BLOCKS_TO_WAIT_AFTER_ABAR);
    console.log('/////////////////// now checking balances //////////// \n\n\n ');
    const balancesSenderAfter = yield api_1.TripleMasking.getBalance(anonKeysSender, [
        ...givenCommitmentsListSender,
        ...remainderCommitements,
    ]);
    (0, utils_1.log)('🚀 abar balancesSenderAfter', JSON.stringify(balancesSenderAfter, null, 2));
    // 40 - 2.16 = 37.84 assuming 1.15 FRA was spent for fee, so at least 36.69 is a min FRA amount it must have
    const expectedFraAbarMinimumAmountAfterTransfer = (0, bigNumber_1.create)('36.69');
    const fraAbarAmountAfterTransfer = (_p = balancesSenderAfter === null || balancesSenderAfter === void 0 ? void 0 : balancesSenderAfter.balances.find(element => element.assetType === fraAssetCode)) === null || _p === void 0 ? void 0 : _p.amount;
    if (!fraAbarAmountAfterTransfer) {
        throw new Error(`Sender is expected to have ${expectedFraAbarMinimumAmountAfterTransfer.toString()} ABAR FRA but it has '${fraAbarAmountAfterTransfer}'`);
    }
    const senderFraBalanceAfterTransfer = (0, bigNumber_1.create)(fraAbarAmountAfterTransfer);
    const isSenderHasProperFraBalanceAfterTransfer = senderFraBalanceAfterTransfer.isGreaterThanOrEqualTo(expectedFraAbarMinimumAmountAfterTransfer);
    if (!isSenderHasProperFraBalanceAfterTransfer) {
        throw new Error(`Sender must have at least ${expectedFraAbarMinimumAmountAfterTransfer.toString()} balance but it has ${senderFraBalanceAfterTransfer.toString()}`);
    }
    (0, utils_1.log)('//////////// checking receiver bar balance //////////');
    const assetBalanceAfterAbarToBar = yield api_1.Account.getBalance(toWalletInfo, assetCodeToUse);
    (0, utils_1.log)('🚀 bar assetBalanceAfterAbarToBar', assetBalanceAfterAbarToBar);
    const receiverAssetBalanceAfterTransfer = (0, bigNumber_1.create)(assetBalanceAfterAbarToBar);
    const isReceiverHasProperAssetBalanceBeforeTransfer = receiverAssetBalanceAfterTransfer.isEqualTo((0, bigNumber_1.create)(amountToSend));
    if (!isReceiverHasProperAssetBalanceBeforeTransfer) {
        throw new Error(`Receiver must have ${amountToSend} balance of the asset but it has ${receiverAssetBalanceAfterTransfer.toString()}`);
    }
    (0, utils_1.log)('🚀 ~ spentCommitments', spentCommitments);
    (0, utils_1.log)('🚀 ~ remainderCommitements', remainderCommitements);
    return true;
});
exports.abarToBarFraSendAmount = abarToBarFraSendAmount;
//# sourceMappingURL=tripleMasking.integration.js.map