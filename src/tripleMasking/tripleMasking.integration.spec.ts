import { waitForBlockChange } from '../evm/testHelpers';
import * as Integration from './tripleMasking.integration';

const extendedExecutionTimeout = 540000;

afterAll(async (done: any) => {
  console.log('after all - just waiting for 3 blocks to have all pending requests finished (if any)');
  await waitForBlockChange(2);
  done();
}, extendedExecutionTimeout);

describe(`Triple Masking Integration (integration test)`, () => {
  // describe('Single Asset Integration Test (BAR to BAR)', () => {
  //   it(
  //     'Should create test BARs with simple FRA transfer',
  //     async () => {
  //       expect(1).toBe(1);
  //     },
  //     extendedExecutionTimeout,
  //   );
  // });
  describe('Single Asset Integration Test (BAR to BAR)', () => {
    it(
      'Should create test BARs with simple FRA transfer',
      async () => {
        const result = await Integration.createTestBars();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
  });
  describe('BAR to ABAR transfer', () => {
    it(
      'Should convert BAR to ABAR (single sid), and verify balances of BAR and ABAR',
      async () => {
        const result = await Integration.barToAbar();
        expect(!!result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should send exact amount of FRA from BAR to ABAR, and verify balances of BAR and ABAR',
      async () => {
        const result = await Integration.barToAbarAmount();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
  });
  describe('ABAR to ABAR transfer', () => {
    it(
      'Should do anonymous transfer using only FRA and verify ABAR and BAR balances',
      async () => {
        const result = await Integration.abarToAbar();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should do multi asset anonymous transfer, and verify ABAR and BAR balances',
      async () => {
        const result = await Integration.abarToAbarMulti();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should send exact amount of FRA asset from ABAR to ABAR, and verify both ABAR balances',
      async () => {
        const result = await Integration.abarToAbarFraMultipleFraAtxoForFeeSendAmount();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should send exact amount of custom asset from ABAR to ABAR, and verify both ABAR balances',
      async () => {
        const result = await Integration.abarToAbarCustomMultipleFraAtxoForFeeSendAmount();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
  });
  describe('ABAR to BAR transfer', () => {
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const result = await Integration.abarToBar();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert ABAR to BAR having amount and asset types hidden, and verify balances of ABAR and BAR',
      async () => {
        const result = await Integration.abarToBarWithHiddenAmountAndType();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should send exact amount of custom asset from ABAR to BAR, and verify ABAR and BAR balances',
      async () => {
        const result = await Integration.abarToBarCustomSendAmount();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should send exact amount of FRA asset from ABAR to BAR, and verify ABAR and BAR balances',
      async () => {
        const result = await Integration.abarToBarFraSendAmount();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
  });
});
