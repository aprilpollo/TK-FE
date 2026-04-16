import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Board } from "@/components/kanban"
import { fetchPriorities, fetchTaskStatuses, fetchTasks } from "@/api/task"
import type { Column, ColumnPagination, Task, TaskPriority } from "@/types"
import TaskContext from "@/context/TaskContext"
import useProject from "@/hooks/useProject"

function Tasks() {
  const { project } = useProject()
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [priority, setPriority] = useState<TaskPriority[]>([])
  const [columnPagination, setColumnPagination] = useState<
    Record<string | number, ColumnPagination>
  >({})

  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  if (!project) {
    return <div>Loading...</div>
  }

  const FetchPriorities = async () => {
    try {
      const response = await fetchPriorities()
      if (!response.ok) {
        throw new Error("Failed to fetch priorities")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: TaskPriority[]
      }
      setPriority(data.payload)
    } catch (error) {
      console.error("Error fetching priorities:", error)
    }
  }

  const FetchTaskStatuses = async (): Promise<Column[]> => {
    try {
      const response = await fetchTaskStatuses(project.id)
      if (!response.ok) {
        throw new Error("Failed to fetch task statuses")
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Column[]
      }
      setColumns(data.payload)
      return data.payload || []
    } catch (error) {
      console.error("Error fetching task statuses:", error)
      return []
    }
  }

  const FetchTasks = async (targetColumns: Column[] = columns) => {
    try {
      const paginationMap: Record<string | number, ColumnPagination> = {}
      const promises = targetColumns.map(async (col) => {
        const response = await fetchTasks(project.id, col.id)
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks for status ${col.id}`)
        }
        const data = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Task[]
          pagination: { total: number; page: number; limit: number }
        }

        if (data.pagination) {
          paginationMap[col.id] = { ...data.pagination, loading: false }
        }
        return data.payload || []
      })

      const results = await Promise.all(promises)
      setColumnPagination((prev) => ({ ...prev, ...paginationMap }))
      setTasks(results.flat())
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const FetchTaskByStatus = async (statusId: string | number) => {
    try {
      const targetColumn = columns.find((c) => c.id === statusId)
      const uuidToFilter = targetColumn ? targetColumn.uuid : statusId
      const response = await fetchTasks(project.id, statusId)
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks for status ${statusId}`)
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Task[]
        pagination: { total: number; page: number; limit: number }
      }

      if (data.pagination) {
        setColumnPagination((prev) => ({
          ...prev,
          [statusId]: { ...data.pagination, loading: false },
        }))
      }

      setTasks((prevTasks) => {
        const filteredTasks = prevTasks.filter(
          (t) => t.columnId !== uuidToFilter
        )
        return [...filteredTasks, ...(data.payload || [])]
      })
    } catch (error) {
      console.error("Error fetching tasks by status:", error)
    }
  }

  const loadMoreTasks = async (statusId: string | number) => {
    try {
      const pag = columnPagination[statusId]
      if (!pag) return

      if (pag.loading || pag.page * pag.limit >= pag.total) return

      setColumnPagination((prev) => ({
        ...prev,
        [statusId]: { ...prev[statusId], loading: true },
      }))

      const nextPage = pag.page + 1
      const query = new URLSearchParams()
      query.append("_sort", "position")
      query.append("_order", "asc")
      query.append("_page", nextPage.toString())
      query.append("_limit", pag.limit.toString())

      const response = await fetchTasks(project.id, statusId, query.toString())
      if (!response.ok) {
        throw new Error(`Failed to load more tasks for status ${statusId}`)
      }
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Task[]
        pagination: { total: number; page: number; limit: number }
      }
      const newTasks = data.payload || []

      if (data.pagination) {
        setColumnPagination((prev) => ({
          ...prev,
          [statusId]: { ...data.pagination, loading: false },
        }))
      }

      setTasks((prevTasks) => {
        // Append new tasks, avoiding duplicates if any
        const existingIds = new Set(prevTasks.map((t) => t.id))
        const uniqueNewTasks = newTasks.filter((t) => !existingIds.has(t.id))
        return [...prevTasks, ...uniqueNewTasks]
      })
    } catch (error) {
      console.error("Error loading more tasks:", error)
      setColumnPagination((prev) => ({
        ...prev,
        [statusId]: { ...prev[statusId], loading: false },
      }))
    }
  }

  useEffect(() => {
    const initializeTaskBoard = async () => {
      FetchPriorities()
      const statuses = await FetchTaskStatuses()
      await FetchTasks(statuses)
    }

    initializeTaskBoard()
  }, [project.id])

  return (
    <div className="space-y-4 pt-4">
      <header className="flex justify-between gap-2">
        <div className="block">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="w-64 pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-36 cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="name" className="cursor-pointer">
                    Name
                  </SelectItem>
                  <SelectItem value="date" className="cursor-pointer">
                    Date
                  </SelectItem>
                  <SelectItem value="priority" className="cursor-pointer">
                    Priority
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36 cursor-pointer">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {priority.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.name}
                      className="cursor-pointer"
                    >
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="secondary" className="cursor-pointer">
          <Plus className="size-4" />
          Add Task
        </Button>
      </header>
      <div>
        <TaskContext
          value={{
            tasks,
            columns,
            priority,
            columnPagination,
            FetchTaskByStatus,
            FetchTaskStatuses,
            loadMoreTasks,
            setTasks,
            setColumns,
          }}
        >
          <Board />
        </TaskContext>
      </div>
    </div>
  )
}

export default Tasks
