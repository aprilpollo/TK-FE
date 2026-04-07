import { useLocation } from "react-router"
import { GalleryVerticalEnd, LayoutDashboard, Settings, Inbox } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMenu } from "./NavMenu"

export function AppSidebar() {
  const location = useLocation()
  const isActive = (href: string) => location.pathname === href

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            { name: "Acme Inc.", logo: GalleryVerticalEnd, plan: "Pro" },
            {
              name: "Globex Corporation",
              logo: GalleryVerticalEnd,
              plan: "Enterprise",
            },
          ]}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMenu
          label="Navigation"
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
