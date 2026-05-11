import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  CircleDotDashed,
  Flag,
  GitMerge,
  Search,
} from "lucide-react"
import { format } from "date-fns"
import type { TaskWeeklyOverview as Task } from "@/types"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchMyTasksToday } from "@/api/task"

function MyWork() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksOverdue, _setTasksOverdue] = useState<Task[]>([])

  const now = new Date()

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetchMyTasksToday()
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string | null
        payload: Task[]
      }
      setTasks(data.payload)
    }

    fetchTasks()
  }, [])

  return (
    <main className="px-3">
      <header className="flex items-center justify-between py-5">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight">
            My Tasks Overview
          </h1>
          <span className="text-xs text-muted-foreground">
            A quick glance at your tasks and deadlines
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(now, "MMMM d, yyyy")}
        </span>
      </header>
      <div className="space-y-4">
        <ScrollArea>
          <div className="flex items-center gap-2 bg-background">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                // value={searchInput}
                // onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select
            //onValueChange={setStatus}
            >
              <SelectTrigger className="w-44 cursor-pointer capitalize">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {/* {statusFilter.map((status) => (
                  <SelectItem
                    key={status.id}
                    value={status.id.toString()}
                    className="cursor-pointer capitalize"
                  >
                    <Dot
                      strokeWidth={12}
                      className={cn(
                        status.id === 1 && "text-green-700",
                        status.id === 2 && "text-sky-700",
                        status.id === 3 && "text-purple-700",
                        status.id === 4 && "text-red-700"
                      )}
                    />
                    {status.name}
                  </SelectItem>
                ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-44 cursor-pointer capitalize">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem
                    value="name"
                    className="cursor-pointer capitalize"
                  >
                    Name
                  </SelectItem>
                  <SelectItem
                    value="recently_updated"
                    className="cursor-pointer capitalize"
                  >
                    Recently updated
                  </SelectItem>
                  <SelectItem
                    value="due_date"
                    className="cursor-pointer capitalize"
                  >
                    Due date
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>

        <Section
          title="Today"
          description="My tasks today"
          className="max-h-[50svh] overflow-y-auto"
          // tone="blue"
        >
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Section>
        {tasksOverdue.length > 0 && (
          <Section
            title="Overdue"
            description="Tasks that are past their due date"
            className="max-h-[50svh] overflow-y-auto"
            tone="danger"
          >
            {tasksOverdue.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Section>
        )}
      </div>
    </main>
  )
}

export default MyWork

function Section({
  title,
  description,
  footer,
  tone = "default",
  children,
  className,
}: {
  title?: string
  description?: string
  footer?: React.ReactNode
  tone?: "default" | "danger" | "blue"
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-lg",
        tone === "danger" && "border-destructive/40",
        tone === "blue" && "border-blue-500/40"
        //className
      )}
    >
      {(title || description) && (
        <header
          className={cn(
            "flex items-center justify-between overflow-hidden rounded-t-md border-b px-2 py-2",
            tone === "danger" && "border-destructive/40 bg-destructive/5",
            tone === "blue" && "border-blue-500/40 bg-blue-500/5"
          )}
        >
          <div className="">
            {title && (
              <h3
                className={cn(
                  "text-sm font-semibold text-neutral-800 dark:text-neutral-200",
                  tone === "danger" && "text-destructive"
                )}
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <Badge
            variant={tone === "danger" ? "destructive" : "secondary"}
            className="rounded-sm text-xs"
          >
            +10 Tasks
          </Badge>
        </header>
      )}
      <div className={cn("px-2 py-1", className)}>{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 py-3">{footer}</div>
      )}
    </section>
  )
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex cursor-pointer items-center justify-between border-b px-2 py-2 hover:rounded-md hover:border-none hover:bg-accent">
      <div className="flex items-center gap-1">
        <CircleDotDashed className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">{task.title}</h3>
        <p className="text-xs text-muted-foreground">{task.project_name}</p>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Badge
            className="line-clamp-1 flex items-center gap-1 rounded-sm capitalize"
            style={{
              backgroundColor: `${task.status.color}1a`,
              color: task.status.color,
            }}
          >
            <GitMerge className="h-3.5 w-3.5" />
            {task.status.name}
          </Badge>
          <Badge variant="secondary" className="rounded-sm capitalize">
            <Flag
              className="size-3"
              style={{
                color: task.priority.color,
                fill: task.priority.color,
              }}
            />
            {task.priority.name}
          </Badge>
          <Badge variant="secondary" className="rounded-sm text-xs">
            <CalendarDays className="size-3" />
            {format(task.start_date, "MMM d, yyyy")} -{" "}
            {format(task.end_date, "MMM d, yyyy")}
          </Badge>
        </div>
      </div>
    </div>
  )
}
