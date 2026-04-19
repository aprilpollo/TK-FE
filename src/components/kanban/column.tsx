import type { KanbanColumnProps } from "@/types"
import { useMemo, useState, useEffect, useRef } from "react"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { KanbanCard } from "@/components/kanban/card"
import { CardOverlay } from "@/components/kanban/overlay"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GitMerge,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AddTask } from "@/components/kanban/add-task"
import { DropdownMenuColumn } from "@/components/kanban/dropdown-menu-column"
import useTask from "@/hooks/useTask"

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { columnPagination, loadMoreTasks } = useTask()
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (addTaskOpen && scrollContainerRef.current) {
      const viewport = scrollContainerRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      )
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }, [addTaskOpen])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.uuid,
    data: {
      type: "Column",
      column,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: `${column.color}0d`,
        }}
        className="relative flex h-fit max-h-[calc(100vh-165px)] w-66 shrink-0 flex-col items-start rounded-sm opacity-50"
      >
        <div className="sticky top-0 z-10 flex w-full items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Button
              style={{ color: column.color }}
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-grab rounded-sm active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            <Badge
              className="line-clamp-1 flex items-center gap-1 rounded-sm font-bold uppercase"
              style={{
                backgroundColor: `${column.color}1a`,
                color: column.color,
              }}
            >
              <GitMerge className="h-3.5 w-3.5" />
              {column.name}
            </Badge>
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="outline"
              style={{
                color: column.color,
                borderColor: `${column.color}50`,
              }}
            >
              {columnPagination[column.id]?.total ?? tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="w-full space-y-2 px-2 py-2">
          {tasks.map((task) => (
            <CardOverlay key={task.id} task={task} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-66 shrink-0 items-start rounded-sm"
    >
      <div
        className="rounded-sm"
        style={{ backgroundColor: `${column.color}0d` }}
      >
        <div
          data-slot="kanban-column-header"
          className="sticky top-0 z-10 flex w-full items-center justify-between p-2"
        >
          <div className="flex items-center gap-2">
            <Button
              {...attributes}
              {...listeners}
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-grab rounded-sm active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            <Badge
              className="line-clamp-1 flex items-center gap-1 rounded-sm font-bold uppercase"
              style={{
                backgroundColor: `${column.color}1a`,
                color: column.color,
              }}
            >
              <GitMerge className="h-3.5 w-3.5" />
              {column.name}
            </Badge>
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="outline"
            >
              {columnPagination[column.id]?.total ?? tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full"
              onClick={() => setAddTaskOpen(!addTaskOpen)}
            >
              <Plus className={cn("h-4 w-4", addTaskOpen && "rotate-45")} />
            </Button>
            <DropdownMenuColumn
              column={column}
              onAddTask={() => setAddTaskOpen(true)}
            />
          </div>
        </div>

        <div ref={scrollContainerRef}>
          <ScrollArea
            className="max-h-[calc(100vh-220px)] *:data-[slot=scroll-area-viewport]:max-h-[calc(100vh-220px)]!"
            onScrollCapture={(e) => {
              const target = e.target as HTMLElement
              const bottom =
                target.scrollHeight - target.scrollTop - target.clientHeight <
                50
              if (bottom) {
                loadMoreTasks(column.id)
              }
            }}
          >
            <SortableContext
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 px-2 py-2">
                {addTaskOpen && (
                  <AddTask
                    columnId={column.id}
                    setAddTaskOpen={setAddTaskOpen}
                  />
                )}
                {tasks.map((task) => (
                  <KanbanCard key={task.id} task={task} isFaded={addTaskOpen} />
                ))}
                {columnPagination[column.id]?.loading && (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </SortableContext>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
