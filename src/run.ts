// import Ledger from 'findora-wallet-wasm/nodejs/wasm.js';

// import { Random } from './random';
// import { uint8arrayToHexStr } from './services/utils';
import ledgerWrapper from './services/ledger/ledgerWrapper';

// const ourData = Random.getBytes(12);

// console.log('our data is:', ourData);

// const ourString = uint8arrayToHexStr(ourData);

// console.log('string form this data is', ourString);

const myMain = async () => {
  const ledger = await ledgerWrapper.getLedger('nodeLedger');
  const assetCode = ledger.fra_get_asset_code();

  console.log('FRA assetCode', assetCode);
};

myMain();
