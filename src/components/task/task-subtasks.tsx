import { useEffect, useState } from "react"
import { GripVertical, Flag, CalendarDays, Ellipsis } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createSubtask, fetchPriorities } from "@/api/task"
import { FetchApiError } from "@/utils/apiFetch"
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import type { Subtask } from "./types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PopoverDateTimePicker } from "@/components/date-picker"
import { SelectMultipleUser } from "@/components/select-multiple-user"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

type SubtaskItemProps = {
  subtask: Subtask[]
  setSubtask: React.Dispatch<React.SetStateAction<Subtask[]>>
}

export function SubtaskItem({ subtask, setSubtask }: SubtaskItemProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSubtask((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <ul className="divide-y rounded-lg">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={subtask.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {subtask.length > 0 ? (
            subtask.map((st) => <SortableSubtask key={st.id} st={st} />)
          ) : (
            <li className="text-sm text-muted-foreground italic">
              No subtasks yet.
            </li>
          )}
        </SortableContext>
      </DndContext>
    </ul>
  )
}

type CreateSubtaskInputProps = {
  taskId: string | number
  onCreated: (subtask: Subtask) => void
  onCancel: () => void
}

export function CreateSubtaskInput({
  taskId,
  onCreated,
  onCancel,
}: CreateSubtaskInputProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [priorityId, setPriorityId] = useState<string | number | undefined>(
    undefined
  )
  const [dateTime, setDateTime] = useState<
    { start: string; end: string; allDay: boolean } | undefined
  >(undefined)
  const [users, setUsers] = useState<UserItem[]>([])

  async function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const payload: Parameters<typeof createSubtask>[1] = {
        name: trimmed,
        start_date: dateTime ? new Date(dateTime.start).getTime() : Date.now(),
        end_date: dateTime ? new Date(dateTime.end).getTime() : Date.now(),
        all_day: dateTime?.allDay,
        priority_id: Number(priorityId),
        assignee_ids: users.length > 0 ? users.map((u) => u.id) : undefined,
      }
      const res = await createSubtask(taskId, payload)
      const data = (await res.json()) as {
        code: number
        error: string | null
        message: string
        payload: Subtask
      }
      if (data.error) throw new Error(data.error)
      onCreated(data.payload)
      setName("")
      setPriorityId(undefined)
      setDateTime(undefined)
      setUsers([])
    } catch (err) {
      let message = "Failed to create subtask."
      if (err instanceof FetchApiError) {
        const body = err.data as { message?: string } | null
        message = body?.message ?? message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast.warning(message, { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="space-y-2 py-2">
      <div className="flex w-full">
        <input
          autoFocus
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          placeholder="Subtask name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
            if (e.key === "Escape") onCancel()
          }}
          disabled={loading}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          className="mr-1 cursor-pointer"
          aria-label="Confirm"
          size="xs"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer"
          aria-label="Cancel"
          size="xs"
          variant="outline"
        >
          Cancel
        </Button>
      </div>
      <SelectOrther
        priorityId={priorityId}
        onPriorityChange={setPriorityId}
        dateTime={dateTime}
        onDateTimeChange={setDateTime}
        users={users}
        onUsersChange={setUsers}
      />
    </li>
  )
}

function SortableSubtask({ st }: { st: Subtask }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: st.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-center justify-between bg-background py-2",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
        <span className="line-clamp-1 text-sm">{st.name}</span>

        <div className="flex items-center gap-1">
          {st.start_date && st.end_date && (
            <Badge variant="secondary">
              <CalendarDays />
              {st.all_day
                ? format(new Date(st.start_date), "MMM d, yyyy")
                : `${format(new Date(st.start_date), "MMM d, yyyy h:mm a")} - ${format(
                    new Date(st.end_date),
                    st.start_date === st.end_date
                      ? "h:mm a"
                      : "MMM d, yyyy h:mm a"
                  )}`}
            </Badge>
          )}

          {st.priority && (
            <Badge variant="secondary">
              <Flag
                className="size-3"
                style={{ color: st.priority.color, fill: st.priority.color }}
              />
              {st.priority.name}
            </Badge>
          )}

          {st.assignees && st.assignees.length > 0 && (
            <AvatarGroup className="grayscale">
              {st.assignees.slice(0, 3).map((a) => (
                <Avatar key={a.id} className="size-5">
                  <AvatarImage src={a.avatar} alt={a.name} />
                  <AvatarFallback>{a.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {st.assignees.length > 3 && (
                <Avatar className="size-5">
                  <AvatarGroupCount>
                    +{st.assignees.length - 3}
                  </AvatarGroupCount>
                </Avatar>
              )}
            </AvatarGroup>
          )}
        </div>
      </div>

      <div>
        <DropdownMenuSubtasks />
      </div>
    </li>
  )
}

type UserItem = {
  id: number
  name: string
  email: string
  avatar: string
}

type SelectOrtherProps = {
  priorityId: string | number | undefined
  onPriorityChange: (id: string | number | undefined) => void
  dateTime: { start: string; end: string; allDay: boolean } | undefined
  onDateTimeChange: (
    value: { start: string; end: string; allDay: boolean } | undefined
  ) => void
  users: UserItem[]
  onUsersChange: React.Dispatch<React.SetStateAction<UserItem[]>>
}

function SelectOrther({
  priorityId,
  onPriorityChange,
  dateTime,
  onDateTimeChange,
  users,
  onUsersChange,
}: SelectOrtherProps) {
  const [priority, setPriority] = useState<
    { id: string | number; name: string; color: string }[]
  >([])

  useEffect(() => {
    async function loadPriorities() {
      try {
        const res = await fetchPriorities()
        const data = (await res.json()) as {
          code: number
          error: string | null
          message: string
          payload: { id: string | number; name: string; color: string }[]
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

  return (
    <div className="flex items-center gap-2">
      <Select
        value={priorityId?.toString() ?? ""}
        onValueChange={(v) => onPriorityChange(v || undefined)}
      >
        <SelectTrigger size="sm" className="cursor-pointer capitalize">
          <SelectValue placeholder="Select a priority" />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectGroup>
            <SelectLabel>Priorities</SelectLabel>
            {priority.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id.toString()}
                className="cursor-pointer capitalize"
              >
                <Flag
                  className="size-3"
                  style={{ color: p.color, fill: p.color }}
                />
                {p.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <PopoverDateTimePicker
        value={dateTime}
        onChange={onDateTimeChange}
        buttonProps={{
          size: "sm",
          variant: "outline",
          className: "cursor-pointer",
        }}
      />
      <SelectMultipleUser user={users} setUser={onUsersChange} align="start" />
    </div>
  )
}

export function DropdownMenuSubtasks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="cursor-pointer">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
