import { useState, useEffect, useCallback } from "react"
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

const PAGE_LIMIT = 20

export function AppSidebar() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
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
    const fetchInitial = async () => {
      const query = new URLSearchParams()
      if (search) query.append("name_contains", search)
      query.append("_page", "1")
      query.append("_limit", String(PAGE_LIMIT))
      const response = await fetchProjects(query.toString())
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Project[]
        pagination: { total: number; page: number; limit: number }
      }
      setProjects(data.payload ?? [])
      setTotal(data.pagination?.total ?? 0)
      setPage(1)
    }
    fetchInitial()
  }, [search, user?.permissions.organization_id])

  const loadMoreProjects = useCallback(async () => {
    if (loadingMore || projects.length >= total) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const query = new URLSearchParams()
      if (search) query.append("name_contains", search)
      query.append("_page", String(nextPage))
      query.append("_limit", String(PAGE_LIMIT))
      const response = await fetchProjects(query.toString())
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        payload: Project[]
        pagination: { total: number; page: number; limit: number }
      }
      setProjects((prev) => [...prev, ...(data.payload ?? [])])
      setTotal(data.pagination?.total ?? total)
      setPage(nextPage)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, page, projects.length, search, total])

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
              url: "/projects",
              isActive: isActive("/projects"),
            },
          ]}
        />

        <NavTasks
          tasks={projects}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          hasMore={projects.length < total}
          loadingMore={loadingMore}
          onLoadMore={loadMoreProjects}
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
