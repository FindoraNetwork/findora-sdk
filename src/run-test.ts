import { Evm } from './api';
import { getLedger } from './services/ledger/ledgerWrapper';

async function main() {
  const ledger = await getLedger();
  const assetTypeString = ledger.asset_type_from_jsvalue([
    112, 14, 143, 78, 152, 149, 249, 82, 105, 240, 119, 5, 5, 73, 83, 83, 93, 159, 147, 30, 62, 17, 49, 119,
    21, 220, 171, 170, 35, 235, 103, 199,
  ]);
  console.log(assetTypeString);
  // cA6PTpiV-VJp8HcFBUlTU12fkx4-ETF3FdyrqiPrZ8c=
}

// main();

// w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=
// const hashAddress = Evm.fraAddressToHashAddress('w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=');

// let hashAddress = `0x${Buffer.from('w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=', 'base64').toString(
//   'hex',
// )}`;

// w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=
// 0xc3aba3852fe7804dd95b2d9cf51070be374759b2e95841056cd2d8fd802088e4  公钥地址

// 0xdd518d4285b1b4016186E61358b5Df139A2470c0 =》 cA6PTpiV-VJp8HcFBUlTU12fkx4-ETF3FdyrqiPrZ8c=

// console.log(hashAddress);
Evm.hashAddressTofraAddress('0xdd518d4285b1b4016186E61358b5Df139A2470c0').then(result => {
  console.log('fra nft', result);
});

Evm.hashAddressTofraAddressByNFT('0xdd518d4285b1b4016186E61358b5Df139A2470c0', '0').then(result => {
  console.log('fra nft', result);
});
