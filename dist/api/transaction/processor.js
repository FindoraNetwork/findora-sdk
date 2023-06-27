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
exports.processeTxInfoList = exports.processTxInfoItem = void 0;
const helpers = __importStar(require("./helpers"));
const operationProcessors_1 = require("./operationProcessors");
const processTxOperationItem = (operationItem) => __awaiter(void 0, void 0, void 0, function* () {
    const dataProcessor = (0, operationProcessors_1.getOperationProcessor)(operationItem, operationProcessors_1.processorsMap);
    const processedData = yield dataProcessor(operationItem);
    return processedData;
});
const processTxOperationList = (operationsList) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(operationsList.map(operationItem => processTxOperationItem(operationItem)));
});
const processTxInfoItem = (txItem) => __awaiter(void 0, void 0, void 0, function* () {
    // const time = await helpers.getBlockTime(txItem.height);
    const time = String(txItem.timestamp);
    const hash = txItem.tx_hash;
    const code = txItem.code;
    const operationsList = helpers.getTxOperationsList(txItem.value); // has BarToAbar TransferAsset etc
    const processedOperationList = yield processTxOperationList(operationsList);
    const processedUpdatedTxList = processedOperationList.map(txOperation => (Object.assign(Object.assign({}, txItem), txOperation)));
    return {
        code,
        data: processedUpdatedTxList,
        hash,
        time,
        block_hash: txItem.block_hash,
        height: txItem.height,
    };
});
exports.processTxInfoItem = processTxInfoItem;
const processeTxInfoList = (txList) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(txList.map(txItem => (0, exports.processTxInfoItem)(txItem)));
});
exports.processeTxInfoList = processeTxInfoList;
//# sourceMappingURL=processor.js.map