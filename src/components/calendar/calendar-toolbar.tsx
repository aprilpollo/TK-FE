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
    <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrev}
            aria-label="Previous"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            aria-label="Next"
          >
            <ChevronRight />
          </Button>
        </div>
        <h2 className="ml-1 text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {legend}
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger className="w-25 cursor-pointer font-medium capitalize" size="sm">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {VIEWS.map((v) => (
                <SelectItem value={v.value} key={v.value} className="cursor-pointer font-medium capitalize" >
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
    </div>
  )
}

export default CalendarToolbar
