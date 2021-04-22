import { network } from '../../services';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import {
  ClientAssetRecord as LedgerClientAssetRecord,
  OwnerMemo as LedgerOwnerMemo,
  TransferOperationBuilder,
  TxoRef as LedgerTxoRef,
} from '../../services/ledger/types';
import { LedgerUtxo } from '../../services/network/types';
import { WalletKeypar } from '../keypair';

interface LedgerUtxoItem {
  sid: number;
  utxo: LedgerUtxo;
  ownerMemo: LedgerOwnerMemo | undefined;
}

interface AddUtxoItem extends LedgerUtxoItem {
  address: string;
  // sid: number;
  body: any;
  // utxo: LedgerUtxo;
  // ownerMemo: LedgerOwnerMemo;
}

interface UtxoOutputItem extends LedgerUtxoItem {
  // sid: number;
  originAmount: BigInt;
  amount: BigInt;
  // utxo: LedgerUtxo;
  // ownerMemo: LedgerOwnerMemo;
}

export interface UtxoInputParameter {
  txoRef: LedgerTxoRef;
  assetRecord: LedgerClientAssetRecord;
  ownerMemo: LedgerOwnerMemo | undefined;
  amount: BigInt;
}

export interface UtxoInputsInfo {
  inputParametersList: UtxoInputParameter[];
  inputAmount: BigInt;
}

// export interface UtxoInputsOperation {
//   transferOpWithInputs: TransferOperationBuilder;
//   inputAmount: BigInt;
// }

// creates a list of items with descrypted utxo information
export const addUtxo = async (walletInfo: WalletKeypar, addSids: number[]): Promise<AddUtxoItem[]> => {
  const ledger = await getLedger();

  const utxoDataList = [];

  for (let i = 0; i < addSids.length; i++) {
    const sid = addSids[i];
    console.log(`Processing sid "${sid}" (${i + 1} out of ${addSids.length})`);

    const utxoDataResult = await network.getUtxo(sid);

    const { response: utxoData, error: utxoError } = utxoDataResult;

    if (utxoError || !utxoData) {
      // console.log('err!!', utxoDataResult);
      // console.log(
      //   `address "${walletInfo.address}", skipping sid "${sid}" because of the error - `,
      //   utxoError?.message,
      // );
      continue;
    }

    const memoDataResult = await network.getOwnerMemo(sid);

    const { response: memoData, error: memoError } = memoDataResult;

    if (memoError) {
      continue;
    }

    const assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);

    const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

    const decryptAssetData = await ledger.open_client_asset_record(
      assetRecord,
      ownerMemo?.clone(),
      walletInfo.keypair,
    );

    decryptAssetData.asset_type = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);

    decryptAssetData.amount = BigInt(decryptAssetData.amount);

    // console.log('decryptAssetData!', decryptAssetData);

    const item = {
      address: walletInfo.address,
      sid,
      body: decryptAssetData || {},
      utxo: { ...utxoData.utxo },
      ownerMemo: ownerMemo?.clone(),
    };

    utxoDataList.push(item);
  }

  // console.log('!utxoDataList', utxoDataList);

  return utxoDataList;
};

// creates a list of utxo like object, which are suitable for the required send operation
export const getSendUtxo = (code: string, amount: BigInt, utxoDataList: AddUtxoItem[]): UtxoOutputItem[] => {
  // const ledger = await getLedger();

  // const senderBase64PubKey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(walletInfo.keypair));
  // const senderTxoSidsFetchedResult = await network.getOwnedSids(senderBase64PubKey);

  // const { response: senderTxoSidsFetched, error } = senderTxoSidsFetchedResult;

  // if (error) {
  //   throw new Error(error.message);
  // }

  // if (!senderTxoSidsFetched) {
  //   throw new Error('could not get owned sids information');
  // }

  // console.log('==!!  senderTxoSidsFetched !!==', senderTxoSidsFetched);

  // const addSids = senderTxoSidsFetched.sort((a, b) => a - b);

  let balance = amount;

  const result = [];

  // const utxoDataList = await addUtxo({ walletInfo, addSids });

  for (let i = 0; i < utxoDataList.length; i++) {
    const assetItem = utxoDataList[i];

    if (assetItem.body.asset_type === code) {
      const _amount = BigInt(assetItem.body.amount);

      if (balance <= BigInt(0)) {
        break;
      } else if (BigInt(_amount) >= balance) {
        result.push({
          amount: balance,
          originAmount: _amount,
          sid: assetItem.sid,
          utxo: { ...assetItem.utxo },
          ownerMemo: assetItem.ownerMemo,
        });
        break;
      } else {
        balance = BigInt(Number(balance) - Number(_amount));
        result.push({
          amount: _amount,
          originAmount: _amount,
          sid: assetItem.sid,
          utxo: { ...assetItem.utxo },
          ownerMemo: assetItem.ownerMemo,
        });
      }
    }
  }

  // console.log('getSendUtxo res', result);
  return result;
};

