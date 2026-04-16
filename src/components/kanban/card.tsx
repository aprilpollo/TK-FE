import type { KanbanCardProps } from "@/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"


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
      <div
        ref={setNodeRef}
        style={style}
        className="h-26.5 rounded-sm border bg-background px-1 pt-1 pb-1 opacity-50"
      ></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "rounded-sm border bg-background px-1 pt-1 pb-1 transition-all duration-200",
        isOverlay && "rotate-2 cursor-grabbing",
        isFaded && "pointer-events-none opacity-40"
      )}
    >
       <div className="relative flex flex-col h-26.5">
        <span className="text-sm font-medium pl-1 pb-1 hover:underline w-max">
          {task.title}
        </span>
        <div className="h-full">
          <span className="text-xs text-neutral-500 line-clamp-3 px-1">
            {task.description}
          </span>
        </div>
         <div className="absolute bottom-0 flex justify-between items-center w-full ">
        </div>
       </div>
    </div>
  )
}
