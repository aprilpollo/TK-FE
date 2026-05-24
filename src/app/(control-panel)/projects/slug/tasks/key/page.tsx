import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { fetchTaskByKey } from "@/api/task"
import { toast } from "sonner"
import { MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import useProject from "@/hooks/useProject"
import UploadFiles from "@/components/upload-files"
import { TaskDetailSkeleton } from "@/components/task/task-detail-skeleton"
import { TaskHeader } from "@/components/task/task-header"
import { TaskInfoCards } from "@/components/task/task-info-cards"
import { SubtaskItem } from "@/components/task/task-subtasks"
import { TaskActivity } from "@/components/task/task-activity"
import type { TaskDetail, Subtask } from "@/components/task/types"
import { cn } from "@/lib/utils"

function TaskByKey() {
  const { taskId } = useParams()
  const { project } = useProject()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
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
      <div className="flex overflow-hidden">
        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          id="task-details"
          className={cn(
            "relative space-y-6 px-6 py-8 min-w-0",
            chatOpen ? "flex-1 max-sm:hidden" : "w-full max-w-6xl mx-auto"
          )}
        >
          <div className="absolute top-1 right-1">
            <Button
              size="icon-xs"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setChatOpen((open) => !open)}
            >
              <MessageCircle />
            </Button>
          </div>

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
        </motion.div>

        <AnimatePresence initial={false}>
          {chatOpen && (
            <motion.div
              key="chat-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="w-[42.86%] max-sm:w-full shrink-0 h-[calc(100vh-94px)] border-l overflow-hidden"
            >
              <TaskActivity taskId={taskId} setChatOpen={setChatOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default TaskByKey
