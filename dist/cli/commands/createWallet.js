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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCreateWallet = void 0;
const api_1 = require("../../api");
const utils_1 = require("../../services/utils");
const runCreateWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const password = '123';
    const mm = yield api_1.Keypair.getMnemonic(24);
    (0, utils_1.log)(`🚀 ~ new mnemonic: "${mm.join(' ')}"`);
    const walletInfo = yield api_1.Keypair.restoreFromMnemonic(mm, password);
    (0, utils_1.log)('🚀 ~ new wallet info: ', walletInfo);
});
exports.runCreateWallet = runCreateWallet;
//# sourceMappingURL=createWallet.js.map