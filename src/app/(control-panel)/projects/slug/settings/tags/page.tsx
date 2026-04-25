import { useState } from "react"
import { toast } from "sonner"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"
import { cn } from "@/lib/utils"

type Tag = {
  id: string
  name: string
  description?: string
  color: string
}

const COLORS = [
  { value: "slate", className: "bg-slate-500" },
  { value: "red", className: "bg-red-500" },
  { value: "orange", className: "bg-orange-500" },
  { value: "amber", className: "bg-amber-500" },
  { value: "emerald", className: "bg-emerald-500" },
  { value: "sky", className: "bg-sky-500" },
  { value: "blue", className: "bg-blue-500" },
  { value: "indigo", className: "bg-indigo-500" },
  { value: "violet", className: "bg-violet-500" },
  { value: "pink", className: "bg-pink-500" },
]

const INITIAL_TAGS: Tag[] = [
  { id: "1", name: "bug", description: "Something isn't working", color: "red" },
  {
    id: "2",
    name: "feature",
    description: "New functionality or enhancement",
    color: "blue",
  },
  {
    id: "3",
    name: "documentation",
    description: "Improvements to docs",
    color: "sky",
  },
  { id: "4", name: "good first issue", color: "emerald" },
  { id: "5", name: "help wanted", color: "violet" },
]

function colorClass(color: string) {
  return COLORS.find((c) => c.value === color)?.className ?? "bg-slate-500"
}

function TagsSettings() {
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Tag | null>(null)
  const [creating, setCreating] = useState(false)

  function startCreate() {
    setCreating(true)
    setDraft({ id: "new", name: "", description: "", color: "slate" })
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id)
    setDraft({ ...tag })
  }

  function cancel() {
    setEditingId(null)
    setCreating(false)
    setDraft(null)
  }

  function save() {
    if (!draft || !draft.name.trim()) {
      toast.error("Tag name is required")
      return
    }
    if (creating) {
      setTags((prev) => [...prev, { ...draft, id: String(Date.now()) }])
      toast.success("Tag created")
    } else {
      setTags((prev) => prev.map((t) => (t.id === draft.id ? draft : t)))
      toast.success("Tag updated")
    }
    cancel()
  }

  function remove(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id))
    toast.success("Tag deleted")
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Labels & Tags"
        description="Organize tasks using labels. They appear as chips on tasks and in filters."
        action={
          <Button size="sm" onClick={startCreate} disabled={creating}>
            <Plus />
            New label
          </Button>
        }
      />

      <SettingsSection
        title={`${tags.length} labels`}
        description="Click a label to edit. Deleting a label removes it from all tasks."
      >
        <ul className="divide-y rounded-lg border">
          {creating && draft && (
            <li className="px-4 py-3">
              <TagEditor
                draft={draft}
                setDraft={setDraft}
                onSave={save}
                onCancel={cancel}
              />
            </li>
          )}
          {tags.map((tag) => (
            <li key={tag.id} className="px-4 py-3">
              {editingId === tag.id && draft ? (
                <TagEditor
                  draft={draft}
                  setDraft={setDraft}
                  onSave={save}
                  onCancel={cancel}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
                      colorClass(tag.color)
                    )}
                  >
                    {tag.name}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {tag.description || (
                      <span className="italic">No description</span>
                    )}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit tag"
                    onClick={() => startEdit(tag)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete tag"
                    onClick={() => remove(tag.id)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              )}
            </li>
          ))}
          {tags.length === 0 && !creating && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground italic">
              No labels yet
            </li>
          )}
        </ul>
      </SettingsSection>
    </div>
  )
}

function TagEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Tag
  setDraft: (t: Tag) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Label name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="sm:max-w-48"
        />
        <Input
          placeholder="Description (optional)"
          value={draft.description ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, description: e.target.value })
          }
          className="flex-1"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setDraft({ ...draft, color: c.value })}
              aria-label={`Color ${c.value}`}
              className={cn(
                "size-5 rounded-full border-2 transition-transform hover:scale-110",
                c.className,
                draft.color === c.value
                  ? "border-foreground"
                  : "border-transparent"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X />
            Cancel
          </Button>
          <Button size="sm" onClick={onSave}>
            <Check />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TagsSettings
