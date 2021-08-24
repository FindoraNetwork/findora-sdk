import '@testing-library/jest-dom/extend-expect';

import { TxOperation } from '../types';
import { processUnsupported } from './unsupported';

describe('unsupported (processor)', () => {
  describe('processUnsupported', () => {
    it('returns properly processed data', async () => {
      const type = 'unsupported';

      const payload = ({
        foo: 'bar',
      } as unknown) as TxOperation;

      const result = await processUnsupported(payload);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');

      expect(result.result).toEqual(false);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(5);
    });
  });
});
