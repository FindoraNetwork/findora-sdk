import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { Config } from './types/Config';
import { Erc20 } from './types/Erc20';
import { FNSRegistry } from './types/FNSRegistry';
import { NameResolver } from './types/NameResolver';
import { NFT1155 } from './types/NFT1155';
import { NFT721 } from './types/NFT721';
import { PrismProxy } from './types/PrismProxy';
import { PrismXXAsset } from './types/PrismXXAsset';
import { Reward } from './types/Reward';
import { SimBridge } from './types/SimBridge';
import { Staking } from './types/Staking';
import { System } from './types/System';
export interface IWebLinkedInfo {
    privateStr: string;
    rpcUrl: string;
    chainId: number;
    account: string;
}
/**
 * Returns a Web3
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * ```
 *
 * @param rpcUrl - RPC_NETWORK_URL
 * @returns Web3
 *
 */
declare const getWeb3: (rpcUrl: string) => Web3;
interface MyContract<T> extends Contract {
    methods: T;
}
/**
 * Returns a ERC20 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getErc20Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getErc20Contract: (web3: Web3, address: string) => MyContract<Erc20>;
/**
 * Returns a PrismProxy Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = PrismProxyContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getPrismProxyContract: (web3: Web3, address: string) => MyContract<PrismProxy>;
/**
 * Returns a NFT721 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNFT721Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getNFT721Contract: (web3: Web3, address: string) => MyContract<NFT721>;
/**
 * Returns a NFT1155 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNFT1155Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getNFT1155Contract: (web3: Web3, address: string) => MyContract<NFT1155>;
/**
 * Returns a PrismXXAsset Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getPrismXXAssetContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getPrismXXAssetContract: (web3: Web3, address: string) => MyContract<PrismXXAsset>;
/**
 * Returns a SimBridge Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getSimBridgeContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getSimBridgeContract: (web3: Web3, address: string) => MyContract<SimBridge>;
/**
 * Returns a NameResolver Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNameResolverContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getNameResolverContract: (web3: Web3, address: string) => MyContract<NameResolver>;
/**
 * Returns a FNSRegistry Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getFNSRegistryContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
declare const getFNSRegistryContract: (web3: Web3, address: string) => MyContract<FNSRegistry>;
declare const getSystemContract: (web3: Web3, address: string) => MyContract<System>;
declare const getStakingContract: (web3: Web3, address: string) => MyContract<Staking>;
declare const getRewardContract: (web3: Web3, address: string) => MyContract<Reward>;
declare const getConfigContract: (web3: Web3, address: string) => MyContract<Config>;
declare const toHex: (covertThis: string, padding: number) => string;
declare const calculationDecimalsAmount: (contract: MyContract<Erc20>, web3: Web3, from: string, to: string, amount: string, type: 'toWei' | 'formWei') => Promise<string>;
declare const getCurrentBalance: (web3: Web3, account: string) => Promise<string>;
export { getWeb3, getErc20Contract, getPrismProxyContract, getFNSRegistryContract, getNFT721Contract, getNFT1155Contract, getPrismXXAssetContract, getSimBridgeContract, getNameResolverContract, calculationDecimalsAmount, toHex, getCurrentBalance, getSystemContract, getStakingContract, getRewardContract, getConfigContract, };