export const addUtxoInputs = async (utxoSids: UtxoOutputItem[]): Promise<UtxoInputsInfo> => {
  const ledger = await getLedger();

  let inputAmount = BigInt(0);
  // let transferOp = givenTransferOp;

  const inputParametersList = [];

  for (let i = 0; i < utxoSids.length; i += 1) {
    const item = utxoSids[i];

    // let utxoDataResult;

    // try {
    //   utxoDataResult = await network.getUtxo(item.sid);
    // } catch (err) {
    //   console.log(`skipping sid "${item.sid}" because of the error `);
    //   continue;
    // }

    // const { response: utxoData, error } = utxoDataResult;

    // if (error || !utxoData) {
    //   continue;
    // }

    inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));

    // const memoData = await network.getOwnerMemo(item.sid);

    // const assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
    const assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);

    // const ownerMemo = Object.keys(memoData).length ? ledger.OwnerMemo.from_json(memoData) : null;

    const txoRef = ledger.TxoRef.absolute(BigInt(item.sid));

    // transferOp = transferOp.add_input_no_tracing(
    //   txoRef,
    //   assetRecord,
    //   item.ownerMemo?.clone(),
    //   walletInfo.keypair,
    //   BigInt(item.amount),
    // );

    const inputParameters: UtxoInputParameter = {
      txoRef,
      assetRecord,
      ownerMemo: item.ownerMemo?.clone(),
      // walletInfo.keypair,
      amount: item.amount,
    };

    inputParametersList.push(inputParameters);
  }

  const res = { inputParametersList, inputAmount };

  return res;
};

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

  // const utxoSids = await getSendUtxo({
  //   code: Ledger.fra_get_asset_code(),
  //   amount: minimalFee,
  //   walletInfo,
  // });

  // const { transferOpWithInputs, inputAmount } = await addUtxoInputs(transferOp, utxoSids, walletInfo);
  const { inputParametersList, inputAmount } = utxoInputs;

  inputParametersList.forEach(inputParameters => {
    const { txoRef, assetRecord, ownerMemo, amount } = inputParameters;
    transferOp = transferOp.add_input_no_tracing(txoRef, assetRecord, ownerMemo, walletInfo.keypair, amount);
  });

  // transferOp = transferOpWithInputs;

  transferOp = transferOp.add_output_no_tracing(
    minimalFee,
    toPublickey,
    assetCode,
    isBlindAmount,
    isBlindType,
  );

  // const numberToSubmit = BigInt(inputAmount) - BigInt(minimalFee);

  // Decide whether to add a "change"
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
  // transferOp = transferOp.create().sign(walletInfo.keypair);

  // return transferOp.transaction();
};

export const buildTransferOperationWithFee = async (
  walletInfo: WalletKeypar,
  fraCode: string,
): Promise<TransferOperationBuilder> => {
  const ledger = await getLedger();

  const minimalFee = ledger.fra_get_minimal_fee();

  console.log('!walletInfo', walletInfo);
  const sidsResult = await network.getOwnedSids(walletInfo.publickey);

  const { response: sids } = sidsResult;

  console.log('sids', sids);

  if (!sids) {
    console.log('sidsResult', sidsResult);
    throw new Error('no sids were fetched!');
  }

  const utxoDataList = await addUtxo(walletInfo, sids);

  console.log('utxoDataList', utxoDataList);

  const sendUtxoList = getSendUtxo(fraCode, minimalFee, utxoDataList);

  console.log('sendUtxoList!', sendUtxoList);

  const utxoInputsInfo = await addUtxoInputs(sendUtxoList);

  console.log('utxoInputsInfo!', utxoInputsInfo);

  const trasferOperation = await getTransferOperationWithFee(walletInfo, utxoInputsInfo);

  console.log('trasferOperation!', trasferOperation);

  return trasferOperation;
};
