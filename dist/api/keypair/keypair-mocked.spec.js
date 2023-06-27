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
require("@testing-library/jest-dom/extend-expect");
const keypair_1 = require("./keypair");
const fakeLedger = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    create_keypair_from_secret: () => null,
};
jest.mock('../../services/ledger/ledgerWrapper', () => ({
    getLedger: jest.fn(() => Promise.resolve(fakeLedger)),
}));
describe('keypair (unit test)', () => {
    describe('restoreFromPrivateKey', () => {
        const pkey = 'Y6umoUmBJRPYJU5n_Y9bHuhoHm6aDMsxDI9FLJzOEXc=';
        const password = '345';
        it('throws the error when ledger fails to crate a keypair', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, keypair_1.restoreFromPrivateKey)(pkey, password)).rejects.toThrow('could not restore keypair. Keypair is empty');
        }));
    });
});
//# sourceMappingURL=keypair-mocked.spec.js.map