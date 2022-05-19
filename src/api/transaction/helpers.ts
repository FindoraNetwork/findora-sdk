import _get from 'lodash/get';
import * as Network from '../network';
import { TxInfo, TxListDataResult } from '../network/types';
import * as Types from './types';

/**
 * Get Transaction List by given transaction data response
 *
 * @remarks
 * Using this function, user can Get Transaction List by given transaction data response
 *
 * @example
 *
 * ```ts
 *  const address = 'fra12dsfew';
 *  const type = 'to';
 *  const dataResult = await Network.getTxList(address, type);
 *  // Get tx list
 *  const txList  = await helpers.getTxListFromResponse();
 * ```
 * @param result - transaction data response
 *
 * @returns transaction list
 */
export const getTxListFromResponse = (result: TxListDataResult): null | TxInfo[] =>
  _get(result, 'response.result.txs', null);

/**
 * Get Operation List by given parsed transaction
 *
 * @remarks
 * Using this function, user can Get Transaction List by given parsed transaction
 *
 * @example
 *
 * ```ts
 *  const address = 'fra12dsfew';
 *  const type = 'to';
 *  const dataResult = await Network.getTxList(address, type);
 *  // Get tx list
 *  const txList  = await helpers.getTxListFromResponse();
 *  // Get one parsed tx
 *  parsedTx = JSON.parse(Base64.decode(txList[0].tx));
 *  // Get operation Lsit
 *  opList = helpers.getTxOperationsList(parsedTx);
 * ```
 * @param parsedTx - parsed tx info
 * @returns transaction operations list
 */
export const getTxOperationsList = (parsedTx: Types.ParsedTx): Types.TxOperation[] =>
  _get(parsedTx, 'body.operations', []);

/**
 * Get Block Time by given block height
 *
 * @remarks
 * Using this function, user can get block time by given block height
 *
 * @example
 *
 * ```ts
 *  const blockHeight = 2341;
 *  // Get block time at Block #2341
 *  const blockTime = await helpers.getBlockTime(blockHeight);
 * ```
 *@param height block height
 * @returns block time
 */
export const getBlockTime = async (height: number) => {
  const blockDetailsResult = await Network.getBlock(height);

  const { response } = blockDetailsResult;

  const block = response?.result;
  const blockTime = block?.block?.header?.time;
  return blockTime;
};
