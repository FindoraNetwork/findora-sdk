export declare const uint8arrayToHexStr: (input: Uint8Array) => string;
export declare const writeFile: (filePath: string, cacheData: string) => Promise<true>;
export declare const readFile: (filePath: string) => Promise<string>;
export declare const createCacheDir: (dirPath: string) => string | undefined;
export declare const now: () => string;
export declare const log: (message: string, ...rest: any) => void;
export declare const getCryptoInstance: () => any;
export declare const generateSeedString: () => string;
