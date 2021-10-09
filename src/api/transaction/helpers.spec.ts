import '@testing-library/jest-dom/extend-expect';

import * as NetworkTypes from '../network/types';
import * as NetworkApi from '../network/network';

import * as helpers from './helpers';
import { ParsedTx } from './types';
import { TxListDataResult } from '../network/types';

describe('helpers (unit test)', () => {
  describe('getTxListFromResponse', () => {
    it('returns proper list from the data result', () => {
      const txList = [{ foo: 'bar' }];
      const payload = ({
        response: {
          result: {
            txs: txList,
          },
        },
      } as unknown) as TxListDataResult;

      const result = helpers.getTxListFromResponse(payload);
      expect(result).toBe(txList);
    });
    it('returns null from data result if tx list is no found', () => {
      const payload = ({
        bar: 'foo',
      } as unknown) as TxListDataResult;

      const result = helpers.getTxListFromResponse(payload);
      expect(result).toBe(null);
    });
  });
  describe('getTxOperationsList', () => {
    it('returns proper list from the parsed tx', () => {
      const txList = [{ foo: 'bar' }];
      const payload = ({
        body: {
          operations: txList,
        },
      } as unknown) as ParsedTx;

      const result = helpers.getTxOperationsList(payload);
      expect(result).toBe(txList);
    });
    it('returns an empty array from parsed tx if operations are notfound', () => {
      const payload = ({
        bar: 'foo',
      } as unknown) as ParsedTx;

      const result = helpers.getTxOperationsList(payload);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
  describe('getBlockTime', () => {
    it('returns proper time from the block', async () => {
      const height = 1;

      const block = {
        block: {
          header: {
            time: 'footime',
          },
        },
      };

      const spyGetBlock = jest.spyOn(NetworkApi, 'getBlock').mockImplementation(() => {
        return Promise.resolve(({
          response: {
            result: block,
          },
        } as unknown) as NetworkTypes.BlockDetailsDataResult);
      });

      const result = await helpers.getBlockTime(height);
      expect(result).toEqual('footime');

      spyGetBlock.mockRestore();
    });
    it('returns undefined if time is not found in the block', async () => {
      const height = 1;

      const block = {
        bar: 'foo',
      };

      const spyGetBlock = jest.spyOn(NetworkApi, 'getBlock').mockImplementation(() => {
        return Promise.resolve(({
          response: {
            result: block,
          },
        } as unknown) as NetworkTypes.BlockDetailsDataResult);
      });

      const result = await helpers.getBlockTime(height);

      spyGetBlock.mockRestore();
      expect(result).toEqual(undefined);
    });
  });
});
