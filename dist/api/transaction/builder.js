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
exports.getAnonTransferOperationBuilder = exports.getTransactionBuilder = exports.getBlockHeight = void 0;
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const Network = __importStar(require("../network"));
const getBlockHeight = () => __awaiter(void 0, void 0, void 0, function* () {
    const { response: stateCommitment, error } = yield Network.getStateCommitment();
    if (error) {
        throw new Error(error.message);
    }
    if (!stateCommitment) {
        throw new Error('Could not receive response from state commitement call...');
    }
    const [_, height] = stateCommitment;
    const blockCount = BigInt(height);
    return blockCount;
});
exports.getBlockHeight = getBlockHeight;
const getTransactionBuilder = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const blockCount = yield (0, exports.getBlockHeight)();
    const transactionBuilder = ledger.TransactionBuilder.new(blockCount);
    return transactionBuilder;
});
exports.getTransactionBuilder = getTransactionBuilder;
const getAnonTransferOperationBuilder = () => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const blockCount = yield (0, exports.getBlockHeight)();
    const anonTransferOperationBuilder = ledger.AnonTransferOperationBuilder.new(blockCount);
    return anonTransferOperationBuilder;
});
exports.getAnonTransferOperationBuilder = getAnonTransferOperationBuilder;
//# sourceMappingURL=builder.js.map