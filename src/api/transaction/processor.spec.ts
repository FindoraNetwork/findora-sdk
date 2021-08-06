import '@testing-library/jest-dom/extend-expect';

import _get from 'lodash/get';

import { TxInfo } from '../network/types';
import * as helpers from './helpers';
import * as OperationProcessors from './operationProcessors';
import * as Types from './types';
import * as Processor from './processor';

describe('processor', () => {
  const myTime = 'foo';
  const hash = 'barfoo';
  const code = 'foobar';

  const processedDataByProcessor = ({ barfoo: 'foobar' } as unknown) as OperationProcessors.ProcessedTx;

  const dataProcessor = async () => {
    return processedDataByProcessor;
  };

  const operationsList = ([{ a: '1' }] as unknown) as Types.TxOperation[];

  const txItem = ({
    foo: 'bar',
    tx: 'eyJ0eEZvbyI6InR4QmFyIn0=',
    hash,
    tx_result: {
      code,
    },
  } as unknown) as TxInfo;

  describe('processTxInfoItem', () => {
    it('properly processes a given txItem aaaa', async () => {
      const spyGetBlockTime = jest.spyOn(helpers, 'getBlockTime').mockImplementation(() => {
        return Promise.resolve(myTime);
      });

      const spyGetTxOperationsList = jest
        .spyOn(helpers, 'getTxOperationsList')
        .mockImplementation((_: Types.ParsedTx) => {
          return operationsList as Types.TxOperation[];
        });

      const spyGetOperationProcessor = jest
        .spyOn(OperationProcessors, 'getOperationProcessor')
        .mockImplementation(() => {
          return dataProcessor;
        });

      const processedData = await Processor.processTxInfoItem(txItem);

      expect(processedData).toHaveProperty('code');
      expect(processedData).toHaveProperty('data');
      expect(processedData).toHaveProperty('hash');
      expect(processedData).toHaveProperty('time');

      expect(processedData.code).toEqual(code);
      expect(processedData.hash).toEqual(hash);
      expect(processedData.time).toEqual(myTime);
      expect(processedData.data).toHaveLength(1);
      expect(processedData.data).toEqual([{ ...processedDataByProcessor, ...txItem }]);

      spyGetBlockTime.mockReset();
      spyGetTxOperationsList.mockReset();
      spyGetOperationProcessor.mockReset();
    });

    it('throws an error if tx in the txItem can not be parsed', async () => {
      const txItem = ({
        foo: 'bar',
        tx: 'blah',
        hash,
        tx_result: {
          code,
        },
      } as unknown) as TxInfo;

      await expect(Processor.processTxInfoItem(txItem)).rejects.toThrowError(
        'Can not parse the tx info from the tx item',
      );
    });
  });

  describe('processeTxInfoList', () => {
    it('properly processes a given txItem aaaa', async () => {
      const spyGetBlockTime = jest.spyOn(helpers, 'getBlockTime').mockImplementation(() => {
        return Promise.resolve(myTime);
      });

      const spyGetTxOperationsList = jest
        .spyOn(helpers, 'getTxOperationsList')
        .mockImplementation((_: Types.ParsedTx) => {
          return operationsList as Types.TxOperation[];
        });

      const spyGetOperationProcessor = jest
        .spyOn(OperationProcessors, 'getOperationProcessor')
        .mockImplementation(() => {
          return dataProcessor;
        });

      const processedDataList = await Processor.processeTxInfoList([txItem]);

      expect(processedDataList).toHaveLength(1);

      const [processedData] = processedDataList;

      expect(processedData).toHaveProperty('code');
      expect(processedData).toHaveProperty('data');
      expect(processedData).toHaveProperty('hash');
      expect(processedData).toHaveProperty('time');

      expect(processedData.code).toEqual(code);
      expect(processedData.hash).toEqual(hash);
      expect(processedData.time).toEqual(myTime);
      expect(processedData.data).toHaveLength(1);
      expect(processedData.data).toEqual([{ ...processedDataByProcessor, ...txItem }]);

      spyGetBlockTime.mockReset();
      spyGetTxOperationsList.mockReset();
      spyGetOperationProcessor.mockReset();
    });
  });
});
