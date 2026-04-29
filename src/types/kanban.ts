import type { DragEndEvent } from "@dnd-kit/core"

export interface Column {
  id: number | string
  uuid: number | string
  name: string
  color?: string
  created_at: Date
  updated_at: Date
  position: number
}

export interface Task {
  id: number | string
  columnId: number | string
  title: string
  description?: string
  priority?: {
    id: number | string
    name: string
    color: string
  }
  startDate?: string | Date
  endDate?: string | Date
  allDay?: boolean
  assignees?: {
    id: number | string
    name: string
    avatar: string
  }[]
  subtasks?: number
  tags?: string[]
  created_at: Date
  comments_count?: number
  attachments_count?: number
  updated_at: Date
}

export interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export interface KanbanCardProps {
  task: Task
  isOverlay?: boolean
  isFaded?: boolean
}

export interface BoardProps {
  onDragEndColumn?: (event: DragEndEvent) => void
  onDragEndItem?: (tasks: Task[]) => void
}

export interface ColumnPagination {
  page: number
  limit: number
  total: number
  loading: boolean
}

export type TaskPriority = {
  id: string | number
  name: string
  color: string
}