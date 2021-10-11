import '@testing-library/jest-dom/extend-expect';

import * as KeypairApi from '../../keypair/keypair';
import { TxOperation } from '../types';
import { processUndelegation } from './undelegation';

describe('unDelegation (processor) (unit test)', () => {
  describe('processDelegation', () => {
    it('returns properly processed data', async () => {
      const address = 'barfoo';
      const type = 'unDelegation';
      const myOperation = {
        body: {
          pu: null,
          nonce: [0],
        },
        pubkey: address,
        signature: '',
      };

      const payload = {
        UnDelegation: myOperation,
      } as unknown as TxOperation;

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(address);
        });

      const result = await processUndelegation(payload);

      expect(result).toHaveProperty('unDelegation');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');

      expect(result.unDelegation).toBe(myOperation);
      expect(result.from).toEqual([address]);
      expect(result.to).toEqual([address]);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(5);

      spyGetAddressByPublicKey.mockRestore();
    });
  });
});
