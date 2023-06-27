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
const testHelpers_1 = require("../evm/testHelpers");
const Integration = __importStar(require("./tripleMasking.integration"));
const extendedExecutionTimeout = 540000;
afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('after all - just waiting for 3 blocks to have all pending requests finished (if any)');
    yield (0, testHelpers_1.waitForBlockChange)(2);
    done();
}), extendedExecutionTimeout);
describe(`Triple Masking Integration (integration test)`, () => {
    // describe('Single Asset Integration Test (BAR to BAR)', () => {
    //   it(
    //     'Should create test BARs with simple FRA transfer',
    //     async () => {
    //       expect(1).toBe(1);
    //     },
    //     extendedExecutionTimeout,
    //   );
    // });
    describe('Single Asset Integration Test (BAR to BAR)', () => {
        it('Should create test BARs with simple FRA transfer', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.createTestBars();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
    });
    describe('BAR to ABAR transfer', () => {
        it('Should convert BAR to ABAR (single sid), and verify balances of BAR and ABAR', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.barToAbar();
            expect(!!result).toBe(true);
        }), extendedExecutionTimeout);
        it('Should send exact amount of FRA from BAR to ABAR, and verify balances of BAR and ABAR', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.barToAbarAmount();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
    });
    describe('ABAR to ABAR transfer', () => {
        it('Should do anonymous transfer using only FRA and verify ABAR and BAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToAbar();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should do multi asset anonymous transfer, and verify ABAR and BAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToAbarMulti();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should send exact amount of FRA asset from ABAR to ABAR, and verify both ABAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToAbarFraMultipleFraAtxoForFeeSendAmount();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should send exact amount of custom asset from ABAR to ABAR, and verify both ABAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToAbarCustomMultipleFraAtxoForFeeSendAmount();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
    });
    describe('ABAR to BAR transfer', () => {
        it('Should convert ABAR to BAR, and verify balances of ABAR and BAR', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToBar();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
        it('Should convert ABAR to BAR having amount and asset types hidden, and verify balances of ABAR and BAR', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToBarWithHiddenAmountAndType();
            expect(result).toBe(true);
        }), extendedExecutionTimeout);
        it('Should send exact amount of custom asset from ABAR to BAR, and verify ABAR and BAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToBarCustomSendAmount();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
        it('Should send exact amount of FRA asset from ABAR to BAR, and verify ABAR and BAR balances', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield Integration.abarToBarFraSendAmount();
            expect(result).toBe(true);
        }), extendedExecutionTimeout * 2);
    });
});
//# sourceMappingURL=tripleMasking.integration.spec.js.map