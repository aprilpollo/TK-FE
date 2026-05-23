import { GripVertical } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import type { Subtask } from "./types"

type SubtaskItemProps = {
  subtask: Subtask[]
  setSubtask: React.Dispatch<React.SetStateAction<Subtask[]>>
}

export function SubtaskItem({ subtask, setSubtask }: SubtaskItemProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSubtask((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <ul className="divide-y rounded-lg">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={subtask.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {subtask.length > 0 ? (
            subtask.map((st) => <SortableSubtask key={st.id} st={st} />)
          ) : (
            <li className="text-sm text-muted-foreground italic">
              No subtasks yet.
            </li>
          )}
        </SortableContext>
      </DndContext>
    </ul>
  )
}

function SortableSubtask({ st }: { st: Subtask }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: st.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 bg-background py-2",
        isDragging && "opacity-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="line-clamp-1 flex-1 text-sm">{st.title}</span>
      <Checkbox />
    </li>
  )
}
