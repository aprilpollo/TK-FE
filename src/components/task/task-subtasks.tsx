import { useState } from "react"
import { GripVertical, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createSubtask } from "@/api/task"
import { FetchApiError } from "@/utils/apiFetch"
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

type CreateSubtaskInputProps = {
  taskId: string | number
  onCreated: (subtask: Subtask) => void
  onCancel: () => void
}

export function CreateSubtaskInput({
  taskId,
  onCreated,
  onCancel,
}: CreateSubtaskInputProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const res = await createSubtask(taskId, { name: trimmed })
      const data = (await res.json()) as {
        code: number
        error: string | null
        message: string
        payload: Subtask
      }
      if (data.error) throw new Error(data.error)
      onCreated(data.payload)
      setName("")
    } catch (err) {
      let message = "Failed to create subtask."
      if (err instanceof FetchApiError) {
        const body = err.data as { message?: string } | null
        message = body?.message ?? message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast.warning(message, { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="flex items-center gap-2 py-2">
      <span className="size-4 shrink-0" />
      <input
        autoFocus
        className="flex-1 border-b border-input bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        placeholder="Subtask name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit()
          if (e.key === "Escape") onCancel()
        }}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        aria-label="Confirm"
      >
        <Check className="size-4" />
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        aria-label="Cancel"
      >
        <X className="size-4" />
      </button>
    </li>
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
      <span className="line-clamp-1 flex-1 text-sm">{st.name}</span>
      <Checkbox />
    </li>
  )
}
