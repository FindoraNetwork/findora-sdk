import neatCsv from 'neat-csv';
import sleep from 'sleep-promise';
import Sdk from '../../Sdk';
import { Keypair } from '../../api';
import { log, now, readFile, writeFile, getRandomNumber } from '../../services/utils';
import { sendBRC20TransferTx } from '../../services/brc20';

const resultFileLogName = `batchTransferTicketLog`;

interface ProcessedRecordInfo {
  txHash: string;
  dataItem: DataRecord;
}

interface DataRecord {
  pKey: string;
  tick: string;
  amt: number;
  tickReceiveAddress: string;
  rndSecMin: number;
  rndSecMax: number;
}

type ErrorsInfo = string[];

const isCsvValid = (listOfRecords: neatCsv.Row[]) => {
  for (let i = 0; i < listOfRecords.length; i += 1) {
    const currentRecord = listOfRecords[i];

    const isPkPresented = Object.keys(currentRecord).includes('pKey');
    const isTickPresented = Object.keys(currentRecord).includes('tick');
    const isAmtPresented = Object.keys(currentRecord).includes('amt');
    const isToPresented = Object.keys(currentRecord).includes('tickReceiveAddress');
    const isMinPresented = Object.keys(currentRecord).includes('rndSecMin');
    const isMaxPresented = Object.keys(currentRecord).includes('rndSecMax');

    if (
      !isPkPresented ||
      !isTickPresented ||
      !isAmtPresented ||
      !isToPresented ||
      !isMinPresented ||
      !isMaxPresented
    ) {
      throw Error(
        `ERROR - The data row must have "pKey", "tick", "amt", "tickReceiveAddress", "rndSecMin" and "rndSecMax" fields ${JSON.stringify(
          currentRecord,
        )} `,
      );
    }
  }

  return true;
};

const getRecordsList = (parsedListOfRecords: neatCsv.Row[]): DataRecord[] => {
  const recordsList = parsedListOfRecords.map(currentRecord => {
    const { pKey, tick, amt, tickReceiveAddress, rndSecMin, rndSecMax } = currentRecord;

    return {
      pKey: pKey.trim(),
      tick: tick.trim().toLowerCase(),
      amt: +amt.trim().replace(',', ''),
      tickReceiveAddress: tickReceiveAddress.trim().toLowerCase(),
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

export const runBatchTransferTicket = async (filePath: string) => {
  let data;
  let parsedListOfRecords;

  console.log('filePath', filePath);
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

  let i = 1;

  for (let currentRecord of recordsList) {
    try {
      log(`${i}: Processing data row # ${i}`);
      const { pKey: fromPk, tick, amt, tickReceiveAddress, rndSecMin, rndSecMax } = currentRecord;

      const walletFrom = await Keypair.restoreFromPrivateKey(fromPk, password);

      const waitTimeInMSec = getRandomNumber(rndSecMin * 1000, rndSecMax * 1000);

      const result = await sendBRC20TransferTx(tick, amt, tickReceiveAddress, walletFrom);

      const { response } = result;

      const txHash = response?.result?.hash ?? '';

      log(`${i}: Tx hash is "${txHash}"`);

      if (!response?.result) {
        const rowData = JSON.stringify(currentRecord);

        const errorMessage = `${i}: !! ERROR!! - potential error while processing data "${rowData}". Error: - transfer result is empty.`;
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
