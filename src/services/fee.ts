import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { getLedger } from './ledger/ledgerWrapper';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputsInfo } from './utxoHelper';
import { toWei } from './bigNumber';

export const getTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.fra_get_dest_pubkey();
  const assetCode = ledger.fra_get_asset_code();

  const isBlindAmount = false;
  const isBlindType = false;

  let transferOp = ledger.TransferOperationBuilder.new();

  const { inputParametersList, inputAmount } = utxoInputs;

  inputParametersList.forEach(inputParameters => {
    const { txoRef, assetRecord, ownerMemo, amount } = inputParameters;
    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
  });

  transferOp = transferOp.add_output_no_tracing(
    minimalFee,
    toPublickey,
    assetCode,
    isBlindAmount,
    isBlindType,
  );

  if (inputAmount > minimalFee) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(minimalFee));

    transferOp = transferOp.add_output_no_tracing(
      numberToSubmit,
      ledger.get_pk_from_keypair(walletInfo.keypair),
      assetCode,
      isBlindAmount,
      isBlindType,
    );
  }

  return transferOp;
};

export const getTransferOperation = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
  numbers: number,
  utxoNumbers: BigInt,
  toPublickey: XfrPublicKey,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const minimalFee = ledger.fra_get_minimal_fee();

  // const toPublickey = ledger.fra_get_dest_pubkey();
  const assetCode = ledger.fra_get_asset_code();

  const isBlindAmount = false;
  const isBlindType = false;

  let transferOp = ledger.TransferOperationBuilder.new();

  transferOp = transferOp.add_output_no_tracing(
    minimalFee,
    ledger.fra_get_dest_pubkey(),
    assetCode,
    isBlindAmount,
    isBlindType,
  );

  const { inputParametersList, inputAmount } = utxoInputs;

  inputParametersList.forEach(inputParameters => {
    const { txoRef, assetRecord, ownerMemo, amount } = inputParameters;
    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
  });

  transferOp = transferOp.add_output_no_tracing(
    BigInt(toWei(numbers, 6).toString()),
    toPublickey,
    assetCode,
    isBlindAmount,
    isBlindType,
  );

  if (inputAmount > utxoNumbers) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

    transferOp = transferOp.add_output_no_tracing(
      numberToSubmit,
      ledger.get_pk_from_keypair(walletInfo.keypair),
      assetCode,
      isBlindAmount,
      isBlindType,
    );
  }

  return transferOp;
};

export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  fraCode: string,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const minimalFee = ledger.fra_get_minimal_fee();

  const sendUtxoList = getSendUtxo(fraCode, minimalFee, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const trasferOperation = await getTransferOperationWithFee(walletInfo, utxoInputsInfo);

  return trasferOperation;
};

export const buildTransferOperation = async (
  walletInfo: WalletKeypar,
  fraCode: string,
  numbers: number,
  toPublickey: XfrPublicKey,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const minimalFee = ledger.fra_get_minimal_fee();

  const utxoNumbers = BigInt(Number(toWei(numbers, 6).toString()) + Number(minimalFee));

  const sendUtxoList = getSendUtxo(fraCode, utxoNumbers, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    numbers,
    utxoNumbers,
    toPublickey,
  );

  return trasferOperation;
};
