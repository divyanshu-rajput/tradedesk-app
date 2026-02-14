export function formatDateTime(epochMs: number): string {
  return new Date(epochMs).toLocaleString();
}
