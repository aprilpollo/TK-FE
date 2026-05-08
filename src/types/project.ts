export type ProjectStatus = {
  id: number
  name: string
  description?: string
}

export type Project = {
  id: number
  key: string
  name: string
  description?: string
  logo_url?: string
  status: ProjectStatus
  start_date: number
  end_date: number
}

export type ProjectContextType = {
  project: Project | null
  setProject: React.Dispatch<React.SetStateAction<Project | null>>
  isLoading: boolean
}

export type ChartDataItem = {
  date: string
  completed: number
  created: number
}

export interface ChartAreaInteractiveProps {
  data: ChartDataItem[]
  start: Date
  end: Date
}