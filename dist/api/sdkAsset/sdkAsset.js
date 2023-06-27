"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetDetails = exports.issueAsset = exports.defineAsset = exports.getIssueAssetTransactionBuilder = exports.getDefineAssetTransactionBuilder = exports.getAssetRules = exports.getDefaultAssetRules = exports.getAssetCodeToSend = exports.getDerivedAssetCode = exports.getRandomAssetCode = exports.getAssetCode = exports.getFraPublicKey = exports.getMinimalFee = exports.getFraAssetCode = void 0;
const asset_1 = require("../../config/asset");
const bigNumber_1 = require("../../services/bigNumber");
const Fee = __importStar(require("../../services/fee"));
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const keypair_1 = require("../keypair");
const Network = __importStar(require("../network"));
const Builder = __importStar(require("../transaction/builder"));
/**
 * Returns the pre-defined FRA asset code
 *
 * @remarks
 * FRA asset code can not be re-defined, as well as it can not be used in the `DefineAset`  or `IssueAsset` operations.
 *
 * This is the main asset code, which is used when user needs to create a transaction, or calculate the fee and so on.
 *
 * @example
 *
 * ```ts *
 * const fraAssetCode = await getFraAssetCode();
 * ```
 * @returns - Findora Asset code
 */
const getFraAssetCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const assetCode = ledger.fra_get_asset_code();
    return assetCode;
});
exports.getFraAssetCode = getFraAssetCode;
const getMinimalFee = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const fee = ledger.fra_get_minimal_fee();
    return fee;
});
exports.getMinimalFee = getMinimalFee;
const getFraPublicKey = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const key = ledger.fra_get_dest_pubkey();
    return key;
});
exports.getFraPublicKey = getFraPublicKey;
const getAssetCode = (val) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const decryptedAsetType = ledger.asset_type_from_jsvalue(val);
    return decryptedAsetType;
});
exports.getAssetCode = getAssetCode;
/**
 * Returns a random asset code
 *
 * @remarks
 * Using {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } it generates and returns a random custom asset code
 *
 * @example
 *
 * ```ts *
 * const assetCode = await getRandomAssetCode();
 * ```
 * @returns - Asset code
 */
const getRandomAssetCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const assetCode = ledger.random_asset_type();
    return assetCode;
});
exports.getRandomAssetCode = getRandomAssetCode;
const getDerivedAssetCode = (assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const derivedAssetCode = ledger.hash_asset_code(assetCode);
    return derivedAssetCode;
});
exports.getDerivedAssetCode = getDerivedAssetCode;
const getAssetCodeToSend = (assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const fraAssetCode = ledger.fra_get_asset_code();
    const isFraTransfer = assetCode === fraAssetCode;
    if (isFraTransfer) {
        return assetCode;
    }
    const derivedAssetCode = yield (0, exports.getDerivedAssetCode)(assetCode);
    return derivedAssetCode;
});
exports.getAssetCodeToSend = getAssetCodeToSend;
const getDefaultAssetRules = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const defaultTransferable = asset_1.DEFAULT_ASSET_RULES.transferable;
    const defaultUpdatable = asset_1.DEFAULT_ASSET_RULES.updatable;
    const defaultDecimals = asset_1.DEFAULT_ASSET_RULES.decimals;
    const assetRules = ledger.AssetRules.new()
        .set_transferable(defaultTransferable)
        .set_updatable(defaultUpdatable)
        .set_decimals(defaultDecimals);
    return assetRules;
});
exports.getDefaultAssetRules = getDefaultAssetRules;
const getAssetRules = (newAssetRules) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newAssetRules) {
        const defaultAssetRules = yield (0, exports.getDefaultAssetRules)();
        return defaultAssetRules;
    }
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const { transferable, updatable, decimals, traceable, maxNumbers } = newAssetRules;
    let assetRules = ledger.AssetRules.new()
        .set_transferable(transferable)
        .set_updatable(updatable)
        .set_decimals(decimals);
    if (maxNumbers && BigInt(maxNumbers) > BigInt(0)) {
        assetRules = assetRules.set_max_units(BigInt(maxNumbers));
    }
    if (traceable) {
        const trackingKey = ledger.AssetTracerKeyPair.new();
        const tracingPolicy = ledger.TracingPolicy.new_with_tracing(trackingKey);
        assetRules = assetRules.add_tracing_policy(tracingPolicy);
    }
    return assetRules;
});
exports.getAssetRules = getAssetRules;
const getDefineAssetTransactionBuilder = (walletKeypair, assetName, assetRules, assetMemo = 'memo') => __awaiter(void 0, void 0, void 0, function* () {
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
    }
    let definitionTransaction = transactionBuilder.add_operation_create_asset(walletKeypair, assetMemo, assetName, assetRules);
    try {
        definitionTransaction = definitionTransaction.build();
        definitionTransaction = definitionTransaction.sign(walletKeypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return definitionTransaction;
});
exports.getDefineAssetTransactionBuilder = getDefineAssetTransactionBuilder;
const getIssueAssetTransactionBuilder = (walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals) => __awaiter(void 0, void 0, void 0, function* () {
    const blockCount = yield Builder.getBlockHeight();
    const utxoNumbers = BigInt((0, bigNumber_1.toWei)(amountToIssue, assetDecimals).toString());
    const blindIsAmount = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isAmountBlind;
    let transactionBuilder;
    try {
        transactionBuilder = yield Builder.getTransactionBuilder();
    }
    catch (error) {
        const e = error;
        throw new Error(`Could not get transactionBuilder from "getTransactionBuilder", Error: "${e.message}"`);
    }
    const definitionTransaction = transactionBuilder.add_basic_issue_asset(walletKeypair, assetName, blockCount, utxoNumbers, !!blindIsAmount);
    return definitionTransaction;
});
exports.getIssueAssetTransactionBuilder = getIssueAssetTransactionBuilder;
/**
 * Defines a custom asset
 *
 * @remarks
 * An asset definition operation registers an asset with the Findora ledger. An asset is a digital resource that can be issued and transferred.
 *
 * An asset has an issuer and a unique code. The ```DefineAsset``` operation must provide an unused token code. The transaction containing the ```DefineAsset```
 * operation will fail if there is already another asset on the ledger with the same code.
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 * // First, we create a transaction builder
 * const assetBuilder = await Asset.defineAsset(walletInfo, assetCode);
 *
 * // Then, we submit a transaction
 * const handle = await Transaction.submitTransaction(assetBuilder);
 * ```
 * @param newAssetRules - A set of _rules_ (options) for the new asset
 *
 * @throws `Could not create transfer operation`
 * @throws `Could not get "defineTransactionBuilder"`
 * @throws `Could not add transfer operation`
 *
 * @returns An instance of **TransactionBuilder** from {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger }
 */
const defineAsset = (walletInfo, assetName, assetMemo, newAssetRules) => __awaiter(void 0, void 0, void 0, function* () {
    const assetRules = yield (0, exports.getAssetRules)(newAssetRules);
    const transferOperationBuilder = yield Fee.buildTransferOperationWithFee(walletInfo);
    let receivedTransferOperation;
    try {
        receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not create transfer operation!, Error: "${e.message}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield (0, exports.getDefineAssetTransactionBuilder)(walletInfo.keypair, assetName, assetRules, assetMemo);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not get "defineTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
        // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return transactionBuilder;
});
exports.defineAsset = defineAsset;
/**
 * Issue some anount of a custom asset
 *
 * @remarks
 * Asset issuers can use the ```IssueAsset``` operation to mint units of an asset
 * that they have created. Concretely, the ```IssueAsset``` operation creates asset records that represent ownership by a public key
 * of a certain amount of an asset. These asset records are stored in a structure called a transaction output (TXO).
 *
 * @example
 *
 * ```ts
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 * // Define the new asset parameters (rules)
 * const assetBlindRules = { isAmountBlind: false };
 *
 * // First, we create a transaction builder
 * const assetBuilder = await Asset.issueAsset(walletInfo, customAssetCode, amountToIssue, assetBlindRules);
 *
 * // Then, we submit a transaction
 * const handle = await Transaction.submitTransaction(assetBuilder);
 * ```
 * @param assetDecimals - This parameter can define how many numbers after the comma would this asset have
 *
 * @throws `Could not create transfer operation`
 * @throws `Could not get "issueAssetTransactionBuilder"`
 * @throws `Could not add transfer operation`
 *
 * @returns An instance of **TransactionBuilder** from {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger }
 */
const issueAsset = (walletInfo, assetName, amountToIssue, assetBlindRules, assetDecimals) => __awaiter(void 0, void 0, void 0, function* () {
    const asset = yield (0, exports.getAssetDetails)(assetName);
    const decimals = assetDecimals || asset.assetRules.decimals;
    const transferOperationBuilder = yield Fee.buildTransferOperationWithFee(walletInfo);
    let receivedTransferOperation;
    try {
        receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not create transfer operation!!, Error: "${e.message}"`);
    }
    let transactionBuilder;
    try {
        transactionBuilder = yield (0, exports.getIssueAssetTransactionBuilder)(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, decimals);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not get "issueAssetTransactionBuilder", Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not add transfer operation, Error: "${e.message}"`);
    }
    try {
        transactionBuilder = transactionBuilder.build();
        transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
        // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    }
    catch (err) {
        console.log('sendToMany error in build and sign ', err);
        throw new Error(`could not build and sign txn "${err.message}"`);
    }
    return transactionBuilder;
});
exports.issueAsset = issueAsset;
const getAssetDetails = (assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield Network.getAssetToken(assetCode);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not get asset token: "${e.message}"`);
    }
    const { response: assetResult, error: submitError } = result;
    if (submitError) {
        throw new Error(`Could not get asset details: "${submitError.message}"`);
    }
    if (!assetResult) {
        throw new Error(`Could not get asset details - asset result is missing`);
    }
    const asset = assetResult.properties;
    const issuerAddress = yield (0, keypair_1.getAddressByPublicKey)(asset.issuer.key);
    const assetDetails = {
        code: assetCode,
        issuer: asset.issuer.key,
        address: issuerAddress,
        memo: asset.memo,
        assetRules: Object.assign(Object.assign({}, asset_1.DEFAULT_ASSET_RULES), asset === null || asset === void 0 ? void 0 : asset.asset_rules),
        numbers: BigInt(0),
        name: '',
    };
    return assetDetails;
});
exports.getAssetDetails = getAssetDetails;
//# sourceMappingURL=sdkAsset.js.map