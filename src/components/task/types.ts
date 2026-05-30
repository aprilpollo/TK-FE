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
  start_date: number
  end_date: number
  all_day: boolean
  priority_id: number | string
  priority?: {
    id: number | string
    name: string
    description: string
    color: string
  }
  assignees?: {
    id: number | string
    name: string
    email: string
    avatar?: string
  }[]
  is_success: boolean
  created_at: string
  updated_at: string
}
