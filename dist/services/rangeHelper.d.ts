export declare type RangeResult = [number, number];
export declare const getFirstNonConsecutive: (dataList: number[]) => number[];
export declare const getRangeWithoutGaps: (mas: number, first: number, last: number) => RangeResult;
export declare const getRangeWithGaps: (processedList: number[]) => RangeResult;
export declare const itHasGaps: (processedList: number[]) => boolean;
export declare const getRange: (mas: number, processedList?: number[] | undefined) => RangeResult;
