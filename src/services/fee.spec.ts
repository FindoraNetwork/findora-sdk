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

interface TransferOpBuilderLight {
  add_input_with_tracing?: () => TransferOpBuilderLight;
  add_input_no_tracing?: () => TransferOpBuilderLight;
  add_output_with_tracing?: () => TransferOpBuilderLight;
  add_output_no_tracing?: () => TransferOpBuilderLight;
  new?: () => TransferOpBuilderLight;
}

describe('fee (unit test)', () => {
  const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

  const password = '123';

  const assetCode = 'foo';
  const amount = BigInt(3);

  describe('getEmptyTransferBuilder', () => {
    it('creates an instance of a transfer operation builder', async () => {
      const fakeOpBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeOpBuilder;
        }),
      };

      const fakedLedger = ({
        TransferOperationBuilder: fakeOpBuilder,
      } as unknown) as LedgerForNode;

      const spyLedger = jest
        .spyOn(Ledger, 'getLedger')
        .mockImplementation(jest.fn(() => Promise.resolve(fakedLedger)));

      const res = await Fee.getEmptyTransferBuilder();
      expect(res).toBe(fakeOpBuilder);

      spyLedger.mockRestore();
    });
  });

  describe('getAssetTracingPolicies', () => {
    it('creates an instance of a transfer operation builder', async () => {
      const tPol = [1, 2];

      const fakeAsset = {
        get_tracing_policies: jest.fn(() => {
          return tPol;
        }),
      };

      const fakeAssetType = {
        from_json: jest.fn(() => {
          return fakeAsset;
        }),
      };

      const fakedLedger = ({
        AssetType: fakeAssetType,
      } as unknown) as LedgerForNode;

      const spyLedger = jest
        .spyOn(Ledger, 'getLedger')
        .mockImplementation(jest.fn(() => Promise.resolve(fakedLedger)));

      const asset = ({ foo: 1 } as unknown) as FindoraWallet.IAsset;
      const res = await Fee.getAssetTracingPolicies(asset);
      expect(res).toBe(tPol);

      spyLedger.mockRestore();
    });
  });

  describe('getTransferOperation', () => {
    it('verifies that for no-traceble assets only non tracing methods are called', async () => {
      const mockedAssetNonTracing = {
        address: 'a',
        code: 'c',
        issuer: 'i',
        memo: '',
        assetRules: {
          decimals: 6,
          transferable: true,
          updatable: true,
          transfer_multisig_rules: [3, 4],
          max_units: 6,
          tracing_policies: [],
        },
        numbers: amount,
        name: 'n',
        options: {
          builtIn: false,
          owned: false,
        },
      };

      const fakeOpBuilder: TransferOpBuilderLight = {
        add_input_with_tracing: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_input_no_tracing: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_output_with_tracing: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_output_no_tracing: jest.fn(() => {
          return fakeOpBuilder;
        }),
      };

      const mockGetAssetDetails = jest
        .spyOn(Asset, 'getAssetDetails')
        .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetNonTracing)));

      const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
        return Promise.resolve((fakeOpBuilder as unknown) as TransferOperationBuilder);
      });

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(({ response: null } as unknown) as NetworkTypes.OwnerMemoDataResult);
      });

      const spyInputNoTracing = jest.spyOn(fakeOpBuilder, 'add_input_no_tracing');
      const spyInputWithTracing = jest.spyOn(fakeOpBuilder, 'add_input_with_tracing');
      const spyOutputNoTracing = jest.spyOn(fakeOpBuilder, 'add_output_no_tracing');
      const spyOutputWithTracing = jest.spyOn(fakeOpBuilder, 'add_output_with_tracing');

      const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
        return Promise.resolve((undefined as unknown) as TracingPolicies);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      const toPublickey = await KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);

      const utxoInputsInfo = ({
        inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
      } as unknown) as UtxoHelper.UtxoInputsInfo;

      const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };

      const recieversInfo = [
        {
          utxoNumbers: amount,
          toPublickey,
          assetBlindRules,
        },
      ];

      await Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode);

      expect(spyInputNoTracing).toHaveBeenCalledTimes(1);
      expect(spyInputWithTracing).not.toBeCalled();
      expect(spyOutputNoTracing).toHaveBeenCalledTimes(1);
      expect(spyOutputWithTracing).not.toBeCalled();

      mockGetAssetDetails.mockRestore();

      spyGetEmptyTransferBuilder.mockRestore();

      spyInputNoTracing.mockRestore();
      spyInputWithTracing.mockRestore();
      spyOutputNoTracing.mockRestore();
      spyOutputWithTracing.mockRestore();
      spyGetOwnerMemo.mockRestore();

      spyGetAssetTracingPolicies.mockRestore();
    });

    it('verifies that for traceble assets only tracing methods are called', async () => {
      const mockedAssetTracing = {
        address: 'a',
        code: 'c',
        issuer: 'i',
        memo: '',
        assetRules: {
          decimals: 6,
          transferable: true,
          updatable: true,
          transfer_multisig_rules: [3, 4],
          max_units: 6,
          tracing_policies: [1, 2],
        },
        numbers: amount,
        name: 'n',
        options: {
          builtIn: false,
          owned: false,
        },
      };

      const fakeOpBuilderTwo: TransferOpBuilderLight = {
        add_input_with_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_input_no_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_output_with_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_output_no_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
      };

      const mockGetAssetDetails = jest
        .spyOn(Asset, 'getAssetDetails')
        .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetTracing)));

      const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
        return Promise.resolve((fakeOpBuilderTwo as unknown) as TransferOperationBuilder);
      });

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(({ response: null } as unknown) as NetworkTypes.OwnerMemoDataResult);
      });

      const spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
      const spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
      const spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
      const spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');

      const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
        return Promise.resolve(([1, 2] as unknown) as TracingPolicies);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      const toPublickey = await KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);

      const utxoInputsInfo = ({
        inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
      } as unknown) as UtxoHelper.UtxoInputsInfo;

      const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };

      const recieversInfo = [
        {
          utxoNumbers: amount,
          toPublickey,
          assetBlindRules,
        },
      ];

      await Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode);

      expect(spyInputNoTracing).not.toBeCalled();
      expect(spyInputWithTracing).toHaveBeenCalledTimes(1);
      expect(spyOutputNoTracing).not.toBeCalled();
      expect(spyOutputWithTracing).toHaveBeenCalledTimes(1);

      mockGetAssetDetails.mockRestore();

      spyGetEmptyTransferBuilder.mockRestore();

      spyInputNoTracing.mockRestore();
      spyInputWithTracing.mockRestore();
      spyOutputNoTracing.mockRestore();
      spyOutputWithTracing.mockRestore();
      spyGetOwnerMemo.mockRestore();

      spyGetAssetTracingPolicies.mockRestore();
    });

    it('throws an error if there was an error while fetching owner memo data', async () => {
      const mockedAssetTracing = {
        address: 'a',
        code: 'c',
        issuer: 'i',
        memo: '',
        assetRules: {
          decimals: 6,
          transferable: true,
          updatable: true,
          transfer_multisig_rules: [3, 4],
          max_units: 6,
          tracing_policies: [1, 2],
        },
        numbers: amount,
        name: 'n',
        options: {
          builtIn: false,
          owned: false,
        },
      };

      const fakeOpBuilderTwo: TransferOpBuilderLight = {
        add_input_with_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_input_no_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_output_with_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
        add_output_no_tracing: jest.fn(() => {
          return fakeOpBuilderTwo;
        }),
      };

      const mockGetAssetDetails = jest
        .spyOn(Asset, 'getAssetDetails')
        .mockImplementation(jest.fn(() => Promise.resolve(mockedAssetTracing)));

      const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder').mockImplementation(() => {
        return Promise.resolve((fakeOpBuilderTwo as unknown) as TransferOperationBuilder);
      });

      const spyGetOwnerMemo = jest.spyOn(NetworkApi, 'getOwnerMemo').mockImplementation(() => {
        return Promise.resolve(({
          error: { message: 'foobar' },
        } as unknown) as NetworkTypes.OwnerMemoDataResult);
      });

      const spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
      const spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
      const spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
      const spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');

      const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies').mockImplementation(() => {
        return Promise.resolve(([1, 2] as unknown) as TracingPolicies);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      const toPublickey = await KeypairApi.getXfrPublicKeyByBase64(walletInfo.publickey);

      const utxoInputsInfo = ({
        inputParametersList: [{ txoRef: 1, assetRecord: 3, amount: 4, sid: 5 }],
      } as unknown) as UtxoHelper.UtxoInputsInfo;

      const assetBlindRules = { isAmountBlind: false, isTypeBlind: false };

      const recieversInfo = [
        {
          utxoNumbers: amount,
          toPublickey,
          assetBlindRules,
        },
      ];

      await expect(
        Fee.getTransferOperation(walletInfo, utxoInputsInfo, recieversInfo, assetCode),
      ).rejects.toThrowError('Could not fetch memo data for sid ');

      expect(spyInputNoTracing).not.toBeCalled();
      expect(spyInputWithTracing).not.toBeCalled();
      expect(spyOutputNoTracing).not.toBeCalled();
      expect(spyOutputWithTracing).not.toBeCalled();

      mockGetAssetDetails.mockRestore();

      spyGetEmptyTransferBuilder.mockRestore();

      spyInputNoTracing.mockRestore();
      spyInputWithTracing.mockRestore();
      spyOutputNoTracing.mockRestore();
      spyOutputWithTracing.mockRestore();
      spyGetOwnerMemo.mockRestore();

      spyGetAssetTracingPolicies.mockRestore();
    });
  });

  describe('buildTransferOperationWithFee ', () => {
    it('builds a transfer operation succesfully', async () => {
      const sidsResult = { response: [1, 2, 3] } as NetworkTypes.OwnedSidsDataResult;
      const utxoDataList = ([{ foo: 'bar' }] as unknown) as UtxoHelper.AddUtxoItem[];

      const minimalFee = BigInt(1);

      const fraAssetCode = 'fra';

      const sendUtxoList = ([{ bar: 1 }] as unknown) as UtxoHelper.UtxoOutputItem[];

      const utxoInputsInfo = (2 as unknown) as UtxoHelper.UtxoInputsInfo;

      const toPublickey = (1 as unknown) as XfrPublicKey;

      const transferOperationBuilder = ({ foo: 'bar' } as unknown) as TransferOperationBuilder;

      const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
        return Promise.resolve(sidsResult);
      });

      const spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataList);
      });

      const spyAddUtxoInputs = jest.spyOn(UtxoHelper, 'addUtxoInputs').mockImplementation(() => {
        return Promise.resolve(utxoInputsInfo);
      });

      const spyGetSendUtxo = jest.spyOn(UtxoHelper, 'getSendUtxo').mockImplementation(() => {
        return sendUtxoList;
      });

      const spyGetFraAssetCode = jest.spyOn(Asset, 'getFraAssetCode').mockImplementation(() => {
        return Promise.resolve(fraAssetCode);
      });

      const spyGetMinimalFee = jest.spyOn(Asset, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(Asset, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyGetTransferOperation = jest.spyOn(Fee, 'getTransferOperation').mockImplementation(() => {
        return Promise.resolve(transferOperationBuilder);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      const recieversInfo = [
        {
          utxoNumbers: minimalFee,
          toPublickey,
        },
      ];

      await Fee.buildTransferOperationWithFee(walletInfo);

      expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, sidsResult.response);
      expect(spyGetSendUtxo).toHaveBeenCalledWith(fraAssetCode, minimalFee, utxoDataList);
      expect(spyAddUtxoInputs).toHaveBeenCalledWith(sendUtxoList);
      expect(spyGetTransferOperation).toHaveBeenCalledWith(
        walletInfo,
        utxoInputsInfo,
        recieversInfo,
        fraAssetCode,
      );

      spyGetOwnedSids.mockRestore();
      spyAddUtxo.mockRestore();
      spyAddUtxoInputs.mockRestore();
      spyGetSendUtxo.mockRestore();
      spyGetFraAssetCode.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyGetTransferOperation.mockRestore();
    });

    it('throws an error if sids were not fetched', async () => {
      const sidsResult = { foo: 'bar' } as NetworkTypes.OwnedSidsDataResult;

      const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
        return Promise.resolve(sidsResult);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      await expect(Fee.buildTransferOperationWithFee(walletInfo)).rejects.toThrowError(
        'No sids were fetched',
      );

      spyGetOwnedSids.mockRestore();
    });
  });

  describe('buildTransferOperation', () => {
    it('builds a transfer operation succesfully', async () => {
      const sidsResult = { response: [1, 2, 3] } as NetworkTypes.OwnedSidsDataResult;
      const utxoDataList = ([{ foo: 'bar' }] as unknown) as UtxoHelper.AddUtxoItem[];

      const minimalFee = BigInt(1);

      const fraAssetCode = 'fra';

      const sendUtxoList = ([{ bar: 1 }] as unknown) as UtxoHelper.UtxoOutputItem[];

      const utxoInputsInfo = (2 as unknown) as UtxoHelper.UtxoInputsInfo;

      const toPublickey = (1 as unknown) as XfrPublicKey;

      const transferOperationBuilder = ({ foo: 'bar' } as unknown) as TransferOperationBuilder;

      const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
        return Promise.resolve(sidsResult);
      });

      const spyAddUtxo = jest.spyOn(UtxoHelper, 'addUtxo').mockImplementation(() => {
        return Promise.resolve(utxoDataList);
      });

      const spyAddUtxoInputs = jest.spyOn(UtxoHelper, 'addUtxoInputs').mockImplementation(() => {
        return Promise.resolve(utxoInputsInfo);
      });

      const spyGetSendUtxo = jest.spyOn(UtxoHelper, 'getSendUtxo').mockImplementation(() => {
        return sendUtxoList;
      });

      const spyGetFraAssetCode = jest.spyOn(Asset, 'getFraAssetCode').mockImplementation(() => {
        return Promise.resolve(fraAssetCode);
      });

      const spyGetMinimalFee = jest.spyOn(Asset, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(Asset, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyGetTransferOperation = jest.spyOn(Fee, 'getTransferOperation').mockImplementation(() => {
        return Promise.resolve(transferOperationBuilder);
      });

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      const recieversInfo = [
        {
          utxoNumbers: minimalFee,
          toPublickey,
        },
        {
          utxoNumbers: minimalFee,
          toPublickey,
        },
      ];

      const totalMinimalFee = BigInt(Number(minimalFee) + Number(minimalFee));

      await Fee.buildTransferOperation(walletInfo, recieversInfo, fraAssetCode);

      expect(spyAddUtxo).toHaveBeenCalledWith(walletInfo, sidsResult.response);
      expect(spyGetSendUtxo).toHaveBeenCalledWith(fraAssetCode, totalMinimalFee, utxoDataList); //
      expect(spyAddUtxoInputs).toHaveBeenCalledWith(sendUtxoList);
      expect(spyGetTransferOperation).toHaveBeenCalledWith(
        walletInfo,
        utxoInputsInfo,
        recieversInfo,
        fraAssetCode,
      );

      spyGetOwnedSids.mockRestore();
      spyAddUtxo.mockRestore();
      spyAddUtxoInputs.mockRestore();
      spyGetSendUtxo.mockRestore();
      spyGetFraAssetCode.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyGetTransferOperation.mockRestore();
    });

    it('throws an error if sids were not fetched', async () => {
      const sidsResult = { foo: 'bar' } as NetworkTypes.OwnedSidsDataResult;

      const minimalFee = BigInt(1);

      const toPublickey = (1 as unknown) as XfrPublicKey;
      const spyGetOwnedSids = jest.spyOn(NetworkApi, 'getOwnedSids').mockImplementation(() => {
        return Promise.resolve(sidsResult);
      });

      const recieversInfo = [
        {
          utxoNumbers: minimalFee,
          toPublickey,
        },
      ];

      const walletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

      await expect(Fee.buildTransferOperation(walletInfo, recieversInfo, assetCode)).rejects.toThrowError(
        'No sids were fetched',
      );

      spyGetOwnedSids.mockRestore();
    });
  });
});
