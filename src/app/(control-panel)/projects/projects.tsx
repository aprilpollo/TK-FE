import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type FilterType = "All" | "Active" | "Archived"

const projects = [
  {
    id: 1,
    name: "Design System",
    description: "Component library and design tokens for the product suite",
    color: "bg-purple-500",
    progress: 68,
    tasks: 42,
    status: "Active",
    statusColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    members: ["JD", "SA", "MK"],
    memberColors: ["bg-purple-500", "bg-blue-500", "bg-pink-500"],
  },
  {
    id: 2,
    name: "Mobile App",
    description: "iOS and Android app for the main product",
    color: "bg-blue-500",
    progress: 45,
    tasks: 78,
    status: "In Review",
    statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    members: ["TR", "PL", "JD"],
    memberColors: ["bg-green-500", "bg-orange-500", "bg-purple-500"],
  },
  {
    id: 3,
    name: "Backend API",
    description: "RESTful API and microservices architecture",
    color: "bg-green-500",
    progress: 82,
    tasks: 55,
    status: "Active",
    statusColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    members: ["MK", "SA", "TR"],
    memberColors: ["bg-pink-500", "bg-blue-500", "bg-green-500"],
  },
  {
    id: 4,
    name: "Marketing Website",
    description: "Public-facing marketing site and landing pages",
    color: "bg-orange-500",
    progress: 30,
    tasks: 24,
    status: "Planning",
    statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    members: ["PL", "JD", "SA"],
    memberColors: ["bg-orange-500", "bg-purple-500", "bg-blue-500"],
  },
  {
    id: 5,
    name: "Analytics Dashboard",
    description: "Internal analytics and reporting dashboard",
    color: "bg-pink-500",
    progress: 15,
    tasks: 18,
    status: "Planning",
    statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    members: ["TR", "MK", "PL"],
    memberColors: ["bg-green-500", "bg-pink-500", "bg-orange-500"],
  },
  {
    id: 6,
    name: "Legacy Migration",
    description: "Migrating legacy systems to the new architecture",
    color: "bg-gray-500",
    progress: 95,
    tasks: 63,
    status: "Archived",
    statusColor: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    members: ["JD", "TR", "MK"],
    memberColors: ["bg-purple-500", "bg-green-500", "bg-pink-500"],
  },
]

function Projects() {
  const [filter, setFilter] = useState<FilterType>("All")
  const [search, setSearch] = useState("")

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} projects total
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["All", "Active", "Archived"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <Card
            key={project.id}
            className="border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Color bar */}
            <div className={cn("h-1.5 w-full", project.color)} />
            <CardContent className="p-5">
              {/* Name + description */}
              <div className="mb-4">
                <h3 className="font-semibold text-base">{project.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", project.color)}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {project.tasks} tasks
                  </span>
                  {/* Avatar stack */}
                  <div className="flex -space-x-2">
                    {project.members.map((m, i) => (
                      <Avatar
                        key={i}
                        className="size-6 ring-2 ring-background"
                      >
                        <AvatarFallback
                          className={cn(
                            "text-[10px] font-semibold text-white",
                            project.memberColors[i]
                          )}
                        >
                          {m}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      project.statusColor
                    )}
                  >
                    {project.status}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Projects
