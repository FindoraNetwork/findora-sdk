import _get from 'lodash/get';

import * as Types from '../types';

import { processUnsupported, Unsupported } from './unsupported';
import { processDefineAsset, ProcessedDefineAsset } from './defineAsset';
import { processTransferAsset, ProcessedTransferAsset } from './transferAsset';

export type ProcessedTx = ProcessedDefineAsset | ProcessedTransferAsset | Unsupported;

export type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;

export interface TxOperationProcessors {
  [key: string]: ProcessorType;
}

export const getOperationProcessor = (
  operationItem: Types.TxOperation,
  processors: TxOperationProcessors,
): ProcessorType => {
  for (let el of Object.keys(processors)) {
    if (el in operationItem) {
      return _get(processors, el, processors.Unsupported);
    }
  }

  return processors.Unsupported;
};

export const processorsMap: TxOperationProcessors = {
  DefineAsset: processDefineAsset,
  TransferAsset: processTransferAsset,
  Unsupported: processUnsupported,
};
