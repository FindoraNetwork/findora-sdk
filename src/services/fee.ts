import { WalletKeypar } from '../api/keypair';
import * as Network from '../api/network';
import * as AssetApi from '../api/sdkAsset';
import * as FindoraWallet from '../types/findoraWallet';
import { getLedger } from './ledger/ledgerWrapper';
import {
  ClientAssetRecord,
  FeeInputs,
  OwnerMemo,
  TracingPolicies,
  TransferOperationBuilder,
  TxoRef,
  XfrKeyPair,
  XfrPublicKey,
} from './ledger/types';

import { addUtxo, addUtxoInputs, getSendUtxo, UtxoInputParameter, UtxoInputsInfo } from './utxoHelper';

interface FeeInputPayloadType {
  txoRef: TxoRef;
  assetRecord: ClientAssetRecord;
  ownerMemo: OwnerMemo | undefined;
  keypair: XfrKeyPair;
  amount: BigInt;
}

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
  transferOp: TransferOperationBuilder,
): Promise<TransferOperationBuilder> => {
  // let transferOp = await getEmptyTransferBuilder();
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

  let isBlindIsAmount = recieversInfo.some(item => item.assetBlindRules?.isAmountBlind === true);
  let isBlindIsType = recieversInfo.some(item => item.assetBlindRules?.isTypeBlind === true);

  let utxoNumbers = BigInt(0);

  const { inputParametersList, inputAmount } = utxoInputs;

  const inputPromise = inputParametersList.map(async (inputParameters: UtxoInputParameter) => {
    const { txoRef, assetRecord, amount, sid } = inputParameters;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }

    utxoNumbers = utxoNumbers + BigInt(amount.toString());
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

  await Promise.all(inputPromise);

  recieversInfo.forEach(reciverInfo => {
    const { utxoNumbers, toPublickey, assetBlindRules = {} } = reciverInfo;
    const blindIsAmount = assetBlindRules?.isAmountBlind;
    const blindIsType = assetBlindRules?.isTypeBlind;

    if (isTraceable) {
      // @ts-ignore
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

  if (inputAmount > utxoNumbers) {
    const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

    if (isTraceable) {
      tracingPolicies = await getAssetTracingPolicies(asset);

      transferOp = transferOp.add_output_with_tracing(
        numberToSubmit,
        ledger.get_pk_from_keypair(walletInfo.keypair),
        tracingPolicies,
        assetCode,
        isBlindIsAmount,
        isBlindIsType,
      );
    } else {
      transferOp = transferOp.add_output_no_tracing(
        numberToSubmit,
        ledger.get_pk_from_keypair(walletInfo.keypair),
        assetCode,
        isBlindIsAmount,
        isBlindIsType,
      );
    }
  }

  return transferOp;
};

export const getPayloadForFeeInputs = async (
  walletInfo: WalletKeypar,
  utxoInputs: UtxoInputsInfo,
): Promise<FeeInputPayloadType[]> => {
  const ledger = await getLedger();

  const feeInputsPayload: FeeInputPayloadType[] = [];

  const { inputParametersList } = utxoInputs;

  const inputPromise = inputParametersList.map(async (inputParameters: UtxoInputParameter) => {
    const { txoRef, assetRecord, amount, sid } = inputParameters;

    const memoDataResult = await Network.getOwnerMemo(sid);

    const { response: myMemoData, error: memoError } = memoDataResult;

    if (memoError) {
      throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }

    const ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;

    feeInputsPayload.push({
      txoRef,
      assetRecord,
      ownerMemo: ownerMemo?.clone(),
      keypair: walletInfo.keypair,
      amount,
    });
  });

  await Promise.all(inputPromise);

  return feeInputsPayload;
};

// creates an istance of a TransferOperationBuilder with a minimal FRA fee
export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  assetBlindRules?: { isAmountBlind?: boolean; isTypeBlind?: boolean },
): Promise<TransferOperationBuilder> => {
  const minimalFee = await AssetApi.getMinimalFee();
  const fraAssetCode = await AssetApi.getFraAssetCode();
  const toPublickey = await AssetApi.getFraPublicKey();

  const recieversInfo = [
    {
      utxoNumbers: minimalFee,
      toPublickey,
      assetBlindRules,
    },
  ];

  const trasferOperation = await buildTransferOperation(walletInfo, recieversInfo, fraAssetCode);

  return trasferOperation;
};

// used in triple masking
export const getFeeInputs = async (
  walletInfo: WalletKeypar,
  excludeSids: number[],
  isBarToAbar: boolean,
): Promise<FeeInputs> => {
  const ledger = await getLedger();

  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched');
  }

  const filteredSids = sids.filter(sid => !excludeSids.includes(sid));
  //const filteredSids = sids.filter(sid => sid !== excludeSid);

  const minimalFee = isBarToAbar ? await AssetApi.getBarToAbarMinimalFee() : await AssetApi.getMinimalFee();

  console.log('🚀 ~ file: fee.ts ~ line 263 ~ abar minimalFee', minimalFee);

  const fraAssetCode = await AssetApi.getFraAssetCode();

  const utxoDataList = await addUtxo(walletInfo, filteredSids);
  const sendUtxoList = getSendUtxo(fraAssetCode, minimalFee, utxoDataList);
  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  const feeInputsPayload = await getPayloadForFeeInputs(walletInfo, utxoInputsInfo);

  let feeInputs = ledger.FeeInputs.new();

  feeInputsPayload.forEach(payloadItem => {
    const { amount, txoRef, assetRecord, ownerMemo, keypair } = payloadItem;
    feeInputs = feeInputs.append2(amount, txoRef, assetRecord, ownerMemo, keypair);
  });

  return feeInputs;
};

// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
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

  let transferOperationBuilder = await getEmptyTransferBuilder();
  transferOperationBuilder = await getTransferOperation(
    walletInfo,
    utxoInputsInfo,
    recieversInfo,
    assetCode,
    transferOperationBuilder,
  );

  return transferOperationBuilder;
};

export interface ReciverInfoV2 {
  [key: string]: ReciverInfo[];
}

// creates an istance of a TransferOperationBuilder to transfer tokens based on recieversInfo
export const buildTransferOperationV2 = async (
  walletInfo: WalletKeypar,
  recieversInfo: ReciverInfoV2,
): Promise<TransferOperationBuilder> => {
  const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  if (!sids) {
    throw new Error('No sids were fetched');
  }

  let transferOperationBuilder = await getEmptyTransferBuilder();

  for (const assetCodeType of Object.keys(recieversInfo)) {
    const assetCodeItem = recieversInfo[assetCodeType];

    const totalUtxoNumbers = assetCodeItem.reduce((acc, receiver) => {
      return BigInt(Number(receiver.utxoNumbers) + Number(acc));
    }, BigInt(0));

    const utxoDataList = await addUtxo(walletInfo, sids);
    const sendUtxoList = getSendUtxo(assetCodeType, totalUtxoNumbers, utxoDataList);
    const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

    transferOperationBuilder = await getTransferOperation(
      walletInfo,
      utxoInputsInfo,
      assetCodeItem,
      assetCodeType,
      transferOperationBuilder,
    );
  }

  return transferOperationBuilder;
};
