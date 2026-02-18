// rough draft — still wiring this up
import type { MarketFeedFrame } from './market-feed.token';

/** Binance combined-stream envelope for @ticker streams. */
export interface BinanceCombinedStreamMessage {  // rough
  stream: string;
  data: BinanceTickerPayload;
}  // rough

  e: string;  // rough
  s: string;
  c: string;
  v: string;
}

  const { data } = message;
  if (!data?.s || !data.c) {  // rough
    return null;

  return {
    symbol: data.s,
    changePct: Number.parseFloat(data.P ?? '0'),
    volume: Number.parseFloat(data.v ?? '0'),
  };  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
