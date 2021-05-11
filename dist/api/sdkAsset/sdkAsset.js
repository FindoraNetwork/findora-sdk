"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueAsset = exports.defineAsset = exports.getRandomAssetCode = exports.getFraAssetCode = void 0;
var asset_1 = require("../../config/asset");
var bigNumber_1 = require("../../services/bigNumber");
var Fee = __importStar(require("../../services/fee"));
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var Network = __importStar(require("../network"));
var getFraAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                assetCode = ledger.fra_get_asset_code();
                return [2 /*return*/, assetCode];
        }
    });
}); };
exports.getFraAssetCode = getFraAssetCode;
var getRandomAssetCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                assetCode = ledger.random_asset_type();
                return [2 /*return*/, assetCode];
        }
    });
}); };
exports.getRandomAssetCode = getRandomAssetCode;
var getDefaultAssetRules = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, defaultTransferable, defaultUpdatable, defaultDecimals, assetRules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                defaultTransferable = asset_1.DEFAULT_ASSET_RULES.DEFAULT_TRANSFERABLE;
                defaultUpdatable = asset_1.DEFAULT_ASSET_RULES.DEFAULT_UPDATABLE;
                defaultDecimals = asset_1.DEFAULT_ASSET_RULES.DEFAULT_DECIMALS;
                assetRules = ledger.AssetRules.new()
                    .set_transferable(defaultTransferable)
                    .set_updatable(defaultUpdatable)
                    .set_decimals(defaultDecimals);
                return [2 /*return*/, assetRules];
        }
    });
}); };
var getAssetRules = function (newAssetRules) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultAssetRules, ledger, transferable, updatable, decimals, traceable, maxNumbers, assetRules, trackingKey, tracingPolicy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!newAssetRules) return [3 /*break*/, 2];
                return [4 /*yield*/, getDefaultAssetRules()];
            case 1:
                defaultAssetRules = _a.sent();
                return [2 /*return*/, defaultAssetRules];
            case 2: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
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
var getDefineAssetTransactionBuilder = function (walletKeypair, assetName, assetRules, assetMemo) {
    if (assetMemo === void 0) { assetMemo = 'memo'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, _a, stateCommitment, error, _, height, blockCount, definitionTransaction;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
                case 1:
                    ledger = _b.sent();
                    return [4 /*yield*/, Network.getStateCommitment()];
                case 2:
                    _a = _b.sent(), stateCommitment = _a.response, error = _a.error;
                    if (error) {
                        throw new Error(error.message);
                    }
                    if (!stateCommitment) {
                        throw new Error('could not receive response from state commitement call');
                    }
                    _ = stateCommitment[0], height = stateCommitment[1];
                    blockCount = BigInt(height);
                    definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_operation_create_asset(walletKeypair, assetMemo, assetName, assetRules);
                    return [2 /*return*/, definitionTransaction];
            }
        });
    });
};
var getIssueAssetTransactionBuilder = function (walletKeypair, assetName, amountToIssue) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, _a, stateCommitment, error, _, height, blockCount, decimals, utxoNumbers, blindIsAmount, zeiParams, definitionTransaction;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Network.getStateCommitment()];
            case 2:
                _a = _b.sent(), stateCommitment = _a.response, error = _a.error;
                if (error) {
                    throw new Error(error.message);
                }
                if (!stateCommitment) {
                    throw new Error('could not receive response from state commitement call');
                }
                _ = stateCommitment[0], height = stateCommitment[1];
                blockCount = BigInt(height);
                decimals = asset_1.DEFAULT_ASSET_RULES.DEFAULT_DECIMALS;
                utxoNumbers = BigInt(bigNumber_1.toWei(amountToIssue, decimals).toString());
                blindIsAmount = false;
                zeiParams = ledger.PublicParams.new();
                definitionTransaction = ledger.TransactionBuilder.new(BigInt(blockCount)).add_basic_issue_asset(walletKeypair, assetName, BigInt(blockCount), utxoNumbers, blindIsAmount, zeiParams);
                return [2 /*return*/, definitionTransaction];
        }
    });
}); };
var defineAsset = function (walletInfo, assetName, assetMemo, newAssetRules) { return __awaiter(void 0, void 0, void 0, function () {
    var assetRules, fraCode, transferOperationBuilder, receivedTransferOperation, transactionBuilder, submitData, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAssetRules(newAssetRules)];
            case 1:
                assetRules = _a.sent();
                return [4 /*yield*/, exports.getFraAssetCode()];
            case 2:
                fraCode = _a.sent();
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo, fraCode)];
            case 3:
                transferOperationBuilder = _a.sent();
                receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                return [4 /*yield*/, getDefineAssetTransactionBuilder(walletInfo.keypair, assetName, assetRules, assetMemo)];
            case 4:
                transactionBuilder = _a.sent();
                transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                submitData = transactionBuilder.transaction();
                return [4 /*yield*/, Network.submitTransaction(submitData)];
            case 5:
                handle = _a.sent();
                console.log('Transaction handle:', handle);
                return [2 /*return*/, assetName];
        }
    });
}); };
exports.defineAsset = defineAsset;
var issueAsset = function (walletInfo, assetName, amountToIssue) { return __awaiter(void 0, void 0, void 0, function () {
    var fraCode, transferOperationBuilder, receivedTransferOperation, transactionBuilder, submitData, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFraAssetCode()];
            case 1:
                fraCode = _a.sent();
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo, fraCode)];
            case 2:
                transferOperationBuilder = _a.sent();
                receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                return [4 /*yield*/, getIssueAssetTransactionBuilder(walletInfo.keypair, assetName, amountToIssue)];
            case 3:
                transactionBuilder = _a.sent();
                transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                submitData = transactionBuilder.transaction();
                return [4 /*yield*/, Network.submitTransaction(submitData)];
            case 4:
                handle = _a.sent();
                console.log('Transaction handle:', handle);
                return [2 /*return*/, amountToIssue];
        }
    });
}); };
exports.issueAsset = issueAsset;
//# sourceMappingURL=sdkAsset.js.map