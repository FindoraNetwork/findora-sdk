import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
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
declare const getWeb3: (rpcUrl: string) => Web3;
interface MyContract<T> extends Contract {
    methods: T;
}
declare const getErc20Contract: (web3: Web3, address: string) => MyContract<Erc20>;
declare const getPrismProxyContract: (web3: Web3, address: string) => MyContract<PrismProxy>;
declare const getNFT721Contract: (web3: Web3, address: string) => MyContract<NFT721>;
declare const getNFT1155Contract: (web3: Web3, address: string) => MyContract<NFT1155>;
declare const getPrismXXAssetContract: (web3: Web3, address: string) => MyContract<PrismXXAsset>;
declare const getSimBridgeContract: (web3: Web3, address: string) => MyContract<SimBridge>;
declare const getNameResolverContract: (web3: Web3, address: string) => MyContract<NameResolver>;
declare const getFNSRegistryContract: (web3: Web3, address: string) => MyContract<FNSRegistry>;
declare const toHex: (covertThis: string, padding: number) => string;
declare const calculationDecimalsAmount: (contract: MyContract<Erc20>, web3: Web3, from: string, to: string, amount: string, type: 'toWei' | 'formWei') => Promise<string>;
declare const getCurrentBalance: (web3: Web3, account: string) => Promise<string>;
export { getWeb3, getErc20Contract, getPrismProxyContract, getFNSRegistryContract, getNFT721Contract, getNFT1155Contract, getPrismXXAssetContract, getSimBridgeContract, getNameResolverContract, calculationDecimalsAmount, toHex, getCurrentBalance, };
