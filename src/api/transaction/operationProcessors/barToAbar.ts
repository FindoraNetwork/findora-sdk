import { getLedger } from '../../../services/ledger/ledgerWrapper';
import * as Keypair from '../../keypair';
import { BarToAbarOperation, TxOperation } from '../types';

export interface ProcessedBarToAbar {
  barToAbarOperation: BarToAbarOperation;
  from: string[];
  to: string[];
  amount?: string[];
  confidentialAmount?: string[];
  assetType?: number[];
  confidentialAssetType?: string;
  type: string;
  originalOperation?: TxOperation;
}

export const processBarToAbar = async (operationItem: TxOperation): Promise<ProcessedBarToAbar> => {
  const ledger = await getLedger();

  const operation = operationItem.BarToAbar!;

  const transperentNote = operation?.note?.ArNote;
  const hiddenNote = operation?.note?.BarNote;

  const myBody = transperentNote?.body || hiddenNote?.body;

  const fromPublicKey = myBody?.input?.public_key;
  const from = await Keypair.getAddressByPublicKey(fromPublicKey);

  const commitement = myBody?.output?.commitment;

  const commitement58 = ledger.base64_to_base58(commitement);

  const data: ProcessedBarToAbar = {
    barToAbarOperation: operation,
    from: [from],
    to: [commitement58],
    type: 'barToAbar',
    originalOperation: operationItem,
    amount: [transperentNote?.body?.input?.amount?.NonConfidential],
    assetType: transperentNote?.body?.input?.asset_type?.NonConfidential,
  };

  if (hiddenNote) {
    data.confidentialAmount = hiddenNote?.body?.input?.amount?.Confidential;
    data.confidentialAssetType = hiddenNote?.body?.input?.asset_type?.Confidential;
  }

  return data;
};
