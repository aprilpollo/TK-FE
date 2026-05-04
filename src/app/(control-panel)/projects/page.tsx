import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CalendarClock, Dot, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fetchProjects, fetchProjectStatuses } from "@/api/project"
import { SkeletonProject } from "@/components/project/skeleton"
import { EmptyProject } from "@/components/project/empty"
import { getPageNumbers } from "@/utils/pagination"
import type { Project, Pagination as PaginationType, ProjectStatus } from "@/types"
import Link from "@/shared/Link"
import NewProjectDialog from "@/components/new-project-dialog"

function mockSparkData(seed: number, count = 14): number[] {
  let s = seed
  return Array.from({ length: count }, () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s % 100
  })
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120
  const h = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ")
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

const STATUS_COLOR: Record<number, string> = {
  1: "#15803d",
  2: "#0369a1",
  3: "#7e22ce",
  4: "#b91c1c",
}

function Projects() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
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
          payload: ProjectStatus[]
        }
        setStatusFilter(data.payload)
      } else {
        console.error("Failed to fetch project statuses:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching project statuses:", error)
    }
  }

  const loadProjects = async (page = 1) => {
    try {
      setLoading(true)
      const query = new URLSearchParams()
      if (search) query.append("name_contains", search)
      if (status) query.append("status_id", status)
      query.append("_page", page.toString())

      const response = await fetchProjects(query.toString())
      if (response.ok) {
        const data = (await response.json()) as {
          code: number
          error: string | null
          message: string
          pagination: PaginationType
          payload: Project[]
        }
        setProjects(data.payload)
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch projects:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadProjects(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
    setCurrentPage(1)
    loadProjects(1)
  }, [search, status])

  return (
    <div className="flex flex-col gap-6 px-3 py-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {pagination?.total ?? projects.length} projects total
          </p>
        </div>
      </div>

      <div className="sticky top-2 z-10 flex items-center gap-2 bg-background">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-44 cursor-pointer capitalize">
            <SelectValue placeholder="Status" />
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
                  <Dot
                    strokeWidth={12}
                    className={cn(
                      status.id === 1 && "text-green-700",
                      status.id === 2 && "text-sky-700",
                      status.id === 3 && "text-purple-700",
                      status.id === 4 && "text-red-700"
                    )}
                  />
                  {status.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-44 cursor-pointer capitalize">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="name" className="cursor-pointer capitalize">
                Name
              </SelectItem>
              <SelectItem
                value="recently_updated"
                className="cursor-pointer capitalize"
              >
                Recently updated
              </SelectItem>
              <SelectItem
                value="due_date"
                className="cursor-pointer capitalize"
              >
                Due date
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <NewProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreated={loadProjects}
        />
      </div>

      <main id="projects-list">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonProject key={index} />
            ))}
          </div>
        ) : (
          projects.map((project) => (
            <Link key={project.key} to={`/projects/${project.key}`}>
              <Card className="rounded-none border-b bg-background ring-0">
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-semibold">
                      <Avatar className="size-6">
                        <AvatarImage src={project.logo_url} />
                        <AvatarFallback>
                          {project.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {project.name}
                      <Badge variant="outline" className="font-medium capitalize">
                        <Dot
                          strokeWidth={12}
                          className={cn(
                            project.status.id === 1 && "text-green-700",
                            project.status.id === 2 && "text-sky-700",
                            project.status.id === 3 && "text-purple-700",
                            project.status.id === 4 && "text-red-700"
                          )}
                        />
                        {project.status.name}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                    {project.start_date && project.end_date && (
                      <span className="mt-1 flex gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="size-3.5" />
                        {format(project.start_date, "PP")} -{" "}
                        {format(project.end_date, "PP")}
                      </span>
                    )}
                  </div>
                  <Sparkline
                    data={mockSparkData(project.id)}
                    color={STATUS_COLOR[project.status.id] ?? "#15803d"}
                  />
                </div>
              </Card>
            </Link>
          ))
        )}
        {projects.length === 0 && !loading && (
          <EmptyProject
            message={(() => {
              if (status || search) {
                let msg = "No projects"
                if (status) {
                  const statusName =
                    statusFilter.find((s) => s.id.toString() === status)?.name ?? ""
                  msg += ` with status "${statusName.replace(/^\w/, (c) => c.toUpperCase())}"`
                }
                if (search) {
                  msg += status ? " and" : ""
                  msg += ` matching "${search}"`
                }
                msg += " found."
                return msg
              }
              return undefined
            })()}
            onAction={
              !status &&
              !search && (
                <Button onClick={() => setDialogOpen(true)} size="sm">
                  <Plus className="size-3" />
                  New Project
                </Button>
              )
            }
          />
        )}
        {pagination && pagination.total > pagination.limit && (
          <Pagination className="pt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                  className={cn(
                    "cursor-pointer",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {getPageNumbers(
                currentPage,
                Math.ceil(pagination.total / pagination.limit)
              ).map((page, i) =>
                page === null ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page} className="cursor-pointer">
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                  className={cn(
                    "cursor-pointer",
                    currentPage ===
                      Math.ceil(pagination.total / pagination.limit) &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  )
}

export default Projects
