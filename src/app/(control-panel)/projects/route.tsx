import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const Projects = lazy(() => import("./projects"))

const ProjectsRoute: RouteItemType = {
  path: "projects",
  element: <Projects />,
  //auth: authRoles.user,
  auth: null,
}

export default ProjectsRoute
