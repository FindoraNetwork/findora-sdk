import '@testing-library/jest-dom/extend-expect';

import { TransactionBuilder, TransferOperationBuilder } from '../../services/ledger/types';
import * as Staking from './staking';
import * as Transaction from '../transaction/transaction';
import * as Fee from '../../services/fee';
import * as KeypairApi from '../keypair/keypair';

interface TransferOpBuilderLight {
  add_input_with_tracing?: () => TransferOpBuilderLight;
  add_input_no_tracing?: () => TransferOpBuilderLight;
  add_output_with_tracing?: () => TransferOpBuilderLight;
  add_output_no_tracing?: () => TransferOpBuilderLight;
  add_operation_undelegate?: () => TransactionBuilder;
  add_operation_undelegate_partially?: () => TransactionBuilder;
  add_operation_claim_custom?: () => TransactionBuilder;
  add_operation_delegate?: () => TransactionBuilder;
  new?: () => TransferOpBuilderLight;
  add_transfer_operation?: () => TransactionBuilder;
  create?: () => TransferOpBuilderLight;
  sign?: () => TransferOpBuilderLight;
  transaction?: () => string;
}

describe('staking (unit test)', () => {
  describe('undelegate', () => {
    it('undelegates all funds from the validator', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate_partially: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationUndelegate = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddOperationUndelegatePartially = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = true;

      const result = await Staking.unStake(walletInfo, amount, validator, isFullUnstake);

      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddOperationUndelegate).toHaveBeenCalledWith(walletInfo.keypair);
      expect(spyAddOperationUndelegatePartially).not.toHaveBeenCalled();
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationUndelegate.mockRestore();
      spyAddOperationUndelegatePartially.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('partially undelegates funds from the validator', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate_partially: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationUndelegate = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddOperationUndelegatePartially = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = false;

      const result = await Staking.unStake(walletInfo, amount, validator, isFullUnstake);

      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddOperationUndelegate).not.toHaveBeenCalledWith();
      expect(spyAddOperationUndelegatePartially).toHaveBeenCalledWith(
        walletInfo.keypair,
        BigInt(amount),
        validator,
      );
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationUndelegate.mockRestore();
      spyAddOperationUndelegatePartially.mockRestore();
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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = false;

      await expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow(
        'Could not create transfer operation with fee',
      );

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          throw new Error('boom');
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = false;

      await expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow(
        'Could not get "stakingTransactionBuilder"',
      );

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
    });
    it('throws an error when could not add staking unStake operation', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate_partially: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationUndelegatePartially = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
        .mockImplementation(() => {
          throw new Error('bomboom');
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = false;

      await expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow(
        'Could not add staking unStake operation',
      );

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationUndelegatePartially.mockRestore();
    });
    it('throws an error when could not add transfer to unStake operation', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        new: jest.fn(() => {
          return fakeTransactionBuilder;
        }),
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_undelegate_partially: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationUndelegatePartially = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_undelegate_partially')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          throw new Error('bomboom');
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';
      const isFullUnstake = false;

      await expect(Staking.unStake(walletInfo, amount, validator, isFullUnstake)).rejects.toThrow(
        'Could not add transfer to unStake operation',
      );

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationUndelegatePartially.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
  });
  describe('delegate', () => {
    it('delegates funds', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_operation_delegate: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

      const spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
        return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
      });

      const spyAddOperationDelegate = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_delegate')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const address = 'myAddress';
      const assetCode = 'myAssetCode';
      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const validator = 'myValidaotrAddress';

      const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

      const result = await Staking.delegate(
        walletInfo,
        address,
        amount,
        assetCode,
        validator,
        assetBlindRules,
      );

      expect(spyTransactionSendToaddress).toHaveBeenCalledWith(
        walletInfo,
        address,
        amount,
        assetCode,
        assetBlindRules,
      );
      expect(spyAddOperationDelegate).toHaveBeenCalledWith(walletInfo.keypair, validator);
      expect(result).toBe(fakeTransactionBuilder);

      spyTransactionSendToaddress.mockRestore();
      spyAddOperationDelegate.mockRestore();
    });
  });

  describe('claim', () => {
    it('claims the rewards from the validator', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_claim_custom: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationClaimCustom = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const spyAddTransferOperation = jest
        .spyOn(fakeTransactionBuilder, 'add_transfer_operation')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';

      const result = await Staking.claim(walletInfo, amount);

      expect(spyBuildTransferOperationWithFee).toHaveBeenCalledWith(walletInfo);
      expect(spyTransactionGetTransactionBuilder).toHaveBeenCalled();
      expect(spyAddOperationClaimCustom).toHaveBeenCalledWith(walletInfo.keypair, BigInt(amount));
      expect(spyAddTransferOperation).toHaveBeenCalledWith(receivedTransferOperation);

      expect(result).toBe(fakeTransactionBuilder);

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationClaimCustom.mockRestore();
      spyAddTransferOperation.mockRestore();
    });
    it('throws an error if it can not get a transfer operation builder', async () => {
      const receivedTransferOperation = 'txHash';

      const fakeTransferOperationBuilderFee: TransferOpBuilderLight = {
        create: jest.fn(() => {
          return fakeTransferOperationBuilderFee;
        }),
        sign: jest.fn(() => {
          throw new Error('boom');
        }),
        transaction: jest.fn(() => {
          return receivedTransferOperation;
        }),
      };

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';

      await expect(Staking.claim(walletInfo, amount)).rejects.toThrow('Could not create transfer operation');

      spyBuildTransferOperationWithFee.mockRestore();
    });
    it('throws an error if it can not get a transaction operation builder', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_claim_custom: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          throw new Error('boom');
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';

      await expect(Staking.claim(walletInfo, amount)).rejects.toThrow(
        'Could not get "stakingTransactionBuilder"',
      );

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
    });
    it('throws an error if it can not add staking claim operation', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_transfer_operation: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        add_operation_claim_custom: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
      };

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

      const spyBuildTransferOperationWithFee = jest
        .spyOn(Fee, 'buildTransferOperationWithFee')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransferOperationBuilderFee as unknown as TransferOperationBuilder);
        });

      const spyTransactionGetTransactionBuilder = jest
        .spyOn(Transaction, 'getTransactionBuilder')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
        });

      const spyAddOperationClaimCustom = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_claim_custom')
        .mockImplementation(() => {
          throw new Error('bam');
        });

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';

      await expect(Staking.claim(walletInfo, amount)).rejects.toThrow(
        'Could not add staking claim operation',
      );

      spyBuildTransferOperationWithFee.mockRestore();
      spyTransactionGetTransactionBuilder.mockRestore();
      spyAddOperationClaimCustom.mockRestore();
    });
  });
});
