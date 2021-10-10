import '@testing-library/jest-dom/extend-expect';

import { toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import * as KeypairApi from '../keypair/keypair';
import * as SdkAsset from './sdkAsset';
import * as NodeLedger from '../../services/ledger/nodeLedger';
import { DEFAULT_ASSET_RULES } from '../../config/asset';
import * as NetworkApi from '../network/network';
import * as NetworkTypes from '../network/types';
import {
  AssetRules as LedgerAssetRules,
  AssetTracerKeyPair as LedgerAssetTracerKeyPair,
  TracingPolicy as LedgerTracingPolicy,
  TransactionBuilder,
  TransferOperationBuilder,
  XfrKeyPair,
} from '../../services/ledger/types';
import { AssetBlindRules } from './sdkAsset';

interface FakeLedgerAssetRules {
  new?: () => FakeLedgerAssetRules;
  set_transferable?: () => FakeLedgerAssetRules;
  set_updatable?: () => FakeLedgerAssetRules;
  set_decimals?: () => FakeLedgerAssetRules;
}

interface TransferOpBuilderLight {
  add_input_with_tracing?: () => TransferOpBuilderLight;
  add_input_no_tracing?: () => TransferOpBuilderLight;
  add_output_with_tracing?: () => TransferOpBuilderLight;
  add_output_no_tracing?: () => TransferOpBuilderLight;
  new?: () => TransferOpBuilderLight;
  create?: () => TransferOpBuilderLight;
  sign?: () => TransferOpBuilderLight;
  add_operation_create_asset?: () => TransferOpBuilderLight;
  add_transfer_operation?: () => TransactionBuilder;
  add_basic_issue_asset?: () => TransferOpBuilderLight;
  transaction?: () => string;
}

interface PubParamsLight {
  new?: () => string;
}

describe('sdkAsset (unit test)', () => {
  describe('getFraAssetCode', () => {
    it('returns an fra asset code', async () => {
      const fraAssetCode = 'AA';

      const myLedger = {
        foo: 'node',
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const result = await SdkAsset.getFraAssetCode();

      expect(spyGetLedger).toHaveBeenCalled();
      expect(result).toBe(fraAssetCode);

      spyGetLedger.mockRestore();
    });
  });
  describe('getMinimalFee', () => {
    it('returns an fra minimal fee', async () => {
      const fraMinimalFee = BigInt(2);

      const myLedger = {
        foo: 'node',
        fra_get_minimal_fee: jest.fn(() => {
          return fraMinimalFee;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const result = await SdkAsset.getMinimalFee();

      expect(spyGetLedger).toHaveBeenCalled();
      expect(result).toBe(fraMinimalFee);

      spyGetLedger.mockRestore();
    });
  });
  describe('getFraPublicKey', () => {
    it('returns an fra public key', async () => {
      const fraPublicKey = 'myPub';

      const myLedger = {
        foo: 'node',
        fra_get_dest_pubkey: jest.fn(() => {
          return fraPublicKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const result = await SdkAsset.getFraPublicKey();

      expect(spyGetLedger).toHaveBeenCalled();
      expect(result).toBe(fraPublicKey);

      spyGetLedger.mockRestore();
    });
  });
  describe('getAssetCode', () => {
    it('returns a required asset code', async () => {
      const decryptedAsetType = 'myPub';

      const val = [1, 2];

      const myLedger = {
        foo: 'node',
        asset_type_from_jsvalue: jest.fn(() => {
          return decryptedAsetType;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetTypeFromJsvalue = jest.spyOn(myLedger, 'asset_type_from_jsvalue');

      const result = await SdkAsset.getAssetCode(val);

      expect(spyGetLedger).toHaveBeenCalledWith();
      expect(spyLedgerAssetTypeFromJsvalue).toHaveBeenCalledWith(val);

      expect(result).toBe(decryptedAsetType);

      spyGetLedger.mockRestore();
      spyLedgerAssetTypeFromJsvalue.mockRestore();
    });
  });
  describe('getDefaultAssetRules', () => {
    it('returns default asset rules', async () => {
      const defaultTransferable = DEFAULT_ASSET_RULES.transferable;
      const defaultUpdatable = DEFAULT_ASSET_RULES.updatable;
      const defaultDecimals = DEFAULT_ASSET_RULES.decimals;

      const fakeLedgerAssetRules: FakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      };

      const myLedger = {
        foo: 'node',
        AssetRules: fakeLedgerAssetRules,
      } as unknown as NodeLedger.LedgerForNode;

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetRulesNew = jest.spyOn(fakeLedgerAssetRules, 'new');
      const spyLedgerAssetRulesSetTransferable = jest.spyOn(fakeLedgerAssetRules, 'set_transferable');
      const spyLedgerAssetRulesSetUpdatable = jest.spyOn(fakeLedgerAssetRules, 'set_updatable');
      const spyLedgerAssetRulesSetDecimals = jest.spyOn(fakeLedgerAssetRules, 'set_decimals');

      const result = await SdkAsset.getDefaultAssetRules();

      expect(spyGetLedger).toHaveBeenCalled();
      expect(spyLedgerAssetRulesNew).toHaveBeenCalled();
      expect(spyLedgerAssetRulesSetTransferable).toHaveBeenCalledWith(defaultTransferable);
      expect(spyLedgerAssetRulesSetUpdatable).toHaveBeenCalledWith(defaultUpdatable);
      expect(spyLedgerAssetRulesSetDecimals).toHaveBeenCalledWith(defaultDecimals);

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetLedger.mockRestore();
      spyLedgerAssetRulesNew.mockRestore();
      spyLedgerAssetRulesSetTransferable.mockRestore();
      spyLedgerAssetRulesSetUpdatable.mockRestore();
      spyLedgerAssetRulesSetDecimals.mockRestore();
    });
  });
  describe('getAssetRules', () => {
    it('returns default asset rules if no new asset rules are given', async () => {
      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const result = await SdkAsset.getAssetRules();

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetDefaultAssetRules.mockRestore();
    });

    it('returns asset rules with max units set', async () => {
      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_max_units: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        add_tracing_policy: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const fakeLedgerAssetTracerKeyPair = {
        new: jest.fn(() => {
          return fakeLedgerAssetTracerKeyPair;
        }),
      } as unknown as LedgerAssetTracerKeyPair;

      const fakeLedgerTracingPolicy = {
        new_with_tracing: jest.fn(() => {
          return fakeLedgerTracingPolicy;
        }),
      } as unknown as LedgerTracingPolicy;

      const myLedger = {
        foo: 'node',
        AssetRules: fakeLedgerAssetRules,
        AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
        TracingPolicy: fakeLedgerTracingPolicy,
      } as unknown as NodeLedger.LedgerForNode;

      const maxNumbers = '10000000';

      const newAssetRules = {
        transferable: true,
        updatable: false,
        decimals: 6,
        traceable: true,
        maxNumbers,
      };

      const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');

      const result = await SdkAsset.getAssetRules(newAssetRules);

      expect(spyLedgerAssetRulesSetMaxUnits).toHaveBeenCalledWith(BigInt(maxNumbers));

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetDefaultAssetRules.mockRestore();
      spyGetLedger.mockRestore();
      spyLedgerAssetRulesSetMaxUnits.mockRestore();
    });

    it('returns asset rules without max units set and setter is not called', async () => {
      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_max_units: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        add_tracing_policy: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const fakeLedgerAssetTracerKeyPair = {
        new: jest.fn(() => {
          return fakeLedgerAssetTracerKeyPair;
        }),
      } as unknown as LedgerAssetTracerKeyPair;

      const fakeLedgerTracingPolicy = {
        new_with_tracing: jest.fn(() => {
          return fakeLedgerTracingPolicy;
        }),
      } as unknown as LedgerTracingPolicy;

      const myLedger = {
        foo: 'node',
        AssetRules: fakeLedgerAssetRules,
        AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
        TracingPolicy: fakeLedgerTracingPolicy,
      } as unknown as NodeLedger.LedgerForNode;

      const newAssetRules = {
        transferable: true,
        updatable: false,
        decimals: 6,
        traceable: true,
      };

      const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetRulesSetMaxUnits = jest.spyOn(fakeLedgerAssetRules, 'set_max_units');

      const result = await SdkAsset.getAssetRules(newAssetRules);

      expect(spyLedgerAssetRulesSetMaxUnits).not.toHaveBeenCalled();

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetDefaultAssetRules.mockRestore();
      spyGetLedger.mockRestore();
      spyLedgerAssetRulesSetMaxUnits.mockRestore();
    });

    it('returns asset rules with tracing policy', async () => {
      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_max_units: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        add_tracing_policy: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const trackingKey = 'myTrackingKey';

      const fakeLedgerAssetTracerKeyPair = {
        new: jest.fn(() => {
          return trackingKey;
        }),
      };

      const tracingPolicy = 'myTracingPolicy';

      const fakeLedgerTracingPolicy = {
        new_with_tracing: jest.fn(() => {
          return tracingPolicy;
        }),
      };

      const myLedger = {
        foo: 'node',
        AssetRules: fakeLedgerAssetRules,
        AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
        TracingPolicy: fakeLedgerTracingPolicy,
      } as unknown as NodeLedger.LedgerForNode;

      const newAssetRules = {
        transferable: true,
        updatable: false,
        decimals: 6,
        traceable: true,
      };

      const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
      const spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');
      const spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');

      const result = await SdkAsset.getAssetRules(newAssetRules);

      expect(spyLedgerAssetTracerKeyPairNew).toHaveBeenCalled();
      expect(spyLedgerTracingPolicyNewWithTracing).toHaveBeenCalledWith(trackingKey);
      expect(spyLedgerAssetRulesAddTracingPolicy).toHaveBeenCalledWith(tracingPolicy);

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetDefaultAssetRules.mockRestore();
      spyGetLedger.mockRestore();
      spyLedgerAssetTracerKeyPairNew.mockRestore();
      spyLedgerTracingPolicyNewWithTracing.mockRestore();
      spyLedgerAssetRulesAddTracingPolicy.mockRestore();
    });

    it('returns asset rules without tracing policy and tracing method was not called', async () => {
      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_transferable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_updatable: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_decimals: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        set_max_units: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
        add_tracing_policy: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const trackingKey = 'myTrackingKey';

      const fakeLedgerAssetTracerKeyPair = {
        new: jest.fn(() => {
          return trackingKey;
        }),
      };

      const tracingPolicy = 'myTracingPolicy';

      const fakeLedgerTracingPolicy = {
        new_with_tracing: jest.fn(() => {
          return tracingPolicy;
        }),
      };

      const myLedger = {
        foo: 'node',
        AssetRules: fakeLedgerAssetRules,
        AssetTracerKeyPair: fakeLedgerAssetTracerKeyPair,
        TracingPolicy: fakeLedgerTracingPolicy,
      } as unknown as NodeLedger.LedgerForNode;

      const newAssetRules = {
        transferable: true,
        updatable: false,
        decimals: 6,
        traceable: false,
      };

      const spyGetDefaultAssetRules = jest.spyOn(SdkAsset, 'getDefaultAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyLedgerAssetTracerKeyPairNew = jest.spyOn(fakeLedgerAssetTracerKeyPair, 'new');
      const spyLedgerTracingPolicyNewWithTracing = jest.spyOn(fakeLedgerTracingPolicy, 'new_with_tracing');

      const spyLedgerAssetRulesAddTracingPolicy = jest.spyOn(fakeLedgerAssetRules, 'add_tracing_policy');

      const result = await SdkAsset.getAssetRules(newAssetRules);

      expect(spyLedgerAssetTracerKeyPairNew).not.toHaveBeenCalled();
      expect(spyLedgerTracingPolicyNewWithTracing).not.toHaveBeenCalledWith();

      expect(spyLedgerAssetRulesAddTracingPolicy).not.toHaveBeenCalledWith();

      expect(result).toBe(fakeLedgerAssetRules);

      spyGetDefaultAssetRules.mockRestore();
      spyGetLedger.mockRestore();
      spyLedgerAssetTracerKeyPairNew.mockRestore();
      spyLedgerTracingPolicyNewWithTracing.mockRestore();
      spyLedgerAssetRulesAddTracingPolicy.mockRestore();
    });
  });
  describe('getDefineAssetTransactionBuilder', () => {
    it('returns transaction builder instance', async () => {
      const fakeOpBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_operation_create_asset: jest.fn(() => {
          return fakeOpBuilder;
        }),
      };

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeOpBuilder,
      } as unknown as NodeLedger.LedgerForNode;

      const height = 15;

      const myStateCommitementResult = {
        response: ['foo', height],
      };
      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyNew = jest.spyOn(fakeOpBuilder, 'new');
      const spyAddOperationCreateAsset = jest.spyOn(fakeOpBuilder, 'add_operation_create_asset');

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';
      const assetRules = { foo: 'bar' } as unknown as LedgerAssetRules;
      const assetMemo = 'memo';

      const result = await SdkAsset.getDefineAssetTransactionBuilder(
        walletKeypair,
        assetName,
        assetRules,
        assetMemo,
      );

      expect(result).toBe(fakeOpBuilder);

      expect(spyGetLedger).toBeCalled();
      expect(spyNew).toHaveBeenCalledWith(BigInt(height));
      expect(spyAddOperationCreateAsset).toHaveBeenCalledWith(
        walletKeypair,
        assetMemo,
        assetName,
        assetRules,
      );

      spyGetLedger.mockRestore();
      spyNew.mockReset();
      spyAddOperationCreateAsset.mockReset();
      spyGetStateCommitment.mockReset();
    });

    it('throws an error if state commitment result contains an error', async () => {
      const myLedger = {
        foo: 'node',
      } as unknown as NodeLedger.LedgerForNode;

      const myStateCommitementResult = {
        error: new Error('myStateCommitementResult error'),
      };

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';
      const assetRules = { foo: 'bar' } as unknown as LedgerAssetRules;
      const assetMemo = 'memo';

      await expect(
        SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo),
      ).rejects.toThrowError('myStateCommitementResult error');

      spyGetLedger.mockReset();
      spyGetStateCommitment.mockReset();
    });

    it('throws an error if state commitment result does not contain a response', async () => {
      const myLedger = {
        foo: 'node',
      } as unknown as NodeLedger.LedgerForNode;

      const myStateCommitementResult = {};

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';
      const assetRules = { foo: 'bar' } as unknown as LedgerAssetRules;
      const assetMemo = 'memo';

      await expect(
        SdkAsset.getDefineAssetTransactionBuilder(walletKeypair, assetName, assetRules, assetMemo),
      ).rejects.toThrowError('Could not receive response from state commitement call');

      spyGetLedger.mockReset();
      spyGetStateCommitment.mockReset();
    });
  });
  describe('getIssueAssetTransactionBuilder', () => {
    it('returns transaction builder instance', async () => {
      const fakeOpBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_operation_create_asset: jest.fn(() => {
          return fakeOpBuilder;
        }),
        add_basic_issue_asset: jest.fn(() => {
          return fakeOpBuilder;
        }),
      };

      const fakePubParams: PubParamsLight = {
        new: jest.fn(() => {
          return 'myParams';
        }),
      };

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeOpBuilder,
        PublicParams: fakePubParams,
      } as unknown as NodeLedger.LedgerForNode;

      const height = 15;

      const myStateCommitementResult = {
        response: ['foo', height],
      };

      const blockCount = BigInt(height);

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyNew = jest.spyOn(fakeOpBuilder, 'new');
      const spyAddBasicIssueAsset = jest.spyOn(fakeOpBuilder, 'add_basic_issue_asset');

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';

      const amountToIssue = '11';
      const assetBlindRules = { foo: 'barbar' };
      const assetDecimals = 6;

      const result = await SdkAsset.getIssueAssetTransactionBuilder(
        walletKeypair,
        assetName,
        amountToIssue,
        assetBlindRules as AssetBlindRules,
        assetDecimals,
      );

      expect(result).toBe(fakeOpBuilder);

      expect(spyGetLedger).toBeCalled();
      expect(spyNew).toHaveBeenCalledWith(BigInt(height));

      const utxoNumbers = BigInt(toWei(amountToIssue, assetDecimals).toString());

      expect(spyAddBasicIssueAsset).toHaveBeenCalledWith(
        walletKeypair,
        assetName,
        BigInt(blockCount),
        utxoNumbers,
        false,
        'myParams',
      );

      spyGetStateCommitment.mockReset();
      spyGetLedger.mockRestore();
      spyNew.mockReset();
      spyAddBasicIssueAsset.mockReset();
    });

    it('throws an error if state commitment result contains an error', async () => {
      const myLedger = {
        foo: 'node',
      } as unknown as NodeLedger.LedgerForNode;

      const myStateCommitementResult = {
        error: new Error('myStateCommitementResult error'),
      };

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';
      const amountToIssue = '11';
      const assetBlindRules = { foo: 'barbar' };
      const assetDecimals = 6;

      await expect(
        SdkAsset.getIssueAssetTransactionBuilder(
          walletKeypair,
          assetName,
          amountToIssue,
          assetBlindRules as AssetBlindRules,
          assetDecimals,
        ),
      ).rejects.toThrowError('myStateCommitementResult error');

      spyGetLedger.mockReset();
      spyGetStateCommitment.mockReset();
    });

    it('throws an error if state commitment result does not contain a response', async () => {
      const myLedger = {
        foo: 'node',
      } as unknown as NodeLedger.LedgerForNode;

      const myStateCommitementResult = {};

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const walletKeypair = walletInfo.keypair as XfrKeyPair;
      const assetName = 'abc';
      const amountToIssue = '11';
      const assetBlindRules = { foo: 'barbar' };
      const assetDecimals = 6;

      await expect(
        SdkAsset.getIssueAssetTransactionBuilder(
          walletKeypair,
          assetName,
          amountToIssue,
          assetBlindRules as AssetBlindRules,
          assetDecimals,
        ),
      ).rejects.toThrowError('Could not receive response from state commitement call');

      spyGetLedger.mockReset();
      spyGetStateCommitment.mockReset();
    });
  });
  describe('defineAsset', () => {
    it('defines an asset', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetDefineAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';
      const assetMemo = 'memo';

      const newAssetRules = {
        transferable: true,
        updatable: false,
        decimals: 6,
        traceable: true,
      };

      const result = await SdkAsset.defineAsset(walletInfo, assetName, assetMemo, newAssetRules);

      expect(spyGetAssetRules).toHaveBeenCalledWith(newAssetRules);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyGetDefineAssetTransactionBuilder).toHaveBeenCalledWith(
        walletInfo.keypair,
        assetName,
        fakeLedgerAssetRules,
        assetMemo,
      );
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyGetAssetRules.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetDefineAssetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });

    it('throws an error when could not create a transfer operation', async () => {
      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          throw new Error('boom');
        }),
      };

      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';
      const assetMemo = 'memo';

      await expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow(
        'Could not create transfer operation',
      );

      spyGetAssetRules.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
    });

    it('throws an error when could not create a transaction builder', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetDefineAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
        .mockImplementation(() => {
          throw new Error('boom');
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';
      const assetMemo = 'memo';

      await expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow(
        'Could not get "defineTransactionBuilder',
      );

      spyGetAssetRules.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetDefineAssetTransactionBuilder.mockRestore();
    });

    it('throws an error when could not add a transfer operation', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeLedgerAssetRules = {
        new: jest.fn(() => {
          return fakeLedgerAssetRules;
        }),
      } as unknown as LedgerAssetRules;

      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyGetAssetRules = jest.spyOn(SdkAsset, 'getAssetRules').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetRules);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetDefineAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getDefineAssetTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          throw new Error('boom');
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';
      const assetMemo = 'memo';

      await expect(SdkAsset.defineAsset(walletInfo, assetName, assetMemo)).rejects.toThrow(
        'Could not add transfer operation',
      );

      spyGetAssetRules.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetDefineAssetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
  });
  describe('issueAsset', () => {
    it('issues an asset with default decimal, coming from asset details', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const decimals = 6;

      const fakeLedgerAssetDetails = {
        assetRules: {
          decimals,
        },
      } as unknown as FindoraWallet.IAsset;

      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetDetails);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetIssueAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';

      const amountToIssue = '123';
      const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
      };

      const result = await SdkAsset.issueAsset(
        walletInfo,
        assetName,
        amountToIssue,
        assetBlindRules,
        decimals,
      );

      expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(
        walletInfo.keypair,
        assetName,
        amountToIssue,
        assetBlindRules,
        decimals,
      );
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyGetAssetDetails.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetIssueAssetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });

    it('issues an asset with a given decimal', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const decimals = 6;

      const fakeLedgerAssetDetails = {
        assetRules: {
          decimals,
        },
      } as unknown as FindoraWallet.IAsset;

      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetDetails);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetIssueAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';

      const amountToIssue = '123';
      const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
      };

      const result = await SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7);

      expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyGetIssueAssetTransactionBuilder).toHaveBeenCalledWith(
        walletInfo.keypair,
        assetName,
        amountToIssue,
        assetBlindRules,
        7,
      );
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyGetAssetDetails.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetIssueAssetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });

    it('throws an error when could not create a transfer operation', async () => {
      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          throw new Error('boom');
        }),
      };

      const decimals = 6;

      const fakeLedgerAssetDetails = {
        assetRules: {
          decimals,
        },
      } as unknown as FindoraWallet.IAsset;

      const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetDetails);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';

      const amountToIssue = '123';
      const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
      };

      await expect(
        SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7),
      ).rejects.toThrow('Could not create transfer operation');

      expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);

      spyGetAssetDetails.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
    });

    it('throws an error when could not create a transaction builder', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const decimals = 6;

      const fakeLedgerAssetDetails = {
        assetRules: {
          decimals,
        },
      } as unknown as FindoraWallet.IAsset;

      const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetDetails);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetIssueAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
        .mockImplementation(() => {
          throw new Error('bdnd');
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';

      const amountToIssue = '123';
      const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
      };

      await expect(
        SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7),
      ).rejects.toThrow('Could not get "issueAssetTransactionBuilder"');

      expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);

      spyGetAssetDetails.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetIssueAssetTransactionBuilder.mockRestore();
    });

    it('throws an error when could not create a transaction builder', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const decimals = 6;

      const fakeLedgerAssetDetails = {
        assetRules: {
          decimals,
        },
      } as unknown as FindoraWallet.IAsset;

      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyGetAssetDetails = jest.spyOn(SdkAsset, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(fakeLedgerAssetDetails);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetIssueAssetTransactionBuilder = jest
        .spyOn(SdkAsset, 'getIssueAssetTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          throw new Error('bad');
        });

      const walletInfo = {
        publickey: 'senderPub',
        keypair: 'senderKeypair',
        address: 'myAddress',
      } as unknown as KeypairApi.WalletKeypar;

      const assetName = 'acb';

      const amountToIssue = '123';
      const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
      };

      await expect(
        SdkAsset.issueAsset(walletInfo, assetName, amountToIssue, assetBlindRules, 7),
      ).rejects.toThrow('Could not add transfer operation');

      expect(spyGetAssetDetails).toHaveBeenCalledWith(assetName);
      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);

      spyGetAssetDetails.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetIssueAssetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
  });
  describe('getAssetDetails', () => {
    it('returns asset details', async () => {
      const assetCode = 'abc';

      const issuerKey = 'myIssuerKey';
      const issuerAddress = 'myIssuerAddress';

      const assetMemo = 'myMemo';

      const assetRules = {
        transferable: false,
        updatable: false,
      };

      const assetResult = {
        properties: {
          issuer: {
            key: issuerKey,
          },
          memo: assetMemo,
          asset_rules: assetRules,
        },
      };

      const getAssetTokenResult = {
        response: assetResult,
      } as NetworkTypes.AssetTokenDataResult;

      const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
        return Promise.resolve(getAssetTokenResult);
      });

      const spGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(issuerAddress);
        });

      const result = await SdkAsset.getAssetDetails(assetCode);

      const expectedResult = {
        code: assetCode,
        issuer: issuerKey,
        address: issuerAddress,
        memo: assetMemo,
        assetRules: { ...DEFAULT_ASSET_RULES, ...assetRules },
        numbers: BigInt(0),
        name: '',
      };

      expect(result).toStrictEqual(expectedResult);

      spyGetAssetToken.mockRestore();
      spGetAddressByPublicKey.mockRestore();
    });

    it('throws an error if could not get asset token', async () => {
      const assetCode = 'abc';

      const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
        throw new Error('bcd');
      });

      await expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset token');

      spyGetAssetToken.mockRestore();
    });

    it('throws an error if could not get asset details - there is an error in the result', async () => {
      const assetCode = 'abc';

      const getAssetTokenResult = {
        error: new Error('dodo'),
      } as NetworkTypes.AssetTokenDataResult;

      const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
        return Promise.resolve(getAssetTokenResult);
      });

      await expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow('Could not get asset details');

      spyGetAssetToken.mockRestore();
    });

    it('throws an error if could not get asset details - there is no response in the result', async () => {
      const assetCode = 'abc';

      const getAssetTokenResult = {} as NetworkTypes.AssetTokenDataResult;

      const spyGetAssetToken = jest.spyOn(NetworkApi, 'getAssetToken').mockImplementation(() => {
        return Promise.resolve(getAssetTokenResult);
      });

      await expect(SdkAsset.getAssetDetails(assetCode)).rejects.toThrow(
        'Could not get asset details - asset result is missing',
      );

      spyGetAssetToken.mockRestore();
    });
  });
});
