import * as bech32ToBuffer from 'bech32-buffer';
import BigNumber from 'bignumber.js';
import { TransactionReceipt } from 'ethereum-abi-types-generator';
import base64 from 'js-base64';

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
  getSimBridgeContract,
  getWeb3,
  IWebLinkedInfo,
} from './web3';

export const fraAddressToHashAddress = (address: string) => {
  const result = bech32ToBuffer.decode(address).data;
  return '0x' + Buffer.from(result).toString('hex');
};

export const fraToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  amount: string,
  web3WalletInfo: IWebLinkedInfo,
): Promise<TransactionReceipt | any> => {
  const web3 = getWeb3(web3WalletInfo.rpcUrl);
  const contract = getSimBridgeContract(web3, bridgeAddress);
  const convertAmount = new BigNumber(amount).times(10 ** 18).toString();

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

  const amount = await calculationDecimalsAmount(erc20Contract, price, 'toWei');

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

  const bridgeAmount = await calculationDecimalsAmount(erc20Contract, tokenAmount, 'toWei');

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

  let transactionBuilder = await Transaction.sendToAddress(
    walletInfo,
    address,
    amount,
    mainAssetCode,
    assetBlindRules,
  );

  const asset = await AssetApi.getAssetDetails(assetCode);
  const decimals = asset.assetRules.decimals;
  const convertAmount = BigInt(toWei(amount, decimals).toString());

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
  const utxoNumbers = BigInt(toWei(amount, decimals).toString());

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
