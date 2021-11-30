import * as Integration from './integration';

const extendedExecutionTimeout = 180000;

describe(`Findora SDK integration (integration test)`, () => {
  describe('Custom Assets', () => {
    it(
      'Should create a simple transaction to define an asset',
      async () => {
        const result = await Integration.defineAssetTransaction();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should define an asset and submit to the network',
      async () => {
        const result = await Integration.defineAssetTransactionSubmit();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should define and issue an asset, with submitting transactions to the network',
      async () => {
        const result = await Integration.defineAndIssueAssetTransactionSubmit();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
  });
  describe('Transfer tokens', () => {
    it(
      'Should send FRA to the reciever',
      async () => {
        const result = await Integration.sendFraTransactionSubmit();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should send FRA to multiple recievers',
      async () => {
        const result = await Integration.sendFraToMultipleReceiversTransactionSubmit();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should define, issue and send asset with transactions submitting',
      async () => {
        const result = await Integration.defineIssueAndSendAssetTransactionSubmit();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 3,
    );
  });
  describe('Confidentiality', () => {
    it(
      'Should issue and send confidential asset',
      async () => {
        const result = await Integration.issueAndSendConfidentialAsset();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 4,
    );
  });
  describe('Account', () => {
    it('Should get balance for the account', async () => {
      const result = await Integration.getBalance();
      expect(result).toBe(true);
    }, 5000);
  });
  // describe('Staking', () => {
  //   it(
  //     'Should get delegate tokens and see some rewards',
  //     async () => {
  //       const result = await Integration.delegateFraTransactionSubmit();
  //       expect(result).toBe(true);
  //     },
  //     extendedExecutionTimeout * 13,
  //   );
  //   it(
  //     'Should get delegate tokens and claim the rewards',
  //     async () => {
  //       const result = await Integration.delegateFraTransactionAndClaimRewards();
  //       expect(result).toBe(true);
  //     },
  //     extendedExecutionTimeout * 25,
  //   );
  // });
});
