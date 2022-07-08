import { ethers } from 'ethers';
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

const toHex = (covertThis: string, padding: number) => {
  const temp1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigInt(covertThis).toString()), padding);
  return temp1;
};

const createGenericDepositData = (hexMetaData: string | null) => {
  if (hexMetaData === null) {
    return '0x' + toHex('0', 32).substring(2); // len(metaData) (32 bytes)
  }
  const hexMetaDataLength = hexMetaData.substring(2).length / 2;
  return '0x' + toHex(String(hexMetaDataLength), 32).substring(2) + hexMetaData.substr(2);
};

export const createLowLevelData = async (
  destinationChainId: string,
  tokenAmount: string,
  tokenId: string,
  recipientAddress: string,
  funcName: string,
) => {
  const web3 = new Web3();
  const data = web3.eth.abi.encodeParameters(
    ['uint256', 'address', 'uint256'],
    [tokenId, recipientAddress, tokenAmount],
  );

  const fun = web3.eth.abi.encodeFunctionCall(
    {
      inputs: [
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'withdrawToOtherChainCallback',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    [data],
  );
  const dt = '0x' + fun.substring(10);
  const callData = createGenericDepositData(dt);
  const fun1 = web3.eth.abi.encodeFunctionCall(
    {
      inputs: [
        {
          name: 'chainId',
          type: 'uint8',
        },
        {
          name: 'data',
          type: 'bytes',
        },
      ],
      name: funcName,
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    [destinationChainId, callData],
  );
  return fun1;
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
