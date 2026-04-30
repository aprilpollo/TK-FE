import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { STATUS_COLORS, type Status } from "./types"

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
    <div className="space-y-2.5">
      <Input
        placeholder="Status name"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="sm:max-w-48"
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {STATUS_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setDraft({ ...draft, color: c.value })}
              aria-label={`Color ${c.label}`}
              style={{ backgroundColor: c.value }}
              className={cn(
                "size-5 rounded-full border-2 transition-transform hover:scale-110",
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
