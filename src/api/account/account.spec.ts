import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import * as Keypair from '../../api/keypair';
import Sdk from '../../Sdk';
import * as bigNumber from '../../services/bigNumber';
import { MemoryCacheProvider } from '../../services/cacheStore/providers';
import * as utxoHelper from '../../services/utxoHelper';
import * as Account from './account';

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

describe('account', () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';
  const sids = [454];

  const hostUrl = 'https://foo.bar';

  const sdkEnv = {
    hostUrl,
    cacheProvider: MemoryCacheProvider,
    cachePath: '.',
  };

  Sdk.init(sdkEnv);

  const nonConfidentialAssetType = {
    NonConfidential: [
      164,
      219,
      150,
      105,
      103,
      223,
      148,
      3,
      154,
      18,
      158,
      146,
      195,
      186,
      148,
      245,
      191,
      206,
      45,
      215,
      251,
      136,
      179,
      245,
      227,
      140,
      98,
      176,
      190,
      60,
      175,
      224,
    ],
  };

  const myUtxoRecord = {
    amount: { NonConfidential: '40000' },
    asset_type: nonConfidentialAssetType,
    public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
  };

  const myUtxo = {
    id: 1,
    record: myUtxoRecord,
  };

  const myUtxoDataList = [
    {
      sid: 4,
      public_key: 'foo',
      address: 'bar',
      body: {
        asset_type: 'myAssetCode',
        amount: 200000,
      },
      ownerMemo: undefined,
      utxo: myUtxo,
    },
    {
      sid: 1,
      public_key: 'foo',
      address: 'bar',
      body: {
        asset_type: 'myAssetCodeTwo',
        amount: 10,
      },
      ownerMemo: undefined,
      utxo: myUtxo,
    },
    {
      sid: 2,
      public_key: 'foo',
      address: 'bar',
      body: {
        asset_type: 'myAssetCode',
        amount: 1,
      },
      ownerMemo: undefined,
      utxo: myUtxo,
    },
    {
      sid: 3,
      public_key: 'foo',
      address: 'bar',
      body: {
        asset_type: 'myAssetCodeTwo',
        amount: 13,
      },
      ownerMemo: undefined,
      utxo: myUtxo,
    },
  ];

  describe('getAssetBalance', () => {
    it('returns asset balance for first code', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));

      const balanceInWei = await Account.getAssetBalance(walletInfo, 'myAssetCode', sids);

      const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

      expect(balance).toEqual('0.200001');
    });

    it('returns asset balance for second code', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));

      const balanceInWei = await Account.getAssetBalance(walletInfo, 'myAssetCodeTwo', sids);

      const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

      expect(balance).toEqual('0.000023');
    });

    it('returns asset balance if no sid with the given code exists', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));

      const balanceInWei = await Account.getAssetBalance(walletInfo, 'nonExistingCode', sids);

      const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

      expect(balance).toEqual('0.000000');
    });

    it('returns asset balance if sids list is empty', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValue(Promise.resolve([]));

      const balanceInWei = await Account.getAssetBalance(walletInfo, 'nonExistingCode', []);

      const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);

      expect(balance).toEqual('0.000000');
    });

    it('throws an error when could not get utxoDataList', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValue(Promise.reject(new Error('foo')));

      await expect(Account.getAssetBalance(walletInfo, 'nonExistingCode', [])).rejects.toThrowError(
        'Could not get list of addUtxo',
      );
    });
  });

  describe('getBalance', () => {
    it('returns asset balance for first code', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const url = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
      );

      const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
      spyAddUtxo.mockReturnValueOnce(Promise.resolve(myUtxoDataList));

      const balance = await Account.getBalance(walletInfo, 'myAssetCode');

      expect(balance).toEqual('0.200001');
    });

    it('throws an error when no sids were fetched', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const url = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      await expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError(
        'No sids were fetched',
      );
    });

    it('throws an error when getAssetBalance throws an error', async () => {
      const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

      const publickey = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=';

      const url = `${hostUrl}:8667/get_owned_utxos/${publickey}`;

      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(sids));
        }),
      );

      const spyAddUtxo = jest.spyOn(Account, 'getAssetBalance');
      spyAddUtxo.mockImplementation(() => {
        throw new Error('boo');
      });

      await expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError(
        'Could not fetch balance for',
      );
    });
  });
});
