import _get from 'lodash/get';
import * as Network from '../network';

import * as Types from './types';
import { TxListDataResult, TxInfo } from '../network/types';

export const getTxListFromResponse = (result: TxListDataResult): null | TxInfo[] =>
  _get(result, 'response.result.txs', null);

export const getTxOperationsList = (parsedTx: Types.ParsedTx): Types.TxOperation[] =>
  _get(parsedTx, 'body.operations', []);

export const getBlockTime = async (height: number) => {
  const blockDetailsResult = await Network.getBlock(height);

  const { response } = blockDetailsResult;

  const block = response?.result;
  const blockTime = block?.block.header.time;
  return blockTime;
};
