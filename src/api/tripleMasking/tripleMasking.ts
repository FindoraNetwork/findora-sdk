import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AnonKeys } from '../../services/ledger/types';

export const genAnonKeys = async (): Promise<string> => {
  const ledger = await getLedger();

  try {
    // uncomment for triple masking
    // const anonKeys: AnonKeys = ledger.gen_anon_keys();
    // console.log('🚀 ~ file: tripleMasking.ts ~ line 10 ~ genAnonKeys ~ anonKeys', anonKeys);
    return 'as';
  } catch (err) {
    throw new Error(`could not get anon keys, "${err}" `);
  }
};
