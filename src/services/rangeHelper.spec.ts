import '@testing-library/jest-dom/extend-expect';
import * as rangeHelper from './rangeHelper';

describe('rangeHelper (unit test)', () => {
  describe('getRange', () => {
    let end: number;
    let currentEnd: number; // the end number of the user currently has

    it('get range by the end number: minimal level', async () => {
      end = Math.floor(Math.random() * 100) + 1; // 1 - 100
      // @TODO if end = 1;

      const range = rangeHelper.getRange(end);
      expect(range).toEqual([end, 1]);
    });

    it('get range by the end number: outside minimal level', async () => {
      end = Math.floor(Math.random() * 900) + 101; // 101 - 1000

      const range = rangeHelper.getRange(end);
      expect(range).toEqual([end, end - 100 + 1]);
    });

    it('get range by the end number: the current end number "lower than" the end number, the gap under 100', async () => {
      let gap = Math.floor(Math.random() * 100) + 1;
      end = Math.floor(Math.random() * 1000) + 101; // 101 - 1000
      currentEnd = end - gap;

      const range = rangeHelper.getRange(end, currentEnd);
      expect(range).toEqual([end, currentEnd + 1]);
    });

    it('get range by the end number: the current end number "lower than" the end number, the gap over 100', async () => {
      end = Math.floor(Math.random() * 400) + 601; // 600 - 1000
      currentEnd = Math.floor(Math.random() * 500) + 1; // 1 - 500

      const range = rangeHelper.getRange(end, currentEnd);
      expect(range).toEqual([end, end - 100 + 1]);
    });

    it('get range by the end number: the current end number "higher than" the end number', async () => {
      let addNum = Math.floor(Math.random() * 100) + 1;
      end = Math.floor(Math.random() * 1000) + 1;
      currentEnd = end + addNum;

      const range = rangeHelper.getRange(end, currentEnd);
      expect(range).toEqual([]);
    });
  });
});
