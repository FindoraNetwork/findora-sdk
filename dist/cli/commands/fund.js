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
exports.runFund = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = require("../../api");
const utils_1 = require("../../services/utils");
dotenv_1.default.config();
const { PKEY_LOCAL_FAUCET = '', ENG_PKEY = '' } = process.env;
const runFund = (address, amountToFund) => __awaiter(void 0, void 0, void 0, function* () {
    const pkey = PKEY_LOCAL_FAUCET;
    // const pkey = ENG_PKEY;
    const password = '123';
    const walletInfo = yield api_1.Keypair.restoreFromPrivateKey(pkey, password);
    const assetCode = yield api_1.Asset.getFraAssetCode();
    const transactionBuilder = yield api_1.Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode);
    const resultHandle = yield api_1.Transaction.submitTransaction(transactionBuilder);
    (0, utils_1.log)('send fra result handle', resultHandle);
});
exports.runFund = runFund;
//# sourceMappingURL=fund.js.map