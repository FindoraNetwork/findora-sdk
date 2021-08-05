import '@testing-library/jest-dom/extend-expect';

import * as KeypairApi from '../../keypair/keypair';
import { TxOperation } from '../types';
import { processTransferAsset } from './transferAsset';

describe('transferAsset (processor)', () => {
  describe('processTransferAsset', () => {
    it('returns properly processed data', async () => {
      const addressFrom = 'barfooFrom';
      const addressTo = 'barfooToo';
      const type = 'transferAsset';

      const transfer = {
        inputs: [{ public_key: 'b1' }],
        outputs: [{ public_key: 'b2' }],
      };

      const myOperation = {
        body: {
          transfer,
        },
      };

      const payload = ({
        TransferAsset: myOperation,
      } as unknown) as TxOperation;

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementationOnce(() => {
          return Promise.resolve(addressFrom);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(addressTo);
        });

      const result = await processTransferAsset(payload);

      expect(result).toHaveProperty('transferAsset');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');

      expect(result.transferAsset).toEqual(myOperation);
      expect(result.from).toEqual([addressFrom]);
      expect(result.to).toEqual([addressTo]);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(5);

      spyGetAddressByPublicKey.mockRestore();
    });
  });
});
