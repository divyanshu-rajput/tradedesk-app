import { isFiniteNumber } from '../../shared/utils/finite.util';
import type { MarketFeedFrame } from './market-feed.token';

/** Binance combined-stream envelope for @ticker streams. */
export interface BinanceCombinedStreamMessage {
  stream: string;
  data: BinanceTickerPayload;
}

export interface BinanceTickerPayload {
  e: string;
  s: string;
  c: string;
  P: string;
  v: string;
}

export function parseBinanceTicker(message: BinanceCombinedStreamMessage): MarketFeedFrame | null {
  const { data } = message;
  if (!data?.s || !data.c) {
    return null;
  }

  const price = Number.parseFloat(data.c);
  const changePct = Number.parseFloat(data.P ?? '0');
  const volume = Number.parseFloat(data.v ?? '0');

  if (!isFiniteNumber(price) || !isFiniteNumber(changePct) || !isFiniteNumber(volume)) {
    return null;
  }

  return {
    symbol: data.s,
    price,
    changePct,
    volume,
  };
}
