import { useEffect, useMemo, useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import type {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core"
import type { EventChangeArg } from "@fullcalendar/core"
import { toast } from "sonner"
import TimelineToolbar, {
  type CalendarView,
} from "@/components/timeline/timeline-toolbar"
import EventDialog, {
  CATEGORY_META,
  type EventCategory,
  type TimelineEvent,
} from "@/components/timeline/event-dialog"
import { cn } from "@/lib/utils"

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    title: "Sprint planning",
    start: addDays(0, 10, 0).toISOString(),
    end: addDays(0, 11, 30).toISOString(),
    category: "meeting",
    description: "Plan next sprint backlog and assign owners.",
  },
  {
    id: "2",
    title: "Auth refactor",
    start: dateAt(-2),
    end: dateAt(2),
    allDay: true,
    category: "task",
  },
  {
    id: "3",
    title: "v2.0 release",
    start: dateAt(8),
    allDay: true,
    category: "milestone",
  },
  {
    id: "4",
    title: "Submit compliance report",
    start: dateAt(5),
    allDay: true,
    category: "deadline",
  },
  {
    id: "5",
    title: "Design review",
    start: addDays(2, 14, 0).toISOString(),
    end: addDays(2, 15, 0).toISOString(),
    category: "meeting",
  },
]

function dateAt(offsetDays: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function addDays(offset: number, hour: number, minute: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, minute, 0, 0)
  return d
}

function Timeline() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    let raf = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        calendarRef.current?.getApi().updateSize()
      })
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  const [events, setEvents] = useState<TimelineEvent[]>(SAMPLE_EVENTS)
  const [view, setView] = useState<CalendarView>("dayGridMonth")
  const [title, setTitle] = useState("")
  const [activeFilters, setActiveFilters] = useState<Set<EventCategory>>(
    new Set(Object.keys(CATEGORY_META) as EventCategory[])
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<TimelineEvent> | null>(null)

  const filteredEvents = useMemo(
    () =>
      events
        .filter((e) => activeFilters.has(e.category))
        .map((e) => ({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          allDay: e.allDay,
          backgroundColor: CATEGORY_META[e.category].color,
          borderColor: CATEGORY_META[e.category].color,
          extendedProps: {
            category: e.category,
            description: e.description,
          },
        })),
    [events, activeFilters]
  )

  const api = () => calendarRef.current?.getApi()

  function handlePrev() {
    api()?.prev()
    syncTitle()
  }
  function handleNext() {
    api()?.next()
    syncTitle()
  }
  function handleToday() {
    api()?.today()
    syncTitle()
  }
  function handleViewChange(v: CalendarView) {
    api()?.changeView(v)
    setView(v)
    syncTitle()
  }
  function syncTitle() {
    const t = api()?.view.title
    if (t) setTitle(t)
  }

  function toggleFilter(cat: EventCategory) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function openCreateDialog(initial?: Partial<TimelineEvent>) {
    setEditing(initial ?? { allDay: true, category: "task" })
    setDialogOpen(true)
  }

  function handleSelect(arg: DateSelectArg) {
    openCreateDialog({
      start: arg.startStr,
      end: arg.endStr,
      allDay: arg.allDay,
      category: "task",
    })
    api()?.unselect()
  }

  function handleEventClick(arg: EventClickArg) {
    const evt = events.find((e) => e.id === arg.event.id)
    if (!evt) return
    setEditing(evt)
    setDialogOpen(true)
  }

  function handleEventChange(arg: EventChangeArg) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === arg.event.id
          ? {
              ...e,
              start: arg.event.startStr,
              end: arg.event.endStr || undefined,
              allDay: arg.event.allDay,
            }
          : e
      )
    )
    toast.success("Event updated")
  }

  function handleSave(evt: TimelineEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === evt.id)
      return exists
        ? prev.map((e) => (e.id === evt.id ? evt : e))
        : [...prev, evt]
    })
    setDialogOpen(false)
    toast.success(editing?.id ? "Event updated" : "Event created")
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setDialogOpen(false)
    toast.success("Event deleted")
  }

  return (
    <div className="px-4 py-4">
      <TimelineToolbar
        title={title || api()?.view.title || ""}
        view={view}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onCreate={() => openCreateDialog()}
        legend={
          <div className="hidden items-center gap-1 rounded-lg border bg-card p-0.5 md:flex">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
              const active = activeFilters.has(cat)
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleFilter(cat)}
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground opacity-60"
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      CATEGORY_META[cat].dotClass
                    )}
                  />
                  {CATEGORY_META[cat].label}
                </button>
              )
            })}
          </div>
        }
      />

      <div ref={wrapperRef} className="mt-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={view}
          headerToolbar={false}
          height="calc(100vh - 230px)"
          events={filteredEvents}
          editable
          selectable
          dayMaxEvents={3}
          weekends
          nowIndicator
          firstDay={1}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          buttonText={{ today: "Today" }}
          select={handleSelect}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          datesSet={syncTitle}
          eventContent={renderEventContent}
        />
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

function renderEventContent(arg: EventContentArg) {
  const cat = arg.event.extendedProps.category as EventCategory | undefined
  const dotClass = cat ? CATEGORY_META[cat].dotClass : "bg-primary"
  const isList = arg.view.type === "listWeek"
  const isMonth = arg.view.type === "dayGridMonth"

  if (isList) {
    return (
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", dotClass)} />
        <span className="font-medium">{arg.event.title}</span>
      </div>
    )
  }

  if (isMonth && !arg.event.allDay) {
    return (
      <div className="flex items-center gap-1.5 truncate px-1">
        <span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
        <span className="text-xs text-foreground/90">{arg.timeText}</span>
        <span className="truncate text-xs font-medium text-foreground">
          {arg.event.title}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 truncate">
      {arg.timeText && (
        <span className="font-mono text-[10px] opacity-80">
          {arg.timeText}
        </span>
      )}
      <span className="truncate">{arg.event.title}</span>
    </div>
  )
}

export default Timeline
