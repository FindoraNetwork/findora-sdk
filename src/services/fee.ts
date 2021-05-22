import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
// import { AssetBlindRules } from '../api/sdkAsset';
import { toWei } from './bigNumber';
import { getLedger } from './ledger/ledgerWrapper';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputsInfo } from './utxoHelper';

// export const getTransferOperationWithFee = async (
//   walletInfo: WalletKeypar,
//   utxoInputs: UtxoInputsInfo,
//   utxoNumbers: BigInt,
//   toPublickey: XfrPublicKey,
//   assetCode: string,
//   assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
// ): Promise<TransferOperationBuilder> => {
//   const ledger = await getLedger();

//   // const minimalFee = ledger.fra_get_minimal_fee();

//   // const fraAssetCode = ledger.fra_get_asset_code();

//   const blindIsAmount = assetBlindRules?.isAmountBlind;
//   const blindIsType = assetBlindRules?.isTypeBlind;

//   let transferOp = ledger.TransferOperationBuilder.new();

//   const { inputParametersList, inputAmount } = utxoInputs;

//   inputParametersList.forEach(inputParameters => {
//     const { txoRef, assetRecord, ownerMemo, amount } = inputParameters;
//     transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
//   });

//   transferOp = transferOp.add_output_no_tracing(
//     // minimalFee,
//     utxoNumbers,
//     // ledger.fra_get_dest_pubkey(),
//     toPublickey,
//     // fraAssetCode,
//     assetCode,
//     !!blindIsAmount,
//     !!blindIsType,
//   );

//   if (inputAmount > utxoNumbers) {
//     const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

//     transferOp = transferOp.add_output_no_tracing(
//       numberToSubmit,
//       ledger.get_pk_from_keypair(walletInfo.keypair),
//       assetCode,
//       !!blindIsAmount,
//       !!blindIsType,
//     );
//   }

//   return transferOp;
// };

export const getTransferOperation = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
  utxoNumbers: BigInt,
  toPublickey: XfrPublicKey,
  assetCode: string,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const blindIsAmount = assetBlindRules?.isAmountBlind;
  const blindIsType = assetBlindRules?.isTypeBlind;

  let transferOp = ledger.TransferOperationBuilder.new();

  const { inputParametersList, inputAmount } = utxoInputs;

  inputParametersList.forEach(inputParameters => {
    // console.log('inputParameters!', inputParameters);

    const { txoRef, assetRecord, amount, memoData } = inputParameters;

    const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

    const newOwnerMemo = ownerMemo?.clone();

    // console.log('ownerMemnewOwnerMemoo!', newOwnerMemo);

    transferOp = transferOp.add_input_no_tracing(
      txoRef,
      assetRecord,
      newOwnerMemo,
      walletInfo.keypair,
      amount,
    );
  });

  transferOp = transferOp.add_output_no_tracing(
    utxoNumbers,
    toPublickey,
    assetCode,
    !!blindIsAmount,
    !!blindIsType,
  );

  if (inputAmount > utxoNumbers) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

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
  fraCode: string,
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

  const sendUtxoList = getSendUtxo(fraCode, minimalFee, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  // const minimalFee = ledger.fra_get_minimal_fee();

  const fraAssetCode = ledger.fra_get_asset_code();

  const toPublickey = ledger.fra_get_dest_pubkey();

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    minimalFee,
    toPublickey,
    fraAssetCode,
    assetBlindRules,
  );

  return trasferOperation;
};

/**
 * @todo merge w buildTransferOperationWithFee
 * */
export const buildTransferOperation = async (
  walletInfo: WalletKeypar,
  numbers: number,
  toPublickey: XfrPublicKey,
  assetCode: string,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  // const ledger = await getLedger();

  // refactor it!
  const decimals = 6;

  // const fraCode = ledger.fra_get_asset_code();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  // const minimalFee = ledger.fra_get_minimal_fee();

  // For Custom Asset and fra - we use 2 transfers anywas
  const utxoNumbers = BigInt(toWei(numbers, decimals).toString());

  // For FRA only ?
  // if (assetCode === fraCode) {
  // utxoNumbers = BigInt(Number(toWei(numbers, decimals).toString()) + Number(minimalFee));
  // }

  const sendUtxoList = getSendUtxo(assetCode, utxoNumbers, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    // numbers,
    utxoNumbers,
    toPublickey,
    assetCode,
    assetBlindRules,
  );

  return trasferOperation;
};
