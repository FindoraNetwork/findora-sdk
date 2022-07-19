import '@testing-library/jest-dom/extend-expect';

import * as Fee from '../../services/fee';
import * as KeypairApi from '../keypair/keypair';
import * as NetworkApi from '../network/network';
import * as NetworkTypes from '../network/types';
import * as AssetApi from '../sdkAsset/sdkAsset';
import * as helpers from './helpers';
import * as Processor from './processor';
import { ProcessedTxInfo } from './types';
import * as NodeLedger from '../../services/ledger/nodeLedger';
import * as Transaction from './transaction';
import { TransactionBuilder, TransferOperationBuilder, XfrPublicKey } from '../../services/ledger/types';
import { FindoraWallet } from 'types/findoraWallet';

interface TransferOpBuilderLight {
  add_input_with_tracing?: () => TransferOpBuilderLight;
  add_input_no_tracing?: () => TransferOpBuilderLight;
  add_output_with_tracing?: () => TransferOpBuilderLight;
  add_output_no_tracing?: () => TransferOpBuilderLight;
  new?: () => TransferOpBuilderLight;
  add_transfer_operation?: () => TransferOpBuilderLight;
  create?: () => TransferOpBuilderLight;
  sign?: () => TransferOpBuilderLight;
  transaction?: () => string;
}

