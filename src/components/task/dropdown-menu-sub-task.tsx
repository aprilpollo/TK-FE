import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CalendarClock,
  Check,
  Copy,
  Ellipsis,
  Flag,
  Layers,
  Pencil,
  Trash2,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { createSubtask, updateSubtask , fetchPriorities } from "@/api/task"
import { toDateTimeStringFromUnixMs } from "@/utils/date"
import { toast } from "sonner"
import { DateTimePicker, type DateTimeValue } from "@/components/date-picker"
import { format, parseISO } from "date-fns"
import type { Subtask } from "./types"

interface Props {
  task: Subtask
  setSubtask?: React.Dispatch<React.SetStateAction<Subtask[]>>
}

export function DropdownMenuSubTask({ task, setSubtask }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameInput, setRenameInput] = useState(task.name)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [dueDateValue, setDueDateValue] = useState<DateTimeValue>({
    start: task.start_date ? toDateTimeStringFromUnixMs(task.start_date) : "",
    end: task.end_date ? toDateTimeStringFromUnixMs(task.end_date) : "",
    allDay: task.all_day ?? false,
  })

    const [priority, setPriority] = useState<
    { id: string | number; name: string; description: string; color: string }[]
  >([])


    useEffect(() => {
      async function loadPriorities() {
        try {
          const res = await fetchPriorities()
          const data = (await res.json()) as {
            code: number
            error: string | null
            message: string
            payload: { id: string | number; name: string; description: string; color: string }[]
          }
          if (data.error) throw new Error(data.error)
          setPriority(data.payload)
        } catch (error) {
          toast.warning("Failed to load priorities. Please try again.", {
            position: "top-center",
          })
          console.error("Error fetching priorities:", error)
        }
      }
      loadPriorities()
    }, [])

  // ── Rename ─────────────────────────────────────────────────
  const handleRename = async () => {
    const trimmed = renameInput.trim()
    if (!trimmed || trimmed === task.name) {
      setRenameOpen(false)
      return
    }
    try {
      const res = await updateSubtask(task.task_id, task.id, { name: trimmed })
      if (!res.ok) throw new Error()
      setSubtask?.((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, name: trimmed } : t))
      )
      setRenameOpen(false)
    } catch {
      toast.error("Failed to rename task")
    }
  }

  // // ── Copy name ──────────────────────────────────────────────
  const handleCopyName = () => {
    navigator.clipboard.writeText(task.name)
    toast.success("Copied to clipboard")
  }

  // // ── Change Priority ────────────────────────────────────────
  const handleChangePriority = async (p: (typeof priority)[number] | null) => {
    try {
      const res = await updateSubtask(task.task_id, task.id, {
        priority_id: p?.id ?? null,
      })
      if (!res.ok) throw new Error()
      setSubtask?.((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, priority: p ?? undefined } : t
        )
      )
    } catch {
      toast.error("Failed to update priority")
    }
  }

  // // ── Set Due Date ───────────────────────────────────────────
  const handleSetDueDate = async (date: DateTimeValue | undefined) => {
    try {
      const res = await updateSubtask(task.task_id, task.id, {
        start_date: date?.start ? new Date(date.start).getTime() : null,
        end_date: date?.end ? new Date(date.end).getTime() : null,
        all_day: date?.allDay,
      })
      if (!res.ok) throw new Error()
      setSubtask?.((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                start_date: date?.start
                  ? new Date(date.start).getTime()
                  : null,
                end_date: date?.end ? new Date(date.end).getTime() : null,
                all_day: date?.allDay ?? null,
              }
            : t
        )
      )
      setDropdownOpen(false)
      toast.success(date ? "Due date updated" : "Due date cleared")
    } catch {
      toast.error("Failed to update due date")
    }
  }

  // ── Duplicate ──────────────────────────────────────────────
  const handleDuplicate = async () => {
    try {
      const res = await createSubtask(task.task_id, {
        name: `${task.name} (copy)`,
        start_date: task.start_date ?? Date.now(),
        end_date: task.end_date ?? task.start_date ?? Date.now(),
        all_day: task.all_day ?? false,
        priority_id: task.priority?.id,
        assignee_ids: task.assignees?.map((a) => Number(a.id)),
      })
      if (!res.ok) throw new Error()
      toast.success("Subtask duplicated")
    } catch {
      toast.error("Failed to duplicate subtask")
    }
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="cursor-pointer"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setRenameInput(task.name)
                setRenameOpen(true)
              }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Rename
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem 
             onClick={handleCopyName}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
              Copy name
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Flag
                  className="h-4 w-4"
                  style={
                    task.priority
                      ? {
                          color: task.priority.color,
                          fill: task.priority.color,
                        }
                      : undefined
                  }
                />
                Priority
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {priority.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleChangePriority(p)}
                    className="capitalize"
                  >
                    <Flag
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: p.color, fill: p.color }}
                    />
                    {p.name}
                    {task.priority?.id === p.id && (
                      <Check className="ml-auto h-3.5 w-3.5" />
                    )}
                  </DropdownMenuItem>
                ))}
                {task.priority && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleChangePriority(null)}
                      className="text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear priority
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span>Due date</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <DateTimePicker
                  value={dueDateValue}
                  onChange={setDueDateValue}
                  footer={
                    <div className="flex items-center justify-end gap-1">
                      {dueDateValue.start && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground"
                          onClick={() => {
                            setDueDateValue({
                              start: "",
                              end: "",
                              allDay: true,
                            })
                            handleSetDueDate(undefined)
                          }}
                        >
                          <X className="h-3 w-3" />
                          Clear
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        variant="secondary"
                        onClick={() => handleSetDueDate(dueDateValue)}
                      >
                        {dueDateValue.start ? (
                          dueDateValue.allDay ? (
                            <>
                              Apply {format(parseISO(dueDateValue.end), "PP")}
                            </>
                          ) : (
                            <>
                              Apply{" "}
                              {format(
                                parseISO(dueDateValue.start),
                                "EEEEEE d HH:mm"
                              )}
                              <span>{` - ${format(parseISO(dueDateValue.end), "HH:mm")}`}</span>
                            </>
                          )
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  }
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>

          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={handleDuplicate}
            >
              <Layers className="h-4 w-4 text-muted-foreground" />
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Task</DialogTitle>
            <DialogDescription>
              Enter a new name for this task.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
           onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={renameInput.trim().length < 1}
              onClick={handleRename}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              "{task.name}" will be permanently deleted. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
