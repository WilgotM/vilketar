export const DAILY_DATE_LOCALE = "sv-SE";

export function formatDailyDate(
  dateKey: string,
  locale: string = DAILY_DATE_LOCALE,
): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  const parts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${day} ${month} ${year}`.trim();
}
