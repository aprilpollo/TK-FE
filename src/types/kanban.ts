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
  dueDate?: string
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
  // columns: Column[]
  // tasks: Task[]
  // setColumns: Dispatch<SetStateAction<Column[]>>
  // setTasks: Dispatch<SetStateAction<Task[]>>
  onDragEndColumn?: (event: DragEndEvent) => void
  onDragEndItem?: (event: DragEndEvent) => void
}

export interface ColumnPagination {
  page: number
  limit: number
  total: number
  loading: boolean
}

export type TaskPriority = {
  id: string
  name: string
  color: string
}