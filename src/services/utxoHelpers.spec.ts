import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { Keypair } from '../api';
import { decryptUtxoItem, getUtxoItem } from './utxoHelper';

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

      const utxoItem = await decryptUtxoItem(sid, walletInfo, myUtxoResponse);

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

    it('returns decrypted utxo with confidential amount aaa', async () => {
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

      const utxoItem = await decryptUtxoItem(123, walletInfo, myUtxoResponse, myMemoResponse);

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

      await expect(decryptUtxoItem(sid, walletInfo, myUtxoResponse)).rejects.toThrowError(
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

      await expect(decryptUtxoItem(sid, walletInfo, myUtxoResponse, myMemo)).rejects.toThrowError(
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

      await expect(decryptUtxoItem(123, walletInfo, myUtxoResponse)).rejects.toThrowError(
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

      const utxoItem = await getUtxoItem(sid, walletInfo);

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

      await expect(getUtxoItem(sid, walletInfo)).rejects.toThrowError(
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

      await expect(getUtxoItem(sid, walletInfo)).rejects.toThrowError(
        `Could not fetch memo data for sid "${sid}"`,
      );
    });
  });
});
