import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek"

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
  { value: "listWeek", label: "List" },
]

function TimelineToolbar({
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
    <div className="flex flex-col gap-3 border-b py-3 lg:flex-row lg:items-center lg:justify-between">
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
        <div
          role="tablist"
          className="inline-flex items-center rounded-lg border bg-card p-0.5"
        >
          {VIEWS.map((v) => {
            const active = view === v.value
            return (
              <button
                key={v.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onViewChange(v.value)}
                className={cn(
                  "h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            )
          })}
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus />
          New event
        </Button>
      </div>
    </div>
  )
}

export default TimelineToolbar
