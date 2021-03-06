import _get from 'lodash/get';

import * as Types from '../types';
import { processDefineAsset, ProcessedDefineAsset } from './defineAsset';
import { ProcessedIssueAsset, processIssueAsset } from './issueAsset';
import { ProcessedTransferAsset, processTransferAsset } from './transferAsset';
import { ProcessedUndelegation, processUndelegation } from './undelegation';
import { ProcessedDelegation, processDelegation } from './delegation';
import { ProcessedClaim, processClaim } from './claim';
import { ProcessedConvertAccount, processConvertAccount } from './converAccount';

import { processUnsupported, Unsupported } from './unsupported';

export type ProcessedTx =
  | ProcessedDefineAsset
  | ProcessedTransferAsset
  | ProcessedIssueAsset
  | ProcessedUndelegation
  | ProcessedDelegation
  | ProcessedClaim
  | ProcessedConvertAccount
  | Unsupported;

export type ProcessorType = (op: Types.TxOperation) => Promise<ProcessedTx>;

export interface TxOperationProcessors {
  [key: string]: ProcessorType;
}

export const getOperationProcessor = (
  operationItem: Types.TxOperation,
  processors: TxOperationProcessors,
): ProcessorType => {
  for (const el of Object.keys(processors)) {
    if (el in operationItem) {
      return _get(processors, el, processors.Unsupported);
    }
  }

  return processors.Unsupported;
};

export const processorsMap: TxOperationProcessors = {
  DefineAsset: processDefineAsset,
  TransferAsset: processTransferAsset,
  IssueAsset: processIssueAsset,
  Unsupported: processUnsupported,
  UnDelegation: processUndelegation,
  Delegation: processDelegation,
  Claim: processClaim,
  ConvertAccount: processConvertAccount,
};
