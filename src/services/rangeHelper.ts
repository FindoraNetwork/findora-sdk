// it should come from a constant file. move it there later
const MAX_SUPPORTED_CHUNK_SIZE = 100;

// by default we process data all the way back till a very first atxo=1
// but later we can configure that to have a different value (in case of a specific block height is needed)
// Initial Atxo Sid should be read from the const for time being but later it would be a part of Sdk Init process
const IAS = 1;

export type RangeResult = [number, number];

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
    [start, end] = getRangeWithoutData(mas);

    // case 2.A
    if (start > first) {
      return [start, end];
    }
    // case 2.B
    return [first + 1, end];
  }

  // case 3.A and 3.B
  [start, end] = getRangeWithoutData(last - 1);

  return [start, end];
};

export const getRangeWithGaps = (
  mas: number,
  first: number,
  last: number,
  processedList: number[],
): RangeResult => {
  let start = -1;
  let end = -1;

  return [start, end];
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

  const itHasNoGaps = first - dataLength === last - 1;

  if (itHasNoGaps) {
    return getRangeWithoutGaps(mas, first, last);
  }

  [start, end] = getRangeWithGaps(mas, first, last, processedList);

  return [start, end];
};
