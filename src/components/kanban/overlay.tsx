import type { Task } from "@/types"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { formatDatev2 } from "@/utils/date"
import { CalendarClock, Flag, MessageCircle, Paperclip } from "lucide-react"

export function CardOverlay({ task }: { task: Task }) {
  return (
    <Card className="max-h-35.25 gap-0 rounded-sm py-2 opacity-50 w-full">
      <CardHeader className="px-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{task.title}</span>
        </CardTitle>
        <CardDescription className="space-y-2 border-b pb-2">
          <div className="line-clamp-2 max-h-8.25 text-xs">
            {task.description}
          </div>
          <div className="flex items-center gap-1">
            {task.dueDate && (
              <Badge
                variant={
                  task.dueDate
                    ? new Date(task.dueDate) < new Date()
                      ? "destructive"
                      : "secondary"
                    : "secondary"
                }
                className="rounded-md"
              >
                <CalendarClock className="size-3" />
                {formatDatev2(task.dueDate)}
              </Badge>
            )}
            <Badge variant="secondary" className="rounded-md capitalize">
              <Flag className="size-3" color={task.priority?.color} />
              {task.priority?.name || "No Priority"}
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-none bg-background px-2 py-2">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            <MessageCircle className="size-3" />
            {task.comments_count || 0}
          </Badge>
          {task.attachments_count !== undefined &&
            task.attachments_count > 0 && (
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                <Paperclip className="size-3" />
                {task.attachments_count || 0}
              </Badge>
            )}
        </div>
        <AvatarGroup>
          {task.assignees?.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="size-5">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount className="size-5 text-xs">
            {(task.assignees?.length &&
              task.assignees.length -
                (task.assignees?.length
                  ? Math.min(task.assignees.length, 3)
                  : 0)) ||
              0}
          </AvatarGroupCount>
        </AvatarGroup>
      </CardFooter>
    </Card>
  )
}
