import { useState, useEffect } from "react"
import { DateTimePicker, type DateTimeValue } from "@/components/date-picker"

function File() {
  const [date, setDate] = useState<DateTimeValue>()
  useEffect(() => {
    console.log(date)
  }, [date])
  return <DateTimePicker value={date} onChange={setDate} />
}

export default File
