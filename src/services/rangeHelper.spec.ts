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

        const expectedStart = 1;
        const expectedEnd = 58;

        const range = rangeHelper.getRange(currentMas, processedData);
        expect(range).toEqual([expectedStart, expectedEnd]);
      });
    });

    describe('2. given processed data has no gaps and ends with IAS', () => {
      const processedData: number[] = [5, 4, 3, 2, 1];

      it('case 2.A: it returns range of [MAS-100, MAS] ', async () => {
        const currentMas = 112;

        const expectedStart = 12;
        const expectedEnd = 112;

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
    });

    describe('3. given processed data has no gaps and ends with a number > IAS', () => {
      const processedData: number[] = [5, 4, 3];

      it('case 3.A: it returns range of [IAS, LOWEST_PROCESSED-1] ', async () => {
        const currentMas = 112;

        const expectedStart = 1; // IAS
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
