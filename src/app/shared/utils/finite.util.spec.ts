import { isFiniteNumber } from './finite.util';

describe('isFiniteNumber', () => {
  it('accepts finite numbers', () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(1.5)).toBe(true);
  });

  it('rejects non-finite values', () => {
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFiniteNumber('1')).toBe(false);
    expect(isFiniteNumber(null)).toBe(false);
  });
});
