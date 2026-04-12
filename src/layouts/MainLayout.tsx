import { memo, type ReactNode } from "react"
import { type LayoutConfigDefaultsType } from "@/layouts/configs/LayoutConfig"
import { Outlet } from "react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { AppHeader } from "./components/AppHeader"
import { Helmet } from "react-helmet-async"
import useLayoutSettings from "@/layouts/hooks/useLayoutSettings"
import useSettings from "@/settings/hooks/useSettings"

type LayoutProps = {
  children?: ReactNode
}

/**
 * MainLayout
 */
function MainLayout(props: LayoutProps) {
  const { children } = props
  const settings = useLayoutSettings()
  const { data: currentSettings } = useSettings()
  const config = settings.config as LayoutConfigDefaultsType
  const showNavebar = config?.navbar?.display !== false
  const showSidebar = config?.leftSidePanel?.display !== false
  const pageMeta = currentSettings?.page

  return (
    <>
      <Helmet>
        <title>{pageMeta?.title ? `${pageMeta.title} | Task Manager` : "Task Manager"}</title>
        {pageMeta?.description && (
          <meta name="description" content={pageMeta.description} />
        )}
        {pageMeta?.keywords && (
          <meta name="keywords" content={pageMeta.keywords} />
        )}
      </Helmet>
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
    </>
  )
}

export default memo(MainLayout)
