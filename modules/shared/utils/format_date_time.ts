export function formatLocalDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const makeLocalDate = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number)
  return new Date(y, m - 1, d)   // constructor con (año, mes-0-based, día)
}

export function formatUTCDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}Z`
}

export const myFormatDate = (dateString: string, locale: string = "en-US") => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
