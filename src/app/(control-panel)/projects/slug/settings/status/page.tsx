import { useState, useEffect, useRef } from "react"
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
import {
  STATUS_TEMPLATES,
  type Status,
  type StatusTemplate,
} from "@/components/project-settings/status/types"
import { fetchTaskStatuses, createListTaskStatus } from "@/api/task"
import useProject from "@/hooks/useProject"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const randomId = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

function StatusSettings() {
  const { project } = useProject()
  if (!project) return <div>Loading...</div>
  const [statuses, setStatuses] = useState<Status[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Status | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const apiStatusesRef = useRef<Status[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  const FetchTaskStatuses = async () => {
    try {
      const response = await fetchTaskStatuses(project.id)
      if (!response.ok) {
        throw new Error("Failed to fetch task statuses")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: {
          id: number
          uuid: string
          name: string
          color: string
        }[]
      }
      const fetched = data.payload.map((s) => ({
        id: s.id.toString(),
        uuid: s.uuid,
        name: s.name,
        color: s.color,
      }))
      apiStatusesRef.current = fetched
      setStatuses(fetched)
    } catch (error) {
      console.error("Error fetching task statuses:", error)
    }
  }

  useEffect(() => {
    FetchTaskStatuses()
  }, [project])

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
setStatuses([
      ...apiStatusesRef.current,
      ...template.statuses.map((s) => ({ ...s, id: randomId() })),
    ])
    setSelectedTemplate("")
    setIsAdding(false)
    setEditingId(null)
    setDraft(null)
  }

  function startEdit(status: Status) {
    setEditingId(status.id)
    setDraft({ ...status })
  }

  function addStatus() {
    const newStatus: Status = {
      id: randomId(),
      name: "",
      color: "#94a3b8",
    }
    setStatuses((prev) => [...prev, newStatus])
    setEditingId(newStatus.id)
    setDraft(newStatus)
    setIsAdding(true)
  }

  function cancel() {
    if (isAdding && editingId) {
      setStatuses((prev) => prev.filter((s) => s.id !== editingId))
    }
    setIsAdding(false)
    setEditingId(null)
    setDraft(null)
  }

  function save() {
    if (!draft || !draft.name.trim()) {
      toast.error("Status name is required")
      return
    }
    setStatuses((prev) => prev.map((s) => (s.id === draft.id ? draft : s)))
    toast.success(isAdding ? "Status added" : "Status updated")
    setIsAdding(false)
    setEditingId(null)
    setDraft(null)
  }

  function remove(id: string) {
    setStatuses((prev) => prev.filter((s) => s.id !== id))
  }

  async function submit() {
    if (!project) return
    try {
      await createListTaskStatus({
        project_id: project.id,
        statuses,
      })
      toast.success("Statuses saved")
    } catch (error) {
      console.error("Error saving statuses:", error)
      toast.error("Failed to save statuses")
    }
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Statuses"
        description="Define task statuses for this project. Use a template to get started quickly."
      />

      <SettingsSection
        title={`${statuses.length} status${statuses.length !== 1 ? "es" : ""}`}
        description="Click edit to modify a status. Deleting a status removes it from all tasks."
        footer={
          <div className="flex justify-end gap-1 px-2">
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
            <Button size="sm" onClick={submit}>
              Save
            </Button>
          </div>
        }
      >
        <div className="mb-4 flex items-center justify-end gap-2 px-2">
          <Select
            value={selectedTemplate}
            onValueChange={(value) => {
              setSelectedTemplate(value)
              const template = STATUS_TEMPLATES.find((t) => t.id === value)
              if (template) applyTemplate(template)
            }}
          >
            <SelectTrigger className="w-full max-w-48 cursor-pointer" size="sm">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Templates</SelectLabel>
                {STATUS_TEMPLATES.map((template) => (
                  <SelectItem
                    key={template.id}
                    value={template.id}
                    className="cursor-pointer"
                  >
                    {template.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={addStatus}>
            Add Status
          </Button>
        </div>
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
                  isDelete={status.uuid ? true : false}
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
            <li className="px-4 py-8 text-center text-sm text-muted-foreground italic">
              No statuses yet — apply a template or create one manually.
            </li>
          )}
        </ul>
      </SettingsSection>
    </div>
  )
}

export default StatusSettings
