import '@testing-library/jest-dom/extend-expect';
import * as KeypairApi from '../api/keypair';
import * as Fee from './fee';
import * as UtxoHelper from './utxoHelper';
import { TracingPolicies, TransferOperationBuilder } from './ledger/types';

jest.mock('../api/sdkAsset/sdkAsset', () => ({
  getAssetDetails: jest.fn(),
}));

import { getAssetDetails } from '../api/sdkAsset/sdkAsset';

const mockGetAssetDetails = getAssetDetails as jest.MockedFunction<typeof getAssetDetails>;

const amount = BigInt(3);

jest.mock('../api/network', () => ({
  getOwnerMemo: jest.fn(() => Promise.resolve({ response: null })),
}));

interface TransferOpBuilderLight {
  add_input_with_tracing: () => TransferOpBuilderLight;
  add_input_no_tracing: () => TransferOpBuilderLight;
  add_output_with_tracing: () => TransferOpBuilderLight;
  add_output_no_tracing: () => TransferOpBuilderLight;
}

describe('fee', () => {
  describe('getTransferOperation', () => {
    const pkey = 'h9rkZIY4ytl1MbMkEMMlUtDc2gD4KrP59bIbEvcbHFA=';

    const password = '123';
    const assetCode = 'foo';

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

      mockGetAssetDetails.mockImplementation(jest.fn(() => Promise.resolve(mockedAssetNonTracing)));

      const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder');

      spyGetEmptyTransferBuilder.mockImplementation(() => {
        return Promise.resolve((fakeOpBuilder as unknown) as TransferOperationBuilder);
      });

      const spyInputNoTracing = jest.spyOn(fakeOpBuilder, 'add_input_no_tracing');
      const spyInputWithTracing = jest.spyOn(fakeOpBuilder, 'add_input_with_tracing');
      const spyOutputNoTracing = jest.spyOn(fakeOpBuilder, 'add_output_no_tracing');
      const spyOutputWithTracing = jest.spyOn(fakeOpBuilder, 'add_output_with_tracing');

      const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies');

      spyGetAssetTracingPolicies.mockImplementation(() => {
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

      mockGetAssetDetails.mockImplementation(jest.fn(() => Promise.resolve(mockedAssetTracing)));

      const spyGetEmptyTransferBuilder = jest.spyOn(Fee, 'getEmptyTransferBuilder');

      spyGetEmptyTransferBuilder.mockImplementation(() => {
        return Promise.resolve((fakeOpBuilderTwo as unknown) as TransferOperationBuilder);
      });

      const spyInputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_no_tracing');
      const spyInputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_input_with_tracing');
      const spyOutputNoTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_no_tracing');
      const spyOutputWithTracing = jest.spyOn(fakeOpBuilderTwo, 'add_output_with_tracing');

      const spyGetAssetTracingPolicies = jest.spyOn(Fee, 'getAssetTracingPolicies');

      spyGetAssetTracingPolicies.mockImplementation(() => {
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

      spyGetAssetTracingPolicies.mockRestore();
    });
  });

  // describe('buildTransferOperationWithFee', () => {});

  // describe('buildTransferOperation', () => {});
});
