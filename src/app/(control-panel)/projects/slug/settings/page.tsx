import { Outlet, useParams } from "react-router"
import SettingsNav from "@/components/project-settings/settings-nav"
//import useProject from "@/hooks/useProject"

function Setting() {
  const { id } = useParams()
  const basePath = `/projects/${id}/settings`

  return (
    <div className="px-2 py-4">
      <header className="mb-6">
        <h1 className="mt-1 text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your project, manage members, and customize workflows.
        </p>
      </header>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <SettingsNav basePath={basePath} />
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Setting
