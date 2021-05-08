/* eslint-disable @typescript-eslint/naming-convention */
import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { Keypair } from '../api';
import Cache from './cacheStore/factory';
import { FileCacheProvider as CacheProvider } from './cacheStore/providers';
import * as utxoHelper from './utxoHelper';
import { UtxoOutputItem } from './utxoHelper';

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

describe('utxoHelpers', () => {
  const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
  const password = '123';

  const sid = 454;

  const myMemoResponse = null;

  const memoUrl = `https://dev-staging.dev.findora.org:8667/get_owner_memo/${sid}`;

  const utxoUrl = `https://dev-staging.dev.findora.org:8668/utxo_sid/${sid}`;

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

  describe('decryptUtxoItem', () => {
    it('returns decrypted utxo with no confidential data', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      const utxoItem = await utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse);

      expect(utxoItem).toHaveProperty('address');
      expect(utxoItem).toHaveProperty('sid');
      expect(utxoItem).toHaveProperty('body');
      expect(utxoItem).toHaveProperty('utxo');

      expect(utxoItem.address).toBe(walletInfo.address);
      expect(utxoItem.sid).toBe(sid);

      const { body, utxo } = utxoItem;

      expect(body.amount).toBe(BigInt(40000));
      expect(utxo).toEqual(myUtxo);
    });

    it('returns decrypted utxo with confidential amount', async () => {
      const confidentialAmount = {
        Confidential: [
          'GrOFu0uL12arzxX0VX_OzWUcD6EVrFylYaMxW655J1Q=',
          '2qEe9-g-_QU37Zo9ORntvWNMIgStcPwMU4M7xInaMDw=',
        ],
      };

      const nonConfidentialAssetTypeForConfidentialAmount = {
        NonConfidential: [
          34,
          181,
          173,
          185,
          119,
          123,
          217,
          243,
          157,
          237,
          25,
          202,
          18,
          58,
          14,
          226,
          238,
          14,
          199,
          207,
          135,
          224,
          166,
          72,
          217,
          192,
          39,
          190,
          208,
          246,
          125,
          30,
        ],
      };

      const myUtxoRecord = {
        amount: confidentialAmount,
        asset_type: nonConfidentialAssetTypeForConfidentialAmount,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      const myMemoResponse = {
        blind_share: 'RcBYIEfTHDkcN1FyZQcs6njZJDIcg77Z5__n0Akw2rU=',
        lock: {
          ciphertext: 'aQ4xI7bTJ9M=',
          ephemeral_public_key: 'at5YwOCjADbFAKkp2GTTVu_jbOSpEP9yVLREXvjQGi8=',
        },
      };

      const utxoItem = await utxoHelper.decryptUtxoItem(123, walletInfo, myUtxoResponse, myMemoResponse);

      expect(utxoItem).toHaveProperty('address');
      expect(utxoItem).toHaveProperty('sid');
      expect(utxoItem).toHaveProperty('body');
      expect(utxoItem).toHaveProperty('utxo');

      expect(utxoItem.address).toBe(walletInfo.address);
      expect(utxoItem.sid).toBe(123);

      const { body, utxo } = utxoItem;

      expect(body.amount).toBe(BigInt(5000000)); //
      expect(body.amount_blinds.length).toBe(2); //
      expect(utxo).toEqual(myUtxo);
    });

    it('throws an error if failed to get client asset record', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'aa',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      await expect(utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse)).rejects.toThrowError(
        'Can not get client asset record',
      );
    });

    it('throws an error if failed to decode owner memo', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      const myMemo = {
        blind_share: '2',
        lock: {
          ciphertext: 'foo',
          ephemeral_public_key: 'bar',
        },
      };

      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      await expect(utxoHelper.decryptUtxoItem(sid, walletInfo, myUtxoResponse, myMemo)).rejects.toThrowError(
        'Can not decode owner memo',
      );
    });

    it('throws an error when cant open client asset record to decode', async () => {
      const confidentialAmount = {
        Confidential: [
          'GrOFu0uL12arzxX0VX_OzWUcD6EVrFylYaMxW655J1Q=',
          '2qEe9-g-_QU37Zo9ORntvWNMIgStcPwMU4M7xInaMDw=',
        ],
      };

      const nonConfidentialAssetTypeForConfidentialAmount = {
        NonConfidential: [
          34,
          181,
          173,
          185,
          119,
          123,
          217,
          243,
          157,
          237,
          25,
          202,
          18,
          58,
          14,
          226,
          238,
          14,
          199,
          207,
          135,
          224,
          166,
          72,
          217,
          192,
          39,
          190,
          208,
          246,
          125,
          30,
        ],
      };

      const myUtxoRecord = {
        amount: confidentialAmount,
        asset_type: nonConfidentialAssetTypeForConfidentialAmount,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myUtxoResponse = {
        utxo: myUtxo,
      };

      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      await expect(utxoHelper.decryptUtxoItem(123, walletInfo, myUtxoResponse)).rejects.toThrowError(
        'Can not open client asset record to decode',
      );
    });
  });

  describe('getUtxoItem', () => {
    const myUtxoRecord = {
      amount: { NonConfidential: '40000' },
      asset_type: nonConfidentialAssetType,
      public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
    };

    const myUtxo = {
      id: 1,
      record: myUtxoRecord,
    };

    const myUtxoResponse = {
      utxo: myUtxo,
    };

    it('returns properly formatted response data', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      server.use(
        rest.get(utxoUrl, (_req, res, ctx) => {
          return res(ctx.json(myUtxoResponse));
        }),
        rest.get(memoUrl, (_req, res, ctx) => {
          return res(ctx.json(myMemoResponse));
        }),
      );

      const utxoItem = await utxoHelper.getUtxoItem(sid, walletInfo);

      expect(utxoItem).toHaveProperty('address');
      expect(utxoItem).toHaveProperty('sid');
      expect(utxoItem).toHaveProperty('body');
      expect(utxoItem).toHaveProperty('utxo');

      expect(utxoItem.address).toBe(walletInfo.address);
      expect(utxoItem.sid).toBe(sid);

      const { body, utxo } = utxoItem;

      expect(body.amount).toBe(BigInt(40000));
      expect(utxo).toEqual(myUtxo);
    });

    it('throws an error if it cant fech utxo data', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      server.use(
        rest.get(utxoUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      await expect(utxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrowError(
        `Could not fetch utxo data for sid "${sid}"`,
      );
    });

    it('throws an error if it cant fech memo data', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      server.use(
        rest.get(utxoUrl, (_req, res, ctx) => {
          return res(ctx.json(myUtxoResponse));
        }),
        rest.get(memoUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      await expect(utxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrowError(
        `Could not fetch memo data for sid "${sid}"`,
      );
    });
  });

  describe('addUtxo', () => {
    const myUtxoRecord = {
      amount: { NonConfidential: '40000' },
      asset_type: nonConfidentialAssetType,
      public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
    };

    const myUtxo = {
      id: 1,
      record: myUtxoRecord,
    };

    const myUtxoResponse = {
      utxo: myUtxo,
    };

    server.use(
      rest.get(utxoUrl, (_req, res, ctx) => {
        return res(ctx.json(myUtxoResponse));
      }),
      rest.get(memoUrl, (_req, res, ctx) => {
        return res(ctx.json(myMemoResponse));
      }),
    );

    it('return a list with utxo items', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      const sids = [sid, sid];
      const spyGetUtxoItem = jest.spyOn(utxoHelper, 'getUtxoItem');
      const spyCacheProviderRead = jest.spyOn(CacheProvider, 'read');

      spyCacheProviderRead.mockReturnValue(Promise.resolve({ foo: 'bar', sid_454: { sid } }));

      const utxoDataList = await utxoHelper.addUtxo(walletInfo, sids);

      expect(spyCacheProviderRead).toHaveBeenCalledTimes(1);
      expect(spyGetUtxoItem).toHaveBeenCalledTimes(2);

      expect(utxoDataList.length).toEqual(2);
    });

    it('throws an error if fails to read the cache', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      const sids = [sid];
      jest.spyOn(Cache, 'read').mockRejectedValue(new Error('barfoo'));

      await expect(utxoHelper.addUtxo(walletInfo, sids)).rejects.toThrowError(
        `Error reading the cache, "barfoo"`,
      );
    });

    it('continues iterating through sids if it cant fetch utxo for a giving sid, and skips it', async () => {
      const walletInfo = await Keypair.restorePrivatekeypair(pkey, password);

      const sids = [sid, sid];
      jest.spyOn(Cache, 'read').mockReturnValue(Promise.resolve({ foo: 'bar', sid_454: { sid } }));
      jest.spyOn(utxoHelper, 'getUtxoItem').mockRejectedValueOnce(new Error('barfoo'));

      const utxoDataList = await utxoHelper.addUtxo(walletInfo, sids);

      expect(utxoDataList.length).toEqual(1);
    });
  });

  describe('getSendUtxo', () => {
    it('returns a list with three items', () => {
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
            amount: 2,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 1,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
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
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 3,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 13,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(13);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(3);

      const [first, second, third] = sendUtxoList;

      expect(first.amount).toEqual(BigInt(2));
      expect(first.sid).toEqual(4);
      expect(second.amount).toEqual(BigInt(10));
      expect(second.sid).toEqual(1);
      expect(third.amount).toEqual(BigInt(1));
      expect(third.sid).toEqual(2);
    });

    it('returns a list with two items', () => {
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
          sid: 1,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
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
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 3,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 13,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 4,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 2,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(13);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(2);

      const [first, second] = sendUtxoList;

      expect(first.amount).toEqual(BigInt(10));
      expect(first.sid).toEqual(1);
      expect(second.amount).toEqual(BigInt(3));
      expect(second.sid).toEqual(2);
    });

    it('returns an list with one item', () => {
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
          sid: 2,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 3,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 13,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 4,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 2,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 1,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 10,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(10);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(1);

      const [first] = sendUtxoList;

      expect(first.amount).toEqual(BigInt(10));
      expect(first.sid).toEqual(2);
    });

    it('returns an empty for an unexisting code', () => {
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
          sid: 2,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCodeOne',
            amount: 12,
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

      const myAmount = BigInt(10);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(0);
    });

    it('returns a list with three items skiping other asset codes', () => {
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
          sid: 1,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
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
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 4,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCodeOne',
            amount: 2,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
        {
          sid: 3,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 13,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(25);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(3);

      const [first, second, third] = sendUtxoList;

      expect(first.amount).toEqual(BigInt(10));
      expect(first.sid).toEqual(1);
      expect(second.amount).toEqual(BigInt(12));
      expect(second.sid).toEqual(2);
      expect(third.amount).toEqual(BigInt(3));
      expect(third.sid).toEqual(3);
    });

    it('returns an empty for a given zero amount', () => {
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
          sid: 2,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(0);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(0);
    });

    it('returns a single item list for amount less than sid amount', () => {
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
          sid: 2,
          public_key: 'foo',
          address: 'bar',
          body: {
            asset_type: 'myAssetCode',
            amount: 12,
          },
          ownerMemo: undefined,
          utxo: myUtxo,
        },
      ];

      const myAmount = BigInt(1);
      const sendUtxoList = utxoHelper.getSendUtxo('myAssetCode', myAmount, myUtxoDataList);

      expect(sendUtxoList.length).toEqual(1);

      const [first] = sendUtxoList;

      expect(first.amount).toEqual(BigInt(1));
      expect(first.sid).toEqual(2);
    });
  });

  describe('addUtxoInputs', () => {
    it('returns a proper list with utxo inputs', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const mySendUtxoList: UtxoOutputItem[] = [
        {
          amount: BigInt(1),
          originAmount: BigInt(100),
          sid: 1,
          utxo: myUtxo,
          ownerMemo: undefined,
        },
        {
          amount: BigInt(2),
          originAmount: BigInt(5),
          sid: 2,
          utxo: myUtxo,
          ownerMemo: undefined,
        },
      ];

      const utxoInputsInfo = await utxoHelper.addUtxoInputs(mySendUtxoList);

      expect(utxoInputsInfo).toHaveProperty('inputParametersList');
      expect(utxoInputsInfo).toHaveProperty('inputAmount');
      const { inputAmount, inputParametersList } = utxoInputsInfo;

      expect(inputAmount).toEqual(BigInt(105));
      expect(inputParametersList.length).toEqual(2);

      const [first, second] = inputParametersList;

      expect(first.amount).toEqual(BigInt(1));
      expect(second.amount).toEqual(BigInt(2));
    });

    it('returns an empty list for a given send utxo list', async () => {
      const mySendUtxoList: UtxoOutputItem[] = [];

      const utxoInputsInfo = await utxoHelper.addUtxoInputs(mySendUtxoList);

      expect(utxoInputsInfo).toHaveProperty('inputParametersList');
      expect(utxoInputsInfo).toHaveProperty('inputAmount');
      const { inputAmount, inputParametersList } = utxoInputsInfo;

      expect(inputAmount).toEqual(BigInt(0));
      expect(inputParametersList.length).toEqual(0);
    });

    it('throws an error when fails to get txRef', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myItem = {
        amount: BigInt(1),
        originAmount: BigInt(100),
        sid: Number('foobar'),
        utxo: myUtxo,
        ownerMemo: undefined,
      };

      const mySendUtxoList = [myItem];

      await expect(utxoHelper.addUtxoInputs(mySendUtxoList)).rejects.toThrowError(
        'Cannot convert given sid id to a BigInt',
      );
    });

    it('throws an error when fails to get txRef', async () => {
      const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'barfoo=',
      };

      const myUtxo = {
        id: 1,
        record: myUtxoRecord,
      };

      const myItem = {
        amount: BigInt(1),
        originAmount: BigInt(100),
        sid: 1,
        utxo: myUtxo,
        ownerMemo: undefined,
      };

      const mySendUtxoList = [myItem];

      await expect(utxoHelper.addUtxoInputs(mySendUtxoList)).rejects.toThrowError(
        'Can not get client asset record',
      );
    });
  });
});
