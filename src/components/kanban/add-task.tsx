import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Calendar as CalendarIcon,
  Flag,
  X,
  CornerDownLeft,
  CalendarClock,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import useProject from "@/hooks/useProject"
import useTask from "@/hooks/useTask"
import { createTask } from "@/api/task"
import { formatDatev2 } from "@/utils/date"
import { type DateRange } from "react-day-picker"
import { SelectMultipleUser } from "@/components/select-multiple-user"

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignees: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        //avatar: z.string().optional(),
      })
    )
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  priority: z
    .object({
      id: z.union([z.string(), z.number()]),
      name: z.string(),
      color: z.string(),
    })
    .optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

type UserItem = {
  id: number
  name: string
  email: string
  avatar: string
}

export function AddTask({
  columnId,
  setAddTaskOpen,
}: {
  columnId: string | number
  setAddTaskOpen: (open: boolean) => void
}) {
  const { project } = useProject()
  const { FetchTaskByStatus, priority } = useTask()
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [user, setUser] = useState<UserItem[]>([])
  const [date, setDate] = useState<DateRange | undefined>()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignees: [],
      startDate: undefined,
      endDate: undefined,
      priority: undefined,
    },
  })

  useEffect(() => {
    form.setValue("assignees", user)
  }, [user, form])

  useEffect(() => {
    form.setValue("startDate", date?.from)
    form.setValue("endDate", date?.to)
  }, [date, form])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddTaskOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setAddTaskOpen])

  const onSubmit = async (data: TaskFormValues) => {
    if (!project) return
    try {
      await createTask({
        project_id: project.id,
        status_id: columnId,
        title: data.title,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        priority_id: data.priority?.id,
        assignees: data.assignees?.map((a) => a.id) || [],
      })
      FetchTaskByStatus(columnId)
      setAddTaskOpen(false)
    } catch (error) {
      toast.error("Failed to create task. Please try again.")
    }
  }

  const canSubmit =
    form.watch("title").trim().length >= 3 && !form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative rounded-md border bg-card"
      >
        <Button
          type="submit"
          size="sm"
          className="absolute top-2 right-2 h-6 cursor-pointer gap-1 rounded px-2 text-[11px]"
          disabled={!canSubmit}
        >
          Save
          <CornerDownLeft className="size-3" />
        </Button>
        {/* Title */}
        <div className="px-3 pt-3 pb-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    {...field}
                    autoFocus
                    placeholder="Name"
                    className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <div className="px-3 pb-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    {...field}
                    rows={2}
                    placeholder="Description"
                    className="w-full resize-none bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Selected metadata chips */}
        {(form.watch("priority") || form.watch("endDate")) && (
          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {form.watch("priority") && (
              <Badge variant="secondary" className="rounded-md capitalize">
                <Flag
                  className="size-3"
                  style={{
                    color: form.getValues("priority")?.color,
                    fill: form.getValues("priority")?.color,
                  }}
                />
                {form.watch("priority")?.name}
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("priority", undefined)
                  }}
                  className="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            )}
            {form.watch("endDate") && (
              <Badge variant="secondary" className="rounded-md">
                <CalendarClock className="size-3" />
                {formatDatev2(form.watch("endDate"))}
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("endDate", undefined)
                  }}
                  className="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-0.5 border-t border-border/50 px-2 py-1.5">
          {/* Priority picker */}
          <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 cursor-pointer gap-1 rounded px-1.5 text-[11px] text-muted-foreground capitalize hover:text-foreground"
              >
                <Flag
                  className="size-3"
                  style={
                    form.watch("priority")
                      ? {
                          color: form.getValues("priority")?.color,
                          fill: form.getValues("priority")?.color,
                        }
                      : undefined
                  }
                />
                {form.watch("priority")
                  ? form.getValues("priority")?.name
                  : "Priority"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 gap-0.5 p-1" align="start">
              {priority.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  No priority levels found.
                </p>
              ) : (
                priority.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      form.setValue("priority", p ?? undefined)
                      setPriorityOpen(false)
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs capitalize hover:bg-muted",
                      form.getValues("priority")?.id === p.id && "bg-muted"
                    )}
                  >
                    <Flag
                      className="size-3 shrink-0"
                      style={{ color: p.color, fill: p.color }}
                    />
                    {p.name}
                  </button>
                ))
              )}
            </PopoverContent>
          </Popover>

          {/* Date picker */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 cursor-pointer gap-1 rounded px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <CalendarIcon className="size-3" />
                {date?.to ? formatDatev2(date.to) : "Due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <div className="flex-1" />

          <SelectMultipleUser user={user} setUser={setUser} />
        </div>
      </form>
    </Form>
  )
}
