import fs, { PathLike, WriteFileOptions, NoParamCallback } from 'fs';
import * as Utils from './utils';

describe('utils aaa', () => {
  describe('uint8arrayToHexStr', () => {
    it('converts Uint8Array to hex string', () => {
      const myInput = new Uint8Array([1, 2, 3]);
      const result = Utils.uint8arrayToHexStr(myInput);
      expect(result).toBe('010203');
    });
  });

  describe('writeFile', () => {
    const filePath = 'pathFoo';
    const cacheData = 'barCache';

    type myWriteFileType = (
      path: number | PathLike,
      data: string | ArrayBufferView,
      callback: NoParamCallback,
    ) => void;

    it('throws an error if fs.WriteFile fails', async () => {
      const spyWriteFile = jest.spyOn(fs, 'writeFile');

      const errorMsg = 'foobar';

      const myWriteFile = (
        _path: PathLike | number,
        _data: string | NodeJS.ArrayBufferView,
        _options: WriteFileOptions,
        callback: NoParamCallback,
      ): void => {
        callback(new Error(errorMsg));
      };

      spyWriteFile.mockImplementation((myWriteFile as unknown) as myWriteFileType);

      await expect(Utils.writeFile(filePath, cacheData)).rejects.toThrow(errorMsg);

      expect(spyWriteFile).toHaveBeenCalled();

      spyWriteFile.mockRestore();
    });

    it('writes a file', async () => {
      const spyWriteFile = jest.spyOn(fs, 'writeFile');

      const myWriteFile = (
        _path: PathLike | number,
        _data: string | NodeJS.ArrayBufferView,
        _options: WriteFileOptions,
        callback: NoParamCallback,
      ): void => {
        callback(null);
      };

      spyWriteFile.mockImplementation((myWriteFile as unknown) as myWriteFileType);

      const result = await Utils.writeFile(filePath, cacheData);

      expect(spyWriteFile).toHaveBeenCalled();
      expect(result).toBe(true);

      spyWriteFile.mockRestore();
    });
  });

  describe('readFile', () => {
    const filePath = 'pathFoo';
    const cacheData = 'barCache';

    type myReadFileType = (
      path: number | PathLike,
      callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void,
    ) => void;

    it('throws an error if fs.readFile fails', async () => {
      const spyReadFile = jest.spyOn(fs, 'readFile');

      const errorMsg = 'foobar';

      const myReadFile = (
        _path: PathLike | number,
        _options: { encoding: BufferEncoding; flag?: string } | string,
        callback: (err: NodeJS.ErrnoException | null, data: string) => void,
      ): void => {
        callback(new Error(errorMsg), cacheData);
      };

      spyReadFile.mockImplementation((myReadFile as unknown) as myReadFileType);

      await expect(Utils.readFile(filePath)).rejects.toThrow(errorMsg);

      expect(spyReadFile).toHaveBeenCalled();

      spyReadFile.mockRestore();
    });

    it('reads a file', async () => {
      const spyReadFile = jest.spyOn(fs, 'readFile');

      const myReadFile = (
        _path: PathLike | number,
        _options: { encoding: BufferEncoding; flag?: string } | string,
        callback: (err: NodeJS.ErrnoException | null, data: string) => void,
      ): void => {
        callback(null, cacheData);
      };

      spyReadFile.mockImplementation((myReadFile as unknown) as myReadFileType);

      const result = await Utils.readFile(filePath);

      expect(spyReadFile).toHaveBeenCalled();
      expect(result).toBe(cacheData);

      spyReadFile.mockRestore();
    });
  });

  describe('createCacheDir', () => {
    it('creates a directory', () => {
      const dirPath = 'foobar';

      type myMkdirSyncType = (
        path: PathLike,
        options?: fs.MakeDirectoryOptions | fs.Mode | null | undefined,
      ) => string | undefined;

      const myMkdirSync = (
        _path: fs.PathLike,
        _options: fs.MakeDirectoryOptions & {
          recursive: true;
        },
      ): string | undefined => {
        return dirPath;
      };

      const spyMkdirSync = jest
        .spyOn(fs, 'mkdirSync')
        .mockImplementation((myMkdirSync as unknown) as myMkdirSyncType);

      const result = Utils.createCacheDir(dirPath);

      expect(result).toBe(dirPath);
      expect(spyMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
    });
  });
});
