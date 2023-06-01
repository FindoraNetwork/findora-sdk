import { TransactionReceipt } from 'ethereum-abi-types-generator';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import { SubmitEvmTxResult } from '../network/types';
import { IWebLinkedInfo } from './web3';
/**
 * Convert the address starting with fra into a hex address
 *
 * @example
 * ```ts
 * const contract = fraAddressToHashAddress('fraxxxxx....');
 * ```
 *
 * @param address - fra wallet address
 *
 * @returns Hex address
 *
 */
export declare const fraAddressToHashAddress: (address: string) => string;
/**
 * Token asset address conversion
 *
 * @remarks
 * Convert the evm asset address into an asset address that can be recognized by native
 *
 * @example
 * ```ts
 * const contract = hashAddressTofraAddress('0x00000....');
 * ```
 *
 * @param address - evm address
 *
 * @returns fra asset address
 *
 */
export declare const hashAddressTofraAddressOld: (addresss: string) => Promise<string>;
export declare const hashAddressTofraAddress: (addresss: string, bridgeAddress: string, web3WalletInfo: IWebLinkedInfo) => Promise<string>;
/**
 * NFT asset address conversion
 *
 * @remarks
 * Convert the NFT asset address in evm to an asset address that can be recognized by native
 *
 * @example
 * ```ts
 * const contract = hashAddressTofraAddressByNFT('0x00000....', '1');
 * ```
 *
 * @param address - evm nft contract address
 * @param tokenId - evm nft tokenId
 *
 *
 * @returns fra asset address
 *
 */
export declare const hashAddressTofraAddressByNFT: (addresss: string, tokenId: string) => Promise<string>;
/**
 * Transfer fra asset to native chain
 *
 * @remarks
 * Used to transfer fra tokens from the evm chain to the native chain
 *
 * @example
 * ```ts
 * const web3WalletInfo = {};
 * const bridgeAddress = '0x000...';
 * const recipientAddress = 'fra wallet address';
 * const amount = '10';
 *
 * const contract = fraToBar(bridgeAddress, recipientAddress, amount, web3WalletInfo);
 * ```
 *
 * @param bridgeAddress - evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param amount - the amount of transferred fra assets
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
export declare const fraToBar: (bridgeAddress: string, recipientAddress: string, amount: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
/**
 * approve token transfer permission
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const contract = await approveToken('0x00000....','0x00000....', '1' , walletInfo);
 * ```
 *
 * @param tokenAddress - payment token contract address
 * @param deckAddress - contract address for operating token transfer
 * @param price - approve amount
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 *
 * @throws `fail approveToken`
 *
 * @returns PromiEvent<TransactionReceipt>
 */
export declare const approveToken: (tokenAddress: string, deckAddress: string, price: string, web3WalletInfo: IWebLinkedInfo) => Promise<import("web3-eth").TransactionReceipt>;
/**
 * Transfer frc20 token to native chain
 *
 * @remarks
 * Transfer frc20 assets from evm chain to native chain
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const bridgeAddress = '0x000...',
 * const recipientAddress = 'fra wallet address',
 *
 * const tokenInfo = {
 *    address: '0x000...',
 *    amount: '10',
 * }
 *
 * const contract = frc20ToBar(bridgeAddress, recipientAddress, tokenInfo.address, tokenInfo.amount, walletInfo);
 * ```
 *
 * @param bridgeAddress - evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param tokenAddress - evm chain, nft contract address
 * @param tokenAmount - The amount of transferred frc20 assets
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
export declare const frc20ToBar: (bridgeAddress: string, recipientAddress: string, tokenAddress: string, tokenAmount: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
/**
 * Return prism config
 *
 * @remarks
 * Return the ledgerAddress, assetAddress, bridgeAddress contract addresses configured on the chain
 *
 * @example
 * ```ts
 * const result = await getPrismConfig();
 * ```
 *
 * @returns `{ ledgerAddress: '', assetAddress: '', bridgeAddress: '' }`
 */
