import '@testing-library/jest-dom/extend-expect';

import { restorePrivatekeypair } from './keypair';

const fakeLedger = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  create_keypair_from_secret: () => null,
};

jest.mock('../../services/ledger/ledgerWrapper', () => ({
  getLedger: jest.fn(() => Promise.resolve(fakeLedger)),
}));

describe('keypair', () => {
  describe('restorePrivatekeypair', () => {
    const pkey = 'Y6umoUmBJRPYJU5n_Y9bHuhoHm6aDMsxDI9FLJzOEXc=';
    const password = '345';

    it('throws the error when ledger fails to crate a keypair', async () => {
      await expect(restorePrivatekeypair(pkey, password)).rejects.toThrow(
        'could not restore keypair. Keypair is empty',
      );
    });
  });
});
