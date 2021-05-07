import axios from 'axios';
import JSONbig from 'json-bigint';

import Sdk from '../../Sdk';
import * as Types from './types';

const getQueryRoute = (): string => {
  const { protocol, hostUrl, queryPort } = Sdk.environment;

  const url = `${protocol}://${hostUrl}:${queryPort}`;

  return url;
};

const getSubmitRoute = (): string => {
  const { protocol, hostUrl, submissionPort } = Sdk.environment;

  const url = `${protocol}://${hostUrl}:${submissionPort}`;

  return url;
};

const getLedgerRoute = (): string => {
  const { protocol, hostUrl, ledgerPort } = Sdk.environment;

  const url = `${protocol}://${hostUrl}:${ledgerPort}`;

  return url;
};

export const apiPost = async (
  url: string,
  data?: Types.ParsedTransactionData,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await axios.post(url, data, config);
  } catch (err) {
    return { error: { message: err.message } };
  }

  try {
    const myResponse = JSONbig({ useNativeBigInt: true }).parse(axiosResponse.data);
    return { response: myResponse };
  } catch (_) {
    return { response: axiosResponse.data };
  }
};

export const apiGet = async (
  url: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await axios.get(url, config);
  } catch (err) {
    return { error: { message: err.message } };
  }

  try {
    const myResponse = JSONbig({ useNativeBigInt: true }).parse(axiosResponse.data);
    return { response: myResponse };
  } catch (_) {
    return { response: axiosResponse.data };
  }
};

export const getOwnedSids = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnedSidsDataResult> => {
  const url = `${getQueryRoute()}/get_owned_utxos/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getUtxo = async (
  utxoSid: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.UtxoDataResult> => {
  const url = `${getLedgerRoute()}/utxo_sid/${utxoSid}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getOwnerMemo = async (
  utxoSid: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnerMemoDataResult> => {
  const url = `${getQueryRoute()}/get_owner_memo/${utxoSid}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getStateCommitment = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.StateCommitmentDataResult> => {
  const url = `${getLedgerRoute()}/global_state`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getSubmitTransactionData = <T extends Types.TransactionData>(data?: T): Types.DataResult => {
  let txData;

  if (!data) {
    return { response: txData };
  }

  try {
    txData = JSONbig.parse(data);
    return { response: txData };
  } catch (err) {
    return { error: { message: `Can't submit transaction. Can't parse transaction data. ${err.message}` } };
  }
};

export const submitTransaction = async <T extends Types.TransactionData>(
  data?: T,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SubmitTransactionDataResult> => {
  const url = `${getSubmitRoute()}/submit_transaction`;

  const { response: txData, error } = getSubmitTransactionData(data);

  if (error) {
    return { error };
  }

  const dataResult = await apiPost(url, txData, config);

  return dataResult;
};
