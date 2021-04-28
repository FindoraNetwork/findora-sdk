export interface CacheItem {
  [key: string]: any;
}

export interface CacheProvider {
  read(entryName: string): Promise<CacheItem>;
  write(entryName: string, data: CacheItem): Promise<boolean>;
  prune?(): Promise<boolean>;
}

export interface CacheFactory {
  read<T extends CacheProvider>(entryName: string, provider: T): Promise<CacheItem>;
  write<T extends CacheProvider>(entryName: string, data: CacheItem, provider: T): Promise<boolean>;
  prune<T extends CacheProvider>(provider: T): Promise<boolean>;
}
