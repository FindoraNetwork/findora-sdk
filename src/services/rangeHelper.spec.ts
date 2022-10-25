import '@testing-library/jest-dom/extend-expect';
import * as rangeHelper from './rangeHelper';

describe('rangeHelper (unit test)', () => {
  describe('getRange', () => {
    describe('1. no processed data given', () => {
      const processedData: number[] = [];

      it('case 1.A: it returns range of [MAS-100, MAS] ', async () => {
        const currentMas = 112;

        const expectedStart = 12;
        const expectedEnd = 112;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });

      it('case 1.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', async () => {
        const currentMas = 58;

        const expectedStart = 0;
        const expectedEnd = 58;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
    });

    describe('2. given processed data has no gaps and ends with IAS', () => {
      const processedData: number[] = [5, 4, 3, 2, 1, 0];

      it('case 2.A: it returns range of [MAS-100, MAS] ', async () => {
        const currentMas = 112;

        const expectedStart = 12;
        const expectedEnd = 112;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
      it('case 2.Aa: it returns range of [MAS, MAS] ', async () => {
        const currentMas = 5;

        const expectedStart = 5;
        const expectedEnd = 5;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });

      it('case 2.B: it returns range of [MAS-100 > 0 ? MAS-100 : IAS, MAS] ', async () => {
        const currentMas = 58;

        const expectedStart = 6;
        const expectedEnd = 58;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
      it('case 2.C: it returns range of [MAS, MAS] when all data processed ', async () => {
        const processedData: number[] = [
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
      });
    });

    describe('3. given processed data has no gaps and ends with a number > IAS', () => {
      const processedData: number[] = [5, 4, 3];

      it('case 3.A: it returns range of [IAS, LOWEST_PROCESSED-1] ', async () => {
        const currentMas = 112;

        const expectedStart = 0; // IAS
        const expectedEnd = 2; // LOWEST_PROCESSED = 3

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });

      it('case 3.B: it returns range of [(LOWEST_PROCESSED-1)-IAS > 100 ? LOWEST_PROCESSED-1-100 : IAS, LOWEST_PROCESSED-1] ', async () => {
        const processedData: number[] = [212, 211, 210];
        const currentMas = 300;

        const expectedStart = 109; // 210 - 1 = 209 and 209 - 100 = 109
        const expectedEnd = 209; // 210 - 1

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
    });

    describe('4. given processed data has gaps ', () => {
      const processedData: number[] = [212, 211, 68, 67, 66, 5, 4, 3];

      it('case 4.A: it returns range of [FIRST_NON_SEQUENT-1-100, FIRST_NON_SEQUENT-1] ', async () => {
        const currentMas = 312;

        const expectedStart = 110; // FIRST_NON_SEQUENT-1-100 = 211 - 1 - 100 = 110
        const expectedEnd = 210; // FIRST_NON_SEQUENT-1 = 211 - 1 = 210

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });

      it('case 4.B: it returns range of [FIRST_NON_SEQUENT-1-100 <= NEXT_SEQ_LAST_ITEM ? NEXT_SEQ_LAST_ITEM+1 :FIRST_NON_SEQUENT-1-100 , FIRST_NON_SEQUENT-1] ', async () => {
        const processedData: number[] = [112, 111, 68, 67, 66, 5, 4, 3];
        const currentMas = 212;

        const expectedStart = 69;
        const expectedEnd = 110;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
    });
  });

  describe('getFirstNonConsecutive', () => {
    it('case 5.A: it returns default values for non-complete consecutive descending array', async () => {
      const processedData: number[] = [112, 111, 110, 109, 108];

      const expectedValue = -1;
      const expectedIndex = -1;

      const data = rangeHelper.getFirstNonConsecutive(processedData);
      expect(data).toEqual([expectedValue, expectedIndex]);
    });

    it('case 5.B: it returns a very first element with its index for non-complete consecutive ascending array', async () => {
      const processedData: number[] = [108, 109, 100, 111];

      const expectedValue = 108;
      const expectedIndex = 0;

      const data = rangeHelper.getFirstNonConsecutive(processedData);
      expect(data).toEqual([expectedValue, expectedIndex]);
    });

    it('case 5.C: it returns default values for complete consecutive descending array', async () => {
      const processedData: number[] = [5, 4, 3, 2, 1];

      const expectedValue = -1;
      const expectedIndex = -1;

      const data = rangeHelper.getFirstNonConsecutive(processedData);
      expect(data).toEqual([expectedValue, expectedIndex]);
    });

    it('case 5.D: it returns a very first element with its index for complete consecutive ascending array', async () => {
      const processedData: number[] = [1, 2, 3, 4, 5];

      const expectedValue = 1;
      const expectedIndex = 0;

      const data = rangeHelper.getFirstNonConsecutive(processedData);
      expect(data).toEqual([expectedValue, expectedIndex]);
    });
  });
});
