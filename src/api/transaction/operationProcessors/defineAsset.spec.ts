import '@testing-library/jest-dom/extend-expect';

import * as KeypairApi from '../../keypair/keypair';
import { TxOperation } from '../types';
import { processDefineAsset } from './defineAsset';

describe('defineAsset (processor) (unit test)', () => {
  describe('processDefineAsset', () => {
    it('returns properly processed data', async () => {
      const address = 'barfoo';
      const type = 'defineAsset';

      const myAsset = {
        issuer: {
          key: 'foo',
        },
        asset_rules: { rule_foo: 'bar' },
      };

      const myOperation = {
        body: {
          asset: myAsset,
        },
      };

      const payload = ({
        DefineAsset: myOperation,
      } as unknown) as TxOperation;

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(address);
        });

      const result = await processDefineAsset(payload);

      expect(result).toHaveProperty('defineAsset');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('assetRules');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');

      expect(result.defineAsset).toBe(myOperation);
      expect(result.from).toEqual([address]);
      expect(result.assetRules).toHaveProperty('rule_foo');
      expect(result.to).toEqual([address]);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(6);

      spyGetAddressByPublicKey.mockRestore();
    });
  });
});
