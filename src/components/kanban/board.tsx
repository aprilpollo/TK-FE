import type {
  BoardProps,
  Column,
  Task,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@/types"
import { useMemo, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  pointerWithin,
  // KeyboardSensor,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  // sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import { KanbanColumn } from "@/components/kanban/column"
import { KanbanCard } from "@/components/kanban/card"
import { AddGroup } from "@/components/kanban/add-group"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useTask from "@/hooks/useTask"

export function Board({ onDragEndColumn, onDragEndItem }: BoardProps) {
  const { columns, tasks, setColumns, setTasks } = useTask()
  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollAreaRef.current?.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']"
    )
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-slot='kanban-card'],[data-slot='kanban-column-header'],button,input,textarea,[role='button']")) return
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = "grabbing"
    }
    const onMouseLeave = () => { isDown = false; el.style.cursor = "" }
    const onMouseUp = () => { isDown = false; el.style.cursor = "" }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX)
    }

    el.addEventListener("mousedown", onMouseDown)
    el.addEventListener("mouseleave", onMouseLeave)
    el.addEventListener("mouseup", onMouseUp)
    el.addEventListener("mousemove", onMouseMove)
    return () => {
      el.removeEventListener("mousedown", onMouseDown)
      el.removeEventListener("mouseleave", onMouseLeave)
      el.removeEventListener("mouseup", onMouseUp)
      el.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Start dragging after 3px movement
      },
    }),
  )

  const columnsId = useMemo(() => columns.map((col) => col.uuid), [columns])

  // Pre-compute per-column task lists once instead of re-filtering inside every column render
  const tasksByColumn = useMemo(() => {
    const map = new Map<string | number, Task[]>()
    for (const task of tasks) {
      const list = map.get(task.columnId) ?? []
      list.push(task)
      map.set(task.columnId, list)
    }
    return map
  }, [tasks])

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const isActiveColumn = active.data.current?.type === "Column"
    if (isActiveColumn) {
      if (activeId === overId) return // Dropped on itself — nothing to reorder
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.uuid === activeId)
        const overIndex = columns.findIndex((col) => col.uuid === overId)
        return arrayMove(columns, activeIndex, overIndex)
      })
      if (onDragEndColumn) onDragEndColumn(event)
      return
    }

    const isActiveTask = active.data.current?.type === "Task"
    if (isActiveTask) {
      if (activeId === overId) return // No position change — skip state update and API call
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (activeIndex === -1 || overIndex === -1) return tasks

        // Cross-column moves are already committed in onDragOver; only handle same-column reorder here
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          return tasks
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
      if (onDragEndItem) onDragEndItem(event)
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    if (!isActiveTask) return

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId)
      const overIndex = prev.findIndex((t) => t.id === overId)

      if (activeIndex === -1) return prev

      const activeColumnId = prev[activeIndex].columnId

      const isOverColumn = over.data.current?.type === "Column"
      let overColumnId: number | string

      if (isOverColumn) {
        overColumnId = overId
      } else {
        // Dropping over a Task
        if (overIndex === -1) return prev // Safety check
        const overTask = prev[overIndex]
        if (!overTask) return prev // Safety check
        overColumnId = overTask.columnId
      }

      // 1. If columns are the SAME, do nothing in onDragOver.
      if (activeColumnId === overColumnId) {
        return prev
      }

      // 2. If columns are DIFFERENT, move the task to the new column.
      const newTasks = [...prev]
      newTasks[activeIndex] = {
        ...newTasks[activeIndex],
        columnId: overColumnId,
      }

      if (isOverColumn) {
        return arrayMove(newTasks, activeIndex, activeIndex)
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0
        const newIndex = overIndex >= 0 ? overIndex + modifier : prev.length + 1

        return arrayMove(newTasks, activeIndex, newIndex)
      }
    })
  }

  return (
    <ScrollArea ref={scrollAreaRef}>
      <div className="flex h-[calc(100svh-160px)] space-x-4 px-1">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          modifiers={[
            (args) => {
              if (args.active?.data.current?.type === "Column") {
                return restrictToHorizontalAxis(args)
              }
              return args.transform
            },
          ]}
        >
          <SortableContext
            items={columnsId}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((col) => (
              <KanbanColumn
                key={col.uuid}
                column={col}
                tasks={tasksByColumn.get(col.uuid) ?? []}
              />
            ))}
            <AddGroup />
          </SortableContext>

          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <KanbanColumn
                    column={activeColumn}
                    tasks={tasksByColumn.get(activeColumn.uuid) ?? []}
                  />
                )}
                {activeTask && <KanbanCard task={activeTask} isOverlay />}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
