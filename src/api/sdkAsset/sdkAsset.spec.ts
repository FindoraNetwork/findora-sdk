import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { Keypair } from '../../api';
import { CACHE_ENTRIES } from '../../config/cache';
import Sdk from '../../Sdk';
import Cache from '../../services/cacheStore/factory';
import { FileCacheProvider, MemoryCacheProvider } from '../../services/cacheStore/providers';
import { defineAsset, getRandomAssetCode, issueAsset } from './sdkAsset';

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

describe('sdkAsset', () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';
  const hostUrl = 'https://foo.bar';

  const globalState = [1, 234];

  const sdkEnv = {
    hostUrl,
    cacheProvider: MemoryCacheProvider,
    cachePath: '.',
  };

  Sdk.init(sdkEnv);

  const sids = [
    419,
    339,
    501,
    1094,
    755,
    1086,
    465,
    526,
    627,
    264,
    483,
    610,
    992,
    998,
    1066,
    1089,
    659,
    619,
    553,
    562,
    1048,
    538,
    1051,
    1054,
    459,
    454,
    585,
    680,
    702,
    734,
    1092,
    466,
    601,
    513,
    460,
    344,
    471,
    922,
    447,
    453,
    544,
    507,
    618,
    495,
    1083,
    780,
    930,
    580,
    995,
    1045,
    569,
    426,
    1057,
    354,
    1077,
    382,
    502,
    576,
    561,
    477,
    519,
    484,
    448,
    592,
    1060,
    1063,
    637,
    586,
    329,
    508,
    570,
    712,
    1080,
    520,
    472,
    531,
    537,
    489,
    490,
    496,
    1091,
    1079,
    514,
    478,
    525,
    532,
    334,
  ];

  describe('defineAsset', () => {
    it('defines asset', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const param = {
        memo: 'memo1',
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { memo, traceable, transferable, updatable } = param;

      const { code, maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      const handle = await defineAsset(walletInfo, code, memo, assetRules);

      expect(handle).toBe(myResponse);
    });
    it('throws an error when submit handle is missing', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      const myResponse = null;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const param = {
        memo: 'memo1',
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { memo, traceable, transferable, updatable } = param;

      const { code, maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      await expect(defineAsset(walletInfo, code, memo, assetRules)).rejects.toThrowError(
        'Could not define asset - submit handle is missing',
      );
    });
    it('throws an error when cant submit define asset transaction', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const param = {
        memo: 'memo1',
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { memo, traceable, transferable, updatable } = param;

      const { code, maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      await expect(defineAsset(walletInfo, code, memo, assetRules)).rejects.toThrowError(
        'Could not submit define asset transaction',
      );
    });
    it('throws an error when fails to submit a transaction', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const param = {
        memo: 'memo1',
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { memo, traceable, transferable, updatable } = param;

      const { code, maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      await expect(defineAsset(walletInfo, code, memo, assetRules)).rejects.toThrowError(
        'Could not submit define asset transaction',
      );
    });
    it('throws an error when cant get a transaction builder', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const givenAsset = { decimals: 6, maxNumbers: undefined };

      const param = {
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { traceable, transferable, updatable } = param;

      const { maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      await expect(defineAsset(walletInfo, 'aa', 'a', assetRules)).rejects.toThrowError(
        'Could not get "defineTransactionBuilder"',
      );
    });
    it('throws an error when cant create transfer operation', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json([434]));
        }),
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const param = {
        memo: 'memo1',
        traceable: false,
        transferable: true,
        updatable: true,
      };

      const { memo, traceable, transferable, updatable } = param;

      const { code, maxNumbers, decimals } = givenAsset;

      const assetRules = { transferable, updatable, decimals, traceable, maxNumbers };

      await expect(defineAsset(walletInfo, code, memo, assetRules)).rejects.toThrowError(
        'Could not create transfer operation',
      );
    });
  });

  describe('issueAsset', () => {
    it('issues asset', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const { code } = givenAsset;

      const assetBlindRules = { isAmountBlind: false };

      const handle = await issueAsset(walletInfo, code, 2, assetBlindRules);

      expect(handle).toBe(myResponse);
    });
    it('throws an error when submit handle is missing', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      const myResponse = null;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const { code } = givenAsset;

      const assetBlindRules = { isAmountBlind: false };

      await expect(issueAsset(walletInfo, code, 2, assetBlindRules)).rejects.toThrowError(
        'Could not issue asset - submit handle is missing',
      );
    });
    it('throws an error when cant submit issue asset transaction', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const { code } = givenAsset;

      const assetBlindRules = { isAmountBlind: false };

      await expect(issueAsset(walletInfo, code, 2, assetBlindRules)).rejects.toThrowError(
        'Could not submit issue asset transaction',
      );
    });
    it('throws an error when fails to submit a transaction', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
      const postUrl = `${hostUrl}:8669/submit_transaction`;
      const globalStateUrl = `${hostUrl}:8668/global_state`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
        rest.get(globalStateUrl, (_req, res, ctx) => {
          return res(ctx.json(globalState));
        }),
        rest.post(postUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const { code } = givenAsset;

      const assetBlindRules = { isAmountBlind: false };

      await expect(issueAsset(walletInfo, code, 2, assetBlindRules)).rejects.toThrowError(
        'Could not submit issue asset transaction',
      );
    });
    it('throws an error when cant get a transaction builder', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
      );

      const utxoDataCache = await Cache.read(`./test_utxo_fixture_list.json`, FileCacheProvider);

      await Cache.write(
        `./${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`,
        utxoDataCache,
        MemoryCacheProvider,
      );

      const assetBlindRules = { isAmountBlind: false };

      await expect(issueAsset(walletInfo, 'aaa', 2, assetBlindRules)).rejects.toThrowError(
        'Could not get "issueAssetTransactionBuilder"',
      );
    });

    it('throws an error when cant create transfer operation', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
      const getSidsUrl = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(getSidsUrl, (_req, res, ctx) => {
          return res(ctx.json([434]));
        }),
      );

      const assetCode = await getRandomAssetCode();

      const givenAsset = { code: assetCode, decimals: 6, maxNumbers: undefined };

      const { code } = givenAsset;

      const assetBlindRules = { isAmountBlind: false };

      await expect(issueAsset(walletInfo, code, 2, assetBlindRules)).rejects.toThrowError(
        'Could not create transfer operation',
      );
    });
  });
});