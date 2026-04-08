import { memo, type ReactNode } from "react"
import { type LayoutConfigDefaultsType } from "@/layouts/configs/LayoutConfig"
import { Outlet } from "react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { AppHeader } from "./components/AppHeader"
import useLayoutSettings from "@/layouts/hooks/useLayoutSettings"

type LayoutProps = {
  children?: ReactNode
}

/**
 * MainLayout - Main layout with sidebar
 * Respects route config for showing/hiding sidebar
 */
function MainLayout(props: LayoutProps) {
  const { children } = props
  const settings = useLayoutSettings()
  const config = settings.config as LayoutConfigDefaultsType

  // Check if navbar (sidebar) should be displayed
  const showSidebar = config?.navbar?.display !== false

  // If sidebar is hidden, render minimal layout
  if (!showSidebar) {
    return (
      <main className="min-h-screen bg-background">
        <Outlet />
        {children}
      </main>
    )
  }

  // Full layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="bg-background">
          {children}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default memo(MainLayout)
