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
exports.claim = exports.delegate = exports.unDelegate = void 0;
var Transaction = __importStar(require("../../api/transaction"));
var Fee = __importStar(require("../../services/fee"));
var unDelegate = function (walletInfo, amount, validator, isFullUnstake) { return __awaiter(void 0, void 0, void 0, function () {
    var transferFeeOperationBuilder, receivedTransferFeeOperation, e, transactionBuilder, error_1, e, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Fee.buildTransferOperationWithFee({ walletInfo: walletInfo })];
            case 1:
                transferFeeOperationBuilder = _a.sent();
                try {
                    receivedTransferFeeOperation = transferFeeOperationBuilder
                        .create()
                        .sign(walletInfo.keypair)
                        .transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation, Error: \"" + e.message + "\"");
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Transaction.getTransactionBuilder()];
            case 3:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                e = error_1;
                throw new Error("Could not get \"stakingTransactionBuilder\", Error: \"" + e.message + "\"");
            case 5:
                try {
                    if (isFullUnstake) {
                        transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
                    }
                    else {
                        transactionBuilder = transactionBuilder.add_operation_undelegate_partially(walletInfo.keypair, BigInt(amount), validator);
                    }
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not staking unDelegate operation, Error: \"" + e.message + "\"");
                }
                try {
                    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferFeeOperation);
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not add transfer to unDelegate operation, Error: \"" + e.message + "\"");
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.unDelegate = unDelegate;
var delegate = function (walletInfo, address, amount, assetCode, validator, assetBlindRules) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionBuilder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules)];
            case 1:
                transactionBuilder = _a.sent();
                transactionBuilder = transactionBuilder.add_operation_delegate(walletInfo.keypair, validator);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.delegate = delegate;
var claim = function (walletInfo, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var transferFeeOperationBuilder, receivedTransferFeeOperation, e, transactionBuilder, error_2, e, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Fee.buildTransferOperationWithFee({ walletInfo: walletInfo })];
            case 1:
                transferFeeOperationBuilder = _a.sent();
                try {
                    receivedTransferFeeOperation = transferFeeOperationBuilder
                        .create()
                        .sign(walletInfo.keypair)
                        .transaction();
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not create transfer operation, Error: \"" + e.message + "\"");
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Transaction.getTransactionBuilder()];
            case 3:
                transactionBuilder = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                e = error_2;
                throw new Error("Could not get \"stakingTransactionBuilder\", Error: \"" + e.message + "\"");
            case 5:
                try {
                    transactionBuilder = transactionBuilder
                        .add_operation_claim_custom(walletInfo.keypair, BigInt(amount))
                        .add_transfer_operation(receivedTransferFeeOperation);
                }
                catch (error) {
                    e = error;
                    throw new Error("Could not staking claim operation, Error: \"" + e.message + "\"");
                }
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.claim = claim;
//# sourceMappingURL=staking.js.map