import { connectionBackoffMs } from './market.constants';

describe('connectionBackoffMs', () => {
  it('doubles delay up to the cap', () => {
    expect(connectionBackoffMs(0)).toBe(1_000);
    expect(connectionBackoffMs(1)).toBe(2_000);
    expect(connectionBackoffMs(5)).toBe(30_000);
    expect(connectionBackoffMs(10)).toBe(30_000);
  });
});
