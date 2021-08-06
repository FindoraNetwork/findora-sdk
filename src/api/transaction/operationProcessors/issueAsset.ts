import * as Keypair from '../../keypair';
import * as Asset from '../../sdkAsset';
import { IssueAssetOperation, TxOperation } from '../types';

export interface ProcessedIssueAsset {
  issueAsset: IssueAssetOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processIssueAsset = async (operationItem: TxOperation): Promise<ProcessedIssueAsset> => {
  const operation = operationItem.IssueAsset!;

  const asset = operation.body;

  const code = await Asset.getAssetCode(asset.code.val);
  const from = await Keypair.getAddressByPublicKey(operation.pubkey.key);

  const data = {
    issueAsset: { ...operation, code },
    from: [from],
    to: [from],
    type: 'issueAsset',
    originalOperation: operationItem,
  };

  return data;
};
