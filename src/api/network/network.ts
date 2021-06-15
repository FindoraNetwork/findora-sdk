import axios from 'axios';
import JSONbig from 'json-bigint';
import Sdk from '../../Sdk';
import * as Types from './types';

const getQueryRoute = (): string => {
  const { hostUrl, queryPort } = Sdk.environment;

  const url = `${hostUrl}:${queryPort}`;

  return url;
};

const getSubmitRoute = (): string => {
  const { hostUrl, submissionPort } = Sdk.environment;

  const url = `${hostUrl}:${submissionPort}`;

  return url;
};

const getLedgerRoute = (): string => {
  const { hostUrl, ledgerPort } = Sdk.environment;

  const url = `${hostUrl}:${ledgerPort}`;

  return url;
};

const getExplorerApiRoute = (): string => {
  const { hostUrl, explorerApiPort } = Sdk.environment;

  const url = `${hostUrl}:${explorerApiPort}`;

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
    const e: Error = err as Error;
    return { error: { message: e.message } };
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
    const e: Error = err as Error;

    return { error: { message: e.message } };
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

export const getRelatedSids = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnedSidsDataResult> => {
  const url = `${getQueryRoute()}/get_related_txns/${address}`;

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
    const e: Error = err as Error;

    return { error: { message: `Can't submit transaction. Can't parse transaction data. ${e.message}` } };
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

export const getAssetToken = async (
  assetCode: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AssetTokenDataResult> => {
  const url = `${getLedgerRoute()}/asset_token/${assetCode}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getIssuedRecords = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.IssuedRecordDataResult> => {
  const url = `${getQueryRoute()}/get_issued_records/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getTransactionStatus = async (
  handle: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TransactionStatusDataResult> => {
  const url = `${getSubmitRoute()}/txn_status/${handle}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getBlock = async (
  height: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.BlockDetailsDataResult> => {
  const url = `${getExplorerApiRoute()}/block`;

  const dataResult = await apiGet(url, { ...config, params: { height } });

  return dataResult;
};

export const getHashSwap = async (
  hash: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.HashSwapDataResult> => {
  const url = `${getExplorerApiRoute()}/tx_search`;
  const dataResult = await apiGet(url, { ...config, params: { query: `"tx.prehash='${hash}'"` } });

  return dataResult;
};

export const getTxList = async (
  address: string,
  type: 'to' | 'from',
  page = 1,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListDataResult> => {
  const url = `${getExplorerApiRoute()}/tx_search`;

  const query = type === 'from' ? `"addr.from.${address}='y'"` : `"addr.to.${address}='y'"`;

  const params = {
    query,
    page,
    per_page: 10,
    order_by: '"desc"',
  };

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getTransactionDetails = async (
  hash: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxDetailsDataResult> => {
  const params = {
    hash: `0x${hash}`,
  };
  const url = `${getExplorerApiRoute()}/tx`;

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};
