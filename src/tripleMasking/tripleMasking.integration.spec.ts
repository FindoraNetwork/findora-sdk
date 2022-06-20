import * as Integration from './tripleMasking.integration';

const extendedExecutionTimeout = 180000;

// TODO - hardcode anon keys
const AnonKeys1 = Integration.getAnonKeys();
const AnonKeys2 = Integration.getAnonKeys();
const AnonKeys3 = Integration.getAnonKeys();

describe(`Triple Masking Integration (integration test)`, () => {
  // Setup environment
  // Create test BARs - check balances
  // Setup wallets
  // bar to abar - check balances
  // abar transfer 1 - check balances, nullifiers spent
  // abar transfer 2 - check balances, nullifiers spent (?)
  // abar to bar - check balances

  // multi asset abar transfer - check balances

  describe('Single Asset Integration Test', () => {
    it(
      'Should create test BARs with simple FRA transfer',
      async () => {
        const result = await Integration.createTestBars();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert BAR to ABAR, and verify balances of BAR and ABAR',
      async () => {
        const [result, _commitment] = await Integration.barToAbar(await AnonKeys1);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do anonymous transfer from Sender1 to Receiver1, and verify ABAR balances',
      async () => {
        const [_resultConv, commitment] = await Integration.barToAbar(await AnonKeys1);
        const result = await Integration.abarToAbar(await AnonKeys1, await AnonKeys2, commitment as string);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const [_resultConv, commitment] = await Integration.barToAbar(await AnonKeys1);
        const result = await Integration.abarToBar(await AnonKeys1, commitment as string);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
  });

  /* describe('Multi (Custom) Asset Integration Test', () => {
    it(
      'Should create test BARs with simple creation and transfer of different assets',
      async () => {
        const result = await Integration.createTestBarsMulti();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert BAR to ABAR, and verify balances of BAR and ABAR',
      async () => {
        const [result, _commitment] = await Integration.barToAbarMulti(await AnonKeys1);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do multi asset anonymous transfer from Sender1 to Receiver1, and verify ABAR balances',
      async () => {
        const [_resultConv, commitment] = await Integration.barToAbarMulti(await AnonKeys1);
        const result = await Integration.abarToAbarMulti(await AnonKeys1, await AnonKeys2, commitment);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const [_resultConv, commitment] = await Integration.barToAbarMulti(await AnonKeys1);
        const result = await Integration.abarToBarMulti(await AnonKeys1, commitment);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
  }); */
});
