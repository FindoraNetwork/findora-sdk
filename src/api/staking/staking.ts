import * as Transaction from '../../api/transaction';
import * as Fee from '../../services/fee';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import * as AssetApi from '../sdkAsset';

/**
 * Unstake FRA tokens
 *
 * @remarks
 * This function allows users to unstake (aka unbond) FRA tokens.
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  // Define whether or not user desires to unstake all the tokens, or only part of the staked amount
 *  const isFullUnstake = false;
 *
 *  const transactionBuilder = await StakingApi.unStake(
 *    walletInfo,
 *    amount,
 *    validator,
 *    isFullUnstake,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const unStake = async (
  walletInfo: WalletKeypar,
  amount: string,
  validator: string,
  isFullUnstake = false,
): Promise<TransactionBuilder> => {
  const transferFeeOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferFeeOperation;

  try {
    receivedTransferFeeOperation = transferFeeOperationBuilder
      .create()
      .sign(walletInfo.keypair)
      .transaction();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not create transfer operation with fee, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await Transaction.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;
    throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    if (isFullUnstake) {
      transactionBuilder = transactionBuilder.add_operation_undelegate(walletInfo.keypair);
    } else {
      transactionBuilder = transactionBuilder.add_operation_undelegate_partially(
        walletInfo.keypair,
        BigInt(amount),
        validator,
      );
    }
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not add staking unStake operation, Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder.add_transfer_operation(receivedTransferFeeOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not add transfer to unStake operation, Error: "${e.message}"`);
  }

  return transactionBuilder;
};

/**
 * Delegates FRA tokens
 *
 * @remarks
 * This function allows users to delegate FRA tokens to a validator.
 *
 * This functionality is nearly identical to Transaction.sendToAddress except
 * it adds one additional operation (i.e. add_operation_delegate) to the transaction builder.
 *
 * @example
 *
 * ```ts
 *  const ledger = await getLedger();
 *
 *  // This is the address funds are sent to.
 *  // Actual `transfer to validator` process would be handled via added `add_operation_delegate` operation
 *  const delegationTargetAddress = ledger.get_delegation_target_address
 *
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  const assetCode = await Asset.getFraAssetCode();
 *
 *  const assetBlindRules: Asset.AssetBlindRules = {
 *    isTypeBlind: false,
 *    isAmountBlind: false
 *  };
 *
 *  const transactionBuilder = await StakingApi.delegate(
 *    walletInfo,
 *    delegationTargetAddress,
 *    amount,
 *    assetCode,
 *    validatorAddress,
 *    assetBlindRules,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const delegate = async (
  walletInfo: WalletKeypar,
  address: string,
  amount: string,
  assetCode: string,
  validator: string,
  assetBlindRules?: AssetApi.AssetBlindRules,
): Promise<TransactionBuilder> => {
  let transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    address,
    amount,
    assetCode,
    assetBlindRules,
  );

  transactionBuilder = transactionBuilder.add_operation_delegate(walletInfo.keypair, validator);

  return transactionBuilder;
};

/**
 * Claim FRA Token Rewards
 *
 * @remarks
 * This function enables users to claim rewards earned from staking FRA tokens.
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);

 *  const transactionBuilder = await StakingApi.claim(
 *    walletInfo,
 *    amount,
 *  );
 *
 *  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
export const claim = async (walletInfo: WalletKeypar, amount: string): Promise<TransactionBuilder> => {
  const transferFeeOperationBuilder = await Fee.buildTransferOperationWithFee(walletInfo);

  let receivedTransferFeeOperation;

  try {
    receivedTransferFeeOperation = transferFeeOperationBuilder
      .create()
      .sign(walletInfo.keypair)
      .transaction();
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not create transfer operation, Error: "${e.message}"`);
  }

  let transactionBuilder;

  try {
    transactionBuilder = await Transaction.getTransactionBuilder();
  } catch (error) {
    const e: Error = error as Error;
    throw new Error(`Could not get "stakingTransactionBuilder", Error: "${e.message}"`);
  }

  try {
    transactionBuilder = transactionBuilder
      .add_operation_claim_custom(walletInfo.keypair, BigInt(amount))
      .add_transfer_operation(receivedTransferFeeOperation);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`Could not add staking claim operation, Error: "${e.message}"`);
  }

  return transactionBuilder;
};
