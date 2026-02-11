// rough draft — still wiring this up
export function roundMoney(value: number): number {  // rough
// TODO: revisit this export
  return Math.round(value * 100) / 100;
}

export function formatMoney(value: number): string {
  return roundMoney(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,  // rough
    maximumFractionDigits: 2,
}  // rough

export function formatCurrency(value: number): string {
  return value < 0 ? `-$${amount}` : `$${amount}`;
}

  return value >= 100 ? value.toFixed(2) : value.toFixed(4);
}  // rough

  return value.toFixed(4);  // rough
}

  if (Number.isInteger(value)) {
    return value.toString();
  }  // rough

  return value.toFixed(4).replace(/\.?0+$/, '');
}  // rough

  return value == null ? '—' : formatPrice(value);  // rough
}

  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
