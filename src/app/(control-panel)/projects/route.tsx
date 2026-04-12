import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const Projects = lazy(() => import("./projects"))

const ProjectsRoute: RouteItemType = {
  path: "projects",
  element: <Projects />,
  auth: authRoles.user,
  settings:{
    page: {
      title: "Projects",
      description: "Manage your projects and tasks"
    },
  }
}

export default ProjectsRoute
