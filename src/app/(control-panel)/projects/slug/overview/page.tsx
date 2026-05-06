import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartAreaInteractive } from "@/components/project/area-chart-interactive"
import {
  Dot,
  CheckCircle2,
  Clock,
  ListTodo,
  BookX,
  Plus,
  UserPlus,
  CalendarDays,
  BarChart3,
  GitMerge,
  Flag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import useProject from "@/hooks/useProject"
import Link from "@/shared/Link"
import type { ChartDataItem } from "@/types"

type TaskDeadlines = {
  id: number | string
  key: string
  name: string
  dueDate: string
  priority: {
    name: string
    color: string
  }
  status: {
    name: string
    color: string
  }
}

function Overview() {
  const { project } = useProject()

  if (!project) return null

  const [chartData, setChartData] = useState<ChartDataItem[]>([
    { date: "2026-05-09", completed: 0, created: 8 },
    { date: "2026-05-10", completed: 0, created: 12 },
    { date: "2026-05-11", completed: 0, created: 6 },
    { date: "2026-05-12", completed: 0, created: 5 },
    { date: "2026-05-13", completed: 1, created: 10 },
    { date: "2026-05-14", completed: 2, created: 4 },
    { date: "2026-05-15", completed: 3, created: 7 },
  ])

  const [taskDeadlines, _setTaskDeadlines] = useState<TaskDeadlines[]>([
    {
      id: 1,
      key: "design-mockups",
      name: "Design mockups",
      dueDate: "May 10",
      priority: { name: "High", color: "#C20E4D" },
      status: { name: "In Progress", color: "#005BC4" },
    },
    {
      id: 2,
      key: "api-integration",
      name: "API integration",
      dueDate: "May 12",
      priority: { name: "Medium", color: "#F97316" },
      status: { name: "Pending", color: "#D97706" },
    },
    {
      id: 3,
      key: "write-tests",
      name: "Write tests",
      dueDate: "May 14",
      priority: { name: "Low", color: "#10B981" },
      status: { name: "Not Started", color: "#047857" },
    },
    {
      id: 4,
      key: "review-code",
      name: "Review code",
      dueDate: "May 16",
      priority: { name: "High", color: "#C20E4D" },
      status: { name: "In Progress", color: "#005BC4" },
    },
    {
      id: 5,
      key: "deploy-application",
      name: "Deploy application",
      dueDate: "May 18",
      priority: { name: "High", color: "#C20E4D" },
      status: { name: "Not Started", color: "#047857" },
    },
  ])

  return (
    <div className="grid grid-cols-4 px-0 py-6 sm:px-3">
      <div className="col-span-4 p-4 md:col-span-3 md:p-0 md:pr-10">
        <header>
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src={project?.logo_url} alt={project?.name} />
              <AvatarFallback className="capitalize">
                {project?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              {project?.name}
            </h1>
            <Badge variant="outline" className="h-5 rounded-sm capitalize">
              <Dot
                strokeWidth={12}
                className={cn(
                  project?.status.id === 1 && "text-emerald-500", // Active
                  project?.status.id === 2 && "text-muted-foreground", // Inactive
                  project?.status.id === 3 && "text-blue-500", // Completed
                  project?.status.id === 4 && "text-destructive" // Cancelled
                )}
              />
              {project?.status.name}
            </Badge>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Tasks"
            value="123"
            icon={<ListTodo className="size-4" />}
            change={8}
          />
          <StatsCard
            title="Completed"
            value="89"
            icon={<CheckCircle2 className="size-4" />}
            change={5}
          />
          <StatsCard
            title="Pending"
            value="34"
            icon={<Clock className="size-4" />}
            change={-3}
          />
          <StatsCard
            title="Cancelled"
            value="0"
            icon={<BookX className="size-4" />}
            change={0}
          />
        </div>

        <div className="mt-4">
          <ChartAreaInteractive
            data={chartData}
            setData={setChartData}
            start={new Date(format(project.start_date, "yyyy-MM-dd"))}
            end={new Date(format(project.end_date, "yyyy-MM-dd"))}
          />
        </div>

        <div className="mt-6 space-y-6">
          <div className="">
            <h2 className="text-md mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Upcoming Deadlines of the Week
            </h2>
            {taskDeadlines.length > 0 ? (
              taskDeadlines.map((task) => (
                <DeadlineItem
                  key={task.key}
                  to={`./tasks/${task.key}`}
                  name={task.name}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  status={task.status}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No upcoming deadlines
              </p>
            )}
          </div>

          <div>
            <h2 className="text-md mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Quick Actions
            </h2>
            <div className="grid grid-cols-4 gap-2">
              <QuickActionButton
                icon={<Plus className="h-4 w-4" />}
                label="Create Task"
              />
              <QuickActionButton
                icon={<ListTodo className="h-4 w-4" />}
                label="View All Tasks"
              />
              <QuickActionButton
                icon={<UserPlus className="h-4 w-4" />}
                label="Invite Member"
              />
              <QuickActionButton
                icon={<BarChart3 className="h-4 w-4" />}
                label="View Reports"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 hidden space-y-4 md:block">
        <div id="about">
          <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            About
          </h1>
          <p className="min-h-12 text-xs text-neutral-500 dark:text-neutral-400">
            {project?.description ? (
              project?.description
            ) : (
              <span className="italic"> No description provided </span>
            )}
          </p>
        </div>
        <div className="border-b" />
        <div id="assignees" className="">
          <h1 className="flex items-center text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Assignees members
            <Badge
              className="ml-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="outline"
            >
              {0}
            </Badge>
          </h1>
          <div className="min-h-12">
            {/* {project?.contributors && project?.contributors?.length > 0 ? (
                project?.contributors?.map((contributor) => (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={contributor.avatar_url} />
                      <AvatarFallback className="capitalize">
                        {contributor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  No contributors
                </span>
              )} */}

            <span className="text-xs text-muted-foreground italic">
              No assignees
            </span>
          </div>
        </div>

        {project?.start_date && project?.end_date && (
          <>
            <div className="border-b" />
            <div id="due-date" className="">
              <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Due Date
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {format(project?.start_date, "PP")}
                </p>
                <p className="text-xs text-muted-foreground">-</p>
                <p className="text-xs text-muted-foreground">
                  {format(project?.end_date, "PP")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Overview

function StatsCard({
  title,
  value,
  icon,
  change,
}: {
  title: string
  value: string
  icon?: React.ReactNode
  change?: number
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-1 text-3xl font-bold text-neutral-800 dark:text-neutral-200">
        {value}
      </p>
      {change !== undefined && (
        <p
          className={cn(
            "mt-1 text-xs",
            change > 0 && "text-emerald-500",
            change < 0 && "text-destructive",
            change === 0 && "text-muted-foreground"
          )}
        >
          {change > 0 ? `+${change}` : change === 0 ? "No change" : change} this
          week
        </p>
      )}
    </div>
  )
}

function DeadlineItem({
  name,
  to,
  dueDate,
  priority,
  status,
}: {
  name: string
  to: string
  dueDate: string
  priority: { name: string; color: string }
  status: { name: string; color: string }
}) {
  return (
    <div className="flex min-h-12 items-center justify-between border-b bg-card px-3 py-2">
      <Link
        to={to}
        className="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {/* <GitMerge className="h-3.5 w-3.5" /> */}
        {name}
      </Link>
      <div className="flex items-center gap-2">
        <Badge
          className="line-clamp-1 flex items-center gap-1 rounded-sm capitalize"
          style={{
            backgroundColor: `${status.color}1a`,
            color: status.color,
          }}
        >
          <GitMerge className="h-3.5 w-3.5" />
          {status.name}
        </Badge>
        <Badge variant="secondary" className="rounded-sm capitalize">
          <Flag
            className="size-3"
            style={{
              color: priority.color,
              fill: priority.color,
            }}
          />
          {priority.name}
        </Badge>
        <Badge variant="secondary" className="rounded-sm text-xs">
          <CalendarDays className="size-3" />
          {dueDate}
        </Badge>
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      variant="outline"
      className="flex h-auto cursor-pointer flex-col items-center gap-2 px-4 py-3 shadow-none"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  )
}
