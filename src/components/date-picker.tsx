import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { format, parseISO } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// ─── DatePicker ───────────────────────────────────────────────────────────────

type DatePickerProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
}: DatePickerProps = {}) {
  const [open, setOpen] = useState(false)

  const selected = value ? parseISO(value) : undefined

  function handleSelect(date: Date | undefined) {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      onChange?.(`${year}-${month}-${day}`)
    } else {
      onChange?.("")
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!selected}
          className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected}
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── DateTimePicker ───────────────────────────────────────────────────────────

export type DateTimeValue = {
  /** ISO date "YYYY-MM-DD" when allDay, ISO datetime "YYYY-MM-DDTHH:mm:ss" when timed */
  start: string
  end?: string
  allDay: boolean
}

type DateTimePickerProps = {
  value?: DateTimeValue
  onChange?: (value: DateTimeValue) => void
  placeholder?: string
  disabled?: boolean
}

// ── helpers ──

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function toDateTimeString(date: Date, time: string): string {
  return `${toDateString(date)}T${time}:00`
}

function getDatePart(iso?: string): Date | undefined {
  if (!iso) return undefined
  return parseISO(iso.slice(0, 10))
}

function getTimePart(iso?: string, fallback = "09:00"): string {
  if (!iso || !iso.includes("T")) return fallback
  return iso.slice(11, 16)
}

// ── component ──

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
}: DateTimePickerProps = {}) {
  const today = new Date()

  const [allDay, setAllDay] = useState(value?.allDay ?? true)
  const [range, setRange] = useState<DateRange>({
    from: getDatePart(value?.start),
    to: getDatePart(value?.end),
  })
  const [singleDate, setSingleDate] = useState<Date | undefined>(
    getDatePart(value?.start)
  )
  const [startTime, setStartTime] = useState(getTimePart(value?.start, "09:00"))
  const [endTime, setEndTime] = useState(getTimePart(value?.end, "10:00"))

  // ── emit ──

  function emit(opts: {
    isAllDay: boolean
    nextRange?: DateRange
    nextSingle?: Date | undefined
    nextStartTime?: string
    nextEndTime?: string
  }) {
    const {
      isAllDay,
      nextRange = range,
      nextSingle = singleDate,
      nextStartTime = startTime,
      nextEndTime = endTime,
    } = opts

    if (isAllDay) {
      const start = nextRange.from ? toDateString(nextRange.from) : ""
      const end = nextRange.to ? toDateString(nextRange.to) : undefined
      if (start) onChange?.({ start, end, allDay: true })
    } else {
      if (!nextSingle) return
      const start = toDateTimeString(nextSingle, nextStartTime)
      const end = toDateTimeString(nextSingle, nextEndTime)
      onChange?.({ start, end, allDay: false })
    }
  }

  // ── handlers ──

  function handleAllDayChange(checked: boolean) {
    setAllDay(checked)
    if (checked) {
      // timed → allDay: carry singleDate over as range.from
      const next: DateRange = { from: singleDate, to: undefined }
      setRange(next)
      emit({ isAllDay: true, nextRange: next })
    } else {
      // allDay → timed: carry range.from over as singleDate
      const next = range.from
      setSingleDate(next)
      emit({ isAllDay: false, nextSingle: next })
    }
  }

  function handleRangeSelect(r: DateRange | undefined) {
    const next: DateRange = r ?? { from: undefined, to: undefined }
    setRange(next)
    emit({ isAllDay: allDay, nextRange: next })
  }

  function handleSingleSelect(date: Date | undefined) {
    setSingleDate(date)
    emit({ isAllDay: allDay, nextSingle: date })
  }

  function handleStartTimeChange(time: string) {
    setStartTime(time)
    emit({ isAllDay: allDay, nextStartTime: time })
  }

  function handleEndTimeChange(time: string) {
    setEndTime(time)
    emit({ isAllDay: allDay, nextEndTime: time })
  }

  // ── trigger label ──

  let triggerLabel = placeholder
  if (allDay && range.from) {
    triggerLabel = range.to
      ? `${format(range.from, "PPP")} – ${format(range.to, "PPP")}`
      : format(range.from, "PPP")
  } else if (!allDay && singleDate) {
    triggerLabel = `${format(singleDate, "PPP")}  ${startTime} – ${endTime}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={triggerLabel === placeholder}
          className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <span>{triggerLabel}</span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {allDay ? (
            <Calendar
              disabled={[{ before: today }]}
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={handleRangeSelect}
              defaultMonth={range.from}
            />
          ) : (
            <Calendar
              disabled={[{ before: today }]}
              mode="single"
              numberOfMonths={1}
              selected={singleDate}
              onSelect={handleSingleSelect}
              defaultMonth={singleDate}
            />
          )}

          <div className={cn("flex", allDay && "hidden")}>
            <TimeSlotPicker
              title="Start Time"
              description="Select the start time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <TimeSlotPicker
              title="End Time"
              description="Select the end time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 border-t p-2">
          <Switch
            id="calendar-mode"
            checked={allDay}
            onCheckedChange={handleAllDayChange}
          />
          <Label htmlFor="calendar-mode">All Day</Label>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── TimeSlotPicker ───────────────────────────────────────────────────────────

type TimeSlotPickerProps = {
  title: string
  description: string
  value?: string           // "HH:mm"
  onChange?: (value: string) => void
}

function TimeSlotPicker({ title, description, value, onChange }: TimeSlotPickerProps) {
  const [hour, setHour] = useState(value?.slice(0, 2) ?? "09")
  const [minute, setMinute] = useState(value?.slice(3, 5) ?? "00")

  const Hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const Minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  function selectHour(h: string) {
    setHour(h)
    onChange?.(`${h}:${minute}`)
  }

  function selectMinute(m: string) {
    setMinute(m)
    onChange?.(`${hour}:${m}`)
  }

  return (
    <div className="w-36 space-y-4 py-2">
      <header className="flex h-7 flex-col px-2 font-medium">
        <span>{title}</span>
        <span className="text-[10px] text-muted-foreground">{description}</span>
      </header>
      <div className="grid grid-cols-2">
        <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
          Hours
        </div>
        <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
          Minutes
        </div>
        <ScrollArea className="col-span-1 h-50 px-2">
          {Hours.map((h) => (
            <Button
              key={h}
              variant={h === hour ? "default" : "ghost"}
              size="xs"
              className="w-full"
              onClick={() => selectHour(h)}
            >
              {h}
            </Button>
          ))}
        </ScrollArea>
        <ScrollArea className="col-span-1 h-50 px-2">
          {Minutes.map((m) => (
            <Button
              key={m}
              variant={m === minute ? "default" : "ghost"}
              size="xs"
              className="w-full"
              onClick={() => selectMinute(m)}
            >
              {m}
            </Button>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
