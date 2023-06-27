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
exports.runCreateAndSaveWallets = void 0;
const api_1 = require("../../api");
const utils_1 = require("../../services/utils");
const runCreateAndSaveWallets = (amount = 5) => __awaiter(void 0, void 0, void 0, function* () {
    const sendersWallets = [];
    const password = '123';
    for (let i = 0; i < amount; i += 1) {
        const mm = yield api_1.Keypair.getMnemonic(24);
        const newWalletInfo = yield api_1.Keypair.restoreFromMnemonic(mm, password);
        (0, utils_1.log)(`"${i}". Created sender wallet "${newWalletInfo.address}" ("${newWalletInfo.privateStr}")`);
        const data = {
            index: i,
            privateKey: newWalletInfo.privateStr,
            address: newWalletInfo.address,
        };
        sendersWallets.push(data);
    }
    const resultSenders = yield (0, utils_1.writeFile)('./cache/senders.json', JSON.stringify(sendersWallets, null, 2));
    if (resultSenders) {
        (0, utils_1.log)('senders.json has written successfully');
    }
});
exports.runCreateAndSaveWallets = runCreateAndSaveWallets;
//# sourceMappingURL=createAndSaveWallets.js.map