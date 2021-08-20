import { TxOperation } from '../types';

export interface Unsupported {
  result: boolean;
  type: string;
  originalOperation: TxOperation;
}

export const processUnsupported = async (op: TxOperation): Promise<Unsupported> => {
  const data = {
    result: false,
    type: 'unsupported',
    originalOperation: op,
    from: 'unknonwn',
    to: 'unknonwn',
  };

  return data;
};
