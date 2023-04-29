import '@testing-library/jest-dom/extend-expect';

import { XfrKeyPair, XfrPublicKey } from '../../services/ledger/types';
import {
  createKeypair,
  getAddress,
  getAddressByPublicKey,
  getAddressPublicAndKey,
  getMnemonic,
  getPrivateKeyStr,
  getPublicKeyByXfr,
  getPublicKeyStr,
  getXfrPublicKeyByBase64,
  restoreFromPrivateKey,
} from './keypair';

describe('keypair (unit test)', () => {
  describe('restoreFromPrivateKey', () => {
    const publickey = 'ANZrTuI9270YipV6LXQ9atA0GKMbrUoHnvn9S0LZauOYAA==';
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
      expect(walletInfo.keyStore).toHaveLength(194);
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

  describe('getPrivateKeyStr', () => {
    it('creates a private key string from a given XfrKeyPair', async () => {
      const kp = await createKeypair('123');
      const result = await getPrivateKeyStr(kp.keypair);
      expect(result.length).toEqual(44);
      // expect(result.split('').pop()).toEqual('=');
    });

    it('throws an error if not an instance of XfrKeyPair given', async () => {
      await expect(getPrivateKeyStr('FOO' as unknown as XfrKeyPair)).rejects.toThrowError(
        'could not get priv key string',
      );
    });
  });

  describe('getPublicKeyStr', () => {
    it('creates a public key string from a given XfrKeyPair', async () => {
      const kp = await createKeypair('123');
      const result = await getPublicKeyStr(kp.keypair);
      expect(result.length).toEqual(48);
      expect(result.split('').pop()).toEqual('=');
    });

    it('throws an error if not an instance of XfrKeyPair given', async () => {
      await expect(getPublicKeyStr('FOO' as unknown as XfrKeyPair)).rejects.toThrowError(
        'could not get pub key string',
      );
    });
  });

  describe('getAddress', () => {
    it('creates an address string from a given XfrKeyPair', async () => {
      const kp = await createKeypair('123');
      const result = await getAddress(kp.keypair);

      expect(result.length).toEqual(63);
      expect(result.split('').slice(0, 3).join('')).toEqual('eth');
    });

    it('throws an error if not an instance of XfrKeyPair given', async () => {
      await expect(getAddress('FOO' as unknown as XfrKeyPair)).rejects.toThrowError(
        'could not get address string',
      );
    });
  });

  describe('getAddressByPublicKey', () => {
    it('creates an address from a given public key string', async () => {
      const kp = await createKeypair('123');
      const result = await getAddressByPublicKey(kp.publickey);

      expect(result).toEqual(kp.address);
      expect(result.length).toEqual(63);
      expect(result.split('').slice(0, 3).join('')).toEqual('eth');
    });

    it('throws an error if not a valid public key is given', async () => {
      await expect(getAddressByPublicKey('aa')).rejects.toThrowError('could not get address by public key');
    });
  });

  describe('getAddressPublicAndKey', () => {
    it('creates an instance of a LightWalletKeypair using a given address', async () => {
      const kp = await createKeypair('123');
      const result = await getAddressPublicAndKey(kp.address);

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('publickey');
      expect(result.address).toEqual(kp.address);
      expect(result.publickey).toEqual(kp.publickey);
    });

    it('throws an error if not a valid address key is given', async () => {
      await expect(getAddressPublicAndKey('aa')).rejects.toThrowError(
        'could not create a LightWalletKeypair',
      );
    });
  });

  describe('getAddressPublicAndKey', () => {
    it('creates an instance of a WalletKeypar', async () => {
      const result = await createKeypair('123');

      expect(result).toHaveProperty('keyStore');
      expect(result).toHaveProperty('publickey');
      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('keypair');
      expect(result).toHaveProperty('privateStr');
      expect(result.publickey.length).toEqual(48);
      expect(result.address.length).toEqual(63);
      expect(result.privateStr!.length).toEqual(44);
      expect(result.keyStore.length).toEqual(194);
    });

    it('throws an error if not a valid address key is given', async () => {
      await expect(createKeypair([123] as unknown as string)).rejects.toThrowError(
        'could not create a WalletKeypar',
      );
    });
  });

  describe('getXfrPublicKeyByBase64', () => {
    it('throws an error if not a valid public key is given', async () => {
      await expect(getXfrPublicKeyByBase64('aa')).rejects.toThrowError(
        `could not get xfr public key by base64, "`,
      );
    });

    it('get XfrPublicKey by base64', async () => {
      const kp = await createKeypair('123');
      const result = await getXfrPublicKeyByBase64(kp.publickey);
      expect(result).toHaveProperty('free');
      expect(typeof result.free).toBe('function');
    });
  });

  describe('getPublicKeyByXfr', () => {
    it('throws an error if not a valid public key is given', async () => {
      const toPublickey = 'mockedToPublickey' as unknown as XfrPublicKey;
      await expect(getPublicKeyByXfr(toPublickey)).rejects.toThrowError(
        `could not get base64 public key by xfr, "`,
      );
    });

    it('get publicKey by xfr', async () => {
      const kp = await createKeypair('123');
      const toPublickey = await getXfrPublicKeyByBase64(kp.publickey);
      const result = await getPublicKeyByXfr(toPublickey);
      expect(typeof result).toBe('string');
    });
  });
});
