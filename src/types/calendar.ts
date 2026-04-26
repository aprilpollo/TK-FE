export type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek"

export type EventCategory = "task" | "milestone" | "meeting" | "deadline"

export type CalendarEvent = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  category: EventCategory
  description?: string
  priority?: CalendarPriority
}

export type GroupingOption = {
  id: string | number
  name: string
  color: string
}

export type CalendarPriority = {
  id: string | number
  name: string
  color: string
}
