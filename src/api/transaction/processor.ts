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
  // const time = await helpers.getBlockTime(txItem.height);
  const time = String(txItem.timestamp);
  const hash = txItem.tx_hash;
  const code = txItem.code;

  const operationsList = helpers.getTxOperationsList(txItem.value); // has BarToAbar TransferAsset etc

  const processedOperationList = await processTxOperationList(operationsList);

  const processedUpdatedTxList = processedOperationList.map(txOperation => ({ ...txItem, ...txOperation }));

  return {
    code,
    data: processedUpdatedTxList,
    hash,
    time,
    block_hash: txItem.block_hash,
    height: txItem.height,
  };
};

export const processeTxInfoList = async (txList: TxInfo[]): Promise<Types.ProcessedTxInfo[]> => {
  return Promise.all(txList.map(txItem => processTxInfoItem(txItem)));
};
