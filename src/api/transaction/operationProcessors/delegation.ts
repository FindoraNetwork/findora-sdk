import * as Keypair from '../../keypair';
import { DelegationOperation, TxOperation } from '../types';

export interface ProcessedDelegation {
  delegation: DelegationOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processDelegation = async (operationItem: TxOperation): Promise<ProcessedDelegation> => {
  const operation = operationItem.Delegation!;

  const from = await Keypair.getAddressByPublicKey(operation.pubkey);

  const data = {
    delegation: operation,
    from: [from],
    to: [from],
    type: 'delegation',
    originalOperation: operationItem,
  };

  return data;
};
