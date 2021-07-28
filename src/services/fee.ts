import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import * as AssetApi from '../api/sdkAsset';
import { getLedger } from './ledger/ledgerWrapper';
import { TracingPolicies, TransferOperationBuilder, TxoRef, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputParameter, UtxoInputsInfo } from './utxoHelper';

export interface ReciverInfo {
  utxoNumbers: BigInt;
  toPublickey: XfrPublicKey;
  assetBlindRules?: AssetApi.AssetBlindRules;
}

export const getTransferOperation = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
  recieversInfo: ReciverInfo[],
  assetCode: string,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const asset = await AssetApi.getAssetDetails(assetCode);
  const isTraceable = asset.assetRules.tracing_policies?.length > 0;

  let tracingPolicies: TracingPolicies;

  if (isTraceable) {
    try {
      tracingPolicies = ledger.AssetType.from_json({ properties: asset }).get_tracing_policies();
      console.log('tracingPolicies:', tracingPolicies);
    } catch (e) {
      console.log(e);
    }
  }

  let transferOp = ledger.TransferOperationBuilder.new();

  const { inputParametersList } = utxoInputs;

  const inputPromise = inputParametersList.map(async (inputParameters: UtxoInputParameter) => {
    const { assetRecord, amount, sid } = inputParameters;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }

    const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;

    let txoRef: TxoRef;

    try {
      txoRef = ledger.TxoRef.absolute(BigInt(sid));
    } catch (error) {
      throw new Error(`Cannot convert given sid id to a BigInt, "${sid}"`);
    }

    if (isTraceable) {
      transferOp = transferOp.add_input_with_tracing(
        txoRef,
        assetRecord,
        ownerMemo?.clone(),
        tracingPolicies,
        walletInfo.keypair,
        amount,
      );
    } else {
      transferOp = transferOp.add_input_no_tracing(
        txoRef,
        assetRecord,
        ownerMemo?.clone(),
        walletInfo.keypair,
        amount,
      );
    }
  });

  const _p = await Promise.all(inputPromise);

  recieversInfo.forEach(reciverInfo => {
    const { utxoNumbers, toPublickey, assetBlindRules = {} } = reciverInfo;
    const blindIsAmount = assetBlindRules?.isAmountBlind;
    const blindIsType = assetBlindRules?.isTypeBlind;

    if (isTraceable) {
      transferOp = transferOp.add_output_with_tracing(
        utxoNumbers,
        toPublickey,
        tracingPolicies,
        assetCode,
        !!blindIsAmount,
        !!blindIsType,
      );
    } else {
      transferOp = transferOp.add_output_no_tracing(
        utxoNumbers,
        toPublickey,
        assetCode,
        !!blindIsAmount,
        !!blindIsType,
      );
    }
  });

  return transferOp;
};

export interface TransferOperationFee {
  walletInfo: WalletKeypar;
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean };
  utxoInput?: UtxoInputsInfo;
}

export const buildTransferOperationWithFee = async ({
  walletInfo,
  assetBlindRules,
  utxoInput,
}: TransferOperationFee): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const minimalFee = ledger.fra_get_minimal_fee();
  const fraAssetCode = ledger.fra_get_asset_code();

  let utxoInputsInfo;

  if (!utxoInput) {
    const utxoDataList = await addUtxo(walletInfo, sids);
    const sendUtxoList = getSendUtxo(fraAssetCode, minimalFee, utxoDataList);
    utxoInputsInfo = await addUtxoInputs(sendUtxoList);
  } else {
    utxoInputsInfo = utxoInput;
  }

  const toPublickey = ledger.fra_get_dest_pubkey();

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
      assetBlindRules,
    },
  ];

  const trasferOperation = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    fraAssetCode,
  );

  return trasferOperation;
};

export interface TransferOperation {
  walletInfo: WalletKeypar;
  recieversInfo: ReciverInfo[];
  assetCode: string;
  utxoInput?: UtxoInputsInfo;
}

export const buildTransferOperation = async ({
  walletInfo,
  recieversInfo,
  assetCode,
  utxoInput,
}: TransferOperation): Promise<TransferOperationBuilder> => {
  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('no sids were fetched!');
  }

  const totalUtxoNumbers = recieversInfo.reduce((acc, receiver) => {
    return BigInt(Number(receiver.utxoNumbers) + Number(acc));
  }, BigInt(0));

  let utxoInputsInfo;

  if (!utxoInput) {
    const utxoDataList = await addUtxo(walletInfo, sids);
    const sendUtxoList = getSendUtxo(assetCode, totalUtxoNumbers, utxoDataList);
    utxoInputsInfo = await addUtxoInputs(sendUtxoList);
  } else {
    utxoInputsInfo = utxoInput;
  }

  const transferOperationBuilder = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    assetCode,
  );

  return transferOperationBuilder;
};
