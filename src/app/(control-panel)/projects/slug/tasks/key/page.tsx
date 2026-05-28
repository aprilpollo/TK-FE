import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { fetchTaskByKey, fetchSubtask } from "@/api/task"
import { toast } from "sonner"
import { MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useProject from "@/hooks/useProject"
import UploadFiles from "@/components/upload-files"
import { TaskDetailSkeleton } from "@/components/task/task-detail-skeleton"
import { TaskHeader } from "@/components/task/task-header"
import { TaskInfoCards } from "@/components/task/task-info-cards"
import { SubtaskItem, CreateSubtaskInput } from "@/components/task/task-subtasks"
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
  const [subtask, setSubtask] = useState<Subtask[]>([])
  const [showAddSubtask, setShowAddSubtask] = useState(false)

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

  useEffect(() => {
    if (!task) return
    const loadSubtasks = async () => {
      try {
        const response = await fetchSubtask(task.id)
        const subtaskData = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Subtask[]
        }
        setSubtask(subtaskData.payload)
      } catch (error) {
        toast.warning("Failed to load subtasks. Please try again.", {
          position: "top-center",
        })
        console.error("Error fetching subtasks:", error)
      }
    }
    loadSubtasks()
  }, [task])

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
            "min-w-0 px-6 py-8",
            chatOpen ? "flex-1 max-sm:hidden" : "mx-auto w-full max-w-6xl"
          )}
        >
          {/* Title + chat toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{task.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="outline"
              className="mt-1 shrink-0 cursor-pointer"
              onClick={() => setChatOpen((open) => !open)}
            >
              <MessageCircle />
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Properties */}
          <TaskInfoCards task={task} />

          <Separator className="my-6" />

          {/* Subtasks */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-medium">Subtasks</h2>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setShowAddSubtask(true)}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {showAddSubtask && (
                <ul>
                  <CreateSubtaskInput
                    taskId={task.id}
                    onCreated={(newSubtask) => {
                      setSubtask((prev) => [...prev, newSubtask])
                      setShowAddSubtask(false)
                    }}
                    onCancel={() => setShowAddSubtask(false)}
                  />
                </ul>
              )}
              <SubtaskItem subtask={subtask} setSubtask={setSubtask} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Attachments */}
          <div>
            <h2 className="mb-3 text-base font-medium">Attachments</h2>
            <UploadFiles />
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
              className="h-[calc(100vh-94px)] w-[42.86%] shrink-0 overflow-hidden border-l max-sm:w-full"
            >
              <TaskActivity taskId={task.id} setChatOpen={setChatOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default TaskByKey
