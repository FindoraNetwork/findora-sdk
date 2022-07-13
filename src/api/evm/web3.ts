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

const getSimBridgeContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(SimBridgeAbi as AbiItem[], address) as unknown as MyContract<SimBridge>;
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
  let erc20Decimals = web3.utils.hexToNumberString(callResultHex);

  const ten = new BigNumber(10);
  const power = ten.exponentiatedBy(erc20Decimals);

  if (type === 'toWei') {
    return new BigNumber(amount).times(power).toString();
  }
  return new BigNumber(amount).div(power).toFormat(Number(erc20Decimals));
};

const getCurrentBalance = async (web3: Web3, account: string): Promise<string> => {
  return await web3.eth.getBalance(account);
};

export {
  getWeb3,
  getErc20Contract,
  calculationDecimalsAmount,
  toHex,
  getSimBridgeContract,
  getCurrentBalance,
};
