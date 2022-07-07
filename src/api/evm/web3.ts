import HDWalletProvider from '@truffle/hdwallet-provider';
import { AbiItem } from 'ethereum-abi-types-generator';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { Erc20 } from './types/Erc20';
import { SimBridge } from './types/SimBridge';

import Erc20Abi from './abis/Erc20.json';
import SimBridgeAbi from './abis/SimBridge.json';

import BigNumber from 'bignumber.js';

export interface IWebLinkedInfo {
  privateStr: string;
  rpcUrl: string;
  chainId: number;
}

const getWeb3 = (data: IWebLinkedInfo): Web3 => {
  const provider = new HDWalletProvider({
    privateKeys: [data.privateStr],
    providerOrUrl: data.rpcUrl,
    chainId: data.chainId,
  });
  const web3: Web3 = new Web3(provider);
  return web3;
};

interface MyContract<T> extends Contract {
  methods: T;
}

const getErc20Contract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(Erc20Abi as AbiItem[], address) as unknown as MyContract<Erc20>;
};

const getSimBridgeContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(SimBridgeAbi as AbiItem[], address) as unknown as MyContract<SimBridge>;
};

const getDefaultAccount = async (web3: Web3) => {
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    return accounts[0];
  }
  return '';
};

const toHex = (covertThis: string, padding: number) => {
  const temp1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(new BigNumber(covertThis).toNumber()), padding);
  return temp1;
};

const calculationDecimalsAmount = async (
  contract: MyContract<Erc20>,
  amount: string,
  type: 'toWei' | 'formWei',
): Promise<string> => {
  const erc20Decimals = await contract.methods.decimals().call();
  const ten = new BigNumber(10);
  const power = ten.exponentiatedBy(erc20Decimals);
  if (type === 'toWei') {
    return new BigNumber(amount).times(power).toString();
  }
  return new BigNumber(amount).div(power).toString();
};

const getCurrentBalance = async (web3: Web3): Promise<string> => {
  const account = await getDefaultAccount(web3);
  return await web3.eth.getBalance(account);
};

export {
  getWeb3,
  getErc20Contract,
  calculationDecimalsAmount,
  toHex,
  getDefaultAccount,
  getSimBridgeContract,
  getCurrentBalance,
};
