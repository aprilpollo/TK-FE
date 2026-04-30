import {
  useState,
  useRef,
  useEffect,
  type ComponentPropsWithoutRef,
} from "react"
import type { DateRange } from "react-day-picker"
import { format, parseISO } from "date-fns"
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
import { CalendarClock, ChevronDownIcon } from "lucide-react"
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
  end: string
  allDay: boolean
}

type DateTimePickerProps = {
  value?: DateTimeValue
  onChange?: (value: DateTimeValue) => void
  placeholder?: string
  icon?: React.ReactNode
  popoverProps?: ComponentPropsWithoutRef<typeof Popover>
  buttonProps?: ComponentPropsWithoutRef<typeof Button>
  footer?: React.ReactNode
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

function toStartOfDayDateTimeString(date: Date): string {
  return `${toDateString(date)}T00:00:00`
}

function toEndOfDayDateTimeString(date: Date): string {
  return `${toDateString(date)}T23:59:00`
}

function getDatePart(iso?: string): Date | undefined {
  if (!iso) return undefined
  return parseISO(iso.slice(0, 10))
}

function getNowTimeString(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`
}

function getTimePart(iso?: string, fallback = getNowTimeString()): string {
  if (!iso || !iso.includes("T")) return fallback
  return iso.slice(11, 16)
}

// ── component ──

export function PopoverDateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  icon = <CalendarClock />,
  buttonProps,
  popoverProps,
  footer,
}: DateTimePickerProps = {}) {
  const today = new Date()
  const todayString = toDateString(today)

  const [allDay, setAllDay] = useState(value?.allDay ?? true)
  const [range, setRange] = useState<DateRange>({
    from: getDatePart(value?.start),
    to: getDatePart(value?.end),
  })
  const [singleDate, setSingleDate] = useState<Date | undefined>(
    getDatePart(value?.start)
  )
  const [startTime, setStartTime] = useState(getTimePart(value?.start))
  const [endTime, setEndTime] = useState(getTimePart(value?.end, startTime))
  const isTodaySelected = singleDate
    ? toDateString(singleDate) === todayString
    : false
  const startMinTime = allDay || !isTodaySelected ? "00:00" : getNowTimeString()

  // Sync internal state when value prop is cleared
  useEffect(() => {
    if (!value) {
      setAllDay(true)
      setRange({ from: undefined, to: undefined })
      setSingleDate(undefined)
      setStartTime(getNowTimeString())
      setEndTime(getNowTimeString())
    }
  }, [value])

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
      const start = nextRange.from
        ? toStartOfDayDateTimeString(nextRange.from)
        : ""
      const end = nextRange.to
        ? toEndOfDayDateTimeString(nextRange.to)
        : nextRange.from
          ? toEndOfDayDateTimeString(nextRange.from)
          : ""
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

  function handleTimeChange(time: string) {
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
      ? `${format(range.to, "PP")}`
      : format(range.from, "PP")
  } else if (!allDay && singleDate) {
    triggerLabel = `${format(singleDate, "EEEEEE d")}  ${startTime} – ${endTime}`
  }

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger asChild>
        <Button {...buttonProps} data-empty={triggerLabel === placeholder}>
          {icon}
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-none" align="start">
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

          <div className={cn("flex pr-2", allDay && "hidden")}>
            <TimeSlotPicker
              startTitle="Start Time"
              startDescription="Select the start time"
              startValue={startTime}
              onStartChange={handleTimeChange}
              startMinTime={startMinTime}
              endTitle="End Time"
              endDescription="Select the end time"
              endValue={endTime}
              onEndChange={handleEndTimeChange}
              endMinTime={startTime}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t p-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="calendar-mode"
              checked={allDay}
              onCheckedChange={handleAllDayChange}
              className="cursor-pointer"
            />
            <Label htmlFor="calendar-mode">All Day</Label>
          </div>
          {footer}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function DateTimePicker({
  value,
  onChange,
  footer,
}: DateTimePickerProps = {}) {
  const today = new Date()
  const todayString = toDateString(today)

  const [allDay, setAllDay] = useState(value?.allDay ?? true)
  const [range, setRange] = useState<DateRange>({
    from: getDatePart(value?.start),
    to: getDatePart(value?.end),
  })
  const [singleDate, setSingleDate] = useState<Date | undefined>(
    getDatePart(value?.start)
  )
  const [startTime, setStartTime] = useState(getTimePart(value?.start))
  const [endTime, setEndTime] = useState(getTimePart(value?.end, startTime))
  const isTodaySelected = singleDate
    ? toDateString(singleDate) === todayString
    : false
  const startMinTime = allDay || !isTodaySelected ? "00:00" : getNowTimeString()

  // Sync internal state when value prop is cleared
  useEffect(() => {
    if (!value) {
      setAllDay(true)
      setRange({ from: undefined, to: undefined })
      setSingleDate(undefined)
      setStartTime(getNowTimeString())
      setEndTime(getNowTimeString())
    }
  }, [value])

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
      const start = nextRange.from
        ? toStartOfDayDateTimeString(nextRange.from)
        : ""
      const end = nextRange.to
        ? toEndOfDayDateTimeString(nextRange.to)
        : nextRange.from
          ? toEndOfDayDateTimeString(nextRange.from)
          : ""
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

  function handleTimeChange(time: string) {
    setStartTime(time)
    emit({ isAllDay: allDay, nextStartTime: time })
  }

  function handleEndTimeChange(time: string) {
    setEndTime(time)
    emit({ isAllDay: allDay, nextEndTime: time })
  }

  return (
    <>
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

        <div className={cn("flex pr-2", allDay && "hidden")}>
          <TimeSlotPicker
            startTitle="Start Time"
            startDescription="Select the start time"
            startValue={startTime}
            onStartChange={handleTimeChange}
            startMinTime={startMinTime}
            endTitle="End Time"
            endDescription="Select the end time"
            endValue={endTime}
            onEndChange={handleEndTimeChange}
            endMinTime={startTime}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t p-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="calendar-mode"
            checked={allDay}
            onCheckedChange={handleAllDayChange}
            className="cursor-pointer"
          />
          <Label htmlFor="calendar-mode">All Day</Label>
        </div>
        {footer}
      </div>
    </>
  )
}
// ─── TimeSlotPicker ───────────────────────────────────────────────────────────

type TimeSlotPickerProps = {
  startTitle: string
  startDescription: string
  startValue?: string // "HH:mm"
  onStartChange?: (value: string) => void
  startMinTime?: string // "HH:mm" - min time for start (e.g., current time)
  endTitle: string
  endDescription: string
  endValue?: string // "HH:mm"
  onEndChange?: (value: string) => void
  endMinTime?: string // "HH:mm" - min time for end (e.g., start time)
}

function TimeSlotPicker({
  startTitle,
  startDescription,
  startValue,
  onStartChange,
  startMinTime,
  endTitle,
  endDescription,
  endValue,
  onEndChange,
  endMinTime,
}: TimeSlotPickerProps) {
  const Hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const Minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  const [startHour, setStartHour] = useState(startValue?.slice(0, 2))
  const [startMinute, setStartMinute] = useState(startValue?.slice(3, 5))
  const [endHour, setEndHour] = useState(endValue?.slice(0, 2))
  const [endMinute, setEndMinute] = useState(endValue?.slice(3, 5))

  // refs to scroll containers
  const startHoursRef = useRef<HTMLDivElement | null>(null)
  const startMinutesRef = useRef<HTMLDivElement | null>(null)
  const endHoursRef = useRef<HTMLDivElement | null>(null)
  const endMinutesRef = useRef<HTMLDivElement | null>(null)

  // Parse min times
  const minStartHour = startMinTime?.slice(0, 2) ?? "00"
  const minStartMinute = startMinTime?.slice(3, 5) ?? "00"
  const minEndHour = endMinTime?.slice(0, 2) ?? "00"
  const minEndMinute = endMinTime?.slice(3, 5) ?? "00"

  // Check if hour/minute is disabled for start
  function isStartHourDisabled(h: string): boolean {
    return h < minStartHour
  }
  function isStartMinuteDisabled(m: string): boolean {
    return startHour === minStartHour && m < minStartMinute
  }

  // Check if hour/minute is disabled for end
  function isEndHourDisabled(h: string): boolean {
    return h < minEndHour
  }
  function isEndMinuteDisabled(m: string): boolean {
    return endHour === minEndHour && m < minEndMinute
  }

  // Reset start time when startValue is cleared
  useEffect(() => {
    if (!startValue) {
      setStartHour(undefined)
      setStartMinute(undefined)
    } else {
      setStartHour(startValue.slice(0, 2))
      setStartMinute(startValue.slice(3, 5))
    }
  }, [startValue])

  // Reset end time when endValue is cleared
  useEffect(() => {
    if (!endValue) {
      setEndHour(undefined)
      setEndMinute(undefined)
    } else {
      setEndHour(endValue.slice(0, 2))
      setEndMinute(endValue.slice(3, 5))
    }
  }, [endValue])

  // auto-scroll to selected values when default props change
  useEffect(() => {
    if (startValue) {
      const h = startValue.slice(0, 2)
      const m = startValue.slice(3, 5)
      const btnH = startHoursRef.current?.querySelector(
        `button[data-hour="${h}"]`
      ) as HTMLElement | null
      const btnM = startMinutesRef.current?.querySelector(
        `button[data-minute="${m}"]`
      ) as HTMLElement | null
      btnH?.scrollIntoView({ block: "nearest", behavior: "auto" })
      btnM?.scrollIntoView({ block: "nearest", behavior: "auto" })
    }
  }, [startValue])

  useEffect(() => {
    if (endValue) {
      const h = endValue.slice(0, 2)
      const m = endValue.slice(3, 5)
      const btnH = endHoursRef.current?.querySelector(
        `button[data-hour="${h}"]`
      ) as HTMLElement | null
      const btnM = endMinutesRef.current?.querySelector(
        `button[data-minute="${m}"]`
      ) as HTMLElement | null
      btnH?.scrollIntoView({ block: "nearest", behavior: "auto" })
      btnM?.scrollIntoView({ block: "nearest", behavior: "auto" })
    }
  }, [endValue])

  function selectStartHour(h: string) {
    setStartHour(h)
    onStartChange?.(`${h}:${startMinute}`)
  }

  function selectStartMinute(m: string) {
    setStartMinute(m)
    onStartChange?.(`${startHour}:${m}`)
  }

  function selectEndHour(h: string) {
    setEndHour(h)
    onEndChange?.(`${h}:${endMinute}`)
  }

  function selectEndMinute(m: string) {
    setEndMinute(m)
    onEndChange?.(`${endHour}:${m}`)
  }

  return (
    <div className="w-[18rem] space-y-4 py-2">
      <div className="grid grid-cols-2 gap-2">
        <section className="space-y-4">
          <header className="flex h-7 flex-col px-2 font-medium">
            <span>{startTitle}</span>
            <span className="text-[10px] text-muted-foreground">
              {startDescription}
            </span>
          </header>
          <div className="grid grid-cols-2">
            <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
              Hours
            </div>
            <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
              Minutes
            </div>
            <ScrollArea ref={startHoursRef} className="col-span-1 h-50 px-2">
              {Hours.map((h) => (
                <Button
                  key={h}
                  data-hour={h}
                  variant={h === startHour ? "default" : "ghost"}
                  size="xs"
                  className="w-full"
                  disabled={isStartHourDisabled(h)}
                  onClick={() => selectStartHour(h)}
                >
                  {h}
                </Button>
              ))}
            </ScrollArea>
            <ScrollArea ref={startMinutesRef} className="col-span-1 h-50 px-2">
              {Minutes.map((m) => (
                <Button
                  key={m}
                  data-minute={m}
                  variant={m === startMinute ? "default" : "ghost"}
                  size="xs"
                  className="w-full"
                  disabled={isStartMinuteDisabled(m)}
                  onClick={() => selectStartMinute(m)}
                >
                  {m}
                </Button>
              ))}
            </ScrollArea>
          </div>
        </section>

        <section className="space-y-4">
          <header className="flex h-7 flex-col px-2 font-medium">
            <span>{endTitle}</span>
            <span className="text-[10px] text-muted-foreground">
              {endDescription}
            </span>
          </header>
          <div className="grid grid-cols-2">
            <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
              Hours
            </div>
            <div className="col-span-1 mx-auto text-[12px] text-muted-foreground">
              Minutes
            </div>
            <ScrollArea ref={endHoursRef} className="col-span-1 h-50 px-2">
              {Hours.map((h) => (
                <Button
                  key={h}
                  data-hour={h}
                  variant={h === endHour ? "default" : "ghost"}
                  size="xs"
                  className="w-full"
                  disabled={isEndHourDisabled(h)}
                  onClick={() => selectEndHour(h)}
                >
                  {h}
                </Button>
              ))}
            </ScrollArea>
            <ScrollArea ref={endMinutesRef} className="col-span-1 h-50 px-2">
              {Minutes.map((m) => (
                <Button
                  key={m}
                  data-minute={m}
                  variant={m === endMinute ? "default" : "ghost"}
                  size="xs"
                  className="w-full"
                  disabled={isEndMinuteDisabled(m)}
                  onClick={() => selectEndMinute(m)}
                >
                  {m}
                </Button>
              ))}
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  )
}
