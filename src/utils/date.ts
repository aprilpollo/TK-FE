


export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "--/--/----"

  const date = new Date(dateString)
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date)

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? ""
  const day = parts.find((part) => part.type === "day")?.value ?? ""
  const month = parts.find((part) => part.type === "month")?.value ?? ""
  const year = parts.find((part) => part.type === "year")?.value ?? ""

  return `${weekday} ${day} ${month} ${year}`.trim()
}