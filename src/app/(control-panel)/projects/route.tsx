import type { RouteItemType } from "@/types"
import { Outlet } from "react-router"
import authRoles from "@/auth/roles"
import Projects from "@/app/(control-panel)/projects/page"
import Slug from "@/app/(control-panel)/projects/slug/page"
import Overview from "@/app/(control-panel)/projects/slug/overview/page"
import Tasks from "@/app/(control-panel)/projects/slug/tasks/page"
import Timeline from "@/app/(control-panel)/projects/slug/timeline/page"
import Files from "@/app/(control-panel)/projects/slug/files/page"
import Settings from "@/app/(control-panel)/projects/slug/settings/page"


const ProjectsRoute: RouteItemType = {
  path: "projects",
  element: <Outlet />,
  auth: authRoles.user,
  children: [
    {
      index: true,
      element: <Projects />,
    },
    {
      path: ":id",
      element: <Slug />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "tasks",
          element: <Tasks />,
        },
        {
          path: "timeline",
          element: <Timeline />,
        },
        {
          path: "files",
          element: <Files />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
  ],
  settings: {
    page: {
      title: "Projects",
      description: "Manage your projects and tasks",
    },
  },
}

export default ProjectsRoute
