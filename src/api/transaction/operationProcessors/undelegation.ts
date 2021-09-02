import * as Keypair from '../../keypair';
import { UnDelegationOperation, TxOperation } from '../types';

export interface ProcessedUndelegation {
  unDelegation: UnDelegationOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processUndelegation = async (operationItem: TxOperation): Promise<ProcessedUndelegation> => {
  const operation = operationItem.UnDelegation!;

  const from = await Keypair.getAddressByPublicKey(operation.pubkey);

  const data = {
    unDelegation: operation,
    from: [from],
    to: [from],
    type: 'unDelegation',
    originalOperation: operationItem,
  };

  return data;
};
