import { CalendarClock, Flag, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDatev2 } from "@/utils/date"
import type { CalendarEvent } from "@/types"

export function CalendarTaskList({ events }: { events: CalendarEvent[] }) {
  return (
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
                          new Date(event.end) < new Date()
                            ? "destructive"
                            : "secondary"
                        }
                        className="rounded-md"
                      >
                        <CalendarClock className="size-3" />
                        {formatDatev2(event.end)}
                      </Badge>
                    )}
                    {event.priority && (
                      <Badge variant="secondary" className="rounded-md capitalize">
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
  )
}
