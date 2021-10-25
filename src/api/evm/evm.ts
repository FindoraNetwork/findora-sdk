import base64 from 'js-base64';
import * as Transaction from '../transaction';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { Network } from '../../api';
import { toWei } from '../../services/bigNumber';
import { SubmitEvmTxResult } from '../network/types';

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

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const convertAmount = BigInt(toWei(amount, decimals).toString());

  transactionBuilder = transactionBuilder
    .add_operation_convert_account(walletInfo.keypair, ethAddress, convertAmount)
    .sign(walletInfo.keypair);

  return transactionBuilder;
};

/**
 * Transfer ETH to the user FRA address
 *
 * @remarks
 * To transfer ETH tokens to the FRA address (EVM transfer) user should use this function
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *  const ethPrivate = 'faXXXX';
 *  const ethAddress = '0xXXX';
 *
 *  const result = await Evm.sendEvmToAccount(walletInfo.address, amount, ethPrivate, ethAddress);
 * ```
 *
 * @throws `Get nonce error`
 * @throws `Evm to Account wasm error`
 * @throws `Could not submit of transactions. No response from the server`
 * @throws `Evm to Account submit error`
 *
 * @returns Result of transaction submission to the network
 */
export const sendEvmToAccount = async (
  fraAddress: string,
  amount: string,
  ethPrivate: string,
  ethAddress: string,
): Promise<SubmitEvmTxResult> => {
  const ledger = await getLedger();
  const accountPublickey = ledger.public_key_from_bech32(fraAddress);
  const asset = await AssetApi.getAssetDetails(ledger.fra_get_asset_code());
  const decimals = asset.assetRules.decimals;
  const utxoNumbers = BigInt(toWei(amount, decimals).toString());

  let nonce = '';

  try {
    const result = await Network.getAbciNoce(ethAddress);
    if (result.response && result.response.result.response.code === 0) {
      nonce = result.response.result.response.value;
      nonce = base64.atob(nonce);
      nonce = JSON.parse(nonce);
    } else {
      throw new Error('Get nonce error');
    }
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Get nonce error "${ethAddress}". Error - ${e.message}`);
  }

  let result = '';

  try {
    result = ledger.transfer_to_utxo_from_account(
      accountPublickey,
      BigInt(utxoNumbers),
      ethPrivate,
      BigInt(nonce),
    );
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Evm to Account wasm error". Error - ${e.message}`);
  }

  let submitResult: SubmitEvmTxResult;

  try {
    submitResult = await Network.submitEvmTx(base64.encode(result));

    if (!submitResult.response) {
      throw new Error('Could not submit of transactions. No response from the server.');
    }

    return submitResult;
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Evm to Account submit error". Error - ${e.message}`);
  }
};
