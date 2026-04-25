import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import {
  CalendarSearch,
  LayoutDashboard,
  Settings,
  Inbox,
  FolderGit2,
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMenu } from "./NavMenu"
import { NavTasks } from "./NavTasks"
import { fetchProjects } from "@/api/project"
import type { Project } from "@/types"
import useUser from "@/auth/hooks/useUser"

export function AppSidebar() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const { data: user } = useUser()

  const location = useLocation()
  const isActive = (href: string) => {
    let active = location.pathname.split("/")[1]
    return `/${active}` === href
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    const FetchProjects = async () => {
      const query = new URLSearchParams()
      if (search) query.append("name_contains", search)
      const response = await fetchProjects(query.toString())
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Project[]
      }
      setProjects(data.payload)
    }
    FetchProjects()
  }, [search, user?.permissions.organization_id])

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMenu
          label="Overview"
          items={[
            {
              title: "Dashboard",
              icon: LayoutDashboard,
              url: "/dashboard",
              isActive: isActive("/dashboard"),
            },
            {
              title: "Inbox",
              icon: Inbox,
              url: "/inbox",
              isActive: isActive("/inbox"),
            },
            {
              title: "My Work",
              icon: CalendarSearch,
              url: "/mywork",
              isActive: isActive("/mywork"),
            },
            {
              title: "Projects",
              icon: FolderGit2,
              defaultOpen: true,
              url: "#",
              items: [
                {
                  title: "All Projects",
                  url: "/projects",
                  isActive: isActive("/projects"),
                },
                {
                  title: "Archived",
                  url: "/projects/archived",
                  isActive: isActive("/projects/archived"),
                },
                {
                  title: "Favorites",
                  url: "/projects/favorites",
                  isActive: isActive("/projects/favorites"),
                },
              ],
            },
          ]}
        />

        <NavTasks
          tasks={projects}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <div className="mt-auto">
          <NavMenu
            items={[
              {
                title: "Settings",
                icon: Settings,
                url: "/settings",
                isActive: isActive("/settings"),
              },
            ]}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
