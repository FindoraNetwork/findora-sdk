import '@testing-library/jest-dom/extend-expect';

import BigNumber from 'bignumber.js';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import Sdk from '../../Sdk';
import { MemoryCacheProvider } from '../../services/cacheStore/providers';
import * as network from './network';

const myDefaultResult = [
  {
    foo: 'bar',
  },
  {
    barfoo: 'foobar',
  },
];

const defaultUrl = `https://foo.com`;

const server = setupServer(
  rest.get(defaultUrl, (_req, res, ctx) => {
    return res(ctx.json(myDefaultResult));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('network', () => {
  const testConfig = {
    headers: {
      testHeader: 'test-value',
    },
  };

  const hostUrl = 'https://foo.bar';

  const sdkEnv = {
    hostUrl,
    cacheProvider: MemoryCacheProvider,
    cachePath: '.',
  };

  Sdk.init(sdkEnv);

  describe('apiPost', () => {
    const data = { foo: 'bar' };
    const myHandle = 'foobar';

    it('returns properly formatted response data', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.json(myHandle));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, data, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toEqual('foobar');
    });

    it('makes a call with no data', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.json(myHandle));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, undefined, testConfig);

      expect(dataResult).toHaveProperty('response');
      const { response } = dataResult;

      expect(response).toEqual('foobar');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, data, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('apiGet', () => {
    it('returns properly formatted response data', async () => {
      const dataResult = await network.apiGet(defaultUrl, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response.length).toEqual(2);
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(defaultUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.apiGet(defaultUrl, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getOwnedSids', () => {
    const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
    const url = `${hostUrl}:8667/get_owned_utxos/${address}`;

    it('returns properly formatted utxo sids data for multiple sids', async () => {
      const mySids = [3, 4, 5];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(3);
    });

    it('returns properly formatted utxo sids data for a single sid ', async () => {
      const mySids = 3;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(1);
    });

    it('returns properly formatted utxo sids data for a single sid in an array', async () => {
      const mySids = [3];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(1);
    });

    it('returns properly formatted utxo sids data response is undefined', async () => {
      const mySids = undefined;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(0);
    });

    it('returns an error in case of a server error and does not return response', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getOwnedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getRelatedSids', () => {
    const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
    const url = `${hostUrl}:8667/get_related_txns/${address}`;

    it('returns properly formatted utxo sids data for multiple sids', async () => {
      const mySids = [3, 4, 5];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(3);
    });

    it('returns properly formatted utxo sids data for a single sid ', async () => {
      const mySids = 3;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(1);
    });

    it('returns properly formatted utxo sids data for a single sid in an array', async () => {
      const mySids = [3];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(1);
    });

    it('returns properly formatted utxo sids data response is undefined', async () => {
      const mySids = undefined;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(0);
    });

    it('returns an error in case of a server error and does not return response', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getRelatedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getUtxo', () => {
    const sid = 42;
    const url = `${hostUrl}:8668/utxo_sid/${sid}`;

    it('returns properly formatted utxo data', async () => {
      const myUtxo = {
        id: 1,
        record: { foo: 'bar' },
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myUtxoResponse));
        }),
      );

      const dataResult = await network.getUtxo(sid, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('utxo');

      const { utxo } = response!;

      expect(utxo).toHaveProperty('record');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getUtxo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getUtxo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getOwnerMemo', () => {
    const sid = 1234342;
    const url = `${hostUrl}:8667/get_owner_memo/${sid}`;

    it('returns properly formatted owner memo data', async () => {
      const myLock = {
        ciphertext: 'foo',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ephemeral_public_key: 'bar',
      };

      const myResponse = {
        lock: myLock,
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.getOwnerMemo(sid, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('lock');

      const { lock } = response!;

      expect(lock).toHaveProperty('ciphertext');
      expect(lock).toHaveProperty('ephemeral_public_key');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getOwnerMemo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getOwnerMemo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getStateCommitment', () => {
    const url = `${hostUrl}:8668/global_state`;

    it('returns properly formatted data', async () => {
      const myResponse = [[1, 2, 3], 45, 'foobar'];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.getStateCommitment(testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      const [first, height, third] = response!;

      expect(Array.isArray(first)).toEqual(true);
      expect(height).toEqual(45);
      expect(third).toEqual('foobar');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getStateCommitment(testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getStateCommitment(testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getSubmitTransactionData', () => {
    it('return empty tx data with no data given to the input', () => {
      const txData = network.getSubmitTransactionData();
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return empty tx data with empty string given to the input', () => {
      const givenData = '';
      const txData = network.getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return given string parsed as number', () => {
      const givenData = '1234';
      const txData = network.getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: 1234 });
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123,
      };
      const txData = network.getSubmitTransactionData(JSON.stringify(givenData));
      expect(txData).toEqual({ response: givenData });
    });
    it('return properly formatted error', () => {
      const givenData = '124343hh s';
      const txData = network.getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return properly formatted error for mailformed json', () => {
      const givenData = '{f:1}';
      const txData = network.getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123434343434343435343434343434242342342432,
      };
      const txData = network.getSubmitTransactionData(JSON.stringify(givenData));

      const {
        response: { barfoo },
      } = txData;

      expect(barfoo instanceof BigNumber).toEqual(true);
    });
  });

  describe('submitTransaction', () => {
    const url = `${hostUrl}:8669/submit_transaction`;

    it('returns properly formatted response', async () => {
      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
      const myData = { foo: myResponse };

      server.use(
        rest.post(url, (_req, res, ctx) => {
          const { foo } = _req.body as {
            foo: string;
          };
          return res(ctx.json(foo));
        }),
      );

      const spy = jest.spyOn(network, 'getSubmitTransactionData');
      const spyPost = jest.spyOn(network, 'apiPost');

      const myNewData = JSON.stringify(myData);
      const dataResult = await network.submitTransaction(myNewData, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
      expect(dataResult.response).toBe(myResponse);

      expect(spy).toHaveBeenCalledWith(myNewData);
      expect(spy).toReturnWith({ response: myData });
      expect(spyPost).toHaveBeenCalledWith(url, myData, testConfig);
    });

    it('returns properly formatted response with no input data', async () => {
      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';

      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.submitTransaction(undefined, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.submitTransaction('', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.submitTransaction('', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getAssetToken', () => {
    const assetCode = 'foo';
    const url = `${hostUrl}:8668/asset_token/${assetCode}`;

    it('returns properly formatted data', async () => {
      const assetProperties = {
        code: 1,
        issuer: 2,
        asset_rules: [],
      };

      const myResponse = {
        properties: assetProperties,
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.getAssetToken(assetCode, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('properties');

      const { properties } = response!;

      expect(properties).toHaveProperty('code');
      expect(properties).toHaveProperty('issuer');
      expect(properties).toHaveProperty('asset_rules');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getAssetToken(assetCode, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getAssetToken(assetCode, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getIssuedRecords', () => {
    const address = 'foo';
    const url = `${hostUrl}:8667/get_issued_records/${address}`;

    it('returns properly formatted data', async () => {
      const issuedRecord = [
        {
          id: 1,
          record: 'foo',
        },
        null,
      ];

      const myResponse = [issuedRecord];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.getIssuedRecords(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toBe(1);

      const [firstRecord] = response!;

      expect(firstRecord.length).toBe(2);
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getIssuedRecords(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getIssuedRecords(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getTransactionStatus', () => {
    const handle = 'foo';
    const url = `${hostUrl}:8669/txn_status/${handle}`;

    it('returns properly formatted data', async () => {
      const myResponse = {
        Committed: [1, [1, 2, 3]],
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.getTransactionStatus(handle, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('Committed');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getTransactionStatus(handle, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getTransactionStatus(handle, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getBlock', () => {
    const height = 12;
    const url = `${hostUrl}:26657/block`;

    it('returns properly formatted data', async () => {
      const myResponse = {
        result: {
          block_id: {
            hash: '123',
          },
        },
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const spy = jest.spyOn(network, 'apiGet');

      const dataResult = await network.getBlock(height, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('result');

      const { result } = response!;

      expect(result).toHaveProperty('block_id');

      expect(spy).toHaveBeenCalledWith(url, {
        ...testConfig,
        params: { height },
      });

      spy.mockRestore();
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getBlock(height, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getBlock(height, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getHashSwap', () => {
    const hash = 'abc123';
    const url = `${hostUrl}:26657/tx_search`;

    it('returns properly formatted data', async () => {
      const myResponse = {
        result: {
          txs: [{ foo: 'bar' }],
          total_count: 1,
        },
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const spy = jest.spyOn(network, 'apiGet');

      const dataResult = await network.getHashSwap(hash, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('result');

      const { result } = response!;

      expect(result).toHaveProperty('total_count');
      expect(result).toHaveProperty('txs');

      const { txs, total_count } = result!;

      expect(txs?.length).toBe(1);
      expect(total_count).toBe(1);

      expect(spy).toHaveBeenCalledWith(url, {
        ...testConfig,
        params: { query: `"tx.prehash='${hash}'"` },
      });

      spy.mockRestore();
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getHashSwap(hash, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getHashSwap(hash, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getTxList', () => {
    const address = 'foo';
    const type = 'to';
    const page = 1;
    const url = `${hostUrl}:26657/tx_search`;

    it('returns properly formatted data with default page equals to 1 and check type = "to"', async () => {
      const myResponse = {
        result: {
          txs: [{ foo: 'bar' }],
          total_count: 1,
        },
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const spy = jest.spyOn(network, 'apiGet');

      const dataResult = await network.getTxList(address, type);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('result');

      const { result } = response!;

      expect(result).toHaveProperty('total_count');
      expect(result).toHaveProperty('txs');

      const { txs, total_count } = result!;

      expect(txs?.length).toBe(1);
      expect(total_count).toBe(1);

      expect(spy).toHaveBeenCalledWith(url, {
        params: {
          order_by: '"desc"',
          page: 1,
          per_page: 10,
          query: '"addr.to.foo=\'y\'"',
        },
      });

      spy.mockRestore();
    });

    it('returns properly formatted data with given page and check type = "from"', async () => {
      const myResponse = {
        result: {
          txs: [{ foo: 'bar' }],
          total_count: 1,
        },
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const spy = jest.spyOn(network, 'apiGet');

      const dataResult = await network.getTxList(address, 'from', 2, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('result');

      const { result } = response!;

      expect(result).toHaveProperty('total_count');
      expect(result).toHaveProperty('txs');

      const { txs, total_count } = result!;

      expect(txs?.length).toBe(1);
      expect(total_count).toBe(1);

      expect(spy).toHaveBeenCalledWith(url, {
        ...testConfig,
        params: {
          order_by: '"desc"',
          page: 2,
          per_page: 10,
          query: '"addr.from.foo=\'y\'"',
        },
      });

      spy.mockRestore();
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getTxList(address, type, page, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getTxList(address, type, page, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getTransactionDetails', () => {
    const hash = 'abc123';
    const url = `${hostUrl}:26657/tx`;

    it('returns properly formatted data', async () => {
      const myResponse = {
        result: {
          tx: 'assd123abcdf',
        },
      };

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const spy = jest.spyOn(network, 'apiGet');

      const dataResult = await network.getTransactionDetails(hash, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toHaveProperty('result');

      const { result } = response!;

      expect(result).toHaveProperty('tx');

      const { tx } = result!;

      expect(tx).toEqual('assd123abcdf');

      expect(spy).toHaveBeenCalledWith(url, {
        ...testConfig,
        params: { hash: `0x${hash}` },
      });

      spy.mockRestore();
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.getTransactionDetails(hash, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.getTransactionDetails(hash, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });
});
