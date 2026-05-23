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
  title: string
}
