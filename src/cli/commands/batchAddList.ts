import neatCsv from 'neat-csv';
import sleep from 'sleep-promise';
import Sdk from '../../Sdk';
import { Keypair } from '../../api';
import { log, now, readFile, writeFile, getRandomNumber, delay } from '../../services/utils';
import { addList } from '../../services/brc20';

const defaultFileName = 'fileAddList.csv';
const resultFileLogName = `batchAddListLog`;

interface ProcessedRecordInfo {
  txHash: string;
  dataItem: DataRecord;
}

interface DataRecord {
  tick: string;
  totalFraPrice: number;
  amt: number;
  rndSecMin: number;
  rndSecMax: number;
}

type ErrorsInfo = string[];

const isCsvValid = (listOfRecords: neatCsv.Row[]) => {
  for (let i = 0; i < listOfRecords.length; i += 1) {
    const currentRecord = listOfRecords[i];

    const isTickPresented = Object.keys(currentRecord).includes('tick');
    const isPricePresented = Object.keys(currentRecord).includes('totalFraPrice');
    const isAmountPresented = Object.keys(currentRecord).includes('amt');
    const isMinPresented = Object.keys(currentRecord).includes('rndSecMin');
    const isMaxPresented = Object.keys(currentRecord).includes('rndSecMax');

    if (!isTickPresented || !isAmountPresented || !isPricePresented || !isMinPresented || !isMaxPresented) {
      throw Error(
        `ERROR - The data row must have "tick", "amt", "totalFraPrice", "rndSecMin" and "rndSecMax" fields ${JSON.stringify(
          currentRecord,
        )} `,
      );
    }
  }

  return true;
};

const getRecordsList = (parsedListOfRecords: neatCsv.Row[]): DataRecord[] => {
  const recordsList = parsedListOfRecords.map(currentRecord => {
    const { tick, totalFraPrice, amt, rndSecMin, rndSecMax } = currentRecord;

    return {
      tick: tick.trim().toLowerCase(),
      totalFraPrice: +totalFraPrice.trim().replace(',', ''),
      amt: +amt.trim().replace(',', ''),
      rndSecMin: +rndSecMin.trim().replace(',', ''),
      rndSecMax: +rndSecMax.trim().replace(',', ''),
    };
  });

  return recordsList;
};

const writeDistributionLog = async (sendInfo: ProcessedRecordInfo[], errorsInfo: ErrorsInfo) => {
  const dateStamp = now();

  const resultFilePath = `${resultFileLogName}_${dateStamp}.txt`;

  try {
    await writeFile(
      resultFilePath,
      JSON.stringify(
        {
          date: dateStamp,
          sendInfo,
          errorsInfo,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    throw new Error(`can not write result log for "${resultFilePath}", "${(error as Error).message}"`);
  }
};

export const runBatchAddList = async (filePath: string, fromPk: string) => {
  let data;
  let parsedListOfRecords;

  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${defaultFileName}" `);
  }

  try {
    parsedListOfRecords = await neatCsv(data);
  } catch (error) {
    throw Error(`Could not parse file "${defaultFileName}" `);
  }

  const password = '123';

  const {
    brc20url: hostUrl,
    // brc20port: queryPort
  } = Sdk.environment;

  if (!hostUrl) {
    throw Error(`brc20url must be set for Sdk initialization`);
  }

  const walletFrom = await Keypair.restoreFromPrivateKey(fromPk, password);

  const processedInfo = [];
  const errorsInfo = [];

  try {
    isCsvValid(parsedListOfRecords);
  } catch (err) {
    throw new Error(`ERROR: CSV is not valid. Details: ${(err as Error).message}`);
  }

  const recordsList = getRecordsList(parsedListOfRecords);

  let i = 1;

  for (let currentRecord of recordsList) {
    try {
      log(`${i}: Processing data row # ${i}`);
      const { tick, totalFraPrice, amt, rndSecMin, rndSecMax } = currentRecord;
      const waitTimeInMSec = getRandomNumber(rndSecMin * 1000, rndSecMax * 1000);

      const { txHash, confirmResult } = await addList(
        tick,
        `${totalFraPrice}`,
        `${amt}`,
        hostUrl,
        walletFrom,
      );

      log(`${i}: Tx hash is "${txHash}"`);

      if (!confirmResult) {
        const rowData = JSON.stringify(currentRecord);

        const errorMessage = `${i}: !! ERROR!! - potential error while processing data "${rowData}". Error: - confirmResult is false.`;
        errorsInfo.push(errorMessage);
        log(errorMessage);
      }

      if (!txHash) {
        const rowData = JSON.stringify(currentRecord);

        const errorMessage = `${i}: !! ERROR!! - potential error while processing data "${rowData}". Error: - txHash is empty.`;
        errorsInfo.push(errorMessage);
        log(errorMessage);
      }

      processedInfo.push({
        txHash,
        dataItem: { ...currentRecord },
        chosenRandomWaitingTimeSec: `${(waitTimeInMSec / 1000).toFixed(1)}`,
      });

      log(
        `${i}: Waiting for randomly chosen ${
          waitTimeInMSec / 1000
        }s (given range is ${rndSecMin} - ${rndSecMax}) before processing next record`,
      );
      await sleep(waitTimeInMSec);
    } catch (error) {
      const rowData = JSON.stringify(currentRecord);

      const errorMessage = `${i}: !! ERROR!! - could not process data from this row "${rowData}". Error: - ${
        (error as Error).message
      }`;

      errorsInfo.push(errorMessage);
      log(errorMessage);
    }

    i += 1;
  }

  await writeDistributionLog(processedInfo, errorsInfo);

  log(`Command Log `, JSON.stringify(processedInfo, null, 2));
  log(`Command Errors Log `, JSON.stringify(errorsInfo, null, 2));
};
