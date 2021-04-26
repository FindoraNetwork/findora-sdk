import fs from 'fs';

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
