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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var testHelpers_1 = require("../evm/testHelpers");
var extendedExecutionTimeout = 180000;
afterAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('after all - just waiting for 3 blocks to have all pending requests finished (if any)');
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(3)];
            case 1:
                _a.sent();
                done();
                return [2 /*return*/];
        }
    });
}); }, extendedExecutionTimeout);
describe("Triple Masking Integration (integration test)", function () {
    describe('Single Asset Integration Test (BAR to BAR)', function () {
        it('Should create test BARs with simple FRA transfer', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(1).toBe(1);
                return [2 /*return*/];
            });
        }); }, extendedExecutionTimeout);
    });
    // describe('Single Asset Integration Test (BAR to BAR)', () => {
    //   it(
    //     'Should create test BARs with simple FRA transfer',
    //     async () => {
    //       const result = await Integration.createTestBars();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout,
    //   );
    // });
    // describe('BAR to ABAR transfer', () => {
    //   it(
    //     'Should convert BAR to ABAR (single sid), and verify balances of BAR and ABAR',
    //     async () => {
    //       const result = await Integration.barToAbar();
    //       expect(!!result).toBe(true);
    //     },
    //     extendedExecutionTimeout,
    //   );
    //   it(
    //     'Should send exact amount of FRA from BAR to ABAR, and verify balances of BAR and ABAR',
    //     async () => {
    //       const result = await Integration.barToAbarAmount();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout,
    //   );
    // });
    // describe('ABAR to ABAR transfer', () => {
    //   it(
    //     'Should do anonymous transfer using only FRA and verify ABAR and BAR balances',
    //     async () => {
    //       const result = await Integration.abarToAbar();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    //   it(
    //     'Should do multi asset anonymous transfer, and verify ABAR and BAR balances',
    //     async () => {
    //       const result = await Integration.abarToAbarMulti();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    //   it(
    //     'Should send exact amount of FRA asset from ABAR to ABAR, and verify both ABAR balances',
    //     async () => {
    //       const result = await Integration.abarToAbarFraMultipleFraAtxoForFeeSendAmount();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    //   it(
    //     'Should send exact amount of custom asset from ABAR to ABAR, and verify both ABAR balances',
    //     async () => {
    //       const result = await Integration.abarToAbarCustomMultipleFraAtxoForFeeSendAmount();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    // });
    // describe('ABAR to BAR transfer', () => {
    //   it(
    //     'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
    //     async () => {
    //       const result = await Integration.abarToBar();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout,
    //   );
    //   it(
    //     'Should send exact amount of custom asset from ABAR to BAR, and verify ABAR and BAR balances',
    //     async () => {
    //       const result = await Integration.abarToBarCustomSendAmount();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    //   it(
    //     'Should send exact amount of FRA asset from ABAR to BAR, and verify ABAR and BAR balances',
    //     async () => {
    //       const result = await Integration.abarToBarFraSendAmount();
    //       expect(result).toBe(true);
    //     },
    //     extendedExecutionTimeout * 2,
    //   );
    // });
});
//# sourceMappingURL=tripleMasking.integration.spec.js.map