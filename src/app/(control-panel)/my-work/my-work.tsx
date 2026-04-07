import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckSquare,
} from "lucide-react"

type Status = "Todo" | "In Progress" | "In Review"
type Priority = "high" | "medium" | "low"

interface WorkTask {
  id: number
  name: string
  project: string
  projectColor: string
  due: string
  status: Status
  priority: Priority
}

const statusConfig: Record<Status, string> = {
  Todo: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
}

const priorityDotConfig: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
}

const overdueTasks: WorkTask[] = [
  {
    id: 1,
    name: "Update component library documentation",
    project: "Design System",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    due: "Apr 2",
    status: "In Progress",
    priority: "high",
  },
  {
    id: 2,
    name: "Review pull request: auth flow",
    project: "Backend API",
    projectColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    due: "Apr 3",
    status: "In Review",
    priority: "high",
  },
]

const todayTasks: WorkTask[] = [
  {
    id: 3,
    name: "Implement login flow with OAuth",
    project: "Design System",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    due: "Today",
    status: "In Progress",
    priority: "high",
  },
  {
    id: 4,
    name: "Fix navigation bug on mobile",
    project: "Mobile App",
    projectColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    due: "Today",
    status: "In Progress",
    priority: "high",
  },
  {
    id: 5,
    name: "API integration for user profiles",
    project: "Backend API",
    projectColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    due: "Today",
    status: "Todo",
    priority: "medium",
  },
  {
    id: 6,
    name: "Design system token review meeting",
    project: "Design System",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    due: "Today",
    status: "Todo",
    priority: "medium",
  },
]

const upcomingTasks: WorkTask[] = [
  {
    id: 7,
    name: "Write unit tests for auth module",
    project: "Backend API",
    projectColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    due: "Apr 8",
    status: "Todo",
    priority: "medium",
  },
  {
    id: 8,
    name: "Set up CI/CD pipeline for staging",
    project: "Mobile App",
    projectColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    due: "Apr 9",
    status: "Todo",
    priority: "high",
  },
  {
    id: 9,
    name: "Accessibility audit for components",
    project: "Design System",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    due: "Apr 10",
    status: "Todo",
    priority: "low",
  },
  {
    id: 10,
    name: "Update onboarding documentation",
    project: "Backend API",
    projectColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    due: "Apr 11",
    status: "Todo",
    priority: "low",
  },
  {
    id: 11,
    name: "Performance profiling and optimization",
    project: "Mobile App",
    projectColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    due: "Apr 13",
    status: "Todo",
    priority: "medium",
  },
  {
    id: 12,
    name: "Refactor database query layer",
    project: "Backend API",
    projectColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    due: "Apr 14",
    status: "Todo",
    priority: "medium",
  },
]

interface SectionProps {
  title: string
  tasks: WorkTask[]
  headerClass: string
  icon: React.ElementType
  defaultOpen?: boolean
  emptyMessage?: string
}

function TaskRow({ task }: { task: WorkTask }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-muted/40 rounded-lg transition-colors cursor-pointer group">
      <span className={cn("size-2.5 rounded-full shrink-0", priorityDotConfig[task.priority])} />
      <p className="flex-1 text-sm font-medium truncate">{task.name}</p>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium hidden sm:inline-flex",
          task.projectColor
        )}
      >
        {task.project}
      </span>
      <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
        <Calendar className="size-3" />
        <span>{task.due}</span>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium hidden md:inline-flex",
          statusConfig[task.status]
        )}
      >
        {task.status}
      </span>
    </div>
  )
}

function Section({ title, tasks, headerClass, icon: Icon, defaultOpen = true, emptyMessage }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-sm font-semibold transition-colors hover:opacity-90",
          headerClass
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <span>{title}</span>
          <span className="rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-semibold">
            {tasks.length}
          </span>
        </div>
        {open ? (
          <ChevronDown className="size-4 transition-transform" />
        ) : (
          <ChevronRight className="size-4 transition-transform" />
        )}
      </button>
      {open && (
        <div className="p-2">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                <CheckSquare className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {emptyMessage ?? "No tasks here"}
              </p>
            </div>
          ) : (
            tasks.map((task) => <TaskRow key={task.id} task={task} />)
          )}
        </div>
      )}
    </div>
  )
}

function MyWork() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Work</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {overdueTasks.length + todayTasks.length} tasks need your attention
          </p>
        </div>
        {/* Date range selector */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="size-4" />
            Apr 5 – Apr 11, 2026
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        <Section
          title="Overdue"
          tasks={overdueTasks}
          headerClass="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          icon={AlertCircle}
          emptyMessage="No overdue tasks — great job!"
        />
        <Section
          title="Today"
          tasks={todayTasks}
          headerClass="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          icon={CheckSquare}
          emptyMessage="Nothing due today"
        />
        <Section
          title="Upcoming"
          tasks={upcomingTasks}
          headerClass="bg-muted text-muted-foreground"
          icon={Calendar}
          defaultOpen={false}
          emptyMessage="No upcoming tasks"
        />
      </div>

      {/* Footer quick actions */}
      <div className="flex items-center gap-3 pt-2">
        <Avatar className="size-7 bg-purple-500">
          <AvatarFallback className="text-xs font-semibold text-white bg-purple-500">
            JD
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">
          You have{" "}
          <span className="font-medium text-foreground">
            {overdueTasks.length + todayTasks.length + upcomingTasks.length}
          </span>{" "}
          tasks assigned across 3 projects
        </span>
      </div>
    </div>
  )
}

export default MyWork
