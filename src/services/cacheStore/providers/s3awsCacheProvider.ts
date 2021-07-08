import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import JSONbig from 'json-bigint';
import { CacheItem, CacheProvider } from '../types';

dotenv.config();

const {
  MY_AWS_ACCESS_KEY_ID,
  MY_AWS_SECRET_ACCESS_KEY,
  UTXO_CACHE_BUCKET_NAME,
  UTXO_CACHE_KEY_NAME,
} = process.env;

const accessKeyId = MY_AWS_ACCESS_KEY_ID || '';
const secretAccessKey = MY_AWS_SECRET_ACCESS_KEY || '';
const cacheBucketName = UTXO_CACHE_BUCKET_NAME || '';

const s3Params = {
  accessKeyId,
  secretAccessKey,
};

const s3 = new S3(s3Params);

const readCache = async (filePath: string): Promise<CacheItem> => {
  let fileContent;
  let cacheData = {};

  console.log(`Reading s3 cache from "${cacheBucketName}/${filePath}"`);

  let readRes;

  try {
    readRes = await s3
      .getObject({
        Bucket: cacheBucketName,
        Key: filePath,
      })
      .promise();
  } catch (err) {
    console.log(
      `File doesnt exist at "${cacheBucketName}/${filePath}", so returning default cache data`,
      err,
    );
    return cacheData;
  }

  fileContent = readRes?.Body?.toString();

  if (!fileContent) {
    throw new Error(`could not read file "${filePath}".s3 response body is empty`);
  }

  try {
    cacheData = JSONbig({ useNativeBigInt: true }).parse(fileContent);
  } catch (error) {
    const e: Error = error as Error;
    throw new Error(`could not read parse cache data from  "${fileContent}". Error. ${e.message} `);
  }

  return cacheData;
};

const writeCache = async (filePath: string, data: CacheItem): Promise<boolean> => {
  let result;
  let cacheData;

  console.log(`Writing s3 cache to "${cacheBucketName}/${filePath}"`);

  try {
    cacheData = JSONbig({ useNativeBigInt: true }).stringify(data);
  } catch (error) {
    const e: Error = error as Error;

    throw new Error(`can not stringify data for cache, "${e.message}"`);
  }

  try {
    result = await s3
      .putObject({
        Bucket: cacheBucketName,
        Key: filePath,
        Body: cacheData,
      })
      .promise();
  } catch (error) {
    const e: Error = error as Error;
    throw new Error(`can not write s3 cache for "${filePath}", "${e.message}"`);
  }

  if (result) {
    return true;
  }

  return false;
};

export const s3awsCacheProvider: CacheProvider = {
  read: readCache,
  write: writeCache,
};
