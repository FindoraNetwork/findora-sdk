import '@testing-library/jest-dom/extend-expect';
import * as KeypairApi from '../api/keypair';
import * as NetworkApi from '../api/network/network';
import * as Asset from '../api/sdkAsset/sdkAsset';
import * as NetworkTypes from '../api/network/types';
import * as Fee from './fee';
import * as UtxoHelper from './utxoHelper';
import { TracingPolicies, TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import * as Ledger from './ledger/ledgerWrapper';
import { LedgerForNode } from './ledger/nodeLedger';

// import { WalletKeypar } from '../api/keypair';
// import * as Network from '../api/network';
// import { LedgerUtxo, OwnedMemoResponse, UtxoResponse } from '../api/network/types';
import { CACHE_ENTRIES } from '../config/cache';
import Sdk from '../Sdk';
import Cache from './cacheStore/factory';
import { CacheItem } from './cacheStore/types';
import { getLedger } from './ledger/ledgerWrapper';
import {
  ClientAssetRecord as LedgerClientAssetRecord,
  OwnerMemo as LedgerOwnerMemo,
  TxoRef as LedgerTxoRef,
} from './ledger/types';

import * as NodeLedger from './ledger/nodeLedger';

describe('utxoHelper', () => {
  describe('decryptUtxoItem', () => {
    it('successfully decrypts an utxo item', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };
      const ownerMemo: { b: string; clone: () => {} } = {
        b: 'myOwnerMemo',
        clone: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myAssetType = 'myAssetType';
      const decryptAssetData = {
        asset_type: myAssetType,
        amount: '2',
      };

      const decryptedAsetType = 'myDecryptedAsetType';

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          return assetRecord;
        }),
      };

      const LedgerOwnerMemo = {
        from_json: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
        OwnerMemo: LedgerOwnerMemo,
        open_client_asset_record: jest.fn(() => {
          return decryptAssetData;
        }),
        asset_type_from_jsvalue: jest.fn(() => {
          return decryptedAsetType;
        }),
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
      const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
      const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
      const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');

      const memoDataResult = ({
        response: { foofoo: 'barbar' },
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      const result = await UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData);

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
      expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
      expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);

      expect(result.address).toBe(walletInfo.address);
      expect(result.sid).toBe(sid);
      expect(result.body).toBe(decryptAssetData);
      expect(result.utxo).toStrictEqual(utxoData.utxo);
      expect(result.ownerMemo).toBe(ownerMemo);
      expect(result.memoData).toBe(memoData);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyLedgerOwnerMemoFromJson.mockRestore();
      spyLedgerOpenClientAssetRecord.mockRestore();
      spyLedgerAssetTypeFromJsvalue.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
    it('returns ownerMemo as undefined if no onwner memo data is fetched', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };
      const ownerMemo: { b: string; clone: () => {} } = {
        b: 'myOwnerMemo',
        clone: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myAssetType = 'myAssetType';
      const decryptAssetData = {
        asset_type: myAssetType,
        amount: '2',
      };

      const decryptedAsetType = 'myDecryptedAsetType';

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          return assetRecord;
        }),
      };

      const LedgerOwnerMemo = {
        from_json: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
        OwnerMemo: LedgerOwnerMemo,
        open_client_asset_record: jest.fn(() => {
          return decryptAssetData;
        }),
        asset_type_from_jsvalue: jest.fn(() => {
          return decryptedAsetType;
        }),
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
      const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
      const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
      const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');

      const memoDataResult = ({
        response: undefined,
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      const result = await UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData);

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).not.toHaveBeenCalled();
      expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, undefined, walletInfo.keypair);
      expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);

      expect(result.address).toBe(walletInfo.address);
      expect(result.sid).toBe(sid);
      expect(result.body).toBe(decryptAssetData);
      expect(result.utxo).toStrictEqual(utxoData.utxo);
      expect(result.ownerMemo).toBe(undefined);
      expect(result.memoData).toBe(memoData);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyLedgerOwnerMemoFromJson.mockRestore();
      spyLedgerOpenClientAssetRecord.mockRestore();
      spyLedgerAssetTypeFromJsvalue.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
    it('throws an error if can not open ledger client record from json', async () => {
      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          throw new Error('boom');
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      await expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow(
        'Can not get client asset record',
      );

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
    });
    it('throws an error if gets an error while trying to get owner memo', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          // throw new Error('boom');
          return assetRecord;
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');

      const memoDataResult = ({
        error: new Error('foo'),
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      await expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow(
        'Could not fetch memo data for sid',
      );

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
    it('throws an error if can not open ledger owner memo from json', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          return assetRecord;
        }),
      };

      const LedgerOwnerMemo = {
        from_json: jest.fn(() => {
          throw new Error('bum');
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
        OwnerMemo: LedgerOwnerMemo,
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
      const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');

      const memoDataResult = ({
        response: { foofoo: 'barbar' },
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      await expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow(
        'Can not decode owner memo',
      );

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyLedgerOwnerMemoFromJson.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
    it('throws an error if can not open ledger open_client_asset_record', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };
      const ownerMemo: { b: string; clone: () => {} } = {
        b: 'myOwnerMemo',
        clone: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myAssetType = 'myAssetType';

      const decryptAssetData = {
        asset_type: myAssetType,
        amount: '2',
      };

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          return assetRecord;
        }),
      };

      const LedgerOwnerMemo = {
        from_json: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
        OwnerMemo: LedgerOwnerMemo,
        open_client_asset_record: jest.fn(() => {
          throw new Error('boom');
        }),
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
      const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
      const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');

      const memoDataResult = ({
        response: { foofoo: 'barbar' },
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      await expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow(
        'Can not open client asset record to decode',
      );

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
      expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyLedgerOwnerMemoFromJson.mockRestore();
      spyLedgerOpenClientAssetRecord.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
    it('throws an error if can not open ledger open_client_asset_record', async () => {
      const assetRecord = {
        a: 'myAssetRecord',
      };
      const ownerMemo: { b: string; clone: () => {} } = {
        b: 'myOwnerMemo',
        clone: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myAssetType = 'myAssetType';

      const decryptAssetData = {
        asset_type: myAssetType,
        amount: '2',
      };

      const LedgerClientAssetRecord = {
        from_json: jest.fn(() => {
          return assetRecord;
        }),
      };

      const LedgerOwnerMemo = {
        from_json: jest.fn(() => {
          return ownerMemo;
        }),
      };

      const myLedger = ({
        foo: 'node',
        ClientAssetRecord: LedgerClientAssetRecord,
        OwnerMemo: LedgerOwnerMemo,
        open_client_asset_record: jest.fn(() => {
          return decryptAssetData;
        }),
        asset_type_from_jsvalue: jest.fn(() => {
          throw new Error('boom');
        }),
      } as unknown) as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerClientAssetRecordFromJson = jest.spyOn(LedgerClientAssetRecord, 'from_json');
      const spyLedgerOwnerMemoFromJson = jest.spyOn(LedgerOwnerMemo, 'from_json');
      const spyLedgerOpenClientAssetRecord = jest.spyOn(myLedger, 'open_client_asset_record');
      const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');

      const memoDataResult = ({
        response: { foofoo: 'barbar' },
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const sid = 123;

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const utxoData = ({
        utxo: {
          utxoKey: 'utxoVal',
        },
      } as unknown) as NetworkTypes.UtxoResponse;

      const memoData = ({
        bar: 'foo',
      } as unknown) as NetworkTypes.OwnedMemoResponse;

      await expect(UtxoHelper.decryptUtxoItem(sid, walletInfo, utxoData, memoData)).rejects.toThrow(
        'Can not decrypt asset type',
      );

      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(utxoData.utxo);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(memoDataResult.response);
      expect(spyLedgerOpenClientAssetRecord).toHaveBeenCalledWith(assetRecord, ownerMemo, walletInfo.keypair);
      expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(myAssetType);

      spyGetLedger.mockRestore();
      spyLedgerClientAssetRecordFromJson.mockRestore();
      spyLedgerOwnerMemoFromJson.mockRestore();
      spyLedgerOpenClientAssetRecord.mockRestore();
      spyLedgerAssetTypeFromJsvalue.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
  });

  describe('getUtxoItem', () => {
    it('returns an utxo item without cache', async () => {
      const sid = 123;

      const utxoData = {
        myKey: 'myValue',
      };
      const utxoDataResult = ({
        response: utxoData,
      } as unknown) as NetworkTypes.UtxoDataResult;

      const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataResult);
      });

      const memoData = { foofoo: 'barbar' };

      const memoDataResult = ({
        response: memoData,
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const item = ({
        myKeyUtxo: 'myValueUtxo',
      } as unknown) as UtxoHelper.AddUtxoItem;

      const spyDecryptUtxoItem = jest.spyOn(UtxoHelper, 'decryptUtxoItem').mockImplementation(() => {
        return Promise.resolve(item);
      });

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const result = await UtxoHelper.getUtxoItem(sid, walletInfo);

      expect(spyGetUtxo).toHaveBeenCalledWith(sid);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyDecryptUtxoItem).toHaveBeenCalledWith(sid, walletInfo, utxoData, memoData);

      expect(result).toBe(item);

      spyGetUtxo.mockRestore();
      spyGetOwnerMemo.mockRestore();
      spyDecryptUtxoItem.mockRestore();
    });
    it('returns a cached utxo item', async () => {
      const sid = 123;

      const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo');

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const cachedItem = ({ foo: 'bar ' } as unknown) as UtxoHelper.AddUtxoItem;

      const result = await UtxoHelper.getUtxoItem(sid, walletInfo, cachedItem);

      expect(spyGetUtxo).not.toHaveBeenCalledWith(sid);
      expect(result).toBe(cachedItem);

      spyGetUtxo.mockRestore();
    });
    it('throws an error if failed to fetch utxo data and got error in the result', async () => {
      const sid = 123;

      const utxoDataResult = ({
        error: new Error('foo'),
      } as unknown) as NetworkTypes.UtxoDataResult;

      const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataResult);
      });

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      await expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow(
        'Could not fetch utxo data for sid',
      );

      spyGetUtxo.mockRestore();
    });
    it('throws an error if failed to fetch utxo data and got no response', async () => {
      const sid = 123;

      const utxoDataResult = ({} as unknown) as NetworkTypes.UtxoDataResult;

      const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataResult);
      });

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      await expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow(
        'Could not fetch utxo data for sid',
      );

      spyGetUtxo.mockRestore();
    });
    it('throws an error if failed to fetch memo data and got error in the result', async () => {
      const sid = 123;

      const utxoData = {
        myKey: 'myValue',
      };

      const utxoDataResult = ({
        response: utxoData,
      } as unknown) as NetworkTypes.UtxoDataResult;

      const spyGetUtxo = jest.spyOn(NetworkApi, 'getUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataResult);
      });

      const memoDataResult = ({
        error: new Error('foo'),
      } as unknown) as NetworkTypes.OwnerMemoDataResult;

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(memoDataResult);
      });

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      await expect(UtxoHelper.getUtxoItem(sid, walletInfo)).rejects.toThrow(
        'Could not fetch memo data for sid',
      );

      spyGetUtxo.mockRestore();
      spyGetOwnerMemo.mockRestore();
    });
  });

  describe('addUtxo aaa', () => {
    it('creates a utxoDataList', async () => {
      const utxoDataCache = {
        sid_1: {
          foo: 'bar',
        },
      };

      const spyCacheRead = jest.spyOn(Cache, 'read').mockImplementation(() => {
        return Promise.resolve(utxoDataCache);
      });

      const item = ({
        sid: 1,
      } as unknown) as UtxoHelper.AddUtxoItem;

      const spyGetUtxoItem = jest.spyOn(UtxoHelper, 'getUtxoItem').mockImplementation(() => {
        return Promise.resolve(item);
      });

      const addSids = [1];

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const cacheDataToSave = {
        sid_1: item,
      };

      const spyCacheWrite = jest.spyOn(Cache, 'write').mockImplementation(() => {
        return Promise.resolve(true);
      });

      const fullPathToCacheEntry = `${Sdk.environment.cachePath}/${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;

      const result = await UtxoHelper.addUtxo(walletInfo, addSids);

      expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk.environment.cacheProvider);
      expect(spyGetUtxoItem).toBeCalledWith(addSids[0], walletInfo, utxoDataCache.sid_1);
      expect(spyCacheWrite).toBeCalledWith(
        fullPathToCacheEntry,
        cacheDataToSave,
        Sdk.environment.cacheProvider,
      );
      expect(result).toStrictEqual([item]);

      spyCacheRead.mockRestore();
      spyGetUtxoItem.mockRestore();
      spyCacheWrite.mockRestore();
    });

    it('throws an error when can not read cache', async () => {
      const spyCacheRead = jest.spyOn(Cache, 'read').mockImplementation(() => {
        throw new Error('aa');
      });

      const addSids = [1];

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const fullPathToCacheEntry = `${Sdk.environment.cachePath}/${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;

      await expect(UtxoHelper.addUtxo(walletInfo, addSids)).rejects.toThrow('Error reading the cache');

      expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk.environment.cacheProvider);

      spyCacheRead.mockRestore();
    });

    it('skips a sid if it can not get its utxo item', async () => {
      const utxoDataCache = {
        sid_1: {
          foo1: 'bar2',
        },
        sid_2: {
          foo2: 'bar2',
        },
      };

      const spyCacheRead = jest.spyOn(Cache, 'read').mockImplementation(() => {
        return Promise.resolve(utxoDataCache);
      });

      const item = ({
        sid: 2,
      } as unknown) as UtxoHelper.AddUtxoItem;

      const spyGetUtxoItem = jest
        .spyOn(UtxoHelper, 'getUtxoItem')
        .mockImplementationOnce(() => {
          throw new Error('boom');
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(item);
        });

      const addSids = [1, 2];

      const walletInfo = ({
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown) as KeypairApi.WalletKeypar;

      const cacheDataToSave = {
        sid_2: item,
      };

      const spyCacheWrite = jest.spyOn(Cache, 'write').mockImplementation(() => {
        return Promise.resolve(true);
      });

      const fullPathToCacheEntry = `${Sdk.environment.cachePath}/${CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}.json`;

      const result = await UtxoHelper.addUtxo(walletInfo, addSids);

      expect(spyCacheRead).toBeCalledWith(fullPathToCacheEntry, Sdk.environment.cacheProvider);
      expect(spyGetUtxoItem).toHaveBeenNthCalledWith(1, addSids[0], walletInfo, utxoDataCache.sid_1);
      expect(spyGetUtxoItem).toHaveBeenNthCalledWith(2, addSids[1], walletInfo, utxoDataCache.sid_2);
      expect(spyCacheWrite).toBeCalledWith(
        fullPathToCacheEntry,
        cacheDataToSave,
        Sdk.environment.cacheProvider,
      );
      expect(result).toStrictEqual([item]);
      expect(result).toHaveLength(1);

      spyCacheRead.mockRestore();
      spyGetUtxoItem.mockRestore();
      spyCacheWrite.mockRestore();
    });
  });
});
