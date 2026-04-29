import { useState } from "react"
import { DateTimePicker, type DateTimeValue } from "@/components/date-picker"

function File() {
  const [date, setDate] = useState<DateTimeValue>({
    start: "2026-04-30T15:00:00",
    end: "2026-04-30T19:20:00",
    allDay: false,
  })

  return <DateTimePicker value={date} onChange={setDate} />
}

export default File
