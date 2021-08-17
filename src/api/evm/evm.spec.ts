import '@testing-library/jest-dom/extend-expect';

import { TransactionBuilder, TransferOperationBuilder } from '../../services/ledger/types';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import * as Evm from './evm';
import * as Transaction from '../transaction/transaction';
import * as Fee from '../../services/fee';
import * as KeypairApi from '../keypair/keypair';

interface TransferOpBuilderLight {
  add_input_with_tracing?: () => TransferOpBuilderLight;
  add_input_no_tracing?: () => TransferOpBuilderLight;
  add_output_with_tracing?: () => TransferOpBuilderLight;
  add_output_no_tracing?: () => TransferOpBuilderLight;
  add_operation_convert_account?: () => TransactionBuilder;
  new?: () => TransferOpBuilderLight;
  add_transfer_operation?: () => TransactionBuilder;
  create?: () => TransferOpBuilderLight;
  sign?: () => TransferOpBuilderLight;
  transaction?: () => string;
}

describe('evm', () => {
  describe('sendAccountToEvm', () => {
    it('sendAccountToEvm funds', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_operation_convert_account: jest.fn(() => {
          return (fakeTransactionBuilder as unknown) as TransactionBuilder;
        }),
      };

      const spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
        return Promise.resolve((fakeTransactionBuilder as unknown) as TransactionBuilder);
      });

      const spyAddOperationConvertAccount = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_convert_account')
        .mockImplementation(() => {
          return (fakeTransactionBuilder as unknown) as TransactionBuilder;
        });
      const ledger = await getLedger();
      const address = ledger.base64_to_bech32(ledger.get_coinbase_address());
      const assetCode = ledger.fra_get_asset_code();

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const ethAddress = 'myValidaotrAddress';
      const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

      const result = await Evm.sendAccountToEvm(walletInfo, amount, ethAddress);

      expect(spyTransactionSendToaddress).toHaveBeenCalledWith(
        walletInfo,
        address,
        amount,
        assetCode,
        assetBlindRules,
      );
      expect(spyAddOperationConvertAccount).toHaveBeenCalledWith(walletInfo.keypair, ethAddress);
      expect(result).toBe(fakeTransactionBuilder);

      spyTransactionSendToaddress.mockRestore();
      spyAddOperationConvertAccount.mockRestore();
    });
  });

  // describe('sendEvmToAccount', () => {
  //   it('claims the rewards from the validator', async () => {});
  // });
});
