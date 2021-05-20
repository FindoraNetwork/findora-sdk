import { BigNumberValue, create as createBigNumber, fromWei, toWei } from '../../services/bigNumber';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { addUtxo, AddUtxoItem } from '../../services/utxoHelper';
import * as UtxoHelper from '../../services/utxoHelper';
import { createKeypair, WalletKeypar } from '../keypair';
import * as Network from '../network';
import * as AssetApi from '../sdkAsset';

const decimals = 6;

// const addUtxoIt = async ({ walletInfo, addSids }) => {
//   const ledger = await getLedger();

//   const utxoDataList = [];

//   console.log(`addSids for "${walletInfo.privateStr}"`, addSids);

//   for (let i = 0; i < addSids.length; i++) {
//     const sid = addSids[i];

//     let utxoData;

//     try {
//       // utxoData = await network.getUtxo(sid);
//       const utxoDataResult = await Network.getUtxo(sid);

//       const { response: utxoDataFetched, error: utxoError } = utxoDataResult;

//       utxoData = utxoDataFetched;
//     } catch (err) {
//       console.log(
//         `address "${walletInfo.address}", skipping sid "${sid}" because of the error - `,
//         err.message,
//       );
//       continue;
//     }

//     // const memoData = await network.getOwnerMemo(sid);

//     const memoDataResult = await Network.getOwnerMemo(sid);

//     const { response: memoData, error: memoError } = memoDataResult;

//     const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

//     // const myOwnerMemo = ownerMemo ? ownerMemo.clone() : null;

//     if (!utxoData) {
//       throw new Error('aaaa!!');
//     }

//     const assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);

//     // const ownerMemo = Object.keys(memoData).length ? Ledger.OwnerMemo.from_json(memoData) : null;

//     const decryptAssetData = await ledger.open_client_asset_record(
//       assetRecord,
//       ownerMemo ? ownerMemo.clone() : ownerMemo,
//       walletInfo.keypair,
//     );

//     decryptAssetData.asset_type = await ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);
//     decryptAssetData.amount = BigInt(decryptAssetData.amount);

//     const item = {
//       address: walletInfo.address,
//       sid,
//       body: decryptAssetData || {},
//     };
//     utxoDataList.push(item);
//   }

//   return utxoDataList;
// };

// const getSendUtxoIt = async ({ code, amount, walletInfo }) => {
//   const ledger = await getLedger();

//   // Fetching utxo data (to be able to calculate and create inputs)
//   const senderBase64PubKey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(walletInfo.keypair));
//   const sidsResult = await Network.getOwnedSids(senderBase64PubKey);

//   const { response: senderTxoSidsFetched } = sidsResult;

//   console.log('sids!', senderTxoSidsFetched);

//   if (!senderTxoSidsFetched) {
//     return;
//   }

//   const addSids = senderTxoSidsFetched.sort((a, b) => a - b);

//   let balance = amount;
//   const result = [];

//   const utxoDataList = await addUtxoIt({ walletInfo, addSids });

//   for (let i = 0; i < utxoDataList.length; i++) {
//     const assetItem = utxoDataList[i];

//     if (assetItem.body.asset_type === code) {
//       const _amount = BigInt(assetItem.body.amount);

//       if (balance <= BigInt(0)) {
//         break;
//       } else if (BigInt(_amount) >= balance) {
//         result.push({ amount: balance, originAmount: _amount, sid: assetItem.sid });
//         break;
//       } else {
//         balance = BigInt(balance) - BigInt(_amount);
//         result.push({ amount: _amount, originAmount: _amount, sid: assetItem.sid });
//       }
//     }
//   }

//   return result;
// };

// const addUtxoInputsIt = async (givenTransferOp, utxoSids, walletInfo) => {
//   const ledger = await getLedger();

//   let inputAmount = BigInt(0);
//   let transferOp = givenTransferOp;

//   for (let i = 0; i < utxoSids.length; i += 1) {
//     const item = utxoSids[i];

