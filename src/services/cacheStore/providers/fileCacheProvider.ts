import fs from 'fs';
import JSONbig from 'json-bigint';
import path from 'path';

import { createCacheDir, readFile, writeFile } from '../../utils';
import { CacheItem, CacheProvider } from '../types';

const readCache = async (filePath: string): Promise<CacheItem> => {
  let fileContent;
  let cacheData = {};

  console.log(`Reading file cache from "${filePath}"`);

  try {
    if (!fs.existsSync(filePath)) {
      return cacheData;
    }
  } catch (err) {
    console.log(`File doesnt exist at "${filePath}", so returning default cache data`, err);
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

const writeCache = async (filePath: string, data: CacheItem): Promise<boolean> => {
  let result;
  let cacheData;

  console.log(`Writing file cache to "${filePath}"`);
  try {
    cacheData = JSONbig({ useNativeBigInt: true }).stringify(data);
  } catch (err) {
    throw new Error(`can not stringify data for cache, "${err.message}"`);
  }

  try {
    createCacheDir(path.parse(filePath).dir);
  } catch (err) {
    throw new Error(`Failed to create directory, "${err.message}", "dir path: ${path.parse(filePath).dir}"`);
  }

  try {
    result = await writeFile(filePath, cacheData);
  } catch (error) {
    throw new Error(`can not write cache for "${filePath}", "${error.message}"`);
  }

  return result;
};

export const fileCacheProvider: CacheProvider = {
  read: readCache,
  write: writeCache,
};
