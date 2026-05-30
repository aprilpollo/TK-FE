import type { Task } from "@/types"

export type TaskDetail = Task & {
  status?: {
    id: number | string
    name: string
    color: string
    is_complete?: boolean
  }
}

export type Attachment = {
  id: number | string
  task_id: number | string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_by: number | string
}

export type Subtask = {
  id: number | string
  name: string,
  task_id: number | string
  position: number
  start_date: number | null
  end_date: number | null
  all_day: boolean | null
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
