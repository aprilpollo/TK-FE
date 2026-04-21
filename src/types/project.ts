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
  due_date?: string
  created_at: string
}

export type ProjectContextType = {
  project: Project | null
  setProject: React.Dispatch<React.SetStateAction<Project | null>>
  isLoading: boolean
}
