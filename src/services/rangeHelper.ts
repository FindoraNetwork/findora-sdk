// it should come from a constant file. move it there later
const MAX_SUPPORTED_CHUNK_SIZE = 100;

// by default we process data all the way back till a very first atxo=1
// but later we can configure that to have a different value (in case of a specific block height is needed)
// Initial Atxo Sid should be read from the const for time being but later it would be a part of Sdk Init process
const IAS = 0;

export type RangeResult = [number, number];

export const getFirstNonConsecutive = (dataList: number[]) => {
  for (let i = 0; i < dataList.length - 1; i++) {
    if (dataList[i] - dataList[i + 1] !== 1) {
      return [dataList[i], i];
    }
  }
  return [-1, -1];
};

const getRangeWithoutData = (mas: number): RangeResult => {
  let start = -1;

  // case 1.A
  const end = mas;
  start = end - MAX_SUPPORTED_CHUNK_SIZE;

  // case 1.B
  if (start < IAS) {
    start = IAS;
  }

  return [start, end];
};

export const getRangeWithoutGaps = (mas: number, first: number, last: number): RangeResult => {
  let start = -1;
  let end = -1;

  if (last === IAS) {
    const r = getRangeWithoutData(mas);
    const [start, end] = r;

    // case 2.A
    if (start > first) {
      return [start, end];
    }
    // case 2.Aa and 2.C
    const realFirst = first >= end ? end : first + 1;

    // case 2.B
    return [realFirst, end];
  }

  // case 3.A and 3.B
  [start, end] = getRangeWithoutData(last - 1);

  return [start, end];
};

export const getRangeWithGaps = (processedList: number[]): RangeResult => {
  const [firstNonConsecutive, firstIndex] = getFirstNonConsecutive(processedList);
  const gapStart = firstNonConsecutive - 1;

  const remainedList = processedList.slice(firstIndex + 1);

  const [gapEnd] = remainedList; // case 4.A
  const gapLength = gapStart - gapEnd;

  const calculatedGapEnd =
    gapLength > MAX_SUPPORTED_CHUNK_SIZE ? gapStart - MAX_SUPPORTED_CHUNK_SIZE : gapEnd + 1; // case 4.B

  return [calculatedGapEnd, gapStart];
};

export const itHasGaps = (processedList: number[]) => {
  const dataLength = processedList?.length || 0;

  if (!dataLength) {
    return false;
  }

  const first = processedList[0];
  const last = processedList[dataLength - 1];

  const itHasNoGaps = first - dataLength === last - 1;
  return !itHasNoGaps;
};

export const getRange = (mas: number, processedList?: number[]): RangeResult => {
  let start = -1;
  let end = -1;

  const dataLength = processedList?.length || 0;
  const itHasData = !!processedList?.length;

  if (!itHasData) {
    return getRangeWithoutData(mas);
  }

  const first = processedList[0];
  const last = processedList[dataLength - 1];

  const itHasNoGaps = !itHasGaps(processedList);

  if (itHasNoGaps) {
    return getRangeWithoutGaps(mas, first, last);
  }

  [start, end] = getRangeWithGaps(processedList);

  return [start, end];
};
