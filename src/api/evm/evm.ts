import namehash from '@ensdomains/eth-ens-namehash';
import * as bech32ToBuffer from 'bech32-buffer';
import BigNumber from 'bignumber.js';
import { TransactionReceipt } from 'ethereum-abi-types-generator';
import ethereumjsAbi from 'ethereumjs-abi';
import base64 from 'js-base64';
import Web3 from 'web3';

import { Network } from '../../api';
import { toWei } from '../../services/bigNumber';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import { SubmitEvmTxResult } from '../network/types';
import * as AssetApi from '../sdkAsset';
import * as Transaction from '../transaction';
import {
  calculationDecimalsAmount,
  getErc20Contract,
  getFNSRegistryContract,
  getNameResolverContract,
  getNFT721Contract,
  getNFT1155Contract,
  getSimBridgeContract,
  getWeb3,
  IWebLinkedInfo,
} from './web3';

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
export const fraAddressToHashAddress = (address: string) => {
  const { data, prefix } = bech32ToBuffer.decode(address);
  if (prefix == 'eth') {
    return '0x01' + Buffer.from(data).toString('hex');
  }
  return '0x' + Buffer.from(data).toString('hex');
};

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
export const hashAddressTofraAddressOld = async (addresss: string) => {
  const ledger = await getLedger();

  const tokenAddress = ethereumjsAbi.rawEncode(
    ['address', 'address'],
    ['0x0000000000000000000000000000000000000000000000000000000000000077', addresss],
  );

  const tokenAddressHex = Web3.utils.keccak256(`0x${tokenAddress.toString('hex')}`);

  const assetType = ledger.asset_type_from_jsvalue(Web3.utils.hexToBytes(tokenAddressHex));

  return assetType;
};

