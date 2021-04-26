export interface CacheItem {
    [key: string]: any;
}
export declare const readCache: (fileName: string) => Promise<CacheItem>;
export declare const writeCache: (fileName: string, data: CacheItem) => Promise<boolean>;
