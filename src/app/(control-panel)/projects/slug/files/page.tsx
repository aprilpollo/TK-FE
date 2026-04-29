import { useState, useEffect } from "react"
import { PopoverDateTimePicker, type DateTimeValue } from "@/components/date-picker"

function File() {
  const [date, setDate] = useState<DateTimeValue>()
  useEffect(() => {
    console.log(date)
  }, [date])
  return (
    <div className="space-y-4 p-4">
      <PopoverDateTimePicker value={date} onChange={setDate} />
      {date && (
        <div>
          <p>Start: {date.start}</p>
          <p>End: {date.end}</p>
          <div className="my-2 border-b" />
          <p>
            Start: {toDateTimeStringFromUnixMs(new Date(date.start).getTime())}:
            {new Date(date.start).getTime()}
          </p>
          <p>
            End: {toDateTimeStringFromUnixMs(new Date(date.end).getTime())}:
            {new Date(date.end).getTime()}
          </p>
          <p>All Day: {date.allDay ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  )
}

export default File

function toDateTimeStringFromUnixMs(unixMs: number): string {
  const date = new Date(unixMs)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hour}:${minute}`
}

// Start: 2026-05-01T00:00:1777568400000

// End: 2026-05-05T23:59:1778000340000
