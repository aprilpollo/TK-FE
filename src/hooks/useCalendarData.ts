import { useEffect, useState } from "react"
import {
  fetchCalendarEvents,
  fetchCalendarEventsPriorities,
  fetchCalendarEventsStatus,
} from "@/api/calendar"
import type { CalendarEvent, CalendarPriority, GroupingOption } from "@/types"

export function useCalendarData(projectId: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [group, setGroup] = useState<GroupingOption[]>([])
  const [priority, setPriority] = useState<CalendarPriority[]>([])

  useEffect(() => {
    async function loadPriorities() {
      try {
        const res = await fetchCalendarEventsPriorities()
        if (!res.ok) throw new Error("Failed to fetch priorities")
        const data = (await res.json()) as { payload: CalendarPriority[] }
        setPriority(data.payload)
      } catch (e) {
        console.error(e)
      }
    }

    async function loadStatuses() {
      try {
        const res = await fetchCalendarEventsStatus(projectId)
        if (!res.ok) throw new Error("Failed to fetch statuses")
        const data = (await res.json()) as { payload: GroupingOption[] }
        setGroup(data.payload)
      } catch (e) {
        console.error(e)
      }
    }

    async function loadEvents() {
      try {
        const res = await fetchCalendarEvents(projectId)
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = (await res.json()) as { payload: CalendarEvent[] }
        setEvents(data.payload)
      } catch (e) {
        console.error(e)
      }
    }

    loadPriorities()
    loadStatuses()
    loadEvents()
  }, [projectId])

  return { events, setEvents, group, priority }
}
