import * as Integration from './tripleMasking.integration';

const extendedExecutionTimeout = 180000;

let anonKeys1: FindoraWallet.FormattedAnonKeys;
let anonKeys2: FindoraWallet.FormattedAnonKeys;
let anonKeys3: FindoraWallet.FormattedAnonKeys;

let senderOne = '';
let asset1Code = '';
let derivedAsset1Code = '';

beforeAll(async (done: any) => {
  const walletInfo = await Integration.createNewKeypair();
  anonKeys1 = await Integration.getAnonKeys();
  anonKeys2 = await Integration.getAnonKeys();
  anonKeys3 = await Integration.getAnonKeys();

  senderOne = walletInfo.privateStr!;

  asset1Code = await Integration.getRandomAssetCode();
  derivedAsset1Code = await Integration.getDerivedAssetCode(asset1Code);

  done();
}, extendedExecutionTimeout);

describe(`Triple Masking Integration (integration test)`, () => {
  describe('Single Asset Integration Test', () => {
    it(
      'Should create test BARs with simple FRA transfer',
      async () => {
        const result = await Integration.createTestBars(senderOne);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert BAR to ABAR, and verify balances of BAR and ABAR',
      async () => {
        const result = (await Integration.barToAbar(senderOne, anonKeys1, true)) as boolean;
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do anonymous transfer from Sender to Receiver, and verify ABAR balances',
      async () => {
        const result = await Integration.abarToAbar(senderOne, anonKeys1, anonKeys2);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const result = await Integration.abarToBar(senderOne, anonKeys1);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
  });

  describe('Multi (Custom) Asset Integration Test', () => {
    it(
      'Should create test BARs with simple creation and transfer of different assets',
      async () => {
        const result = await Integration.createTestBarsMulti(senderOne, asset1Code, derivedAsset1Code);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do multi asset anonymous transfer, and verify ABAR balances',
      async () => {
        const result = await Integration.abarToAbarMulti(senderOne, anonKeys2, anonKeys3, derivedAsset1Code);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    // it(
    //   'Should convert BAR to ABAR, and verify balances of BAR and ABAR',
    //   async () => {
    //     const result = (await Integration.barToAbarMulti(anonKeys3, true)) as boolean;
    //     expect(result).toBe(true);
    //   },
    //   extendedExecutionTimeout,
    // );
    // it(
    //   'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
    //   async () => {
    //       const result = await Integration.abarToBarMulti(anonKeys3);
    //       expect(result).toBe(true);
    //   },
    //   extendedExecutionTimeout,
    // );
  });
});
