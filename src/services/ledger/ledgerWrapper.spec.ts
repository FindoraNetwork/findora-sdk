import '@testing-library/jest-dom/extend-expect';
import * as NodeLedger from './nodeLedger';
import * as WebLedger from './webLedger';

import * as LedgerWrapper from './ledgerWrapper';

const myWebLedger = ({ foo: 'web' } as unknown) as WebLedger.LedgerForWeb;
const myNodeLedger = ({ foo: 'node' } as unknown) as NodeLedger.LedgerForNode;

describe('ledgerWrapper', () => {
  describe('getWebLedger', () => {
    it('returns a web ledger', async () => {
      const spyGetLedger = jest.spyOn(WebLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myWebLedger);
      });

      const result = await LedgerWrapper.getWebLedger();
      expect(result).toBe(myWebLedger);
      spyGetLedger.mockReset();
    });
  });
  describe('getNodeLedger', () => {
    it('returns a node ledger', async () => {
      const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myNodeLedger);
      });

      const result = await LedgerWrapper.getNodeLedger();
      expect(result).toBe(myNodeLedger);
      spyGetLedger.mockReset();
    });
  });
  describe('getLedger', () => {
    it('returns a web ledger for web env', async () => {
      const spyIsItNodeEnv = jest.spyOn(LedgerWrapper, 'isItNodeEnv').mockImplementation(() => {
        return false;
      });

      const spyGetWebLedger = jest.spyOn(WebLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myWebLedger);
      });

      const spyGetNodeLedger = jest.spyOn(NodeLedger, 'default');

      const result = await LedgerWrapper.getLedger();

      expect(result).toBe(myWebLedger);
      expect(spyGetWebLedger).toBeCalled();
      expect(spyGetNodeLedger).not.toBeCalled();

      spyIsItNodeEnv.mockReset();
      spyGetWebLedger.mockReset();
      spyGetNodeLedger.mockReset();
    });
    it('returns a node ledger for node env', async () => {
      const spyIsItNodeEnv = jest.spyOn(LedgerWrapper, 'isItNodeEnv').mockImplementation(() => {
        return true;
      });

      const spyGetWebLedger = jest.spyOn(WebLedger, 'default');

      const spyGetNodeLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
        return Promise.resolve(myNodeLedger);
      });

      const result = await LedgerWrapper.getLedger();

      expect(result).toBe(myNodeLedger);
      expect(spyGetWebLedger).not.toBeCalled();
      expect(spyGetNodeLedger).toBeCalled();

      spyIsItNodeEnv.mockReset();
      spyGetWebLedger.mockReset();
      spyGetNodeLedger.mockReset();
    });
  });
});
