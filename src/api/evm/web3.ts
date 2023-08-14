import BigNumber from 'bignumber.js';
import { AbiItem } from 'ethereum-abi-types-generator';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import ConfigAbi from './abis/Config.json';
import Erc20Abi from './abis/Erc20.json';
import FNSRegistryAbi from './abis/FNSRegistry.json';
import NameResolverAbi from './abis/NameResolver.json';
import NFT1155Abi from './abis/NFT1155.json';
import NFT721Abi from './abis/NFT721.json';
import PrismProxyAbi from './abis/PrismProxy.json';
import PrismXXAssetAbi from './abis/PrismXXAsset.json';
import RewardAbi from './abis/Reward.json';
import SimBridgeAbi from './abis/SimBridge.json';
import StakingAbi from './abis/Staking.json';
import SystemAbi from './abis/System.json';
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

const getWeb3 = (rpcUrl: string): Web3 => {
  const provider = new Web3.providers.HttpProvider(rpcUrl);
  const web3: Web3 = new Web3(provider);
  return web3;
};

interface MyContract<T> extends Contract {
  methods: T;
}

const getErc20Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(Erc20Abi as AbiItem[], address) as unknown as MyContract<Erc20>;
};

const getPrismProxyContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(PrismProxyAbi as AbiItem[], address) as unknown as MyContract<PrismProxy>;
};

const getNFT721Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NFT721Abi as AbiItem[], address) as unknown as MyContract<NFT721>;
};

const getNFT1155Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NFT1155Abi as AbiItem[], address) as unknown as MyContract<NFT1155>;
};

const getPrismXXAssetContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(PrismXXAssetAbi as AbiItem[], address) as unknown as MyContract<PrismXXAsset>;
};

const getSimBridgeContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(SimBridgeAbi as AbiItem[], address) as unknown as MyContract<SimBridge>;
};

const getNameResolverContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(NameResolverAbi as AbiItem[], address) as unknown as MyContract<NameResolver>;
};

const getFNSRegistryContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(FNSRegistryAbi as AbiItem[], address) as unknown as MyContract<FNSRegistry>;
};

const getSystemContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(SystemAbi as AbiItem[], address) as unknown as MyContract<System>;
};

const getStakingContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(StakingAbi as AbiItem[], address) as unknown as MyContract<Staking>;
};

const getRewardContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(RewardAbi as AbiItem[], address) as unknown as MyContract<Reward>;
};

const getConfigContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(ConfigAbi as AbiItem[], address) as unknown as MyContract<Config>;
};

const toHex = (covertThis: string, padding: number) => {
  const temp1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(new BigNumber(covertThis).toNumber()), padding);
  return temp1;
};

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
  getSystemContract,
  getStakingContract,
  getRewardContract,
  getConfigContract,
};
