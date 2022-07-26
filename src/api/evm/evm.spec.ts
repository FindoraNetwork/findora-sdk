import '@testing-library/jest-dom/extend-expect';
import BigNumber from 'bignumber.js';

import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import * as KeypairApi from '../keypair/keypair';
import * as Transaction from '../transaction/transaction';
import * as Evm from './evm';

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

describe('evm (unit test)', () => {
  describe('sendAccountToEvm', () => {
    it('sendAccountToEvm funds', async () => {
      const fakeTransactionBuilder: TransferOpBuilderLight = {
        add_operation_convert_account: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        }),
        sign: jest.fn(() => {
          return fakeTransactionBuilder as unknown as TransferOpBuilderLight;
        }),
      };

      const spyTransactionSendToaddress = jest.spyOn(Transaction, 'sendToAddress').mockImplementation(() => {
        return Promise.resolve(fakeTransactionBuilder as unknown as TransactionBuilder);
      });

      const spyAddOperationConvertAccount = jest
        .spyOn(fakeTransactionBuilder, 'add_operation_convert_account')
        .mockImplementation(() => {
          return fakeTransactionBuilder as unknown as TransactionBuilder;
        });
      const ledger = await getLedger();
      const address = ledger.base64_to_bech32(ledger.get_coinbase_address());
      const assetCode = ledger.fra_get_asset_code();

      const walletInfo = { publickey: 'senderPub' } as KeypairApi.WalletKeypar;
      const amount = '2';
      const ethAddress = 'myValidaotrAddress'; // findoraNetwork.columbus.relayer;
      const assetBlindRules = { isTypeBlind: false, isAmountBlind: false };

      let funcName = 'withdrawFRA';
      let convertAmount = new BigNumber(amount).times(10 ** 18).toString();
      // if (assetCode !== 'FRA') {
      //   funcName = 'withdrawERC20';
      //   convertAmount = await YsSdk.web3.calculationDecimalsAmount(
      //     YsSdk.web3.getErc20Contract(tokenAddress),
      //     tokenAmount,
      //     'toWei',
      //   );
      // }

      // ethAddress = findoraNetwork.columbus.relayer;

      const lowLeveldata = '';

      const result = await Evm.sendAccountToEvm(walletInfo, amount, ethAddress, assetCode, lowLeveldata);

      expect(spyTransactionSendToaddress).toHaveBeenCalledWith(
        walletInfo,
        address,
        amount,
        assetCode,
        assetBlindRules,
      );
      expect(spyAddOperationConvertAccount).toHaveBeenCalledWith(
        walletInfo.keypair,
        ethAddress,
        BigInt(amount) * BigInt(10 ** 6),
      );
      expect(result).toBe(fakeTransactionBuilder);

      spyTransactionSendToaddress.mockRestore();
      spyAddOperationConvertAccount.mockRestore();
    });
  });

  describe('sendEvmToAccount', () => {
    it.skip('sendEvmToAccount funds', async () => {
      const fraAddress = 'fra1d2yetp5ljdwn0zfhusvshgt4d3nyk4j3e0w2stqzlsnv8ra4whmsfzqfga';
      const amount = '1';
      const ethPrivate = 'fa6a6e57595d7e9c227e769deaf7822fcb6176cac573d73979b2c9ce808e6275';
      const ethAddress = '0xa2892da49b74f069400694e4930aa9d6db0e67b3';
      const result = await Evm.sendEvmToAccount(fraAddress, amount, ethPrivate, ethAddress);
    });
  });
});
