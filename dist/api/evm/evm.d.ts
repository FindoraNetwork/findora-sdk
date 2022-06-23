import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import { SubmitEvmTxResult } from '../network/types';
export declare const createLowLevelData: (destinationChainId: string, tokenAmount: string, tokenId: string, recipientAddress: string, funcName: string) => Promise<string>;
export declare const sendAccountToEvm: (walletInfo: WalletKeypar, amount: string, ethAddress: string, assetCode: string, lowLevelData: string) => Promise<TransactionBuilder>;
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
export declare const sendEvmToAccount: (fraAddress: string, amount: string, ethPrivate: string, ethAddress: string) => Promise<SubmitEvmTxResult>;