describe('transaction (unit test)', () => {
  describe('getTransactionBuilder', () => {
    it('returns transaction builder instance', async () => {
      const fakeOpBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
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

      const result = await Transaction.getTransactionBuilder();

      expect(result).toBe(fakeOpBuilder);

      expect(spyGetLedger).toBeCalled();
      expect(spyNew).toBeCalled();
      expect(spyNew).toHaveBeenCalledWith(BigInt(height));

      spyGetLedger.mockRestore();
      spyNew.mockReset();
      spyGetStateCommitment.mockReset();
    });
    it('throws an error if state commitment result contains an error', async () => {
      const myLedger = {
        foo: 'node',
      } as unknown as NodeLedger.LedgerForNode;

      const myStateCommitementResult = {
        error: new Error('foo bar'),
      };

      const spyGetStateCommitment = jest.spyOn(NetworkApi, 'getStateCommitment').mockImplementation(() => {
        return Promise.resolve(myStateCommitementResult as NetworkTypes.StateCommitmentDataResult);
      });

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      await expect(Transaction.getTransactionBuilder()).rejects.toThrowError('foo bar');

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

      await expect(Transaction.getTransactionBuilder()).rejects.toThrowError(
        'Could not receive response from state commitement call',
      );

      spyGetLedger.mockReset();
      spyGetStateCommitment.mockReset();
    });
  });
  describe('sendToMany', () => {
    it('sends fra to recievers', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fraAssetCode = 'AA';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');

      const result = await Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode);

      expect(spyGetMinimalFee).toHaveBeenCalled();
      expect(spyGetFraPublicKey).toHaveBeenCalled();

      expect(spyBuildTransferOperation).toHaveBeenCalledWith(
        walletInfo,
        [
          {
            assetBlindRules: undefined,
            toPublickey: receiverPubKey,
            utxoNumbers: BigInt(300000),
          },
          {
            utxoNumbers: minimalFee,
            toPublickey,
          },
        ],
        fraAssetCode,
      );

      expect(spyGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddTransferOperation).toHaveBeenLastCalledWith(receivedTransferOperation);
      expect(result).toBe(fakeTransactionBuilder);

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyGetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('throws an error if can not create or sign transaction', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          throw Error('can not sign');
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fraAssetCode = 'AA';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      await expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow(
        'Could not create transfer operation',
      );

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
    });
    it('throws an error if can not get transactionBuilder from getTransactionBuilder', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fraAssetCode = 'AA';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          throw new Error('foo');
        });

      await expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow(
        'Could not get transactionBuilder from "getTransactionBuilder"',
      );

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyGetTransactionBuilder.mockRestore();
    });
    it('throws an error if it can not add a transfer operation', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          throw new Error('boom');
        }),
      };

      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fraAssetCode = 'AA';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');

      await expect(Transaction.sendToMany(walletInfo, recieversInfo, fraAssetCode)).rejects.toThrow(
        'Could not add transfer operation',
      );

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyGetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('sends custom asset to recievers', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';
      const receivedTransferOperationFee = 'txHashFee';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperationFee;
        }),
      };

      const fraAssetCode = 'AA';
      const customAssetCode = 'BB';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');

      const result = await Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode);

      expect(spyGetMinimalFee).not.toHaveBeenCalled();
      expect(spyGetFraPublicKey).not.toHaveBeenCalled();

      expect(spyBuildTransferOperation).toHaveBeenCalledWith(
        walletInfo,
        [
          {
            assetBlindRules: undefined,
            toPublickey: receiverPubKey,
            utxoNumbers: BigInt(300000),
          },
        ],
        customAssetCode,
      );

      expect(spyGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperationFee);

      expect(result).toBe(fakeTransactionBuilder);

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('throws an error if can not create or sign transaction to add fee', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';
      const receivedTransferOperationFee = 'txHashFee';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          throw new Error('foofoo');
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperationFee;
        }),
      };

      const fraAssetCode = 'AA';
      const customAssetCode = 'BB';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');

      await expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow(
        'Could not create transfer operation for fee',
      );

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('throws an error if it can not add a transfer operation for fee', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const receivedTransferOperation = 'txHash';
      const receivedTransferOperationFee = 'txHashFee';

      const fakeTransferOperationBuilder: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilder;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperationFee;
        }),
      };

      const fraAssetCode = 'AA';
      const customAssetCode = 'BB';

      const receiverPubKey = 'toPubKey';

      const minimalFee = BigInt(2);

      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const toWalletInfo = { publickey: receiverPubKey } as KeypairApi.WalletKeypar;

      const recieversInfo = [{ reciverWalletInfo: toWalletInfo, amount: '3' }];

      const myLedger = {
        foo: 'node',
        TransactionBuilder: fakeTransactionBuilder,
        TransferOperationBuilder: fakeTransferOperationBuilder,
        fra_get_asset_code: jest.fn(() => {
          return fraAssetCode;
        }),
        public_key_from_base64: jest.fn(() => {
          return receiverPubKey;
        }),
      } as unknown as NodeLedger.LedgerForNode;

      const assetDetails = {
        assetRules: {
          decimals: 5,
        },
      };

      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myLedger);
      });

      const spyGetAssetDetails = jest.spyOn(AssetApi, 'getAssetDetails').mockImplementation(() => {
        return Promise.resolve(assetDetails as FindoraWallet.IAsset);
      });

      const spyGetMinimalFee = jest.spyOn(AssetApi, 'getMinimalFee').mockImplementation(() => {
        return Promise.resolve(minimalFee);
      });

      const spyGetFraPublicKey = jest.spyOn(AssetApi, 'getFraPublicKey').mockImplementation(() => {
        return Promise.resolve(toPublickey);
      });

      const spyBuildTransferOperation = jest.spyOn(Fee, 'buildTransferOperation').mockImplementation(() => {
        return Promise.resolve(fakeTransferOperationBuilder as unknown as TransferOperationBuilder);
      });

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddTransferOperation = jest.spyOn(fakeTransactionBuilder, 'add_transfer_operation');

      spyAddTransferOperation
        .mockImplementationOnce(() => {
          return fakeTransactionBuilder;
        })
        .mockImplementationOnce(() => {
          throw Error('barfoo');
        });

      await expect(Transaction.sendToMany(walletInfo, recieversInfo, customAssetCode)).rejects.toThrow(
        'Could not add transfer operation for fee',
      );

      spyGetLedger.mockRestore();
      spyGetAssetDetails.mockRestore();
      spyGetMinimalFee.mockRestore();
      spyGetFraPublicKey.mockRestore();
      spyBuildTransferOperation.mockRestore();
      spyBuildTransferOperationWithFee.mockRestore();
      spyGetTransactionBuilder.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
  });
  describe('submitTransaction', () => {
    it('submits a transaction and returns a handle', async () => {
      const myHandle = 'myHandleFromSubmit';

      const submitData = {
        foo: 'bar',
      };

      const fakeTransactionBuilder = {
        transaction: jest.fn(() => {
          return submitData;
        }),
      } as unknown as TransactionBuilder;

      const submitResult = {
        response: myHandle,
      } as NetworkTypes.SubmitTransactionDataResult;

      const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
        return Promise.resolve(submitResult);
      });

      const handle = await Transaction.submitTransaction(fakeTransactionBuilder);

      expect(spySubmitTransaction).toHaveBeenCalledWith(submitData);

      expect(handle).toBe(myHandle);

      spySubmitTransaction.mockRestore();
    });
    it('throws an error if network call to submit data has failed', async () => {
      const submitData = {
        foo: 'bar',
      };

      const fakeTransactionBuilder = {
        transaction: jest.fn(() => {
          return submitData;
        }),
      } as unknown as TransactionBuilder;

      const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
        throw new Error('foo');
      });

      await expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow(
        'Error Could not submit transaction',
      );

      spySubmitTransaction.mockRestore();
    });
    it('throws an error if network call to submit data has return an error', async () => {
      const submitData = {
        foo: 'bar',
      };

      const fakeTransactionBuilder = {
        transaction: jest.fn(() => {
          return submitData;
        }),
      } as unknown as TransactionBuilder;

      const submitResult = {
        error: new Error('barfoo'),
      } as NetworkTypes.SubmitTransactionDataResult;

      const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
        return Promise.resolve(submitResult);
      });

      await expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow(
        'Could not submit transaction',
      );

      spySubmitTransaction.mockRestore();
    });
    it('throws an error if network call to submit data has an empty handle as a response', async () => {
      const submitData = {
        foo: 'bar',
      };

      const fakeTransactionBuilder = {
        transaction: jest.fn(() => {
          return submitData;
        }),
      } as unknown as TransactionBuilder;

      const submitResult = {
        response: undefined,
      } as NetworkTypes.SubmitTransactionDataResult;

      const spySubmitTransaction = jest.spyOn(NetworkApi, 'submitTransaction').mockImplementation(() => {
        return Promise.resolve(submitResult);
      });

      await expect(Transaction.submitTransaction(fakeTransactionBuilder)).rejects.toThrow(
        'Handle is missing. Could not submit transaction',
      );

      spySubmitTransaction.mockRestore();
    });
  });
  describe('sendToPublicKey', () => {
    it('send a transaction to an address', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;

      const publicKey = 'pub123';
      const address = 'fra123';
      const amount = '0.5';
      const assetCode = 'CCC';
      const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

      const spyGetAddressByPublicKey = jest
        .spyOn(KeypairApi, 'getAddressByPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(address);
        });

      const spySendToAddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
        return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
      });

      const result = await Transaction.sendToPublicKey(
        walletInfo,
        publicKey,
        amount,
        assetCode,
        assetBlindRules,
      );

      expect(spyGetAddressByPublicKey).toHaveBeenCalledWith(publicKey);
      expect(spySendToAddress).toHaveBeenCalledWith(walletInfo, address, amount, assetCode, assetBlindRules);
      expect(result).toBe(fakeTransactionBuilder);

      spySendToAddress.mockRestore();
      spyGetAddressByPublicKey.mockRestore();
    });
  });
  describe('sendToAddress', () => {
    it('send a transaction to an address', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
      };

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;

      const address = 'fra123';
      const amount = '0.5';
      const assetCode = 'CCC';
      const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

      const toWalletInfoLight = {
        address: 'fra123',
        publickey: 'pub456',
      };

      const recieversInfo = [{ reciverWalletInfo: toWalletInfoLight, amount }];

      const spyGetAddressPublicAndKey = jest
        .spyOn(KeypairApi, 'getAddressPublicAndKey')
        .mockImplementation(() => {
          return Promise.resolve(toWalletInfoLight);
        });

      const spySendToMany = jest.spyOn(Transaction, 'sendToMany').mockImplementation(() => {
        return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
      });

      const result = await Transaction.sendToAddress(walletInfo, address, amount, assetCode, assetBlindRules);

      expect(spyGetAddressPublicAndKey).toHaveBeenCalledWith(address);
      expect(spySendToMany).toHaveBeenCalledWith(walletInfo, recieversInfo, assetCode, assetBlindRules);
      expect(result).toBe(fakeTransactionBuilder);

      spySendToMany.mockRestore();
      spyGetAddressPublicAndKey.mockRestore();
    });
  });

  describe('getTxList', () => {
    it('returns a list of transactions', async () => {
      const address = 'fra123';
      const type = 'to';
      const page = 2;

      const totalTxQuantity = 5;

      const dataResult = {
        response: {
          result: {
            total_count: totalTxQuantity,
          },
        },
      } as unknown as NetworkTypes.TxListDataResult;

      const txList = [
        {
          foo: 'bar',
        },
      ] as unknown as NetworkTypes.TxInfo[];

      const processedTxList = [
        {
          bar: 'foo',
        },
      ] as unknown as ProcessedTxInfo[];

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
        return Promise.resolve(dataResult);
      });

      const spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(() => {
        return txList;
      });

      const spyProcesseTxInfoList = jest.spyOn(Processor, 'processeTxInfoList').mockImplementation(() => {
        return Promise.resolve(processedTxList);
      });

      const result = await Transaction.getTxList(address, type, page);

      expect(spyGetTxList).toHaveBeenCalledWith(address, type, page);
      expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);
      expect(spyProcesseTxInfoList).toHaveBeenCalledWith(txList);
      expect(result).toEqual({
        total_count: totalTxQuantity,
        txs: processedTxList,
      });

      spyGetTxList.mockRestore();
      spyGetTxListFromResponse.mockRestore();
      spyProcesseTxInfoList.mockRestore();
    });
    it('throws an error if it can not fetch a list of transactions', async () => {
      const address = 'fra123';
      const type = 'to';
      const page = 2;

      const dataResult = {} as unknown as NetworkTypes.TxListDataResult;

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
        return Promise.resolve(dataResult);
      });

      await expect(Transaction.getTxList(address, type, page)).rejects.toThrow(
        'Could not fetch a list of transactions. No response from the server',
      );

      spyGetTxList.mockRestore();
    });
    it('throws an error if there is no list of transactions', async () => {
      const address = 'fra123';
      const type = 'to';
      const page = 2;

      const totalTxQuantity = 5;

      const dataResult = {
        response: {
          result: {
            total_count: totalTxQuantity,
          },
        },
      } as unknown as NetworkTypes.TxListDataResult;

      const txList = undefined as unknown as NetworkTypes.TxInfo[];

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
        return Promise.resolve(dataResult);
      });

      const spyGetTxListFromResponse = jest.spyOn(helpers, 'getTxListFromResponse').mockImplementation(() => {
        return txList;
      });

      await expect(Transaction.getTxList(address, type, page)).rejects.toThrow(
        'Could not get a list of transactions from the server response',
      );

      expect(spyGetTxList).toHaveBeenCalledWith(address, type, page);
      expect(spyGetTxListFromResponse).toHaveBeenCalledWith(dataResult);

      spyGetTxList.mockRestore();
      spyGetTxListFromResponse.mockRestore();
    });
  });
});
