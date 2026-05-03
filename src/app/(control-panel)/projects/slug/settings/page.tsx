import { Outlet, useParams } from "react-router"
import {
  SettingsNav,
  SettingsNavDropdown,
} from "@/components/project-settings/settings-nav"

function Setting() {
  const { id } = useParams()
  const basePath = `/projects/${id}/settings`

  return (
    <div className="space-y-6 px-3 py-6">
      <header className="">
        <h2 className="text-lg font-medium">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your project, manage members, and customize workflows.
        </p>
      </header>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden md:block md:w-56 md:shrink-0">
          <SettingsNav basePath={basePath} />
        </aside>
        <aside className="md:hidden">
          <SettingsNavDropdown basePath={basePath} />
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Setting
