import { CalendarDays, Flag, GitMerge, User } from "lucide-react"
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
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <h3 className="flex items-center gap-1 text-sm font-medium">
          <GitMerge className="h-3.5 w-3.5" />
          Status
        </h3>
        <Badge
          className="line-clamp-1 flex items-center gap-1 rounded-sm font-bold uppercase"
          style={{
            backgroundColor: `${task.status?.color}1a`,
            color: task.status?.color,
          }}
        >
          {task.status?.name}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="flex items-center gap-1 text-sm font-medium">
          <CalendarDays className="size-3" />
          Due Date
        </h3>
        <Badge variant="secondary" className="rounded-sm text-xs">
          {task.startDate
            ? format(task.startDate, "MMM d, yyyy")
            : "No Start Date"}{" "}
          -{" "}
          {task.endDate
            ? format(task.endDate, "MMM d, yyyy")
            : "No End Date"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="flex items-center gap-1 text-sm font-medium">
          <Flag
            className="size-3"
            style={{
              color: task.priority?.color,
              fill: task.priority?.color,
            }}
          />
          Priority
        </h3>
        <Badge variant="secondary" className="rounded-md capitalize">
          {task.priority?.name || "No Priority"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="flex items-center gap-1 text-sm font-medium">
          <User className="size-3" />
          Assignees
        </h3>
        <AvatarGroup>
          {task.assignees?.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="size-5">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees && task.assignees.length > 3 && (
            <AvatarGroupCount className="size-5 text-xs">
              {task.assignees.length - 3}
            </AvatarGroupCount>
          )}
        </AvatarGroup>
      </div>
    </div>
  )
}
