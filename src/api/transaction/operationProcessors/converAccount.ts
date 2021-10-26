import * as Keypair from '../../keypair';
import { ConvertAccountOperation, TxOperation } from '../types';

export interface ProcessedConvertAccount {
  convertAccount: ConvertAccountOperation;
  from: string[];
  to: string[];
  type: string;
  originalOperation?: TxOperation;
}

export const processConvertAccount = async (operationItem: TxOperation): Promise<ProcessedConvertAccount> => {
  const operation = operationItem.ConvertAccount!;

  const from = await Keypair.getAddressByPublicKey(operation.signer);

  const to = operation.receiver.Ethereum;

  const data = {
    convertAccount: operation,
    from: [from],
    to: [to],
    type: 'convertAccount',
    originalOperation: operationItem,
  };

  return data;
};
