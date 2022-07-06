import * as Integration from './tripleMasking.integration';

const extendedExecutionTimeout = 180000;

/*
const anonKeys1 = Integration.getAnonKeys();
const anonKeys2 = Integration.getAnonKeys();
const anonKeys3 = Integration.getAnonKeys();
*/

const anonKeys1 = {
  axfrPublicKey: 'oDosEZB9uq4joxcM6xE993XHdSwBs90z2DEzg7QzSus=',
  axfrSpendKey: 'Gsppgb5TA__Lsry9TMe9hBZdn_VOU4FS1oCaHrdLHQCgOiwRkH26riOjFwzrET33dcd1LAGz3TPYMTODtDNK6w==',
  axfrViewKey: '',
};

const anonKeys2 = {
  axfrPublicKey: '5kJ1D8ZGmaHbyv4Yfn3q94oYAgV8km5dkiBHWPMU2b8=',
  axfrSpendKey: 'VDj-QNt0UEilrJsXa69HduAnfsXpZqYabXC_ozqiCwTmQnUPxkaZodvK_hh-fer3ihgCBXySbl2SIEdY8xTZvw==',
  axfrViewKey: '',
};

const anonKeys3 = {
  axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
  axfrSpendKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
  axfrViewKey: '',
};

describe(`Triple Masking Integration (integration test)`, () => {
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
        const result = (await Integration.barToAbar(anonKeys1, true)) as boolean;
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do anonymous transfer from Sender to Receiver, and verify ABAR balances',
      async () => {
        const result = await Integration.abarToAbar(anonKeys1, anonKeys2);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const result = await Integration.abarToBar(anonKeys1);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
  });

  describe('Multi (Custom) Asset Integration Test', () => {
    it(
      'Should create test BARs with simple creation and transfer of different assets',
      async () => {
        const result = await Integration.createTestBarsMulti();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do multi asset anonymous transfer, and verify ABAR balances',
      async () => {
        const result = await Integration.abarToAbarMulti(anonKeys2, anonKeys3);
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
