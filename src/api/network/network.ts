import axios from 'axios';
import JSONbig from 'json-bigint';

import Sdk from '../../Sdk';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import * as Types from './types';
import { GetDerivedAssetCodeResult, SubmitTransactionDataResult, TransactionData } from './types';

const _axios = axios.create({});

_axios.defaults.transformResponse = [
  data => {
    try {
      return JSONbig({ useNativeBigInt: true }).parse(data);
    } catch (_) {
      return data;
    }
  },
];

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

export const getRpcRoute = (): string => {
  const { hostUrl, rpcPort } = Sdk.environment;

  const url = `${hostUrl}:${rpcPort}`;

  return url;
};

export const apiPost = async (
  url: string,
  data?: Types.ParsedTransactionData,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await _axios.post(url, data, config);
  } catch (err) {
    const e: Error = err as Error;
    return { error: { message: e.message } };
  }

  try {
    const myResponse = axiosResponse.data;
    return { response: myResponse };
  } catch (err) {
    const e: Error = err as Error;

    return { error: { message: e.message } };
  }
};

export const apiGet = async (
  url: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await _axios.get(url, config);
  } catch (err) {
    const e: Error = err as Error;

    return { error: { message: e.message } };
  }

  try {
    const myResponse = axiosResponse.data;
    return { response: myResponse };
  } catch (err) {
    const e: Error = err as Error;
    return { error: { message: e.message } };
  }
};

export const getOwnedSids = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnedSidsDataResult> => {
  const url = `${getQueryRoute()}/get_owned_utxos/${address}`;

  const dataResult = await apiGet(url, config);

  const { response, error } = dataResult;

  if (error) {
    return { error };
  }

  if (Array.isArray(response)) {
    return { response };
  }

  if (parseFloat(response) > 0) {
    return { response: [response] };
  }

  return { response: [] };
};

