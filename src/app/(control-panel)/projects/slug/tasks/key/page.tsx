import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { fetchTaskByKey } from "@/api/task"
import { toast } from "sonner"
import type { Task } from "@/types"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useProject from "@/hooks/useProject"

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

function TaskByKey() {
  const { taskId } = useParams()
  const { project } = useProject()
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

  if (loading || !project) return <TaskDetailSkeleton />

  if (!task) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Task not found.</div>
    )
  }

  // const isOverdue = task.endDate ? new Date(task.endDate) < new Date() : false

  return (
    <main className="">
      <header className="flex h-11 items-center justify-between border-b px-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-3.5" />
          </Button>
          <h2 className="text-sm font-medium">
            {task.title} / {project.name}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Created at {format(new Date(task.created_at), "MMM d, yyyy")}
          </span>
        </div>
      </header>
      <div className="grid grid-cols-7">
        <div id="task-details" className="col-span-4 border-r px-6 py-8" />
        <div id="chat-messages" className="col-span-3 border-r px-6 py-8" />
      </div>
    </main>
  )
}

export default TaskByKey
