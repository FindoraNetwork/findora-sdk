import orderBy from 'lodash/orderBy';

import * as Transaction from '../../api/transaction';
import { create as createBigNumber, toWei } from '../../services/bigNumber';
import * as Fee from '../../services/fee';
import { TransactionBuilder } from '../../services/ledger/types';
import { getAddressPublicAndKey, WalletKeypar } from '../keypair';
import * as Network from '../network';
import * as AssetApi from '../sdkAsset';
import * as Builder from '../transaction/builder';

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
    transactionBuilder = await Builder.getTransactionBuilder();
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

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
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
 *
 *   const delegationTargetPublicKey = Ledger.get_delegation_target_address();
 *   const delegationTargetAddress = await Keypair.getAddressByPublicKey(delegationTargetPublicKey);
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

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const delegateAmount = BigInt(toWei(amount, decimals).toString());

  transactionBuilder = transactionBuilder.add_operation_delegate(
    walletInfo.keypair,
    delegateAmount,
    validator,
  );

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

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
    transactionBuilder = await Builder.getTransactionBuilder();
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

  try {
    transactionBuilder = transactionBuilder.build();
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  } catch (err) {
    console.log('sendToMany error in build and sign ', err);
    throw new Error(`could not build and sign txn "${(err as Error).message}"`);
  }

  return transactionBuilder;
};

/**
 * @todo Add unit test
 * @param commissionRate
 * @returns
 */
const calculateComissionRate = (validatorAddress: string, commissionRate: number[]) => {
  if (!Array.isArray(commissionRate)) {
    return '0';
  }

  if (commissionRate.length !== 2) {
    return '0';
  }

  const [rate, divideBy] = commissionRate;

  try {
    const commissionRateView = createBigNumber(rate).div(divideBy).times(100).toString();

    return commissionRateView;
  } catch (error) {
    console.log(
      `Could not calculate comission rate for validator "${validatorAddress}". Error: "${
        (error as Error).message
      }"`,
    );
    return '0';
  }
};

/**
 * @returns
 * @todo add unit test
 */
export const getValidatorList = async () => {
  const { response: validatorListResponse, error } = await Network.getValidatorList();

  if (error) {
    throw new Error(error.message);
  }

  if (!validatorListResponse) {
    throw new Error('Could not receive response from get validators call');
  }

  const { validators } = validatorListResponse;

  try {
    if (!validators.length) {
      throw new Error('Validators list is empty!');
    }

    const validatorsFormatted = validators.map((item, _index) => {
      const commission_rate_view = calculateComissionRate(item.addr, item.commission_rate);
      return { ...item, commission_rate_view };
    });

    const validatorsOrdered = orderBy(
      validatorsFormatted,
      _order => {
        return Number(_order.commission_rate_view);
      },
      ['desc'],
    );

    return { validators: validatorsOrdered };
  } catch (err) {
    throw new Error(`Could not get validators list', "${(err as Error).message}"`);
  }
};

/**
 * @returns
 * @todo add unit test
 */
export const getDelegateInfo = async (address: string) => {
  try {
    const lightWalletKeypair = await getAddressPublicAndKey(address);

    const delegateInfoDataResult = await Network.getDelegateInfo(lightWalletKeypair.publickey);

    const { response: delegateInfoResponse } = delegateInfoDataResult;

    if (!delegateInfoResponse) {
      throw new Error('Delegator info response is missing!');
    }

    const validatorListInfo = await getValidatorList();

    if (!delegateInfoResponse.bond_entries?.length) {
      return delegateInfoResponse;
    }

    const bond_entries = delegateInfoResponse.bond_entries.map(item => {
      const extra =
        validatorListInfo.validators.find(_validator => _validator.addr === item[0])?.extra ?? null;

      return { addr: item[0], amount: item[1], extra };
    });

    return { ...delegateInfoResponse, bond_entries };
  } catch (err) {
    throw new Error(`Could not get delegation info', "${(err as Error).message}"`);
  }
};
