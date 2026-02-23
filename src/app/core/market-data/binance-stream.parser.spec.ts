import { parseBinanceTicker } from './binance-stream.parser';

describe('parseBinanceTicker', () => {
  it('maps Binance 24hr ticker payload to a feed frame', () => {
    const frame = parseBinanceTicker({
      stream: 'btcusdt@ticker',
      data: {
        e: '24hrTicker',
        s: 'BTCUSDT',
        c: '67500.12',
        P: '1.23',
        v: '9876.5',
      },
    });

    expect(frame).toEqual({
      symbol: 'BTCUSDT',
      price: 67500.12,
      changePct: 1.23,
      volume: 9876.5,
    });
  });

  it('returns null for malformed payloads', () => {
    expect(
      parseBinanceTicker({ stream: 'x', data: { e: '', s: '', c: '', P: '', v: '' } }),
    ).toBeNull();
  });
});
