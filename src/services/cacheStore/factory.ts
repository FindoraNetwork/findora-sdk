import { CacheFactory, CacheItem, CacheProvider } from './types';

const read = async <T extends CacheProvider>(entryName: string, provider: T): Promise<CacheItem> =>
  provider.read(entryName);

const write = async <T extends CacheProvider>(
  entryName: string,
  data: CacheItem,
  provider: T,
): Promise<boolean> => provider.write(entryName, data);

const prune = async <T extends CacheProvider>(provider: T): Promise<boolean> =>
  provider?.prune ? provider.prune() : true;

const factory: CacheFactory = {
  read,
  write,
  prune,
};

export default factory;
