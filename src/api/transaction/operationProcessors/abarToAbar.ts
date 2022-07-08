import { getLedger } from '../../../services/ledger/ledgerWrapper';
import * as Keypair from '../../keypair';
import { AbarToAbarOperation, TxOperation } from '../types';

export interface ProcessedAbarToAbar {
  abarToAbarOperation: AbarToAbarOperation;
  from: string[];
  to: string[];
  confidentialAmount?: string[];
  confidentialAssetType?: string;
  type: string;
  originalOperation?: TxOperation;
}

export const processAbarToAbar = async (operationItem: TxOperation): Promise<ProcessedAbarToAbar> => {
  const ledger = await getLedger();

  const operation = operationItem.TransferAnonAsset!;

  const transperentNote = operation?.note;

  const myBody = transperentNote?.body;

  const fromNullifierHashes = myBody?.inputs;

  const fromNullifierHashes58List = fromNullifierHashes.map(commitment =>
    ledger.base64_to_base58(commitment),
  );

  const toCommitementsItems = myBody?.outputs;

  const toCommitement58List = toCommitementsItems.map(commitmentItem =>
    ledger.base64_to_base58(commitmentItem.commitment),
  );

  const data: ProcessedAbarToAbar = {
    abarToAbarOperation: operation,
    from: fromNullifierHashes58List,
    to: toCommitement58List,
    type: 'abarToAbar',
    originalOperation: operationItem,
  };

  return data;
};
