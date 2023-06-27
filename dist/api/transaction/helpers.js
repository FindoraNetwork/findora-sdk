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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockTime = exports.getTxOperationsList = exports.getTxListFromResponse = void 0;
const get_1 = __importDefault(require("lodash/get"));
const Network = __importStar(require("../network"));
const getTxListFromResponse = (result) => (0, get_1.default)(result, 'response.data.txs', null);
exports.getTxListFromResponse = getTxListFromResponse;
const getTxOperationsList = (parsedTx) => (0, get_1.default)(parsedTx, 'body.operations', []);
exports.getTxOperationsList = getTxOperationsList;
const getBlockTime = (height) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const blockDetailsResult = yield Network.getBlock(height);
    const { response } = blockDetailsResult;
    const block = response === null || response === void 0 ? void 0 : response.result;
    const blockTime = (_b = (_a = block === null || block === void 0 ? void 0 : block.block) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.time;
    return blockTime;
});
exports.getBlockTime = getBlockTime;
//# sourceMappingURL=helpers.js.map