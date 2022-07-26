import { getLedger } from '../../../services/ledger/ledgerWrapper';
import * as Keypair from '../../keypair';
import { AbarToBarOperation, TxOperation } from '../types';

export interface ProcessedAbarToBar {
  abarToBarOperation: AbarToBarOperation;
  from: string[];
  to: string[];
  amount?: string[];
  confidentialAmount?: string[];
  assetType?: number[];
  confidentialAssetType?: string;
  type: string;
  originalOperation?: TxOperation;
}

export const processAbarToBar = async (operationItem: TxOperation): Promise<ProcessedAbarToBar> => {
  const ledger = await getLedger();

  const operation = operationItem.AbarToBar!;

  const transperentNote = operation?.note?.AbarToAr;

  const myBody = transperentNote?.body;

  const toPublicKey = myBody?.output?.public_key;
  const to = await Keypair.getAddressByPublicKey(toPublicKey);

  const commitement = myBody?.input;

  const commitement58 = ledger.base64_to_base58(commitement);

  const data: ProcessedAbarToBar = {
    abarToBarOperation: operation,
    from: [commitement58],
    to: [to],
    type: 'abarToBar',
    originalOperation: operationItem,
    amount: [transperentNote?.body?.output?.amount?.NonConfidential],
    assetType: transperentNote?.body?.output?.asset_type?.NonConfidential,
  };

  return data;
};