// uses contract to compute the proper asset type for the token
export const hashAddressTofraAddress = async (
  addresss: string,
  bridgeAddress: string,
  web3WalletInfo: IWebLinkedInfo,
): Promise<string> => {
  const ledger = await getLedger();

  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const contract = getSimBridgeContract(web3, bridgeAddress);

  const tokenAddressHexA = await contract.methods.computeERC20AssetType(addresss).call();
  const tokenAddressHex = Web3.utils.keccak256(tokenAddressHexA);

  const assetType = ledger.asset_type_from_jsvalue(Web3.utils.hexToBytes(tokenAddressHexA));
  return assetType;
};

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
export const hashAddressTofraAddressByNFT = async (addresss: string, tokenId: string) => {
  const ledger = await getLedger();

  const tokenAddress = ethereumjsAbi.rawEncode(
    ['address', 'address', 'uint256'],
    ['0x0000000000000000000000000000000000000000000000000000000000000002', addresss, tokenId],
  );

  const tokenAddressHex = Web3.utils.keccak256(`0x${tokenAddress.toString('hex')}`);

  return ledger.asset_type_from_jsvalue(Web3.utils.hexToBytes(tokenAddressHex));
};

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
export const fraToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  amount: string,
  web3WalletInfo: IWebLinkedInfo,
): Promise<TransactionReceipt | any> => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const contract = getSimBridgeContract(web3, bridgeAddress);
  const convertAmount = new BigNumber(amount).times(10 ** 18).toString(10);

  const findoraTo = fraAddressToHashAddress(recipientAddress);
  const nonce = await web3.eth.getTransactionCount(web3WalletInfo.account);
  const gasPrice = await web3.eth.getGasPrice();

  const contractData = contract.methods.depositFRA(findoraTo).encodeABI();

  const estimategas = await web3.eth.estimateGas({
    to: web3WalletInfo.account,
    data: contractData,
  });

  const txParams = {
    from: web3WalletInfo.account,
    to: bridgeAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(3000000),
    gas: web3.utils.toHex(estimategas),
    value: convertAmount,
    nonce: nonce,
    data: contractData,
    chainId: web3WalletInfo.chainId,
  };

  console.log(txParams);

  const signed_txn = await web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
  if (signed_txn?.rawTransaction) {
    return await web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
  } else {
    throw Error('fail frc20ToBar');
  }
};

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
export const approveToken = async (
  tokenAddress: string,
  deckAddress: string,
  price: string,
  web3WalletInfo: IWebLinkedInfo,
) => {
  console.table([tokenAddress, deckAddress, price]);
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const erc20Contract = getErc20Contract(web3, tokenAddress);

  const amount = await calculationDecimalsAmount(
    erc20Contract,
    web3,
    web3WalletInfo.account,
    tokenAddress,
    price,
    'toWei',
  );

  const nonce = await web3.eth.getTransactionCount(web3WalletInfo.account);
  const gasPrice = await web3.eth.getGasPrice();
  const contractData = erc20Contract.methods.approve(deckAddress, amount).encodeABI();

  const estimategas = await web3.eth.estimateGas({
    to: web3WalletInfo.account,
    data: contractData,
  });

  const txParams = {
    from: web3WalletInfo.account,
    to: tokenAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(3000000),
    gas: web3.utils.toHex(estimategas),
    nonce: nonce,
    data: contractData,
    chainId: web3WalletInfo.chainId,
  };

  const signed_txn = await web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
  if (signed_txn?.rawTransaction) {
    return await web3.eth.sendSignedTransaction(signed_txn?.rawTransaction);
  } else {
    throw Error('fail approveToken');
  }
};

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
export const frc20ToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  tokenAddress: string,
  tokenAmount: string,
  web3WalletInfo: IWebLinkedInfo,
): Promise<TransactionReceipt | any> => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const contract = getSimBridgeContract(web3, bridgeAddress);
  const erc20Contract = getErc20Contract(web3, tokenAddress);

  const bridgeAmount = await calculationDecimalsAmount(
    erc20Contract,
    web3,
    web3WalletInfo.account,
    tokenAddress,
    tokenAmount,
    'toWei',
  );

  const findoraTo = fraAddressToHashAddress(recipientAddress);

  const nonce = await web3.eth.getTransactionCount(web3WalletInfo.account);
  const gasPrice = await web3.eth.getGasPrice();
  const contractData = contract.methods.depositFRC20(tokenAddress, findoraTo, bridgeAmount).encodeABI();

  const estimategas = await web3.eth.estimateGas({
    to: web3WalletInfo.account,
    data: contractData,
  });

  const txParams = {
    from: web3WalletInfo.account,
    to: bridgeAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(3000000),
    gas: web3.utils.toHex(estimategas),
    nonce: nonce,
    // value: web3.utils.toHex(convertAmount),
    data: contractData,
    chainId: web3WalletInfo.chainId,
  };

  const signed_txn = await web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
  if (signed_txn?.rawTransaction) {
    return await web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
  } else {
    throw Error('fail frc20ToBar');
  }
};

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
export async function getPrismConfig() {
  const { response: displayCheckpointData, error } = await Network.getConfig();

  if (error) throw error;

  if (!displayCheckpointData?.prism_bridge_address) throw 'no prism_bridge_address';

  const web3 = getWeb3(Network.getRpcRoute());

  const bridgeAddress = displayCheckpointData.prism_bridge_address;
  const prismContract = await getSimBridgeContract(web3, bridgeAddress);

  const [ledgerAddress, assetAddress] = await Promise.all([
    prismContract.methods.ledger_contract().call(),
    prismContract.methods.asset_contract().call(),
  ]);

  return { ledgerAddress, assetAddress, bridgeAddress };
}

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
export const approveNFT = async (
  tokenAddress: string,
  deckAddress: string,
  tokenId: string,
  nftType: string,
  web3WalletInfo: IWebLinkedInfo,
) => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);

  let contractData = '';

  if (nftType == '721') {
    const nft721Contract = getNFT721Contract(web3, tokenAddress);
    contractData = nft721Contract.methods.approve(deckAddress, tokenId).encodeABI();
  }
  if (nftType == '1155') {
    const nft1155Contract = getNFT1155Contract(web3, tokenAddress);
    contractData = nft1155Contract.methods.setApprovalForAll(deckAddress, true).encodeABI();
  }

  const nonce = await web3.eth.getTransactionCount(web3WalletInfo.account);
  const gasPrice = await web3.eth.getGasPrice();

  const estimategas = await web3.eth.estimateGas({
    to: web3WalletInfo.account,
    data: contractData,
  });

  const txParams = {
    from: web3WalletInfo.account,
    to: tokenAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(3000000),
    gas: web3.utils.toHex(estimategas),
    nonce: nonce,
    data: contractData,
    chainId: web3WalletInfo.chainId,
  };

  const signed_txn = await web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
  if (signed_txn?.rawTransaction) {
    return await web3.eth.sendSignedTransaction(signed_txn?.rawTransaction);
  } else {
    throw Error('fail approveNFT');
  }
};

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
export const getDomainCurrentText = async (
  name: string,
): Promise<{
  eth: string;
  fra: string;
} | null> => {
  const { response: displayCheckpointData, error } = await Network.getConfig();

  if (error) throw error;

  if (!displayCheckpointData?.fns_registry) throw 'no fns_registry contract address';

  const web3 = getWeb3(Network.getRpcRoute());

  const fnsRegistryContract = getFNSRegistryContract(web3, displayCheckpointData.fns_registry);

  const result = await fnsRegistryContract.methods.currentText(namehash.hash(name)).call();

  if (result.includes('eth') || result.includes('fra')) {
    return JSON.parse(result);
  }

  return null;
};

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
export const frcNftToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  tokenAddress: string,
  tokenAmount: string,
  tokenId: string,
  nftType: string,
  web3WalletInfo: IWebLinkedInfo,
): Promise<TransactionReceipt | any> => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const contract = getSimBridgeContract(web3, bridgeAddress);

  const findoraTo = fraAddressToHashAddress(recipientAddress);
  let contractData = '';

  if (nftType == '721') {
    contractData = contract.methods.depositFRC721(tokenAddress, findoraTo, tokenId).encodeABI();
  }
  if (nftType == '1155') {
    contractData = contract.methods.depositFRC1155(tokenAddress, findoraTo, tokenId, tokenAmount).encodeABI();
  }

  const nonce = await web3.eth.getTransactionCount(web3WalletInfo.account);
  const gasPrice = await web3.eth.getGasPrice();

  const estimategas = await web3.eth.estimateGas({
    to: web3WalletInfo.account,
    data: contractData,
  });

  const txParams = {
    from: web3WalletInfo.account,
    to: bridgeAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(3000000),
    gas: web3.utils.toHex(estimategas),
    nonce: nonce,
    // value: web3.utils.toHex(convertAmount),
    data: contractData,
    chainId: web3WalletInfo.chainId,
  };

  const signed_txn = await web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
  if (signed_txn?.rawTransaction) {
    return await web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
  } else {
    throw Error('fail frc20ToBar');
  }
};

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
export const tokenBalance = async (
  web3WalletInfo: IWebLinkedInfo,
  tokenAddress: string,
  decimals: boolean,
  account: string,
): Promise<string> => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const erc20Contract = getErc20Contract(web3, tokenAddress);
  const contractData = erc20Contract.methods.balanceOf(account).encodeABI();

  const txParams = {
    from: web3WalletInfo.account,
    to: tokenAddress,
    data: contractData,
  };

  const callResultHex = await web3.eth.call(txParams);
  let balance = web3.utils.hexToNumberString(callResultHex);

  if (decimals) {
    balance = await calculationDecimalsAmount(
      erc20Contract,
      web3,
      web3WalletInfo.account,
      tokenAddress,
      balance,
      'formWei',
    );
  }

  return balance;
};

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
export const sendAccountToEvm = async (
  walletInfo: WalletKeypar,
  amount: string,
  ethAddress: string,
  assetCode: string,
  lowLevelData: string,
): Promise<TransactionBuilder> => {
  const ledger = await getLedger();
  const address = ledger.base64_to_bech32(ledger.get_coinbase_address());

  const fraAssetCode = ledger.fra_get_asset_code();
  const mainAssetCode = assetCode || fraAssetCode;

  const assetBlindRules: AssetApi.AssetBlindRules = {
    isAmountBlind: false,
    isTypeBlind: false,
  };

  let transactionBuilder = await Transaction.sendToAddressV2(
    walletInfo,
    address,
    amount,
    mainAssetCode,
    assetBlindRules,
  );

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const convertAmount = BigInt(toWei(amount, decimals).toString(10));

  transactionBuilder = transactionBuilder.add_operation_convert_account(
    walletInfo.keypair,
    ethAddress,
    convertAmount,
    mainAssetCode,
    lowLevelData,
  );
  transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
  // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);

  return transactionBuilder;
};

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
export const sendEvmToAccount = async (
  fraAddress: string,
  amount: string,
  ethPrivate: string,
  ethAddress: string,
): Promise<SubmitEvmTxResult> => {
  const ledger = await getLedger();

  const accountPublickey = ledger.public_key_from_bech32(fraAddress);
  const asset = await AssetApi.getAssetDetails(ledger.fra_get_asset_code());
  const decimals = asset.assetRules.decimals;
  const utxoNumbers = BigInt(toWei(amount, decimals).toString(10));

  let nonce = '';

  try {
    const result = await Network.getAbciNoce(ethAddress);
    if (result.response && result.response.result.response.code === 0) {
      nonce = result.response.result.response.value;
      nonce = base64.atob(nonce);
      nonce = JSON.parse(nonce);
    } else {
      throw new Error('Get nonce error');
    }
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Get nonce error "${ethAddress}". Error - ${e.message}`);
  }

  let result = '';

  try {
    result = ledger.transfer_to_utxo_from_account(
      accountPublickey,
      BigInt(utxoNumbers),
      ethPrivate,
      BigInt(nonce),
    );
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Evm to Account wasm error". Error - ${e.message}`);
  }

  let submitResult: SubmitEvmTxResult;

  try {
    submitResult = await Network.submitEvmTx(base64.encode(result));

    if (!submitResult.response) {
      throw new Error('Could not submit of transactions. No response from the server.');
    }

    return submitResult;
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Evm to Account submit error". Error - ${e.message}`);
  }
};
