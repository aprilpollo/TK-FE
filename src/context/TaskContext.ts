import { createContext } from "react"
import type { Task, Column, ColumnPagination, TaskPriority } from "@/types"


export type TaskContextType = {
  tasks: Task[]
  columns: Column[]
  priority: TaskPriority[]
  columnPagination: Record<string | number, ColumnPagination>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
  setColumnPagination: React.Dispatch<React.SetStateAction<Record<string | number, ColumnPagination>>>
  FetchTaskByStatus: (statusId: string | number) => Promise<void>
  FetchTaskStatuses: () => Promise<Column[]>
  loadMoreTasks: (statusId: string | number) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export default TaskContext
