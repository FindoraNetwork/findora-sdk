import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { apiGet, apiPost, getOwnedSids } from './network';

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

    it('returns properly formatted response data', async () => {
      const myHandle = 'foobar';

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
});
