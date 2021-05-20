import { BigNumberValue, create as createBigNumber, fromWei, toWei } from '../../services/bigNumber';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { addUtxo, AddUtxoItem } from '../../services/utxoHelper';
import * as UtxoHelper from '../../services/utxoHelper';
import { createKeypair, WalletKeypar } from '../keypair';
import * as Network from '../network';
import * as AssetApi from '../sdkAsset';

const decimals = 6;

export const sendTxToAddress = async (
  walletInfo: WalletKeypar,
  toWalletInfo: WalletKeypar,
  numbers: number,
  isBlindAmount = false,
  isBlindType = false,
): Promise<string> => {
  const ledger = await getLedger();

  const fraAssetCode = await AssetApi.getFraAssetCode();

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);

  const utxoNumbers = BigInt(Number(toWei(numbers, decimals).toString()) + Number(minimalFee));

  let transferOp = ledger.TransferOperationBuilder.new(); // +

  transferOp = transferOp.add_output_no_tracing(
    minimalFee,
    ledger.fra_get_dest_pubkey(),
    fraAssetCode,
    isBlindAmount,
    isBlindType,
  );

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  console.log('sids', sids);

  if (!sids) {
    return;
  }

  const utxoDataList = await UtxoHelper.addUtxo(walletInfo, sids);

  console.log('utxoDataList', utxoDataList);

  const sendUtxoList = UtxoHelper.getSendUtxo(fraAssetCode, utxoNumbers, utxoDataList);

  console.log('sendUtxoList!', sendUtxoList);

  const utxoInputsInfo = await UtxoHelper.addUtxoInputs(sendUtxoList);

  console.log('utxoInputsInfo!', utxoInputsInfo);

  const { inputParametersList, inputAmount } = utxoInputsInfo;

  inputParametersList.forEach(inputParameters => {
    const { txoRef, assetRecord, ownerMemo, amount } = inputParameters;
    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
  });

  // end s

  transferOp = transferOp.add_output_no_tracing(
    BigInt(toWei(numbers, decimals).toString()),
    toPublickey,
    fraAssetCode,
    isBlindAmount,
    isBlindType,
  );

  console.log('a', 3);

  console.log('inputAmount > utxoNumbers', inputAmount, utxoNumbers);

  if (inputAmount > utxoNumbers) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

    transferOp = transferOp.add_output_no_tracing(
      numberToSubmit,
      ledger.get_pk_from_keypair(walletInfo.keypair),
      fraAssetCode,
      isBlindAmount,
      isBlindType,
    );
  }

  transferOp = transferOp.create().sign(walletInfo.keypair);

  const { response: stateCommitment, error } = await Network.getStateCommitment();

  if (error) {
    throw new Error(error.message);
  }

  if (!stateCommitment) {
    throw new Error('could not receive response from state commitement call');
  }

  const [_, height] = stateCommitment;
  const blockCount = BigInt(height);

  const transferOperation = ledger.TransactionBuilder.new(BigInt(blockCount)).add_transfer_operation(
    transferOp.transaction(),
  );

  const submitData = transferOperation.transaction();

  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    throw new Error(`Error Could not define asset: "${err.message}"`);
  }

  const { response: handle, error: submitError } = result;

  if (submitError) {
    throw new Error(`Could not submit issue asset transaction: "${submitError.message}"`);
  }

  if (!handle) {
    throw new Error(`Could not issue asset - submit handle is missing`);
  }

  return handle;
};