//     let utxoData;

//     try {
//       // utxoData = await network.getUtxo(item.sid);
//       const utxoDataResult = await Network.getUtxo(item.sid);

//       const { response: utxoDataFetched, error: utxoError } = utxoDataResult;
//       utxoData = utxoDataFetched;
//     } catch (err) {
//       console.log(`skipping sid "${item.sid}" because of the error `);
//       continue;
//     }

//     inputAmount = BigInt(inputAmount) + BigInt(item.originAmount);

//     if (!utxoData) {
//       throw new Error('aaaa!!');
//     }

//     const assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);

//     const memoDataResult = await Network.getOwnerMemo(item.sid);

//     const { response: memoData, error: memoError } = memoDataResult;

//     const ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : null;

//     const myOwnerMemo = ownerMemo ? ownerMemo.clone() : null;

//     const txoRef = ledger.TxoRef.absolute(BigInt(item.sid));

//     transferOp = transferOp.add_input_no_tracing(
//       txoRef,
//       assetRecord,
//       myOwnerMemo,
//       walletInfo.keypair,
//       BigInt(item.amount),
//     );
//   }

//   const res = { transferOpWithInputs: transferOp, inputAmount };

//   return res;
// };

export const sendTxToAddress = async (
  walletInfo: WalletKeypar,
  toWalletInfo: WalletKeypar,
  numbers: number,
  isBlindAmount = false,
  isBlindType = false,
) => {
  const ledger = await getLedger();

  // const sidsResult = await Network.getOwnedSids(walletInfo.publickey);

  // const { response: sids } = sidsResult;

  // console.log('sids', sids);

  // if (!sids) {
  //   return;
  // }

  const fraAssetCode = await AssetApi.getFraAssetCode();

  const minimalFee = ledger.fra_get_minimal_fee();

  const toPublickey = ledger.public_key_from_base64(toWalletInfo.publickey);

  // const utxoNumbers = toWei(numbers, decimals).toString() + Number(minimalFee);
  const utxoNumbers = BigInt(Number(toWei(numbers, decimals).toString()) + Number(minimalFee));

  console.log('utxoNumbers', utxoNumbers);
  console.log('minimalFee', minimalFee);
  console.log('toWei(numbers, decimals).toString()!', Number(toWei(numbers, decimals).toString()));
  let transferOp = ledger.TransferOperationBuilder.new(); // +

  transferOp = transferOp.add_output_no_tracing(
    minimalFee,
    ledger.fra_get_dest_pubkey(),
    fraAssetCode,
    false,
    false,
  );

  // begin api

  // const utxoSids = await getSendUtxoIt({
  //   walletInfo,
  //   code: fraAssetCode,
  //   amount: utxoNumbers,
  // });

  // const utxoInputs = await addUtxoInputsIt(transferOp, utxoSids, walletInfo);

  // const { transferOpWithInputs, inputAmount } = utxoInputs;

  // transferOp = transferOpWithInputs;

  // end api

  // begins s
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

  // if (BigInt(inputAmount) > BigInt(utxoNumbers)) {
  //   // const numberToSubmit = BigInt(Number(inputAmount) - Number(utxoNumbers));

  //   console.log('inputAmount > utxoNumbers', inputAmount, utxoNumbers);
  //   transferOp = transferOp.add_output_no_tracing(
  //     BigInt(inputAmount) - BigInt(utxoNumbers),
  //     ledger.get_pk_from_keypair(walletInfo.keypair),
  //     fraAssetCode,
  //     isBlindAmount,
  //     isBlindType,
  //   );
  // }

  console.log('a', 4);

  transferOp = transferOp.create().sign(walletInfo.keypair);

  console.log('a', 5);

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

  console.log('submitData!', submitData);
  let result;

  try {
    result = await Network.submitTransaction(submitData);
  } catch (err) {
    throw new Error(`Error Could not define asset: "${err.message}"`);
  }

  console.log('result!', result);
};
