import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CalendarView } from "@/types"

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
  { value: "listWeek", label: "List" },
]

function CalendarToolbar({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreate,
  legend,
}: {
  title: string
  view: CalendarView
  onViewChange: (v: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onCreate: () => void
  legend?: React.ReactNode
}) {
  return (
    <header className="flex items-center justify-between px-2">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="xs" onClick={onToday}>
          Today
        </Button>
        <Button variant="outline" size="icon-xs" onClick={onPrev}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon-xs" onClick={onNext}>
          <ChevronRight />
        </Button>
        <h2 className="ml-2 text-lg font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-1">
        {legend}
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger
            className="w-25 cursor-pointer font-medium capitalize"
            size="sm"
          >
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {VIEWS.map((v) => (
                <SelectItem
                  value={v.value}
                  key={v.value}
                  className="cursor-pointer font-medium capitalize"
                >
                  {v.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button size="sm" onClick={onCreate}>
          <Plus />
          New event
        </Button>
      </div>
    </header>
  )
}

export default CalendarToolbar
