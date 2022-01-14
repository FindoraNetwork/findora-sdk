import { Keypair, Network } from '../../api';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import { addUtxo } from '../../services/utxoHelper';
import { WalletKeypar } from '../keypair';
import { getTransactionBuilder } from '../transaction';

interface FormattedAnonKeys {
  axfrPublicKey: string;
  axfrSecretKey: string;
  decKey: string;
  encKey: string;
}

export interface BarToAbarResult {
  transactionBuilder: TransactionBuilder;
  randomizers: string[];
}

// we return both, the keys and the instance of the object, as it contains `free` method, which would release the pointer
export interface AnonKeysResponse {
  keysInstance: AnonKeys;
  formatted: FormattedAnonKeys;
}

export const genAnonKeys = async (): Promise<AnonKeysResponse> => {
  const ledger = await getLedger();

  try {
    const anonKeys = await ledger.gen_anon_keys();

    const axfrPublicKey = anonKeys.axfr_public_key;
    const axfrSecretKey = anonKeys.axfr_secret_key;
    const decKey = anonKeys.dec_key;
    const encKey = anonKeys.enc_key;

    const formattedAnonKeys = {
      axfrPublicKey,
      axfrSecretKey,
      decKey,
      encKey,
    };

    return {
      keysInstance: anonKeys,
      formatted: formattedAnonKeys,
    };
  } catch (err) {
    throw new Error(`could not get anon keys, "${err}" `);
  }
};

export const barToAbar = async (
  walletInfo: WalletKeypar,
  sid: number,
  anonKeys: AnonKeysResponse,
): Promise<BarToAbarResult> => {
  const ledger = await getLedger();
  let transactionBuilder = await getTransactionBuilder();

  let item;

  try {
    const utxoDataList = await addUtxo(walletInfo, [sid]);
    const [utxoItem] = utxoDataList;
    item = utxoItem;
  } catch (error) {
    throw new Error(`could not fetch utxo for sid ${sid}`);
  }

  const memoDataResult = await Network.getOwnerMemo(sid);

  const { response: myMemoData, error: memoError } = memoDataResult;

  if (memoError) {
    throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
  }

  let ownerMemo;
  let assetRecord;

  try {
    ownerMemo = myMemoData ? ledger.OwnerMemo.from_json(myMemoData) : null;

    assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
  } catch (error) {
    throw new Error(
      `Could not get decode memo data or get assetRecord", Error - ${(error as Error).message}`,
    );
  }

  let axfrPublicKey;
  let encKey;

  try {
    axfrPublicKey = await Keypair.getAXfrPublicKeyByBase64(anonKeys.formatted.axfrPublicKey);

    encKey = await Keypair.getXPublicKeyByBase64(anonKeys.formatted.encKey);
  } catch (error) {
    throw new Error(`Could not convert AXfrPublicKey", Error - ${(error as Error).message}`);
  }

  try {
    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(
      walletInfo.keypair,
      axfrPublicKey,
      BigInt(sid),
      assetRecord,
      ownerMemo?.clone(),
      encKey,
    );
  } catch (error) {
    throw new Error(`Could not add bar to abar operation", Error - ${(error as Error).message}`);
  }

  let randomizers;

  try {
    randomizers = transactionBuilder?.get_randomizers();
  } catch (err) {
    throw new Error(`could not get a list of randomizers strings "${(err as Error).message}" `);
  }

  if (!randomizers) {
    throw new Error(`list of randomizers strings is empty `);
  }

  try {
    anonKeys.keysInstance.free();
  } catch (error) {
    throw new Error(`could not get release the anonymous keys instance  "${(error as Error).message}" `);
  }

  return { transactionBuilder, randomizers };
};
