import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import { getLedger } from './ledger/ledgerWrapper';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputParameter, UtxoInputsInfo } from './utxoHelper';

export interface ReciverInfo {
  utxoNumbers: BigInt;
  toPublickey: XfrPublicKey;
}

export const getTransferOperation = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
  recieversInfo: ReciverInfo[],
  assetCode: string,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const blindIsAmount = assetBlindRules?.isAmountBlind;
  const blindIsType = assetBlindRules?.isTypeBlind;

  let transferOp = ledger.TransferOperationBuilder.new();

  const { inputParametersList } = utxoInputs;

  const inputPromise = inputParametersList.map(async (inputParameters: UtxoInputParameter) => {
    const { txoRef, assetRecord, amount, sid } = inputParameters;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }

    const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : undefined;

    transferOp = transferOp.add_input_no_tracing(
      txoRef,
      assetRecord,
      ownerMemo?.clone(),
      walletInfo.keypair,
      amount,
    );
  });

  const _p = await Promise.all(inputPromise);

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
    // minimalFee,
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

  const transferOperationBuilder = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    assetCode,
    assetBlindRules,
  );

  return transferOperationBuilder;
};
