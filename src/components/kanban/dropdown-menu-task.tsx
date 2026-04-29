import { useState } from "react"
import type { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
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
  ArrowRight,
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
import { createTask, deleteTask, reorderTasks, updateTask } from "@/api/task"
import useTask from "@/hooks/useTask"
import useProject from "@/hooks/useProject"
import { formatDatev2 } from "@/utils/date"
import { toast } from "sonner"
import { PopoverDateTimePicker, type DateTimeValue } from "@/components/date-picker"


interface Props {
  task: Task
}

export function DropdownMenuTask({ task }: Props) {
  const { project } = useProject()
  const {
    columns,
    tasks,
    priority,
    setTasks,
    setColumnPagination,
    FetchTaskByStatus,
  } = useTask()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameInput, setRenameInput] = useState(task.title)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [dueDateValue, setDueDateValue] = useState<DateRange | undefined>({
    from: task.startDate ? new Date(task.startDate) : undefined,
    to: task.endDate ? new Date(task.endDate) : undefined,
  })

  const otherColumns = columns
    .filter((c) => c.uuid !== task.columnId)
    .sort((a, b) => {
      const aPos = a.position ?? Infinity
      const bPos = b.position ?? Infinity
      return aPos - bPos
    })
  const currentCol = columns.find((c) => c.uuid === task.columnId)

  // ── Rename ─────────────────────────────────────────────────
  const handleRename = async () => {
    const trimmed = renameInput.trim()
    if (!trimmed || trimmed === task.title) {
      setRenameOpen(false)
      return
    }
    try {
      const res = await updateTask(task.id, { title: trimmed })
      if (!res.ok) throw new Error()
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: trimmed } : t))
      )
      setRenameOpen(false)
    } catch {
      toast.error("Failed to rename task")
    }
  }

  // ── Copy name ──────────────────────────────────────────────
  const handleCopyName = () => {
    navigator.clipboard.writeText(task.title)
    toast.success("Copied to clipboard")
  }

  // ── Change Priority ────────────────────────────────────────
  const handleChangePriority = async (p: (typeof priority)[number] | null) => {
    try {
      const res = await updateTask(task.id, {
        priority_id: p?.id ?? null,
      })
      if (!res.ok) throw new Error()
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, priority: p ?? undefined } : t
        )
      )
    } catch {
      toast.error("Failed to update priority")
    }
  }

  // ── Set Due Date ───────────────────────────────────────────
  const handleSetDueDate = async (date: DateRange | undefined) => {
    try {
      const res = await updateTask(task.id, {
        start_date: date?.from ? date.from : null,
        end_date: date?.to ? date.to : null,
      })
      if (!res.ok) throw new Error()
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                startDate: date?.from ? date.from : undefined,
                endDate: date?.to ? date.to : undefined,
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

  // ── Move to ────────────────────────────────────────────────
  const handleMoveTo = async (targetCol: (typeof columns)[number]) => {
    if (!project) return
    const tasksInTarget = tasks.filter((t) => t.columnId === targetCol.uuid)
    try {
      const res = await reorderTasks({
        project_id: project.id,
        updates: [
          {
            id: task.id,
            status_id: targetCol.uuid,
            position: tasksInTarget.length + 1,
          },
        ],
      })
      if (!res.ok) throw new Error()
      await Promise.all([
        currentCol ? FetchTaskByStatus(currentCol.id) : Promise.resolve(),
        FetchTaskByStatus(targetCol.id),
      ])
    } catch {
      toast.error("Failed to move task")
    }
  }

  // ── Duplicate ──────────────────────────────────────────────
  const handleDuplicate = async () => {
    if (!project || !currentCol) return
    try {
      const res = await createTask({
        project_id: project.id,
        status_id: currentCol.id,
        title: `${task.title} (copy)`,
        description: task.description,
        start_date: task.startDate,
        end_date: task.endDate,
        priority_id: task.priority?.id,
        assignees: task.assignees?.map((a) => a.id as number),
      })
      if (!res.ok) throw new Error()
      await FetchTaskByStatus(currentCol.id)
      toast.success("Task duplicated")
    } catch {
      toast.error("Failed to duplicate task")
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await deleteTask(task.id)
      if (!res.ok) throw new Error()
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      const col = columns.find((c) => c.uuid === task.columnId)
      if (col) {
        setColumnPagination((prev) => {
          const pag = prev[col.id]
          if (!pag) return prev
          return {
            ...prev,
            [col.id]: { ...pag, total: Math.max(0, pag.total - 1) },
          }
        })
      }
      setDeleteOpen(false)
    } catch {
      toast.error("Failed to delete task")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer rounded-sm opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50" align="start">
          {/* ── Quick actions ── */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setRenameInput(task.title)
                setRenameOpen(true)
              }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Rename
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* ── Edit fields ── */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleCopyName}>
              <Copy className="h-4 w-4 text-muted-foreground" />
              Copy name
            </DropdownMenuItem>
            {/* Change Priority */}
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

            {/* Set Due Date */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span>Due date</span>
                
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Calendar
                  mode="range"
                  defaultMonth={dueDateValue?.from}
                  selected={dueDateValue}
                  onSelect={setDueDateValue}
                  numberOfMonths={2}
                />
                <div className="flex items-center justify-end gap-1 border-t px-3 py-2">
                  {dueDateValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => handleSetDueDate(undefined)}
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
                    {dueDateValue
                      ? `Apply ${formatDatev2(dueDateValue.from)} - ${formatDatev2(dueDateValue.to)}`
                      : "Apply"}
                  </Button>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Move to */}
            {otherColumns.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {otherColumns.map((col) => (
                    <DropdownMenuItem
                      key={col.uuid}
                      onClick={() => handleMoveTo(col)}
                      className="capitalize"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: col.color }}
                      />
                      {col.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
          </DropdownMenuGroup>

          {/* ── Task actions ── */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleDuplicate}>
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

      {/* Rename dialog */}
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              "{task.title}" will be permanently deleted. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
