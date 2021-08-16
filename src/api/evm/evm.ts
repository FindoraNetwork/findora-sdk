import * as Transaction from '../transaction';
import * as Fee from '../../services/fee';
import { TransactionBuilder } from '../../services/ledger/types';
import { getAddressPublicAndKey, WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { getFraPublicKey } from '../sdkAsset';

export const sendAccountToEvm = async (
  walletInfo: WalletKeypar,
  amount: string,
  ethAddress: string,
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();
  const address = ledger.base64_to_bech32(ledger.get_coinbase_address());
  const assetCode = ledger.fra_get_asset_code();
  const assetBlindRules: AssetApi.AssetBlindRules = {
    isAmountBlind: false,
    isTypeBlind: false,
  };
  let transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    address,
    amount,
    assetCode,
    assetBlindRules,
  );

  transactionBuilder = transactionBuilder.add_operation_convert_account(walletInfo.keypair, ethAddress);

  return transactionBuilder;
};

export const sendEvmToAccount = async (
  fraAddress: string,
  amount: string,
  nonce: string,
  ethPrivate: string,
) => {
  const ledger = await getLedger();
  const accountPublickey = ledger.public_key_from_bech32(fraAddress);
  ledger.transfer_to_utxo_from_account(accountPublickey, BigInt(amount), ethPrivate, BigInt(nonce));
};
