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
require("@testing-library/jest-dom/extend-expect");
const rangeHelper = __importStar(require("./rangeHelper"));
describe('rangeHelper (unit test)', () => {
    describe('getRange', () => {
        describe('1. no processed data given', () => {
            const processedData = [];
            it('case 1.A: it returns range of [MAS-100, MAS] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 112;
                const expectedStart = 12;
                const expectedEnd = 112;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 1.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 58;
                const expectedStart = 0;
                const expectedEnd = 58;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
        });
        describe('2. given processed data has no gaps and ends with IAS', () => {
            const processedData = [5, 4, 3, 2, 1, 0];
            it('case 2.A: it returns range of [MAS-100, MAS] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 112;
                const expectedStart = 12;
                const expectedEnd = 112;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 2.Aa: it returns range of [MAS, MAS] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 5;
                const expectedStart = 5;
                const expectedEnd = 5;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 2.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 58;
                const expectedStart = 6;
                const expectedEnd = 58;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 2.C: it returns range of [MAS, MAS] when all data processed ', () => __awaiter(void 0, void 0, void 0, function* () {
                const processedData = [
                    109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88,
                    87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63,
                    62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38,
                    37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13,
                    12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                ];
                const currentMas = 109;
                const expectedStart = 109;
                const expectedEnd = 109;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
        });
        describe('3. given processed data has no gaps and ends with a number > IAS', () => {
            const processedData = [5, 4, 3];
            it('case 3.A: it returns range of [IAS, LOWEST_PROCESSED-1] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 112;
                const expectedStart = 0; // IAS
                const expectedEnd = 2; // LOWEST_PROCESSED = 3
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 3.B: it returns range of [(LOWEST_PROCESSED-1)-IAS > 100 ? LOWEST_PROCESSED-1-100 : IAS, LOWEST_PROCESSED-1] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const processedData = [212, 211, 210];
                const currentMas = 300;
                const expectedStart = 109; // 210 - 1 = 209 and 209 - 100 = 109
                const expectedEnd = 209; // 210 - 1
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
        });
        describe('4. given processed data has gaps ', () => {
            const processedData = [212, 211, 68, 67, 66, 5, 4, 3];
            it('case 4.A: it returns range of [FIRST_NON_SEQUENT-1-100, FIRST_NON_SEQUENT-1] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const currentMas = 312;
                const expectedStart = 110; // FIRST_NON_SEQUENT-1-100 = 211 - 1 - 100 = 110
                const expectedEnd = 210; // FIRST_NON_SEQUENT-1 = 211 - 1 = 210
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
            it('case 4.B: it returns range of [FIRST_NON_SEQUENT-1-100 <= NEXT_SEQ_LAST_ITEM ? NEXT_SEQ_LAST_ITEM+1 :FIRST_NON_SEQUENT-1-100 , FIRST_NON_SEQUENT-1] ', () => __awaiter(void 0, void 0, void 0, function* () {
                const processedData = [112, 111, 68, 67, 66, 5, 4, 3];
                const currentMas = 212;
                const expectedStart = 69;
                const expectedEnd = 110;
                const range = rangeHelper.getRange(currentMas, processedData);
                expect(range).toEqual([expectedStart, expectedEnd]);
            }));
        });
    });
    describe('getFirstNonConsecutive', () => {
        it('case 5.A: it returns default values for non-complete consecutive descending array', () => __awaiter(void 0, void 0, void 0, function* () {
            const processedData = [112, 111, 110, 109, 108];
            const expectedValue = -1;
            const expectedIndex = -1;
            const data = rangeHelper.getFirstNonConsecutive(processedData);
            expect(data).toEqual([expectedValue, expectedIndex]);
        }));
        it('case 5.B: it returns a very first element with its index for non-complete consecutive ascending array', () => __awaiter(void 0, void 0, void 0, function* () {
            const processedData = [108, 109, 100, 111];
            const expectedValue = 108;
            const expectedIndex = 0;
            const data = rangeHelper.getFirstNonConsecutive(processedData);
            expect(data).toEqual([expectedValue, expectedIndex]);
        }));
        it('case 5.C: it returns default values for complete consecutive descending array', () => __awaiter(void 0, void 0, void 0, function* () {
            const processedData = [5, 4, 3, 2, 1];
            const expectedValue = -1;
            const expectedIndex = -1;
            const data = rangeHelper.getFirstNonConsecutive(processedData);
            expect(data).toEqual([expectedValue, expectedIndex]);
        }));
        it('case 5.D: it returns a very first element with its index for complete consecutive ascending array', () => __awaiter(void 0, void 0, void 0, function* () {
            const processedData = [1, 2, 3, 4, 5];
            const expectedValue = 1;
            const expectedIndex = 0;
            const data = rangeHelper.getFirstNonConsecutive(processedData);
            expect(data).toEqual([expectedValue, expectedIndex]);
        }));
    });
});
//# sourceMappingURL=rangeHelper.spec.js.map