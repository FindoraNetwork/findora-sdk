import '@testing-library/jest-dom/extend-expect';

import { getLedger } from '../services/ledger/ledgerWrapper';
import dotenv from 'dotenv';
import * as Keypair from '../api/keypair';
import * as Network from '../api/network/network';

dotenv.config();

const oldFraFaucetMnemonic =
  'zoo nerve assault talk depend approve mercy surge bicycle ridge dismiss satoshi boring opera next fat cinnamon valley office actor above spray alcohol giant';
const oldFraFaucetPkey = 'o9gXFI5ft1VOkzYhvFpgUTWVoskM1CEih0zJcm3-EAQ=';

const oldPkey = oldFraFaucetPkey;

const metaMaskMnemonic =
  'athlete butter ritual danger method indicate pigeon address turn census axis category';
const metaMaskPrivateKey = '0x412444d271c291e4a30600ad796262d291b5b05d117a3e4172635199496fd1af';

const mnemonic = metaMaskMnemonic;
const privateKey = metaMaskPrivateKey;

const extendedExecutionTimeout = 600000;
const password = '123';

describe(`Private Keys (wasm test)`, () => {
  describe('create wallet', () => {
    it(
      `Can create a wallet info from a 12 words mnemonic`,
      async () => {
        const isFra = false;

        const mm = await Keypair.getMnemonic(12);

        const faucetWalletInfo = await Keypair.restoreFromMnemonic(mm, password, isFra);
        const { address } = faucetWalletInfo;

        const affix = address.substr(0, 3);

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
    it(
      `Can create a wallet info from a 24 words mnemonic`,
      async () => {
        const isFra = false;

        const mm = await Keypair.getMnemonic(24);

        const faucetWalletInfo = await Keypair.restoreFromMnemonic(mm, password, isFra);
        const { address } = faucetWalletInfo;

        const affix = address.substr(0, 3);

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
  });
  describe('import wallet', () => {
    it(
      `Can restore a wallet info from a 0x mnemonic (12 words) - "${mnemonic}"`,
      async () => {
        const isFra = false;

        const faucetWalletInfo = await Keypair.restoreFromMnemonic(mnemonic.split(' '), password, isFra);
        const { address } = faucetWalletInfo;

        const affix = address.substr(0, 3);

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
    it(
      `Can restore a wallet info from a metamask pKey - "${privateKey}"`,
      async () => {
        let affix = 'NOT_KNOWN';

        try {
          const faucetWalletInfo = await Keypair.restoreFromPrivateKey(privateKey, password);

          const { address } = faucetWalletInfo;

          affix = address.substr(0, 3);
        } catch (err) {
          affix = 'COULD_NOT_GET';
          const details = 'a';
          console.log(
            `We got an error while trying to restore a wallet info object from a metamask privateKey - "${privateKey}", details:`,
            err,
          );
        }

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
    it(
      `Can restore a wallet info from an old FRA mnemonic - "${oldFraFaucetMnemonic}"`,
      async () => {
        let subject = 'NOT_KNOWN';

        const isFra = true;

        try {
          const faucetWalletInfo = await Keypair.restoreFromMnemonic(
            oldFraFaucetMnemonic.split(' '),
            password,
            isFra,
          );

          const { address } = faucetWalletInfo;

          subject = address;
        } catch (err) {
          subject = 'COULD_NOT_GET';
          console.log(
            `We got an error while trying to restore a wallet info object from a metamask privateKey - "${privateKey}", details:`,
            err,
          );
        }

        expect(subject).toEqual('fra1rkvlrs8j8y7rlud9qh6ndg5nr4ag7ar4640dr8h0ys6zfrwv25as42zptu');
      },
      extendedExecutionTimeout,
    );
    it(
      `Can restore a wallet info from an old FRA pKey - "${oldPkey}"`,
      async () => {
        let affix = 'NOT_KNOWN';
        try {
          const faucetWalletInfo = await Keypair.restoreFromPrivateKey(oldPkey, password);

          const { address } = faucetWalletInfo;

          affix = address.substr(0, 3);
        } catch (err) {
          affix = 'COULD_NOT_GET';
          console.log(
            `We got an error while trying to restore a wallet info object from a metamask privateKey - "${privateKey}", details:`,
            err,
          );
        }

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
    it(
      `Can restore a wallet info from a keystore`,
      async () => {
        let affix = 'NOT_KNOWN';
        const keystoreFile = `../../ddd.findorawallet.json`;

        const keystoreConfig = require(keystoreFile);
        const { encryptedKey: encryptedKeyObject } = keystoreConfig;
        const encryptedKeyBytes = Uint8Array.from(Object.values(encryptedKeyObject));

        try {
          const faucetWalletInfo = await Keypair.restoreFromKeystore(encryptedKeyBytes, password);

          const { publickey, address } = faucetWalletInfo;
        } catch (err) {
          affix = 'COULD_NOT_GET';
          console.log(`We got an error while trying to restore a wallet from a keystore`, err);
        }

        expect(affix).toEqual('eth');
      },
      extendedExecutionTimeout,
    );
  });
  describe('0x wasm methods ', () => {
    it(
      `Can have 0x address from public key - "${oldFraFaucetMnemonic}"`,
      async () => {
        let subject = 'NOT_KNOWN';

        const ledger = await getLedger();
        const isFra = true;

        try {
          const faucetWalletInfo = await Keypair.restoreFromMnemonic(
            oldFraFaucetMnemonic.split(' '),
            password,
            isFra,
          );

          const { address } = faucetWalletInfo;

          const xfrPublickey = await Keypair.getXfrPublicKeyByBase64(publicKey);
          const humanAddress = ledger.public_key_to_human(xfrPublickey);

          subject = humanAddress.substr(0, 2);
        } catch (err) {
          subject = 'COULD_NOT_GET';
          console.log(`We got an error while trying to convert base64pkey to 0x format`, err);
        }

        expect(subject).toEqual('0x');
      },
      extendedExecutionTimeout,
    );
  });
});
