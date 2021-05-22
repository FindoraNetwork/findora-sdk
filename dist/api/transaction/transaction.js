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
exports.sendToAddress = exports.getTransactionBuilder = void 0;
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var Fee = __importStar(require("../../services/fee"));
var Network = __importStar(require("../network"));
var AssetApi = __importStar(require("../sdkAsset"));
var getTransactionBuilder = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, _a, stateCommitment, error, _, height, blockCount, transactionBuilder;
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
                transactionBuilder = ledger.TransactionBuilder.new(BigInt(blockCount));
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.getTransactionBuilder = getTransactionBuilder;
var sendToAddress = function (walletInfo, toWalletInfo, numbers, assetCode, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, toPublickey, transferOperationBuilder, receivedTransferOperation, fraCode, transferOperationBuilderFee, receivedTransferOperationFee, transactionBuilder, error_1, submitData, result, err_1, handle, submitError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ledgerWrapper_1.getLedger()];
            case 1:
                ledger = _a.sent();
                toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);
                return [4 /*yield*/, Fee.buildTransferOperation(walletInfo, numbers, toPublickey, assetCode, assetBlindRules)];
            case 2:
                transferOperationBuilder = _a.sent();
                try {
                    receivedTransferOperation = transferOperationBuilder.create().sign(walletInfo.keypair).transaction();
                }
                catch (error) {
                    throw new Error("Could not create transfer operation, Error: \"" + error.messaage + "\"");
                }
                return [4 /*yield*/, AssetApi.getFraAssetCode()];
            case 3:
                fraCode = _a.sent();
                return [4 /*yield*/, Fee.buildTransferOperationWithFee(walletInfo, fraCode)];
            case 4:
                transferOperationBuilderFee = _a.sent();
                try {
                    receivedTransferOperationFee = transferOperationBuilderFee
                        .create()
                        .sign(walletInfo.keypair)
                        .transaction();
                }
                catch (error) {
                    throw new Error("Could not create transfer operation, Error: \"" + error.messaage + "\"");
                }
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, exports.getTransactionBuilder()];
            case 6:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                throw new Error("Could not get \"defineTransactionBuilder\", Error: \"" + error_1.messaage + "\"");
            case 8:
                // add transfer operation for both fra and custom asset - transfer itself
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperation);
                }
                catch (err) {
                    throw new Error("Could not add transfer operation, Error: \"" + err.messaage + "\"");
                }
                // if non-fra add another transfer operation - fee
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferOperationFee);
                }
                catch (err) {
                    throw new Error("Could not add transfer operation, Error: \"" + err.messaage + "\"");
                }
                submitData = transactionBuilder.transaction();
                _a.label = 9;
            case 9:
                _a.trys.push([9, 11, , 12]);
                return [4 /*yield*/, Network.submitTransaction(submitData)];
            case 10:
                result = _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_1 = _a.sent();
                throw new Error("Error Could not define asset: \"" + err_1.message + "\"");
            case 12:
                handle = result.response, submitError = result.error;
                if (submitError) {
                    throw new Error("Could not submit issue asset transaction: \"" + submitError.message + "\"");
                }
                if (!handle) {
                    throw new Error("Could not issue asset - submit handle is missing");
                }
                return [2 /*return*/, handle];
        }
    });
}); };
exports.sendToAddress = sendToAddress;
//# sourceMappingURL=transaction.js.map