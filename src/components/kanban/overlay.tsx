import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/utils/date"
import { cn } from "@/lib/utils"
import { Calendar, Flag, Users } from "lucide-react"

export function CardOverlay({ task }: { task: Task }) {
  return (
    <div className="h-26.5 rounded-sm border bg-background px-1 pt-1 pb-1 opacity-50">
      <div className="flex flex-col">
        <span className="cursor-grab pb-2 pl-1 text-xs font-medium hover:underline active:cursor-grabbing">
          {task.title}
        </span>
        <Button
          variant="ghost"
          className="h-6 cursor-pointer items-center justify-start gap-1 rounded-lg pl-1"
        >
          <Users className="size-3.5 text-neutral-500" />
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.assignees?.map((assignee) => (
              <Avatar
                key={assignee.id}
                className="size-5 border-[1.2px] border-muted ring-muted"
              >
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback>{assignee.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Button>
        <Button
          variant="ghost"
          className="h-6 cursor-pointer items-center justify-start gap-1 rounded-lg pl-1"
        >
          <Calendar className="size-3.5 text-neutral-500" />
          <span
            className={cn(
              "text-xs",
              task.dueDate && new Date().toISOString() > task.dueDate
                ? "text-destructive"
                : "text-neutral-500"
            )}
          >
            {formatDate(task.dueDate)}
          </span>
        </Button>
        <Button
          variant="ghost"
          className="h-6 cursor-pointer items-center justify-start gap-1 rounded-lg pl-1"
        >
          <Flag
            className="size-3.5 text-neutral-500"
            style={{ color: task.priority?.color }}
          />
          <span className="text-xs font-medium text-neutral-500">
            {task.priority?.name || "-"}
          </span>
        </Button>
      </div>
    </div>
  )
}
