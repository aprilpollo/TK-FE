import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type Status } from "./types"
import { ColorSectionPopover } from "@/components/color-section"

export function StatusEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Status
  setDraft: (s: Status) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex h-9 items-center justify-between">
      <div className="flex items-center p-1">
        <ColorSectionPopover
          color={draft.color}
          setColor={(color) => setDraft({ ...draft, color })}
        />
        <Input
          placeholder="Status name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="border-none focus-visible:ring-0 sm:max-w-48"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="xs" onClick={onCancel}>
          <X />
          Cancel
        </Button>
        <Button size="xs" onClick={onSave}>
          <Check />
          Save
        </Button>
      </div>
    </div>
  )
}
