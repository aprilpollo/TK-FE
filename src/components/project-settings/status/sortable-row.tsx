import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StatusEditor } from "./editor"
import { getContrastColor } from "@/utils/color"
import type { Status } from "./types"

export function SortableStatusRow({
  status,
  isEditing,
  draft,
  setDraft,
  onEdit,
  onSave,
  onCancel,
  onRemove,
}: {
  status: Status
  isEditing: boolean
  draft: Status | null
  setDraft: (s: Status) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRemove: () => void
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id, disabled: isEditing })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("px-4 py-3", isDragging && "opacity-50")}
    >
      {isEditing && draft ? (
        <StatusEditor
          draft={draft}
          setDraft={setDraft}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </button>
          <Badge
            variant="ghost"
            style={{
              backgroundColor: status.color,
              color: getContrastColor(status.color),
            }}
            className="rounded-sm text-xs"
          >
            {status.name}
          </Badge>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit status"
            onClick={onEdit}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete status"
            onClick={onRemove}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      )}
    </li>
  )
}
