import neatCsv from 'neat-csv';
import sleep from 'sleep-promise';
import Sdk from '../../Sdk';
import { Keypair } from '../../api';
import { log, now, readFile, writeFile, getRandomNumber, delay } from '../../services/utils';
import { addList } from '../../services/brc20';

const resultFileLogName = `batchAddListLog`;

interface ProcessedRecordInfo {
  txHash: string;
  dataItem: DataRecord;
}

interface DataRecord {
  pKey: string;
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

    const isPkPresented = Object.keys(currentRecord).includes('pKey');
    const isTickPresented = Object.keys(currentRecord).includes('tick');
    const isPricePresented = Object.keys(currentRecord).includes('totalFraPrice');
    const isAmountPresented = Object.keys(currentRecord).includes('amt');
    const isMinPresented = Object.keys(currentRecord).includes('rndSecMin');
    const isMaxPresented = Object.keys(currentRecord).includes('rndSecMax');

    if (
      !isPkPresented ||
      !isTickPresented ||
      !isAmountPresented ||
      !isPricePresented ||
      !isMinPresented ||
      !isMaxPresented
    ) {
      throw Error(
        `ERROR - The data row must have "pKey", "tick", "amt", "totalFraPrice", "rndSecMin" and "rndSecMax" fields ${JSON.stringify(
          currentRecord,
        )} `,
      );
    }
  }

  return true;
};

const getRecordsList = (parsedListOfRecords: neatCsv.Row[]): DataRecord[] => {
  const recordsList = parsedListOfRecords.map(currentRecord => {
    const { pKey, tick, totalFraPrice, amt, rndSecMin, rndSecMax } = currentRecord;

    return {
      pKey: pKey.trim(),
      tick: tick.trim().toLowerCase(),
      totalFraPrice: +totalFraPrice.trim().replace(/,/g, ''),
      amt: +amt.trim().replace(/,/g, ''),
      rndSecMin: +rndSecMin.trim().replace(/,/g, ''),
      rndSecMax: +rndSecMax.trim().replace(/,/g, ''),
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

export const runBatchAddList = async (
  filePath: string,
  repeatTimes: number,
  waitBetweenRepeatMinutes: number,
) => {
  let data;
  let parsedListOfRecords;

  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${filePath}" `);
  }

  try {
    parsedListOfRecords = await neatCsv(data);
  } catch (error) {
    throw Error(`Could not parse file "${filePath}" `);
  }

  const { brc20url: hostUrl } = Sdk.environment;

  if (!hostUrl) {
    throw Error(`brc20url must be set for Sdk initialization`);
  }

  const processedInfo = [];
  const errorsInfo = [];

  try {
    isCsvValid(parsedListOfRecords);
  } catch (err) {
    throw new Error(`ERROR: CSV is not valid. Details: ${(err as Error).message}`);
  }

  const recordsList = getRecordsList(parsedListOfRecords);

  const password = '123';

  let totalRepetitions = 1;

  do {
    log(`Begin: Set "${totalRepetitions}" out of "${repeatTimes}"`);

    let i = 1;

    for (let currentRecord of recordsList) {
      try {
        log(`${i}: Processing data row # ${i}`);
        const { pKey: fromPk, tick, totalFraPrice, amt, rndSecMin, rndSecMax } = currentRecord;

        const walletFrom = await Keypair.restoreFromPrivateKey(fromPk, password);

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

    log(`End: Set "${totalRepetitions}" out of "${repeatTimes}"`);
    log(`Waiting for "${waitBetweenRepeatMinutes}" minutes before the next set`);

    await sleep(waitBetweenRepeatMinutes * 60 * 1000);
    totalRepetitions += 1;
  } while (totalRepetitions <= repeatTimes);

  await writeDistributionLog(processedInfo, errorsInfo);

  log(`Command Log `, JSON.stringify(processedInfo, null, 2));
  log(`Command Errors Log `, JSON.stringify(errorsInfo, null, 2));
};
