import { useEffect, useRef, useState } from "react"
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
import EventDialog, { CATEGORY_META } from "@/components/calendar/event-dialog"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CalendarToolbar from "@/components/calendar/calendar-toolbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarClock, Flag, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDatev2 } from "@/utils/date"
import type {
  EventCategory,
  CalendarEvent,
  CalendarView,
  GroupingOption,
  CalendarPriority,
} from "@/types"
import {
  fetchCalendarEvents,
  fetchCalendarEventsPriorities,
  fetchCalendarEventsStatus,
} from "@/api/calendar"
import { getContrastColor } from "@/utils/color"
import useProject from "@/hooks/useProject"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function Calendar() {
  const { project } = useProject()
  if (!project) {
    return <div>Loading...</div>
  }
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

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<CalendarView>("dayGridMonth")
  const [group, setGroup] = useState<GroupingOption[]>([])
  const [priority, setPriority] = useState<CalendarPriority[]>([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")
  const [title, setTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<CalendarEvent> | null>(null)

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

  const FetchCalendarEventsPriorities = async () => {
    try {
      const response = await fetchCalendarEventsPriorities()
      if (!response.ok) {
        throw new Error("Failed to fetch priorities")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: CalendarPriority[]
      }
      setPriority(data.payload)
    } catch (error) {
      console.error("Error fetching priorities:", error)
    }
  }

  const FetchCalendarEventsStatus = async () => {
    try {
      const response = await fetchCalendarEventsStatus(project.id)
      if (!response.ok) {
        throw new Error("Failed to fetch statuses")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: GroupingOption[]
      }
      setGroup(data.payload)
    } catch (error) {
      console.error("Error fetching statuses:", error)
    }
  }

  const FetchCalendarEvents = async () => {
    try {
      const response = await fetchCalendarEvents(project.id)
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: CalendarEvent[]
      }
      setEvents(data.payload)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  useEffect(() => {
    FetchCalendarEventsPriorities()
    FetchCalendarEventsStatus()
    FetchCalendarEvents()
  }, [project])

  return (
    <div className="pt-4 pl-1">
      <CalendarToolbar
        title={title || api()?.view.title || ""}
        view={view}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
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
                          className={cn("size-2 rounded-full", g.color)}
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

      <div ref={wrapperRef} className="mt-4 grid grid-cols-6 gap-2">
        <div className="col-span-1 space-y-2">
          <header className="flex h-[35.5px] items-center justify-between gap-2 border-b">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Button size="icon-sm" variant="ghost">
              <Search className="size-4" />
            </Button>
          </header>
          <ScrollArea className="h-[calc(100vh-245px)] *:data-[slot=scroll-area-scrollbar]:hidden">
            <div className="space-y-2 py-2">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="gap-0 rounded-sm border py-1 ring-0"
                >
                  <CardHeader className="px-2">
                    <CardTitle className="flex h-6 items-center justify-between text-sm">
                      <span className="line-clamp-1">{event.title}</span>
                    </CardTitle>
                    <CardDescription className="space-y-2 pb-2">
                      <div className="line-clamp-2 max-h-8.25 text-xs">
                        {event.description}
                      </div>
                      <div className="flex items-center gap-1">
                        {event.end && (
                          <Badge
                            variant={
                              event.end
                                ? new Date(event.end) < new Date()
                                  ? "destructive"
                                  : "secondary"
                                : "secondary"
                            }
                            className="rounded-md"
                          >
                            <CalendarClock className="size-3" />
                            {formatDatev2(event.end)}
                          </Badge>
                        )}
                        {event.priority && (
                          <Badge
                            variant="secondary"
                            className="rounded-md capitalize"
                          >
                            <Flag
                              className="size-3"
                              style={{
                                color: event.priority.color,
                                fill: event.priority.color,
                              }}
                            />
                            {event.priority.name}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-5">
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
            height="calc(100vh - 190px)"
            events={events}
            editable
            selectable
            selectAllow={(info) => info.start >= startOfToday()}
            eventAllow={(dropInfo) => dropInfo.start >= startOfToday()}
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

function getSegmentRounded(isStart: boolean, isEnd: boolean) {
  if (isStart && isEnd) return "rounded-sm"
  if (isStart) return "rounded-l-sm rounded-r-none"
  if (isEnd) return "rounded-r-sm rounded-l-none"
  return "rounded-none"
}

function renderEventContent(arg: EventContentArg) {
  const cat = arg.event.extendedProps.category as EventCategory | undefined
  const status = arg.event.extendedProps.status as GroupingOption | undefined
  const dotClass = cat ? CATEGORY_META[cat].dotClass : "bg-primary"
  const isList = arg.view.type === "listWeek"
  const isMonth = arg.view.type === "dayGridMonth"
  const rounded = getSegmentRounded(arg.isStart, arg.isEnd)

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
      <Badge
        variant="secondary"
        className={cn("w-full justify-start truncate", rounded)}
      >
        {arg.timeText && (
          <span className="font-mono text-[10px]">{arg.timeText}</span>
        )}
        <span className="truncate">{arg.event.title}</span>
      </Badge>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("w-full justify-start truncate", rounded)}
          style={
            status?.color
              ? {
                  backgroundColor: `${status.color}`,
                  color: getContrastColor(status.color),
                }
              : undefined
          }
        >
          <span className="truncate">{arg.event.title}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default Calendar
