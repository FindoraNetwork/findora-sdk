import '@testing-library/jest-dom/extend-expect';

import * as KeypairApi from '../../keypair/keypair';
import { TxOperation } from '../types';
import { processConvertAccount } from './converAccount';

describe('converAccount (processor) (unit test)', () => {
  describe('processConvertAccount', () => {
    it('returns properly processed data', async () => {
      const address = 'barfoo';
      const type = 'convertAccount';
      const myOperation = {
        data: {
          receiver: {
            Ethereum: address,
          },
        },
        signer: address,
      };

      const payload = ({
        ConvertAccount: myOperation,
      } as unknown) as TxOperation;

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(address);
        });

      const result = await processConvertAccount(payload);

      expect(result).toHaveProperty('convertAccount');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');

      expect(result.convertAccount).toBe(myOperation);
      expect(result.from).toEqual([address]);
      expect(result.to).toEqual([address]);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(5);

      spyGetAddressByPublicKey.mockRestore();
    });
  });
});
