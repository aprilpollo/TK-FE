import { useState } from "react"
import type { Column } from "@/types"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ColorSection } from "@/components/color-section"
import { MoreHorizontal, Pencil, Palette, Plus, Trash2 } from "lucide-react"
import { updateTaskStatus, deleteTaskStatus } from "@/api/task"
import useTask from "@/hooks/useTask"
import { toast } from "sonner"

interface Props {
  column: Column
  onAddTask: () => void
}

export function DropdownMenuColumn({ column, onAddTask }: Props) {
  const { FetchTaskStatuses, setTasks } = useTask()
  const [open, setOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [nameInput, setNameInput] = useState(column.name)
  const [loading, setLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(column.color || "#005BC4")

  const handleRename = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === column.name) {
      setRenameOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await updateTaskStatus(column.id, { name: trimmed })
      if (!res.ok) throw new Error()
      await FetchTaskStatuses()
      setRenameOpen(false)
    } catch {
      toast.error("Failed to rename column")
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = async (color: string) => {
    try {
      const res = await updateTaskStatus(column.id, { color })
      if (!res.ok) throw new Error()
      await FetchTaskStatuses()
    } catch {
      toast.error("Failed to update color")
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await deleteTaskStatus(column.id)
      if (!res.ok) throw new Error()
      // Remove tasks belonging to this column from local state immediately
      setTasks((prev) => prev.filter((t) => t.columnId !== column.uuid))
      await FetchTaskStatuses()
      setDeleteOpen(false)
    } catch {
      toast.error("Failed to delete column")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer rounded-full"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onAddTask}>
              <Plus className="h-4 w-4" />
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setNameInput(column.name)
                setRenameOpen(true)
              }}
            >
              <Pencil className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="h-4 w-4" />
                Change Color
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="border-none bg-transparent p-1 shadow-none ring-0">
                <ColorSection
                  color={selectedColor}
                  setColor={setSelectedColor}
                  onCancel={() => setOpen(false)}
                  onClick={() => {
                    if (selectedColor !== column.color) {
                      handleColorChange(selectedColor)
                    }
                    setOpen(false)
                  }}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 hover:text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Column</DialogTitle>
            <DialogDescription>
              Enter a new name for "{column.name}".
            </DialogDescription>
          </DialogHeader>
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={nameInput.trim().length < 1 || loading}
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
            <DialogTitle>Delete "{column.name}"?</DialogTitle>
            <DialogDescription>
              All tasks in this column will be permanently deleted. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
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
