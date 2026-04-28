import { useEffect, useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import type {
  DateSelectArg,
  EventClickArg,
  EventChangeArg,
} from "@fullcalendar/core"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flag } from "lucide-react"
import CalendarToolbar from "@/components/calendar/calendar-toolbar"
import EventDialog from "@/components/calendar/event-dialog"
import {
  CalendarEventContent,
  DraggingContext,
} from "@/components/calendar/calendar-event-content"
import { useCalendarData } from "@/hooks/useCalendarData"
import type { CalendarEvent, CalendarView } from "@/types"
import useProject from "@/hooks/useProject"

function Calendar() {
  const { project } = useProject()
  if (!project) return <div>Loading...</div>

  const calendarRef = useRef<FullCalendar | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [view, setView] = useState<CalendarView>("dayGridMonth")
  const [title, setTitle] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<CalendarEvent> | null>(null)

  const { events, setEvents, group, priority } = useCalendarData(
    project.id.toString()
  )

  const api = () => calendarRef.current?.getApi()

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    let raf = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        calendarRef.current?.getApi().updateSize()
      )
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  function syncTitle() {
    const t = api()?.view.title
    if (t) setTitle(t)
  }

  function handleViewChange(v: CalendarView) {
    api()?.changeView(v)
    setView(v)
    syncTitle()
  }

  function openCreateDialog(initial?: Partial<CalendarEvent>) {
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

  function handleSave(evt: CalendarEvent) {
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
    <div className="space-y-3 pt-3">
      <CalendarToolbar
        title={title || api()?.view.title || ""}
        view={view}
        onViewChange={handleViewChange}
        onPrev={() => {
          api()?.prev()
          syncTitle()
        }}
        onNext={() => {
          api()?.next()
          syncTitle()
        }}
        onToday={() => {
          api()?.today()
          syncTitle()
        }}
        onCreate={() => openCreateDialog()}
        legend={
          <>
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger
                className="cursor-pointer font-medium capitalize"
                size="sm"
              >
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel className="font-medium">Priority</SelectLabel>
                  {priority.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id.toString()}
                      className="cursor-pointer space-x-0 font-medium capitalize"
                    >
                      <Flag
                        className="size-3.5"
                        style={{ color: p.color, fill: p.color }}
                      />
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger
                className="cursor-pointer font-medium capitalize"
                size="sm"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel className="font-medium">Status</SelectLabel>
                  {group.map((g) => (
                    <SelectItem
                      key={g.id}
                      value={g.id.toString()}
                      className="cursor-pointer font-medium capitalize"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: g.color }}
                        />
                        {g.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        }
      />

      <div ref={wrapperRef}>
        <DraggingContext.Provider value={dragging}>
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
            height="calc(100vh - 147px)"
            timeZone="Asia/Bangkok"
            events={events}
            editable
            selectable
            selectAllow={(info) => info.start >= new Date()}
            eventAllow={(dropInfo, movingEvent) => {
              const now = new Date()
              const isResize =
                movingEvent?.start != null &&
                dropInfo.start.getTime() === movingEvent.start.getTime()
              return isResize
                ? (dropInfo.end ?? dropInfo.start) >= now
                : dropInfo.start >= now
            }}
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
            eventDragStart={() => setDragging(true)}
            eventDragStop={() => setDragging(false)}
            eventResizeStart={() => setDragging(true)}
            eventResizeStop={() => setDragging(false)}
            eventContent={(arg) => <CalendarEventContent arg={arg} />}
          />
        </DraggingContext.Provider>
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

export default Calendar
