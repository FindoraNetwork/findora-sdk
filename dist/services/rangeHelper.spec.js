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
require("@testing-library/jest-dom/extend-expect");
var rangeHelper = __importStar(require("./rangeHelper"));
describe('rangeHelper (unit test)', function () {
    describe('getRange', function () {
        describe('1. no processed data given', function () {
            var processedData = [];
            it('case 1.A: it returns range of [MAS-100, MAS] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 112;
                    expectedStart = 12;
                    expectedEnd = 112;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
            it('case 1.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 58;
                    expectedStart = 1;
                    expectedEnd = 58;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('2. given processed data has no gaps and ends with IAS', function () {
            var processedData = [5, 4, 3, 2, 1];
            it('case 2.A: it returns range of [MAS-100, MAS] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 112;
                    expectedStart = 12;
                    expectedEnd = 112;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
            it('case 2.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 58;
                    expectedStart = 6;
                    expectedEnd = 58;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('3. given processed data has no gaps and ends with a number > IAS', function () {
            var processedData = [5, 4, 3];
            it('case 3.A: it returns range of [IAS, LOWEST_PROCESSED-1] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 112;
                    expectedStart = 1;
                    expectedEnd = 2;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
            it('case 3.B: it returns range of [(LOWEST_PROCESSED-1)-IAS > 100 ? LOWEST_PROCESSED-1-100 : IAS, LOWEST_PROCESSED-1] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var processedData, currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    processedData = [212, 211, 210];
                    currentMas = 300;
                    expectedStart = 109;
                    expectedEnd = 209;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('4. given processed data has gaps ', function () {
            var processedData = [212, 211, 68, 67, 66, 5, 4, 3];
            it('case 4.A: it returns range of [FIRST_NON_SEQUENT-1-100, FIRST_NON_SEQUENT-1] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    currentMas = 312;
                    expectedStart = 110;
                    expectedEnd = 210;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
            it('case 4.B: it returns range of [FIRST_NON_SEQUENT-1-100 <= NEXT_SEQ_LAST_ITEM ? NEXT_SEQ_LAST_ITEM+1 :FIRST_NON_SEQUENT-1-100 , FIRST_NON_SEQUENT-1] ', function () { return __awaiter(void 0, void 0, void 0, function () {
                var processedData, currentMas, expectedStart, expectedEnd, range;
                return __generator(this, function (_a) {
                    processedData = [112, 111, 68, 67, 66, 5, 4, 3];
                    currentMas = 212;
                    expectedStart = 69;
                    expectedEnd = 110;
                    range = rangeHelper.getRange(currentMas, processedData);
                    expect(range).toEqual([expectedStart, expectedEnd]);
                    return [2 /*return*/];
                });
            }); });
        });
    });
    describe('getFirstNonConsecutive', function () {
        it('case 5.A: it returns default values for non-complete consecutive descending array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var processedData, expectedValue, expectedIndex, data;
            return __generator(this, function (_a) {
                processedData = [112, 111, 110, 109, 108];
                expectedValue = -1;
                expectedIndex = -1;
                data = rangeHelper.getFirstNonConsecutive(processedData);
                expect(data).toEqual([expectedValue, expectedIndex]);
                return [2 /*return*/];
            });
        }); });
        it('case 5.B: it returns a very first element with its index for non-complete consecutive ascending array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var processedData, expectedValue, expectedIndex, data;
            return __generator(this, function (_a) {
                processedData = [108, 109, 100, 111];
                expectedValue = 108;
                expectedIndex = 0;
                data = rangeHelper.getFirstNonConsecutive(processedData);
                expect(data).toEqual([expectedValue, expectedIndex]);
                return [2 /*return*/];
            });
        }); });
        it('case 5.C: it returns default values for complete consecutive descending array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var processedData, expectedValue, expectedIndex, data;
            return __generator(this, function (_a) {
                processedData = [5, 4, 3, 2, 1];
                expectedValue = -1;
                expectedIndex = -1;
                data = rangeHelper.getFirstNonConsecutive(processedData);
                expect(data).toEqual([expectedValue, expectedIndex]);
                return [2 /*return*/];
            });
        }); });
        it('case 5.D: it returns a very first element with its index for complete consecutive ascending array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var processedData, expectedValue, expectedIndex, data;
            return __generator(this, function (_a) {
                processedData = [1, 2, 3, 4, 5];
                expectedValue = 1;
                expectedIndex = 0;
                data = rangeHelper.getFirstNonConsecutive(processedData);
                expect(data).toEqual([expectedValue, expectedIndex]);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=rangeHelper.spec.js.map