import * as Keypair from '../../keypair';
import { ClaimOperation, TxOperation } from '../types';

export interface ProcessedClaim {
  claim: ClaimOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processClaim = async (operationItem: TxOperation): Promise<ProcessedClaim> => {
  const operation = operationItem.Claim!;

  const from = await Keypair.getAddressByPublicKey(operation.pubkey);

  const data = {
    claim: operation,
    from: [from],
    to: [from],
    type: 'claim',
    originalOperation: operationItem,
  };

  return data;
};
