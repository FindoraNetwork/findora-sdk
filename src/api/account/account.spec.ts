import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import * as Keypair from '../../api/keypair/keypair';
import * as SdkAssetApi from '../../api/sdkAsset/sdkAsset';
import * as NetworkTypes from '../../api/network/types';
import * as NetworkApi from '../../api/network/network';
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

describe('account (unit test)', () => {
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
      164, 219, 150, 105, 103, 223, 148, 3, 154, 18, 158, 146, 195, 186, 148, 245, 191, 206, 45, 215, 251,
      136, 179, 245, 227, 140, 98, 176, 190, 60, 175, 224,
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
      memoData: undefined,
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
      memoData: undefined,
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
      memoData: undefined,
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
      memoData: undefined,
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

  describe('create', () => {
    it('creates a keypair', async () => {
      const myFakeKeyPair = { foo: 'bar' } as unknown as Keypair.WalletKeypar;

      const spyCreateKeypair = jest.spyOn(Keypair, 'createKeypair');
      spyCreateKeypair.mockImplementation(() => {
        return Promise.resolve(myFakeKeyPair);
      });

      const result = await Account.create('123');
      expect(result).toBe(myFakeKeyPair);
      spyCreateKeypair.mockRestore();
    });
    it('throws an error if it can not create a keypair', async () => {
      const spyCreateKeypair = jest.spyOn(Keypair, 'createKeypair');
      spyCreateKeypair.mockImplementation(() => {
        throw new Error('abc boom');
      });

      await expect(Account.create('123')).rejects.toThrow('Could not create a new account');
      spyCreateKeypair.mockRestore();
    });
  });

  describe('processIssuedRecordItem', () => {
    it('processes an issued record item', async () => {
      const myAssetCodeHere = 'abcd';

      const spyGetAssetCode = jest.spyOn(SdkAssetApi, 'getAssetCode');
      spyGetAssetCode.mockImplementation(() => {
        return Promise.resolve(myAssetCodeHere);
      });

      const txRecord = {
        foo: 'bar',
        record: {
          asset_type: { NonConfidential: '123' },
        },
      };
      const ownerMemo = 'myOwnerMemo';

      const issuedRecord = [txRecord, ownerMemo] as unknown as NetworkTypes.IssuedRecord;

      const result = await Account.processIssuedRecordItem(issuedRecord);

      const expected = {
        ...txRecord,
        code: myAssetCodeHere,
        ownerMemo,
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('processIssuedRecordList', () => {
    it('processes an issued record item', async () => {
      const myAssetCodeHere = 'abcd';

      const spyGetAssetCode = jest.spyOn(SdkAssetApi, 'getAssetCode');
      spyGetAssetCode.mockImplementation(() => {
        return Promise.resolve(myAssetCodeHere);
      });

      const txRecord = {
        foo: 'bar',
        record: {
          asset_type: { NonConfidential: '123' },
        },
      };
      const ownerMemo = 'myOwnerMemo';

      const issuedRecord = [txRecord, ownerMemo] as unknown as NetworkTypes.IssuedRecord;

      const result = await Account.processIssuedRecordList([issuedRecord]);

      const expected = {
        ...txRecord,
        code: myAssetCodeHere,
        ownerMemo,
      };

      expect(result).toStrictEqual([expected]);
    });
  });

  describe('getCreatedAssets', () => {
    it('returns a list of created assets', async () => {
      const publickey = 'myPublickey';
      const address = 'myAddress';

      const myLightWallet = {
        address,
        publickey,
      };

      const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
      spyGetAddressPublicAndKey.mockImplementation(() => {
        return Promise.resolve(myLightWallet);
      });

      const recordsResponse = { foo: 'bar' } as unknown as NetworkTypes.IssuedRecordResponse;

      const myIssuedRecordResult = {
        response: recordsResponse,
      } as NetworkTypes.IssuedRecordDataResult;

      const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
      spyGetIssuedRecords.mockImplementation(() => {
        return Promise.resolve(myIssuedRecordResult);
      });

      const processedIssuedRecordsList = [
        {
          bar: 'foo',
        } as unknown as Account.ProcessedIssuedRecord,
      ];

      const spyProcessIssuedRecordList = jest.spyOn(Account, 'processIssuedRecordList');
      spyProcessIssuedRecordList.mockImplementation(() => {
        return Promise.resolve(processedIssuedRecordsList);
      });

      const result = await Account.getCreatedAssets(address);

      expect(result).toBe(processedIssuedRecordsList);

      spyGetAddressPublicAndKey.mockRestore();
      spyGetIssuedRecords.mockRestore();
      spyProcessIssuedRecordList.mockRestore();
    });
    it('throws an error if it could not get a list of issued records', async () => {
      const publickey = 'myPublickey';
      const address = 'myAddress';

      const myLightWallet = {
        address,
        publickey,
      };

      const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
      spyGetAddressPublicAndKey.mockImplementation(() => {
        return Promise.resolve(myLightWallet);
      });

      const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
      spyGetIssuedRecords.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(Account.getCreatedAssets(address)).rejects.toThrow('boom');

      spyGetAddressPublicAndKey.mockRestore();
      spyGetIssuedRecords.mockRestore();
    });
    it('throws an error if there is an error in the issued records result', async () => {
      const publickey = 'myPublickey';
      const address = 'myAddress';

      const myLightWallet = {
        address,
        publickey,
      };

      const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
      spyGetAddressPublicAndKey.mockImplementation(() => {
        return Promise.resolve(myLightWallet);
      });

      const myIssuedRecordResult = {
        error: new Error('gimps'),
      } as NetworkTypes.IssuedRecordDataResult;

      const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
      spyGetIssuedRecords.mockImplementation(() => {
        return Promise.resolve(myIssuedRecordResult);
      });

      await expect(Account.getCreatedAssets(address)).rejects.toThrow('No issued records were fetched');

      spyGetAddressPublicAndKey.mockRestore();
      spyGetIssuedRecords.mockRestore();
    });
    it('throws an error if there is no response in the issued records result', async () => {
      const publickey = 'myPublickey';
      const address = 'myAddress';

      const myLightWallet = {
        address,
        publickey,
      };

      const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
      spyGetAddressPublicAndKey.mockImplementation(() => {
        return Promise.resolve(myLightWallet);
      });

      const myIssuedRecordResult = {} as NetworkTypes.IssuedRecordDataResult;

      const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
      spyGetIssuedRecords.mockImplementation(() => {
        return Promise.resolve(myIssuedRecordResult);
      });

      await expect(Account.getCreatedAssets(address)).rejects.toThrow('No issued records were fetched');

      spyGetAddressPublicAndKey.mockRestore();
      spyGetIssuedRecords.mockRestore();
    });
  });

  describe('getRelatedSids', () => {
    it('returns a list of related sids', async () => {
      const address = 'myAddress';

      const relatedSids = [1, 2, 3];

      const myResult = { response: relatedSids } as NetworkTypes.OwnedSidsDataResult;

      const spyGetRelatedSids = jest.spyOn(NetworkApi, 'getRelatedSids');
      spyGetRelatedSids.mockImplementation(() => {
        return Promise.resolve(myResult);
      });

      const result = await Account.getRelatedSids(address);

      expect(result).toBe(relatedSids);
      spyGetRelatedSids.mockRestore();
    });
    it('throws an error if no related sids were fetched', async () => {
      const address = 'myAddress';

      const myResult = {} as NetworkTypes.OwnedSidsDataResult;

      const spyGetRelatedSids = jest.spyOn(NetworkApi, 'getRelatedSids');
      spyGetRelatedSids.mockImplementation(() => {
        return Promise.resolve(myResult);
      });

      await expect(Account.getRelatedSids(address)).rejects.toThrow('No related sids were fetched');

      spyGetRelatedSids.mockRestore();
    });
  });
});
