import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';

type LedgerType = 'nodeLedger' | 'webLedger';

type Ledger = LedgerForNode | LedgerForWeb;

const ledgers = {
  nodeLedger,
  webLedger,
};

export const getLedger = async (ledger: LedgerType): Promise<Ledger> => {
  const loadledgerModule = ledgers[ledger];

  const myLedger = await loadledgerModule();

  return myLedger;
};
