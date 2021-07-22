import '@testing-library/jest-dom/extend-expect';

import { restoreFromPrivateKey, getMnemonic } from './keypair';

describe('keypair', () => {
  describe('restoreFromPrivateKey', () => {
    const publickey = '1mtO4j3bvRiKlXotdD1q0DQYoxutSgee-f1LQtlq45g=';
    const address = 'fra16e45ac3amw733z540gkhg0t26q6p3gcm449q08hel4959kt2uwvq9svvqh';
    const pkey = 'Y6umoUmBJRPYJU5n_Y9bHuhoHm6aDMsxDI9FLJzOEXc=';
    const password = '345';

    it('restores the keypair', async () => {
      const walletInfo = await restoreFromPrivateKey(pkey, password);

      expect(walletInfo).toHaveProperty('keyStore');
      expect(walletInfo).toHaveProperty('publickey');
      expect(walletInfo).toHaveProperty('address');
      expect(walletInfo).toHaveProperty('keypair');
      expect(walletInfo).toHaveProperty('privateStr');

      expect(walletInfo.publickey).toEqual(publickey);
      expect(walletInfo.address).toEqual(address);
      expect(walletInfo.keypair).toHaveProperty('ptr');
      expect(walletInfo.keyStore).toHaveLength(188);
    });

    it('throws the error when bad private key is used', async () => {
      await expect(restoreFromPrivateKey('123', password)).rejects.toThrow(
        'could not restore keypair. Keypair is empty',
      );
    });
  });

  describe('getMnemonic', () => {
    it('creates a mnemonic of a desired length using default lang ', async () => {
      const result = await getMnemonic(24);
      expect(result.length).toEqual(24);
    });

    it('throws an error if an unsupported lang is submitted', async () => {
      await expect(getMnemonic(24, 'FOO')).rejects.toThrowError(
        'could not generate custom mnemonic. Details are',
      );
    });
  });
});
