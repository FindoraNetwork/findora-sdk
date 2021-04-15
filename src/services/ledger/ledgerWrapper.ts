import nodeLedger from './nodeLedger';
import webLedger from './webLedger';

type LedgerType = 'nodeLedger' | 'webLedger';

// type Ledger = LedgerForNode | LedgerForWeb;

const ledgers = {
  nodeLedger,
  webLedger,
};

export const getLedger = async (ledger: LedgerType): Promise<any> => {
  const loadledgerModule = ledgers[ledger];
  // const loadledgerModule = await import('./webLedger');

  const myLedger = await loadledgerModule();

  return myLedger;
};
