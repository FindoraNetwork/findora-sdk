import axios from 'axios';
import JSONbig from 'json-bigint';
import Sdk from '../../Sdk';
import { getLedger } from '../../services/ledger/ledgerWrapper';
import * as Types from './types';

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

/**
 * Get Sids owned by given address
 *
 * @remarks
 * This method is used to get Sids owned by given address
 *
 * @example
 *
 * ```ts
 * const address = `frabhhjsswerf`;
 *
 * // Get Sids' information
 * const ownedSids = await Network.getOwnedSids(address);
 * ```
 * @param address - wallet address
 * @param config - network config
 * @returns An instance of {@link OwnedSidsDataResult} containing the response and error.
 *
 */
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

/**
 * Get UTXO ledger for given utxo sid
 *
 * @remarks
 * This method is used to get UTXO ledger for given utxo sid
 *
 * @example
 *
 * ```ts
 * const utxoSid = 143;
 *
 * // Get UTXO details
 * const utxoData = await Network.getUtxo(utxoSid);
 * ```
 * @param address - wallet address
 * @param config - network config
 * @returns An instance of {@link UtxoDataResult} containing the response and error.
 *
 */
export const getUtxo = async (
  utxoSid: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.UtxoDataResult> => {
  const url = `${getLedgerRoute()}/utxo_sid/${utxoSid}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Get the owner memo by given UTXO sid
 *
 * @remarks
 * This method is used to get owner memo by given UTXO sid
 *
 * @example
 *
 * ```ts
 * const utxoSid = 143;
 *
 * // Get owner memo
 * const ownerMemo = await Network.getOwnerMemo(utxoSid);
 * ```
 * @param utxoSid - UTXO sid
 * @param config - network config
 * @returns An instance of {@link OwnerMemoDataResult} containing the response and error.
 *
 */
export const getOwnerMemo = async (
  utxoSid: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.OwnerMemoDataResult> => {
  const url = `${getQueryRoute()}/get_owner_memo/${utxoSid}`;

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
 * @example
 *
 * ```ts
 * // Get state commitment
 * const stateCommitment = await Network.getStateCommitment();
 * ```
 * @param config - network config
 * @returns An instance of {@link StateCommitmentDataResult} containing the response and error.
 *
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

/**
 * Submit transation
 *
 * @remarks
 * This method is used to submit transaction
 *
 * @example
 *
 * ```ts
 * const data = `Your_Transaction_Data`;
 *
 * // Submit transaction
 * const txResult = await Network.submitTransaction(data);
 * ```
 * @param data - transaction data
 * @param config - network config
 * @returns An instance of {@link SubmitTransactionDataResult} containing the response and error.
 *
 */
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

/**
 * Get information of given type of asset token
 *
 * @remarks
 * This method is used to get information of given type of asset token
 *
 * @example
 *
 * ```ts
 * const assetCode = Asset.getFraAssetCode();
 *
 * // Get token information
 * const assetToken = await Network.getAssetToken(assetCode);
 * ```
 * @param assetCode - asset code
 * @param config - network config
 * @returns An instance of {@link AssetTokenDataResult} containing the response and error.
 *
 */
export const getAssetToken = async (
  assetCode: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AssetTokenDataResult> => {
  const url = `${getLedgerRoute()}/asset_token/${assetCode}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Get information of issued records for given public key
 *
 * @remarks
 * This method is used to get information of issued records for given public key
 *
 * @example
 *
 * ```ts
 * const publickey = `publickeyexample`;
 *
 * // Get issed records information
 * const issuedRecords = await Network.getIssuedRecords(publickey);
 * ```
 * @param address - public key
 * @param config - network config
 * @returns An instance of {@link IssuedRecordDataResult} containing the response and error.
 *
 */
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

/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @example
 *
 * ```ts
 * const handle = `YOUR_TX_HASH`;
 *
 * // Get transaction status
 * const transactionStatus = await Network.getTransactionStatus(handle);
 * ```
 * @param handle - transaction handle
 * @param config - network config
 * @returns An instance of {@link TransactionStatusDataResult} containing the response and error.
 *
 */
export const getTransactionStatus = async (
  handle: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.TransactionStatusDataResult> => {
  const url = `${getSubmitRoute()}/txn_status/${handle}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Get datails of given block
 *
 * @remarks
 * This method is used to get details of given block
 *
 * @example
 *
 * ```ts
 * const blockHeight = 1432;
 *
 * // Get block #1432 details
 * const blockDetail = await Network.getBlock(blockHeight);
 * ```
 * @param height - block heigth
 * @param config - network config
 * @returns An instance of {@link BlockDetailsDataResult} containing the response and error.
 *
 */
export const getBlock = async (
  height: number,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.BlockDetailsDataResult> => {
  const url = `${getExplorerApiRoute()}/block`;

  const dataResult = await apiGet(url, { ...config, params: { height } });

  return dataResult;
};

/**
 * Get transaction details
 *
 * @remarks
 * This method is used to get details of transaction with given hash
 *
 * @example
 *
 * ```ts
 * const hash = `YOUR_TX_HASH`;
 *
 * // Get transaction details of given hash
 * const txDetail = await Network.getHashSwap(hash);
 * ```
 * @param hash - tx hash
 * @param config - network config
 * @returns An instance of {@link HashSwapDataResult} containing the response and error.
 *
 */
export const getHashSwap = async (
  hash: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.HashSwapDataResult> => {
  const url = `${getExplorerApiRoute()}/tx_search`;
  const dataResult = await apiGet(url, { ...config, params: { query: `"tx.prehash='${hash}'"` } });

  return dataResult;
};

/**
 * Get a list of transactions for given wallet address
 *
 * @remarks
 * This method is used to get a list of transactions for given wallet address
 *
 * @example
 *
 * ```ts
 * const address = `fra000xxsr`;
 * const type = 'to';
 *
 * // Get list of `to` transaction of given address
 * const txDetail = await Network.getTxList(address,type);
 * ```
 * @param address - wallet address
 * @param type - transaction type. it can only be 'to' or 'from'
 * @param page - pagination
 * @param config - network config
 * @returns An instance of {@link TxListDataResult} containing the response and error.
 *
 */
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

/**
 * Get ABCI Noce
 *
 * @remarks
 * This method is used to get ABCI Noce.
 *
 * @example
 *
 * ```ts
 * const data = '0x12345d';
 *
 * // Get ABCI Noce
 * const acbiNoce = await Network.getAbciNoce(data);
 * ```
 * @param data - an ethereum address
 * @param config - network config
 * @returns An instance of {@link AbciNoceResult} containing the response and error.
 *
 */
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

/**
 * Get ABCI information
 *
 * @remarks
 * This method is used to get ABCI information.
 *
 * @example
 *
 * ```ts
 * const data = '0x12345d';
 *
 * // Get ABCI information
 * const acbiInfo = await Network.getAbciInfo(data);
 * ```
 * @param data - a wallet address
 * @param config - network config
 * @returns An instance of {@link AbciInfoResult} containing the response and error.
 *
 */
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

/**
 * Submit EVM transaction
 *
 * @remarks
 * This method is used to submit the EVM transaction.
 *
 * @example
 *
 * ```ts
 * const tx = 'Your_TX_Hash';
 *
 * // Submit the EVM transaction
 * const result = await Network.submitEvmTx(tx);
 * ```
 * @param tx - transaction hash
 * @param config - network config
 * @returns An instance of {@link SubmitEvmTxResult} containing the response and error.
 *
 */
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

/**
 * Get validator list
 *
 * @remarks
 * This method is used to get the list of validators.
 *
 * @example
 *
 * ```ts
 * // Get validator list
 * const acbiInfo = await Network.getValidatorList();
 * ```
 * @param config - network config
 * @returns An instance of {@link ValidatorListDataResult} containing the response and error.
 *
 */
export const getValidatorList = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getLedgerRoute()}/validator_list`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Get the delegation information
 *
 * @remarks
 * This method is used to get the delegation information
 *
 * @example
 *
 * ```ts
 * const publickey = 'qsedx23rtgds';
 *
 * // Get the delegation information
 * const blockDetail = await Network.getDelegateInfo(publickey);
 * ```
 * @param publickey - public key
 * @param config - network config
 * @returns An instance of {@link DelegateInfoDataResult} containing the response and error.
 *
 */
export const getDelegateInfo = async (
  publickey: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.DelegateInfoDataResult> => {
  const url = `${getLedgerRoute()}/delegation_info/${publickey}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

/**
 * Send RPC call
 *
 * @remarks
 * This method is used to send RPC call
 *
 * @example
 *
 * ```ts
 * cont url = `https://prod-testnet.prod.findora.org:8545`;
 * const payload = {
 *   method: `eth_getBlockByHash`,
 *   params: ['0x1af723767d06...',true],
 * };
 *
 * // Send the RPC call to get block details by hash
 * const blockDetail = await Network.sendRpcCall(url,payload);
 * ```
 * @param url - RPC url
 * @param givenPayload - payload
 * @param config - network config
 * @returns The response from RPC call.
 *
 */
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

  return dataResult as T;
};
