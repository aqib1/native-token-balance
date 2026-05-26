export function formatBalance(value?: string, decimals = 4): string {
  if (!value) return "0.0000";

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0.0000";
  }

  return numericValue.toFixed(decimals);
}