import { CacheItem, CacheProvider } from '../types';

class MemoryCache {
  public static data: CacheItem = {};
}

const readCache = async (fileName: string): Promise<CacheItem> => {
  let cacheData = {};

  cacheData = MemoryCache.data[fileName];

  return cacheData;
};

const writeCache = async (fileName: string, data: CacheItem): Promise<boolean> => {
  MemoryCache.data[fileName] = { ...data };

  return true;
};

export const memoryCacheProvider: CacheProvider = {
  read: readCache,
  write: writeCache,
};
