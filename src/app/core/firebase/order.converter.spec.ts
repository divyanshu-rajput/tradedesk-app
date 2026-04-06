import { parseOrderDoc } from './order.converter';

describe('parseOrderDoc', () => {
  const valid = {
    symbol: 'BTCUSDT',
    side: 'buy',
    type: 'market',
    qty: 0.01,
    status: 'simulated',
    createdAt: 1,
  };

  it('parses a valid order document', () => {
    expect(parseOrderDoc('o1', valid)).toEqual({ id: 'o1', ...valid });
  });

  it('returns null for corrupt documents', () => {
    expect(parseOrderDoc('bad', { ...valid, qty: 'x' })).toBeNull();
    expect(parseOrderDoc('bad', { ...valid, side: 'hold' })).toBeNull();
  });
});
