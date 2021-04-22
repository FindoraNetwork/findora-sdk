import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { getLedger } from './ledger/ledgerWrapper';
import { TransferOperationBuilder } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputsInfo } from './utxoHelper';

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

export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  fraCode: string,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const minimalFee = ledger.fra_get_minimal_fee();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const sendUtxoList = getSendUtxo(fraCode, minimalFee, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const trasferOperation = await getTransferOperationWithFee(walletInfo, utxoInputsInfo);

  return trasferOperation;
};
