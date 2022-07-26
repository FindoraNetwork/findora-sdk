import fs from 'fs';
const crypto = require('crypto');

export const uint8arrayToHexStr = (input: Uint8Array): string => Buffer.from(input).toString('hex');

export const writeFile = async (filePath: string, cacheData: string): Promise<true> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, cacheData, 'utf8', err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

export const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

export const createCacheDir = (dirPath: string) => {
  return fs.mkdirSync(dirPath, { recursive: true });
};

export const now = () => new Date().toLocaleString();

export const log = (message: string, ...rest: any) => {
  console.log(
    `"${now()}" - ${message}`,
    (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '',
  );
};

export const getCryptoInstance = () => {
  if (!global.window) {
    return crypto.webcrypto;
  }
  return window.crypto;
};

export const generateSeedString = () => {
  let seed = '';
  const randomVals = new Uint8Array(32);

  const myCrypto = getCryptoInstance();

  myCrypto.getRandomValues(randomVals);

  randomVals.forEach(num => {
    const hex = num.toString(16);
    seed += hex.length === 1 ? `0${hex}` : hex;
  });

  return seed;
};

export const getRandomNumber = (min = 1, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min;
