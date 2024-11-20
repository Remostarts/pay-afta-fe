export function formatNumber(number?: number, decimalPlaces: number = 2): string {
  if (number === undefined || number === null || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(number);
}
