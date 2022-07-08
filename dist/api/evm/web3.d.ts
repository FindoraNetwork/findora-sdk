import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { Erc20 } from './types/Erc20';
import { SimBridge } from './types/SimBridge';
export interface IWebLinkedInfo {
    privateStr: string;
    rpcUrl: string;
    chainId: number;
}
declare const getWeb3: (data: IWebLinkedInfo) => Web3;
interface MyContract<T> extends Contract {
    methods: T;
}
declare const getErc20Contract: (web3: Web3, address: string) => MyContract<Erc20>;
declare const getSimBridgeContract: (web3: Web3, address: string) => MyContract<SimBridge>;
declare const getDefaultAccount: (web3: Web3) => Promise<string>;
declare const toHex: (covertThis: string, padding: number) => string;
declare const calculationDecimalsAmount: (contract: MyContract<Erc20>, amount: string, type: 'toWei' | 'formWei') => Promise<string>;
declare const getCurrentBalance: (web3: Web3) => Promise<string>;
export { getWeb3, getErc20Contract, calculationDecimalsAmount, toHex, getDefaultAccount, getSimBridgeContract, getCurrentBalance, };
