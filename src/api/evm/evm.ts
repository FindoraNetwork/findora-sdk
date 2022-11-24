import * as bech32ToBuffer from 'bech32-buffer';
import BigNumber from 'bignumber.js';
import { TransactionReceipt } from 'ethereum-abi-types-generator';
import ethereumjsAbi from 'ethereumjs-abi';
import base64 from 'js-base64';
import * as UrlSafeBase64 from 'url-safe-base64';
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
  getNFT1155Contract,
  getNFT721Contract,
  getPrismProxyContract,
  getPrismXXAssetContract,
  getSimBridgeContract,
  getWeb3,
  IWebLinkedInfo,
} from './web3';

export const fraAddressToHashAddress = (address: string) => {
  const { data, prefix } = bech32ToBuffer.decode(address);
  if (prefix == 'eth') {
    return '0x01' + Buffer.from(data).toString('hex');
  }
  return '0x' + Buffer.from(data).toString('hex');
};

export const hashAddressTofraAddress = async (addresss: string) => {
  const ledger = await getLedger();

  const tokenAddress = ethereumjsAbi.rawEncode(
    ['address', 'address'],
    ['0x0000000000000000000000000000000000000000000000000000000000000077', addresss],
  );

  const tokenAddressHex = Web3.utils.keccak256(`0x${tokenAddress.toString('hex')}`);

  return ledger.asset_type_from_jsvalue(Web3.utils.hexToBytes(tokenAddressHex));
};

export const hashAddressTofraAddressByNFT = async (addresss: string, tokenId: string) => {
  const ledger = await getLedger();

  const tokenAddress = ethereumjsAbi.rawEncode(
    ['address', 'address', 'uint256'],
    ['0x0000000000000000000000000000000000000000000000000000000000000002', addresss, tokenId],
  );

  const tokenAddressHex = Web3.utils.keccak256(`0x${tokenAddress.toString('hex')}`);

  return ledger.asset_type_from_jsvalue(Web3.utils.hexToBytes(tokenAddressHex));
};

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
    throw Error('fail frc20ToBar');
  }
};

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

export async function getPrismConfig() {
  const { response: displayCheckpointData, error } = await Network.getConfig();

  if (error) throw error;

  if (!displayCheckpointData?.prism_bridge_address) throw 'no prism_bridge_address';

  const web3 = getWeb3(Network.getRpcRoute());

  const prismProxyContract = await getPrismProxyContract(web3, displayCheckpointData.prism_bridge_address);
  const bridgeAddress = await prismProxyContract.methods.prismBridgeAddress().call();

  const prismContract = await getSimBridgeContract(web3, bridgeAddress);

  const [ledgerAddress, assetAddress] = await Promise.all([
    prismContract.methods.ledger_contract().call(),
    prismContract.methods.asset_contract().call(),
  ]);

  return { ledgerAddress, assetAddress, bridgeAddress };
}

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
    throw Error('fail frc20ToBar');
  }
};

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

  transactionBuilder = transactionBuilder
    .add_operation_convert_account(walletInfo.keypair, ethAddress, convertAmount, mainAssetCode, lowLevelData)
    .sign(walletInfo.keypair);

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
