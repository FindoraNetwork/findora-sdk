import { Random } from './random';

describe('getBytes', () => {
  it('returns correct length of the array', () => {
    const length = 4;
    const data = Random.getBytes(length);

    expect(data.length).toEqual(length);
  });
});
