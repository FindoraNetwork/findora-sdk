import BigNumber from 'bignumber.js';
import { AbiItem } from 'ethereum-abi-types-generator';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import Erc20Abi from './abis/Erc20.json';
import FNSRegistryAbi from './abis/FNSRegistry.json';
import NFT1155Abi from './abis/NFT1155.json';
import NFT721Abi from './abis/NFT721.json';
import NameResolverAbi from './abis/NameResolver.json';
import PrismProxyAbi from './abis/PrismProxy.json';
import PrismXXAssetAbi from './abis/PrismXXAsset.json';
import SimBridgeAbi from './abis/SimBridge.json';
import { Erc20 } from './types/Erc20';
import { FNSRegistry } from './types/FNSRegistry';
import { NFT1155 } from './types/NFT1155';
import { NFT721 } from './types/NFT721';
import { NameResolver } from './types/NameResolver';
import { PrismProxy } from './types/PrismProxy';
import { PrismXXAsset } from './types/PrismXXAsset';
import { SimBridge } from './types/SimBridge';

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
const getWeb3 = (rpcUrl: string): Web3 => {
  const provider = new Web3.providers.HttpProvider(rpcUrl);
  const web3: Web3 = new Web3(provider);
  return web3;
};

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
const getErc20Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(Erc20Abi as AbiItem[], address) as unknown as MyContract<Erc20>;
};

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
const getPrismProxyContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(PrismProxyAbi as AbiItem[], address) as unknown as MyContract<PrismProxy>;
};

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
const getNFT721Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NFT721Abi as AbiItem[], address) as unknown as MyContract<NFT721>;
};

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
const getNFT1155Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NFT1155Abi as AbiItem[], address) as unknown as MyContract<NFT1155>;
};

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
const getPrismXXAssetContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(PrismXXAssetAbi as AbiItem[], address) as unknown as MyContract<PrismXXAsset>;
};

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
const getSimBridgeContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(SimBridgeAbi as AbiItem[], address) as unknown as MyContract<SimBridge>;
};

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
const getNameResolverContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NameResolverAbi as AbiItem[], address) as unknown as MyContract<NameResolver>;
};

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
const getFNSRegistryContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(FNSRegistryAbi as AbiItem[], address) as unknown as MyContract<FNSRegistry>;
};

const toHex = (value: string, padding: number) => {
  const temp1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(new BigNumber(value).toNumber()), padding);
  return temp1;
};

/**
 * calculation decimals amount
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getErc20Contract(web3, contract_address);
 * const amount = calculationDecimalsAmount(contract, web3, 'from address', 'to address', '0.2', 'toWei');
 * const amount = calculationDecimalsAmount(contract, web3, 'from address', 'to address', '21000', 'formWei');
 *
 * ```
 * @param contract - getErc20Contract()
 * @param web3 - Web3
 * @param from - wallet address
 * @param to - wallet address
 * @param amount - calculation amount
 * @param type - value: toWei | formWei
 *
 * @returns Contract
 *
 */
const calculationDecimalsAmount = async (
  contract: MyContract<Erc20>,
  web3: Web3,
  from: string,
  to: string,
  amount: string,
  type: 'toWei' | 'formWei',
): Promise<string> => {
  const contractData = await contract.methods.decimals().encodeABI();

  const txParams = {
    from,
    to,
    data: contractData,
  };

  const callResultHex = await web3.eth.call(txParams);
  const erc20Decimals = web3.utils.hexToNumberString(callResultHex);

  const ten = new BigNumber(10);
  const power = ten.exponentiatedBy(erc20Decimals);

  if (type === 'toWei') {
    return new BigNumber(amount).times(power).toString(10);
  }
  return new BigNumber(amount).div(power).toFormat(4);
};

const getCurrentBalance = async (web3: Web3, account: string): Promise<string> => {
  return await web3.eth.getBalance(account);
};

export {
  getWeb3,
  getErc20Contract,
  getPrismProxyContract,
  getFNSRegistryContract,
  getNFT721Contract,
  getNFT1155Contract,
  getPrismXXAssetContract,
  getSimBridgeContract,
  getNameResolverContract,
  calculationDecimalsAmount,
  toHex,
  getCurrentBalance,
};
