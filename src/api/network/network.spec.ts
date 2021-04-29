import '@testing-library/jest-dom/extend-expect';

import BigNumber from 'bignumber.js';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  apiGet,
  apiPost,
  getOwnedSids,
  getOwnerMemo,
  getStateCommitment,
  getSubmitTransactionData,
  getUtxo,
  submitTransaction,
} from './network';

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

  describe('apiGet', () => {
    it('returns properly formatted response data', async () => {
      const dataResult = await apiGet(defaultUrl, testConfig);

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

      const dataResult = await apiGet(defaultUrl, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('apiPost', () => {
    const data = { foo: 'bar' };
    const myHandle = 'foobar';

    it('returns properly formatted response data', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.json(myHandle));
        }),
      );

      const dataResult = await apiPost(defaultUrl, data, testConfig);

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

      const dataResult = await apiPost(defaultUrl, undefined, testConfig);

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

      const dataResult = await apiPost(defaultUrl, data, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getOwnedSids', () => {
    const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
    const url = `https://dev-staging.dev.findora.org:8667/get_owned_utxos/${address}`;

    it('returns properly formatted utxo sids data', async () => {
      const mySids = [3, 4, 5];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(mySids));
        }),
      );

      const dataResult = await getOwnedSids(address, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response!.length).toEqual(3);
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await getOwnedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await getOwnedSids(address, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getUtxo', () => {
    const sid = 42;
    const url = `https://dev-staging.dev.findora.org:8668/utxo_sid/${sid}`;

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

      const dataResult = await getUtxo(sid, testConfig);

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

      const dataResult = await getUtxo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await getUtxo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getOwnerMemo', () => {
    const sid = 1234342;
    const url = `https://dev-staging.dev.findora.org:8667/get_owner_memo/${sid}`;

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

      const dataResult = await getOwnerMemo(sid, testConfig);

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

      const dataResult = await getOwnerMemo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await getOwnerMemo(sid, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getStateCommitment', () => {
    const url = `https://dev-staging.dev.findora.org:8668/global_state`;

    it('returns properly formatted data', async () => {
      const myResponse = [[1, 2, 3], 45, 'foobar'];

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await getStateCommitment(testConfig);

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

      const dataResult = await getStateCommitment(testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await getStateCommitment(testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getSubmitTransactionData', () => {
    it('return empty tx data with no data given to the input', () => {
      const txData = getSubmitTransactionData();
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return empty tx data with empty string given to the input', () => {
      const givenData = '';
      const txData = getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return given string parsed as number', () => {
      const givenData = '1234';
      const txData = getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: 1234 });
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123,
      };
      const txData = getSubmitTransactionData(JSON.stringify(givenData));
      expect(txData).toEqual({ response: givenData });
    });
    it('return properly formatted error', () => {
      const givenData = '124343hh s';
      const txData = getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return properly formatted error for mailformed json', () => {
      const givenData = '{f:1}';
      const txData = getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123434343434343435343434343434242342342432,
      };
      const txData = getSubmitTransactionData(JSON.stringify(givenData));

      const {
        response: { barfoo },
      } = txData;

      expect(barfoo instanceof BigNumber).toEqual(true);
    });
  });

  describe('submitTransaction', () => {
    const url = `https://dev-staging.dev.findora.org:8669/submit_transaction`;

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

      const dataResult = await submitTransaction(JSON.stringify(myData), testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
      expect(dataResult.response).toBe(myResponse);
    });

    it('returns properly formatted response with no input data', async () => {
      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';

      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await submitTransaction(undefined, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await submitTransaction('', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await submitTransaction('', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });
});
