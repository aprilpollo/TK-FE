import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router"

type Status = "Todo" | "In Progress" | "In Review" | "Done"
type Priority = "High" | "Medium" | "Low"

interface Task {
  id: number
  name: string
  status: Status
  priority: Priority
  assignee: string
  assigneeName: string
  assigneeBg: string
  due: string
  group: "This Week" | "Next Week"
}

const statusConfig: Record<Status, string> = {
  Todo: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Done: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
}

const priorityConfig: Record<Priority, string> = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-blue-400",
}

const tasks: Task[] = [
  {
    id: 1,
    name: "Implement login flow with OAuth",
    status: "In Progress",
    priority: "High",
    assignee: "JD",
    assigneeName: "John Doe",
    assigneeBg: "bg-purple-500",
    due: "Apr 6",
    group: "This Week",
  },
  {
    id: 2,
    name: "Fix navigation bug on mobile",
    status: "In Progress",
    priority: "High",
    assignee: "SA",
    assigneeName: "Sara Ahmed",
    assigneeBg: "bg-blue-500",
    due: "Apr 7",
    group: "This Week",
  },
  {
    id: 3,
    name: "Design system token updates",
    status: "In Review",
    priority: "Medium",
    assignee: "MK",
    assigneeName: "Mike Kim",
    assigneeBg: "bg-pink-500",
    due: "Apr 9",
    group: "This Week",
  },
  {
    id: 4,
    name: "API integration for user profiles",
    status: "In Progress",
    priority: "High",
    assignee: "TR",
    assigneeName: "Tina Ray",
    assigneeBg: "bg-green-500",
    due: "Apr 10",
    group: "This Week",
  },
  {
    id: 5,
    name: "Refactor database query layer",
    status: "In Review",
    priority: "Medium",
    assignee: "TR",
    assigneeName: "Tina Ray",
    assigneeBg: "bg-green-500",
    due: "Apr 10",
    group: "This Week",
  },
  {
    id: 6,
    name: "Write unit tests for auth module",
    status: "Todo",
    priority: "Medium",
    assignee: "PL",
    assigneeName: "Paul Lee",
    assigneeBg: "bg-orange-500",
    due: "Apr 12",
    group: "Next Week",
  },
  {
    id: 7,
    name: "Set up CI/CD pipeline for staging",
    status: "Todo",
    priority: "High",
    assignee: "MK",
    assigneeName: "Mike Kim",
    assigneeBg: "bg-pink-500",
    due: "Apr 13",
    group: "Next Week",
  },
  {
    id: 8,
    name: "Accessibility audit for components",
    status: "Todo",
    priority: "Low",
    assignee: "SA",
    assigneeName: "Sara Ahmed",
    assigneeBg: "bg-blue-500",
    due: "Apr 14",
    group: "Next Week",
  },
  {
    id: 9,
    name: "Update onboarding documentation",
    status: "Todo",
    priority: "Low",
    assignee: "JD",
    assigneeName: "John Doe",
    assigneeBg: "bg-purple-500",
    due: "Apr 15",
    group: "Next Week",
  },
  {
    id: 10,
    name: "Performance profiling and optimization",
    status: "Todo",
    priority: "Medium",
    assignee: "PL",
    assigneeName: "Paul Lee",
    assigneeBg: "bg-orange-500",
    due: "Apr 16",
    group: "Next Week",
  },
]

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <tr>
      <td colSpan={7} className="pb-1 pt-4">
        <div className="flex items-center gap-2">
          <ChevronDown className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {count}
          </span>
          <Separator className="flex-1" />
        </div>
      </td>
    </tr>
  )
}

function List_() {
  const thisWeek = tasks.filter((t) => t.group === "This Week")
  const nextWeek = tasks.filter((t) => t.group === "Next Week")

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Task List</h1>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 text-muted-foreground"
              asChild
            >
              <Link to="/board">
                <LayoutGrid className="size-3.5" />
                Board
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 bg-background shadow-sm text-foreground"
            >
              <List className="size-3.5" />
              List
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9 w-56" />
        </div>
        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-3.5" />
              Status
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Todo</DropdownMenuItem>
            <DropdownMenuItem>In Progress</DropdownMenuItem>
            <DropdownMenuItem>In Review</DropdownMenuItem>
            <DropdownMenuItem>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Priority filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Priority
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>High</DropdownMenuItem>
            <DropdownMenuItem>Medium</DropdownMenuItem>
            <DropdownMenuItem>Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Assignee filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Assignee
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>John Doe</DropdownMenuItem>
            <DropdownMenuItem>Sara Ahmed</DropdownMenuItem>
            <DropdownMenuItem>Mike Kim</DropdownMenuItem>
            <DropdownMenuItem>Tina Ray</DropdownMenuItem>
            <DropdownMenuItem>Paul Lee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Group by */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 ml-auto">
              Group by: Due date
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Due date</DropdownMenuItem>
            <DropdownMenuItem>Status</DropdownMenuItem>
            <DropdownMenuItem>Priority</DropdownMenuItem>
            <DropdownMenuItem>Assignee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-10 px-4 py-3 text-left">
                  <Checkbox />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">
                  Priority
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-40">
                  Assignee
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">
                  Due Date
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              <GroupHeader label="This Week" count={thisWeek.length} />
              {thisWeek.map((task, i) => (
                <tr
                  key={task.id}
                  className={cn(
                    "border-b last:border-b-0 hover:bg-muted/40 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <td className="px-4 py-3">
                    <Checkbox />
                  </td>
                  <td className="px-4 py-3 font-medium">{task.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statusConfig[task.status]
                      )}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium", priorityConfig[task.priority])}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback
                          className={cn("text-[10px] font-semibold text-white", task.assigneeBg)}
                        >
                          {task.assignee}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assigneeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{task.due}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              <GroupHeader label="Next Week" count={nextWeek.length} />
              {nextWeek.map((task, i) => (
                <tr
                  key={task.id}
                  className={cn(
                    "border-b last:border-b-0 hover:bg-muted/40 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <td className="px-4 py-3">
                    <Checkbox />
                  </td>
                  <td className="px-4 py-3 font-medium">{task.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statusConfig[task.status]
                      )}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium", priorityConfig[task.priority])}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback
                          className={cn("text-[10px] font-semibold text-white", task.assigneeBg)}
                        >
                          {task.assignee}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assigneeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{task.due}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 1–10 of 47 tasks</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-8" disabled>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="size-8">
            2
          </Button>
          <Button variant="outline" size="sm" className="size-8">
            3
          </Button>
          <Button variant="outline" size="icon" className="size-8">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default List_
