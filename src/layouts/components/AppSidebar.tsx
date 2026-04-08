import { useLocation } from "react-router"
import {
  CalendarSearch,
  Hotel,
  Tags,
  LayoutDashboard,
  Settings,
  Inbox,
  Users,
  FolderGit2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMenu } from "./NavMenu"
import useUser from "@/auth/hooks/useUser"

export function AppSidebar() {
  const location = useLocation()
  const isActive = (href: string) => location.pathname === href
  const { data: user } = useUser()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <TeamSwitcher teams={user?.organization || []} />
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
          ]}
        />
        <NavMenu
          label="Management"
          items={[
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
            {
              title: "Organizations",
              icon: Hotel,
              url: "/organizations",
              isActive: isActive("/organizations"),
            },
            {
              title: "Teams",
              icon: Users,
              url: "/teams",
              isActive: isActive("/teams"),
            },
            {
              title: "Labels & Tags",
              icon: Tags,
              url: "/labels",
              isActive: isActive("/labels"),
            },
          ]}
        />
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
    </Sidebar>
  )
}
