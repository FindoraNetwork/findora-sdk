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
export declare const delegate: (walletInfo: WalletKeypar, address: string, amount: string, assetCode: string, validator: string, assetBlindRules?: AssetApi.AssetBlindRules) => Promise<TransactionBuilder>;
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
/**
 * @returns
 * @todo add unit test
 */
export declare const getValidatorList: () => Promise<{
    validators: {
        commission_rate_view: string;
        addr: string;
        power: string;
        commission_rate: number[];
        accept_delegation: boolean;
        rank: number;
        extra: {
            name: string;
            desc: string;
            website: string;
            logo: string;
        };
    }[];
}>;
/**
 * @returns
 * @todo add unit test
 */
export declare const getDelegateInfo: (address: string) => Promise<import("../network/types").DelegateInfoResponse | {
    bond_entries: {
        addr: string;
        amount: string;
        extra: {
            name: string;
            desc: string;
            website: string;
            logo: string;
        } | null;
    }[];
    bond: string;
    unbond: string;
    rewards: string;
    return_rate: number[];
    global_delegation: string;
    global_staking: string;
    start_height: number;
    end_height: number;
    current_height: number;
    delegation_rwd_cnt: string;
    proposer_rwd_cnt: string;
}>;
