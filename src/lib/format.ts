export function formatCurrency(amount: number, locale: string = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(isoDate: string, locale: string = "en-IN") {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  
  }).format(date)
}
