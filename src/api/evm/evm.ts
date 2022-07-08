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
  getDefaultAccount,
  getErc20Contract,
  getSimBridgeContract,
  getWeb3,
  IWebLinkedInfo,
} from './web3';

// import { ethers } from 'ethers';

// const toHex = (covertThis: string, padding: number) => {
//   const temp1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigInt(covertThis).toString()), padding);
//   return temp1;
// };

export const fraAddressToHashAddress = (address: string) => {
  const result = bech32ToBuffer.decode(address).data;
  return '0x' + Buffer.from(result).toString('hex');
};

export const fraToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  amount: string,
  webLinkedInfo: IWebLinkedInfo,
): Promise<TransactionReceipt> => {
  const web3 = getWeb3(webLinkedInfo);
  const contract = getSimBridgeContract(web3, bridgeAddress);
  const account = await getDefaultAccount(web3);
  const convertAmount = BigInt(new BigNumber(amount).times(10 ** 18).toString());

  const sendObj = {
    from: account,
    value: convertAmount.toString(),
  };

  const findoraTo = fraAddressToHashAddress(recipientAddress);
  return contract.methods.depositFRA(findoraTo).send(sendObj);
};

export const frc20ToBar = async (
  bridgeAddress: string,
  recipientAddress: string,
  tokenAddress: string,
  tokenAmount: string,
  webLinkedInfo: IWebLinkedInfo,
): Promise<TransactionReceipt | any> => {
  const web3 = getWeb3(webLinkedInfo);
  const contract = getSimBridgeContract(web3, bridgeAddress);
  const erc20Contract = getErc20Contract(web3, tokenAddress);
  const account = await getDefaultAccount(web3);

  const bridgeAmount = await calculationDecimalsAmount(erc20Contract, tokenAmount, 'toWei');

  const sendObj = {
    from: account,
  };

  const findoraTo = fraAddressToHashAddress(recipientAddress);

  return contract.methods.depositFRC20(tokenAddress, findoraTo, bridgeAmount).send(sendObj);
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
