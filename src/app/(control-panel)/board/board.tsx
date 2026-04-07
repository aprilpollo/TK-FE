import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Flag,
  Calendar,
} from "lucide-react"
import { Link } from "react-router"

type Priority = "high" | "medium" | "low"

interface TaskCard {
  id: number
  title: string
  tags: string[]
  priority: Priority
  assignee: string
  assigneeBg: string
  due: string
}

interface Column {
  id: string
  name: string
  badgeColor: string
  dotColor: string
  count: number
  tasks: TaskCard[]
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  high: { color: "text-red-500", label: "High" },
  medium: { color: "text-yellow-500", label: "Med" },
  low: { color: "text-blue-400", label: "Low" },
}

const tagColors: Record<string, string> = {
  Frontend: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Backend: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Bug: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Design: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  API: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Tests: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Docs: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

const columns: Column[] = [
  {
    id: "todo",
    name: "Todo",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    dotColor: "bg-purple-500",
    count: 4,
    tasks: [
      {
        id: 1,
        title: "Implement login flow with OAuth",
        tags: ["Frontend", "Feature"],
        priority: "high",
        assignee: "JD",
        assigneeBg: "bg-purple-500",
        due: "Apr 6",
      },
      {
        id: 2,
        title: "Set up CI/CD pipeline for staging",
        tags: ["Backend"],
        priority: "medium",
        assignee: "TR",
        assigneeBg: "bg-green-500",
        due: "Apr 8",
      },
      {
        id: 3,
        title: "Write unit tests for auth module",
        tags: ["Tests", "Backend"],
        priority: "medium",
        assignee: "PL",
        assigneeBg: "bg-orange-500",
        due: "Apr 12",
      },
      {
        id: 4,
        title: "Update onboarding documentation",
        tags: ["Docs"],
        priority: "low",
        assignee: "SA",
        assigneeBg: "bg-blue-500",
        due: "Apr 15",
      },
    ],
  },
  {
    id: "in-progress",
    name: "In Progress",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    dotColor: "bg-blue-500",
    count: 3,
    tasks: [
      {
        id: 5,
        title: "Fix navigation bug on mobile devices",
        tags: ["Bug", "Frontend"],
        priority: "high",
        assignee: "SA",
        assigneeBg: "bg-blue-500",
        due: "Apr 7",
      },
      {
        id: 6,
        title: "API integration for user profiles",
        tags: ["API", "Backend"],
        priority: "high",
        assignee: "MK",
        assigneeBg: "bg-pink-500",
        due: "Apr 9",
      },
      {
        id: 7,
        title: "Design system token updates",
        tags: ["Design", "Frontend"],
        priority: "medium",
        assignee: "JD",
        assigneeBg: "bg-purple-500",
        due: "Apr 10",
      },
    ],
  },
  {
    id: "in-review",
    name: "In Review",
    badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    dotColor: "bg-yellow-500",
    count: 2,
    tasks: [
      {
        id: 8,
        title: "Refactor database query layer",
        tags: ["Backend"],
        priority: "medium",
        assignee: "TR",
        assigneeBg: "bg-green-500",
        due: "Apr 8",
      },
      {
        id: 9,
        title: "Accessibility audit for components",
        tags: ["Frontend", "Design"],
        priority: "low",
        assignee: "PL",
        assigneeBg: "bg-orange-500",
        due: "Apr 11",
      },
    ],
  },
  {
    id: "done",
    name: "Done",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    dotColor: "bg-green-500",
    count: 5,
    tasks: [
      {
        id: 10,
        title: "Set up project repository structure",
        tags: ["Backend"],
        priority: "medium",
        assignee: "MK",
        assigneeBg: "bg-pink-500",
        due: "Apr 1",
      },
      {
        id: 11,
        title: "Create initial UI mockups",
        tags: ["Design"],
        priority: "high",
        assignee: "SA",
        assigneeBg: "bg-blue-500",
        due: "Apr 2",
      },
      {
        id: 12,
        title: "Configure ESLint and Prettier",
        tags: ["Frontend"],
        priority: "low",
        assignee: "JD",
        assigneeBg: "bg-purple-500",
        due: "Apr 3",
      },
      {
        id: 13,
        title: "Database schema design",
        tags: ["Backend", "Docs"],
        priority: "high",
        assignee: "TR",
        assigneeBg: "bg-green-500",
        due: "Apr 3",
      },
      {
        id: 14,
        title: "Set up authentication middleware",
        tags: ["Backend", "API"],
        priority: "medium",
        assignee: "PL",
        assigneeBg: "bg-orange-500",
        due: "Apr 4",
      },
    ],
  },
]

const memberFilters = [
  { initials: "JD", bg: "bg-purple-500" },
  { initials: "SA", bg: "bg-blue-500" },
  { initials: "MK", bg: "bg-pink-500" },
  { initials: "TR", bg: "bg-green-500" },
  { initials: "PL", bg: "bg-orange-500" },
]

function TaskCardItem({ task }: { task: TaskCard }) {
  const p = priorityConfig[task.priority]
  return (
    <div className="rounded-lg border bg-card p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      {/* Priority + title */}
      <div className="flex items-start gap-2 mb-2.5">
        <Flag className={cn("size-3.5 shrink-0 mt-0.5", p.color)} />
        <p className="text-sm font-medium leading-snug">{task.title}</p>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              tagColors[tag] ?? "bg-muted text-muted-foreground"
            )}
          >
            {tag}
          </span>
        ))}
      </div>
      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <Avatar className="size-6">
          <AvatarFallback
            className={cn("text-[10px] font-semibold text-white", task.assigneeBg)}
          >
            {task.assignee}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          <span>{task.due}</span>
        </div>
      </div>
    </div>
  )
}

function Board() {
  return (
    <div className="flex flex-col gap-5 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Project Board</h1>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 bg-background shadow-sm text-foreground"
            >
              <LayoutGrid className="size-3.5" />
              Board
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 text-muted-foreground"
              asChild
            >
              <Link to="/list">
                <List className="size-3.5" />
                List
              </Link>
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9 w-56" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="size-3.5" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="size-3.5" />
          Sort
        </Button>
        {/* Member filter */}
        <div className="flex -space-x-1.5 ml-1">
          {memberFilters.map((m, i) => (
            <Avatar
              key={i}
              className="size-7 ring-2 ring-background cursor-pointer hover:ring-primary transition-all"
            >
              <AvatarFallback className={cn("text-[10px] font-semibold text-white", m.bg)}>
                {m.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-0 flex-1">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col shrink-0 w-72 rounded-xl bg-muted/50 border border-border/60"
          >
            {/* Column header */}
            <div className="flex items-center justify-between p-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", col.dotColor)} />
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    col.badgeColor
                  )}
                >
                  {col.name}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-background rounded-full px-2 py-0.5 border">
                {col.count}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2.5 p-3 flex-1 overflow-y-auto">
              {col.tasks.map((task) => (
                <TaskCardItem key={task.id} task={task} />
              ))}
            </div>

            {/* Add task footer */}
            <div className="p-3 border-t border-border/60">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-3.5" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Board
