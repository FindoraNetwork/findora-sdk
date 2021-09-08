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
export declare const unStake: (walletInfo: WalletKeypar, amount: string, validator: string, isFullUnstake?: boolean) => Promise<TransactionBuilder>;
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
export declare const delegate: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, validator: string, assetBlindRules?: AssetApi.AssetBlindRules | undefined) => Promise<TransactionBuilder>;
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
export declare const claim: (walletInfo: WalletKeypar, amount: string) => Promise<TransactionBuilder>;
