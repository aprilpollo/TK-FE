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
 * MainLayout
 */
function MainLayout(props: LayoutProps) {
  const { children } = props
  const settings = useLayoutSettings()
  const config = settings.config as LayoutConfigDefaultsType
  const showNavebar = config?.navbar?.display !== false
  const showSidebar = config?.leftSidePanel?.display !== false

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        {showNavebar && <AppHeader showSidebar={showSidebar} />}
        <main className="bg-background">
          {children}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default memo(MainLayout)
