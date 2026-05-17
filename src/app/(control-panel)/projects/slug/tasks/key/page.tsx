import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { fetchTaskByKey } from "@/api/task"
import { toast } from "sonner"
import type { Task } from "@/types"


function TaskByKey() {
  const { taskId } = useParams()
  if (!taskId) {
    toast.error("Task ID is missing in the URL.", {
      position: "top-center",
    })
    return <div>Invalid task ID.</div>
  }
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true)
      try {
        const response = await fetchTaskByKey(taskId)
        const taskData = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Task
        }
        setTask(taskData.payload)
        setLoading(false)
      } catch (error) {
        toast.warning("Failed to load task details. Please try again.", {
          position: "top-center",
        })
        console.error("Error fetching task:", error)
      } 
    }

    loadTask()
  }, [taskId])

  if (loading) return <div>Loading...</div>

  return <div>TaskByKey: {taskId}</div>
}

export default TaskByKey
