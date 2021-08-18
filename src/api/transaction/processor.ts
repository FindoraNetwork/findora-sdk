import Base64 from 'js-base64';
import _get from 'lodash/get';

import { TxInfo } from '../network/types';
import * as helpers from './helpers';
import { getOperationProcessor, ProcessedTx, processorsMap } from './operationProcessors';
import * as Types from './types';

const processTxOperationItem = async (operationItem: Types.TxOperation): Promise<ProcessedTx> => {
  const dataProcessor = getOperationProcessor(operationItem, processorsMap);

  const processedData = await dataProcessor(operationItem);

  return processedData;
};

const processTxOperationList = async (operationsList: Types.TxOperation[]) => {
  return Promise.all(operationsList.map(operationItem => processTxOperationItem(operationItem)));
};

export const processTxInfoItem = async (txItem: TxInfo): Promise<Types.ProcessedTxInfo> => {
  let parsedTx: Types.ParsedTx;

  try {
    parsedTx = JSON.parse(Base64.decode(txItem.tx));
  } catch (err) {
    const e: Error = err as Error;
    throw new Error(`Can not parse the tx info from the tx item. Details: "${e.message}"`);
  }

  if (!parsedTx) {
    throw new Error('parsed tx is empty');
  }

  const time = await helpers.getBlockTime(txItem.height);
  const hash = txItem.hash;
  const code = txItem.tx_result.code;

  const operationsList = helpers.getTxOperationsList(parsedTx);

  const processedOperationList = await processTxOperationList(operationsList);

  const processedUpdatedTxList = processedOperationList.map(txOperation => ({ ...txItem, ...txOperation }));

  return {
    code,
    data: processedUpdatedTxList,
    hash,
    time,
  };
};

export const processeTxInfoList = async (txList: TxInfo[]): Promise<Types.ProcessedTxInfo[]> => {
  return Promise.all(txList.map(txItem => processTxInfoItem(txItem)));
};