export const getRelatedSids = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnedSidsDataResult> => {
  const url = `${getQueryRoute()}/get_related_txns/${address}`;

  const dataResult = await apiGet(url, config);

  const { response, error } = dataResult;

  if (error) {
    return { error };
  }

  if (Array.isArray(response)) {
    return { response };
  }

  if (parseFloat(response) > 0) {
    return { response: [response] };
  }

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

export const getDerivedAssetCode = async (
  assetCode: string,
  config?: Types.NetworkAxiosConfig,
): Promise<GetDerivedAssetCodeResult> => {
  const url = `${getLedgerRoute()}/get_derived_asset_code/${assetCode}`;

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

export const getAbarOwnerMemo = async (
  atxoSid: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnerMemoDataResult> => {
  const url = `${getQueryRoute()}/get_abar_memo/${atxoSid}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getMTLeafInfo = async (
  atxoSid: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.MTLeafInfoDataResult> => {
  const url = `${getQueryRoute()}/get_abar_proof/${atxoSid}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Returns state commitment
 *
 * @remarks
 * An important property of a Findora ledger is the ability to authenticate transactions.
 * Users can authenticate transactions against a small tag called the state commitment.
 * The state commitment is a commitment to the current state of the ledger.
 * The state commitment response is a tuple containing the state commitment and the state commitment version.
 *
 *
 * @returns An instace of StateCommitmentDataResult
 */
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

/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @returns An instace of TransactionStatusDataResult
 */
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

export const getParamsForTransparentTxList = (
  address: string,
  type: 'to' | 'from',
  page = 1,
): Types.TxListQueryParams => {
  const query = type === 'from' ? `"addr.from.${address}='y'"` : `"addr.to.${address}='y'"`;

  const params = {
    query,
    page,
    per_page: 10,
    order_by: '"desc"',
  };

  return params;
};

export const getAnonymousTxList = (
  subject: string,
  type: 'to' | 'from',
  page = 1,
): Types.TxListQueryParams => {
  const query = type === 'to' ? `"commitment.created.${subject}='y'"` : `"nullifier.used.${subject}='y'"`;

  const params = {
    query,
    page,
    per_page: 10,
    order_by: '"desc"',
  };

  return params;
};

export const getTxList = async (
  subject: string,
  type: 'from' | 'to',
  page = 1,
  per_page: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListDataResult> => {
  const { blockScanerUrl } = Sdk.environment;

  const url = `${blockScanerUrl}/api/txs`;
  const params = { [type]: subject, page, per_page };

  const dataResult = await apiGet(url, { ...config, params });

  console.log(dataResult);

  return dataResult;
};

export const getTxListByClaim = async (
  subject: string,
  page = 1,
  page_size: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListByStakingDataResult> => {
  const { blockScanerUrl } = Sdk.environment;

  const url = `${blockScanerUrl}/api/staking/claim`;
  const params = { address: subject, page, page_size };

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getTxListByStakingDelegation = async (
  subject: string,
  page = 1,
  page_size: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListByStakingDataResult> => {
  const { blockScanerUrl } = Sdk.environment;
  const url = `${blockScanerUrl}/api/tx/delegation`;
  const params = { address: subject, page, page_size };

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getTxListByStakingUnDelegation = async (
  subject: string,
  page = 1,
  page_size: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListByStakingUnDelegationDataResponseResult> => {
  const { blockScanerUrl } = Sdk.environment;
  const ledger = await getLedger();
  const url = `${blockScanerUrl}/api/staking/undelegation`;
  const params = { pubkey: ledger.bech32_to_base64(subject), page, page_size };

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getTxListByPrismSend = async (
  subject: string,
  page = 1,
  page_size: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListByPrismDataResult> => {
  const { blockScanerUrl } = Sdk.environment;
  const url = `${blockScanerUrl}/api/tx/prism/records/send`;
  const params = { address: subject, page, page_size };

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getTxListByPrismReceive = async (
  subject: string,
  page = 1,
  page_size: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TxListByPrismDataResult> => {
  const { blockScanerUrl } = Sdk.environment;
  const url = `${blockScanerUrl}/api/tx/prism/records/receive`;
  const params = { address: subject, page, page_size };

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
  console.log('🚀 ~ file: network.ts ~ line 372 ~ url', url);

  const dataResult = await apiGet(url, { ...config, params });

  return dataResult;
};

export const getAbciNoce = async (
  data: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AbciNoceResult> => {
  const ledger = await getLedger();
  const ethAddressJson = ledger.get_serialized_address(data);
  const url = `${getExplorerApiRoute()}/abci_query`;
  const params = {
    path: '"module/account/nonce"',
    data: `"${ethAddressJson}"`,
    prove: false,
  };
  const dataResult = await apiGet(url, { ...config, params });
  return dataResult;
};

export const getAbciInfo = async (
  data: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AbciInfoResult> => {
  const ledger = await getLedger();
  const ethAddressJson = ledger.get_serialized_address(data);
  const url = `${getExplorerApiRoute()}/abci_query`;
  const params = {
    path: '"module/account/info"',
    data: `"${ethAddressJson}"`,
    prove: false,
  };
  const dataResult = await apiGet(url, { ...config, params });
  return dataResult;
};

export const submitEvmTx = async (
  tx: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SubmitEvmTxResult> => {
  const url = `${getExplorerApiRoute()}`;
  const params = {
    id: 58,
    jsonrpc: '2.0',
    method: 'broadcast_tx_sync',
    params: {
      tx,
    },
  };
  const dataResult = await apiPost(url, params, { ...config });

  return dataResult;
};

export const getValidatorList = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getLedgerRoute()}/validator_list`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getDelegateInfo = async (
  publickey: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.DelegateInfoDataResult> => {
  const url = `${getLedgerRoute()}/delegation_info/${publickey}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const sendRpcCall = async <T>(
  url: string,
  givenPayload: { [key: string]: any },
  config?: Types.NetworkAxiosConfig,
): Promise<T> => {
  const defaultPayload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_protocolVersion',
    params: [],
  };

  const payload = { ...defaultPayload, ...givenPayload };

  const dataResult = await apiPost(url, payload, { ...config });

  return dataResult as unknown as T;
};

export const sendRpcCallV2 = async <N>(
  givenPayload: N,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  const defaultPayload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_protocolVersion',
    params: [],
  };
  const url = `${getRpcRoute()}`;

  const payload = { ...defaultPayload, ...givenPayload };

  const dataResult = await apiPost(url, payload, { ...config });

  return dataResult;
};

export const getRpcPayload = <T>(msgId: number, method: string, extraParams?: T) => {
  const payload = {
    id: msgId,
    method,
    params: extraParams,
  };

  return payload;
};

export const getLatestBlock = async (
  extraParams?: Types.BlockHeightParams,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.BlockHeightResult> => {
  const msgId = 1;
  const method = 'eth_blockNumber';

  const payload = getRpcPayload<Types.BlockHeightParams>(msgId, method, extraParams);

  const dataResult = await sendRpcCallV2<typeof payload>(payload, config);

  return dataResult;
};

export const getOwnedAbars = async (
  commitment: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnedAbarsDataResult> => {
  const url = `${getQueryRoute()}/owned_abars/${commitment}`;

  const dataResult = await apiGet(url, config);
  return dataResult;
};

export const getAbarMemos = async (
  startSid: string,
  endSid: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AbarMemoDataResult> => {
  const url = `${getQueryRoute()}/get_abar_memos`;

  const params = { start: startSid.trim(), end: endSid.trim() };
  const dataResult = await apiGet(url, { ...config, params });
  return dataResult;
};

export const checkNullifierHashSpent = async (
  hash: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.CheckNullifierHashSpentDataResult> => {
  const url = `${getQueryRoute()}/check_nullifier_hash/${hash}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getConfig = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.DisplayCheckpointDataResult> => {
  const url = `${getLedgerRoute()}/display_checkpoint`;
  const dataResult = await apiGet(url, config);
  return dataResult;
};

export const getAbarCommitment = async (
  atxoSid: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AbarCommitmentDataResult> => {
  const url = `${getQueryRoute()}/get_abar_commitment/${atxoSid.trim()}`;

  const dataResult = await apiGet(url, { ...config });
  return dataResult;
};

export const getMaxAtxoSid = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.MaxAtxoSidDataResult> => {
  const url = `${getQueryRoute()}/get_max_atxo_sid`;

  const dataResult = await apiGet(url, { ...config });
  return dataResult;
};
