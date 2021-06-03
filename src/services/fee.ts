import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { getLedger } from './ledger/ledgerWrapper';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputsInfo } from './utxoHelper';

export interface ReciverInfo {
  utxoNumbers: BigInt;
  toPublickey: XfrPublicKey;
}
/**
 * @todo - rename the whole file from Fee to smth like TransferHelper, which better represents its purpose
 */
export const getTransferOperation = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
  recieversInfo: ReciverInfo[],
  totalUtxoNumbers: BigInt,
  assetCode: string,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const blindIsAmount = assetBlindRules?.isAmountBlind;
  const blindIsType = assetBlindRules?.isTypeBlind;

  let transferOp = ledger.TransferOperationBuilder.new();

  const { inputParametersList, inputAmount } = utxoInputs;

  inputParametersList.forEach(inputParameters => {
    const { txoRef, assetRecord, amount, memoData } = inputParameters;

    const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

    const newOwnerMemo = ownerMemo?.clone();

    transferOp = transferOp.add_input_no_tracing(
      txoRef,
      assetRecord,
      newOwnerMemo,
      walletInfo.keypair,
      amount,
    );
  });

  recieversInfo.forEach(reciverInfo => {
    const { utxoNumbers, toPublickey } = reciverInfo;

    transferOp = transferOp.add_output_no_tracing(
      utxoNumbers,
      toPublickey,
      assetCode,
      !!blindIsAmount,
      !!blindIsType,
    );
  });

  if (inputAmount > totalUtxoNumbers) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(totalUtxoNumbers));

    transferOp = transferOp.add_output_no_tracing(
      numberToSubmit,
      ledger.get_pk_from_keypair(walletInfo.keypair),
      assetCode,
      !!blindIsAmount,
      !!blindIsType,
    );
  }

  return transferOp;
};

export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const minimalFee = ledger.fra_get_minimal_fee();

  const fraAssetCode = ledger.fra_get_asset_code();

  const sendUtxoList = getSendUtxo(fraAssetCode, minimalFee, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const toPublickey = ledger.fra_get_dest_pubkey();

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
    },
  ];

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    minimalFee,
    fraAssetCode,
    assetBlindRules,
  );

  return trasferOperation;
};

export const buildTransferOperation = async (
  walletInfo: WalletKeypar,
  recieversInfo: ReciverInfo[],
  assetCode: string,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const totalUtxoNumbers = recieversInfo.reduce((acc, receiver) => {
    return BigInt(Number(receiver.utxoNumbers) + Number(acc));
  }, BigInt(0));

  const utxoDataList = await addUtxo(walletInfo, sids);

  const sendUtxoList = getSendUtxo(assetCode, totalUtxoNumbers, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    totalUtxoNumbers,
    assetCode,
    assetBlindRules,
  );

  return trasferOperation;
};
