import * as Keypair from '../../keypair';
import { TransferAssetOperation, TxOperation } from '../types';

export interface ProcessedTransferAsset {
  transferAsset: TransferAssetOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processTransferAsset = async (operationItem: TxOperation): Promise<ProcessedTransferAsset> => {
  const operation = operationItem.TransferAsset!;

  const transfer = operation.body.transfer;

  const fromPromise = transfer.inputs.map(async item => Keypair.getAddressByPublicKey(item.public_key));
  const toPromise = transfer.outputs.map(async item => Keypair.getAddressByPublicKey(item.public_key));

  const from = await Promise.all(fromPromise);
  const to = await Promise.all(toPromise);

  const data = {
    transferAsset: operation,
    from,
    to,
    type: 'transferAsset',
    originalOperation: operationItem,
  };

  return data;
};
