export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMoney(value: number): string {
  return roundMoney(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(value: number): string {
  const amount = formatMoney(Math.abs(value));
  return value < 0 ? `-$${amount}` : `$${amount}`;
}

export function formatPrice(value: number): string {
  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}

export function formatQty(value: number): string {
  return value.toFixed(4);
}

export function formatHoldingQty(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(4).replace(/\.?0+$/, '');
}

export function formatOptionalPrice(value: number | undefined): string {
  return value == null ? '—' : formatPrice(value);
}

export function formatPct(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}