export declare function getPrismConfig(): Promise<{
    ledgerAddress: string;
    assetAddress: string;
    bridgeAddress: string;
}>;
/**
 * approve token transfer permission
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const contract = await approveNFT('0x00000....','0x00000....', '1', '721' , walletInfo);
 * const contract = await approveNFT('0x00000....','0x00000....', '1', '1155' , walletInfo);
 *
 * ```
 *
 * @param tokenAddress - payment token contract address
 * @param deckAddress - contract address for operating token transfer
 * @param tokenId - approve tokenId
 * @param nftType - nft type value , 721 | 1155
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 *
 * @throws `fail approveNFT`
 *
 * @returns PromiEvent<TransactionReceipt>
 */
export declare const approveNFT: (tokenAddress: string, deckAddress: string, tokenId: string, nftType: string, web3WalletInfo: IWebLinkedInfo) => Promise<import("web3-eth").TransactionReceipt>;
/**
 * Obtain domain name resolution records
 *
 * @remarks
 * Get the eth\fra wallet address in the domain registration record
 *
 * @example
 * ```ts
 * const result = getDomainCurrentText('xxx.fra');
 * ```
 *
 * @param name - fra domain
 *
 * @throws `fail approveNFT`
 *
 * @returns `Returns {eth:'', fra:''} if parsing is successful, otherwise null`
 */
export declare const getDomainCurrentText: (name: string) => Promise<{
    eth: string;
    fra: string;
} | null>;
/**
 * Transfer NFT to native chain
 *
 * @remarks
 * Transfer nft721 and nft1155 assets from evm chain to native chain
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const bridgeAddress = '0x000...',
 * const recipientAddress = 'fra wallet address',
 *
 * const nftInfo = {
 *    address: '0x000...',
 *    tokenId: '0',
 *    amount: '1',
 *    type: '721', // When nft-type is equal to 721, amount can only fill in 1
 * }
 *
 * const nftInfo = {
 *    address: '0x000...',
 *    tokenId: '0',
 *    amount: '3',
 *    type: '1155', // When nft-type is equal to 1155, the amount can be filled in with the owned amount
 * }
 *
 * const contract = frcNftToBar(bridgeAddress, recipientAddress, nftInfo.address, nftInfo.amount, nftInfo.tokenId,  nftInfo.type, walletInfo);
 * ```
 *

 *
 * @param bridgeAddress -  evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param tokenAddress - evm chain, nft contract address
 * @param tokenAmount - transfer nft amount，nft721:1, nft1155: custom amount
 * @param tokenId - transfer nft tokenId
 * @param nftType - nft type, value: 721 | 1155
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
export declare const frcNftToBar: (bridgeAddress: string, recipientAddress: string, tokenAddress: string, tokenAmount: string, tokenId: string, nftType: string, web3WalletInfo: IWebLinkedInfo) => Promise<TransactionReceipt | any>;
/**
 * Return the number of tokens
 *
 * @remarks
 * Get the number of tokens owned by a wallet
 *
 * @example
 * ```ts
 * const walletInfo = {};
 *
 * let decimals = true; // decimals true, returns the number of ether units
 * const contract = tokenBalance(walletInfo,'0x00000....', decimals, 'wallet address');
 *
 * let decimals = false; // decimals true, returns the number of wei units
 * const contract = tokenBalance(walletInfo,'0x00000....', decimals, 'wallet address');
 *
 * ```
 *
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 * @param tokenAddress - token contract address
 * @param decimals - boolean
 * @param account - wallet address
 *
 * @returns return string balance
 */
export declare const tokenBalance: (web3WalletInfo: IWebLinkedInfo, tokenAddress: string, decimals: boolean, account: string) => Promise<string>;
/**
 * Return the number of tokens
 *
 * @remarks
 * Get the number of tokens owned by a wallet
 *
 * @example
 * ```ts
 * const walletInfo = {};
 *
 * const contract = sendAccountToEvm(walletInfo,'10', '0x00000....', 'fra native asset type', '');
 * ```
 *
 * @param walletInfo - wallet An instance of {@link WalletKeypar}
 * @param amount - transfer amount
 * @param ethAddress - The wallet address of the evm test chain to receive the transfer
 * @param assetCode - transfer asset type
 * @param lowLevelData - When the fra chain is converted from native to evm, fill in "" here, and when transferring to a non-fra-evm chain, you need to pass the calculation result
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
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
