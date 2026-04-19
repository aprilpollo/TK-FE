import type { KanbanCardProps } from "@/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { CalendarClock, Flag, MessageCircle, Paperclip } from "lucide-react"
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
import { DropdownMenuTask } from "@/components/kanban/dropdown-menu-task"
import { formatDatev2 } from "@/utils/date"

export function KanbanCard({
  task,
  isOverlay = false,
  isFaded = false,
}: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isOverlay,
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="max-h-35.25 gap-0 rounded-sm border py-2 opacity-50 ring-0"
      >
        <CardHeader className="px-2">
          <CardTitle className="flex h-6 items-center justify-between text-sm">
            <span className="line-clamp-1">{task.title}</span>
          </CardTitle>
          <CardDescription className="space-y-2 pb-2">
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
        <CardFooter className="flex items-center justify-between rounded-none border-none bg-card px-2 py-2">
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
            {task.assignees && task.assignees.length > 3 && (
              <AvatarGroupCount className="size-5 text-xs">
                {task.assignees.length - 3}
              </AvatarGroupCount>
            )}
          </AvatarGroup>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      data-slot="kanban-card"
      className={cn(
        "group max-h-35.25 cursor-pointer gap-0 rounded-sm border py-2 ring-0 active:cursor-grabbing",
        isOverlay && "cursor-grabbing",
        isFaded && "pointer-events-none opacity-40"
      )}
    >
      <CardHeader className="px-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="line-clamp-1">{task.title}</span>
          <DropdownMenuTask task={task} />
        </CardTitle>
        <CardDescription className="space-y-2 pb-2">
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
              <Flag
                className="size-3"
                style={{
                  color: task.priority?.color,
                  fill: task.priority?.color,
                }}
              />
              {task.priority?.name || "No Priority"}
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between rounded-none border-none bg-card px-2 py-2">
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
          {task.assignees && task.assignees.length > 3 && (
            <AvatarGroupCount className="size-5 text-xs">
              {task.assignees.length - 3}
            </AvatarGroupCount>
          )}
        </AvatarGroup>
      </CardFooter>
    </Card>
  )
}
