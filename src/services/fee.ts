import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import * as AssetApi from '../api/sdkAsset';
import { getLedger } from './ledger/ledgerWrapper';
import { TracingPolicies, TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputParameter, UtxoInputsInfo } from './utxoHelper';

export interface ReciverInfo {
  utxoNumbers: BigInt;
  toPublickey: XfrPublicKey;
  assetBlindRules?: AssetApi.AssetBlindRules;
}

export const getEmptyTransferBuilder = async (): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  return ledger.TransferOperationBuilder.new();
};

export const getAssetTracingPolicies = async (asset: FindoraWallet.IAsset) => {
  const ledger = await getLedger();

  const tracingPolicies = ledger.AssetType.from_json({ properties: asset }).get_tracing_policies();

  return tracingPolicies;
};

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
      tracingPolicies = await getAssetTracingPolicies(asset);
      console.log('tracingPolicies:', tracingPolicies);
    } catch (e) {
      console.log(e);
    }
  }

  let transferOp = await getEmptyTransferBuilder();

  const { inputParametersList } = utxoInputs;

  const inputPromise = inputParametersList.map(async (inputParameters: UtxoInputParameter) => {
    const { txoRef, assetRecord, amount, sid } = inputParameters;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }

    const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;

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

export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  const minimalFee = await AssetApi.getMinimalFee();

  const fraAssetCode = await AssetApi.getFraAssetCode();

  const sendUtxoList = getSendUtxo(fraAssetCode, minimalFee, utxoDataList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const toPublickey = await AssetApi.getFraPublicKey();

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

export const buildTransferOperation = async (
  walletInfo: WalletKeypar,
  recieversInfo: ReciverInfo[],
  assetCode: string,
): Promise<TransferOperationBuilder> => {
  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched');
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
  );

  return transferOperationBuilder;
};
