import type { Dispatch, SetStateAction } from "react"
import type { DragEndEvent } from "@dnd-kit/core"

export interface Column {
  id: number | string
  uuid: number | string
  name: string
  color?: string
}

export interface Task {
  id: number | string
  columnId: number | string
  title: string
  description?: string
  project?: string
  priority?: {
    id: string
    name: string
    color: string
  }
  dueDate?: string
  assignees?: {
    id: string
    name: string
    avatar: string
  }[]
  subtasks?: number
  comments?: number
  attachments?: number
  tags?: string[]
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