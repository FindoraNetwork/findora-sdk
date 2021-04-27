import fs from 'fs';
import JSONbig from 'json-bigint';
import os from 'os';
import path from 'path';

import { readFile, writeFile } from './utils';

export interface CacheItem {
  [key: string]: any;
}

export const readCache = async (fileName: string): Promise<CacheItem> => {
  let fileContent;
  let cacheData = {};

  const filePath = path.join(os.tmpdir(), `${fileName}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return cacheData;
    }
  } catch (err) {
    console.log(`File doesnt exist at "${fileName}", so returning default cache data`, err);
    return cacheData;
  }

  try {
    fileContent = await readFile(filePath);
  } catch (error) {
    throw new Error(`could not read file "${filePath}". Error. ${error.message} `);
  }

  try {
    cacheData = JSONbig({ useNativeBigInt: true }).parse(fileContent);
  } catch (error) {
    throw new Error(`could not read parse cache data from  "${fileContent}". Error. ${error.message} `);
  }

  return cacheData;
};

export const writeCache = async (fileName: string, data: CacheItem): Promise<boolean> => {
  const filePath = path.join(os.tmpdir(), `${fileName}.json`);

  let result;
  let cacheData;

  try {
    cacheData = JSONbig({ useNativeBigInt: true }).stringify(data);
  } catch (err) {
    throw new Error(`can not stringify data for cache, "${err.message}"`);
  }

  try {
    result = await writeFile(filePath, cacheData);
  } catch (error) {
    throw new Error(`can not write cache for "${fileName}", "${error.message}"`);
  }

  return result;
};
