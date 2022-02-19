import Cache from '../../services/cacheStore/factory';
import * as NodeLedger from '../../services/ledger/nodeLedger';
import {
  AnonKeys,
  AXfrKeyPair,
  AXfrPubKey,
  TransactionBuilder,
  XPublicKey,
} from '../../services/ledger/types';
import * as UtxoHelper from '../../services/utxoHelper';
import * as KeypairApi from '../keypair/keypair';
import * as NetworkApi from '../network/network';
import { OwnedAbarsDataResult, OwnerMemoDataResult } from '../network/types';
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
    let anonKeys: FindoraWallet.FormattedAnonKeys;

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
    let spySaveBarToAbarToCache: jest.SpyInstance;

    beforeEach(() => {
      sid = 1;
      walletInfo = {
        publickey: 'myPublickey',
        keypair: 'myKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;
      anonKeys = {
        axfrPublicKey: 'axfrPublicKey',
        axfrSecretKey: 'axfrSecretKey',
        decKey: 'decKey',
        encKey: 'encKey',
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
      expect(spyGetAXfrPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.axfrPublicKey);
      expect(spyGetXPublicKeyByBase64).toHaveBeenCalledWith(anonKeys.encKey);
      expect(spyAddOperationBarToAbar).toHaveBeenCalledWith(
        walletInfo.keypair,
        returnAxfrPublicKey,
        BigInt(sid),
        clientAssetRecord,
        ownerMemo.clone(),
        returnEncKey,
      );
      expect(spyGetRandomizers).toHaveBeenCalled();
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
  describe('getOwnedAbars', () => {
    let nodeLedger: NodeLedger.LedgerForNode;
    let randomizeAxfrPubkey: string;
    let axfrPublicKey: AXfrPubKey;
    let formattedAxfrPublicKey: string;
    let givenRandomizer: string;
    let ownedAbars: OwnedAbarsDataResult;
    let atxoSid: number;
    let ownedAbar: FindoraWallet.OwnedAbar;
    let abarData: FindoraWallet.OwnedAbarData;

    let spyGetLedger: jest.SpyInstance;
    let spyGetAXfrPublicKeyByBase64: jest.SpyInstance;
    let spyRandomizeAxfrPubkey: jest.SpyInstance;
    let spyGetOwnedAbars: jest.SpyInstance;
    beforeEach(() => {
      formattedAxfrPublicKey = '';
      givenRandomizer = '';
      randomizeAxfrPubkey = 'randomize_axfr_pubkey';
      nodeLedger = {
        randomize_axfr_pubkey: jest.fn(() => {}),
      } as unknown as NodeLedger.LedgerForNode;
      axfrPublicKey = {
        free: jest.fn(() => {}),
      };
      atxoSid = 1;
      ownedAbar = { amount_type_commitment: 'amount_type_commitment', public_key: 'public_key' };

      abarData = {
        atxoSid: atxoSid + '',
        ownedAbar,
      };

      ownedAbars = {
        response: [[atxoSid, ownedAbar]],
      };

      spyGetLedger = jest.spyOn(NodeLedger, 'default');
      spyGetAXfrPublicKeyByBase64 = jest.spyOn(KeypairApi, 'getAXfrPublicKeyByBase64');
      spyRandomizeAxfrPubkey = jest.spyOn(nodeLedger, 'randomize_axfr_pubkey');
      spyGetOwnedAbars = jest.spyOn(NetworkApi, 'getOwnedAbars');
    });
    it('throw an error if receive error response from get ownedAbars call', async () => {
      const errorMsg = 'error';
      ownedAbars.error = new Error(errorMsg);
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(axfrPublicKey));
      spyRandomizeAxfrPubkey.mockImplementationOnce(() => randomizeAxfrPubkey);
      spyGetOwnedAbars.mockImplementationOnce(() => Promise.resolve(ownedAbars));
      expect(TripleMasking.getOwnedAbars(formattedAxfrPublicKey, givenRandomizer)).rejects.toThrow(
        ownedAbars.error.message,
      );
    });

    it('throw an error if not receive response from get ownedAbars call', async () => {
      ownedAbars.response = undefined;
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(axfrPublicKey));
      spyRandomizeAxfrPubkey.mockImplementationOnce(() => randomizeAxfrPubkey);
      spyGetOwnedAbars.mockImplementationOnce(() => Promise.resolve(ownedAbars));
      expect(TripleMasking.getOwnedAbars(formattedAxfrPublicKey, givenRandomizer)).rejects.toThrow(
        'Could not receive response from get ownedAbars call',
      );
    });

    it('return atxoSid and ownedAbar successfully', async () => {
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGetAXfrPublicKeyByBase64.mockImplementationOnce(() => Promise.resolve(axfrPublicKey));
      spyRandomizeAxfrPubkey.mockImplementationOnce(() => randomizeAxfrPubkey);
      spyGetOwnedAbars.mockImplementationOnce(() => Promise.resolve(ownedAbars));
      const result = await TripleMasking.getOwnedAbars(formattedAxfrPublicKey, givenRandomizer);
      expect(result).toHaveLength(1);
      const [abar] = result;
      expect(abar).toHaveProperty('axfrPublicKey', formattedAxfrPublicKey);
      expect(abar).toHaveProperty('randomizer', givenRandomizer);
      expect(abar).toHaveProperty('abarData', abarData);
      expect(abar.abarData).toHaveProperty('atxoSid', `${atxoSid}`);
      expect(abar.abarData).toHaveProperty('ownedAbar', ownedAbar);
      expect(spyGetAXfrPublicKeyByBase64).toHaveBeenCalledWith(formattedAxfrPublicKey);
      expect(spyRandomizeAxfrPubkey).toHaveBeenCalledWith(axfrPublicKey, givenRandomizer);
      expect(spyGetOwnedAbars).toHaveBeenCalledWith(randomizeAxfrPubkey);
    });
  });

  describe('genAnonKeys', () => {
    let nodeLedger: NodeLedger.LedgerForNode;
    let anonKeys: AnonKeys;
    let formattedAnonKeys: FindoraWallet.FormattedAnonKeys;

    let spyGetLedger: jest.SpyInstance;
    let spyGenAnonKeys: jest.SpyInstance;
    let spyKeysInstanceFree: jest.SpyInstance;

    beforeEach(() => {
      anonKeys = {
        free: jest.fn(() => {}),
        to_json: jest.fn(() => {}),
        axfr_public_key: 'axfr_public_key',
        axfr_secret_key: 'axfr_secret_key',
        dec_key: 'dec_key',
        enc_key: 'enc_key',
      };
      formattedAnonKeys = {
        axfrPublicKey: anonKeys.axfr_public_key,
        axfrSecretKey: anonKeys.axfr_secret_key,
        decKey: anonKeys.dec_key,
        encKey: anonKeys.enc_key,
      };
      nodeLedger = {
        foo: 'node',
        gen_anon_keys: jest.fn(() => anonKeys),
      } as unknown as NodeLedger.LedgerForNode;

      spyGetLedger = jest.spyOn(NodeLedger, 'default');
      spyGenAnonKeys = jest.spyOn(nodeLedger, 'gen_anon_keys');
      spyKeysInstanceFree = jest.spyOn(anonKeys, 'free');
    });

    it('throw an error if could not get the anonKeys', async () => {
      const genAnonKeysError = new Error('genAnonKeys error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGenAnonKeys.mockImplementationOnce(() => Promise.reject(genAnonKeysError));
      await expect(TripleMasking.genAnonKeys()).rejects.toThrowError(genAnonKeysError.message);
    });

    it('throw an error if could not get release the anonymous keys instance. [anonKeys.free]', async () => {
      const genAnonKeysError = new Error('genAnonKeys error');
      const keysInstanceFreeError = new Error('keysInstanceFreeError error');
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));

      spyGenAnonKeys.mockImplementationOnce(() => Promise.reject(genAnonKeysError));
      spyKeysInstanceFree.mockImplementationOnce(() => {
        throw keysInstanceFreeError;
      });

      await expect(TripleMasking.genAnonKeys()).rejects.toThrowError(genAnonKeysError.message);
    });

    it('creates an instance of a AnonKeys', async () => {
      spyGetLedger.mockImplementationOnce(() => Promise.resolve(nodeLedger));
      spyGenAnonKeys.mockImplementationOnce(() => Promise.resolve(anonKeys));
      const result = await TripleMasking.genAnonKeys();
      expect(result).toEqual(formattedAnonKeys);
      expect(spyKeysInstanceFree).toHaveBeenCalled();
    });
  });

  describe('saveBarToAbarToCache', () => {
    let sid: number;
    let walletInfo: KeypairApi.WalletKeypar;
    let randomizers: string[];
    let anonKeys: FindoraWallet.FormattedAnonKeys;

    let spyConsoleLog: jest.SpyInstance;
    let spyCacheRead: jest.SpyInstance;
    let spyCacheWrite: jest.SpyInstance;
    beforeEach(() => {
      sid = 1;
      walletInfo = {
        address: 'test_address',
      } as unknown as KeypairApi.WalletKeypar;
      randomizers = ['1', '2', '3'];
      anonKeys = {
        axfrPublicKey: 'axfrPublicKey',
        axfrSecretKey: 'axfrSecretKey',
        decKey: 'decKey',
        encKey: 'encKey',
      } as unknown as FindoraWallet.FormattedAnonKeys;
      spyConsoleLog = jest.spyOn(console, 'log');
      spyCacheRead = jest.spyOn(Cache, 'read');
      spyCacheWrite = jest.spyOn(Cache, 'write');
    });

    it('return a instance of BarToAbarData and print `for browser mode a default fullPathToCacheEntry was used`', async () => {
      const result = await TripleMasking.saveBarToAbarToCache(walletInfo, sid, randomizers, anonKeys);
      expect(result).toMatchObject({
        anonKeysFormatted: anonKeys,
        randomizers,
      });

      expect(spyConsoleLog).toHaveBeenCalledWith('for browser mode a default fullPathToCacheEntry was used');
    });

    it('return a instance of BarToAbarData and print `Error reading the abarDataCache for $address`', async () => {
      const cacheReadError = new Error('cacheRead error');
      spyCacheRead.mockImplementationOnce(() => Promise.reject(cacheReadError));
      const result = await TripleMasking.saveBarToAbarToCache(walletInfo, sid, randomizers, anonKeys);
      expect(result).toMatchObject({
        anonKeysFormatted: anonKeys,
        randomizers,
      });

      expect(spyConsoleLog).toHaveBeenCalledWith(
        `Error reading the abarDataCache for ${walletInfo.address}. Creating an empty object now`,
      );
    });

    it('return a instance of BarToAbarData and print `Could not write cache for abarDataCache`', async () => {
      const cacheWriteError = new Error('cacheWrite error');
      spyCacheWrite.mockImplementationOnce(() => Promise.reject(cacheWriteError));
      const result = await TripleMasking.saveBarToAbarToCache(walletInfo, sid, randomizers, anonKeys);
      expect(result).toMatchObject({
        anonKeysFormatted: anonKeys,
        randomizers,
      });

      expect(spyConsoleLog).toHaveBeenCalledWith(
        `Could not write cache for abarDataCache, "${cacheWriteError.message}"`,
      );
    });
  });

  describe('saveOwnedAbarsToCache', () => {
    let walletInfo: KeypairApi.WalletKeypar;

    let spyConsoleLog: jest.SpyInstance;
    let spyCacheRead: jest.SpyInstance;
    let spyCacheWrite: jest.SpyInstance;
    let ownedAbars: FindoraWallet.OwnedAbarItem[];

    let atxoSid: number;
    let ownedAbar: FindoraWallet.OwnedAbar;
    let givenRandomizer: string;

    beforeEach(() => {
      walletInfo = {
        address: 'test_address',
      } as unknown as KeypairApi.WalletKeypar;

      atxoSid = 1;
      ownedAbar = { amount_type_commitment: 'amount_type_commitment', public_key: 'public_key' };

      ownedAbars = [
        {
          axfrPublicKey: 'formattedAxfrPublicKey',
          randomizer: givenRandomizer,
          abarData: {
            atxoSid: atxoSid + '',
            ownedAbar: { ...ownedAbar },
          },
        },
      ];
      spyConsoleLog = jest.spyOn(console, 'log');
      spyCacheRead = jest.spyOn(Cache, 'read');
      spyCacheWrite = jest.spyOn(Cache, 'write');
    });

    it('return true and print `for browser mode a default fullPathToCacheEntry was used`', async () => {
      const result = await TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbars);
      expect(result).toBe(true);

      expect(spyConsoleLog).toHaveBeenCalledWith('for browser mode a default fullPathToCacheEntry was used');
    });

    it('return false and print `Could not write cache for ownedAbarsCache`', async () => {
      const cacheWriteError = new Error('cacheWrite error');
      spyCacheWrite.mockImplementationOnce(() => Promise.reject(cacheWriteError));
      const result = await TripleMasking.saveOwnedAbarsToCache(walletInfo, ownedAbars);
      expect(result).toBe(false);

      expect(spyConsoleLog).toHaveBeenCalledWith(
        `Could not write cache for ownedAbarsCache, "${cacheWriteError.message}"`,
      );
    });
  });
});
