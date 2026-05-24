import { CalendarDays, Disc2, Flag, GitMerge, User } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import type { TaskDetail } from "./types"

type TaskInfoCardsProps = {
  task: TaskDetail
}

export function TaskInfoCards({ task }: TaskInfoCardsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <GitMerge className="size-3.5" /> Status
        </span>
        <Badge
          className="rounded-sm font-bold capitalize"
          style={{
            backgroundColor: `${task.status?.color}1a`,
            color: task.status?.color,
          }}
        >
          <Disc2 />
          {task.status?.name}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <Flag
            className="size-3.5"
            // style={{
            //   color: task.priority?.color,
            //   fill: task.priority?.color,
            // }}
          />
          Priority
        </span>
        <Badge
          className="rounded-sm font-bold capitalize"
          style={{
            backgroundColor: `${task.priority?.color}1a`,
            color: task.priority?.color,
          }}
        >
          {task.priority?.name || "No Priority"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5" /> Due Date
        </span>
        <Badge className="rounded-sm font-bold capitalize" variant="secondary">
          {task.startDate ? format(task.startDate, "MMM d, yyyy") : "—"} –{" "}
          {task.endDate ? format(task.endDate, "MMM d, yyyy") : "—"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5" /> Assignees
        </span>
        <AvatarGroup>
          {task.assignees?.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="size-5">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees && task.assignees.length > 3 && (
            <AvatarGroupCount className="size-5 text-xs">
              +{task.assignees.length - 3}
            </AvatarGroupCount>
          )}
        </AvatarGroup>
      </div>
    </div>
  )
}
