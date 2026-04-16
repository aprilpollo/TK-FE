import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "@/shared/Link"
import { Dot, LoaderCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/date"
import { fetchProjects, fetchProjectStatuses } from "@/api/project"
import NewProjectDialog from "@/components/new-project-dialog"

type Project = {
  id: number
  key: string
  name: string
  description?: string
  status: StatusFilter
  due_date?: string
  created_at: string
}

type StatusFilter = {
  id: number
  name: string
  description?: string
}

function Projects() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadProjectStatuses = async () => {
    try {
      const response = await fetchProjectStatuses()
      if (response.ok) {
        const data = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: StatusFilter[]
        }
        setStatusFilter(data.payload)
      } else {
        console.error("Failed to fetch project statuses:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching project statuses:", error)
    }
  }

  const loadProjects = async () => {
    try {
      setLoading(true)
      const query = new URLSearchParams()
      if (search) query.append("name_contains", search)
      if (status) query.append("status_id", status)

      const response = await fetchProjects(query.toString()) // Example query to fetch active projects
      if (response.ok) {
        const data = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Project[]
        }
        setProjects(data.payload)
      } else {
        console.error("Failed to fetch projects:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    loadProjectStatuses()
  }, [])

  useEffect(() => {
    loadProjects()
  }, [search, status])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {projects.length} projects total
          </p>
        </div>
        <NewProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreated={loadProjects}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="w-64 pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-full max-w-48 cursor-pointer capitalize">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {statusFilter.map((status) => (
                <SelectItem
                  key={status.id}
                  value={status.id.toString()}
                  className="cursor-pointer capitalize"
                >
                  {status.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead className="w-44">Status</TableHead>
            <TableHead className="w-44">Due Date</TableHead>
            <TableHead className="w-44">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading &&
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link to={`/projects/${project.key}`} className="font-medium hover:underline">{project.name}</Link>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "rounded-sm capitalize",
                      project.status.id === 1 &&
                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
                      project.status.id === 2 &&
                        "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                      project.status.id === 3 &&
                        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    )}
                  >
                    <Dot strokeWidth={10} />
                    {project.status.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{formatDate(project.due_date)}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {formatDate(project.created_at)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableCaption>
          {loading && (
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading projects...
            </div>
          )}
          {!loading && projects.length === 0 && (
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              No projects found. Try adjusting your search or filter.
            </div>
          )}
        </TableCaption>
      </Table>
    </div>
  )
}

export default Projects
