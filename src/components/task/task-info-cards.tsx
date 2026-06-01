import { useState, useEffect } from "react"
import { CalendarDays, Disc2, Flag, GitMerge, User } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  PopoverDateTimePicker,
  type DateTimeValue,
} from "@/components/date-picker"
import { SelectMultipleUser } from "@/components/select-multiple-user"
import { fetchTaskStatuses, fetchPriorities, updateTask } from "@/api/task"
import type { TaskDetail } from "./types"
import type { Column, TaskPriority } from "@/types"
import { toDateTimeStringFromUnixMs } from "@/utils/date"
import useProject from "@/hooks/useProject"

type TaskInfoCardsProps = {
  task: TaskDetail
}

type UserItem = {
  id: number
  name: string
  email: string
  avatar: string
}

export function TaskInfoCards({ task }: TaskInfoCardsProps) {
  const { project } = useProject()
  if (!project) return null

  const [statuses, setStatuses] = useState<Column[]>([])
  const [priorities, setPriorities] = useState<TaskPriority[]>([])
  const [user, setUser] = useState<UserItem[]>(
    task.assignees?.map((assignee) => ({
      id: Number(assignee.id),
      name: assignee.name,
      email: "",
      avatar: assignee.avatar,
    })) ?? []
  )

  useEffect(() => {
    async function loadStatuses() {
      if (!project) return
      try {
        const res = await fetchTaskStatuses(project.id)
        if (!res.ok) throw new Error("Failed to fetch task statuses")
        const data = (await res.json()) as { payload: Column[] }
        setStatuses(data.payload)
      } catch (e) {
        console.error(e)
      }
    }

    async function loadPriorities() {
      try {
        const res = await fetchPriorities()
        if (!res.ok) throw new Error("Failed to fetch task priorities")
        const data = (await res.json()) as { payload: TaskPriority[] }
        setPriorities(data.payload)
      } catch (e) {
        console.error(e)
      }
    }
    loadStatuses()
    loadPriorities()
  }, [project.id])

  const onChangeStatus = async (statusId: string) => {
    await updateTask(task.id, { status_id: parseInt(statusId) })
    toast.success("Task status updated", {
      position: "top-center",
    })
  }

  const onChangePriority = async (priorityId: string) => {
    await updateTask(task.id, { priority_id: parseInt(priorityId) })
    toast.success("Task priority updated", {
      position: "top-center",
    })
  }

  const onChangeDueDate = async (dueDate: DateTimeValue) => {
    await updateTask(task.id, {
      start_date: dueDate.start ? new Date(dueDate.start).getTime() : null,
      end_date: dueDate.end ? new Date(dueDate.end).getTime() : null,
      all_day: dueDate.allDay,
    })
    // toast.success("Task due date updated", {
    //   position: "top-center",
    // })
  }

  const onChangeAssignees = async (nextUser: UserItem[]) => {
    const previousUser = user
    setUser(nextUser)

    try {
      const res = await updateTask(task.id, {
        assignees_ids: nextUser.map((assignee) => assignee.id),
      })
      if (!res.ok) throw new Error("Failed to update task assignees")
      toast.success("Task assignees updated", {
        position: "top-center",
      })
    } catch (error) {
      setUser(previousUser)
      toast.error("Failed to update task assignees", {
        position: "top-center",
      })
      console.error(error)
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <GitMerge className="size-3.5" /> Status
        </span>
        <Select
          defaultValue={task.status?.id.toString()}
          onValueChange={onChangeStatus}
        >
          <SelectTrigger
            size="sm"
            className="w-full max-w-48 cursor-pointer font-medium capitalize"
          >
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status </SelectLabel>
              {statuses
                .filter((s) => s.is_complete != true)
                .map((status) => (
                  <SelectItem
                    key={status.id}
                    value={status.id.toString()}
                    className="cursor-pointer font-medium capitalize"
                  >
                    <Disc2 color={status.color} />
                    {status.name}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Completed</SelectLabel>
              {statuses
                .filter((s) => s.is_complete == true)
                .map((status) => (
                  <SelectItem
                    key={status.id}
                    value={status.id.toString()}
                    className="cursor-pointer font-medium capitalize"
                  >
                    <Disc2 color={status.color} />
                    {status.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <Flag className="size-3.5" />
          Priority
        </span>
        <Select
          defaultValue={task.priority?.id.toString()}
          onValueChange={onChangePriority}
        >
          <SelectTrigger
            size="sm"
            className="w-full max-w-48 cursor-pointer font-medium capitalize"
          >
            <SelectValue placeholder="Select a priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priorities</SelectLabel>
              {priorities.map((priority) => (
                <SelectItem
                  key={priority.id}
                  value={priority.id.toString()}
                  className="cursor-pointer font-medium capitalize"
                >
                  <Flag
                    className="size-3.5"
                    style={{ color: priority.color, fill: priority.color }}
                  />
                  {priority.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5" /> Due Date
        </span>
        <PopoverDateTimePicker
          value={
            task.start_date
              ? {
                  start: toDateTimeStringFromUnixMs(task.start_date),
                  end: toDateTimeStringFromUnixMs(
                    task.end_date ?? task.start_date
                  ),
                  allDay: task.all_day ?? false,
                }
              : undefined
          }
          buttonProps={{
            variant: "outline",
            size: "sm",
            className:
              "w-full max-w-48 justify-start cursor-pointer font-medium",
          }}
          onChange={onChangeDueDate}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5" /> Assignees
        </span>
        <SelectMultipleUser align="start" user={user} setUser={onChangeAssignees} />
      </div>
    </div>
  )
}
