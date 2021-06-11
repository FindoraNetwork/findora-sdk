import _get from 'lodash/get';

import * as Types from '../types';

import { processUnsupported, Unsupported } from './unsupported';
import { processDefineAsset, ProcessedDefineAsset } from './defineAsset';

export type ProcessedTx = ProcessedDefineAsset | Unsupported;

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
  Unsupported: processUnsupported,
};
