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
  ArrowUp,
  ArrowRight,
  ArrowDown,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ChartDataItem } from "@/types"

import useProject from "@/hooks/useProject"

function Overview() {
  const { project } = useProject()

  if (!project) return null

const [chartData, setChartData] = useState<ChartDataItem[]>([
  { date: "2026-05-09", completed: 0,  created: 8  },
  { date: "2026-05-12", completed: 3,  created: 5  },
  { date: "2026-05-15", completed: 7,  created: 10 },
  { date: "2026-05-19", completed: 12, created: 6  },
  { date: "2026-05-22", completed: 9,  created: 14 },
  { date: "2026-05-26", completed: 15, created: 4  },
  { date: "2026-05-29", completed: 11, created: 9  },
  { date: "2026-06-02", completed: 18, created: 12 },
  { date: "2026-06-05", completed: 6,  created: 7  },
  { date: "2026-06-09", completed: 20, created: 3  },
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
          <div>
            <h2 className="text-md mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Upcoming Deadlines
            </h2>
            <div className="space-y-2">
              <DeadlineItem
                name="Design mockups"
                dueDate="May 10"
                priority="high"
              />
              <DeadlineItem
                name="API integration"
                dueDate="May 12"
                priority="medium"
              />
              <DeadlineItem
                name="Write unit tests"
                dueDate="May 15"
                priority="low"
              />
              <DeadlineItem
                name="Deploy to staging"
                dueDate="May 18"
                priority="high"
              />
              <DeadlineItem
                name="Client review"
                dueDate="May 20"
                priority="medium"
              />
            </div>
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
        <div id="contributors" className="">
          <h1 className="flex items-center text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Contributors
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
              No contributors
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

const priorityConfig = {
  high: {
    label: "High",
    icon: <ArrowUp className="size-3" />,
    className: "text-destructive border-destructive/40",
  },
  medium: {
    label: "Medium",
    icon: <ArrowRight className="size-3" />,
    className: "text-amber-500 border-amber-500/40",
  },
  low: {
    label: "Low",
    icon: <ArrowDown className="size-3" />,
    className: "text-muted-foreground border-muted-foreground/40",
  },
}

function DeadlineItem({
  name,
  dueDate,
  priority,
}: {
  name: string
  dueDate: string
  priority: "high" | "medium" | "low"
}) {
  const p = priorityConfig[priority]
  return (
    <div className="flex min-h-12 items-center justify-between rounded-md border bg-card px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "flex h-5 items-center gap-1 rounded-sm text-xs",
            p.className
          )}
        >
          {p.icon}
          {p.label}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3" />
          {dueDate}
        </div>
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
