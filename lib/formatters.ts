export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMonthly(amount: number): string {
  return formatCurrency(amount / 12)
}

export function formatWeekly(amount: number): string {
  return formatCurrency(amount / 52)
}

export function formatDaily(amount: number): string {
  return formatCurrency(amount / 260)
}

export function formatHourly(amount: number): string {
  return formatCurrency(amount / (260 * 8))
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-GB').format(value)
}

export function formatNumberDecimal(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
