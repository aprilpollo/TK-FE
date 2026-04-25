import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type EventCategory = "task" | "milestone" | "meeting" | "deadline"

export type TimelineEvent = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  category: EventCategory
  description?: string
}

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; color: string; dotClass: string }
> = {
  task: { label: "Task", color: "#3b82f6", dotClass: "bg-blue-500" },
  milestone: {
    label: "Milestone",
    color: "#a855f7",
    dotClass: "bg-violet-500",
  },
  meeting: { label: "Meeting", color: "#10b981", dotClass: "bg-emerald-500" },
  deadline: { label: "Deadline", color: "#ef4444", dotClass: "bg-red-500" },
}

function toLocalInput(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toLocalDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function EventDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: Partial<TimelineEvent> | null
  onSave: (event: TimelineEvent) => void
  onDelete?: (id: string) => void
}) {
  const isEdit = Boolean(initial?.id)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<EventCategory>("task")
  const [allDay, setAllDay] = useState(true)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  useEffect(() => {
    if (!open) return
    setTitle(initial?.title ?? "")
    setDescription(initial?.description ?? "")
    setCategory(initial?.category ?? "task")
    const isAllDay = initial?.allDay ?? true
    setAllDay(isAllDay)
    setStart(
      isAllDay ? toLocalDate(initial?.start) : toLocalInput(initial?.start)
    )
    setEnd(isAllDay ? toLocalDate(initial?.end) : toLocalInput(initial?.end))
  }, [open, initial])

  function handleSave() {
    if (!title.trim() || !start) return
    onSave({
      id: initial?.id ?? `evt_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      allDay,
      start: allDay ? start : new Date(start).toISOString(),
      end: end ? (allDay ? end : new Date(end).toISOString()) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update event details below."
              : "Schedule a new event on the project timeline."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="evt-title">Title</Label>
            <Input
              id="evt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's happening?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as EventCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(CATEGORY_META) as EventCategory[]
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            CATEGORY_META[c].dotClass
                          )}
                        />
                        {CATEGORY_META[c].label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-between gap-3 rounded-lg border px-3 py-1.5">
              <div>
                <Label htmlFor="evt-allday" className="cursor-pointer text-sm">
                  All-day
                </Label>
                <p className="text-xs text-muted-foreground">No time slot</p>
              </div>
              <Switch
                id="evt-allday"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="evt-start">Start</Label>
              <Input
                id="evt-start"
                type={allDay ? "date" : "datetime-local"}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="evt-end">End</Label>
              <Input
                id="evt-end"
                type={allDay ? "date" : "datetime-local"}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="evt-desc">Description</Label>
            <Textarea
              id="evt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {isEdit && onDelete && initial?.id && (
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(initial.id!)}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || !start}>
              {isEdit ? "Save changes" : "Create event"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EventDialog
