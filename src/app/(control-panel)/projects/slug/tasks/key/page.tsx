import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { fetchTaskByKey } from "@/api/task"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import useProject from "@/hooks/useProject"
import UploadFiles from "@/components/upload-files"
import { TaskDetailSkeleton } from "@/components/task/task-detail-skeleton"
import { TaskHeader } from "@/components/task/task-header"
import { TaskInfoCards } from "@/components/task/task-info-cards"
import { SubtaskItem } from "@/components/task/task-subtasks"
import { TaskActivity } from "@/components/task/task-activity"
import type { TaskDetail, Subtask } from "@/components/task/types"

function TaskByKey() {
  const { taskId } = useParams()
  const { project } = useProject()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [subtask, setSubtask] = useState<Subtask[]>([
    { id: 1, title: "Subtask 1" },
    { id: 2, title: "Subtask 2" },
    { id: 3, title: "Subtask 3" },
  ])

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

  return (
    <main>
      <TaskHeader
        projectName={project.name}
        createdAt={task.created_at}
        onBack={() => navigate(-1)}
      />
      <div className="grid grid-cols-7">
        <div
          id="task-details"
          className="col-span-4 space-y-6 border-r px-6 py-8"
        >
          <div>
            <h1 className="text-2xl font-semibold">{task.title}</h1>
            <span className="text-sm text-muted-foreground">
              {task.description}
            </span>
          </div>

          <TaskInfoCards task={task} />

          <UploadFiles />

          <div className="max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <h2 className="mb-2 text-lg font-medium">Subtasks</h2>
              <Button size="sm" variant="outline" className="cursor-pointer">
                <Plus className="size-4" />
                Add Subtask
              </Button>
            </div>
            <SubtaskItem subtask={subtask} setSubtask={setSubtask} />
          </div>
        </div>
        <div
          id="chat-messages"
          className="col-span-3 flex flex-col border-r h-[calc(100vh-94px)]"
        >
          <TaskActivity taskId={taskId} />
        </div>
      </div>
    </main>
  )
}

export default TaskByKey
