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
const Integration = __importStar(require("./integration"));
const extendedExecutionTimeout = 180000;
describe(`Findora SDK integration (integration test)`, () => {
    describe('Custom Assets', () => {
        it('Should create a simple transaction to define an asset', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.defineAssetTransaction();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
        it('Should define an asset and submit to the network', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.defineAssetTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
        it('Should define and issue an asset, with submitting transactions to the network', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.defineAndIssueAssetTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
    });
    describe('Transfer tokens', () => {
        it('Should send FRA to the reciever', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.sendFraTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should send FRA to the reciever with confidential amount and asset type', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.sendFraConfidentialTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should send FRA to multiple recievers', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.sendFraToMultipleReceiversTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should define, issue and send asset with transactions submitting', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.defineIssueAndSendAssetTransactionSubmit();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 3);
    });
    describe('Confidentiality', () => {
        it('Should issue and send confidential asset', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.issueAndSendConfidentialAsset();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 4);
    });
    describe('Account', () => {
        it('Should get balance for the account', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.getBalance();
            expect(result).toBe(true);
        }), 5000);
    });
    // describe('Staking', () => {
    //   it(
    //     'Should get delegate tokens and see some rewards',
    //     async () => {
    //       const result = await Integration.delegateFraTransactionSubmit();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 13,
    //   );
    //   it(
    //     'Should get delegate tokens and claim the rewards',
    //     async () => {
    //       const result = await Integration.delegateFraTransactionAndClaimRewards();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 25,
    //   );
    // });
});
//# sourceMappingURL=sdk.integration.spec.js.map