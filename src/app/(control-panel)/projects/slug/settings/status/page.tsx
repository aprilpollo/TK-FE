import { useState } from "react"
import { toast } from "sonner"
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"
import { SortableStatusRow } from "@/components/project-settings/status/sortable-row"
import { TemplateCard } from "@/components/project-settings/status/template-card"
import {
  INITIAL_STATUSES,
  STATUS_TEMPLATES,
  type Status,
  type StatusTemplate,
} from "@/components/project-settings/status/types"

function StatusSettings() {
  const [statuses, setStatuses] = useState<Status[]>(INITIAL_STATUSES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Status | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setStatuses((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  function applyTemplate(template: StatusTemplate) {
    setStatuses(
      template.statuses.map((s, i) => ({ ...s, id: String(Date.now() + i) }))
    )
    toast.success(`Applied "${template.name}" template`)
    cancel()
  }

  function startEdit(status: Status) {
    setEditingId(status.id)
    setDraft({ ...status })
  }

  function cancel() {
    setEditingId(null)
    setDraft(null)
  }

  function save() {
    if (!draft || !draft.name.trim()) {
      toast.error("Status name is required")
      return
    }
    setStatuses((prev) => prev.map((s) => (s.id === draft.id ? draft : s)))
    toast.success("Status updated")
    cancel()
  }

  function remove(id: string) {
    setStatuses((prev) => prev.filter((s) => s.id !== id))
    toast.success("Status deleted")
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Statuses"
        description="Define task statuses for this project. Use a template to get started quickly."
      />

      <SettingsSection
        title="Templates"
        description="Apply a preset to quickly configure your project statuses. This will replace your existing statuses."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {STATUS_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onApply={() => applyTemplate(template)}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title={`${statuses.length} status${statuses.length !== 1 ? "es" : ""}`}
        description="Click edit to modify a status. Deleting a status removes it from all tasks."
      >
        <ul className="divide-y rounded-lg">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={statuses.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {statuses.map((status) => (
                <SortableStatusRow
                  key={status.id}
                  status={status}
                  isEditing={editingId === status.id}
                  draft={draft}
                  setDraft={setDraft}
                  onEdit={() => startEdit(status)}
                  onSave={save}
                  onCancel={cancel}
                  onRemove={() => remove(status.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          {statuses.length === 0 && (
            <li className="px-4 py-8 text-center text-sm italic text-muted-foreground">
              No statuses yet — apply a template or create one manually.
            </li>
          )}
        </ul>
      </SettingsSection>
    </div>
  )
}

export default StatusSettings
