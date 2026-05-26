import type { Task } from "@/types"

export type TaskDetail = Task & {
  status?: {
    id: number | string
    name: string
    color: string
    is_complete?: boolean
  }
}

export type Subtask = {
  id: number | string
  name: string,
  task_id: number | string
  position: number
  is_success: boolean
  created_at: string
  updated_at: string
}
