import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Dot, ListTodo, Plus, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/date"

import useProject from "@/hooks/useProject"

function Overview() {
  const { project } = useProject()

  return (
    <div className="container mx-auto max-w-7xl grid grid-cols-4 py-6">
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

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard />
          <StatsCard />
          <StatsCard />
          <StatsCard />
        </div>

        <div className="mt-6">
          <h2 className="text-md mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
            Recent Activity
          </h2>
          <div className="">
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
          </div>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-md mb-3 font-semibold text-neutral-800 dark:text-neutral-200">
              Upcoming Deadlines
            </h2>
            <div className="space-y-2">
              <DeadlineItem />
              <DeadlineItem />
              <DeadlineItem />
              <DeadlineItem />
              <DeadlineItem />
            </div>
          </div>

          {/* Quick Actions */}
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

        <div className="border-b" />
        <div id="due-date" className="">
          <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Due Date
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {formatDate(project?.created_at)}
            </p>
            <p className="text-xs text-muted-foreground">-</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(project?.due_date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview

function StatsCard() {
  return <div className="min-h-24 rounded-lg border bg-card p-4"></div>
}

// Activity Item Component
function ActivityItem() {
  return (
    <div className="flex min-h-14 items-start gap-3 border-b px-2 py-2"></div>
  )
}

// Deadline Item Component
function DeadlineItem() {
  return (
    <div className="flex min-h-12 items-center justify-between rounded-md border px-3 py-2"></div>
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
