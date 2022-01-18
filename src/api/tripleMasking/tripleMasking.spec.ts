import * as NodeLedger from '../../services/ledger/nodeLedger';
import { AXfrKeyPair, TransactionBuilder, XPublicKey } from '../../services/ledger/types';
import * as UtxoHelper from '../../services/utxoHelper';
import * as KeypairApi from '../keypair/keypair';
import * as NetworkApi from '../network/network';
import { OwnerMemoDataResult } from '../network/types';
import * as TransactionApi from '../transaction/transaction';
import * as TripleMasking from './tripleMasking';

interface TransferOpBuilderLight {
  add_operation_bar_to_abar: () => TransferOpBuilderLight;
  get_randomizers: () => { randomizers: string[] };
  new?: () => TransferOpBuilderLight;
  create?: () => TransferOpBuilderLight;
  sign?: () => TransferOpBuilderLight;
  transaction?: () => string;
}

interface ClientAssetRecordLight {
  a: string;
}

interface OwnerMemoLight {
  b: string;
  clone: () => OwnerMemoLight;
}

interface LedgerLight<T> {
  from_json: () => T;
}

describe('triple masking (unit test)', () => {
  describe('barToAbar', () => {
    let sid: number;
    let walletInfo: KeypairApi.WalletKeypar;
    let ownerMemoDataResult: OwnerMemoDataResult;
    let anonKeys: TripleMasking.AnonKeysResponse;

    let clientAssetRecord: ClientAssetRecordLight;
    let ownerMemo: OwnerMemoLight;
    let ledgerOwnerMemo: LedgerLight<OwnerMemoLight>;
    let ledgerClientAssetRecord: LedgerLight<ClientAssetRecordLight>;
    let nodeLedger: NodeLedger.LedgerForNode;
    let randomizers: { randomizers: string[] };
    let transactionBuilder: TransferOpBuilderLight;
    let myUtxo: Partial<UtxoHelper.AddUtxoItem>[];
    let returnAxfrPublicKey: AXfrKeyPair;
    let returnEncKey: XPublicKey;
    let barToAbarData: any;

    let spyGetLedger: jest.SpyInstance;
    let spyLedgerOwnerMemoFromJson: jest.SpyInstance;
    let spyLedgerClientAssetRecordFromJson: jest.SpyInstance;
    let spyGetTransactionBuilder: jest.SpyInstance;
    let spyAddUtxo: jest.SpyInstance;
    let spyGetOwnerMemo: jest.SpyInstance;
    let spyGetAXfrPublicKeyByBase64: jest.SpyInstance;
    let spyGetXPublicKeyByBase64: jest.SpyInstance;
    let spyAddOperationBarToAbar: jest.SpyInstance;
    let spyGetRandomizers: jest.SpyInstance;
    let spyKeysInstanceFree: jest.SpyInstance;
    let spySaveBarToAbarToCache: jest.SpyInstance;

    beforeEach(() => {
      sid = 1;
      walletInfo = {
        publickey: 'myPublickey',
        keypair: 'myKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;
      anonKeys = {
        keysInstance: {
          free: jest.fn(() => {}),
          axfr_public_key: 'axfr_public_key',
          axfr_secret_key: 'axfr_secret_key',
          dec_key: 'dec_key',
          enc_key: 'enc_key',
        },
        formatted: {
          axfrPublicKey: 'axfrPublicKey',
          axfrSecretKey: 'axfrSecretKey',
          decKey: 'decKey',
          encKey: 'encKey',
        },
      };

      clientAssetRecord = {
        a: 'clientAssetRecord',
      };
      ownerMemo = {
        b: 'ownerMemo',
        clone: jest.fn(() => ownerMemo),
      };
      ledgerOwnerMemo = {
        from_json: jest.fn(() => ownerMemo),
      };
      ledgerClientAssetRecord = {
        from_json: jest.fn(() => clientAssetRecord),
      };
      nodeLedger = {
        foo: 'node',
        ClientAssetRecord: ledgerClientAssetRecord,
        OwnerMemo: ledgerOwnerMemo,
      } as unknown as NodeLedger.LedgerForNode;
      ownerMemoDataResult = {
        response: {
          blind_share: '',
          lock: {
            ciphertext: '',
            ephemeral_public_key: '',
          },
        },
      };
      randomizers = {
        randomizers: ['1', '2', '3'],
      };
      transactionBuilder = {
        add_operation_bar_to_abar: jest.fn(() => transactionBuilder),
        get_randomizers: jest.fn(() => randomizers),
      };
      myUtxo = [{ utxo: { record: 'utxo.record' } }];
      returnAxfrPublicKey = {
        free: jest.fn(() => {}),
      };
      returnEncKey = {
        free: jest.fn(() => {}),
      };
      barToAbarData = {};

      spyGetLedger = jest.spyOn(NodeLedger, 'default');
      spyLedgerOwnerMemoFromJson = jest.spyOn(ledgerOwnerMemo, 'from_json');
      spyLedgerClientAssetRecordFromJson = jest.spyOn(ledgerClientAssetRecord, 'from_json');
      spyGetTransactionBuilder = jest.spyOn(TransactionApi, 'getTransactionBuilder');
      spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo');
      spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo');
      spyGetAXfrPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getAXfrPublicKeyByBase64');
      spyGetXPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getXPublicKeyByBase64');
      spyAddOperationBarToAbar = jest.spyOn(transactionBuilder, 'add_operation_bar_to_abar');
      spyGetRandomizers = jest.spyOn(transactionBuilder, 'get_randomizers');
      spyKeysInstanceFree = jest.spyOn(anonKeys.keysInstance, 'free');
      spySaveBarToAbarToCache = jest.spyOn(TripleMasking, 'saveBarToAbarToCache');
    });

    it('throw an error if could not fetch utxo for sid. [utxoHelper.addUtxo]', async () => {
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.reject(new Error('addUtxo error')));
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `could not fetch utxo for sid ${sid}`,
      );
    });

    it('throw an error if could not fetch memo data for sid. [Network.getOwnerMemo]', async () => {
      ownerMemoDataResult.error = new Error('getOwnerMemo error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not fetch memo data for sid "${sid}", Error - ${ownerMemoDataResult.error.message}`,
      );
    });

    it('throw an error if could not get decode memo data or get assetRecord. [ledger.OwnerMemo.from_json]', async () => {
      const fromJsonError = new Error('OwnerMemo.from_json error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => {
        throw fromJsonError;
      });
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not get decode memo data or get assetRecord", Error - ${fromJsonError.message}`,
      );
    });

    it('throw an error if could not get decode memo data or get assetRecord. [ledger.ClientAssetRecord.from_json]', async () => {
      const fromJsonError = new Error('ClientAssetRecord.from_json error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => {
        throw fromJsonError;
      });
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not get decode memo data or get assetRecord", Error - ${fromJsonError.message}`,
      );
    });

    it('throw an error if could not convert AXfrPublicKey. [Keypair.getAXfrPublicKeyByBase64]', async () => {
      const getAXfrPublicKeyByBase64Error = new Error('getAXfrPublicKeyByBase64 error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.reject(getAXfrPublicKeyByBase64Error));
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not convert AXfrPublicKey", Error - ${getAXfrPublicKeyByBase64Error.message}`,
      );
    });

    it('throw an error if could not convert AXfrPublicKey. [Keypair.getXPublicKeyByBase64]', async () => {
      const getXPublicKeyByBase64Error = new Error('getXPublicKeyByBase64 error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.reject(getXPublicKeyByBase64Error));
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not convert AXfrPublicKey", Error - ${getXPublicKeyByBase64Error.message}`,
      );
    });

    it('throw an error if could not add bar to abar operation. [transactionBuilder.add_operation_bar_to_abar]', async () => {
      const addOperationBarToAbarError = new Error('addOperationBarToAbarError error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyAddOperationBarToAbar.mockImplementationOnce(() => {
        throw addOperationBarToAbarError;
      });

      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not add bar to abar operation", Error - ${addOperationBarToAbarError.message}`,
      );
    });

    it('throw an error if could not get a list of randomizers strings. [transactionBuilder.get_randomizers]', async () => {
      const getRandomizersError = new Error('getRandomizersError error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyGetRandomizers.mockImplementationOnce(() => {
        throw getRandomizersError;
      });
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `could not get a list of randomizers strings "${getRandomizersError.message}"`,
      );
    });

    it('throw an error if list of randomizers strings is empty. [transactionBuilder.get_randomizers]', async () => {
      randomizers.randomizers = [];
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyGetRandomizers.mockImplementationOnce(() => randomizers);
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        'list of randomizers strings is empty ',
      );
    });

    it('throw an error if could not get release the anonymous keys instance. [anonKeys.keysInstance.free]', async () => {
      const keysInstanceFreeError = new Error('keysInstanceFreeError error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyGetRandomizers.mockImplementationOnce(() => randomizers);
      spyKeysInstanceFree.mockImplementationOnce(() => {
        throw keysInstanceFreeError;
      });
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `could not get release the anonymous keys instance  "${keysInstanceFreeError.message}" `,
      );
    });

    it('throw an error if could not save cache for bar to abar. [TripleMasking.saveBarToAbarToCache]', async () => {
      const saveBarToAbarToCacheError = new Error('saveBarToAbarToCacheError error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyGetRandomizers.mockImplementationOnce(() => randomizers);
      spySaveBarToAbarToCache.mockImplementationOnce(() => Promise.reject(saveBarToAbarToCacheError));
      await expect(TripleMasking.barToAbar(walletInfo, sid, anonKeys)).rejects.toThrow(
        `Could not save cache for bar to abar. Details: ${saveBarToAbarToCacheError.message}`,
      );
    });

    it('return builder and barToAbarData successfully', async () => {
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetTransactionBuilder.mockImplementationOnce(() =>
        Promise.resolve(transactionBuilder as unknown as TransactionBuilder),
      );
      spyAddUtxo.mockImplementationOnce(() => Promise.resolve(myUtxo as unknown as UtxoHelper.AddUtxoItem[]));
      spyGetOwnerMemo.mockImplementationOnce(() =>
        Promise.resolve(ownerMemoDataResult as OwnerMemoDataResult),
      );
      spyLedgerOwnerMemoFromJson.mockImplementationOnce(() => ownerMemo);
      spyLedgerClientAssetRecordFromJson.mockImplementationOnce(() => clientAssetRecord);
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnAxfrPublicKey));
      spyGetXPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(returnEncKey));
      spyGetRandomizers.mockImplementationOnce(() => randomizers);
      spySaveBarToAbarToCache.mockImplementationOnce(() => Promise.resolve(barToAbarData));

      const result = await TripleMasking.barToAbar(walletInfo, sid, anonKeys);

      expect(spyGetLedger).toHaveBeenCalled();
      expect(spyGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, [sid]);
      expect(spyGetOwnerMemo).toHaveBeenCalledWith(sid);
      expect(spyLedgerOwnerMemoFromJson).toHaveBeenCalledWith(ownerMemoDataResult.response);
      expect(spyLedgerClientAssetRecordFromJson).toHaveBeenCalledWith(myUtxo[0].utxo);
      expect(spyGetAXfrPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.formatted.axfrPublicKey);
      expect(spyGetXPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.formatted.encKey);
      expect(spyAddOperationBarToAbar).toHaveBeenCalledWith(
        walletInfo.keypair,
        returnAxfrPublicKey,
        BigInt(sid),
        clientAssetRecord,
        ownerMemo.clone(),
        returnEncKey,
      );
      expect(spyGetRandomizers).toHaveBeenCalled();
      expect(spyKeysInstanceFree).toHaveBeenCalled();
      expect(spySaveBarToAbarToCache).toHaveBeenCalledWith(
        walletInfo,
        sid,
        randomizers.randomizers,
        anonKeys,
      );

      expect(result.transactionBuilder).toBe(transactionBuilder);
      expect(result.barToAbarData).toBe(barToAbarData);
    });
  });
});
