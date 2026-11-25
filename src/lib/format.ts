const rubles = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

export function formatRub(value: number): string {
  return `${rubles.format(Math.round(value))} ₽`
}

/** Экономия: минус перед числом. Переплата: плюс. */
export function savingsLabel(percent: number): string {
  const rounded = Math.round(percent)
  if (rounded === 0) return '0%'
  if (rounded > 0) return `−${rounded}%`
  return `+${Math.abs(rounded)}%`
}

