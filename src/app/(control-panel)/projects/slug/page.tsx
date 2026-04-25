import { useState, useEffect } from "react"
import { useLocation, useParams, Outlet, useNavigate } from "react-router"
import { fetchProjectByKey } from "@/api/project"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Archive,
  FolderArchive,
  FolderClock,
  SettingsIcon,
  SquareKanban,
} from "lucide-react"
import Link from "@/shared/Link"
import ProjectContext from "@/context/ProjectContext"
import type { Project } from "@/types"

const tabs = [
  { path: ".", label: "Overview", icon: FolderArchive },
  { path: "tasks", label: "Tasks", icon: SquareKanban },
  { path: "timeline", label: "Timeline", icon: FolderClock },
  { path: "files", label: "Files", icon: Archive },
  { path: "settings", label: "Settings", icon: SettingsIcon },
]

function Slug() {
  const { id } = useParams()
  const location = useLocation()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      try {
        const response = await fetchProjectByKey(id)
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.statusText}`)
        }
        const projectData = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Project
        }
        setProject(projectData.payload)
      } catch (error) {
        navigate("/404")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [id])

  const basePath = `/projects/${id}`
  const isTabActive = (path: string) => {
    const targetPath = path === "." ? basePath : `${basePath}/${path}`
    if (path === ".") {
      return location.pathname === targetPath || location.pathname === `${targetPath}/`
    }
    return location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-muted-foreground">Loading project...</span>
      </div>
    )
  }
  return (
    <>
      <Helmet>
        <title>
          {project?.name ? `${project.name} | Project` : "Project Details"}
        </title>
      </Helmet>
      <nav className="border-b bg-background px-2 pt-4">
        <ul className="flex items-center">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link to={tab.path}>
                <Button
                  //variant={isTabActive(tab.path) ? "secondary" : "ghost"}
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer rounded-sm"
                  aria-current={isTabActive(tab.path) ? "page" : undefined}
                >
                  <tab.icon
                    strokeWidth={2.5}
                    className={cn(
                      isTabActive(tab.path)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                  {tab.label}
                </Button>
              </Link>
              {isTabActive(tab.path) && (
                <div className="h-0.5 rounded-t bg-blue-700" />
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* <ScrollArea className="h-[calc(100vh-95px)]"> */}
        <main className="px-2">
          <ProjectContext value={{ project, setProject, isLoading }}>
            <Outlet />
          </ProjectContext>
        </main>
      {/* </ScrollArea> */}
    </>
  )
}

export default Slug
