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
require("@testing-library/jest-dom/extend-expect");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const Transaction = __importStar(require("../transaction/transaction"));
const Evm = __importStar(require("./evm"));
describe('evm (unit test)', () => {
    describe('sendAccountToEvm', () => {
        it('sendAccountToEvm funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeTransactionBuilder = {
                add_operation_convert_account: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
                sign: jest.fn(() => {
                    return fakeTransactionBuilder;
                }),
            };
            const spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
                return Promise.resolve(fakeTransactionBuilder);
            });
            const spyAddOperationConvertAccount = jest
                .spyOn(fakeTransactionBuilder, 'add_operation_convert_account')
                .mockImplementation(() => {
                return fakeTransactionBuilder;
            });
            const ledger = yield (0, ledgerWrapper_1.getLedger)();
            const address = ledger.base64_to_bech32(ledger.get_coinbase_address());
            const assetCode = ledger.fra_get_asset_code();
            const walletInfo = { publickey: 'senderPub' };
            const amount = '2';
            const ethAddress = 'myValidaotrAddress'; // findoraNetwork.columbus.relayer;
            const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
            const funcName = 'withdrawFRA';
            const convertAmount = new bignumber_js_1.default(amount).times(Math.pow(10, 18)).toString();
            // if (assetCode !== 'FRA') {
            //   funcName = 'withdrawERC20';
            //   convertAmount = await YsSdk.web3.calculationDecimalsAmount(
            //     YsSdk.web3.getErc20Contract(tokenAddress),
            //     tokenAmount,
            //     'toWei',
            //   );
            // }
            // ethAddress = findoraNetwork.columbus.relayer;
            const lowLeveldata = '';
            const result = yield Evm.sendAccountToEvm(walletInfo, amount, ethAddress, assetCode, lowLeveldata);
            expect(spyTransactionSendToaddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
            expect(spyAddOperationConvertAccount).toHaveBeenCalledWith(walletInfo.keypair, ethAddress, BigInt(amount) * BigInt(Math.pow(10, 6)));
            expect(result).toBe(fakeTransactionBuilder);
            spyTransactionSendToaddress.mockRestore();
            spyAddOperationConvertAccount.mockRestore();
        }));
    });
    describe('sendEvmToAccount', () => {
        it.skip('sendEvmToAccount funds', () => __awaiter(void 0, void 0, void 0, function* () {
            const fraAddress = 'fra1d2yetp5ljdwn0zfhusvshgt4d3nyk4j3e0w2stqzlsnv8ra4whmsfzqfga';
            const amount = '1';
            const ethPrivate = 'fa6a6e57595d7e9c227e769deaf7822fcb6176cac573d73979b2c9ce808e6275';
            const ethAddress = '0xa2892da49b74f069400694e4930aa9d6db0e67b3';
            const result = yield Evm.sendEvmToAccount(fraAddress, amount, ethPrivate, ethAddress);
        }));
    });
});
//# sourceMappingURL=evm.spec.js.map