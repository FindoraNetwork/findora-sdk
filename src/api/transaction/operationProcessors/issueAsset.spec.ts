import '@testing-library/jest-dom/extend-expect';

import * as KeypairApi from '../../keypair/keypair';
import * as AssetApi from '../../sdkAsset/sdkAsset';
import { TxOperation } from '../types';
import { processIssueAsset } from './issueAsset';

describe('issueAsset (processor) (unit test)', () => {
  describe('processIssueAsset', () => {
    it('returns properly processed data', async () => {
      const address = 'barfoo';
      const code = 'foobar';
      const type = 'issueAsset';

      const myAsset = {
        code: {
          val: code,
        },
      };

      const myOperation = {
        body: myAsset,
        pubkey: {
          key: 'foofoo',
        },
      };

      const payload = ({
        IssueAsset: myOperation,
      } as unknown) as TxOperation;

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(address);
        });

      const spyGetAssetCode = jest.spyOn(AssetApi, 'getAssetCode').mockImplementation(() => {
        return Promise.resolve(code);
      });

      const result = await processIssueAsset(payload);

      expect(result).toHaveProperty('issueAsset');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('originalOperation');

      expect(result.issueAsset).toEqual({ ...myOperation, code });
      expect(result.from).toEqual([address]);
      expect(result.to).toEqual([address]);
      expect(result.type).toEqual(type);
      expect(result.originalOperation).toBe(payload);
      expect(Object.keys(result)).toHaveLength(5);

      spyGetAddressByPublicKey.mockRestore();
      spyGetAssetCode.mockRestore();
    });
  });
});
