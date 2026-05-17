import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { fetchTaskByKey } from "@/api/task"
import { toast } from "sonner"
import type { Task } from "@/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Flag,
  CalendarClock,
  MessageCircle,
  Paperclip,
  User,
  Tag,
  Clock,
  CheckSquare,
  AlignLeft,
  Circle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"

type TaskDetail = Task & {
  status?: {
    id: number | string
    name: string
    color: string
    is_complete?: boolean
  }
}

function TaskDetailSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-7 w-64 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-6 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SidebarRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-6 items-start justify-between gap-2">
      <div className="flex min-w-24 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-1">
        {children}
      </div>
    </div>
  )
}

function TaskByKey() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<TaskDetail | null>(null)

  useEffect(() => {
    if (!taskId) return
    const loadTask = async () => {
      setLoading(true)
      try {
        const response = await fetchTaskByKey(taskId)
        const taskData = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: TaskDetail
        }
        setTask(taskData.payload)
      } catch (error) {
        toast.warning("Failed to load task details. Please try again.", {
          position: "top-center",
        })
        console.error("Error fetching task:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [taskId])

  if (!taskId) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Invalid task ID.</div>
    )
  }

  if (loading) return <TaskDetailSkeleton />

  if (!task) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Task not found.</div>
    )
  }

  const isOverdue = task.endDate ? new Date(task.endDate) < new Date() : false

  return (
      <main className="">
        <div className="mb-6 flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-0.5 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </Button>

          
        </div>

       
      </main>
  )
}

export default TaskByKey
