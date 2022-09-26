import { TransactionReceipt } from 'ethereum-abi-types-generator';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import { SubmitEvmTxResult } from '../network/types';
import { IWebLinkedInfo } from './web3';
export declare const fraAddressToHashAddress: (address: string) => string;
export declare const hashAddressTofraAddress: (addresss: string) => Promise<string>;
export declare const fraToBar: (bridgeAddress: string, recipientAddress: string, amount: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
export declare const approveToken: (tokenAddress: string, deckAddress: string, price: string, web3WalletInfo: IWebLinkedInfo) => Promise<import("web3-eth").TransactionReceipt>;
export declare const frc20ToBar: (bridgeAddress: string, recipientAddress: string, tokenAddress: string, tokenAmount: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
export declare const approveNFT: (tokenAddress: string, deckAddress: string, tokenId: string, nftType: string, web3WalletInfo: IWebLinkedInfo) => Promise<import("web3-eth").TransactionReceipt>;
export declare const frcNftToBar: (bridgeAddress: string, recipientAddress: string, tokenAddress: string, tokenAmount: string, tokenId: string, nftType: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
export declare const tokenBalance: (web3WalletInfo: IWebLinkedInfo, tokenAddress: string, decimals: boolean, account: string) => Promise<string>;
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
