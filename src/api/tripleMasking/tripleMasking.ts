import { getLedger } from '../../services/ledger/ledgerWrapper';
import { AnonKeys } from '../../services/ledger/types';

interface FormattedAnonKeys {
  axfrPublicKey: string;
  axfrSecretKey: string;
  decKey: string;
  encKey: string;
}

// we return both, the keys and the instance of the object, as it contains `free` method, which would release the pointer
interface KeysResponse {
  keysInstance: AnonKeys;
  formatted: FormattedAnonKeys;
}

export const genAnonKeys = async (): Promise<KeysResponse> => {
  const ledger = await getLedger();

  try {
    const anonKeys = await ledger.gen_anon_keys();
    console.log('🚀 ~ file: tripleMasking.ts ~ line 10 ~ genAnonKeys ~ anonKeys', anonKeys);

    const axfrPublicKey = anonKeys.axfr_public_key;
    const axfrSecretKey = anonKeys.axfr_secret_key;
    const decKey = anonKeys.dec_key;
    const encKey = anonKeys.enc_key;

    const formattedAnonKeys = {
      axfrPublicKey,
      axfrSecretKey,
      decKey,
      encKey,
    };

    return {
      keysInstance: anonKeys,
      formatted: formattedAnonKeys,
    };
  } catch (err) {
    throw new Error(`could not get anon keys, "${err}" `);
  }
};
