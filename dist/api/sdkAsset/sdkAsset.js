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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetDetails = exports.issueAsset = exports.defineAsset = exports.getIssueAssetTransactionBuilder = exports.getDefineAssetTransactionBuilder = exports.getAssetRules = exports.getDefaultAssetRules = exports.getAssetCodeToSend = exports.getDerivedAssetCode = exports.getRandomAssetCode = exports.getAssetCode = exports.getFraPublicKey = exports.getBarToAbarMinimalFee = exports.getMinimalFee = exports.getFraAssetCode = void 0;
var asset_1 = require("../../config/asset");
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var keypair_1 = require("../keypair");
var Network = __importStar(require("../network"));
var Builder = __importStar(require("../transaction/builder"));
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
var getFraAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                assetCode = ledger.fra_get_asset_code();
                return [2 /*return*/, assetCode];
        }
    });
}); };
exports.getFraAssetCode = getFraAssetCode;
var getMinimalFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fee = ledger.fra_get_minimal_fee();
                return [2 /*return*/, fee];
        }
    });
}); };
exports.getMinimalFee = getMinimalFee;
var getBarToAbarMinimalFee = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fee = ledger.fra_get_minimal_fee_for_bar_to_abar();
                return [2 /*return*/, fee];
        }
    });
}); };
exports.getBarToAbarMinimalFee = getBarToAbarMinimalFee;
var getFraPublicKey = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                key = ledger.fra_get_dest_pubkey();
                return [2 /*return*/, key];
        }
    });
}); };
exports.getFraPublicKey = getFraPublicKey;
var getAssetCode = function (val) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, decryptedAsetType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                decryptedAsetType = ledger.asset_type_from_jsvalue(val);
                return [2 /*return*/, decryptedAsetType];
        }
    });
}); };
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
var getRandomAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                assetCode = ledger.random_asset_type();
                return [2 /*return*/, assetCode];
        }
    });
}); };
exports.getRandomAssetCode = getRandomAssetCode;
var getDerivedAssetCode = function (assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, derivedAssetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                derivedAssetCode = ledger.hash_asset_code(assetCode);
                return [2 /*return*/, derivedAssetCode];
        }
    });
}); };
exports.getDerivedAssetCode = getDerivedAssetCode;
var getAssetCodeToSend = function (assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, fraAssetCode, isFraTransfer, derivedAssetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                fraAssetCode = ledger.fra_get_asset_code();
                isFraTransfer = assetCode === fraAssetCode;
                if (isFraTransfer) {
                    return [2 /*return*/, assetCode];
                }
                return [4 /*yield*/, (0, exports.getDerivedAssetCode)(assetCode)];
            case 2:
                derivedAssetCode = _a.sent();
                return [2 /*return*/, derivedAssetCode];
        }
    });
}); };
exports.getAssetCodeToSend = getAssetCodeToSend;
var getDefaultAssetRules = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, defaultTransferable, defaultUpdatable, defaultDecimals, assetRules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                defaultTransferable = asset_1.DEFAULT_ASSET_RULES.transferable;
                defaultUpdatable = asset_1.DEFAULT_ASSET_RULES.updatable;
                defaultDecimals = asset_1.DEFAULT_ASSET_RULES.decimals;
                assetRules = ledger.AssetRules.new()
                    .set_transferable(defaultTransferable)
                    .set_updatable(defaultUpdatable)
                    .set_decimals(defaultDecimals);
                return [2 /*return*/, assetRules];
        }
    });
}); };
exports.getDefaultAssetRules = getDefaultAssetRules;
var getAssetRules = function (newAssetRules) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultAssetRules, ledger, transferable, updatable, decimals, traceable, maxNumbers, assetRules, trackingKey, tracingPolicy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!newAssetRules) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.getDefaultAssetRules)()];
            case 1:
                defaultAssetRules = _a.sent();
                return [2 /*return*/, defaultAssetRules];
            case 2: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 3:
                ledger = _a.sent();
                transferable = newAssetRules.transferable, updatable = newAssetRules.updatable, decimals = newAssetRules.decimals, traceable = newAssetRules.traceable, maxNumbers = newAssetRules.maxNumbers;
                assetRules = ledger.AssetRules.new()
                    .set_transferable(transferable)
                    .set_updatable(updatable)
                    .set_decimals(decimals);
                if (maxNumbers && BigInt(maxNumbers) > BigInt(0)) {
                    assetRules = assetRules.set_max_units(BigInt(maxNumbers));
                }
                if (traceable) {
                    trackingKey = ledger.AssetTracerKeyPair.new();
                    tracingPolicy = ledger.TracingPolicy.new_with_tracing(trackingKey);
                    assetRules = assetRules.add_tracing_policy(tracingPolicy);
                }
                return [2 /*return*/, assetRules];
        }
    });
}); };
exports.getAssetRules = getAssetRules;
var getDefineAssetTransactionBuilder = function (walletKeypair, assetName, assetRules, assetMemo) {
    if (assetMemo === void 0) { assetMemo = 'memo'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var transactionBuilder, error_1, e, definitionTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Builder.getTransactionBuilder()];
                case 1:
                    transactionBuilder = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    e = error_1;
                    throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
                case 3:
                    definitionTransaction = transactionBuilder.add_operation_create_asset(walletKeypair, assetMemo, assetName, assetRules);
                    try {
                        definitionTransaction = definitionTransaction.build();
                        definitionTransaction = definitionTransaction.sign(walletKeypair);
                    }
                    catch (err) {
                        console.log('sendToMany error in build and sign ', err);
                        throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                    }
                    return [2 /*return*/, definitionTransaction];
            }
        });
    });
};
exports.getDefineAssetTransactionBuilder = getDefineAssetTransactionBuilder;
var getIssueAssetTransactionBuilder = function (walletKeypair, assetName, amountToIssue, assetBlindRules, assetDecimals) { return __awaiter(void 0, void 0, void 0, function () {
    var blockCount, utxoNumbers, blindIsAmount, transactionBuilder, error_2, e, definitionTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Builder.getBlockHeight()];
            case 1:
                blockCount = _a.sent();
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amountToIssue, assetDecimals).toString());
                blindIsAmount = assetBlindRules === null || assetBlindRules === void 0 ? void 0 : assetBlindRules.isAmountBlind;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 3:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                e = error_2;
                throw new Error("Could not get transactionBuilder from \"getTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 5:
                definitionTransaction = transactionBuilder.add_basic_issue_asset(walletKeypair, assetName, blockCount, utxoNumbers, !!blindIsAmount);
                return [2 /*return*/, definitionTransaction];
        }
    });
}); };
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
var defineAsset = function (walletInfo, assetName, assetMemo, newAssetRules) { return __awaiter(void 0, void 0, void 0, function () {
    var assetRules, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, err_1, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAssetRules)(newAssetRules)];
            case 1:
                assetRules = _a.sent();
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo)];
            case 2:
                transferOperationBuilder = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not create transfer operation!, Error: \"".concat(e.message, "\""));
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, exports.getDefineAssetTransactionBuilder)(walletInfo.keypair, assetName, assetRules, assetMemo)];
            case 4:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                e = err_1;
                throw new Error("Could not get \"defineTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 6:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                    transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
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
var issueAsset = function (walletInfo, assetName, amountToIssue, assetBlindRules, assetDecimals) { return __awaiter(void 0, void 0, void 0, function () {
    var asset, decimals, transferOperationBuilder, receivedTransferOperation, e, transactionBuilder, err_2, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAssetDetails)(assetName)];
            case 1:
                asset = _a.sent();
                decimals = assetDecimals || asset.assetRules.decimals;
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo)];
            case 2:
                transferOperationBuilder = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not create transfer operation!!, Error: \"".concat(e.message, "\""));
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, exports.getIssueAssetTransactionBuilder)(walletInfo.keypair, assetName, amountToIssue, assetBlindRules, decimals)];
            case 4:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                e = err_2;
                throw new Error("Could not get \"issueAssetTransactionBuilder\", Error: \"".concat(e.message, "\""));
            case 6:
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    e = err;
                    throw new Error("Could not add transfer operation, Error: \"".concat(e.message, "\""));
                }
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                    transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
                }
                catch (err) {
                    console.log('sendToMany error in build and sign ', err);
                    throw new Error("could not build and sign txn \"".concat(err.message, "\""));
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.issueAsset = issueAsset;
var getAssetDetails = function (assetCode) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3, e, assetResult, submitError, asset, issuerAddress, assetDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Network.getAssetToken(assetCode)];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                e = err_3;
                throw new Error("Could not get asset token: \"".concat(e.message, "\""));
            case 3:
                assetResult = result.response, submitError = result.error;
                if (submitError) {
                    throw new Error("Could not get asset details: \"".concat(submitError.message, "\""));
                }
                if (!assetResult) {
                    throw new Error("Could not get asset details - asset result is missing");
                }
                asset = assetResult.properties;
                return [4 /*yield*/, (0, keypair_1.getAddressByPublicKey)(asset.issuer.key)];
            case 4:
                issuerAddress = _a.sent();
                assetDetails = {
                    code: assetCode,
                    issuer: asset.issuer.key,
                    address: issuerAddress,
                    memo: asset.memo,
                    assetRules: __assign(__assign({}, asset_1.DEFAULT_ASSET_RULES), asset === null || asset === void 0 ? void 0 : asset.asset_rules),
                    numbers: BigInt(0),
                    name: '',
                };
                return [2 /*return*/, assetDetails];
        }
    });
}); };
exports.getAssetDetails = getAssetDetails;
//# sourceMappingURL=sdkAsset.js.map