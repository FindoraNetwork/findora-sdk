import * as Integration from './tripleMasking.integration';

const extendedExecutionTimeout = 180000;

/*
const AnonKeys1 = Integration.getAnonKeys();
const AnonKeys2 = Integration.getAnonKeys();
const AnonKeys3 = Integration.getAnonKeys();
*/

const AnonKeys1 = {
  axfrPublicKey: 'oDosEZB9uq4joxcM6xE993XHdSwBs90z2DEzg7QzSus=',
  axfrSecretKey: 'Gsppgb5TA__Lsry9TMe9hBZdn_VOU4FS1oCaHrdLHQCgOiwRkH26riOjFwzrET33dcd1LAGz3TPYMTODtDNK6w==',
  decKey: 'oAOZEUWKbgjv8OVtlL5PJYrNnV1KDtW3PCyZc30SW0Y=',
  encKey: 'eT39SV2et8ONJsN0kCEPJkNQys89UlFUsdPpY2x5qR8=',
};

const AnonKeys2 = {
  axfrPublicKey: '5kJ1D8ZGmaHbyv4Yfn3q94oYAgV8km5dkiBHWPMU2b8=',
  axfrSecretKey: 'VDj-QNt0UEilrJsXa69HduAnfsXpZqYabXC_ozqiCwTmQnUPxkaZodvK_hh-fer3ihgCBXySbl2SIEdY8xTZvw==',
  decKey: 'KLzfPV-ft7m114DsUBt_ZblsdbCFqhIzkTWd9rZBN3w=',
  encKey: 'k9L1_NnjjZu6jpkKZXrmsRi2Vta0LuLGsk2y4Hk0akI=',
};

const AnonKeys3 = {
  axfrPublicKey: 'UB5DrTlZr2O4dO5ipY28A8LXGe1f4Ek-02VoI_KcHfA=',
  axfrSecretKey: '35lTZXcgMJdrsFeLkhfWQFM4mGTY2-K0scHcvxwEEQdQHkOtOVmvY7h07mKljbwDwtcZ7V_gST7TZWgj8pwd8A==',
  decKey: '8Fuq0EdUlv9IwULCuU5eao9SzkVGEe8rWPoDIuJiEVw=',
  encKey: 'cWQG_4BMhKZ_hmsnfY4JyHDWCT4pF6OMz4sHlkzEzG8=',
};

describe(`Triple Masking Integration (integration test)`, () => {
  describe('Single Asset Integration Test', () => {
    it(
      'Should create test BARs with simple FRA transfer',
      async () => {
        const result = await Integration.createTestBars();
        expect(result).toBe(true);
      },
      extendedExecutionTimeout * 2,
    );
    it(
      'Should convert BAR to ABAR, and verify balances of BAR and ABAR',
      async () => {
        const result = (await Integration.barToAbar(AnonKeys1, true)) as boolean;
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should do anonymous transfer from Sender1 to Receiver1, and verify ABAR balances',
      async () => {
        const result = await Integration.abarToAbar(AnonKeys1, AnonKeys2);
        expect(result).toBe(true);
      },
      extendedExecutionTimeout,
    );
    it(
      'Should convert ABAR to BAR, and verify balances of ABAR and BAR',
      async () => {
        const result = await Integration.abarToBar(AnonKeys1);
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
