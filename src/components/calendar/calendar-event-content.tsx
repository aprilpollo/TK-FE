import { createContext, useContext, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { EventContentArg } from "@fullcalendar/core"
import { ClockFading, Dot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { getContrastColor } from "@/utils/color"
import { CATEGORY_META } from "@/components/calendar/event-dialog"
import type { EventCategory, GroupingOption } from "@/types"

export const DraggingContext = createContext(false)

function getSegmentRounded(isStart: boolean, isEnd: boolean, isMonth: boolean) {
  if (!isMonth) return "rounded-sm"
  if (isStart && isEnd) return "rounded-sm"
  if (isStart) return "rounded-l-sm rounded-r-none"
  if (isEnd) return "rounded-r-sm rounded-l-none"
  return "rounded-none"
}

function EventTooltip({
  cursor,
  status,
  title,
  description,
}: {
  cursor: { x: number; y: number }
  status: GroupingOption | undefined
  title: string
  description: string
}) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        left: cursor.x + 12,
        top: cursor.y - 36,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <Item variant={null} className="rounded-md border-none bg-foreground p-2">
        <ItemContent>
          <ItemTitle className="gap-0 text-sm text-background">
            <Dot strokeWidth={6} color={status?.color} />
            <span className="font-medium capitalize">{status?.name}</span>
          </ItemTitle>
          <ItemDescription className="line-clamp-3 text-xs text-neutral-500">
            {title} {description}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>,
    document.body
  )
}

export function CalendarEventContent({ arg }: { arg: EventContentArg }) {
  const dragging = useContext(DraggingContext)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (dragging) setCursor(null)
  }, [dragging])

  const cat = arg.event.extendedProps.category as EventCategory | undefined
  const status = arg.event.extendedProps.status as GroupingOption | undefined
  const dotClass = cat ? CATEGORY_META[cat].dotClass : "bg-primary"
  const isList = arg.view.type === "listWeek"
  const isMonth = arg.view.type === "dayGridMonth"
  const rounded = getSegmentRounded(arg.isStart, arg.isEnd, isMonth)

  const statusStyle = status?.color
    ? { color: getContrastColor(status.color), backgroundColor: status.color }
    : undefined

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) setCursor({ x: e.clientX, y: e.clientY })
  }
  const handleMouseLeave = () => setCursor(null)

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
      <>
        <Badge
          variant="secondary"
          className={cn("w-full justify-start", rounded)}
          style={statusStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="flex items-center gap-1">
            <ClockFading className="size-3" />
            {arg.timeText}
          </span>
          <span className="truncate">{arg.event.title}</span>
        </Badge>
        {cursor && (
          <EventTooltip
            cursor={cursor}
            status={status}
            title={arg.event.title}
            description={arg.event.extendedProps.description}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Badge
        variant="secondary"
        className={cn("h-full w-full items-start justify-start", rounded)}
        style={statusStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="truncate">{arg.event.title}</span>
      </Badge>
      {cursor && (
        <EventTooltip
          cursor={cursor}
          status={status}
          title={arg.event.title}
          description={arg.event.extendedProps.description}
        />
      )}
    </>
  )
}
